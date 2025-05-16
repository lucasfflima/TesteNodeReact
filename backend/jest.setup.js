const fetch = require('node-fetch');
jest.mock('node-fetch');

// Define as variáveis de ambiente para os testes
process.env.SPOTIFY_CLIENT_ID = 'test-client-id';
process.env.SPOTIFY_CLIENT_SECRET = 'test-client-secret';
process.env.SPOTIFY_REDIRECT_URI = 'http://localhost:8888/callback';
process.env.FRONTEND_URL = 'http://localhost:3000';