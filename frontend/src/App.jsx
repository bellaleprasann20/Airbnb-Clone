import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext'; // Ensure this is used

const App = () => {
  return (
    <AppProvider> {/* Wrap with AppProvider */}
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: '12px',
                  background: '#333',
                  color: '#fff',
                },
              }}
            />

            <Navbar />

            {/* Added relative and z-0 to ensure it doesn't get buried */}
            <main className="flex-grow relative z-0">
              <AppRoutes />
            </main>

            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </AppProvider>
  );
};

export default App;