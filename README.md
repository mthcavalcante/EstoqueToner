
# **Controle de Estoque de Toners**

Sistema web para controle de estoque de toners, desenvolvido com **Node.js**, **React.js** e **MySQL**. Ele permite gerenciar usuários, toners, e movimentações de entrada/saída, além de alertar quando o estoque está baixo.

---

## **Funcionalidades Principais**

### **1. Autenticação de Usuários**
- Sistema de login com autenticação baseada em token JWT.
- **Dois tipos de usuários**:
  - **Admin**: Pode criar/excluir usuários, ajustar quantidade total de toners, e visualizar o dashboard.
  - **Usuário Normal**: Pode registrar entrada e saída de toners e consultar o histórico.

### **2. Gerenciamento de Toners**
- Cadastrar novos modelos de toners com quantidade mínima e inicial.
- Atualizar quantidades (entrada/saída).
- Visualizar os modelos cadastrados.

### **3. Histórico de Movimentações**
- Registrar automaticamente todas as movimentações de entrada/saída.
- Visualizar histórico detalhado com data, usuário, ação e quantidade.

### **4. Dashboard**
- Exibe um resumo das quantidades de estoque, alertas para estoques abaixo do mínimo e movimentações recentes.

---

## **Tecnologias Utilizadas**

### **Back-End**
- **Node.js**: Servidor e lógica de negócios.
- **Express**: Framework para construção de APIs.
- **Sequelize**: ORM para interagir com o banco de dados.
- **JWT**: Autenticação e autorização.

### **Front-End**
- **React.js**: Interface de usuário.
- **React Router**: Gerenciamento de rotas.
- **Axios**: Requisições HTTP para o back-end.

### **Banco de Dados**
- **MySQL**: Banco de dados relacional para armazenar as informações.

---

## **Tabelas do Banco de Dados**

### **Tabela `Users`**
Armazena os dados dos usuários.

| Campo       | Tipo           | Permite Nulo | Descrição                             |
|-------------|----------------|--------------|---------------------------------------|
| `id`        | `int`          | `NO`         | Identificador único.                  |
| `name`      | `varchar(255)` | `NO`         | Nome curto ou apelido.                |
| `email`     | `varchar(255)` | `NO`         | Endereço de email (único).            |
| `password`  | `varchar(255)` | `NO`         | Senha criptografada.                  |
| `role`      | `enum`         | `YES`        | Papel do usuário (`admin` ou `normal`).|
| `createdAt` | `datetime`     | `NO`         | Data de criação do registro.          |
| `updatedAt` | `datetime`     | `NO`         | Data de última atualização.           |

### **Tabela `Toners`**
Armazena os modelos de toners.

| Campo            | Tipo           | Permite Nulo | Descrição                           |
|-------------------|----------------|--------------|-------------------------------------|
| `id`             | `int`          | `NO`         | Identificador único.                |
| `nome`           | `varchar(255)` | `NO`         | Nome do toner.                      |
| `modelo`         | `varchar(255)` | `NO`         | Modelo do toner.                    |
| `limite_minimo`  | `int`          | `NO`         | Quantidade mínima para alertas.     |
| `quantidade`     | `int`          | `NO`         | Quantidade atual em estoque.        |
| `createdAt`      | `datetime`     | `NO`         | Data de criação do registro.        |
| `updatedAt`      | `datetime`     | `NO`         | Data de última atualização.         |

### **Tabela `Histories`**
Armazena o histórico de movimentações.

| Campo            | Tipo           | Permite Nulo | Descrição                           |
|-------------------|----------------|--------------|-------------------------------------|
| `id`             | `int`          | `NO`         | Identificador único.                |
| `action`         | `enum`         | `NO`         | Tipo da ação (`entrada` ou `saida`).|
| `quantity`       | `int`          | `NO`         | Quantidade movimentada.             |
| `TonerId`        | `int`          | `NO`         | Relacionamento com a tabela Toners. |
| `UserId`         | `int`          | `NO`         | Relacionamento com a tabela Users.  |
| `createdAt`      | `datetime`     | `NO`         | Data da movimentação.               |

---

## **Dependências**

### **Back-End**
Certifique-se de instalar as seguintes dependências:
```bash
npm install express sequelize mysql2 bcryptjs jsonwebtoken body-parser cors
```

### **Front-End**
Certifique-se de instalar as dependências do React:
```bash
npm install react-router-dom axios
```

---

## **Passo a Passo para Iniciar o Sistema**

### **1. Configurar o Banco de Dados**
1. Certifique-se de que o MySQL está instalado e em execução.
2. Crie um banco de dados chamado `toner_db`:
   ```sql
   CREATE DATABASE toner_db;
   ```
3. Atualize as credenciais no arquivo **`backend/config/database.js`**:
   ```javascript
   const sequelize = new Sequelize('toner_db', 'root', 'password', {
       host: 'localhost',
       dialect: 'mysql',
   });
   ```

### **2. Iniciar o Back-End**
1. Navegue até a pasta `backend`:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Sincronize o banco de dados (as tabelas serão criadas automaticamente):
   ```bash
   node app.js
   ```
4. Certifique-se de que o servidor está rodando na porta 5040.

### **3. Iniciar o Front-End**
1. Navegue até a pasta `frontend`:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

---

## **Como Usar**

1. **Acesse o Sistema**:
   - Acesse o front-end no navegador em `http://localhost:3000`.
   - Faça login com um usuário válido.

2. **Admin**:
   - Acesse o dashboard e visualize os alertas.
   - Gerencie toners, usuários e histórico.

3. **Usuário Normal**:
   - Registre entradas e saídas de toners.
   - Consulte o histórico de movimentações.

4. **Logout**:
   - Use o botão "Sair" no menu para deslogar.

---

## **Licença**

Este projeto é livre para uso educacional e comercial. 😊

---

