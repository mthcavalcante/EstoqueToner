// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rotas Básicas
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do Estoque de Toner!' });
});

// Importar rotas
require('./routes/toner.routes')(app);
require('./routes/supplier.routes')(app);
require('./routes/movement.routes')(app);

// Definir a porta a partir da variável de ambiente ou usar 8080 como padrão
const PORT = process.env.PORT || 8080;

// Testar a conexão com o banco de dados
db.sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    // Sincronizar os modelos com o banco de dados
    return db.sequelize.sync();
  })
  .then(() => {
    console.log('Sincronização dos modelos com o banco de dados realizada com sucesso.');
    // Iniciar o servidor após a sincronização
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${PORT}.`);
    });
  })
  .catch(err => {
    console.error('Não foi possível conectar/sincronizar com o banco de dados:', err);
    process.exit(1); // Opcional: encerrar o processo se não conseguir conectar ao banco
  });
