
# SuperCar Virtual Sales Assistant - Frontend

This is the frontend application for the SuperCar Virtual Sales Assistant, a chat interface that interacts with an AI agent through a backend API.

## Features

- Chat interface for communicating with the AI assistant
- Real-time streaming of AI responses
- Custom UI components for different tool outputs:
  - Weather information
  - Dealership address
  - Appointment availability (time slots)
  - Appointment confirmation
- Responsive design for desktop and mobile devices
- Session management for conversation continuity

## Tech Stack

- React.js
- Tailwind CSS
- ESS (Server-Sent Events) for real-time communication

## Running the Application

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Docker (optional)

### Development

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000.

### Using Docker

To run the application using Docker:

```bash
cd frontend
docker build -t supercar-assistant-frontend .
docker run -p 3000:3000 supercar-assistant-frontend
```

### Using Docker Compose

To run both the frontend and backend:

```bash
cd infrastructure
docker-compose up
```

## Implementation Details

- The application maintains a session ID for conversation persistence
- Messages are displayed in real-time as they stream from the backend
- Each tool output has a custom UI component for better visualization
- The UI shows loading indicators when tools are being used
- The design is responsive and works on all device sizes
