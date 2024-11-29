const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const historyRoutes = require('./routes/historyRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 5040;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/api/history', historyRoutes); // Rotas para histórico
app.use('/api/users', userRoutes); // Rotas para usuários

sequelize.sync().then(() => {
    console.log('Banco de dados sincronizado');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});