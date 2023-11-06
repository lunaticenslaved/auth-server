FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm ci \
    && npm run prisma:generate \
    && npm run build \
    && npm run db:migrate:prod

FROM node:20-slim
WORKDIR /app
COPY --from=build /app/dist /app 
RUN addgroup --system auth\
    && adduser -S -s /bin/false -G auth auth -D -H 
USER auth
EXPOSE 3000
ENTRYPOINT ["npm ","run ","start"]
