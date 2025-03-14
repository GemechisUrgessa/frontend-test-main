/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface DealershipAddressProps {
  data: any;
}

const DealershipAddress: React.FC<DealershipAddressProps> = ({ data }) => {
  let addressInfo = data;
  try {
    if (typeof data === "string" && data.includes("```")) {
      addressInfo = data.replace(/```/g, "").trim();
    }
  } catch (error) {
    console.error("Error parsing dealership address:", error);
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200 shadow-sm">
      <div className="flex items-center">
        <svg
          className="w-8 h-8 mr-3 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-green-700">
          Dealership Address
        </h3>
      </div>
      <div className="mt-3">
        <p className="text-green-800">{addressInfo}</p>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(addressInfo)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-2 text-sm font-medium text-green-600 hover:text-green-800"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          View on Maps
        </a>
      </div>
    </div>
  );
};

export default DealershipAddress;
