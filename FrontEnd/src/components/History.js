import React, { useEffect, useState } from 'react';
import axios from '../axios';

const History = () => {
  const [histories, setHistories] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data } = await axios.get('/history');
      setHistories(data);
    };
    fetchHistory();
  }, []);

  return (
    <div>
      <h1>Histórico de Movimentações</h1>
      <table>
        <thead>
          <tr>
            <th>Ação</th>
            <th>Toner</th>
            <th>Quantidade</th>
            <th>Usuário</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {histories.map((history, index) => (
            <tr key={index}>
              <td>{history.action}</td>
              <td>{history.Toner.nome}</td>
              <td>{history.quantity}</td>
              <td>{history.User.name}</td>
              <td>{new Date(history.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;