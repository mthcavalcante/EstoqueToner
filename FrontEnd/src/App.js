import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StockList from './components/StockList';
import './styles/App.css';

const App = () => {
    const [toners, setToners] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5040/api/toners')
            .then(response => setToners(response.data))
            .catch(error => console.error('Erro ao carregar os toners:', error));
    }, []);

    return (
        <div className="app">
            <Header />
            <div className="main-content">
                <Sidebar />
                <div className="dashboard">
                    <h2>Status do Estoque</h2>
                    <StockList toners={toners} />
                </div>
            </div>
        </div>
    );
}

export default App;