import React from 'react';

const StockList = () => {
    const toners = [
        { nome: 'Toner HP', modelo: '123A', quantidade: 50 },
        { nome: 'Toner Brother', modelo: 'TN-2320', quantidade: 10 },
    ];

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
