const { URLSearchParams } = require('url');
const { getEnv } = require('../config/env');

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

const ensureEnv = () => {
  const { clientId, clientSecret, redirectUri } = getEnv();
  if (!clientId || !clientSecret || !redirectUri) {
    throw new AppError('Spotify credentials not configured', 500);
  }
};

const buildAuthorizeUrl = () => {
  ensureEnv();
  const { clientId, redirectUri } = getEnv();
  const scope = 'user-read-private user-read-email user-top-read playlist-read-private playlist-modify-public';
  const state = Math.random().toString(36).substring(2, 15);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope,
    state,
  });

  return { url: `https://accounts.spotify.com/authorize?${params.toString()}`, state };
};

const exchangeCodeForTokens = async (code) => {
  ensureEnv();
  const { clientId, clientSecret, redirectUri } = getEnv();

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body: new URLSearchParams({
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new AppError('Invalid token exchange', response.status);
  }

  return data;
};

const refreshTokens = async (refreshToken) => {
  ensureEnv();
  const { clientId, clientSecret } = getEnv();

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new AppError('Erro ao renovar token', response.status);
  }

  return data;
};

module.exports = {
  AppError,
  buildAuthorizeUrl,
  exchangeCodeForTokens,
  refreshTokens,
};