FROM node:lts-alpine

WORKDIR /app

EXPOSE 3000
COPY package.json .
COPY pnpm-lock.yaml .

RUN npm i -g pnpm
RUN npm i -g nodemon


RUN pnpm install

COPY . .
ENTRYPOINT [ "nodemon", "/app/server.js" ]
