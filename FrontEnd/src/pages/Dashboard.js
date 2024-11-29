import React, { useEffect, useState } from 'react';
import axios from '../axios';

const Dashboard = () => {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5040/api/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserRole(data.role);
        };
        fetchUser();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            {userRole === 'admin' ? (
                <div>
                    <h2>Funções de Admin</h2>
                    <p>Ajustar estoques, gerenciar usuários...</p>
                </div>
            ) : (
                <div>
                    <h2>Funções de Usuário Normal</h2>
                    <p>Registrar entradas/saídas...</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;