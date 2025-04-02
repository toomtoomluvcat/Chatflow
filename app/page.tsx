"use client"

import { useState, useEffect, ChangeEvent } from 'react';

export default function LiveTypingChat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [text, setText] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [userName, setUserName] = useState('John');

  useEffect(() => {
    const websocket = new WebSocket('http://localhost:8080/ws');
    
    websocket.onopen = () => {
      setConnected(true);
    };
    
    websocket.onmessage = (event) => {
      setMessages(prev => [event.data]);
    };
    
    websocket.onclose = () => {
      setConnected(false);
    };
    
    setWs(websocket);
    
    return () => {
      websocket.close();
    };
  }, []);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    if (ws && connected) {
      ws.send(newText);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4">
        <button className="w-8 h-8 bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
          <span className="text-gray-600">✕</span>
        </button>
        <button className="w-8 h-8 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-gray-600">+</span>
        </button>
        <button className="w-8 h-8 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-gray-600">⚲</span>
        </button>
        <button className="w-8 h-8 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-gray-600">⌂</span>
        </button>
        <button className="w-8 h-8 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-gray-600">□</span>
        </button>
        <button className="w-8 h-8 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-gray-600">◷</span>
        </button>
        <div className="flex-grow"></div>
        <button className="w-8 h-8 bg-gray-100 rounded-full mb-4 flex items-center justify-center">
          <span className="text-gray-600">⚙</span>
        </button>
        <div className="w-8 h-8 bg-purple-500 rounded-full overflow-hidden">
          <img src="/api/placeholder/32/32" alt="avatar" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4">
        {/* Welcome header */}
        <div className="py-12 text-center">
          <h1 className="text-3xl font-bold">
            Hi there, <span className="text-purple-600">{userName}</span>
          </h1>
          <h2 className="text-2xl text-purple-600 mb-2">What would like to know?</h2>
          <p className="text-gray-500 text-sm mb-8">
            Use one of the most common prompts below or use your own to begin
          </p>

          {/* Prompt suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="mb-2">Write a to-do list for a personal project or task</div>
              <div className="flex justify-center">
                <span className="text-gray-400">👤</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="mb-2">Generate an email to reply to a job offer</div>
              <div className="flex justify-center">
                <span className="text-gray-400">✉</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="mb-2">Summarise this article or text for me in one paragraph</div>
              <div className="flex justify-center">
                <span className="text-gray-400">📄</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="mb-2">How does AI work in a technical capacity</div>
              <div className="flex justify-center">
                <span className="text-gray-400">🔧</span>
              </div>
            </div>
          </div>

          {/* Refresh prompts button */}
          <button className="flex items-center mx-auto text-gray-500 text-sm">
            <span className="mr-1">↻</span> Refresh Prompts
          </button>
        </div>

        {/* Message display area */}
        <div className="flex-1">
          {messages.map((msg, index) => (
            <div key={index} className="mb-4">
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 inline-block">
                {msg}
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="py-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <input
              value={text}
              onChange={handleInputChange}
              type="text"
              placeholder="Ask whatever you want...."
              className="w-full p-2 outline-none"
            />
            <div className="flex justify-between items-center px-2 pt-2">
              <div className="flex space-x-2">
                <button className="text-gray-400">📎</button>
                <button className="text-gray-400">🖼️</button>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-400 mr-2">0/1000</span>
                <button className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}