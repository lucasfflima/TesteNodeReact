import React, { useState, useEffect } from 'react';
import { getUserPlaylists } from '../../services/spotifyService';
import CreatePlaylist from './CreatePlaylist';
import '../../styles/UserPlaylist.css';

function UserPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await getUserPlaylists();
        setPlaylists(data.items);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const refreshPlaylists = async () => {
    setLoading(true);
    try {
      const data = await getUserPlaylists();
      setPlaylists(data.items);
    } catch (error) {
      console.error('Error refreshing playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="playlists-container">
      <div className="playlists-header">
        <div className="header-text">
          <h1>Minhas Playlists</h1>
          <p>Sua coleção pessoal de playlists.</p>
        </div>
        <button 
          className="create-playlist-btn"
          onClick={() => setShowCreateForm(true)}
        >
          Criar Playlist
        </button>
      </div>
      
      {showCreateForm && (
        <CreatePlaylist 
          onClose={() => setShowCreateForm(false)}
          onPlaylistCreated={refreshPlaylists}
        />
      )}
      
      {loading ? (
        <div className="loading-spinner">Loading playlists...</div>
      ) : (
        <div className="playlists-grid">
          {playlists.map(playlist => (
            <a 
              href={playlist.external_urls.spotify} 
              target="_blank" 
              rel="noopener noreferrer"
              className="playlist-card"
              key={playlist.id}
            >
              {playlist.images && playlist.images.length > 0 ? (
                <img src={playlist.images[0].url} alt={playlist.name} className="playlist-image" />
              ) : (
                <div className="playlist-image-placeholder">
                  <i className="fas fa-music"></i>
                </div>
              )}
              <div className="playlist-info">
                <h3 className="playlist-name">{playlist.name}</h3>
                <p className="playlist-tracks">{playlist.tracks.total} tracks</p>
                <p className="playlist-owner">By: {playlist.owner.display_name}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserPlaylists;