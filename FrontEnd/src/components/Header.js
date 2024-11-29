import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <h1>Controle de Estoque de Toners</h1>
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/history">Histórico</Link></li>
          <li><Link to="/toner">Gerenciar Toners</Link></li>
          <li><Link to="/users">Usuários</Link></li>
        </ul>
      </nav>
    </header>
  );
};

const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
};

// No componente Header
<button onClick={handleLogout}>Sair</button>;

export default Header;