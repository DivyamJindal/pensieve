import React from 'react';
import { Link } from 'react-router-dom';

function InstructorCourseCard({ course }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="h-40 bg-indigo-600 flex items-center justify-center">
        <h3 className="text-white text-xl font-bold">{course.code}</h3>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{course.enrolledStudents} Students</span>
            <Link 
              to={`/instructor/courses/${course.id}`} 
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Manage Course
            </Link>
          </div>
          <div className="flex justify-between items-center">
            <button 
              className="text-red-600 hover:text-red-800 text-sm font-medium"
              onClick={() => console.log('Delete course:', course.id)}
            >
              Delete Course
            </button>
            <button 
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              onClick={() => console.log('Edit course:', course.id)}
            >
              Edit Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorCourseCard;