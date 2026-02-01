import api from './apiClient';

// 1. Obter artistas mais ouvidos
export const getTopArtists = (timeRange = 'medium_term', limit = 20, offset = 0) =>
  api.get('/me/top/artists', { params: { time_range: timeRange, limit, offset } })
    .then((res) => res.data);

// 2. Obter álbuns de um artista
export const getArtist = (artistId) =>
  api.get(`/artists/${artistId}`).then((res) => res.data);

export const getArtistAlbums = (artistId, limit = 20) =>
  api.get(`/artists/${artistId}/albums`, { params: { limit, include_groups: 'album' } })
    .then((res) => res.data);

// 3. Obter playlists do usuário
export const getUserPlaylists = (limit = 20, offset = 0) =>
  api.get('/me/playlists', { params: { limit, offset } })
    .then((res) => res.data);

// 4. Criar uma nova playlist
export const createPlaylist = async (userId, name, description = '', isPublic = true) => {
  if (!userId) {
    throw new Error('User ID is required to create a playlist');
  }

  return api.post(`/users/${userId}/playlists`, {
    name,
    description,
    public: isPublic,
  }).then((res) => res.data);
};

// 5. Adicionar músicas à playlist
export const addTracksToPlaylist = (playlistId, uris) => {
  if (!playlistId || !uris || !uris.length) {
    throw new Error('Playlist ID and track URIs are required');
  }

  return api.post(`/playlists/${playlistId}/tracks`, { uris })
    .then((res) => res.data);
};

// 6. Obter dados do usuário
export const getUserProfile = () => api.get('/me').then((res) => res.data);

// 7. Verificar estado da autenticação
export const checkAuthStatus = () => !!localStorage.getItem('access_token');