FROM node:20-alpine

WORKDIR /app

# Instala dependências primeiro (melhor cache de layer)
COPY package*.json ./
RUN npm install --omit=dev

# Copia o restante do código
COPY src ./src
COPY public ./public

EXPOSE 3000
CMD ["node", "src/server.js"]
