import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">
            <Link to="/" className="flex items-center">
              <span>Student Portal</span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-200 transition duration-300">Home</Link>
            <Link to="/courses" className="hover:text-blue-200 transition duration-300">Courses</Link>
            <Link to="/assignments" className="hover:text-blue-200 transition duration-300">Assignments</Link>
          </div>
          <div>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition duration-300">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;