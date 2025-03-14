import React, { useEffect, useState, useCallback } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Reusable GradientText Component
const GradientText = ({ children, variant = 'h4', ...props }) => (
  <Typography
    variant={variant}
    sx={{
      color: 'white',
      mb: { xs: 2, sm: 3 },
      fontWeight: 700,
      background: 'linear-gradient(45deg, #fff, #9c27b0)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      fontSize: {
        xs: '1.5rem',
        sm: '1.75rem',
        md: '2rem',
        lg: '2.25rem',
        xl: '2.5rem',
      },
      ...props.sx,
    }}
    {...props}
  >
    {children}
  </Typography>
);

// Use motion.div instead of motion(Box) to avoid deprecation warning
const MotionBox = ({ children, ...props }) => (
  <Box
    component={motion.div}
    {...props}
  >
    {children}
  </Box>
);

// SongCard Component
const SongCard = React.memo(({ song, onClick }) => (
  <MotionBox
    onClick={() => onClick(song.id)}
    sx={{
      backgroundColor: '#1a1a1a',
      borderRadius: '16px',
      overflow: 'hidden',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 20px rgba(156, 39, 176, 0.3)',
      },
      transition: 'all 0.3s ease',
    }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Box
      sx={{
        position: 'relative',
        paddingTop: '100%', // 1:1 Aspect ratio
        width: '100%',
      }}
    >
      <Box
        component="img"
        src={song.cover || '/default-cover.jpg'}
        alt={`Cover for ${song.title} by ${song.artist}`}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </Box>
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        background: 'linear-gradient(to top, #1a1a1a, rgba(26, 26, 26, 0.8))',
        flexGrow: 1,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: 'white',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: {
            xs: '0.9rem',
            sm: '1rem',
            md: '1.1rem',
          },
        }}
      >
        {song.title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(255,255,255,0.7)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: {
            xs: '0.8rem',
            sm: '0.9rem',
          },
        }}
      >
        {song.artist}
      </Typography>
    </Box>
  </MotionBox>
));

// SongCarousel Component
const SongCarousel = React.memo(({ title, songs, onSongClick }) => (
  <Box sx={{ mb: { xs: 4, sm: 6 } }}>
    <GradientText>{title}</GradientText>
    <Swiper
      modules={[Navigation, Pagination, A11y]}
      spaceBetween={16}
      slidesPerView={1.2}
      navigation
      pagination={{ clickable: true }}
      breakpoints={{
        300: { slidesPerView: 1.2 },
        500: { slidesPerView: 1.5 },
        700: { slidesPerView: 2.2 },
        900: { slidesPerView: 3.2 },
        1200: { slidesPerView: 4.2 },
        1536: { slidesPerView: 5.2 },
      }}
      style={{
        padding: '10px',
        '--swiper-navigation-color': '#fff',
        '--swiper-pagination-color': '#9c27b0',
      }}
    >
      {songs.map((song) => (
        <SwiperSlide key={song.id}>
          <SongCard song={song} onClick={onSongClick} />
        </SwiperSlide>
      ))}
    </Swiper>
  </Box>
));

// FeaturedSection Component
const FeaturedSection = () => {
  const [latestSongs, setLatestSongs] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchSongs = useCallback(async () => {
    try {
      console.log('Fetching songs...');
      
      // Set default dummy data first to prevent white screen while loading
      const dummyData = {
        latestSongs: [
          { id: 1, title: "Latest Song 1", artist: "Artist 1", cover: "/default-cover.jpg" },
          { id: 2, title: "Latest Song 2", artist: "Artist 2", cover: "/default-cover.jpg" }
        ],
        trendingSongs: [
          { id: 3, title: "Trending Song 1", artist: "Artist 3", cover: "/default-cover.jpg" },
          { id: 4, title: "Trending Song 2", artist: "Artist 4", cover: "/default-cover.jpg" }
        ]
      };
      
      // Set dummy data initially
      setLatestSongs(dummyData.latestSongs);
      setTrendingSongs(dummyData.trendingSongs);
      
      const response = await fetch('https://lookbass.com/api/featured/?limit=10');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.log('Response not ok:', await response.text());
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response Data:', data);
  
      if (data.latestSongs && data.trendingSongs) {
        // Format the data to match what SongCard expects
        const formattedLatestSongs = data.latestSongs.map(song => {
          // Get the full URL for the cover image
          let coverUrl = "/default-cover.jpg";
          if (song.cover_image) {
            // Check if the URL is already absolute or needs the backend base URL
            coverUrl = song.cover_image.startsWith('http') 
              ? song.cover_image 
              : `https://lookbass.com${song.cover_image}`;
          }
          
          return {
            id: song.id,
            title: song.title,
            artist: song.artist?.name || "Unknown Artist",
            cover: coverUrl
          };
        });
        
        const formattedTrendingSongs = data.trendingSongs.map(song => {
          // Get the full URL for the cover image
          let coverUrl = "/default-cover.jpg";
          if (song.cover_image) {
            // Check if the URL is already absolute or needs the backend base URL
            coverUrl = song.cover_image.startsWith('http') 
              ? song.cover_image 
              : `https://lookbass.com${song.cover_image}`;
          }
          
          return {
            id: song.id,
            title: song.title,
            artist: song.artist?.name || "Unknown Artist",
            cover: coverUrl
          };
        });
        
        setLatestSongs(formattedLatestSongs);
        setTrendingSongs(formattedTrendingSongs);
      } else {
        console.log('Invalid data format, keeping dummy data:', data);
      }
    } catch (error) {
      console.error('Detailed error:', error);
      setError('Failed to load songs. Please try again later.');
      // We keep the dummy data from earlier
    }
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const handleSongClick = useCallback((songId) => {
    navigate(`/player/${songId}`);
  }, [navigate]);

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)',
        py: { xs: 3, sm: 4, md: 6 },
        minHeight: '100vh',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <SongCarousel title="Latest Releases" songs={latestSongs} onSongClick={handleSongClick} />
        <SongCarousel title="Trending Now" songs={trendingSongs} onSongClick={handleSongClick} />
      </Container>
    </Box>
  );
};

export default FeaturedSection;