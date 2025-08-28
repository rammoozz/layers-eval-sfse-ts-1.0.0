import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { NotificationProvider } from './hooks/useNotifications';
import { AppStateProvider } from './hooks/useAppState';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={
                  <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 transition-colors duration-500">
                    <Header />
                    <main className="container mx-auto px-4 py-8">
                      <Routes>
                        <Route path="/" element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } />
                        <Route path="/settings" element={
                          <ProtectedRoute>
                            <Settings />
                          </ProtectedRoute>
                        } />
                      </Routes>
                    </main>
                  </div>
                } />
              </Routes>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </AppStateProvider>
    </ThemeProvider>
  );
}

export default App;