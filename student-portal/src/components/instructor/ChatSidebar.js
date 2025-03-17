import React, { useState, useRef } from 'react';
import { FiUpload, FiSend, FiX } from 'react-icons/fi';

function ChatSidebar() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && files.length === 0) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('message', newMessage);
    files.forEach(file => formData.append('files', file));

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      setMessages(prev => [...prev, 
        { type: 'user', content: newMessage, files: files.map(f => f.name) },
        { type: 'assistant', content: data.response }
      ]);

      setNewMessage('');
      setFiles([]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-96 h-full border-l border-gray-200 bg-white flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Chat Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${message.type === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
            >
              <p>{message.content}</p>
              {message.files && message.files.length > 0 && (
                <div className="mt-2 text-sm">
                  <p className="font-medium">Attached files:</p>
                  <ul className="list-disc list-inside">
                    {message.files.map((file, i) => (
                      <li key={i}>{file}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        {files.length > 0 && (
          <div className="mb-4 space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm truncate">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => fileInputRef.current.click()}
              className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg border"
              title="Upload files"
            >
              <FiUpload />
            </button>
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className={`p-2 text-white rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              title="Send message"
            >
              <FiSend />
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            multiple
          />
        </div>
      </div>
    </div>
  );
}

export default ChatSidebar;