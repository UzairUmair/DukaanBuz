import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext.jsx';
import { theme } from './theme/theme.js';
import App from './App.jsx';
import './styles/global.css';
import './styles/redesign.css';

createRoot(document.getElementById('root')).render(<StrictMode><ThemeProvider theme={theme}><CssBaseline /><AuthProvider><App /></AuthProvider></ThemeProvider></StrictMode>);
