import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Heart, 
  ChevronRight,
  Navigation
} from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const GuestDashboard = () => {
  const [trips, setTrips] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await api.get('/guest/trips-summary');
        setTrips(data);
      } catch (err) {
        console.error("Error loading guest dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  if (loading) return <Loader type="full" />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* 1. Header Section */}
      <section className="border-b pb-8">
        <h1 className="text-4xl font-bold text-gray-900">Trips</h1>
        <p className="text-gray-500 mt-2">View your upcoming reservations and past stays.</p>
      </section>

      {/* 2. Upcoming Trips (High Priority) */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Where you're going</h2>
        {trips.upcoming.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.upcoming.map((trip) => (
              <div key={trip._id} className="flex flex-col sm:flex-row border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow bg-white group">
                <div className="sm:w-1/3 h-48 sm:h-auto">
                  <img 
                    src={trip.propertyImage} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt="Stay" 
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{trip.location}</p>
                    <h3 className="text-lg font-bold mt-1">{trip.propertyTitle}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                      <Calendar size={14} />
                      {trip.startDate} - {trip.endDate}
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button variant="dark" size="sm">Get Directions</Button>
                    <Button variant="outline" size="sm">Message Host</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 px-6 border border-dashed rounded-2xl text-center bg-gray-50">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Navigation className="text-[#FF385C]" size={24} />
            </div>
            <h3 className="font-bold text-lg">No trips booked... yet!</h3>
            <p className="text-gray-500 text-sm mb-6">Time to dust off your bags and start planning your next adventure.</p>
            <Link to="/">
              <Button variant="outline">Start searching</Button>
            </Link>
          </div>
        )}
      </section>

      

      {/* 3. Quick Links Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 border rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors group">
          <Heart className="mb-3 text-gray-700" />
          <h4 className="font-bold">Wishlists</h4>
          <p className="text-sm text-gray-500 mt-1">Check out the homes you've saved for later.</p>
          <ChevronRight size={18} className="mt-4 text-gray-300 group-hover:text-black transition-colors" />
        </div>
        
        <div className="p-6 border rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors group">
          <MessageSquare className="mb-3 text-gray-700" />
          <h4 className="font-bold">Messages</h4>
          <p className="text-sm text-gray-500 mt-1">Contact your hosts or view past chats.</p>
          <ChevronRight size={18} className="mt-4 text-gray-300 group-hover:text-black transition-colors" />
        </div>

        <div className="p-6 border rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors group">
          <MapPin className="mb-3 text-gray-700" />
          <h4 className="font-bold">Support</h4>
          <p className="text-sm text-gray-500 mt-1">Get help with your booking or safety concerns.</p>
          <ChevronRight size={18} className="mt-4 text-gray-300 group-hover:text-black transition-colors" />
        </div>
      </section>
    </div>
  );
};

export default GuestDashboard;