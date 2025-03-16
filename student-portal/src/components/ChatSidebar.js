import React, { useState } from 'react';

function ChatSidebar({ isOpen, toggleChat, context }) {
  const [messages, setMessages] = useState([
    { id: 1, text: context?.type === 'assignment' 
      ? `I can help you understand the feedback for your ${context.title} assignment. Feel free to ask questions about specific comments or areas for improvement.`
      : 'Hello! How can I help you with your studies today?', 
      sender: 'ai' 
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = { id: messages.length + 1, text: newMessage, sender: 'user' };
    setMessages([...messages, userMessage]);
    setNewMessage('');

    // Simulate AI response with context-aware replies
    setTimeout(() => {
      const aiResponse = { 
        id: messages.length + 2, 
        text: context?.type === 'assignment'
          ? 'I can help explain the feedback in detail or suggest ways to improve your work. What specific part would you like to discuss?'
          : 'I\'m your AI study assistant. I can help answer questions about your courses or assignments.',
        sender: 'ai' 
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full">
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold">AI Study Assistant</h3>
          <button onClick={toggleChat} className="text-white hover:text-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSendMessage} className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatSidebar;