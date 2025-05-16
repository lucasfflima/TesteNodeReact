import React from 'react';
import Sidebar from './Sidebar'; // Ajuste o caminho conforme necessário
import '../../styles/Layout.css';

function Layout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

export default Layout;