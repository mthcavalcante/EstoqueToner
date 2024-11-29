import React from 'react';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <ul>
                <li><a href="/toners">Cadastrar Toner</a></li>
                <li><a href="/estoque">Estoque Atual</a></li>
                <li><a href="/historico">Histórico de Movimentação</a></li>
            </ul>
        </aside>
    );
}

export default Sidebar;
