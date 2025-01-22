// AdminRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isAdmin = useSelector((state) => state.user.user?.isAdmin);

  return isAuthenticated && isAdmin ? children : <Navigate to="/login" />;
}

export default AdminRoute;
