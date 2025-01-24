import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const tokenExpiration = localStorage.getItem("tokenExpiration");
    const now = new Date();

    if (!user || (tokenExpiration && new Date(tokenExpiration) <= now)) {
      logout();
    }
  }, [user, logout]);

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;