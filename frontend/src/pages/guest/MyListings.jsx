import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-hot-toast';
import { Edit, Trash2, Plus, Home, MapPin, Star } from 'lucide-react';
import Button from '../../components/common/Button';
import Loader from "../../components/common/Loader";

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { API_BASE_URL } = useApp();
  const navigate = useNavigate();

  // Optimized Helper to handle image paths from backend
  const getImageUrl = useCallback((img) => {
    if (!img) return "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
    if (img.startsWith('http')) return img;
    
    const baseUrl = (API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
    const cleanImg = img.replace(/^\//, ""); 
    
    // Checks if 'uploads' is already in the path
    return cleanImg.includes('uploads') 
      ? `${baseUrl}/${cleanImg}` 
      : `${baseUrl}/uploads/${cleanImg}`;
  }, [API_BASE_URL]);

  // Fetch listings on component mount
  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/v1/properties/user/listings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setListings(res.data.data);
        }
      } catch (error) {
        console.error("Fetch listings error:", error);
        toast.error("Could not load your listings");
      } finally {
        setLoading(false);
      }
    };
    fetchMyListings();
  }, [API_BASE_URL]);

  // Handle Delete with UI update
  const handleDelete = async (id) => {
    // Standard browser confirm, could be replaced with a custom Modal
    if (!window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;
    
    const toastId = toast.loading("Deleting listing...");
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/v1/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state to remove the item immediately
      setListings(prev => prev.filter(item => item._id !== id));
      toast.success("Listing deleted successfully", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete property", { id: toastId });
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <Loader />
      <p className="mt-4 text-gray-500 font-medium animate-pulse">Fetching your properties...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 pt-32 pb-20 font-sans">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Listings</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage and edit the homes you're hosting.</p>
        </div>
        
        <Button 
          onClick={() => navigate('/add-property')} 
          className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-2xl transition-all shadow-xl shadow-rose-100 hover:scale-[1.02] active:scale-95 font-bold"
        >
          <Plus size={20} /> Add New Home
        </Button>
      </div>

      {/* Conditional Rendering: Empty State vs Grid */}
      {listings.length === 0 ? (
        <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-[3rem] bg-gray-50/30">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mx-auto mb-6">
            <Home className="text-gray-300" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">No properties found</h2>
          <p className="text-gray-500 mt-2 mb-10 max-w-xs mx-auto text-lg">
            It looks like you haven't listed any homes yet. Start your hosting journey today!
          </p>
          <Button onClick={() => navigate('/add-property')} className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all">
            List Your Home
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
          {listings.map((prop) => (
            <div key={prop._id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
              
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={getImageUrl(prop.images?.[0])} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  alt={prop.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
                  }}
                />
                
                {/* Floating Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-3 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                  <button 
                    onClick={() => navigate(`/edit-property/${prop._id}`)}
                    className="p-3 bg-white hover:bg-black hover:text-white rounded-2xl shadow-xl text-gray-700 transition-all"
                    title="Edit Listing"
                  >
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(prop._id)}
                    className="p-3 bg-white hover:bg-rose-500 hover:text-white rounded-2xl shadow-xl text-gray-700 transition-all"
                    title="Delete Listing"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold px-3 py-1.5 rounded-xl uppercase tracking-tighter shadow-sm">
                    {prop.category}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 text-xl truncate tracking-tight">{prop.title}</h3>
                  <div className="flex items-center gap-1 text-sm font-bold bg-gray-50 px-2 py-1 rounded-lg">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span>{prop.rating || 'New'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-gray-500 text-sm mb-6">
                  <MapPin size={14} className="text-rose-500" />
                  <span className="truncate">{prop.city}, {prop.country}</span>
                </div>

                <div className="pt-5 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-black text-gray-900">₹{prop.price?.toLocaleString('en-IN')}</span>
                    <span className="text-gray-400 text-sm font-medium"> / night</span>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/property/${prop._id}`)}
                    className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors"
                  >
                    View Details
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

export default MyListings;