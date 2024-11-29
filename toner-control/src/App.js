import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TonerForm from './components/TonerForm';
import './styles/App.css';

const App = () => {
    return (
        <div className="app">
            <Header />
            <div className="main-content">
                <Sidebar />
                <Dashboard />
            </div>
        </div>
    );
}

export default App;
