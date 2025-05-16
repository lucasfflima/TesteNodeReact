import axios from 'axios';

export const handleCallbackParams = () => {
  const hashParams = new URLSearchParams(window.location.search);
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');
  const expiresIn = hashParams.get('expires_in');
  
  if (accessToken) {
    // Save tokens to localStorage
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    
    // Set expiration time
    const expiryTime = Date.now() + (parseInt(expiresIn) * 1000);
    localStorage.setItem('expires_at', expiryTime);
    
    return true;
  }
  
  return false;
};

// Verifica se o token expirou
export const isTokenExpired = () => {
  const expiresAt = localStorage.getItem('expires_at');
  if (!expiresAt) return true;
  
  // Adiciona uma margem de segurança de 5 minutos
  return Date.now() > parseInt(expiresAt) - 300000;
};

// Renova o token de acesso usando o refresh token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('Refresh token não encontrado');
    }

    // Chamada para o endpoint do backend que lida com a renovação do token
    const response = await axios.post('/api/auth/refresh-token', {
      refresh_token: refreshToken
    });

    if (response.data && response.data.access_token) {
      // Atualiza os tokens no localStorage
      localStorage.setItem('access_token', response.data.access_token);
      if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }
      localStorage.setItem('expires_at', Date.now() + (response.data.expires_in * 1000));
      
      return response.data.access_token;
    } else {
      throw new Error('Resposta inválida ao renovar token');
    }
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    // Em caso de erro na renovação, redireciona para o login
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    window.location.href = '/login';
    throw error;
  }
};

// Função que obtém um token válido, renovando se necessário
export const getValidToken = async () => {
  if (isTokenExpired()) {
    return await refreshAccessToken();
  }
  return localStorage.getItem('access_token');
};

export const isAuthenticated = async () => {
  try {
    const token = await getValidToken();
    return !!token;
  } catch (error) {
    return false;
  }
};