import React from 'react';

interface DraftButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const DraftButton: React.FC<DraftButtonProps> = ({ onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
  >
    Save as Draft
  </button>
);

export default DraftButton; 