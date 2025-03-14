import { useEffect, useState } from "react";
import ChatInterface from "./components/ChatInterface";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

function App() {
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const storedSessionId = localStorage.getItem("sessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem("sessionId", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-3xl font-bold text-center py-4 bg-red-600 text-white">
          SuperCar Virtual Sales Assistant
        </h1>
      </header>
      <main className="App-main">
        {sessionId && <ChatInterface sessionId={sessionId} />}
      </main>
      <footer className="App-footer">
        <p className="text-center text-gray-500 py-4">
          &copy; 2023 SuperCar Dealerships
        </p>
      </footer>
    </div>
  );
}

export default App;
