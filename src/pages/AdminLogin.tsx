import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Stack, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import type { AlertColor } from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('error');
  const navigate = useNavigate();

  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/admin/login', { email, password });
      const data = response.data;
      console.log("data is",data)
      if (response.status === 200 && data.token) {
        localStorage.setItem('admin_token', data.token);
        navigate('/dashboard');
      } else {
        setSnackbarMsg(data.message || 'Login failed');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setSnackbarMsg(axiosError.response?.data?.message || 'Network error');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={3} sx={{ maxWidth: 500, width: '100%', mx: 'auto', p: { xs: 3, sm: 5 }, py: { xs: 4, sm: 6 } }}>
          <Typography variant="h4" gutterBottom align="center">Admin Login</Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                fullWidth
              />
              <Button type="submit" variant="contained" disabled={loading} size="large" fullWidth>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }} elevation={6} variant="filled">
          {snackbarMsg}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default AdminLogin;