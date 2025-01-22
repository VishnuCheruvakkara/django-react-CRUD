// PublicRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function PublicRoute({ children }) {
  const { isAuthenticated, isAdmin } = useSelector((state) => state.user);

  if (isAuthenticated) {
    // Redirect admins to the admin home page
    if (isAdmin) {
      return <Navigate to="/adminpage" />;
    }

    // Redirect regular users to the user home page
    return <Navigate to="/" />;
  }

  // Render the public page (e.g., login or register) for unauthenticated users
  return children;
}

export default PublicRoute;
