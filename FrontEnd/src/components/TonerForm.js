import React, { useState } from 'react';
import axios from '../axios';

const TonerForm = () => {
  const [nome, setNome] = useState('');
  const [modelo, setModelo] = useState('');
  const [limiteMinimo, setLimiteMinimo] = useState(0);
  const [quantidade, setQuantidade] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/toners', { nome, modelo, limite_minimo: limiteMinimo, quantidade });
      alert('Toner cadastrado com sucesso!');
    } catch (error) {
      alert('Erro ao cadastrar toner.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Cadastrar Toner</h1>
      <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      <input type="text" placeholder="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} />
      <input type="number" placeholder="Limite Mínimo" value={limiteMinimo} onChange={(e) => setLimiteMinimo(e.target.value)} />
      <input type="number" placeholder="Quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
      <button type="submit">Cadastrar</button>
    </form>
  );
};

export default TonerForm;