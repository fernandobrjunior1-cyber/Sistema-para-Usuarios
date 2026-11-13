
# ETAPA 1 - Compilar o Angular
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# ETAPA 2 - Executar o Angular SSR
FROM node:24-alpine AS final

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV NG_ALLOWED_HOSTS=localhost,127.0.0.1

COPY --from=build /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/SistemaUsuariosAngular/server/server.mjs"]
