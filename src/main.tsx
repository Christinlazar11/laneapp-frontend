import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1D4ED8', // Blue
      dark: '#2C3E50',
    },
    secondary: {
      main: '#10B981', // Green
    },
    background: {
      default: '#F3F4F6', // Light Gray
      paper: '#FFFFFF', // White
    },
    info: {
      main: '#38BDF8', // Sky Blue
    },
    warning: {
      main: '#FACC15', // Soft Yellow
    },
    success: {
      main: '#16A34A', // Green
    },
    text: {
      primary: '#2C3E50',
      secondary: '#1D4ED8',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: 0.5,
    },
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        containedPrimary: {
          color: '#fff',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: '#F3F4F6',
          },
          '&:hover': {
            backgroundColor: '#E5E7EB',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
