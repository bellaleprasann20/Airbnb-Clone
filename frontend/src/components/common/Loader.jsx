import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * @param {string} type - 'full' | 'inline' | 'skeleton' | 'grid'
 * @param {string} className - Custom styles
 */
const Loader = ({ type = 'inline', className = "" }) => {
  
  // 1. Full Page Overlay (Auth checks)
  if (type === 'full') {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#FF385C] animate-spin" />
          <p className="text-gray-600 font-medium animate-pulse">Loading your next adventure...</p>
        </div>
      </div>
    );
  }

  // 2. Grid Skeleton (Matches the Property Card layout on Home/Search)
  if (type === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse space-y-4">
            <div className="aspect-square bg-gray-200 rounded-xl w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  // 3. Single Skeleton Loader
  if (type === 'skeleton') {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        <div className="aspect-square bg-gray-200 rounded-xl w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  // 4. Inline Spinner (Buttons)
  return (
    <div className={`flex items-center justify-center py-2 ${className}`}>
      <Loader2 className="w-6 h-6 text-[#FF385C] animate-spin" />
    </div>
  );
};

export default Loader;