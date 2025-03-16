import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function InstructorCourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('students');

  // Sample data (in a real app, this would come from an API)
  useEffect(() => {
    const fetchCourse = () => {
      const mockCourse = {
        id: parseInt(courseId),
        code: 'CS101',
        title: 'Introduction to Computer Science',
        description: 'Learn the fundamentals of computer science and programming.',
        students: [
          { id: 1, name: 'John Doe', email: 'john@example.com', progress: 75 },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', progress: 90 },
        ],
        assignments: [
          { id: 1, title: 'Programming Basics', dueDate: '2023-10-15', submissions: 15 },
          { id: 2, title: 'Data Structures', dueDate: '2023-11-01', submissions: 12 },
        ],
        materials: [
          { id: 1, title: 'Lecture Notes Week 1', type: 'pdf' },
          { id: 2, title: 'Coding Examples', type: 'zip' },
        ]
      };
      setCourse(mockCourse);
    };

    fetchCourse();
  }, [courseId]);

  if (!course) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/instructor" className="text-indigo-600 hover:underline mb-4 inline-block">
        &larr; Back to Dashboard
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.title}</h1>
            <div className="text-gray-600 mb-4">
              <p><span className="font-semibold">Course Code:</span> {course.code}</p>
              <p><span className="font-semibold">Enrolled Students:</span> {course.students.length}</p>
            </div>
            <p className="text-gray-700">{course.description}</p>
          </div>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
            onClick={() => console.log('Edit course details')}
          >
            Edit Course Details
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('students')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'students' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'assignments' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Assignments
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'materials' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Course Materials
          </button>
        </nav>
      </div>

      {activeTab === 'students' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Enrolled Students</h2>
            <button className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition duration-300 text-sm">
              Export Student List
            </button>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {course.students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900">
                      <button>View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Assignments</h2>
            <button 
              className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition duration-300 text-sm"
              onClick={() => console.log('Create new assignment')}
            >
              Create Assignment
            </button>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {course.assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{assignment.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{assignment.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{assignment.submissions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-4">
                      <Link to={`/instructor/assignments/${assignment.id}/grade`} className="text-indigo-600 hover:text-indigo-900">Grade</Link>
                      <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'materials' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Course Materials</h2>
            <button 
              className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition duration-300 text-sm"
              onClick={() => console.log('Upload new material')}
            >
              Upload Material
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {course.materials.map((material) => (
              <div key={material.id} className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium">{material.title}</h3>
                  <p className="text-sm text-gray-500">{material.type.toUpperCase()}</p>
                </div>
                <div className="space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-800">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorCourseDetail;