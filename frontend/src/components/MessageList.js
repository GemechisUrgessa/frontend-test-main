
import React, { useEffect, useRef } from 'react';
import Message from './Message';
import ToolOutput from './ToolOutput';

const MessageList = ({ messages, currentResponse }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  // Combine complete messages with the current streaming response
  const allMessages = currentResponse 
    ? [...messages, currentResponse] 
    : messages;

  return (
    <div className="p-4 overflow-y-auto h-full">
      {allMessages.map((message) => (
        <div key={message.id} className="mb-4">
          <Message message={message} />
          
          {/* Render any tools used in this message */}
          {message.tools && message.tools.length > 0 && (
            <div className="ml-12 mt-2">
              {message.tools.map((tool, index) => (
                <ToolOutput 
                  key={index} 
                  tool={tool} 
                  isLoading={tool.isLoading} 
                />
              ))}
            </div>
          )}
        </div>
      ))}
      
      {/* Loading indicator for when waiting for first response */}
      {!currentResponse && messages.length > 0 && 
       messages[messages.length - 1].sender === 'user' && (
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>Lex is typing...</span>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
import React, { useEffect, useRef } from 'react';
import Message from './Message';

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <div className="text-xl mb-2">👋 Welcome to SuperCar Assistant</div>
          <p className="text-center max-w-md">
            I'm Lex, your virtual sales assistant. Ask me about our vehicles, 
            dealership locations, or schedule a test drive!
          </p>
        </div>
      ) : (
        <>
          {messages.map(message => (
            <Message key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageList;
