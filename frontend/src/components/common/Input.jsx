import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Reusable Input component with Airbnb-style focus states
 * @param {string} label - The text displayed as the label
 * @param {string} error - Error message to display below the input
 * @param {React.ReactNode} icon - Optional Lucide icon to show inside
 */
const Input = ({ 
  label, 
  error, 
  icon, 
  className, 
  id, 
  ...props 
}) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-xs font-bold text-gray-700 uppercase tracking-tight ml-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF385C] transition-colors">
            {icon}
          </div>
        )}
        
        <input
          id={id}
          className={twMerge(
            "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg outline-none transition-all",
            "focus:border-2 focus:border-black focus:ring-0", // Airbnb uses a thick black border on focus
            error ? "border-red-500 bg-red-50" : "hover:border-gray-500",
            icon ? "pl-10" : "",
            className
          )}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs text-red-600 font-medium ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;