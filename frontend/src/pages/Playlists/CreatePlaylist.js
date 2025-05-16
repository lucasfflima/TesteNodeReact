import React, { useState, useEffect } from 'react';
import { createPlaylist, getUserProfile } from '../../services/spotifyService';
// import './CreatePlaylist.css';

function CreatePlaylist({ onClose, onPlaylistCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get user ID for playlist creation
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfile();
        setUserId(userData.id);
      } catch (err) {
        setError('Failed to get user profile');
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Playlist name is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await createPlaylist(userId, name, description, isPublic);
      onPlaylistCreated();
      onClose();
    } catch (err) {
      setError('Failed to create playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-playlist-modal">
      <div className="create-playlist-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Create New Playlist</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="playlist-name">Name</label>
            <input
              type="text"
              id="playlist-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Playlist"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="playlist-description">Description</label>
            <textarea
              id="playlist-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="playlist-public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <label htmlFor="playlist-public">Make playlist public</label>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Playlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePlaylist;