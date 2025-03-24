import React, { Suspense } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.scss';
import { SettingsProvider } from './contexts/SettingsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/theme.scss';

// Components
import ThemeSwitcher from './components/ThemeSwitcher/ThemeSwitcher';
import TopBar from './components/TopBar/TopBar';

// Pages
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Verify from './components/Verify/Verify';
import Info from './pages/Info/Info';
import Settings from './pages/Settings/Settings';
import TypingScreen from './pages/TypingScreen/TypingScreen';

// Loading fallback
const LoadingFallback = () => <div className="loading">Loading...</div>;

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <Router>
          <div className="App">
            <TopBar />
            <ThemeSwitcher />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route
                  path="/typing"
                  element={
                    <ProtectedRoute>
                      <TypingScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/project/:projectId"
                  element={
                    <ProtectedRoute>
                      <TypingScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/info"
                  element={
                    <ProtectedRoute>
                      <Info />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify" element={<Verify />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
