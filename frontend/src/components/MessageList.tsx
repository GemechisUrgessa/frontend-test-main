import React, { useEffect, useRef } from "react";
import MessageComponent from "./Message";
import ToolOutput from "./ToolOutput";
import { Message } from "./ChatInterface";

interface MessageListProps {
  messages: Message[];
  currentResponse?: Message | null;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentResponse,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentResponse]);

  const allMessages = currentResponse
    ? [...messages, currentResponse]
    : messages;

  return (
    <div className="space-y-4">
      {allMessages.map((msg) => (
        <div
          key={msg.id}
          className={`p-4 rounded ${
            msg.sender === "user" ? "bg-blue-100" : "bg-white shadow"
          }`}
        >
          <MessageComponent message={msg} />
          {msg.tools && msg.tools.length > 0 && (
            <div className="mt-2">
              {msg.tools.map((tool, idx) => (
                <ToolOutput key={idx} tool={tool} isLoading={tool.isLoading} />
              ))}
            </div>
          )}
        </div>
      ))}
      {!currentResponse &&
        messages.length > 0 &&
        messages[messages.length - 1].sender === "user" && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-pulse flex space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            </div>
            <span>Lex is typing...</span>
          </div>
        )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
