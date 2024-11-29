import React, { useState } from 'react';

const TonerForm = () => {
    const [toner, setToner] = useState({ nome: '', modelo: '', limite: 0 });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setToner({ ...toner, [name]: value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Toner ${toner.nome} cadastrado!`);
    }

    return (
        <form onSubmit={handleSubmit} className="toner-form">
            <h3>Cadastrar Toner</h3>
            <label>
                Nome:
                <input type="text" name="nome" value={toner.nome} onChange={handleChange} />
            </label>
            <label>
                Modelo:
                <input type="text" name="modelo" value={toner.modelo} onChange={handleChange} />
            </label>
            <label>
                Limite Mínimo de Estoque:
                <input type="number" name="limite" value={toner.limite} onChange={handleChange} />
            </label>
            <button type="submit">Cadastrar</button>
        </form>
    );
}

export default TonerForm;
