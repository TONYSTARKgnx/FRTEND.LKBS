// src/services/authService.js

const API_URL = 'http://localhost:8000/api/admin';

/**
 * Login to the admin panel
 * @param {string} username - Admin username
 * @param {string} password - Admin password
 * @returns {Promise} - Promise with the login response
 */
export const loginAdmin = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Store tokens in localStorage
    localStorage.setItem('accessToken', data.token);
    localStorage.setItem('refreshToken', data.refresh);
    localStorage.setItem('adminUser', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Refresh the access token
 * @returns {Promise} - Promise with the refresh response
 */
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  try {
    const response = await fetch(`${API_URL}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    localStorage.setItem('accessToken', data.access);
    
    return data;
  } catch (error) {
    // If refresh fails, log the user out
    logout();
    throw error;
  }
};

/**
 * Logout from the admin panel
 */
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('adminUser');
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return localStorage.getItem('accessToken') !== null;
};

/**
 * Get current admin user
 * @returns {Object|null} - Admin user object or null if not logged in
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('adminUser');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Get authentication header
 * @returns {Object} - Auth header for API requests
 */
export const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return {};
  
  return {
    'Authorization': `Bearer ${token}`
  };
};