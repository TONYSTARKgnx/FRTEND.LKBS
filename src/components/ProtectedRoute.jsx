// ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const LoadingContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(to top, #0f0817, #2d1657)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}));

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
        
      if (!accessToken) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      // For simplicity, we'll just check if token exists
      // In a production app, you should validate with the backend
      setIsAuthenticated(true);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <LoadingContainer>
        <CircularProgress sx={{ color: '#e040fb' }} size={60} />
      </LoadingContainer>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the children components
  return children;
};

export default ProtectedRoute;