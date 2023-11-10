FROM node:20 AS build
WORKDIR /app
COPY /src ./src
COPY /prisma .
COPY /package.json .
COPY /package-lock.json .
COPY /tsconfig.json .
RUN npm ci \
    && npm run prisma:generate \
    && npm run build

FROM node:20-slim
WORKDIR /app
COPY --from=build /app/package.json /app 
RUN npm i --omit=dev
COPY --from=build /app/dist /app 
EXPOSE 3000
ENTRYPOINT ["node","index.js"]
