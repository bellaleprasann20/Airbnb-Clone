import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 1. Import your Providers
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Import global styles
import './styles/globals.css';

/**
 * Root initialization
 * We wrap <App /> with both Providers so the whole site
 * has access to Login data and Currency/Language settings.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>
);