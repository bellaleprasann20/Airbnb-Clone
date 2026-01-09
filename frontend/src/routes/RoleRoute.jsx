import React from 'react';
import { Navigate } from 'react-router-dom';
// Path fix: Go up one level to 'src', then into 'hooks'
import { useAuth } from '../context/AuthContext';
// Path fix: Go up one level to 'src', then into 'components/common'
import Loader from '../components/common/Loader';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // 1. Wait for the Auth check to complete
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader type="full" />
      </div>
    );
  }

  // 2. Role Check Logic
  if (!user || !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  // 3. Authorized access
  return children;
};

export default RoleRoute;