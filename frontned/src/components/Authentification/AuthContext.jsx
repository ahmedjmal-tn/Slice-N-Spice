import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [timeoutId, setTimeoutId] = useState(null);
  const sessionTimeoutDuration = 3600000; // 1 hour in milliseconds
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const tokenExpiration = localStorage.getItem("tokenExpiration");
      const now = new Date();

      if (user && tokenExpiration && new Date(tokenExpiration) > now) {
        startSessionTimeout();
      } else {
        logout();
      }
    };

    if (localStorage.getItem('token') && !user) {
      checkTokenExpiration();
    }

    return () => {
      clearSessionTimeout();
    };
  }, [user]);

  const startSessionTimeout = () => {
    clearSessionTimeout();
    const id = setTimeout(() => {
      logout();
    }, sessionTimeoutDuration);
    setTimeoutId(id);
  };

  const clearSessionTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5047/api/Account/Login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('tokenExpiration', response.data.expiration);
      setUser(response.data.user);
      startSessionTimeout();
      navigate("/"); // Navigate to home page after successful login
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiration');
    setUser(null);
    clearSessionTimeout();
    navigate("/login"); // Navigate to login page after logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};