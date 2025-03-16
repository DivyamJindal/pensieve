import React, { useState } from 'react';
import PDFViewer from '../PDFViewer';

function AssignmentGrading({ assignmentId }) {
  const [feedback, setFeedback] = useState(null);
  const [isGrading, setIsGrading] = useState(false);
  const [rubric, setRubric] = useState(null);

  // In a real app, this would be fetched from an API
  const pdfUrl = '/1B Final Practice 1 Solution.pdf';

  const handleAIGrading = async () => {
    setIsGrading(true);
    try {
      // Mock API call to GPT for grading
      // In production, this would be a real API call
      const mockGptResponse = {
        grade: 85,
        comments: 'Good understanding of core concepts. Some areas need improvement.',
        rubric: [
          { criterion: 'Problem Understanding', score: 18, maxScore: 20 },
          { criterion: 'Solution Approach', score: 25, maxScore: 30 },
          { criterion: 'Implementation', score: 28, maxScore: 30 },
          { criterion: 'Code Quality', score: 14, maxScore: 20 }
        ]
      };

      setRubric(mockGptResponse.rubric);
      setFeedback({
        grade: mockGptResponse.grade,
        comments: mockGptResponse.comments
      });
    } catch (error) {
      console.error('Error during AI grading:', error);
    } finally {
      setIsGrading(false);
    }
  };

  const handleRubricUpdate = (index, field, value) => {
    const updatedRubric = [...rubric];
    updatedRubric[index][field] = value;
    setRubric(updatedRubric);

    // Recalculate total grade
    const totalScore = updatedRubric.reduce((sum, item) => sum + item.score, 0);
    const maxScore = updatedRubric.reduce((sum, item) => sum + item.maxScore, 0);
    const newGrade = Math.round((totalScore / maxScore) * 100);
    
    setFeedback(prev => ({ ...prev, grade: newGrade }));
  };

  const handleSubmitGrade = () => {
    // In a real app, this would send the grade and feedback to an API
    console.log('Submitting grade:', {
      assignmentId,
      feedback,
      rubric
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <PDFViewer pdfUrl={pdfUrl} feedback={feedback} />
      </div>
      
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Grading Tools</h2>
          <button
            className={`px-4 py-2 rounded-md ${isGrading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white transition duration-300`}
            onClick={handleAIGrading}
            disabled={isGrading}
          >
            {isGrading ? 'AI Grading...' : 'Start AI Grading'}
          </button>
        </div>

        {rubric && (
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">Grading Rubric</h3>
            <div className="space-y-2">
              {rubric.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.criterion}
                      onChange={(e) => handleRubricUpdate(index, 'criterion', e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={item.score}
                      onChange={(e) => handleRubricUpdate(index, 'score', parseInt(e.target.value))}
                      className="w-20 p-2 border rounded-md text-sm"
                      min="0"
                      max={item.maxScore}
                    />
                    <span className="text-gray-500">/</span>
                    <input
                      type="number"
                      value={item.maxScore}
                      onChange={(e) => handleRubricUpdate(index, 'maxScore', parseInt(e.target.value))}
                      className="w-20 p-2 border rounded-md text-sm"
                      min="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {feedback && (
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Final Grade: {feedback.grade}%</span>
              <textarea
                value={feedback.comments}
                onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
                placeholder="Add comments..."
                className="flex-1 p-2 border rounded-md text-sm"
                rows="2"
              />
            </div>
            <button
              onClick={handleSubmitGrade}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
            >
              Submit Grade
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignmentGrading;