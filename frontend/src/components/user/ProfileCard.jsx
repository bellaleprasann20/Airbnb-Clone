import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, ShieldCheck, Star } from 'lucide-react';

const ProfileCard = () => {
  const { user } = useAuth();

  // If user is not logged in, don't show the card
  if (!user) return null;

  // Use the first letter of name as a fallback for the image
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="bg-white border rounded-3xl shadow-xl p-6 w-full max-w-sm">
      <div className="flex items-center gap-6">
        {/* Round Image / Avatar */}
        <div className="relative">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-24 h-24 rounded-full object-cover border"
            />
          ) : (
            <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-inner">
              {userInitial}
            </div>
          )}
          <div className="absolute bottom-1 right-1 bg-rose-500 p-1.5 rounded-full border-2 border-white shadow-sm">
             <ShieldCheck size={14} className="text-white" />
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-sm font-medium text-gray-500">Guest</p>
        </div>
      </div>

      <hr className="my-6 border-gray-100" />

      {/* Stats/Badges Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-gray-700">
          <Star size={20} className="text-gray-400" />
          <span className="text-sm">0 Reviews</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <MapPin size={20} className="text-gray-400" />
          <span className="text-sm">Lives in {user.location || 'India'}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;