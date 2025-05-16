import React, { useState, useEffect } from 'react';
// import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://api.spotify.com/v1/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Carregando...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="user-profile">
        <h1>Perfil Spotify</h1>
        
        {user && (
          <div className="profile-card">
            <div className="profile-header">
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
                <h2>{user.display_name}</h2>
                <p className="username">@{user.id}</p>
                <p className="followers">{user.followers?.total || 0} seguidores</p>
              </div>
            </div>
            
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-label">País</span>
                <span className="stat-value">{user.country || 'N/A'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Tipo</span>
                <span className="stat-value">{user.product === 'premium' ? 'Premium' : 'Free'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Email</span>
                <span className="stat-value">{user.email || 'N/A'}</span>
              </div>
            </div>
            
            <div className="profile-actions">
              <a 
                href={user.external_urls?.spotify} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="spotify-profile-link"
              >
                Abrir no Spotify
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;