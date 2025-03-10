
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
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { processStreamEvent } from '../utils/eventProcessing';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null);

  // Initialize session ID on component mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem('sessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem('sessionId', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    // Create initial assistant message
    const assistantMessageId = uuidv4();
    const initialAssistantMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: {
        text: '',
        tools: [],
        isComplete: false
      },
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, initialAssistantMessage]);
    
    try {
      // Close any existing event source
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      
      // Make API request to backend
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: content,
          session_id: sessionId
        })
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      // Set up event source for SSE
      const eventSource = new EventSource(`http://localhost:8000/query?session_id=${sessionId}&query=${encodeURIComponent(content)}`, { withCredentials: true });
      eventSourceRef.current = eventSource;
      
      // Initialize current assistant response
      let currentResponse = {
        text: '',
        tools: [],
        isComplete: false
      };
      
      // Handle incoming events
      eventSource.onmessage = (event) => {
        try {
          const parsedEvent = JSON.parse(event.data);
          const updatedResponse = processStreamEvent(currentResponse, parsedEvent);
          
          // Update current response
          currentResponse = updatedResponse;
          
          // Update message in state
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessageId
                ? { ...msg, content: updatedResponse }
                : msg
            )
          );
          
          // Check if response is complete
          if (updatedResponse.isComplete) {
            eventSource.close();
            setIsLoading(false);
          }
          
          // Check for errors
          if (updatedResponse.error) {
            setError(updatedResponse.error);
            eventSource.close();
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error processing event:', error);
          setError('Error processing response');
          eventSource.close();
          setIsLoading(false);
        }
      };
      
      // Handle errors
      eventSource.onerror = (error) => {
        console.error('EventSource error:', error);
        setError('Connection error. Please try again.');
        eventSource.close();
        setIsLoading(false);
      };
      
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message || 'An error occurred. Please try again.');
      setIsLoading(false);
      
      // Update assistant message with error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessageId
            ? { 
                ...msg, 
                content: { 
                  text: 'Sorry, I encountered an error. Please try again later.', 
                  tools: [],
                  isComplete: true,
                  error: error.message 
                } 
              }
            : msg
        )
      );
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-semibold">SuperCar Virtual Sales Assistant</h1>
        <p className="text-sm opacity-80">Chat with Lex about our latest car models and schedule a test drive</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      <MessageList messages={messages} />
      
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatInterface;
