const parseOrigins = (origins) => {
  if (!origins) return [];
  return origins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const getEnv = () => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const port = process.env.PORT || 3001;

  return {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    frontendUrl,
    port,
    corsOrigins: parseOrigins(process.env.CORS_ORIGINS || frontendUrl),
  };
};

module.exports = { getEnv };