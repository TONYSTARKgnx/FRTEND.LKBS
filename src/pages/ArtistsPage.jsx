// ArtistsPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
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
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
  minWidth: 'auto',
  padding: '5px',
  borderRadius: '4px',
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

const StyledTableCell = styled(TableCell)({
  color: 'white',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  padding: '16px',
});

const StyledTableHeaderCell = styled(TableCell)({
  color: 'white',
  backgroundColor: 'rgba(185, 53, 255, 0.1)',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  fontWeight: 600,
});

const ArtistImage = styled(Avatar)({
  width: 50,
  height: 50,
  borderRadius: '50%',
});

const SearchField = styled(TextField)({
  '& .MuiInputBase-root': {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  '& .MuiInputBase-input': {
    padding: '10px 14px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

// Dialog Components for Add/Edit Artist
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
  width: 100,
  height: 100,
  borderRadius: '50%',
  objectFit: 'cover',
  marginTop: '16px',
});

// Main Component
const ArtistsPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    image: null
  });
  
  // Preview state
  const [imagePreview, setImagePreview] = useState('');
  
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

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredArtists(artists);
    } else {
      const filtered = artists.filter(artist => 
        artist.name.toLowerCase().includes(query)
      );
      setFilteredArtists(filtered);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Dialog handlers
  const handleDeleteClick = (artist) => {
    setArtistToDelete(artist);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!artistToDelete) return;
    
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`https://lookbass.com/api/admin/artists/${artistToDelete.slug || artistToDelete.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete artist');
      }
      
      // Remove artist from state
      setArtists(artists.filter(artist => artist.id !== artistToDelete.id));
      setFilteredArtists(filteredArtists.filter(artist => artist.id !== artistToDelete.id));
      
      setDeleteDialogOpen(false);
      setArtistToDelete(null);
    } catch (error) {
      console.error('Error deleting artist:', error);
      setError('Failed to delete artist');
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setArtistToDelete(null);
  };
  
  const handleAddClick = () => {
    // Reset form data
    setFormData({
      name: '',
      bio: '',
      image: null
    });
    setImagePreview('');
    setDialogError('');
    setAddDialogOpen(true);
  };
  
  const handleEditClick = (artist) => {
    setFormData({
      id: artist.id,
      slug: artist.slug,
      name: artist.name,
      bio: artist.bio || '',
      image: null // Don't set the image, user will upload a new one if needed
    });
    
    if (artist.image) {
      setImagePreview(artist.image);
    } else {
      setImagePreview('');
    }
    
    setDialogError('');
    setEditDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setAddDialogOpen(false);
    setEditDialogOpen(false);
    setDialogError('');
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async () => {
    // Validate form
    if (!formData.name.trim()) {
      setDialogError('Name is required');
      return;
    }
    
    setDialogLoading(true);
    setDialogError('');
    
    const accessToken = localStorage.getItem('accessToken');
    
    try {
      // Create FormData object for file uploads
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('bio', formData.bio || '');
      
      // Only append image if it exists
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      // Make API request - different endpoint for create vs update
      const url = editDialogOpen
        ? `https://lookbass.com/api/admin/artists/${formData.slug || formData.id}/`
        : 'https://lookbass.com/api/admin/artists/';
      
      const method = editDialogOpen ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formDataToSend
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save artist');
      }
      
      const savedArtist = await response.json();
      
      // Update local state
      if (editDialogOpen) {
        setArtists(artists.map(artist => 
          artist.id === savedArtist.id ? savedArtist : artist
        ));
        setFilteredArtists(filteredArtists.map(artist => 
          artist.id === savedArtist.id ? savedArtist : artist
        ));
      } else {
        setArtists([savedArtist, ...artists]);
        setFilteredArtists([savedArtist, ...filteredArtists]);
      }
      
      // Close dialog
      handleDialogClose();
    } catch (error) {
      console.error('Error saving artist:', error);
      setDialogError(error.message || 'Failed to save artist');
    } finally {
      setDialogLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/admin/login');
      return;
    }

    // Fetch artists
    const fetchArtists = async () => {
      try {
        const response = await fetch('https://lookbass.com/api/admin/artists/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        // Check authentication
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/admin/login');
            return;
          }
          throw new Error('Failed to fetch artists');
        }
        
        const data = await response.json();
        const artistsList = data.results || data || [];
        
        // If no artists, add a sample one for demo
        if (artistsList.length === 0) {
          setArtists([{
            id: 1,
            name: "Kutub Ali",
            bio: "Sample artist bio",
            image: "",
            slug: "kutub-ali"
          }]);
          setFilteredArtists([{
            id: 1,
            name: "Kutub Ali",
            bio: "Sample artist bio",
            image: "",
            slug: "kutub-ali"
          }]);
        } else {
          setArtists(artistsList);
          setFilteredArtists(artistsList);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching artists:', error);
        setError('Failed to load artists');
        
        // Add sample data for demo even if there's an error
        setArtists([{
          id: 1,
          name: "Kutub Ali",
          bio: "Sample artist bio",
          image: "",
          slug: "kutub-ali"
        }]);
        setFilteredArtists([{
          id: 1,
          name: "Kutub Ali",
          bio: "Sample artist bio",
          image: "",
          slug: "kutub-ali"
        }]);
        
        setLoading(false);
      }
    };
    
    fetchArtists();
  }, [navigate]);

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
          Loading artists...
        </Typography>
      </Box>
    );
  }

  // Empty rows calculation for pagination
  const emptyRows = page > 0
    ? Math.max(0, (1 + page) * rowsPerPage - filteredArtists.length)
    : 0;

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
            Manage Artists
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
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ContentCard>
            <CardHeader>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  All Artists
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <SearchField
                    placeholder="Search artists..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    size="small"
                  />
                  
                  <PurpleButton
                    startIcon={<AddIcon />}
                    onClick={handleAddClick}
                    variant="contained"
                    size="small"
                  >
                    Add New Artist
                  </PurpleButton>
                </Box>
              </Box>
            </CardHeader>
            
            <TableContainer component={Paper} sx={{ boxShadow: 'none', background: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableHeaderCell>Artist</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="left">Bio</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="right">Actions</StyledTableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredArtists
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((artist) => (
                    <TableRow key={artist.id} hover sx={{ '&:hover': { background: 'rgba(255, 255, 255, 0.05)' } }}>
                      <StyledTableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ArtistImage 
                            src={artist.image} 
                            alt={artist.name}
                          >
                            <PersonIcon />
                          </ArtistImage>
                          <Typography sx={{ ml: 2, fontWeight: 500 }}>
                            {artist.name}
                          </Typography>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography 
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            maxWidth: '400px'
                          }}
                        >
                          {artist.bio || 'No bio available'}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Tooltip title="Edit Artist">
                            <ActionButton 
                              onClick={() => handleEditClick(artist)}
                              sx={{ color: '#B935FF' }}
                            >
                              <EditIcon fontSize="small" />
                            </ActionButton>
                          </Tooltip>
                          <Tooltip title="Delete Artist">
                            <ActionButton 
                              onClick={() => handleDeleteClick(artist)}
                              sx={{ color: '#f44336' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </ActionButton>
                          </Tooltip>
                        </Box>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 73 * emptyRows }}>
                      <StyledTableCell colSpan={3} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredArtists.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ 
                color: 'white',
                '.MuiSvgIcon-root': { color: 'white' },
                '.MuiTablePagination-selectIcon': { color: 'white' },
              }}
            />
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
            
            <ListItem button onClick={() => navigate('/admin/songs')} sx={{ borderRadius: '8px', mb: 1 }}>
              <MenuIconContainer>
                <MusicNoteIcon />
              </MenuIconContainer>
              <ListItemText primary="Songs" />
            </ListItem>
            
            <ListItem button selected sx={{ borderRadius: '8px', mb: 1 }}>
              <MenuIconContainer selected={true}>
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
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            bgcolor: '#220D3B',
            color: 'white',
            borderRadius: '12px',
          }
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Are you sure you want to delete the artist "{artistToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} sx={{ color: 'white' }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} sx={{ color: '#f44336' }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Artist Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            bgcolor: '#220D3B',
            color: 'white',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '100%'
          }
        }}
      >
        <DialogTitle>Add New Artist</DialogTitle>
        <DialogContent>
          {dialogError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {dialogError}
            </Typography>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <StyledTextField
                label="Artist Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <StyledTextField
                label="Bio (Optional)"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                Artist Image (Optional)
              </Typography>
              
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
                Choose Image
                <VisuallyHiddenInput 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              
              {imagePreview && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <PreviewImage src={imagePreview} alt="Artist preview" />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} sx={{ color: 'white' }}>
            Cancel
          </Button>
          <PurpleButton 
            onClick={handleSubmit}
            disabled={dialogLoading}
            startIcon={dialogLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {dialogLoading ? 'Saving...' : 'Save Artist'}
          </PurpleButton>
        </DialogActions>
      </Dialog>
      
      {/* Edit Artist Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            bgcolor: '#220D3B',
            color: 'white',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '100%'
          }
        }}
      >
        <DialogTitle>Edit Artist</DialogTitle>
        <DialogContent>
          {dialogError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {dialogError}
            </Typography>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <StyledTextField
                label="Artist Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <StyledTextField
                label="Bio (Optional)"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                Artist Image (Optional)
              </Typography>
              
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
                {imagePreview ? 'Change Image' : 'Choose Image'}
                <VisuallyHiddenInput 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              
              {imagePreview && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <PreviewImage src={imagePreview} alt="Artist preview" />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} sx={{ color: 'white' }}>
            Cancel
          </Button>
          <PurpleButton 
            onClick={handleSubmit}
            disabled={dialogLoading}
            startIcon={dialogLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {dialogLoading ? 'Saving...' : 'Update Artist'}
          </PurpleButton>
        </DialogActions>
      </Dialog>
    </MainContent>
  );
};

export default ArtistsPage;
