
// Process different types of SSE events from the backend
export const processStreamEvent = (currentResponse, event) => {
  // Create a copy of the current response to avoid direct mutation
  const updatedResponse = { ...currentResponse };
  
  switch (event.type) {
    case 'chunk': 
      // Append new text chunk to existing response
      updatedResponse.text += event.data.chunk;
      break;
      
    case 'tool_use':
      // Add a new tool being used
      const toolName = event.data.name;
      const toolInput = event.data.input;
      
      // Check if this tool is already in the list
      const existingToolIndex = updatedResponse.tools.findIndex(
        tool => tool.name === toolName && JSON.stringify(tool.input) === JSON.stringify(toolInput)
      );
      
      if (existingToolIndex === -1) {
        // Add new tool if it doesn't exist
        updatedResponse.tools = [
          ...updatedResponse.tools,
          {
            name: toolName,
            input: toolInput,
            isLoading: true,
            output: null
          }
        ];
      }
      break;
      
    case 'tool_output':
      // Update the tool with its output
      const updatedTools = updatedResponse.tools.map(tool => {
        if (tool.name === event.data.name && JSON.stringify(tool.input) === JSON.stringify(event.data.input)) {
          return {
            ...tool,
            isLoading: false,
            output: event.data.output
          };
        }
        return tool;
      });
      
      updatedResponse.tools = updatedTools;
      break;
      
    case 'end':
      // Mark the response as complete
      updatedResponse.isComplete = true;
      break;
      
    case 'error':
      // Handle error events
      updatedResponse.error = event.data.message || 'An error occurred';
      updatedResponse.isComplete = true;
      break;
      
    default:
      console.warn('Unknown event type:', event.type);
  }
  
  return updatedResponse;
};
      
      updatedResponse.tools = updatedTools;
      break;
      
    case 'end':
      // Mark the response as complete
      updatedResponse.isComplete = true;
      updatedResponse.isStreaming = false;
      break;
      
    default:
      // Handle any unexpected event types
      console.warn('Unknown event type:', event.type);
  }
  
  return updatedResponse;
};
