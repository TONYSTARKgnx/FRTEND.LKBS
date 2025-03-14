import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Stack, Divider, Button } from '@mui/material';
import { motion } from 'framer-motion';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SoundcloudIcon from '@mui/icons-material/Podcasts';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from 'react-router-dom';

// Use proper motion component to avoid deprecation warning
const MotionBox = ({ children, ...props }) => (
  <Box component={motion.div} {...props}>
    {children}
  </Box>
);

function Footer() {
  const footerLinks = {
    'Company': ['About Us', 'Careers', 'News', 'Contact'],
    'Legal': ['Privacy Policy', 'Terms of Use', 'Copyright Info', 'Cookie Policy'],
  };

  const navigate = useNavigate();

  const socialIcons = [
    { icon: <FacebookIcon />, label: 'Facebook' },
    { icon: <InstagramIcon />, label: 'Instagram' },
    { icon: <YouTubeIcon />, label: 'YouTube' },
  ];

  const handleAdminLogin = () => {
    navigate('/admin/login');
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(to top, #1a1a1a, #2d1657)', // Updated gradient
        color: 'white',
        pt: 8,
        borderTop: '1px solid rgba(156, 39, 176, 0.3)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at top center, rgba(156, 39, 176, 0.15), transparent 70%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #9c27b0, #e040fb)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  textShadow: '0 0 20px rgba(156, 39, 176, 0.3)',
                }}
              >
                LoopBass
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  mb: 3,
                  maxWidth: '300px'
                }}
              >
                Shaping the future of music through innovation, artistry, and passion.
              </Typography>
              <Stack direction="row" spacing={2}>
                {socialIcons.map((social, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(156, 39, 176, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(156, 39, 176, 0.2)',
                        color: '#e040fb',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 0 15px rgba(156, 39, 176, 0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </MotionBox>
          </Grid>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <Grid item xs={6} sm={3} md={2} key={category}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: '#e040fb',
                  }}
                >
                  {category}
                </Typography>
                <Stack spacing={1.5}>
                  {links.map((link) => (
                    <Typography
                      key={link}
                      variant="body2"
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        cursor: 'pointer',
                        position: 'relative',
                        '&:hover': {
                          color: '#e040fb',
                          transform: 'translateX(5px)',
                          textShadow: '0 0 10px rgba(156, 39, 176, 0.3)',
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -2,
                          left: 0,
                          width: 0,
                          height: '1px',
                          backgroundColor: '#e040fb',
                          transition: 'width 0.3s ease',
                        },
                        '&:hover::after': {
                          width: '100%',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {link}
                    </Typography>
                  ))}
                </Stack>
              </MotionBox>
            </Grid>
          ))}

          {/* Admin Login Button */}
          <Grid item xs={12} sm={6} md={4}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              sx={{
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-end' },
                alignItems: 'center',
                height: '100%'
              }}
            >
              <Button
                variant="outlined"
                startIcon={<AdminPanelSettingsIcon />}
                onClick={handleAdminLogin}
                sx={{
                  color: '#e040fb',
                  borderColor: 'rgba(156, 39, 176, 0.5)',
                  '&:hover': {
                    borderColor: '#e040fb',
                    backgroundColor: 'rgba(156, 39, 176, 0.1)',
                    boxShadow: '0 0 15px rgba(156, 39, 176, 0.3)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease',
                  padding: '8px 16px',
                  borderRadius: '8px'
                }}
              >
                Admin Login
              </Button>
            </MotionBox>
          </Grid>
        </Grid>

        <Divider 
          sx={{ 
            mt: 6, 
            mb: 4, 
            background: 'linear-gradient(to right, transparent, rgba(156, 39, 176, 0.3), transparent)' 
          }} 
        />

        {/* Bottom Footer */}
        <Box
          sx={{
            py: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: 'rgba(255,255,255,0.8)' }}
          >
            © {new Date().getFullYear()} LoopBass. All rights reserved.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 3,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                cursor: 'pointer',
                '&:hover': { 
                  color: '#e040fb',
                  textShadow: '0 0 10px rgba(156, 39, 176, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Privacy Policy
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                cursor: 'pointer',
                '&:hover': { 
                  color: '#e040fb',
                  textShadow: '0 0 10px rgba(156, 39, 176, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Terms of Service
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;