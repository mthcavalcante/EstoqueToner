import React from 'react';

const StockList = ({ toners }) => {
    return (
        <div className="stock-list">
            <h3>Lista de Estoque</h3>
            <ul>
                {toners.map((toner, index) => (
                    <li key={index}>
                        <p><strong>{toner.nome} ({toner.modelo})</strong> - {toner.quantidade} em estoque</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default StockList;