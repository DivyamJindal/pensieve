import React, { useState } from 'react';

function PDFViewer({ pdfUrl, feedback, onRegradeRequest }) {
  const [showRegradeForm, setShowRegradeForm] = useState(false);
  const [regradeReason, setRegradeReason] = useState('');

  const handleRegradeSubmit = (e) => {
    e.preventDefault();
    onRegradeRequest(regradeReason);
    setShowRegradeForm(false);
    setRegradeReason('');
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 bg-gray-100 p-4 overflow-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 h-full">
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title="PDF Viewer"
          />
        </div>
      </div>
      
      {feedback && (
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-bold text-lg mb-4">Feedback</h3>
          <div className="prose prose-sm">
            {feedback.comments}
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <span className="font-medium">Grade: {feedback.grade}</span>
              <button
                onClick={() => setShowRegradeForm(!showRegradeForm)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Request Regrade
              </button>
            </div>

            {showRegradeForm && (
              <form onSubmit={handleRegradeSubmit} className="mt-4">
                <textarea
                  value={regradeReason}
                  onChange={(e) => setRegradeReason(e.target.value)}
                  placeholder="Please explain why you're requesting a regrade..."
                  className="w-full p-2 border rounded-md text-sm"
                  rows="4"
                  required
                />
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowRegradeForm(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PDFViewer;