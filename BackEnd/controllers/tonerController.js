const Toner = require('../models/Toner');

// Função para adicionar toner
exports.addToner = async (req, res) => {
    try {
        const { nome, modelo, limite_minimo, quantidade } = req.body;
        const toner = await Toner.create({ nome, modelo, limite_minimo, quantidade });
        res.status(201).json(toner);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar toner' });
    }
};

// Função para listar toners
exports.getTonners = async (req, res) => {
    try {
        const toners = await Toner.findAll();
        res.status(200).json(toners);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar toners' });
    }
};

// Função para atualizar estoque
exports.updateToner = async (req, res) => {
    const { id } = req.params;
    const { quantidade } = req.body;
    try {
        const toner = await Toner.findByPk(id);
        if (!toner) {
            return res.status(404).json({ error: 'Toner não encontrado' });
        }
        toner.quantidade = quantidade;
        await toner.save();
        res.status(200).json(toner);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar toner' });
    }
};