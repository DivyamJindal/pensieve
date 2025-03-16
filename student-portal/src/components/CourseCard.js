import React from 'react';
import { Link } from 'react-router-dom';

function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="h-40 bg-blue-500 flex items-center justify-center">
        <h3 className="text-white text-xl font-bold">{course.code}</h3>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{course.instructor}</span>
          <Link 
            to={`/courses/${course.id}`} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;