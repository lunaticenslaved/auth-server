FROM node:20 as build

WORKDIR /app
COPY . .
RUN npm ci \
    && npm run prisma:generate \
    && npm run build \
    && npm run db:migrate:prod

FROM node:slim
WORKDIR /app
COPY --from=build /app/dist /app

EXPOSE 3000

ENTRYPOINT ["npm ","run ","start"]
