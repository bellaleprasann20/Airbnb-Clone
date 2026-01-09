import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// Path fix: Go up two levels to 'src', then into 'hooks'
import { useAuth } from '../context/AuthContext'; 
// Path fix: Go up two levels to 'src', then into 'components/common'
import Loader from '../components/common/Loader'; 

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Handle the loading state while AuthContext checks for a token
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader type="full" />
      </div>
    );
  }

  // 2. If no user is logged in, redirect to login page
  if (!user) {
    /** * We pass 'state={{ from: location }}' so that after login, 
     * the user is sent back to the page they were originally trying to access.
     */
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If authenticated, render the requested page
  return children;
};

export default ProtectedRoute;