import React, { useState, useEffect } from 'react';
import { Home, Calendar, DollarSign, Users, TrendingUp, Eye, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';

const HostDashboard = () => {
  const [stats, setStats] = useState({
    totalListings: 0,
    activeBookings: 0,
    totalEarnings: 0,
    views: 0
  });
  
  const [properties, setProperties] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      // TODO: Replace with actual API calls
      // const token = localStorage.getItem('token');
      // const response = await fetch(`${API_BASE_URL}/api/v1/host/dashboard`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Mock data for demonstration
      setTimeout(() => {
        setStats({
          totalListings: 5,
          activeBookings: 12,
          totalEarnings: 145000,
          views: 1234
        });
        
        setProperties([
          {
            _id: '1',
            title: 'Luxury Villa in Goa',
            location: 'Goa, India',
            price: 8500,
            status: 'active',
            images: ['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800'],
            bookings: 8,
            revenue: 68000
          },
          {
            _id: '2',
            title: 'Cozy Apartment in Mumbai',
            location: 'Mumbai, India',
            price: 3500,
            status: 'active',
            images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
            bookings: 15,
            revenue: 52500
          },
          {
            _id: '3',
            title: 'Beachfront Cottage in Kerala',
            location: 'Kerala, India',
            price: 6000,
            status: 'inactive',
            images: ['https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=800'],
            bookings: 4,
            revenue: 24000
          }
        ]);
        
        setRecentBookings([
          {
            _id: 'b1',
            guestName: 'Rajesh Kumar',
            propertyTitle: 'Luxury Villa in Goa',
            checkIn: '2026-01-15',
            checkOut: '2026-01-18',
            totalPrice: 25500,
            status: 'confirmed'
          },
          {
            _id: 'b2',
            guestName: 'Priya Sharma',
            propertyTitle: 'Cozy Apartment in Mumbai',
            checkIn: '2026-01-20',
            checkOut: '2026-01-23',
            totalPrice: 10500,
            status: 'pending'
          }
        ]);
        
        setLoading(false);
      }, 1000);
    };
    
    fetchData();
  }, []);

  const handleEditProperty = (id) => {
    window.location.href = `/edit-property/${id}`;
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    
    // TODO: Add actual delete API call
    setProperties(properties.filter(p => p._id !== id));
  };

  const handleAddProperty = () => {
    window.location.href = '/add-property';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your overview</p>
          </div>
          <button
            onClick={handleAddProperty}
            className="flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-rose-600 transition-colors shadow-lg"
          >
            <Plus size={20} />
            Add Property
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Listings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalListings}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Home size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeBookings}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <Calendar size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalEarnings.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <DollarSign size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Views</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.views.toLocaleString()}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <Eye size={24} className="text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Properties and Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Your Properties */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Your Properties</h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {properties.map((property) => (
                  <div key={property._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-4">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-24 h-24 object-cover rounded-xl"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
                        }}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 truncate">{property.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{property.location}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <span className="text-sm font-semibold text-gray-900">₹{property.price.toLocaleString('en-IN')}/night</span>
                              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                property.status === 'active' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {property.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditProperty(property._id)}
                              className="p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(property._id)}
                              className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 mt-3 text-sm text-gray-600">
                          <span>{property.bookings} bookings</span>
                          <span>₹{property.revenue.toLocaleString('en-IN')} earned</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {properties.length === 0 && (
                <div className="p-12 text-center">
                  <AlertCircle size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No properties yet</p>
                  <button
                    onClick={handleAddProperty}
                    className="mt-4 text-rose-500 font-semibold hover:underline"
                  >
                    Add your first property
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                        {booking.guestName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">{booking.guestName}</p>
                        <p className="text-xs text-gray-500 truncate">{booking.propertyTitle}</p>
                      </div>
                    </div>
                    
                    <div className="ml-13 space-y-1">
                      <p className="text-xs text-gray-600">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">₹{booking.totalPrice.toLocaleString('en-IN')}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-100">
                <a href="/host/bookings" className="block text-center text-sm font-semibold text-rose-500 hover:underline">
                  View all bookings
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;