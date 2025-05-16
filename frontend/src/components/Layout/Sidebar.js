import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  
  return (
    <div className="sidebar">
      <div className="logo">
        <svg viewBox="0 0 1134 340" className="spotify-logo">
          <path fill="white" d="M8 171c0 92 76 168 168 168s168-76 168-168S268 4 176 4 8 79 8 171zm230 78c-39-24-89-30-147-17-14 2-16-18-4-20 64-15 118-8 162 19 11 7 0 24-11 18zm17-45c-45-28-114-36-167-20-17 5-23-21-7-25 61-18 136-9 188 23 14 9 0 31-14 22zM80 133c-17 6-28-23-9-30 59-18 159-15 221 22 17 9 1 37-17 27-54-32-144-35-195-19zm379 91c-17 0-33-6-47-20-1 0-1 1-1 1l-16 19c-1 1-1 2 0 3 18 16 40 24 64 24 34 0 55-19 55-47 0-24-15-37-50-46-29-7-34-12-34-22s10-16 23-16 25 5 39 15c0 0 1 1 2 1s1-1 1-1l14-20c1-1 1-1 0-2-16-13-35-20-56-20-31 0-53 19-53 46 0 29 20 38 52 46 28 6 32 12 32 22 0 11-10 17-25 17z"/>
        </svg>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <Link 
              to="/dashboard" 
              className={location.pathname === '/dashboard' ? 'active' : ''}
            >
              <i className="fas fa-home"></i>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/artists" 
              className={location.pathname === '/artists' ? 'active' : ''}
            >
              <i className="fas fa-user"></i>
              <span>Top Artists</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/playlists" 
              className={location.pathname === '/playlists' ? 'active' : ''}
            >
              <i className="fas fa-music"></i>
              <span>Playlists</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <a 
          href="https://github.com/lucasfflima" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="github-link"
        >
          <i className="fab fa-github"></i> GitHub
        </a>
      </div>
    </div>
  );
}

export default Sidebar;
