/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { processStreamEvent } from "../utils/eventProcessing";
import { v4 as uuidv4 } from "uuid";
import { mergeChunkData } from "../utils/mergeChunkData";
import { appendWithSmartSpacing } from "../utils/appendWithSmartSpacing";

export interface Tool {
  name: string;
  input: any;
  isLoading: boolean;
  output: any | null;
}

export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  tools?: Tool[];
  isComplete?: boolean;
  isStreaming?: boolean;
  error?: string;
}

interface ChatInterfaceProps {
  sessionId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  sessionId: initialSessionId,
}) => {
  const [sessionId, setSessionId] = useState(initialSessionId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<Message | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!sessionId) {
      const newSessionId = uuidv4();
      localStorage.setItem("sessionId", newSessionId);
      setSessionId(newSessionId);
    }
  }, [sessionId]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      text,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const newResponse: Message = {
      id: uuidv4(),
      text: "",
      sender: "assistant",
      timestamp: new Date().toISOString(),
      tools: [],
      isComplete: false,
      isStreaming: true,
    };
    setCurrentResponse(newResponse);

    try {
      const response = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, session_id: sessionId }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      if (!response.body) throw new Error("Response body is null");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const rawChunk = decoder.decode(value);
        const eventBlocks = rawChunk
          .replace(/\r\n/g, "\n")
          .split("\n\n")
          .filter((block) => block.trim() !== "");

        eventBlocks.forEach((block) => {
          const lines = block.split("\n").filter((ln) => ln.trim() !== "");
          let eventType: string | undefined;
          const dataLines: string[] = [];

          for (const line of lines) {
            if (line.startsWith("event:")) {
              eventType = line.slice("event:".length).trim();
            } else if (line.startsWith("data:")) {
              dataLines.push(line.slice("data:".length));
            }
          }

          if (eventType) {
            if (eventType === "chunk") {
              const mergedText = mergeChunkData(dataLines);
              if (mergedText.trim() !== "") {
                setCurrentResponse((prev) => {
                  if (!prev) return null;
                  return {
                    ...prev,
                    text: appendWithSmartSpacing(prev.text, mergedText),
                  };
                });
              }
            } else if (
              eventType === "tool_use" ||
              eventType === "tool_output"
            ) {
              // ... handle these tool events as JSON or raw text ...
            }
            // ... handle other event types like "end", "error" ...
          } else {
            const mergedText = mergeChunkData(dataLines);
            if (mergedText.trim() !== "") {
              setCurrentResponse((prev) => {
                if (!prev) return null;
                return {
                  ...prev,
                  text: appendWithSmartSpacing(prev.text, mergedText),
                };
              });
            }
          }
        });
      }

      setCurrentResponse((prev) => {
        if (!prev) return null;
        return { ...prev, isComplete: true, isStreaming: false };
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          text: "Sorry, there was an error processing your request. Please try again.",
          sender: "system",
          timestamp: new Date().toISOString(),
        },
      ]);
      setCurrentResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentResponse && currentResponse.isComplete) {
      setMessages((prev) => [...prev, currentResponse]);
      setCurrentResponse(null);
    }
  }, [currentResponse]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <main className="flex-1 p-4 overflow-auto">
        <MessageList messages={messages} currentResponse={currentResponse} />
      </main>
      <footer className="p-4">
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
};

export default ChatInterface;
