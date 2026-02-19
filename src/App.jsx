import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Projects from './pages/Projects';
import Profile from './pages/Profile';
import AIAssistant from './pages/AIAssistant';
import AuthCallback from './pages/AuthCallback';
import ProfileSystem from './components/Auth/ProfileSystem';
import './App.css';

// Auth tekshirish
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('st_token');
  const user = localStorage.getItem('st_user');
  
  if (!token || !user) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <MenuBar />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/auth" element={<ProfileSystem />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Protected routes */}
            <Route 
              path="/projects" 
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            {/* Profile Edit - YANGI ✅ */}
            <Route 
              path="/profile/edit" 
              element={
                <ProtectedRoute>
                  <Profile editMode={true} />
                </ProtectedRoute>
              } 
            />
            {/* Settings - YANGI ✅ */}
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Profile settingsMode={true} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai-assistant" 
              element={
                <ProtectedRoute>
                  <AIAssistant />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;