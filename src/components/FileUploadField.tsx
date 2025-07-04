import React from 'react';
import { isValidFileType, isValidFileSize } from '../utils/validation';

interface FileUploadFieldProps {
  label: string;
  name: string;
  allowedTypes: string[];
  maxSizeMB: number;
  value: File | null;
  onChange: (file: File | null) => void;
  required?: boolean;
  error?: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({ label, name, allowedTypes, maxSizeMB, value, onChange, required, error }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!isValidFileType(file, allowedTypes)) {
        onChange(null);
        return;
      }
      if (!isValidFileSize(file, maxSizeMB)) {
        onChange(null);
        return;
      }
      onChange(file);
    } else {
      onChange(null);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block font-medium mb-1">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileChange}
        className={`w-full border rounded px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {value && <p className="text-xs mt-1">Selected: {value.name}</p>}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FileUploadField; 