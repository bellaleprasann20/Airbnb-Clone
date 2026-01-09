import React, { useState } from 'react';
import { Grid, ChevronLeft, Share, Heart } from 'lucide-react';
// Note: Removed unused Button import to prevent "defined but never used" warnings

const PropertyGallery = ({ images = [] }) => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  // 1. Fallback for empty images + High quality default
  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop'
  ];

  // 2. Full-Screen Overlay View
  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 flex justify-between items-center z-10 border-b">
          <button 
            onClick={() => setShowAllPhotos(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 underline text-sm font-semibold hover:bg-gray-100 p-2 rounded-lg transition">
              <Share size={16} /> Share
            </button>
            <button className="flex items-center gap-2 underline text-sm font-semibold hover:bg-gray-100 p-2 rounded-lg transition">
              <Heart size={16} /> Save
            </button>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4 py-12 px-4">
          {displayImages.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt={`Gallery ${idx}`} 
              className="w-full object-cover rounded-lg shadow-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  // 3. Main Grid View (Bento Box)
  return (
    <section className="relative group">
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[300px] md:h-[450px] rounded-2xl overflow-hidden">
        
        {/* Large Main Image */}
        <div className="col-span-4 md:col-span-2 row-span-2 relative">
          <img 
            src={displayImages[0]} 
            alt="Main" 
            className="w-full h-full object-cover hover:brightness-90 cursor-pointer transition-all duration-300"
            onClick={() => setShowAllPhotos(true)}
          />
        </div>

        {/* Four Smaller Images (Desktop only) */}
        {/* We use .slice(1, 5) to get up to 4 more images */}
        {displayImages.slice(1, 5).map((img, idx) => (
          <div key={idx} className="relative hidden md:block">
            <img 
              src={img} 
              alt={`Small ${idx}`} 
              className="w-full h-full object-cover hover:brightness-90 cursor-pointer transition-all duration-300"
              onClick={() => setShowAllPhotos(true)}
            />
          </div>
        ))}

        {/* Logic: If there are fewer than 5 images, we could add placeholder patterns or simply let the main image take more space, but this grid structure is most stable. */}
      </div>

      {/* Show All Photos Button (Floating) */}
      <button 
        onClick={() => setShowAllPhotos(true)}
        className="absolute bottom-6 right-6 bg-white border border-black px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-gray-100 shadow-md transition-all active:scale-95"
      >
        <Grid size={16} />
        Show all photos
      </button>
    </section>
  );
};

export default PropertyGallery;