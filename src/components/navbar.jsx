import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const pages = [
    { id: 'home', label: 'Home' },
    { id: 'download', label: 'Download', to: '/download' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handlePageClick = (page) => {
    // If the page has a 'to' property, use navigation
    if (page.to) {
      navigate(page.to);
      if (mobileOpen) {
        handleDrawerToggle();
      }
      return;
    }

    // Otherwise, use scrolling
    const element = document.getElementById(page.id);
    if (!element) {
      console.warn(`Element with id ${page.id} not found`);
      return;
    }

    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    if (mobileOpen) {
      handleDrawerToggle();
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: '100vw',
        background: 'linear-gradient(to top, #1a1a1a, #2d1657)',
        borderBottom: '0.1px solid #3d2173',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
            }}
          >
            <img src="/src/assets/logoLk.png" alt="LoopBass Logo" width={80} />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LoopBass
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {pages.map((page) => (
              <Button
                key={page.id}
                onClick={() => handlePageClick(page)}
                sx={{
                  color: 'white',
                  display: 'block',
                  mx: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                {page.label}
              </Button>
            ))}
          </Box>

          <Drawer
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: 240,
                background: 'linear-gradient(45deg, #2d1657 30%, #4a2b96 90%)',
                color: 'white'
              },
            }}
          >
            <List>
              {pages.map((page) => (
                <ListItem 
                  button 
                  key={page.id}
                  onClick={() => handlePageClick(page)}
                >
                  <ListItemText primary={page.label} />
                </ListItem>
              ))}
            </List>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;