import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/history">Histórico</Link></li>
        <li><Link to="/toner">Gerenciar Toners</Link></li>
        <li><Link to="/users">Usuários</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;