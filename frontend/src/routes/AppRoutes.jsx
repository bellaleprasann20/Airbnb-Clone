import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Pages
import Home from '../pages/public/Home';
import Search from '../pages/public/Search';
import PropertyDetails from '../pages/public/PropertyDetails'; 
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import ForgotPassword from '../pages/public/ForgotPassword';
import ResetPassword from "../pages/public/ResetPassword";
import AddProperty from '../pages/public/AddProperty';

// Guest Pages
import GuestDashboard from '../pages/guest/Dashboard';
import MyTrips from '../pages/guest/MyTrips';
import Profile from '../pages/guest/Profile';
import Receipt from '../pages/guest/Receipt';
import MyListings from '../pages/guest/MyListings';
import Wishlist from '../pages/guest/Wishlist';

// Host Pages
import HostDashboard from '../pages/host/HostDashboard'; // Keeping the host version
import ManageBookings from '../pages/host/ManageBookings';
import Earnings from '../pages/host/Earnings';

// Admin Pages
import AdminProperties from '../pages/admin/Properties';
import AdminUsers from '../pages/admin/Users';

// Guards
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/property/:id" element={<PropertyDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:resettoken" element={<ResetPassword />} />
      
      {/* --- GUEST PROTECTED ROUTES --- */}
      <Route path="/guest" element={<ProtectedRoute><GuestDashboard /></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/receipt/:bookingId" element={<ProtectedRoute><Receipt /></ProtectedRoute>} />
      <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

      {/* --- HOST ROUTES --- */}
      <Route path="/host" element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={['host', 'admin']}><HostDashboard /></RoleRoute>
        </ProtectedRoute>
      } />

      {/* Adding/Editing Property - Protected for Hosts */}
      <Route path="/add-property" element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={['host', 'admin']}><AddProperty /></RoleRoute>
        </ProtectedRoute>
      } />
      
      <Route path="/edit-property/:id" element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={['host', 'admin']}><AddProperty isEdit={true} /></RoleRoute>
        </ProtectedRoute>
      } />

      <Route path="/host/bookings" element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={['host']}><ManageBookings /></RoleRoute>
        </ProtectedRoute>
      } />
      <Route path="/host/earnings" element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={['host']}><Earnings /></RoleRoute>
        </ProtectedRoute>
      } />

      {/* --- ADMIN ROUTES --- */}
      <Route path="/admin/properties" element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={['admin']}><AdminProperties /></RoleRoute>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={['admin']}><AdminUsers /></RoleRoute>
        </ProtectedRoute>
      } />

      {/* 404 Catch-all */}
      <Route path="*" element={<div className="pt-32 text-center text-2xl font-bold text-gray-800">404: Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;