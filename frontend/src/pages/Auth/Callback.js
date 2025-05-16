import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleCallbackParams } from '../../utils/auth';
// import './Callback.css';

function Callback() {
  const [status, setStatus] = useState('Processando autenticação...');
  const navigate = useNavigate();

  useEffect(() => {
    const processAuth = async () => {
      try {
        const success = handleCallbackParams();
        
        if (success) {
          setStatus('Autenticação bem-sucedida! Redirecionando...');
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        } else {
          setStatus('Falha na autenticação. Redirecionando para o login...');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      } catch (error) {
        console.error('Error during authentication:', error);
        setStatus('Erro durante a autenticação. Redirecionando para o login...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    };

    processAuth();
  }, [navigate]);

  return (
    <div className="callback-container">
      <div className="callback-content">
        <div className="spinner"></div>
        <p className="status-message">{status}</p>
      </div>
    </div>
  );
}

export default Callback;
