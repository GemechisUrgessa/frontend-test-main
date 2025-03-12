/* eslint-disable @typescript-eslint/no-explicit-any */

import { Message, Tool } from "../components/ChatInterface";

interface SSEEvent {
  type: string;
  data: any;
}

export const processStreamEvent = (currentResponse: Message, event: SSEEvent): Message => {
  const updatedResponse = { ...currentResponse };

  switch (event.type) {
    case "chunk":
      if (typeof event.data === "string" && event.data.trim()) {
        updatedResponse.text += event.data;
      }
      break;
    case "tool_use": {
      // Trim the tool name to avoid whitespace mismatches
      let name: string;
      let input: any;
      if (typeof event.data === "string") {
        name = event.data.trim();
        input = {};
      } else if (typeof event.data === "object") {
        name = (event.data.name || "").toString().trim();
        input = event.data.input || {};
      } else {
        console.warn("Invalid tool_use data:", event.data);
        break;
      }
      const exists = updatedResponse.tools?.some(
        (tool) =>
          tool.name.trim() === name && JSON.stringify(tool.input) === JSON.stringify(input)
      );
      if (!exists) {
        updatedResponse.tools = [
          ...(updatedResponse.tools || []),
          { name, input, isLoading: true, output: null },
        ];
      }
      break;
    }
    case "tool_output": {
      let name: string;
      let input: any;
      let output: any;
      if (typeof event.data === "object") {
        name = (event.data.name || "").toString().trim();
        output = event.data.output;
        input = event.data.input || {};
      } else {
        console.warn("Invalid tool_output data:", event.data);
        break;
      }
      updatedResponse.tools = (updatedResponse.tools || []).map((tool: Tool) => {
        // Trim the tool name when comparing
        if (
          tool.name.trim() === name &&
          JSON.stringify(tool.input) === JSON.stringify(input)
        ) {
          return { ...tool, isLoading: false, output };
        }
        return tool;
      });
      break;
    }
    case "end":
      updatedResponse.isComplete = true;
      updatedResponse.isStreaming = false;
      break;
    case "error":
      updatedResponse.error = event.data.message || "An error occurred.";
      updatedResponse.isComplete = true;
      break;
    default:
      console.warn("Unknown event type:", event.type);
  }
  return updatedResponse;
};