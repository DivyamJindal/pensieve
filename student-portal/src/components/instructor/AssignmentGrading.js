import React, { useState } from 'react';
import PDFViewer from '../PDFViewer';
import ChatSidebar from './ChatSidebar';
import { CircularProgress } from '@mui/material';

function AssignmentGrading({ assignmentId }) {
  const [feedback, setFeedback] = useState(null);
  const [isGrading, setIsGrading] = useState(false);
  const [rubric, setRubric] = useState(null);
  const [error, setError] = useState(null);

  // In a real app, this would be fetched from an API
  const pdfUrl = process.env.PUBLIC_URL + '/1B Final Practice 1 Solution.pdf';

  const handleAIGrading = async () => {
    setIsGrading(true);
    setError(null);
    try {
      // First fetch the PDF content
      console.log('Fetching PDF from:', pdfUrl);
      const pdfResponse = await fetch(pdfUrl);
      if (!pdfResponse.ok) {
        throw new Error('Failed to load PDF file');
      }
      const pdfBlob = await pdfResponse.blob();
      console.log('PDF blob size:', pdfBlob.size, 'bytes');
      const pdfBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1];
          console.log('Base64 string length:', base64.length);
          resolve(base64);
        };
        reader.readAsDataURL(pdfBlob);
      });

      const response = await fetch('http://localhost:5002/api/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          pdfContent: pdfBase64
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to grade assignment');
      }

      const data = await response.json();
      const questionRubric = data.questions.map((q, index) => ({
        criterion: q.criterion,
        score: q.score,
        maxScore: q.maxScore,
        explanation: q.explanation,
        suggestions: q.suggestions,
        confidence: q.confidence
      }));
      
      setRubric(questionRubric);
      setFeedback({
        grade: questionRubric.reduce((sum, item) => sum + item.score, 0),
        comments: ''
      });
    } catch (error) {
      console.error('Error during AI grading:', error);
      setError(error.message);
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
    setFeedback(prev => ({ ...prev, grade: totalScore }));
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
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <PDFViewer pdfUrl={pdfUrl} feedback={feedback} />
        </div>
      
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Grading Tools</h2>
            {error && (
              <div className="text-red-600 text-sm mb-2">
                {error}
              </div>
            )}
            <button
              className={`px-4 py-2 rounded-md ${isGrading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white transition duration-300`}
              onClick={handleAIGrading}
              disabled={isGrading}
            >
              {isGrading ? (
                <div className="flex items-center space-x-2">
                  <CircularProgress size={20} color="inherit" />
                  <span>AI Grading...</span>
                </div>
              ) : 'Start AI Grading'}
            </button>
          </div>

          {rubric && (
            <div className="mb-4 space-y-4">
              <h3 className="text-md font-medium">Grading Rubric</h3>
              <div className="space-y-4">
                {rubric.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{item.criterion}</span>
                        <span 
                          className={`text-sm px-2 py-1 rounded ${item.confidence < 70 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
                        >
                          {item.confidence}% confidence
                        </span>
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
                        <span className="w-8 text-center">{item.maxScore}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Explanation: </span>
                        <span className="text-gray-600">{item.explanation}</span>
                      </div>
                      {item.suggestions && (
                        <div className="text-sm">
                          <span className="font-medium">Suggestions: </span>
                          <span className="text-gray-600">{item.suggestions}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {feedback && (
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Final Grade: {feedback.grade}</span>
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
      <ChatSidebar />
    </div>
  );
}

export default AssignmentGrading;