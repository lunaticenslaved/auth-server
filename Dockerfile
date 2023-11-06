ARG NODE_VERSION=20

FROM node:$NODE_VERSION-buster as builder

WORKDIR /app

COPY . .

RUN npm ci \
    && npm run prisma:generate \
    && npm run build

CMD npm run deploy
