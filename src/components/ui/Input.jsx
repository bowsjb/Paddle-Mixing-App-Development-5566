import React from 'react';

const Input = ({ 
  label, 
  error, 
  type = 'text', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm';
  
  const errorClasses = error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '';
  
  const classes = `
    ${baseClasses}
    ${errorClasses}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={classes}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;