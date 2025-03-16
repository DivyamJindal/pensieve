import React, { useState } from 'react';
import CourseCard from './CourseCard';

function HomePage() {
  // Sample course data (in a real app, this would come from an API)
  const [courses, setCourses] = useState([
    {
      id: 1,
      code: 'CS101',
      title: 'Introduction to Computer Science',
      description: 'Learn the fundamentals of computer science and programming.',
      instructor: 'Dr. Jane Smith'
    },
    {
      id: 2,
      code: 'MATH202',
      title: 'Advanced Calculus',
      description: 'Explore advanced topics in calculus including multivariable calculus.',
      instructor: 'Prof. John Davis'
    },
    {
      id: 3,
      code: 'ENG105',
      title: 'Academic Writing',
      description: 'Develop skills in academic writing and critical analysis.',
      instructor: 'Dr. Emily Johnson'
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300">
          Add New Course
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;