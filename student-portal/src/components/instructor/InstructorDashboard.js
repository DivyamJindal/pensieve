import React, { useState } from 'react';
import InstructorCourseCard from './InstructorCourseCard';
import CreateCourseForm from './CreateCourseForm';

function InstructorDashboard() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [courses, setCourses] = useState([
    {
      id: 1,
      code: 'CS101',
      title: 'Introduction to Computer Science',
      description: 'Learn the fundamentals of computer science and programming.',
      enrolledStudents: 45
    },
    {
      id: 2,
      code: 'CS201',
      title: 'Data Structures and Algorithms',
      description: 'Advanced programming concepts and problem-solving techniques.',
      enrolledStudents: 32
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
          onClick={() => setShowCreateForm(true)}
        >
          Create New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <InstructorCourseCard key={course.id} course={course} />
        ))}
      </div>

      {showCreateForm && (
        <CreateCourseForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={(newCourse) => {
            setCourses([...courses, newCourse]);
            setShowCreateForm(false);
          }}
        />
      )}
    </div>
  );
}

export default InstructorDashboard;