import React from "react";

interface MessageProps {
  message: {
    sender: string;
    text: string;
    timestamp: string;
    isStreaming?: boolean;
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { sender, text, timestamp, isStreaming } = message;

  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isUser = sender === "user";
  const isAssistant = sender === "assistant";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isSystem = sender === "system";

  const messageClasses = `p-3 rounded-lg max-w-[80%] ${
    isUser
      ? "bg-blue-500 text-white ml-auto rounded-br-none"
      : isAssistant
      ? "bg-gray-100 text-gray-800 mr-auto rounded-bl-none"
      : "bg-red-100 text-red-800 mx-auto text-center"
  }`;

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div className={messageClasses}>
        <p className="text-sm font-medium mb-1">
          {isUser ? "You" : isAssistant ? "Lex" : "System"}
        </p>
        <p className="whitespace-pre-wrap">
          {text}
          {isAssistant && isStreaming && (
            <span className="ml-1 animate-pulse text-gray-600">...</span>
          )}
        </p>
        <p className="text-xs opacity-70 text-right mt-1">{formattedTime}</p>
      </div>
    </div>
  );
};

export default Message;
