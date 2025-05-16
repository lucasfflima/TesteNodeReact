import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Callback from './pages/Auth/Callback';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
import UserPlaylist from './pages/Playlists/UserPlaylists';
import TopArtists from './pages/Artists/TopArtists';
import ArtistDetail from './pages/Artists/ArtistDetail';
// Importe outras páginas conforme necessário

// Função auxiliar para verificar se o usuário está autenticado
const isAuthenticated = () => {
  return localStorage.getItem('access_token') !== null;
};

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/playlists" element={
          <ProtectedRoute>
            <UserPlaylist />
          </ProtectedRoute>
        } />
        
        <Route path="/top-artists" element={
          <ProtectedRoute>
            <TopArtists />
          </ProtectedRoute>
        } />
        
        <Route path="/artist/:id" element={
          <ProtectedRoute>
            <ArtistDetail />
          </ProtectedRoute>
        } />
        
        {/* Adicione outras rotas protegidas conforme necessário */}
      </Routes>
    </Router>
  );
}

export default App;