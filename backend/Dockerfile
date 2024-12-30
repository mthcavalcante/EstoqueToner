# Use a imagem base do Node.js
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia o package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Exponha a porta
EXPOSE 8080

# Comando de inicialização
CMD ["npm", "start"]
