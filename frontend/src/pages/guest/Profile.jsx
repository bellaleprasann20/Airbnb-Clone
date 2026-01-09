import React, { useState } from 'react';
import { useApp } from "../../context/AppContext";
import { Mail, ShieldCheck, Check, X, SmilePlus, LogOut, Calendar } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const GuestProfile = () => {
  const { user, setUser, API_BASE_URL } = useApp();
  const [isEditing, setIsEditing] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const navigate = useNavigate();

  const availableEmojis = ['👤', '🐱', '🦊', '🐻', '🐼', '🐨', '🦁', '🤖', '👻', '🍕', '🌍', '🚀'];

  // Helper function to get proper image URL
  const getImageUrl = (img) => {
    if (!img) return "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
    if (img.startsWith('http')) return img;
    
    const baseUrl = (API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
    const cleanImg = img.replace(/^\//, "");
    
    if (cleanImg.includes('uploads/')) {
      return `${baseUrl}/${cleanImg}`;
    }
    return `${baseUrl}/uploads/${cleanImg}`;
  };

  // --- LOGIC HANDLERS ---

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success("Logged out successfully");
    navigate('/');
  };

  const handleEmojiSelect = async (selectedEmoji) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`${API_BASE_URL}/api/v1/auth/update-avatar`,
        { avatar: selectedEmoji },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.user) {
        setUser(res.data.user);
        setShowEmojiPicker(false);
        toast.success("Avatar updated!");
      }
    } catch (err) {
      toast.error("Failed to update emoji");
    }
  };

  const startEditing = (field, currentVal) => {
    setIsEditing(field);
    setTempValue(currentVal || '');
  };

  const handleSave = async (field) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`${API_BASE_URL}/api/v1/auth/update-details`,
        { [field]: tempValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.user) {
        setUser(res.data.user);
        setIsEditing(null);
        toast.success(`${field} updated!`);
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pt-28">
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Sidebar Profile Card */}
        <div className="w-full md:w-1/3 flex flex-col items-center p-8 border rounded-3xl shadow-xl h-fit bg-white sticky top-28">
          <div className="relative group">
            <div
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-32 h-32 rounded-full bg-rose-50 flex items-center justify-center text-6xl border-4 border-white shadow-md cursor-pointer hover:scale-105 transition-all relative"
            >
              {user?.avatar?.length < 5 ? user.avatar : '👤'}
              <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-lg border">
                <SmilePlus size={20} className="text-rose-500" />
              </div>
            </div>

            {showEmojiPicker && (
              <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-white border shadow-2xl rounded-2xl p-4 grid grid-cols-4 gap-2 z-50 w-48">
                {availableEmojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiSelect(emoji)}
                    className="text-2xl p-2 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">{user?.name}</h2>
          <p className="text-gray-500 text-sm mb-6">Guest Member</p>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-100 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-900 transition-all"
          >
            <LogOut size={18} /> Log out
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-12">
          
          {/* Account Settings */}
          <section className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
              
              {/* LEGAL NAME FIELD */}
              <div className="p-6 border-b flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 bg-gray-100 rounded-full"><ShieldCheck size={20} className="text-gray-600"/></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Legal Name</p>
                    {isEditing === 'name' ? (
                      <input 
                        className="border-b-2 border-rose-500 outline-none w-full font-semibold py-1 bg-transparent"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <p className="font-semibold text-gray-800">{user?.name}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {isEditing === 'name' ? (
                    <>
                      <button onClick={() => handleSave('name')} className="text-green-600 p-1 hover:bg-green-50 rounded-full"><Check size={20}/></button>
                      <button onClick={() => setIsEditing(null)} className="text-red-500 p-1 hover:bg-red-50 rounded-full"><X size={20}/></button>
                    </>
                  ) : (
                    <button onClick={() => startEditing('name', user?.name)} className="text-sm font-bold underline hover:text-rose-500">Edit</button>
                  )}
                </div>
              </div>

              {/* EMAIL FIELD */}
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 bg-gray-100 rounded-full"><Mail size={20} className="text-gray-600"/></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Email Address</p>
                    {isEditing === 'email' ? (
                      <input 
                        className="border-b-2 border-rose-500 outline-none w-full font-semibold py-1 bg-transparent"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                      />
                    ) : (
                      <p className="font-semibold text-gray-800">{user?.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {isEditing === 'email' ? (
                    <>
                      <button onClick={() => handleSave('email')} className="text-green-600 p-1 hover:bg-green-50 rounded-full"><Check size={20}/></button>
                      <button onClick={() => setIsEditing(null)} className="text-red-500 p-1 hover:bg-red-50 rounded-full"><X size={20}/></button>
                    </>
                  ) : (
                    <button onClick={() => startEditing('email', user?.email)} className="text-sm font-bold underline hover:text-rose-500">Edit</button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Bookings Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Your Bookings</h2>
            {user?.bookings?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {user.bookings.map((booking, index) => (
                  <div key={`${booking._id}-${index}`} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="h-40 bg-gray-200 relative">
                      <img 
                        src={getImageUrl(booking.property?.images?.[0])} 
                        alt="Property" 
                        className="w-full h-full object-cover"
                        onError={(e) => { 
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"; 
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md shadow-sm text-xs font-bold">
                        ₹{booking.totalPrice?.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold truncate">{booking.property?.title || 'Trip details'}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                        <Calendar size={14} />
                        <span>{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-3 pt-3 border-t flex items-center justify-between">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {booking.status}
                        </span>
                        <button className="text-xs font-bold underline hover:text-rose-500">View Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 border-2 border-dashed rounded-3xl text-center bg-gray-50/50">
                <p className="text-gray-500 font-medium">No trips booked... yet!</p>
                <button 
                  onClick={() => navigate('/')}
                  className="mt-4 bg-rose-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
                >
                  Start searching
                </button>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
};

export default GuestProfile;