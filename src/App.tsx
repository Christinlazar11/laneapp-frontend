import ApplicationForm from './components/ApplicationForm';
import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Box
        sx={{
          minHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          pt: 6,
          bgcolor: '#f5f5f5',
        }}
      >
        <Routes>
          <Route path="/auth" element={<ProtectedRoute redirectIfAuth><AdminLogin /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/*" element={<ApplicationForm />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;
