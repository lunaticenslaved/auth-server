FROM node:20 AS build
WORKDIR /app
COPY /src .
COPY /prisma .
COPY /package.json .
COPY /package-lock.json .
RUN npm ci --ignore-scripts \
    && npm run prisma:generate \
    && npm run build \
    && npm run db:migrate:prod

FROM node:20-slim
WORKDIR /app
RUN addgroup --system auth\
    && adduser -S -s /bin/false -G auth auth -D -H \
    && chmod -R 755 /app
COPY --from=build /app/dist /app 
USER auth
EXPOSE 3000
ENTRYPOINT ["npm ","run ","start"]
