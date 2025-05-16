import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMusic, faDownload, faUser } from '@fortawesome/free-solid-svg-icons';
import { faCirclePlay } from '@fortawesome/free-regular-svg-icons';
import '../../styles/Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  
  useEffect(() => {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome from automatically showing the prompt
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install button
      setShowInstallButton(true);
    });
    
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }
  }, []);
  
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the installation prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We no longer need the prompt
    setDeferredPrompt(null);
    
    // Hide the install button if the app was installed
    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }
  };
  
  return (
    <div className="sidebar">
      <div className="logo">
        <img 
          src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png" 
          alt="Spotify" 
          className="spotify-logo" 
        />
      </div>
      <nav className="nav">
        <ul>
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              <FontAwesomeIcon icon={faHome} />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/top-artists" 
              className={location.pathname === '/top-artists' ? 'active' : ''}
            >
              <FontAwesomeIcon icon={faCirclePlay} />
              <span>Artistas</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/playlists" 
              className={location.pathname === '/playlists' ? 'active' : ''}
            >
              <FontAwesomeIcon icon={faMusic} />
              <span>Playlists</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/profile" 
              className={location.pathname === '/profile' ? 'active' : ''}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>Perfil</span>
            </Link>
          </li>
        </ul>
      </nav>
      {showInstallButton && (
        <div className="sidebar-footer">
          <button 
            onClick={handleInstallClick}
            className="install-spotify-button"
          >
            <FontAwesomeIcon icon={faDownload} /> Instalar App
          </button>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
