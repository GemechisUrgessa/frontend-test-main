
import React from 'react';

const WeatherDisplay = ({ data }) => {
  // Parse the weather data
  let weatherInfo = data;
  try {
    // Check if data is wrapped in code blocks (``` ```)
    if (typeof data === 'string' && data.includes('```')) {
      weatherInfo = data.replace(/```/g, '').trim();
    }
  } catch (error) {
    console.error('Error parsing weather data:', error);
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 shadow-sm">
      <div className="flex items-center">
        <svg className="w-8 h-8 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-4.5-8.5" />
        </svg>
        <h3 className="text-lg font-semibold text-blue-700">Weather Information</h3>
      </div>
      <div className="mt-3">
        <p className="text-blue-800">{weatherInfo}</p>
      </div>
    </div>
  );
};

export default WeatherDisplay;
import React from 'react';

const WeatherDisplay = ({ data }) => {
  if (!data) return null;
  
  const { city, temperature, conditions } = data;
  
  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-lg shadow-sm my-2">
      <h3 className="font-medium text-lg text-blue-800 mb-2">Weather in {city}</h3>
      <div className="flex items-center">
        <div className="text-3xl font-bold text-blue-700">{temperature}°F</div>
        <div className="ml-4">
          <div className="text-blue-600">{conditions}</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
