// src/components/TrendingSongs.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent,
  IconButton,
  CircularProgress,
  Skeleton
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import GetAppIcon from '@mui/icons-material/GetApp';
import { fetchTrendingSongs, getSongStreamUrl, getSongDownloadUrl } from '../services/api';
import { styled } from '@mui/material/styles';

// Styled components
const SongCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  background: 'rgba(35, 9, 57, 0.53)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
  }
}));

const SongCover = styled(CardMedia)(({ theme }) => ({
  height: 0,
  paddingTop: '100%', // 1:1 aspect ratio
  position: 'relative',
}));

const SongActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  '&:hover': {
    opacity: 1,
  }
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  margin: '0 8px',
  '&:hover': {
    background: 'rgba(185, 53, 255, 0.6)',
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: 0,
    width: '60px',
    height: '3px',
    background: 'linear-gradient(90deg, #B935FF, transparent)',
    borderRadius: '10px',
  }
}));

const TrendingSongs = ({ limit = 6 }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [audio] = useState(new Audio());

  useEffect(() => {
    // Load trending songs
    const loadTrendingSongs = async () => {
      try {
        setLoading(true);
        const data = await fetchTrendingSongs(limit);
        setSongs(data);
      } catch (error) {
        console.error('Error fetching trending songs:', error);
        setError('Failed to load trending songs');
      } finally {
        setLoading(false);
      }
    };

    loadTrendingSongs();

    // Clean up audio on component unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [limit, audio]);

  // Handle playing a song
  const handlePlay = (song) => {
    // Stop current audio if playing
    if (audio.src) {
      audio.pause();
    }

    // If the same song is clicked, toggle play/pause
    if (currentlyPlaying === song.id) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    } else {
      // New song, load and play
      audio.src = getSongStreamUrl(song.slug);
      audio.play();
      setCurrentlyPlaying(song.id);
    }
  };

  // Handle downloading a song
  const handleDownload = (song) => {
    window.open(getSongDownloadUrl(song.slug), '_blank');
  };

  // Loading skeleton
  if (loading) {
    return (
      <Box sx={{ my: 4 }}>
        <SectionTitle variant="h5">Trending Songs</SectionTitle>
        <Grid container spacing={3}>
          {[...Array(limit)].map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={limit > 6 ? 3 : 4}>
              <SongCard>
                <Skeleton variant="rectangular" height={200} animation="wave" />
                <CardContent>
                  <Skeleton variant="text" width="80%" height={30} animation="wave" />
                  <Skeleton variant="text" width="50%" height={20} animation="wave" />
                </CardContent>
              </SongCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ my: 4 }}>
        <SectionTitle variant="h5">Trending Songs</SectionTitle>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  // No songs found
  if (songs.length === 0) {
    return (
      <Box sx={{ my: 4 }}>
        <SectionTitle variant="h5">Trending Songs</SectionTitle>
        <Typography align="center" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          No trending songs available
        </Typography>
      </Box>
    );
  }

  // Render trending songs
  return (
    <Box sx={{ my: 4 }}>
      <SectionTitle variant="h5">Trending Songs</SectionTitle>
      <Grid container spacing={3}>
        {songs.map((song) => (
          <Grid item key={song.id} xs={12} sm={6} md={4} lg={limit > 6 ? 3 : 4}>
            <SongCard>
              <Box sx={{ position: 'relative' }}>
                <SongCover
                  image={song.cover_image || '/default-cover.jpg'}
                  title={song.title}
                />
                <SongActions>
                  <ActionButton 
                    aria-label="play"
                    onClick={() => handlePlay(song)}
                  >
                    <PlayArrowIcon fontSize="large" />
                  </ActionButton>
                  <ActionButton 
                    aria-label="download"
                    onClick={() => handleDownload(song)}
                  >
                    <GetAppIcon fontSize="large" />
                  </ActionButton>
                </SongActions>
              </Box>
              <CardContent>
                <Typography variant="h6" component="div" noWrap>
                  {song.title}
                </Typography>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" noWrap>
                  {song.artist?.name || 'Unknown Artist'}
                </Typography>
              </CardContent>
            </SongCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TrendingSongs;