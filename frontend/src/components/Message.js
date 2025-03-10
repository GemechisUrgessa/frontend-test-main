
import React from 'react';

const Message = ({ message }) => {
  const { sender, text, timestamp, isStreaming } = message;
  
  // Format the timestamp
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Determine message styling based on sender
  const isUser = sender === 'user';
  const isAssistant = sender === 'assistant';
  const isSystem = sender === 'system';

  const messageClasses = `p-3 rounded-lg max-w-[80%] ${
    isUser 
      ? 'bg-blue-500 text-white ml-auto rounded-br-none' 
      : isAssistant 
        ? 'bg-gray-100 text-gray-800 mr-auto rounded-bl-none'
        : 'bg-red-100 text-red-800 mx-auto text-center'
  }`;

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={messageClasses}>
        <p className="text-sm font-medium mb-1">
          {isUser ? 'You' : isAssistant ? 'Lex' : 'System'}
        </p>
        <p className="whitespace-pre-wrap">{text}</p>
        
        {/* Show typing indicator for streaming assistant messages */}
        {isAssistant && isStreaming && (
          <div className="typing-indicator-small mt-1">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        
        <p className="text-xs opacity-70 text-right mt-1">{formattedTime}</p>
      </div>
    </div>
  );
};

export default Message;
import React from 'react';
import ToolOutput from './ToolOutput';

const Message = ({ message }) => {
  const { role, content, timestamp } = message;
  const isAssistant = role === 'assistant';
  
  // Format timestamp
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[80%] ${isAssistant ? 'bg-gray-100' : 'bg-blue-500 text-white'} p-3 rounded-lg`}>
        {isAssistant ? (
          <div>
            {content.text && <div className="whitespace-pre-wrap">{content.text}</div>}
            
            {content.tools && content.tools.length > 0 && (
              <div className="mt-2">
                {content.tools.map((tool, index) => (
                  <ToolOutput key={index} tool={tool} />
                ))}
              </div>
            )}
            
            {content.error && (
              <div className="text-red-500 mt-2">
                Error: {content.error}
              </div>
            )}
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{content}</div>
        )}
        
        <div className={`text-xs mt-1 text-right ${isAssistant ? 'text-gray-500' : 'text-blue-200'}`}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default Message;
