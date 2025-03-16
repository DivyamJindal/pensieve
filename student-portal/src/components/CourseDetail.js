import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AssignmentSubmission from './AssignmentSubmission';
import ChatSidebar from './ChatSidebar';
import PDFViewer from './PDFViewer';

function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('assignments');
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState(null);

  // Sample data (in a real app, this would come from an API)
  useEffect(() => {
    // Simulate API call
    const fetchCourse = () => {
      // This is mock data
      const mockCourse = {
        id: parseInt(courseId),
        code: 'CS101',
        title: 'Introduction to Computer Science',
        description: 'Learn the fundamentals of computer science and programming.',
        instructor: 'Dr. Jane Smith',
        assignments: [
          { id: 1, title: 'Programming Basics', dueDate: '2023-10-15', status: 'completed', feedback: 'Excellent work! Your implementation shows good understanding of basic programming concepts. Consider adding more comments to explain your logic.' },
          { id: 2, title: 'Data Structures', dueDate: '2023-11-01', status: 'pending' },
          { id: 3, title: 'Algorithms', dueDate: '2023-11-20', status: 'pending' }
        ],
        materials: [
          { id: 1, title: 'Lecture Notes Week 1', type: 'pdf' },
          { id: 2, title: 'Coding Examples', type: 'zip' },
          { id: 3, title: 'Supplementary Reading', type: 'pdf' }
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
    <div className="flex">
      <div className="flex-1 container mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Courses
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.title}</h1>
        <div className="text-gray-600 mb-4">
          <p><span className="font-semibold">Course Code:</span> {course.code}</p>
          <p><span className="font-semibold">Instructor:</span> {course.instructor}</p>
        </div>
        <p className="text-gray-700">{course.description}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('assignments')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'assignments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Assignments
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'materials' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Course Materials
          </button>
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'assignments' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Assignments</h2>
            <button 
              onClick={() => {
                setSelectedAssignment(course.assignments.find(a => a.status === 'pending'));
                setShowSubmissionModal(true);
              }} 
              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-300 text-sm"
            >
              Submit Assignment
            </button>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {course.assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{assignment.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{assignment.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${assignment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900">
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          if (assignment.status === 'pending') {
                            setShowSubmissionModal(true);
                          } else {
                            setSelectedPDF({
                              url: 'sample-submission.pdf',
                              feedback: {
                                grade: 'A',
                                comments: assignment.feedback
                              }
                            });
                            setShowPDFViewer(true);
                          }
                        }}
                      >
                        {assignment.status === 'completed' ? 'View Feedback' : 'Submit'}
                      </button>
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
          <h2 className="text-xl font-semibold mb-4">Course Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {course.materials.map((material) => (
              <div key={material.id} className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">{material.title}</h3>
                  <p className="text-sm text-gray-500">{material.type.toUpperCase()}</p>
                </div>
                <button className="ml-auto text-blue-600 hover:text-blue-800">
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {showSubmissionModal && selectedAssignment && (
        <AssignmentSubmission
          assignment={selectedAssignment}
          onClose={() => {
            setShowSubmissionModal(false);
            setSelectedAssignment(null);
          }}
        />
      )}
      </div>
      {showPDFViewer && selectedPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[80vh] p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Assignment Feedback</h2>
              <button
                onClick={() => {
                  setShowPDFViewer(false);
                  setSelectedPDF(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <PDFViewer
              pdfUrl={selectedPDF.url}
              feedback={selectedPDF.feedback}
              onRegradeRequest={(reason) => {
                console.log('Regrade requested:', reason);
                setShowPDFViewer(false);
                setSelectedPDF(null);
              }}
            />
          </div>
        </div>
      )}
      <ChatSidebar isOpen={isChatOpen} toggleChat={() => setIsChatOpen(!isChatOpen)} />
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
}

export default CourseDetail;