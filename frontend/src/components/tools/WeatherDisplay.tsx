/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface WeatherDisplayProps {
  data: any;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ data }) => {
  let weatherInfo = data;
  try {
    if (typeof data === "string" && data.includes("```")) {
      weatherInfo = data.replace(/```/g, "").trim();
    }
  } catch (error) {
    console.error("Error parsing weather data:", error);
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 shadow-sm">
      <div className="flex items-center">
        <svg
          className="w-8 h-8 mr-3 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 15a4 4 0 004 4h9a5 5 0 10-4.5-8.5"
          />
        </svg>
        <h3 className="text-lg font-semibold text-blue-700">
          Weather Information
        </h3>
      </div>
      <div className="mt-3">
        <p className="text-blue-800">{weatherInfo}</p>
      </div>
    </div>
  );
};

export default WeatherDisplay;
