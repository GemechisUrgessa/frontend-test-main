
import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { processStreamEvent } from '../utils/eventProcessing';

const ChatInterface = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState(null);
  const eventSourceRef = useRef(null);

  // Function to handle user message submission
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message to the chat
    const userMessage = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    
    // Initialize a new response object
    const newResponse = {
      id: Date.now() + 1,
      text: '',
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      tools: [],
      isComplete: false,
      isStreaming: true,
    };
    
    setCurrentResponse(newResponse);

    try {
      // Close any existing event source
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Create a new EventSource for SSE
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: text,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // Process the stream
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const eventData = JSON.parse(line.substring(5).trim());
            setCurrentResponse(prev => {
              if (!prev) return null;
              return processStreamEvent(prev, eventData);
            });
          }
        }
      }
      
      // Mark response as complete when stream ends
      setCurrentResponse(prev => {
        if (!prev) return null;
        return { ...prev, isComplete: true, isStreaming: false };
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      setMessages(prevMessages => [...prevMessages, {
        id: Date.now() + 2,
        text: 'Sorry, there was an error processing your request. Please try again.',
        sender: 'system',
        timestamp: new Date().toISOString(),
      }]);
      
      setCurrentResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Add complete responses to the message list
  useEffect(() => {
    if (currentResponse && currentResponse.isComplete) {
      setMessages(prevMessages => [...prevMessages, currentResponse]);
      setCurrentResponse(null);
    }
  }, [currentResponse]);

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages} 
          currentResponse={currentResponse}
        />
      </div>
      <MessageInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default ChatInterface;
