
import React from 'react';

const AppointmentAvailability = ({ data }) => {
  // Parse the availability data
  let availableTimes = [];
  try {
    // Check if data is wrapped in code blocks (``` ```)
    if (typeof data === 'string') {
      // Clean up the string and try to extract the JSON array
      const cleanData = data.replace(/```/g, '').trim();
      if (cleanData.startsWith('[') && cleanData.endsWith(']')) {
        availableTimes = JSON.parse(cleanData);
      } else {
        // Try to extract a potential array from a JSON string
        const match = cleanData.match(/\[(.*)\]/);
        if (match && match[0]) {
          availableTimes = JSON.parse(match[0]);
        } else {
          // If not parseable as JSON, split by commas
          availableTimes = cleanData.split(',').map(time => time.trim());
        }
      }
    } else if (Array.isArray(data)) {
      availableTimes = data;
    }
  } catch (error) {
    console.error('Error parsing appointment availability:', error);
    // Fallback to showing the raw data
    availableTimes = [String(data)];
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200 shadow-sm">
      <div className="flex items-center">
        <svg className="w-8 h-8 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-lg font-semibold text-purple-700">Available Appointment Times</h3>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
        {Array.isArray(availableTimes) && availableTimes.length > 0 ? (
          availableTimes.map((time, index) => (
            <div
              key={index}
              className="bg-white p-2 rounded border border-purple-200 text-center cursor-pointer hover:bg-purple-200 transition-colors"
            >
              <span className="text-purple-800 font-medium">{time}</span>
            </div>
          ))
        ) : (
          <p className="text-purple-800 col-span-full">No available times found.</p>
        )}
      </div>
    </div>
  );
};

export default AppointmentAvailability;
