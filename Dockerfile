FROM node:20 AS build
WORKDIR /app
COPY /src ./src
COPY /prisma .
COPY /package.json .
COPY /package-lock.json .
COPY /tsconfig.json .
RUN npm ci \
    && npx prisma generate \
    && npm run build

FROM node:alpine
WORKDIR /app
COPY --from=build /app/package.json /app 
COPY --from=build /app/schema.prisma /app 
RUN apk update \ 
    && apk add --no-cache openssl \
    && npm i --omit=dev
#    && npx prisma generate
COPY --from=build /app/dist /app 
USER 1000
EXPOSE 3000
ENTRYPOINT ["node","app.js"]
