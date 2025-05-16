require('dotenv').config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

const login = (req, res) => {
  const scope = 'user-read-private user-read-email user-top-read playlist-read-private playlist-modify-public';
  const state = Math.random().toString(36).substring(2, 15);
  
  const authUrl = 'https://accounts.spotify.com/authorize?' +
    `client_id=${CLIENT_ID}&` +
    'response_type=code&' +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `scope=${encodeURIComponent(scope)}&` +
    `state=${state}`;
  
  res.redirect(authUrl);
};

const callback = async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  
  if (state === null) {
    res.redirect('/#error=state_mismatch');
    return;
  }
  
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
      },
      body: new URLSearchParams({
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/callback?` + 
        `access_token=${encodeURIComponent(data.access_token)}` + 
        `&refresh_token=${encodeURIComponent(data.refresh_token)}` + 
        `&expires_in=${data.expires_in}`);
    } else {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/callback?error=invalid_token`);
    }
  } catch (error) {
    console.error('Error during token exchange:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/callback?error=${encodeURIComponent(error.message)}`);
  }
};

const refreshToken = async (req, res) => {
  const { refresh_token } = req.body;
  
  if (!refresh_token) {
    return res.status(400).json({ error: 'Refresh token é obrigatório' });
  }
  
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // A resposta de refresh_token do Spotify nem sempre inclui um novo refresh_token
      res.json({
        access_token: data.access_token,
        expires_in: data.expires_in,
        refresh_token: data.refresh_token || refresh_token // Use o refresh_token existente se não houver um novo
      });
    } else {
      console.error('Erro ao renovar token:', data);
      res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('Erro durante renovação de token:', error);
    res.status(500).json({ error: 'Erro interno ao renovar token' });
  }
};

module.exports = {
  login,
  callback,
  refreshToken
};