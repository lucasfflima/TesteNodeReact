import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';
import Login from './pages/Auth/Login';
import Callback from './pages/Auth/Callback';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import TopArtists from './pages/Artists/TopArtists';
import ArtistDetail from './pages/Artists/ArtistDetail';
import UserPlaylists from './pages/Playlists/UserPlaylists';
// import './App.css';

// Componente de rota privada
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}

function Layout() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />

        {/* Rotas protegidas dentro do Layout */}
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/artists" element={<TopArtists />} />
          <Route path="/artist/:artistId" element={<ArtistDetail />} />
          <Route path="/playlists" element={<UserPlaylists />} />
          
          {/* Redirecionar para dashboard como padrão para usuários autenticados */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;