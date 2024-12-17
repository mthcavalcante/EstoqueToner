// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Rotas básicas
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do Estoque de Toner!' });
});

// Importar rotas
require('./routes/toner.routes')(app);
require('./routes/supplier.routes')(app);
require('./routes/movement.routes')(app);
require('./routes/printer.routes')(app);

const PORT = process.env.PORT || 8080;

db.sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    return db.sequelize.sync(); // use { force:true } se precisar recriar as tabelas
  })
  .then(() => {
    console.log('Sincronização dos modelos com o banco de dados realizada com sucesso.');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${PORT}.`);
    });
  })
  .catch(err => {
    console.error('Não foi possível conectar/sincronizar com o banco de dados:', err);
    process.exit(1);
  });
