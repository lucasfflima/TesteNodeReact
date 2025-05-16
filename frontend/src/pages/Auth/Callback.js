import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Callback() {
  const [status, setStatus] = useState('Processando autenticação...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extrai parâmetros da URL
    const queryParams = new URLSearchParams(location.search);
    const accessToken = queryParams.get('access_token');
    const refreshToken = queryParams.get('refresh_token');
    const expiresIn = queryParams.get('expires_in');
    const error = queryParams.get('error');
    
    // Se houver erro, redireciona para login
    if (error) {
      console.error('Erro na autenticação:', error);
      setStatus(`Erro na autenticação: ${error}`);
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    // Se tiver o token, salva no localStorage e redireciona
    if (accessToken) {
      try {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken || '');
        localStorage.setItem('expires_at', Date.now() + (parseInt(expiresIn, 10) * 1000));
        
        // Verificar se foi salvo corretamente
        const savedToken = localStorage.getItem('access_token');
        
        setStatus('Autenticação bem-sucedida! Redirecionando...');
        
        // Redireciona para a página inicial
        setTimeout(() => {
          navigate('/');  // Alterado para '/' em vez de '/dashboard'
        }, 1000);
      } catch (e) {
        console.error('Erro ao salvar no localStorage:', e);
        setStatus('Erro ao salvar dados de autenticação.');
      }
    } else {
      // Se não tiver token, algo deu errado
      console.error('Token não encontrado na URL');
      setStatus('Token não encontrado. Redirecionando para login...');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate, location]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h2>{status}</h2>
      <p>Verifique o console para mais informações.</p>
      <div 
        className="spinner"
        style={{
          border: '4px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '50%',
          borderTop: '4px solid #3498db',
          width: '30px',
          height: '30px',
          animation: 'spin 1s linear infinite',
          marginTop: '20px'
        }}
      ></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default Callback;
