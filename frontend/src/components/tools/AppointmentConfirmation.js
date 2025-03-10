
import React from 'react';

const AppointmentConfirmation = ({ data }) => {
  // Parse the confirmation data
  let confirmationData = {};
  try {
    if (typeof data === 'string') {
      // Clean up the string and try to extract the JSON object
      const cleanData = data.replace(/```/g, '').trim();
      try {
        confirmationData = JSON.parse(cleanData);
      } catch {
        // If the entire string isn't valid JSON, try to extract a JSON object
        const match = cleanData.match(/{[^]*}/);
        if (match && match[0]) {
          confirmationData = JSON.parse(match[0]);
        }
      }
    } else if (typeof data === 'object') {
      confirmationData = data;
    }
  } catch (error) {
    console.error('Error parsing appointment confirmation:', error);
    // Fallback to showing a generic message
    confirmationData = { mensaje: 'Appointment confirmed successfully' };
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200 shadow-sm">
      <div className="flex items-center">
        <svg className="w-8 h-8 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-green-700">Appointment Confirmed!</h3>
      </div>
      
      <div className="mt-3 bg-white p-3 rounded border border-green-200">
        {Object.keys(confirmationData).length > 0 ? (
          <div className="space-y-2">
            {confirmationData.confirmacion_id && (
              <p className="text-gray-700">
                <span className="font-medium">Confirmation ID:</span> {confirmationData.confirmacion_id}
              </p>
            )}
            
            {confirmationData.fecha && (
              <p className="text-gray-700">
                <span className="font-medium">Date:</span> {confirmationData.fecha}
              </p>
            )}
            
            {confirmationData.hora && (
              <p className="text-gray-700">
                <span className="font-medium">Time:</span> {confirmationData.hora}
              </p>
            )}
            
            {confirmationData.modelo && (
              <p className="text-gray-700">
                <span className="font-medium">Car Model:</span> {confirmationData.modelo}
              </p>
            )}
            
            {confirmationData.mensaje && (
              <p className="text-green-600 font-medium mt-2">{confirmationData.mensaje}</p>
            )}
          </div>
        ) : (
          <p className="text-green-600">Your appointment has been confirmed successfully!</p>
        )}
      </div>
      
      <div className="mt-3 text-center">
        <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors">
          Add to Calendar
        </button>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;
