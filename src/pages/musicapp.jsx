import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Slider,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import {
  Home,
  Search,
  Clear,
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
  Download
} from '@mui/icons-material';

// Styled Components
const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(to top, #1a1a1a, #2d1657)',
  paddingBottom: theme.spacing(12)
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(35, 9, 32, 0.53)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  boxShadow: 'none'
}));

const GlassAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(35, 9, 32, 0.53)',
  backdropFilter: 'blur(10px)',
  boxShadow: 'none',
  borderRadius: '0 0 24px 24px'
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 50,
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

// Song Card Component
const SongCard = ({ song, onPlay, onDownload, isPlaying }) => {
  const handlePlay = () => {
    onPlay(song.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="img"
            src={song.cover || "/placeholder.jpg"}  // Use song.cover if available
            alt={song.name}
            sx={{ 
              width: 64, 
              height: 64, 
              borderRadius: 2,
              objectFit: 'cover' // Add this to ensure proper image fitting
            }}
            onError={(e) => {
              e.target.src = "/placeholder.jpg"; // Fallback if cover fails to load
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" color="white">
              {song.name}
            </Typography>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
              {song.artist}
            </Typography>
            <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
              {song.plays.toLocaleString()} plays
            </Typography>
          </Box>
          <Box>
            <IconButton 
              color="primary" 
              onClick={handlePlay}
              sx={{
                '&:hover': {
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s'
                }
              }}
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton 
              color="primary" 
              onClick={() => onDownload(song.id)}
              sx={{
                '&:hover': {
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s'
                }
              }}
            >
              <Download />
            </IconButton>
          </Box>
        </CardContent>
      </GlassCard>
    </motion.div>
  );
};

// Main Page Component
const MusicPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [currentSong, setCurrentSong] = useState(null);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [latestSongs, setLatestSongs] = useState([]);
  const [playingSongId, setPlayingSongId] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Music Player Component
  const MusicPlayer = ({ currentSong, onClose }) => {
    const theme = useTheme();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const audioRef = useRef(null);

    // Add audio functionality
    useEffect(() => {
      if (currentSong?.audioUrl && audioRef.current) {
        audioRef.current.src = currentSong.audioUrl;
        if (isPlaying) {
          audioRef.current.play().catch(e => console.error('Playback error:', e));
        }
      }
    }, [currentSong, isPlaying]);

    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play().catch(e => console.error('Playback error:', e));
        }
        setIsPlaying(!isPlaying);
      }
    };

    const handleNext = () => {
      const allSongs = [...trendingSongs, ...latestSongs];
      const currentIndex = allSongs.findIndex(song => song.id === currentSong.id);
      
      if (currentIndex !== -1 && currentIndex < allSongs.length - 1) {
        const nextSong = allSongs[currentIndex + 1];
        setCurrentSong(nextSong);
        setPlayingSongId(nextSong.id);
        // Reset state for the new song
        setCurrentTime(0);
        setIsPlaying(true);
      }
    };
    
    const handlePrevious = () => {
      const allSongs = [...trendingSongs, ...latestSongs];
      const currentIndex = allSongs.findIndex(song => song.id === currentSong.id);
      
      if (currentIndex !== -1 && currentIndex > 0) {
        const prevSong = allSongs[currentIndex - 1];
        setCurrentSong(prevSong);
        setPlayingSongId(prevSong.id);
        // Reset state for the new song
        setCurrentTime(0);
        setIsPlaying(true);
      }
    };

    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
      >
        {/* Add audio element */}
        <audio
          ref={audioRef}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onEnded={() => setIsPlaying(false)}
        />

        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(12px)',
            py: 2,
            px: 3,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.5)',
          }}
        >
          <Container>
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
              {/* Song Info */}
              <Grid item xs={12} sm={3} display="flex" alignItems="center" gap={2}>
                <Box
                  component="img"
                  src={currentSong?.cover || '/placeholder.jpg'}
                  alt={currentSong?.name}
                  sx={{ width: 56, height: 56, borderRadius: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1" color="white" noWrap>
                    {currentSong?.name || 'Unknown Song'}
                  </Typography>
                  <Typography variant="caption" color="rgba(255, 255, 255, 0.7)" noWrap>
                    {currentSong?.artist || 'Unknown Artist'}
                  </Typography>
                </Box>
              </Grid>

              {/* Playback Controls */}
              <Grid item xs={12} sm={6} display="flex" flexDirection="column" alignItems="center">
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <Shuffle />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'white' }} onClick={handlePrevious}>
                    <SkipPrevious />
                  </IconButton>
                  <IconButton
                    sx={{
                      color: 'white',
                      bgcolor: 'primary.main',
                      '&:hover': { bgcolor: 'primary.dark' },
                      p: 1.5,
                    }}
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'white' }} onClick={handleNext}>
                    <SkipNext />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <Repeat />
                  </IconButton>
                </Box>
                <Box display="flex" alignItems="center" gap={1} width="100%">
                  <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
                    {formatTime(currentTime)}
                  </Typography>
                  <Slider
                    size="small"
                    value={currentTime}
                    max={duration || 100}
                    onChange={(_, value) => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = value;
                        setCurrentTime(value);
                      }
                    }}
                    sx={{ color: 'primary.main', flex: 1 }}
                  />
                  <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
                    {formatTime(duration)}
                  </Typography>
                </Box>
              </Grid>

              {/* Volume Control */}
              <Grid item xs={12} sm={3} display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                <IconButton
                  size="small"
                  onClick={() => {
                    setIsMuted(!isMuted);
                    if (audioRef.current) {
                      audioRef.current.muted = !isMuted;
                    }
                  }}
                  sx={{ color: 'white', display: { xs: 'none', sm: 'block' } }}
                >
                  {isMuted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
                <Slider
                  size="small"
                  value={isMuted ? 0 : volume}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(_, value) => {
                    setVolume(value);
                    if (audioRef.current) {
                      audioRef.current.volume = value;
                    }
                  }}
                  sx={{ width: 100, color: 'primary.main', display: { xs: 'none', sm: 'block' } }}
                />
              </Grid>
            </Grid>
          </Container>
        </Paper>
      </motion.div>
    );
  };

  // Fetch songs data
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // Use the featured endpoint we created in the backend
        const response = await fetch('https://lookbass.com/api/featured/?limit=1000');
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          throw new Error('Failed to fetch songs');
        }
        
        const data = await response.json();
        console.log('API Response data:', data);
        
        if (data.trendingSongs && data.latestSongs) {
          // Format the data to match what SongCard expects
          const formattedTrendingSongs = data.trendingSongs.map(song => ({
            id: song.id,
            name: song.title,
            artist: song.artist?.name || "Unknown Artist",
            cover: formatImageUrl(song.cover_image),
            plays: song.play_count || 0,
            audioUrl: `https://lookbass.com/api/songs/${song.slug}/stream/`,
            slug: song.slug // Important: store the slug for API calls
          }));
          
          const formattedLatestSongs = data.latestSongs.map(song => ({
            id: song.id,
            name: song.title,
            artist: song.artist?.name || "Unknown Artist",
            cover: formatImageUrl(song.cover_image),
            plays: song.play_count || 0,
            audioUrl: `https://lookbass.com/api/songs/${song.slug}/stream/`,
            slug: song.slug // Important: store the slug for API calls
          }));
          
          setTrendingSongs(formattedTrendingSongs);
          setLatestSongs(formattedLatestSongs);
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
        // Set default/dummy data on error
        setTrendingSongs([
          { id: 1, name: "Sample Trending Song", artist: "Sample Artist", plays: 1000, cover: "/placeholder.jpg" },
          { id: 2, name: "Another Hit", artist: "Popular Singer", plays: 850, cover: "/placeholder.jpg" }
        ]);
        setLatestSongs([
          { id: 3, name: "New Release", artist: "New Artist", plays: 250, cover: "/placeholder.jpg" },
          { id: 4, name: "Fresh Track", artist: "Upcoming Talent", plays: 120, cover: "/placeholder.jpg" }
        ]);
      }
    };

    // Helper function to format image URLs
    const formatImageUrl = (imageUrl) => {
      if (!imageUrl) return "/placeholder.jpg";
      return imageUrl.startsWith('http') ? imageUrl : `https://lookbass.com${imageUrl}`;
    };

    fetchSongs();
  }, []);

  // Replace your existing handleSearch function with this simpler version
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      // If empty search, restore original data
      fetchSongs();
      return;
    }

    try {
      console.log('Searching for:', searchValue);
      
      const response = await fetch(`https://lookbass.com/api/search/?q=${encodeURIComponent(searchValue)}`);
      
      if (!response.ok) {
        throw new Error(`Search request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Search results:', data);
      
      if (data.results && Array.isArray(data.results)) {
        // Convert the data format
        const formattedSongs = data.results.map(song => ({
          id: song.id,
          name: song.title,
          artist: song.artist?.name || "Unknown Artist",
          cover: song.cover_image ? (song.cover_image.startsWith('http') ? song.cover_image : `https://lookbass.com${song.cover_image}`) : "/placeholder.jpg",
          plays: song.play_count || 0,
          slug: song.slug,
          audioUrl: `https://lookbass.com/api/songs/${song.slug}/stream/`
        }));
        
        // Display search results
        setTrendingSongs(formattedSongs);
        setLatestSongs([]); // Hide latest songs when showing search results
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // Add this function to reset the search
  const clearSearch = () => {
    setSearchValue('');
    fetchSongs(); // Fetch original data again
  };
    
  // Also define the fetchSongs function if it's not already defined
  const fetchSongs = async () => {
    try {
      const response = await fetch('https://lookbass.com/api/featured/');
      
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      
      const data = await response.json();
      
      if (data.trendingSongs && data.latestSongs) {
        // Format the data
        const formattedTrendingSongs = data.trendingSongs.map(song => ({
          id: song.id,
          name: song.title,
          artist: song.artist?.name || "Unknown Artist",
          cover: song.cover_image ? (song.cover_image.startsWith('http') ? song.cover_image : `https://lookbass.com${song.cover_image}`) : "/placeholder.jpg",
          plays: song.play_count || 0,
          slug: song.slug,
          audioUrl: `https://lookbass.com/api/songs/${song.slug}/stream/`
        }));
        
        const formattedLatestSongs = data.latestSongs.map(song => ({
          id: song.id,
          name: song.title,
          artist: song.artist?.name || "Unknown Artist",
          cover: song.cover_image ? (song.cover_image.startsWith('http') ? song.cover_image : `https://lookbass.com${song.cover_image}`) : "/placeholder.jpg",
          plays: song.play_count || 0,
          slug: song.slug,
          audioUrl: `https://lookbass.com/api/songs/${song.slug}/stream/`
        }));
        
        setTrendingSongs(formattedTrendingSongs);
        setLatestSongs(formattedLatestSongs);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchValue.trim() !== '') {
        handleSearch();
      }
    }, 500); // 500ms delay
  
    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  const handlePlay = async (songId) => {
    try {
      // If clicking on the currently playing song, toggle play/pause
      if (playingSongId === songId && currentSong) {
        // Just toggle the play state without setting a new song
        const audioElement = document.querySelector('audio');
        if (audioElement) {
          if (audioElement.paused) {
            audioElement.play();
          } else {
            audioElement.pause();
          }
          return;
        }
      }
      
      // Set the new playing song ID
      setPlayingSongId(songId);
      
      // Increment play count in the backend
      await fetch(`https://lookbass.com/api/songs/${songId}/stream/`, {
        method: 'GET'
      });
      
      // Find the song in our existing lists
      const song = [...trendingSongs, ...latestSongs].find(s => s.id === songId);
      if (song) {
        setCurrentSong(song);
      }
    } catch (error) {
      console.error('Error playing song:', error);
      // Fallback to just setting the current song without API call
      const song = [...trendingSongs, ...latestSongs].find(s => s.id === songId);
      if (song) {
        setCurrentSong(song);
        setPlayingSongId(songId);
      }
    }
  };
  
  const handleDownload = async (songId) => {
    try {
      // Find the song to get its slug
      const song = [...trendingSongs, ...latestSongs].find(s => s.id === songId);
      if (!song) {
        console.error('Song not found for download:', songId);
        return;
      }
      
      // Use the song's slug for the API call
      const downloadUrl = `https://lookbass.com/api/songs/${song.slug}/download/`;
      console.log('Downloading from:', downloadUrl);
      
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

  return (
    <GradientBackground sx={{ width: '100%' }}>
      <GlassAppBar position="sticky">
        <Container sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h5" component="h1" color="white" fontWeight="bold">
              Music Hub
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton 
              sx={{ color: 'white' }} 
              onClick={() => navigate('/')}
            >
              <Home />
            </IconButton>
          </Box>
          <SearchField
            fullWidth
            variant="outlined"
            placeholder="Search songs..."
            value={searchValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setSearchValue(newValue);
              
              // Automatically restore original data when search is cleared
              if (newValue === '') {
                fetchSongs();
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    onClick={handleSearch}
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: searchValue && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchValue('');
                      fetchSongs(); // Restore original data when clearing search
                    }}
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Container>
      </GlassAppBar>
  
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="white" sx={{ mb: 2 }}>
          Trending Songs
        </Typography>
        <Grid container spacing={2}>
          {trendingSongs.map((song) => (
            <Grid item xs={12} md={6} key={song.id}>
              <SongCard
                song={song}
                onPlay={handlePlay}
                onDownload={handleDownload}
                isPlaying={playingSongId === song.id && currentSong?.id === song.id}
              />
            </Grid>
          ))}
        </Grid>
  
        <Typography variant="h6" color="white" sx={{ mb: 2, mt: 4 }}>
          Latest Songs
        </Typography>
        <Grid container spacing={2}>
          {latestSongs.map((song) => (
            <Grid item xs={12} md={6} key={song.id}>
              <SongCard
                song={song}
                onPlay={handlePlay}
                onDownload={handleDownload}
                isPlaying={playingSongId === song.id && currentSong?.id === song.id}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
  
      <AnimatePresence>
        {currentSong && (
          <MusicPlayer
            currentSong={currentSong}
            onClose={() => setCurrentSong(null)}
          />
        )}
      </AnimatePresence>
    </GradientBackground>
  );
};

export default MusicPage;