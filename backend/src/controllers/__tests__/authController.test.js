const fetch = require('node-fetch');
const { login, callback, refreshToken } = require('../authController');

// Garantimos que o fetch seja mockado
jest.mock('node-fetch');

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

    // Limpa os mocks antes de cada teste
    jest.clearAllMocks();
  });

  describe('login', () => {
    test('deve redirecionar para a URL de autorização do Spotify', () => {
      // Execute a função
      login(req, res);

      // Verifique se res.redirect foi chamado com uma URL contendo os parâmetros corretos
      expect(res.redirect).toHaveBeenCalledTimes(1);
      const redirectUrl = res.redirect.mock.calls[0][0];
      
      expect(redirectUrl).toContain('https://accounts.spotify.com/authorize');
      expect(redirectUrl).toContain(`client_id=${process.env.SPOTIFY_CLIENT_ID}`);
      expect(redirectUrl).toContain('response_type=code');
      expect(redirectUrl).toContain(`redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}`);
      expect(redirectUrl).toContain('scope=');
      expect(redirectUrl).toContain('state=');
    });
  });

  describe('callback', () => {
    test('deve redirecionar para erro quando state é nulo', async () => {
      // Configure a requisição
      req.query = { code: 'test-code', state: null };

      // Execute a função
      await callback(req, res);

      // Verifique se foi redirecionado para a página de erro
      expect(res.redirect).toHaveBeenCalledWith('/#error=state_mismatch');
    });

    test('deve redirecionar para o frontend com erro quando a API do Spotify falhar', async () => {
      // Configure a requisição
      req.query = { code: 'test-code', state: 'test-state' };

      // Configure o mock do fetch para retornar um erro
      const mockJsonPromise = Promise.resolve({ error: 'invalid_grant' });
      const mockFetchPromise = Promise.resolve({
        ok: false,
        json: () => mockJsonPromise
      });
      fetch.mockImplementation(() => mockFetchPromise);

      // Execute a função
      await callback(req, res);

      // Verifique se foi redirecionado para o frontend com erro
      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('callback?error=invalid_token')
      );
    });
  });

  describe('refreshToken', () => {
    test('deve retornar erro 400 quando não fornecido refresh_token', async () => {
      // Configure a requisição sem refresh_token
      req.body = {};

      // Execute a função
      await refreshToken(req, res);

      // Verifique se retornou status 400 com mensagem de erro
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Refresh token é obrigatório' });
    });
  });
});