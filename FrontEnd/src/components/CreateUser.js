import React, { useState } from 'react';
import axios from '../axios';

const CreateUser = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('normal');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/users', { fullName, email, password, role });
            alert('Usuário criado com sucesso!');
        } catch (error) {
            alert('Erro ao criar usuário.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Criar Usuário</h1>
            <input
                type="text"
                placeholder="Nome Completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="normal">Usuário Normal</option>
                <option value="admin">Admin</option>
            </select>
            <button type="submit">Criar Usuário</button>
        </form>
    );
};

export default CreateUser;