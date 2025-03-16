import React from 'react';
import { useParams } from 'react-router-dom';
import AssignmentGrading from './AssignmentGrading';

function AssignmentGradingPage() {
  const { assignmentId } = useParams();

  return (
    <div className="h-screen p-4">
      <AssignmentGrading assignmentId={assignmentId} />
    </div>
  );
}

export default AssignmentGradingPage;