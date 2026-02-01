const { login, callback, refreshToken } = require('../authController');
const {
  buildAuthorizeUrl,
  exchangeCodeForTokens,
  refreshTokens,
} = require('../../services/spotifyAuthService');

jest.mock('../../services/spotifyAuthService');

// Mock do módulo dotenv
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

describe('authController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      body: {}
    };
    res = {
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  describe('login', () => {
    test('deve redirecionar para a URL de autorização do Spotify', () => {
      buildAuthorizeUrl.mockReturnValue({ url: 'https://accounts.spotify.com/authorize?state=abc', state: 'abc' });

      login(req, res);

      expect(buildAuthorizeUrl).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('https://accounts.spotify.com/authorize?state=abc');
    });
  });

  describe('callback', () => {
    test('deve redirecionar para erro quando state é nulo', async () => {
      req.query = { code: 'test-code', state: null };

      await callback(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/#error=state_mismatch');
    });

    test('deve redirecionar para o frontend com erro quando a API do Spotify falhar', async () => {
      req.query = { code: 'test-code', state: 'test-state' };

      exchangeCodeForTokens.mockRejectedValue(new Error('invalid_token'));

      await callback(req, res);

      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('callback?error=invalid_token')
      );
    });
  });

  describe('refreshToken', () => {
    test('deve retornar erro 400 quando não fornecido refresh_token', async () => {
      req.body = {};

      await refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Refresh token é obrigatório' });
    });

    test('deve renovar token com sucesso', async () => {
      req.body = { refresh_token: 'valid-refresh' };
      refreshTokens.mockResolvedValue({ access_token: 'new', expires_in: 3600, refresh_token: 'new-refresh' });

      await refreshToken(req, res, jest.fn());

      expect(refreshTokens).toHaveBeenCalledWith('valid-refresh');
      expect(res.json).toHaveBeenCalledWith({
        access_token: 'new',
        expires_in: 3600,
        refresh_token: 'new-refresh',
      });
    });
  });
});