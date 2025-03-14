// PlayerPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  Slider,
  Typography,
  CircularProgress
} from '@mui/material';
import {
  Home,
  PlayArrow,
  Pause,
  SkipPrevious,
  SkipNext,
  VolumeUp,
  VolumeOff,
  Repeat,
  Shuffle,
  Favorite,
  FavoriteBorder,
  Download,
  ArrowBack
} from '@mui/icons-material';

// Styled Components
const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(to top, #1a1a1a, #2d1657)',
  padding: theme.spacing(3)
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(35, 9, 32, 0.53)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  boxShadow: 'none'
}));

// Create motion components using motion.create() to avoid deprecation warning
const MotionDiv = motion.div;

const PlayerPage = () => {
  const { songId } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  
  // Format time (mm:ss)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  console.log("Component rendered with songId:", songId);
  
  // Fetch song data
  // In PlayerPage.jsx, update the fetchSong function in useEffect:

useEffect(() => {
  // Reset states when songId changes
  setIsPlaying(false);
  setCurrentTime(0);
  setDuration(0);
  setLoading(true);
  setError(null);
  
  // Stop any currently playing audio
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.src = '';
  }
  
  const fetchSong = async () => {
    try {
      console.log(`Fetching song for player with ID: ${songId}`);
      
      // Use the dedicated player endpoint
      const response = await fetch(`https://lookbass.com/api/player/${songId}/`);
      
      if (!response.ok) {
        console.error(`API response not OK: ${response.status}`);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch song: ${response.status}`);
      }
      
      const songData = await response.json();
      console.log('Fetched player song data:', songData);
      
      if (!songData) {
        throw new Error('No song data found in the response');
      }
      
      // Format the data to match what the component expects
      const formattedSong = {
        id: songData.id,
        title: songData.title,
        name: songData.title,
        artist: songData.artist?.name || "Unknown Artist",
        cover: songData.cover_image ? 
               (songData.cover_image.startsWith('http') ? 
                songData.cover_image : 
                `https://lookbass.com${songData.cover_image}`) : 
               '/placeholder.jpg',
        // Use the pre-built URLs from the API
        audioUrl: songData.stream_url || `https://lookbass.com/api/songs/${songData.slug}/stream/`,
        downloadUrl: songData.download_url || `https://lookbass.com/api/songs/${songData.slug}/download/`,
        genre: Array.isArray(songData.genre) ? 
               songData.genre.map(g => g.name || g).join(', ') : 
               (typeof songData.genre === 'string' ? songData.genre : ''),
        album: songData.album || '',
        slug: songData.slug,
        plays: songData.play_count || 0
      };
      
      setSong(formattedSong);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching song:', err);
      setError('Failed to load song. Please try again later.');
      setLoading(false);
    }
  };

  fetchSong();
}, [songId]);





  // Add audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    
    // Clean up previous audio instance
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    
    if (audio && song?.audioUrl) {
      console.log("Loading new audio URL:", song.audioUrl);
      audio.src = song.audioUrl;
      audio.load(); // Important: force reload of audio source
      
      const handleLoadedMetadata = () => {
        console.log("Audio metadata loaded, duration:", audio.duration);
        setDuration(audio.duration);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
      };
      
      const handleCanPlayThrough = () => {
        console.log("Audio can play through");
        // Auto-play when loaded
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.error('Error auto-playing:', err);
        });
      };
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      
      // Set volume
      audio.volume = volume;
      
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.pause();
      };
    }
  }, [song, songId]); // Add songId as dependency to ensure re-creation when song changes

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Play/Pause toggle
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error('Playback error:', err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle playback position change
  const handlePositionChange = (_, value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  // Handle volume change
  const handleVolumeChange = (_, value) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle song download
  const handleDownload = async () => {
    try {
      if (!song || !song.slug) {
        console.error('Cannot download: song slug is missing');
        return;
      }
      
      const downloadUrl = `https://lookbass.com/api/songs/${song.slug}/download/`;
      
      // Create an anchor element
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', ''); // This is important
      document.body.appendChild(link);
      
      // Trigger click
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading song:', error);
    }
  };

  // Go back to the previous page
  const goBack = () => {
    navigate(-1);
  };

  // Go to homepage
  const goHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <GradientBackground 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center'
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </GradientBackground>
    );
  }

  if (error || !song) {
    return (
      <GradientBackground>
        <Container>
          <GlassCard>
            <Typography variant="h5" color="white" gutterBottom>
              {error || "Song not found"}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <IconButton 
                color="primary" 
                onClick={goBack}
                sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
              >
                <ArrowBack />
              </IconButton>
              <IconButton 
                color="primary" 
                onClick={goHome}
                sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
              >
                <Home />
              </IconButton>
            </Box>
          </GlassCard>
        </Container>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <Container maxWidth="lg">
        {/* Header with back button */}
        <Box sx={{ display: 'flex', mb: 4 }}>
          <IconButton 
            onClick={goBack} 
            sx={{ color: 'white', mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <IconButton 
            onClick={goHome}
            sx={{ color: 'white' }}
          >
            <Home />
          </IconButton>
        </Box>
        
        {/* Main content */}
        <Grid container spacing={4}>
          {/* Album art */}
          <Grid item xs={12} md={6}>
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              key={song.id} // Add key to force re-render when song changes
            >
              <Box
                component="img"
                src={song.cover || '/placeholder.jpg'}
                alt={song.title || song.name}
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: '0 20px 30px rgba(0,0,0,0.3)',
                  aspectRatio: '1/1',
                  objectFit: 'cover'
                }}
              />
            </MotionDiv>
          </Grid>
          
          {/* Song info and controls */}
          <Grid item xs={12} md={6}>
            <GlassCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h3" color="white" gutterBottom>
                {song.title || song.name}
              </Typography>
              <Typography variant="h5" color="rgba(255,255,255,0.7)" sx={{ mb: 4 }}>
                {song.artist}
              </Typography>
              
              {/* Hidden audio element */}
              <audio ref={audioRef} />
              
              {/* Player controls */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
                <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  <Shuffle />
                </IconButton>
                <IconButton sx={{ color: 'white' }}>
                  <SkipPrevious fontSize="large" />
                </IconButton>
                <IconButton 
                  onClick={togglePlay}
                  sx={{ 
                    color: 'white',
                    bgcolor: 'primary.main',
                    p: 2,
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  {isPlaying ? 
                    <Pause fontSize="large" /> : 
                    <PlayArrow fontSize="large" />
                  }
                </IconButton>
                <IconButton sx={{ color: 'white' }}>
                  <SkipNext fontSize="large" />
                </IconButton>
                <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  <Repeat />
                </IconButton>
              </Box>
              
              {/* Progress bar */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Typography color="white">
                  {formatTime(currentTime)}
                </Typography>
                <Slider
                  value={currentTime}
                  max={duration || 100}
                  onChange={handlePositionChange}
                  sx={{ flexGrow: 1 }}
                />
                <Typography color="white">
                  {formatTime(duration)}
                </Typography>
              </Box>
              
              {/* Volume and like controls */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton onClick={toggleMute} sx={{ color: 'white' }}>
                    {isMuted ? <VolumeOff /> : <VolumeUp />}
                  </IconButton>
                  <Slider
                    value={volume}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={handleVolumeChange}
                    sx={{ width: 100 }}
                  />
                </Box>
                
                <Box>
                  <IconButton 
                    onClick={() => setIsLiked(!isLiked)}
                    sx={{ color: 'white' }}
                  >
                    {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                  </IconButton>
                  <IconButton 
                    onClick={handleDownload}
                    sx={{ color: 'white' }}
                  >
                    <Download />
                  </IconButton>
                </Box>
              </Box>
              
              {/* Additional song info */}
              {song.album && (
                <Typography color="rgba(255,255,255,0.6)" sx={{ mt: 3 }}>
                  Album: {song.album}
                </Typography>
              )}
              {song.genre && (
                <Typography color="rgba(255,255,255,0.6)">
                  Genre: {song.genre}
                </Typography>
              )}
            </GlassCard>
          </Grid>
        </Grid>
      </Container>
    </GradientBackground>
  );
};

export default PlayerPage;