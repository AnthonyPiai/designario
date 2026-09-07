# syntax=docker/dockerfile:1

# ---------- build ----------
FROM node:22-bookworm-slim AS builder

WORKDIR /app
ENV CI=true

# Dependencias primeiro, para aproveitar o cache de camadas
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Codigo-fonte e assets
COPY . .

# Gera dist/client, dist/server e o bundle autocontido em dist/standalone
RUN npx vinext build

# ---------- runtime ----------
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# O bundle standalone traz server.js, dist/, public/ e o runtime do vinext
COPY --from=builder --chown=node:node /app/dist/standalone ./

# O standalone do vinext 1.0.0-beta.5 nao copia o React; ele resolve do node_modules ao lado
COPY --from=builder --chown=node:node /app/node_modules/react ./node_modules/react
COPY --from=builder --chown=node:node /app/node_modules/react-dom ./node_modules/react-dom
COPY --from=builder --chown=node:node /app/node_modules/react-server-dom-webpack ./node_modules/react-server-dom-webpack
COPY --from=builder --chown=node:node /app/node_modules/scheduler ./node_modules/scheduler

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
