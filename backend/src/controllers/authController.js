const { getEnv } = require('../config/env');
const {
  AppError,
  buildAuthorizeUrl,
  exchangeCodeForTokens,
  refreshTokens,
} = require('../services/spotifyAuthService');

const login = (req, res, next) => {
  try {
    const { url } = buildAuthorizeUrl();
    return res.redirect(url);
  } catch (error) {
    return next(error);
  }
};

const callback = async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const frontendUrl = getEnv().frontendUrl || 'http://localhost:3000';
  
  if (state === null) {
    return res.redirect('/#error=state_mismatch');
  }
  
  try {
    const data = await exchangeCodeForTokens(code);

    return res.redirect(`${frontendUrl}/callback?` + 
      `access_token=${encodeURIComponent(data.access_token)}` + 
      `&refresh_token=${encodeURIComponent(data.refresh_token)}` + 
      `&expires_in=${data.expires_in}`);
  } catch (error) {
    const message = error instanceof AppError ? error.message : 'invalid_token';
    return res.redirect(`${frontendUrl}/callback?error=${encodeURIComponent(message)}`);
  }
};

const refreshToken = async (req, res, next) => {
  const { refresh_token } = req.body;
  
  if (!refresh_token) {
    return res.status(400).json({ error: 'Refresh token é obrigatório' });
  }

  try {
    const data = await refreshTokens(refresh_token);

    return res.json({
      access_token: data.access_token,
      expires_in: data.expires_in,
      refresh_token: data.refresh_token || refresh_token,
    });
  } catch (error) {
    if (error instanceof AppError && error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return next(error);
  }
};

module.exports = {
  login,
  callback,
  refreshToken,
};