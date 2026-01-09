import React from 'react';
import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  isLoading = false, 
  fullWidth = false,
  className, 
  disabled,
  ...props // This now only contains standard attributes like type, onClick, etc.
}) => {
  
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';
  
  const variants = {
    primary: 'bg-[#FF385C] text-white hover:bg-[#E31C5F] shadow-sm',
    secondary: 'bg-white text-gray-900 border border-gray-400 hover:border-gray-900 hover:bg-gray-50',
    dark: 'bg-[#222222] text-white hover:bg-black',
    outline: 'bg-transparent border border-gray-900 text-gray-900 hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      // We use the variables here locally
      className={twMerge(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className
      )}
      disabled={isLoading || disabled}
      // {...props} no longer contains variant, size, or fullWidth
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" size={18} />
          <span>Please wait...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;