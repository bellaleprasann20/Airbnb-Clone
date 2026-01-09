import React, { useState, useEffect } from 'react';
import { Calendar, Check, X, Clock, User, MapPin, Phone, Mail, MessageSquare, ChevronDown, Search, Filter } from 'lucide-react';

const ManageBookings = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchBookings = async () => {
      // TODO: Replace with actual API
      // const token = localStorage.getItem('token');
      // const response = await fetch(`${API_BASE_URL}/api/v1/host/bookings`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      setTimeout(() => {
        const mockBookings = [
          {
            _id: 'b1',
            guestName: 'Rajesh Kumar',
            guestEmail: 'rajesh@example.com',
            guestPhone: '+91 98765 43210',
            guestAvatar: '👨',
            propertyTitle: 'Luxury Villa in Goa',
            propertyImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
            checkIn: '2026-01-15',
            checkOut: '2026-01-18',
            guests: 4,
            nights: 3,
            totalPrice: 25500,
            status: 'pending',
            bookingDate: '2026-01-05',
            specialRequests: 'Early check-in if possible'
          },
          {
            _id: 'b2',
            guestName: 'Priya Sharma',
            guestEmail: 'priya@example.com',
            guestPhone: '+91 87654 32109',
            guestAvatar: '👩',
            propertyTitle: 'Cozy Apartment in Mumbai',
            propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            checkIn: '2026-01-20',
            checkOut: '2026-01-23',
            guests: 2,
            nights: 3,
            totalPrice: 10500,
            status: 'pending',
            bookingDate: '2026-01-06',
            specialRequests: null
          },
          {
            _id: 'b3',
            guestName: 'Amit Patel',
            guestEmail: 'amit@example.com',
            guestPhone: '+91 76543 21098',
            guestAvatar: '👨',
            propertyTitle: 'Beachfront Cottage in Kerala',
            propertyImage: 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=800',
            checkIn: '2026-01-10',
            checkOut: '2026-01-13',
            guests: 3,
            nights: 3,
            totalPrice: 18000,
            status: 'confirmed',
            bookingDate: '2026-01-02',
            specialRequests: 'Need parking space'
          },
          {
            _id: 'b4',
            guestName: 'Sneha Reddy',
            guestEmail: 'sneha@example.com',
            guestPhone: '+91 65432 10987',
            guestAvatar: '👩',
            propertyTitle: 'Luxury Villa in Goa',
            propertyImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
            checkIn: '2025-12-20',
            checkOut: '2025-12-23',
            guests: 5,
            nights: 3,
            totalPrice: 25500,
            status: 'completed',
            bookingDate: '2025-12-10',
            specialRequests: null
          },
          {
            _id: 'b5',
            guestName: 'Vikram Singh',
            guestEmail: 'vikram@example.com',
            guestPhone: '+91 54321 09876',
            guestAvatar: '👨',
            propertyTitle: 'Cozy Apartment in Mumbai',
            propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            checkIn: '2025-11-15',
            checkOut: '2025-11-19',
            guests: 2,
            nights: 4,
            totalPrice: 14000,
            status: 'cancelled',
            bookingDate: '2025-11-05',
            specialRequests: null
          }
        ];
        
        setBookings(mockBookings);
        setLoading(false);
      }, 1000);
    };
    
    fetchBookings();
  }, []);

  // Filter bookings by tab and search
  useEffect(() => {
    let filtered = bookings.filter(b => b.status === activeTab);
    
    if (searchQuery) {
      filtered = filtered.filter(b => 
        b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredBookings(filtered);
  }, [activeTab, bookings, searchQuery]);

  const handleAcceptBooking = async (bookingId) => {
    // TODO: API call to accept booking
    setBookings(bookings.map(b => 
      b._id === bookingId ? { ...b, status: 'confirmed' } : b
    ));
    setSelectedBooking(null);
  };

  const handleRejectBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to reject this booking?')) return;
    
    // TODO: API call to reject booking
    setBookings(bookings.map(b => 
      b._id === bookingId ? { ...b, status: 'cancelled' } : b
    ));
    setSelectedBooking(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const tabs = [
    { key: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
    { key: 'confirmed', label: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed').length },
    { key: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
    { key: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
  ];

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
          <p className="text-gray-600 mt-1">View and manage all your property bookings</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by guest name or property..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl font-semibold text-gray-700 hover:border-gray-400 transition-colors">
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-4 px-6 text-sm font-bold capitalize transition-all border-b-2 relative whitespace-nowrap ${
                activeTab === tab.key 
                  ? 'border-black text-black' 
                  : 'border-transparent text-gray-400 hover:text-black hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.key ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed rounded-2xl bg-white">
            <Clock size={48} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">No {activeTab} bookings</h2>
            <p className="text-gray-500 mt-2">
              {activeTab === 'pending' 
                ? "You don't have any pending booking requests at the moment." 
                : `No ${activeTab} bookings found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Property Image */}
                    <img
                      src={booking.propertyImage}
                      alt={booking.propertyTitle}
                      className="w-full lg:w-48 h-48 object-cover rounded-xl"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
                      }}
                    />
                    
                    {/* Booking Details */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{booking.propertyTitle}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar size={16} />
                              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </span>
                            <span>{booking.nights} night{booking.nights > 1 ? 's' : ''}</span>
                            <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>

                      {/* Guest Info */}
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                          {booking.guestAvatar}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{booking.guestName}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail size={14} />
                              {booking.guestEmail}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone size={14} />
                              {booking.guestPhone}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Special Requests */}
                      {booking.specialRequests && (
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                          <p className="text-sm font-semibold text-blue-900 mb-1">Special Requests:</p>
                          <p className="text-sm text-blue-700">{booking.specialRequests}</p>
                        </div>
                      )}

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="text-2xl font-bold text-gray-900">₹{booking.totalPrice.toLocaleString('en-IN')}</p>
                        </div>

                        <div className="flex gap-3">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleRejectBooking(booking._id)}
                                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:border-red-500 hover:text-red-500 transition-colors"
                              >
                                <X size={18} />
                                Reject
                              </button>
                              <button
                                onClick={() => handleAcceptBooking(booking._id)}
                                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg"
                              >
                                <Check size={18} />
                                Accept
                              </button>
                            </>
                          )}
                          
                          {booking.status === 'confirmed' && (
                            <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors">
                              <MessageSquare size={18} />
                              Message Guest
                            </button>
                          )}
                          
                          <button
                            onClick={() => setSelectedBooking(selectedBooking?._id === booking._id ? null : booking)}
                            className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <ChevronDown 
                              size={20} 
                              className={`transition-transform ${selectedBooking?._id === booking._id ? 'rotate-180' : ''}`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {selectedBooking?._id === booking._id && (
                        <div className="pt-4 border-t border-gray-100 space-y-3 animate-in fade-in slide-in-from-top-2">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 mb-1">Booking Date</p>
                              <p className="font-semibold">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Booking ID</p>
                              <p className="font-semibold font-mono">{booking._id}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;