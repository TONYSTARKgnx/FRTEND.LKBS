import React, { useState, useRef } from 'react';
import { Box, Container, Typography, Grid, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import emailjs from '@emailjs/browser';

// Fix motion deprecation warning
const MotionBox = ({ children, ...props }) => (
  <Box component={motion.div} {...props}>
    {children}
  </Box>
);

function ContactSection() {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: <LocationOnIcon sx={{ fontSize: 40 }} />,
      title: "Visit Us",
      details: "Waad, No 05, Lonar Road, Sultanpur, Buldana - 443302,Maharashtra, India"
    },
    {
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      title: "Email Us",
      details: "Lookbassmusic@gmail.com"
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40 }} />,
      title: "Call Us",
      details: "9689375458, 7378829634 "
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Replace these with your actual IDs from EmailJS
    const serviceId = 'service_bb6scae';
    const templateId = 'template_wtyxj0p';
    const publicKey = 'iztFbhp4UW_nRzBm3';

    emailjs.sendForm(serviceId, templateId, form.current, publicKey)
      .then((result) => {
        console.log('Success:', result.text);
        setSuccess(true);
        setLoading(false);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      })
      .catch((error) => {
        console.error('Error:', error.text);
        setError('Failed to send message. Please try again later.');
        setLoading(false);
      });
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)',
        py: { xs: 8, md: 12 },
        color: 'white',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          {/* Contact Form Section */}
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h2"
                sx={{
                  mb: 4,
                  fontWeight: 700,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  background: 'linear-gradient(45deg, #fff, #9c27b0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Get In Touch
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.8,
                }}
              >
                Whether you're an artist looking to join our label, a fan with questions, or a business seeking collaboration - we're here to help.
              </Typography>
              
              {success && (
                <Alert 
                  severity="success" 
                  sx={{ 
                    mb: 3, 
                    bgcolor: 'rgba(46, 125, 50, 0.2)', 
                    color: '#81c784',
                    '& .MuiAlert-icon': {
                      color: '#81c784'
                    }
                  }}
                >
                  Your message has been sent successfully! We'll get back to you soon.
                </Alert>
              )}
              
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    bgcolor: 'rgba(211, 47, 47, 0.2)', 
                    color: '#e57373',
                    '& .MuiAlert-icon': {
                      color: '#e57373'
                    }
                  }}
                >
                  {error}
                </Alert>
              )}
              
              <Box
                component="form"
                ref={form}
                onSubmit={handleSubmit}
                sx={{
                  '& .MuiTextField-root': {
                    mb: 2,
                  },
                  '& .MuiInputBase-root': {
                    color: 'white',
                  },
                  '& .MuiOutlinedInput-root': {
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
                    color: 'rgba(255,255,255,0.7)',
                  },
                }}
              >
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Subject"
                  variant="outlined"
                  required
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Message"
                  variant="outlined"
                  multiline
                  rows={4}
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                />
                <Button
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={loading}
                  sx={{
                    mt: 2,
                    bgcolor: '#9c27b0',
                    '&:hover': {
                      bgcolor: '#7b1fa2',
                    },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Message'}
                </Button>
              </Box>
            </MotionBox>
          </Grid>

          {/* Contact Info Section */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              {contactInfo.map((info, index) => (
                <Grid item xs={12} key={index}>
                  <MotionBox
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    sx={{
                      p: 4,
                      backgroundColor: 'rgba(156, 39, 176, 0.1)',
                      borderRadius: '16px',
                      border: '1px solid rgba(156, 39, 176, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(156, 39, 176, 0.15)',
                        transform: 'translateY(-5px)',
                        transition: 'all 0.3s ease',
                      },
                    }}
                  >
                    <Box sx={{ color: '#9c27b0' }}>
                      {info.icon}
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 1,
                          fontWeight: 600,
                        }}
                      >
                        {info.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'rgba(255,255,255,0.7)',
                        }}
                      >
                        {info.details}
                      </Typography>
                    </Box>
                  </MotionBox>
                </Grid>
              ))}

              {/* Social Links or Additional Info */}
              <Grid item xs={12}>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  sx={{
                    mt: 3,
                    p: 4,
                    backgroundColor: 'rgba(156, 39, 176, 0.1)',
                    borderRadius: '16px',
                    border: '1px solid rgba(156, 39, 176, 0.2)',
                    textAlign: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                      component="a"
                      // href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'white',
                        backgroundColor: '#3b5998',
                        '&:hover': { backgroundColor: '#2d4373' },
                      }}
                    >
                      <i className="fab fa-facebook-f"></i>
                    </Button>
                    <Button
                      component="a"
                      // href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'white',
                        backgroundColor: '#1DA1F2',
                        '&:hover': { backgroundColor: '#0a95dd' },
                      }}
                    >
                      <i className="fab fa-twitter"></i>
                    </Button>
                    <Button
                      component="a"
                      // href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'white',
                        backgroundColor: '#E1306C',
                        '&:hover': { backgroundColor: '#ad1457' },
                      }}
                    >
                      <i className="fab fa-instagram"></i>
                    </Button>
                  </Box>
                </MotionBox>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ContactSection;