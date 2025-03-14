import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DownloadIcon from '@mui/icons-material/Download';
import { motion } from 'framer-motion';
import featuredArtistImage from "../assets/geo-chierchia-o-9-fSSiCT0-unsplash.jpg";
// Convert regular components to motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

function HeroSection() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(128, 0, 255, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)',
          animation: 'pulse 8s infinite',
          '@keyframes pulse': {
            '0%': { opacity: 0.5 },
            '50%': { opacity: 0.8 },
            '100%': { opacity: 0.5 },
          },
        }}
      />

      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: { xs: 4, md: 8 },
            py: 8,
          }}
        >
          {/* Text Content */}
          <MotionBox
            sx={{ flex: 1, zIndex: 1 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <MotionTypography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(45deg, #fff, #9c27b0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover Your Next Favorite Track
            </MotionTypography>
            <MotionTypography
              variant="h5"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                mb: 4,
                maxWidth: '600px'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Explore our curated collection of breakthrough artists and exclusive releases. Download high-quality tracks from emerging talents.
            </MotionTypography>
            <Stack 
              direction="row" 
              spacing={2}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {/* <MotionButton
                variant="contained"
                size= "medium"
                startIcon={<PlayArrowIcon />}
                sx={{
                  bgcolor: '#9c27b0',
                  '&:hover': { bgcolor: '#7b1fa2' },
                  px: { xs: 3, md: 4 },
                  py: { xs: 1, md: 1.5 },
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Play Latest
              </MotionButton> */}
              {/* <MotionButton
                variant="outlined"
                size="medium"
                startIcon={<DownloadIcon />}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': { borderColor: '#9c27b0', color: '#9c27b0' },
                  px: { xs: 3, md: 4 },
                  py: { xs: 1, md: 1.5 },
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Downloads
              </MotionButton> */}
            </Stack>
          </MotionBox>

          {/* Featured Image/Visualization */}
          <MotionBox
            sx={{
              flex: 1,
              position: 'relative',
              minHeight: { xs: '300px', md: '500px' },
              width: '100%',
            }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box
              component={motion.img}
              src={featuredArtistImage}
              alt="Featured Artist"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                // borderRadius: '5px',
                // boxShadow: '0 0 40px rgba(156, 39, 176, 0.3)',
                padding: { xs: '20px', md: '40px' },
              }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            />
            {/* Floating Stats */}
            <MotionBox
              sx={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(10px)',
                padding: '15px',
                borderRadius: '10px',
                color: 'white',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Featured Release
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                100 Downloads This Week
              </Typography>
            </MotionBox>
          </MotionBox>
        </Box>
      </Container>
    </Box>
  );
}

export default HeroSection;