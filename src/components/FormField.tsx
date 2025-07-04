import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, name, type = 'text', value, onChange, required, error }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block font-medium mb-1">
      {label}{required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full border rounded px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default FormField; 