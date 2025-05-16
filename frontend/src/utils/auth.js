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
    localStorage.setItem('token_expiry', expiryTime);
    
    return true;
  }
  
  return false;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  const expiry = localStorage.getItem('token_expiry');
  
  if (!token || !expiry) {
    return false;
  }
  
  // Check if token is expired
  if (Date.now() > parseInt(expiry)) {
    // Token expired, attempt to refresh
    return refreshAccessToken();
  }
  
  return true;
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!refreshToken) {
    return false;
  }
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    
    const data = await response.json();
    
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      
      const expiryTime = Date.now() + (data.expires_in * 1000);
      localStorage.setItem('token_expiry', expiryTime);
      
      return true;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
  
  return false;
};