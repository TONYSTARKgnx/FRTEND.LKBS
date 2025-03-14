// SongForm.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card,
  TextField,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Drawer,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
  useMediaQuery,
  useTheme,
  Tooltip,
  Alert,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import { motion } from 'framer-motion';

// Styled Components
const MainContent = styled(Box)({
  flexGrow: 1,
  minHeight: '100vh',
  background: '#130822', // Deep purple background
  paddingBottom: '40px'
});

const StyledAppBar = styled(AppBar)({
  background: '#1C0C31', // Darker purple for app bar
  boxShadow: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
});

const ContentCard = styled(Card)({
  background: '#220D3B', // Dark purple card background
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  color: 'white',
  overflow: 'hidden',
});

const CardHeader = styled(Box)({
  padding: '16px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
});

const PurpleButton = styled(Button)({
  background: '#B935FF', // Bright purple button
  color: 'white',
  textTransform: 'none',
  borderRadius: '8px',
  '&:hover': {
    background: '#A020F0',
  },
});

const ActionButton = styled(Button)({
  textTransform: 'none',
  borderRadius: '8px',
});

const LogoutButton = styled(Button)({
  color: 'white',
  borderColor: 'rgba(255, 255, 255, 0.3)',
  '&:hover': {
    borderColor: 'white',
    background: 'rgba(255, 255, 255, 0.1)',
  },
});

const MenuIconContainer = styled(Avatar)(({ selected }) => ({
  backgroundColor: selected ? 'rgba(185, 53, 255, 0.3)' : 'transparent',
  width: 40,
  height: 40,
  marginRight: '12px',
  '& .MuiSvgIcon-root': {
    color: selected ? '#B935FF' : 'rgba(255, 255, 255, 0.7)',
  }
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#B935FF',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#B935FF',
  },
  '& .MuiInputBase-input': {
    color: 'white',
  },
});

const StyledFormControl = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#B935FF',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#B935FF',
  },
  '& .MuiSelect-icon': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const PreviewImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '200px',
  borderRadius: '8px',
  objectFit: 'contain',
});

