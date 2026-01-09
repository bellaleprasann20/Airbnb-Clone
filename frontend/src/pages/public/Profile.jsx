import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useApp } from "../../context/AppContext";
import { ShieldCheck, Star, Award, MapPin } from 'lucide-react';
import Loader from "../../components/common/Loader";

const PublicProfile = () => {
  const { id } = useParams(); // Gets the userId from the URL /profile/:id
  const { API_BASE_URL } = useApp();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        // You'll need a backend route like GET /api/v1/auth/user/:id
        const res = await axios.get(`${API_BASE_URL}/api/v1/auth/user/${id}`);
        if (res.data.success) {
          setProfileUser(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching public profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicProfile();
  }, [id, API_BASE_URL]);

  if (loading) return <Loader />;
  if (!profileUser) return <div className="pt-28 text-center">User not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 pt-32 pb-12 flex flex-col md:flex-row gap-16">
      {/* LEFT COLUMN: Profile Card */}
      <div className="w-full md:w-1/3">
        <div className="p-8 border rounded-3xl shadow-xl flex flex-col items-center text-center">
          {/* IMAGE / INITIALS CIRCLE */}
          <div className="w-32 h-32 rounded-full overflow-hidden bg-black flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-md mb-4">
            {profileUser.avatar ? (
              <img 
                src={`${API_BASE_URL}/uploads/${profileUser.avatar.split('/').pop()}`} 
                className="w-full h-full object-cover" 
                alt={profileUser.name}
              />
            ) : (
              <span>{profileUser.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          
          <h1 className="text-2xl font-bold">{profileUser.name}</h1>
          <p className="text-gray-600 font-medium">User</p>
          
          <div className="w-full border-t mt-6 pt-6 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-rose-500" size={20} />
              <span className="text-sm font-semibold text-gray-700">Identity verified</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="text-rose-500" size={20} />
              <span className="text-sm font-semibold text-gray-700">12 Reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: About & Info */}
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-6">About {profileUser.name}</h2>
        <div className="flex items-center gap-2 text-gray-500 mb-8">
          <MapPin size={18} />
          <span>Lives in New Delhi, India</span>
        </div>
        
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            {profileUser.about || `${profileUser.name} hasn't provided a bio yet. They are a valued member of our community who enjoys traveling and exploring new places.`}
          </p>
          
          <div className="pt-8 border-t">
            <h3 className="text-xl font-bold mb-4">{profileUser.name}'s confirmed information</h3>
            <div className="flex items-center gap-2 text-gray-700">
               <ShieldCheck size={18} />
               <span>Identity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;