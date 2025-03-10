
import React from 'react';
import WeatherDisplay from './tools/WeatherDisplay';
import DealershipAddress from './tools/DealershipAddress';
import AppointmentAvailability from './tools/AppointmentAvailability';
import AppointmentConfirmation from './tools/AppointmentConfirmation';

const ToolOutput = ({ tool, isLoading }) => {
  // Early return for tools that are still loading
  if (isLoading) {
    return (
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center">
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-500 mr-3"></div>
        <span className="text-gray-600">Using tool: {tool.name}...</span>
      </div>
    );
  }

  // Return appropriate component based on tool type
  const renderToolOutput = () => {
    try {
      switch (tool.name) {
        case 'get_weather':
          return <WeatherDisplay data={tool.output} />;
        
        case 'get_dealership_address':
          return <DealershipAddress data={tool.output} />;
        
        case 'check_appointment_availability':
          return <AppointmentAvailability data={tool.output} />;
        
        case 'schedule_appointment':
          return <AppointmentConfirmation data={tool.output} />;
        
        default:
          // Generic display for unknown tools
          return (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-1">Tool: {tool.name}</h4>
              <pre className="text-sm whitespace-pre-wrap break-words bg-gray-100 p-2 rounded">
                {typeof tool.output === 'string' ? tool.output : JSON.stringify(tool.output, null, 2)}
              </pre>
            </div>
          );
      }
    } catch (error) {
      console.error('Error rendering tool output:', error);
      return (
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <h4 className="font-medium text-red-700 mb-1">Error displaying tool result</h4>
          <p className="text-sm text-red-600">There was an error processing the tool output.</p>
        </div>
      );
    }
  };

  return renderToolOutput();
};

export default ToolOutput;
