import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = Boolean(localStorage.getItem('admin_token'));
  const showLogout = isAdmin && location.pathname.startsWith('/dashboard');

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/auth');
  };

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ mb: 2 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" color="inherit" component="div">
            LEARNERS'S LICENSE PORTAL
          </Typography>
        </Box>
        {showLogout && (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 