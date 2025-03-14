// SongsPage.jsx
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
  Tooltip,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import GetAppIcon from '@mui/icons-material/GetApp';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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

const SongImage = styled(Avatar)({
  width: 50,
  height: 50,
  borderRadius: '8px',
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

// Main Component
const SongsPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);
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
      setFilteredSongs(songs);
    } else {
      const filtered = songs.filter(song => 
        song.title.toLowerCase().includes(query) || 
        (song.artist_details?.name || '').toLowerCase().includes(query)
      );
      setFilteredSongs(filtered);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (song) => {
    setSongToDelete(song);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!songToDelete) return;
    
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`https://lookbass.com/api/admin/songs/${songToDelete.slug || songToDelete.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete song');
      }
      
      // Remove song from state
      setSongs(songs.filter(song => song.id !== songToDelete.id));
      setFilteredSongs(filteredSongs.filter(song => song.id !== songToDelete.id));
      
      setDeleteDialogOpen(false);
      setSongToDelete(null);
    } catch (error) {
      console.error('Error deleting song:', error);
      setError('Failed to delete song');
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSongToDelete(null);
  };

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/admin/login');
      return;
    }

    // Fetch songs
    const fetchSongs = async () => {
      try {
        const response = await fetch('https://lookbass.com/api/admin/songs/', {
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
          throw new Error('Failed to fetch songs');
        }
        
        const data = await response.json();
        const songsList = data.results || data || [];
        
        // If no songs, add a sample one for demo
        if (songsList.length === 0) {
          setSongs([{
            id: 1,
            title: "sanam teri ma ki kasam",
            artist_details: { name: "kutub Ali" },
            play_count: 0,
            download_count: 0,
            cover_image: "",
            release_date: "2023-01-01"
          }]);
          setFilteredSongs([{
            id: 1,
            title: "sanam teri ma ki kasam",
            artist_details: { name: "kutub Ali" },
            play_count: 0,
            download_count: 0,
            cover_image: "",
            release_date: "2023-01-01"
          }]);
        } else {
          setSongs(songsList);
          setFilteredSongs(songsList);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching songs:', error);
        setError('Failed to load songs');
        
        // Add sample data for demo even if there's an error
        setSongs([{
          id: 1,
          title: "sanam teri ma ki kasam",
          artist_details: { name: "kutub Ali" },
          play_count: 0,
          download_count: 0,
          cover_image: "",
          release_date: "2023-01-01"
        }]);
        setFilteredSongs([{
          id: 1,
          title: "sanam teri ma ki kasam",
          artist_details: { name: "kutub Ali" },
          play_count: 0,
          download_count: 0,
          cover_image: "",
          release_date: "2023-01-01"
        }]);
        
        setLoading(false);
      }
    };
    
    fetchSongs();
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
          Loading songs...
        </Typography>
      </Box>
    );
  }

  // Empty rows calculation for pagination
  const emptyRows = page > 0
    ? Math.max(0, (1 + page) * rowsPerPage - filteredSongs.length)
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
            Manage Songs
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
                  All Songs
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <SearchField
                    placeholder="Search songs..."
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
                    onClick={() => navigate('/admin/songs/add')}
                    variant="contained"
                    size="small"
                  >
                    Add New Song
                  </PurpleButton>
                </Box>
              </Box>
            </CardHeader>
            
            <TableContainer component={Paper} sx={{ boxShadow: 'none', background: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableHeaderCell>Song</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="left">Artist</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="center">Release Date</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="center">
                      <PlayArrowIcon fontSize="small" />
                    </StyledTableHeaderCell>
                    <StyledTableHeaderCell align="center">
                      <GetAppIcon fontSize="small" />
                    </StyledTableHeaderCell>
                    <StyledTableHeaderCell align="right">Actions</StyledTableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSongs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((song) => (
                    <TableRow key={song.id} hover sx={{ '&:hover': { background: 'rgba(255, 255, 255, 0.05)' } }}>
                      <StyledTableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SongImage 
                            src={song.cover_image} 
                            variant="rounded"
                            alt={song.title}
                          >
                            <MusicNoteIcon />
                          </SongImage>
                          <Typography sx={{ ml: 2, fontWeight: 500 }}>
                            {song.title}
                          </Typography>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell align="left">{song.artist_details?.name || 'Unknown Artist'}</StyledTableCell>
                      <StyledTableCell align="center">
                        {new Date(song.release_date).toLocaleDateString()}
                      </StyledTableCell>
                      <StyledTableCell align="center">{song.play_count || 0}</StyledTableCell>
                      <StyledTableCell align="center">{song.download_count || 0}</StyledTableCell>
                      <StyledTableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Tooltip title="Edit Song">
                            <ActionButton 
                              onClick={() => navigate(`/admin/songs/${song.slug || song.id}/edit`)}
                              sx={{ color: '#B935FF' }}
                            >
                              <EditIcon fontSize="small" />
                            </ActionButton>
                          </Tooltip>
                          <Tooltip title="Delete Song">
                            <ActionButton 
                              onClick={() => handleDeleteClick(song)}
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
                      <StyledTableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredSongs.length}
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
            Are you sure you want to delete the song "{songToDelete?.title}"? This action cannot be undone.
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
    </MainContent>
  );
};

export default SongsPage;