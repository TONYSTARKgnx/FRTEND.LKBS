// adminloginpage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  IconButton,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Styled components
const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(to top, #0f0817, #2d1657)',
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(35, 9, 57, 0.53)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  border: '1px solid rgba(156, 39, 176, 0.2)',
  maxWidth: '400px',
  width: '100%'
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(156, 39, 176, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(156, 39, 176, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#9c27b0',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputBase-input': {
    color: 'white',
  }
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: 'linear-gradient(45deg, #9c27b0, #e040fb)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textShadow: '0 0 20px rgba(156, 39, 176, 0.3)',
}));

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset any previous errors
    setError('');
    setLoading(true);
    
    try {
      console.log('Submitting login with:', { username, password });
      
      const response = await fetch('https://lookbass.com/api/admin/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // Include cookies if your backend uses them
        body: JSON.stringify({ username, password }),
      });
      
      // Get the response data
      const data = await response.json();
      console.log('Login response:', data);
      
      if (!response.ok) {
        // More specific error handling
        setError(data.message || 'Invalid username or password');
        setLoading(false);
        return;
      }
      
      // Store the auth tokens in localStorage
      if (data.token) {
        localStorage.setItem('accessToken', data.token);
      } else {
        console.error('No token received from server');
        setError('Authentication error: No token received');
        setLoading(false);
        return;
      }
      
      if (data.refresh) {
        localStorage.setItem('refreshToken', data.refresh);
      }
      
      // Store user info if available
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Navigate to the dashboard
      navigate('/admin/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error: Unable to connect to the server');
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard>
          <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
            <IconButton
              onClick={() => navigate('/')}
              sx={{ color: 'white' }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box
              sx={{
                bgcolor: 'rgba(156, 39, 176, 0.2)',
                p: 2,
                borderRadius: '50%',
                mb: 2
              }}
            >
              <LockOutlinedIcon sx={{ color: '#e040fb', fontSize: 30 }} />
            </Box>
            <LogoText variant="h4" gutterBottom>
              LookBase
            </LogoText>
            <Typography variant="h6" color="white" sx={{ mb: 1 }}>
              Admin Login
            </Typography>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" textAlign="center">
              Enter your credentials to access the admin dashboard
            </Typography>
          </Box>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                bgcolor: 'rgba(211, 47, 47, 0.1)', 
                color: '#f48fb1',
                '& .MuiAlert-icon': {
                  color: '#f48fb1'
                }
              }}
            >
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <StyledTextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
              <StyledTextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                background: loading ? 'rgba(156, 39, 176, 0.5)' : 'linear-gradient(45deg, #9c27b0, #e040fb)',
                color: 'white',
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  background: loading ? 'rgba(156, 39, 176, 0.5)' : 'linear-gradient(45deg, #8e24aa, #d500f9)',
                  boxShadow: '0 0 15px rgba(156, 39, 176, 0.5)',
                  transform: loading ? 'none' : 'translateY(-2px)'
                },
                transition: 'all 0.3s ease',
                mb: 2,
                position: 'relative'
              }}
            >
              {loading ? (
                <CircularProgress 
                  size={24} 
                  sx={{ 
                    color: 'white',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px'
                  }}
                />
              ) : 'Sign In'}
            </Button>
          </form>
          
          <Typography 
            variant="body2" 
            color="rgba(255, 255, 255, 0.5)"
            align="center"
            sx={{ mt: 2 }}
          >
            Forgot password? Contact administrator
          </Typography>
        </GlassCard>
      </Box>
    </GradientBackground>
  );
};

export default AdminLoginPage;