// Main Component
const SongForm = () => {
  const { slug } = useParams();
  const isEditMode = !!slug;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: [],
    release_date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
    cover_image: null,
    audio_file: null
  });
  
  // File previews
  const [coverPreview, setCoverPreview] = useState('');
  const [audioFileName, setAudioFileName] = useState('');
  
  // Form validation
  const [formErrors, setFormErrors] = useState({});
  
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };
  
  // Input change handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        cover_image: file
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear validation error
      if (formErrors.cover_image) {
        setFormErrors({
          ...formErrors,
          cover_image: ''
        });
      }
    }
  };
  
  const handleAudioFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        audio_file: file
      });
      
      setAudioFileName(file.name);
      
      // Clear validation error
      if (formErrors.audio_file) {
        setFormErrors({
          ...formErrors,
          audio_file: ''
        });
      }
    }
  };
  
  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.artist) {
      errors.artist = 'Artist is required';
    }
    
    if (!formData.release_date) {
      errors.release_date = 'Release date is required';
    } else {
      // Simple date validation
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(formData.release_date)) {
        errors.release_date = 'Invalid date format. Use YYYY-MM-DD';
      }
    }
    
    // Only require audio file in create mode
    if (!isEditMode && !formData.audio_file) {
      errors.audio_file = 'Audio file is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    const accessToken = localStorage.getItem('accessToken');
    
    try {
      // Create FormData object for file uploads
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('artist', formData.artist);
      
      // Handle multiple genres
      if (Array.isArray(formData.genre)) {
        formData.genre.forEach(genreId => {
          formDataToSend.append('genre', genreId);
        });
      } else if (formData.genre) {
        formDataToSend.append('genre', formData.genre);
      }
      
      formDataToSend.append('release_date', formData.release_date);
      
      // Only append files if they exist
      if (formData.cover_image && typeof formData.cover_image !== 'string') {
        formDataToSend.append('cover_image', formData.cover_image);
      }
      
      if (formData.audio_file) {
        formDataToSend.append('audio_file', formData.audio_file);
      }
      
      // Make API request - different endpoint for create vs update
      const url = isEditMode
        ? `https://lookbass.com/api/admin/songs/${slug}/`
        : 'https://lookbass.com/api/admin/songs/';
      
      const method = isEditMode ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formDataToSend
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save song');
      }
      
      // Success message
      setSuccess(isEditMode ? 'Song updated successfully' : 'Song created successfully');
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/admin/songs');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving song:', error);
      setError(error.message || 'Failed to save song');
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch song data, artists and genres
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/admin/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        // Fetch artists and genres in parallel
        const [artistsResponse, genresResponse] = await Promise.all([
          fetch('https://lookbass.com/api/admin/artists/', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          }),
          fetch('https://lookbass.com/api/admin/genres/', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          })
        ]);
        
        // Check auth issues
        if (!artistsResponse.ok || !genresResponse.ok) {
          if (artistsResponse.status === 401 || genresResponse.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/admin/login');
            return;
          }
          throw new Error('Failed to fetch data');
        }
        
        const artistsData = await artistsResponse.json();
        const genresData = await genresResponse.json();
        
        setArtists(artistsData.results || artistsData || []);
        setGenres(genresData.results || genresData || []);
        
        // If in edit mode, fetch current song data
        if (isEditMode) {
          const songResponse = await fetch(`https://lookbass.com/api/admin/songs/${slug}/`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
          
          if (!songResponse.ok) {
            throw new Error('Failed to fetch song data');
          }
          
          const songData = await songResponse.json();
          
          // Format the date to YYYY-MM-DD for the input field
          let releaseDate = songData.release_date;
          if (releaseDate && !releaseDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            releaseDate = new Date(releaseDate).toISOString().split('T')[0];
          }
          
          // Set form data with song values
          setFormData({
            title: songData.title || '',
            artist: songData.artist?.id || songData.artist || '',
            genre: songData.genre?.map(g => g.id || g) || [],
            release_date: releaseDate || new Date().toISOString().split('T')[0],
            cover_image: songData.cover_image || null,
            audio_file: null // Don't set audio file, user will upload new one if needed
          });
          
          // Set previews
          if (songData.cover_image) {
            setCoverPreview(songData.cover_image);
          }
          
          if (songData.audio_file) {
            // Get filename from URL
            const fileName = songData.audio_file.split('/').pop();
            setAudioFileName(fileName || 'Current audio file');
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
        setLoading(false);
        
        // Set sample data for testing
        setArtists([
          { id: 1, name: 'Kutub Ali' },
          { id: 2, name: 'Sample Artist' }
        ]);
        
        setGenres([
          { id: 1, name: 'Pop' },
          { id: 2, name: 'Rock' },
          { id: 3, name: 'Hip Hop' }
        ]);
      }
    };
    
    fetchData();
  }, [navigate, slug, isEditMode]);

  // Loading state
  if (loading) {
    return (
      <Box 
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#130822',
        }}
      >
        <CircularProgress 
          sx={{ 
            color: '#B935FF',
            mb: 2
          }} 
          size={50} 
        />
        <Typography variant="h6" sx={{ color: 'white', opacity: 0.8 }}>
          {isEditMode ? 'Loading song data...' : 'Loading...'}
        </Typography>
      </Box>
    );
  }
  
  return (
    <MainContent>
      {/* App Bar */}
      <StyledAppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {isEditMode ? 'Edit Song' : 'Add New Song'}
          </Typography>
          <Tooltip title="Logout">
            <LogoutButton 
              variant="outlined" 
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              size="small"
            >
              Logout
            </LogoutButton>
          </Tooltip>
        </Toolbar>
      </StyledAppBar>

      {/* Content */}
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/songs')}
            sx={{ color: 'white' }}
          >
            Back to Songs
          </Button>
        </Box>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ContentCard>
            <CardHeader>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {isEditMode ? 'Edit Song Details' : 'Add New Song'}
              </Typography>
            </CardHeader>
            
            <Box sx={{ p: 3 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(211, 47, 47, 0.1)', color: '#ef9a9a' }}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert severity="success" sx={{ mb: 3, bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#a5d6a7' }}>
                  {success}
                </Alert>
              )}
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Song Title */}
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Song Title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      error={!!formErrors.title}
                      helperText={formErrors.title}
                      required
                    />
                  </Grid>
                  
                  {/* Artist */}
                  <Grid item xs={12} md={6}>
                    <StyledFormControl fullWidth error={!!formErrors.artist}>
                      <InputLabel id="artist-label">Artist</InputLabel>
                      <Select
                        labelId="artist-label"
                        name="artist"
                        value={formData.artist}
                        onChange={handleInputChange}
                        label="Artist"
                        required
                      >
                        <MenuItem value=""><em>Select Artist</em></MenuItem>
                        {artists.map(artist => (
                          <MenuItem key={artist.id} value={artist.id}>{artist.name}</MenuItem>
                        ))}
                      </Select>
                      {formErrors.artist && <FormHelperText>{formErrors.artist}</FormHelperText>}
                    </StyledFormControl>
                  </Grid>
                  
                  {/* Genre */}
                  <Grid item xs={12} md={6}>
                    <StyledFormControl fullWidth>
                      <InputLabel id="genre-label">Genre (Optional)</InputLabel>
                      <Select
                        labelId="genre-label"
                        name="genre"
                        multiple
                        value={formData.genre}
                        onChange={handleInputChange}
                        label="Genre (Optional)"
                      >
                        {genres.map(genre => (
                          <MenuItem key={genre.id} value={genre.id}>{genre.name}</MenuItem>
                        ))}
                      </Select>
                    </StyledFormControl>
                  </Grid>
                  
                  {/* Release Date - Simple TextField instead of DatePicker */}
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      label="Release Date"
                      name="release_date"
                      type="date"
                      value={formData.release_date}
                      onChange={handleInputChange}
                      error={!!formErrors.release_date}
                      helperText={formErrors.release_date || "Format: YYYY-MM-DD"}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                    />
                  </Grid>
                  
                  {/* Cover Image */}
                  <Grid item xs={12} md={6}>
                    <Typography sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                      Cover Image {isEditMode ? '(Optional)' : ''}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        sx={{
                          bgcolor: 'rgba(185, 53, 255, 0.2)',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(185, 53, 255, 0.3)',
                          }
                        }}
                      >
                        Choose Cover Image
                        <VisuallyHiddenInput 
                          type="file" 
                          accept="image/*"
                          onChange={handleCoverImageChange}
                        />
                      </Button>
                    </Box>
                    
                    {formErrors.cover_image && (
                      <FormHelperText error>{formErrors.cover_image}</FormHelperText>
                    )}
                    
                    {coverPreview && (
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <PreviewImage src={coverPreview} alt="Cover preview" />
                      </Box>
                    )}
                  </Grid>
                  
                  {/* Audio File */}
                  <Grid item xs={12}>
                    <Typography sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                      Audio File {isEditMode ? '(Optional)' : '*'}
                    </Typography>
                    
                    <Button
                      component="label"
                      variant="contained"
                      fullWidth
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        bgcolor: 'rgba(185, 53, 255, 0.2)',
                        color: 'white',
                        p: 3,
                        '&:hover': {
                          bgcolor: 'rgba(185, 53, 255, 0.3)',
                        }
                      }}
                    >
                      {audioFileName ? 'Change Audio File' : 'Choose Audio File'}
                      <VisuallyHiddenInput 
                        type="file" 
                        accept="audio/*"
                        onChange={handleAudioFileChange}
                      />
                    </Button>
                    
                    {audioFileName && (
                      <Typography sx={{ mt: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                        Selected: {audioFileName}
                      </Typography>
                    )}
                    
                    {formErrors.audio_file && (
                      <FormHelperText error>{formErrors.audio_file}</FormHelperText>
                    )}
                  </Grid>
                  
                  {/* Submit Button */}
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/admin/songs')}
                        sx={{ 
                          color: 'white',
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          '&:hover': {
                            borderColor: 'white',
                          }
                        }}
                      >
                        Cancel
                      </Button>
                      
                      <PurpleButton
                        type="submit"
                        variant="contained"
                        disabled={submitting}
                        startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      >
                        {submitting ? 'Saving...' : isEditMode ? 'Update Song' : 'Save Song'}
                      </PurpleButton>
                    </Stack>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </ContentCard>
        </motion.div>
      </Container>
      
      {/* Drawer for mobile navigation */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: 240,
            background: '#1C0C31', // Dark purple background for drawer
            color: 'white',
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: '#B935FF', mr: 1 }}>
              <MusicNoteIcon />
            </Avatar>
            <Typography variant="h6">
              LookBase Admin
            </Typography>
          </Box>
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 2 }} />
          <List>
            <ListItem button onClick={() => navigate('/admin/dashboard')} sx={{ borderRadius: '8px', mb: 1 }}>
              <MenuIconContainer>
                <DashboardIcon />
              </MenuIconContainer>
              <ListItemText primary="Dashboard" />
            </ListItem>
            
            <ListItem button selected sx={{ borderRadius: '8px', mb: 1 }}>
              <MenuIconContainer selected={true}>
                <MusicNoteIcon />
              </MenuIconContainer>
              <ListItemText primary="Songs" />
            </ListItem>
            
            <ListItem button onClick={() => navigate('/admin/artists')} sx={{ borderRadius: '8px', mb: 1 }}>
              <MenuIconContainer>
                <PersonIcon />
              </MenuIconContainer>
              <ListItemText primary="Artists" />
            </ListItem>
            
            <ListItem button onClick={() => navigate('/admin/genres')} sx={{ borderRadius: '8px', mb: 1 }}>
              <MenuIconContainer>
                <CategoryIcon />
              </MenuIconContainer>
              <ListItemText primary="Genres" />
            </ListItem>
          </List>
          
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 2 }} />
          
          <ListItem 
            button 
            onClick={handleLogout} 
            sx={{ 
              borderRadius: '8px',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            <MenuIconContainer>
              <LogoutIcon />
            </MenuIconContainer>
            <ListItemText primary="Logout" />
          </ListItem>
        </Box>
      </Drawer>
    </MainContent>
  );
};

export default SongForm;