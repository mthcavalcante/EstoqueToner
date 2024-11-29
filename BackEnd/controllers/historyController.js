const History = require('../models/History');
const Toner = require('../models/Toner');
const User = require('../models/User');

exports.recordHistory = async (req, res) => {
    const { tonerId, action, quantity } = req.body;

    try {
        const toner = await Toner.findByPk(tonerId);

        if (!toner) {
            return res.status(404).json({ error: 'Toner não encontrado' });
        }

        if (action === 'saida' && toner.quantidade < quantity) {
            return res.status(400).json({ error: 'Quantidade insuficiente em estoque' });
        }

        toner.quantidade += action === 'entrada' ? quantity : -quantity;
        await toner.save();

        const history = await History.create({
            action,
            quantity,
            TonerId: tonerId,
            UserId: req.user.id,
        });

        res.status(201).json(history);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar movimentação' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const histories = await History.findAll({
            include: [
                { model: Toner, attributes: ['nome', 'modelo'] },
                { model: User, attributes: ['name', 'email'] },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json(histories);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar histórico' });
    }
};