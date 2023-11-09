FROM node:20 AS build
WORKDIR /app
COPY /src ./src
COPY /prisma .
COPY /package.json .
COPY /package-lock.json .
COPY /tsconfig.json .
RUN npm ci --ignore-scripts \
    && npm run prisma:generate \
    && npm run build

FROM node:20-slim
WORKDIR /app
RUN addgroup --system auth\
    && adduser -S -s /bin/false -G auth auth -D -H \
    && chmod -R 555 /app
COPY --chown=auth:auth \
    --from=build /app/dist /app 
USER auth
EXPOSE 3000
ENTRYPOINT ["npm ","run ","start"]
