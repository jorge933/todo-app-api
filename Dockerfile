FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
COPY .env ./

RUN npm install

COPY . .

RUN npm run build