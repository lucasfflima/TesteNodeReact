import React, { useState, useEffect } from 'react';
import '../../styles/Dashboard.css';

function Dashboard() {
  // Estados pra guardar os dados do usuário, loading e playlists
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    // Função pra buscar os dados do usuário quando o componente carrega
    const fetchUserData = async () => {
      try {
        // Pega o token de acesso que guardamos no login
        const token = localStorage.getItem('access_token');
        
        // Busca os dados do perfil do usuário na API do Spotify
        const userResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = await userResponse.json();
        setUser(userData);
        
        // Busca as playlists do usuário (limitado a 5 pra não sobrecarregar)
        const playlistsResponse = await fetch('https://api.spotify.com/v1/me/playlists?limit=5', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const playlistsData = await playlistsResponse.json();
        setPlaylists(playlistsData);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Executa a função assim que o componente montar
    fetchUserData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Carregando...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="user-profile">
        <h1 className="page-title">Perfil Spotify</h1>
        
        {/* Só renderiza se tiver dados do usuário */}
        {user && (
          <div className="profile-card">
            {/* Header com foto do perfil e dados básicos */}
            <div className="profile-header">
              {/* Verifica se tem foto e mostra, senão usa placeholder */}
              {user.images && user.images.length > 0 ? (
                <img 
                  src={user.images[0].url} 
                  alt="Profile" 
                  className="profile-image" 
                />
              ) : (
                <div className="profile-image-placeholder">
                  <i className="fas fa-user"></i>
                </div>
              )}
              <div className="profile-info">
                {/* Nome do usuário com aquela fonte grandona */}
                <h2>{user.display_name}</h2>
                {/* Username com @ na frente pra ficar estiloso */}
                <p className="username">@{user.id}</p>
                {/* Número de seguidores com tratamento pra caso seja null */}
                <p className="followers">{user.followers?.total || 0} seguidores</p>
                {user.product && (
                  <div className="subscription-badge">
                    {user.product === 'premium' ? 'Premium' : 'Free'}
                  </div>
                )}
              </div>
            </div>
            
            {/* Cards com as estatísticas do usuário */}
            <div className="profile-stats">
              {/* Card do país */}
              <div className="stat-item">
                <span className="stat-label">País</span>
                <span className="stat-value">{user.country || 'N/A'}</span>
              </div>
              {/* Card do email */}
              <div className="stat-item">
                <span className="stat-label">Email</span>
                <span className="stat-value">{user.email || 'N/A'}</span>
              </div>
              {/* Card do tipo de conta com primeira letra maiúscula */}
              <div className="stat-item">
                <span className="stat-label">Tipo de conta</span>
                <span className="stat-value">{user.product ? user.product.charAt(0).toUpperCase() + user.product.slice(1) : 'N/A'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;