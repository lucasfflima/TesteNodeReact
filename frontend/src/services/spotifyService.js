const BASE_URL = 'https://api.spotify.com/v1';

// Improved fetchWithAuth function with better error handling
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    // Redirect to login if no token is available
    window.location.href = '/login';
    throw new Error('No access token available');
  }
  
  const defaultOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
    });
    
    if (response.status === 401) {
      // Token expired - need to refresh
      localStorage.removeItem('access_token');
      window.location.href = '/login';
      throw new Error('Session expired, please login again');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Spotify API error: ${response.status} ${response.statusText} - ${errorData.error?.message || ''}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// 1. Obter artistas mais ouvidos
export const getTopArtists = (timeRange = 'medium_term', limit = 20) => {
  return fetchWithAuth(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
};

// 2. Obter álbuns de um artista
export const getArtistAlbums = (artistId, limit = 20) => {
  return fetchWithAuth(`/artists/${artistId}/albums?limit=${limit}`);
};

// 3. Obter playlists do usuário
export const getUserPlaylists = (limit = 20) => {
  return fetchWithAuth(`/me/playlists?limit=${limit}`);
};

// 4. Criar uma nova playlist
export const createPlaylist = async (userId, name, description = '', isPublic = true) => {
  if (!userId) {
    throw new Error('User ID is required to create a playlist');
  }
  
  return fetchWithAuth(`/users/${userId}/playlists`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      description,
      public: isPublic
    })
  });
};

// 5. Adicionar músicas à playlist
export const addTracksToPlaylist = (playlistId, uris) => {
  if (!playlistId || !uris || !uris.length) {
    throw new Error('Playlist ID and track URIs are required');
  }
  
  return fetchWithAuth(`/playlists/${playlistId}/tracks`, {
    method: 'POST',
    body: JSON.stringify({ uris })
  });
};

// 6. Obter dados do usuário
export const getUserProfile = () => {
  return fetchWithAuth('/me');
};

// 7. Verificar estado da autenticação
export const checkAuthStatus = () => {
  const token = localStorage.getItem('access_token');
  return !!token;
};