import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useApp } from "../../context/AppContext";  
import Loader from "../../components/common/Loader"; 
import { Calendar, MapPin, Clock, Trash2, ChevronRight, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const { API_BASE_URL } = useApp();
  const navigate = useNavigate();

  // Helper to handle image paths correctly
  const getImageUrl = useCallback((img) => {
    // 1. Fallback if no image exists
    if (!img) return "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
    
    // 2. If it's a full URL already (Cloudinary, S3, etc.)
    if (img.startsWith('http')) return img;
    
    // 3. FIX: Check if it's a broken placeholder string like "400x300?text=..."
    if (img.startsWith('400x300')) {
      // Extract the text after "text=" if it exists
      const match = img.match(/text=([^&]+)/);
      const text = match ? match[1] : 'Property';
      return `https://placehold.co/400x300/e2e8f0/64748b?text=${text}`;
    }
    
    // 4. Handle Local Backend Uploads
    const baseUrl = (API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
    const cleanImg = img.replace(/^\//, ""); 
    
    // Check if the string already contains 'uploads'
    if (cleanImg.includes('uploads/')) {
        return `${baseUrl}/${cleanImg}`;
    }
    return `${baseUrl}/uploads/${cleanImg}`;
  }, [API_BASE_URL]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/v1/bookings/my-bookings?status=${activeTab}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrips(res.data.data || []);
    } catch (err) {
      console.error("Error fetching trips:", err);
      toast.error("Could not load trips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [activeTab]);

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    
    const toastId = toast.loading("Cancelling booking...");
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/api/v1/bookings/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Booking cancelled", { id: toastId });
      setTrips(prev => prev.filter(trip => trip._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancellation failed", { id: toastId });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 font-sans min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Trips</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your upcoming and past adventures</p>
        </div>
        {!loading && trips.length > 0 && (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'}
          </span>
        )}
      </div>

      <div className="flex border-b border-gray-200 mb-8">
        {['upcoming', 'past'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-6 text-sm font-bold capitalize transition-all border-b-2 relative ${
              activeTab === tab 
                ? 'border-black text-black' 
                : 'border-transparent text-gray-400 hover:text-black hover:border-gray-300'
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-black" />}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader />
          <p className="text-gray-400 mt-4 animate-pulse">Fetching your trips...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed rounded-[2rem] bg-gray-50/50 flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <Clock size={32} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">No {activeTab} trips found</h2>
          <p className="text-gray-500 mt-2 mb-8 max-w-xs mx-auto text-sm">
            {activeTab === 'upcoming' 
              ? "Looks like it's time to dust off your bags and start planning your next adventure."
              : "You haven't completed any trips yet."}
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition shadow-lg"
          >
            Start searching
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <div key={trip._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="h-56 overflow-hidden relative cursor-pointer" onClick={() => navigate(`/properties/${trip.property?._id}`)}>
                <img 
                  src={getImageUrl(trip.property?.images?.[0])} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  alt={trip.property?.title}
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"; 
                  }}
                />
                <div className="absolute top-4 left-4">
                   <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-black shadow-lg">
                    {trip.status}
                   </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-gray-900 leading-tight truncate flex-1 pr-2">
                        {trip.property?.title || "Unknown Property"}
                    </h3>
                    {activeTab === 'upcoming' && (
                        <button 
                            onClick={() => handleCancelBooking(trip._id)}
                            className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
                
                <div className="flex items-center text-gray-500 text-sm mb-5 font-medium">
                  <MapPin size={14} className="mr-1.5 text-rose-500" />
                  <span>{trip.property?.city}, {trip.property?.country || 'India'}</span>
                </div>

                <div className="bg-gray-50/80 rounded-2xl p-4 flex items-center gap-4 mb-6 border border-gray-100">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm">
                    <Calendar size={20} className="text-rose-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Your Stay</p>
                    <p className="font-bold text-gray-800 text-xs sm:text-sm">
                      {formatDate(trip.checkIn)} — {formatDate(trip.checkOut)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Amount Paid</p>
                    <p className="font-extrabold text-gray-900 text-lg">₹{trip.totalPrice?.toLocaleString('en-IN')}</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/properties/${trip.property?._id}`)}
                    className="flex items-center gap-1.5 text-sm font-bold text-gray-900 hover:text-rose-500 transition-colors"
                  >
                    View details <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrips;