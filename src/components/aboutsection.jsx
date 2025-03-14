import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import GroupsIcon from '@mui/icons-material/Groups';
import AlbumIcon from '@mui/icons-material/Album';

const MotionBox = motion(Box);

function AboutSection() {
  const stats = [
    {
      icon: <HeadphonesIcon sx={{ fontSize: 40 }} />,
      number: "500",
      label: "Monthly Listeners"
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
      number: "10+",
      label: "Artists"
    },
    {
      icon: <AlbumIcon sx={{ fontSize: 40 }} />,
      number: "10+",
      label: "Releases"
    }
  ];

  return (
    <Box
      sx={{
        background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)',
        py: { xs: 8, md: 12 },
        color: 'white',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          {/* Main Content */}
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
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
                Shaping the Future of Music
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.8,
                }}
              >
                Since 2020, LoopBass has been at the forefront of discovering and nurturing exceptional musical talent. We're more than just a record label – we're a community of passionate artists, producers, and music lovers dedicated to pushing the boundaries of sound.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.8,
                }}
              >
                Our mission is to bridge the gap between emerging artists and global audiences, providing a platform where creativity thrives and innovation knows no bounds. With state-of-the-art production facilities and a team of industry veterans, we help transform raw talent into chart-topping success.
              </Typography>
            </MotionBox>
          </Grid>

          {/* Stats Grid */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      backgroundColor: 'rgba(156, 39, 176, 0.1)',
                      borderRadius: '16px',
                      border: '1px solid rgba(156, 39, 176, 0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(156, 39, 176, 0.15)',
                        transform: 'translateY(-5px)',
                        transition: 'all 0.3s ease',
                      },
                    }}
                  >
                    <Box sx={{ color: '#9c27b0', mb: 2 }}>
                      {stat.icon}
                    </Box>
                    <Typography
                      variant="h3"
                      sx={{
                        mb: 1,
                        fontWeight: 700,
                        fontSize: { xs: '2rem', md: '2.5rem' },
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: { xs: '0.9rem', md: '1rem' },
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </MotionBox>
                </Grid>
              ))}

              {/* Vision Statement */}
              <Grid item xs={12}>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  sx={{
                    mt: 4,
                    p: 4,
                    backgroundColor: 'rgba(156, 39, 176, 0.1)',
                    borderRadius: '16px',
                    border: '1px solid rgba(156, 39, 176, 0.2)',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  >
                    Our Vision
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      textAlign: 'center',
                      lineHeight: 1.8,
                    }}
                  >
                    To create a global platform where artists can freely express their creativity and connect with audiences who share their passion for authentic, innovative music.
                  </Typography>
                </MotionBox>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default AboutSection;