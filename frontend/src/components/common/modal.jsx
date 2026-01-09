import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

/**
 * @param {boolean} isOpen - Controls visibility
 * @param {function} onClose - Function to close the modal
 * @param {string} title - Header text
 */
const Modal = ({ isOpen, onClose, title, children, className }) => {
  
  // 1. Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop (Overlay) */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content Container */}
      <div className={twMerge(
        "relative bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-300",
        className
      )}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-900" />
          </button>
          {title && (
            <h3 className="text-base font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">
              {title}
            </h3>
          )}
          <div className="w-9" /> {/* Spacer for centering title */}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;