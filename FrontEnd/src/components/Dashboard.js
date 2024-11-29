import React from 'react';
import StockList from './StockList';

const Dashboard = () => {
    return (
        <main className="dashboard">
            <h2>Status do Estoque</h2>
            <div className="cards">
                <div className="card">
                    <h3>Estoque Atual</h3>
                    <p>50 Toners</p>
                </div>
                <div className="card">
                    <h3>Alertas</h3>
                    <p>Sem alertas no momento.</p>
                </div>
            </div>
            <StockList />
        </main>
    );
}

export default Dashboard;
