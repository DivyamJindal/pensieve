import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import CourseDetail from './components/CourseDetail';
import ChatSidebar from './components/ChatSidebar';
import InstructorDashboard from './components/instructor/InstructorDashboard';
import InstructorCourseDetail from './components/instructor/InstructorCourseDetail';
import AssignmentGradingPage from './components/instructor/AssignmentGradingPage';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <Router>
      <div className="App min-h-screen bg-gray-100">
        <Navbar />
        <main className="pb-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route path="/instructor/courses/:courseId" element={<InstructorCourseDetail />} />
            <Route path="/instructor/assignments/:assignmentId/grade" element={<AssignmentGradingPage />} />
          </Routes>
        </main>
        
        {/* Chat toggle button */}
        <button 
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 z-40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
        
        {/* Chat sidebar */}
        <ChatSidebar isOpen={isChatOpen} toggleChat={toggleChat} />
      </div>
    </Router>
  );
}

export default App;
