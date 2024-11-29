import React from 'react';

const Header = () => {
    return (
        <header className="header">
            <h1>Controle de Estoque de Toners</h1>
            <nav>
                <ul>
                    <li><a href="/">Dashboard</a></li>
                    <li><a href="/entrada">Registrar Entrada</a></li>
                    <li><a href="/saida">Registrar Saída</a></li>
                    <li><a href="/relatorios">Relatórios</a></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
