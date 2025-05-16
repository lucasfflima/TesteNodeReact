const BASE_URL = 'https://api.spotify.com/v1';

// Função auxiliar para fazer requisições autenticadas
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  const defaultOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  
  const response = await fetch(`${BASE_URL + endpoint}`, {
    ...defaultOptions,
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.statusText}`);
  }
  
  return response.json();
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
export const createPlaylist = (userId, name, description = '', isPublic = true) => {
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
  return fetchWithAuth(`/playlists/${playlistId}/tracks`, {
    method: 'POST',
    body: JSON.stringify({ uris })
  });
};

// 6. Obter dados do usuário
export const getUserProfile = () => {
  return fetchWithAuth('/me');
};