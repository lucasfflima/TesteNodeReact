const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const options = {
    key: fs.readFileSync(__dirname + '/localhost-key.pem'),
    cert: fs.readFileSync(__dirname + '/localhost.pem')
};

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

const login = (req, res) => {
  const scope = 'user-read-private user-read-email user-top-read';
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
      res.json({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in
      });
    } else {
      res.json({ error: 'Invalid token' });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
};

const refreshToken = async (req, res) => {
  const { refresh_token } = req.body;
  
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
    res.json(data);
  } catch (error) {
    res.json({ error: error.message });
  }
};

app.get('/login', login);
app.get('/callback', callback);
app.post('/refresh_token', refreshToken);

https.createServer(options, app).listen(3001, () => {
  console.log('Server is running on https://localhost:3001');
});