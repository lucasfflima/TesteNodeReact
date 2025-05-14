const getTopArtists = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const timeRange = req.query.time_range || 'medium_term'; // short_term, medium_term, long_term
  const limit = req.query.limit || 20;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserPlaylists = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const limit = req.query.limit || 20;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/playlists?limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTopArtists,
  getUserPlaylists
};