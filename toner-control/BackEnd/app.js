const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const tonerRoutes = require('./routes/tonerRoutes');

const app = express();
const PORT = 5040;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/api', tonerRoutes);

// Sincroniza com o banco de dados
sequelize.sync().then(() => {
    console.log('Banco de dados sincronizado');
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});