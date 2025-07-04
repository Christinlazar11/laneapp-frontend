import React from 'react';

interface SubmissionConfirmationProps {
  submissionId: string;
  timestamp: string;
}

const SubmissionConfirmation: React.FC<SubmissionConfirmationProps> = ({ submissionId, timestamp }) => (
  <div className="p-6 bg-green-100 rounded shadow text-green-800">
    <h2 className="text-xl font-bold mb-2">Submission Successful!</h2>
    <p>Your application has been submitted.</p>
    <p><strong>Submission ID:</strong> {submissionId}</p>
    <p><strong>Timestamp:</strong> {timestamp}</p>
    <p className="mt-2">A confirmation email has been sent to your address.</p>
  </div>
);

export default SubmissionConfirmation; 