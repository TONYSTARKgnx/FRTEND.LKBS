// app.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './pages/homepage';
import MusicPage from './pages/musicapp';
import PlayerPage from './pages/PlayerPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import SongsPage from './pages/SongsPage';
import SongForm from './pages/SongForm';
import ProtectedRoute from './components/ProtectedRoute';
import ArtistsPage from './pages/ArtistsPage';
import GenresPage from './pages/GenresPage';

// Import any other admin pages you need
// import SongsPage from './pages/admin/SongsPage';
// import ArtistsPage from './pages/admin/ArtistsPage';
// import GenresPage from './pages/admin/GenresPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/download" element={<MusicPage />} />
        <Route path="/player/:songId" element={<PlayerPage />} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/songs" 
          element={
            <ProtectedRoute>
              <SongsPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/songs/add" 
          element={
            <ProtectedRoute>
              <SongForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/songs/:slug/edit" 
          element={
            <ProtectedRoute>
              <SongForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/artists" 
          element={
            <ProtectedRoute>
              <ArtistsPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/genres" 
          element={
            <ProtectedRoute>
              <GenresPage />
            </ProtectedRoute>
          } 
        />
        
        

        {/* Add more protected admin routes as needed */}
        {/* 
        <Route 
          path="/admin/songs" 
          element={
            <ProtectedRoute>
              <SongsPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/artists" 
          element={
            <ProtectedRoute>
              <ArtistsPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/genres" 
          element={
            <ProtectedRoute>
              <GenresPage />
            </ProtectedRoute>
          } 
        />
        */}
        
        {/* Catch-all route for admin section - redirect to dashboard if logged in */}
        <Route 
          path="/admin" 
          element={<Navigate to="/admin/dashboard" replace />} 
        />
        
        {/* Catch-all route for unknown routes */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;