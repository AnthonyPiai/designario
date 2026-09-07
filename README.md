# Designário

Site institucional da **Designário** — design gráfico, gestão de redes sociais,
identidade visual e vídeos curtos. Página única, em português, com conversão via
WhatsApp (sem formulário e sem backend próprio).

## Stack

- **[vinext](https://vinext.dev/)** 1.0.0-beta.5 — API do Next.js (App Router) rodando sobre Vite
- **React 19** com RSC + SSR
- **Vite 8** / Rolldown
- **Tailwind CSS 4** + componentes shadcn/Base UI (`components/ui`)
- **TypeScript 5.9**, lint/format com **oxlint** e **oxfmt**

## Requisitos

- Node.js >= 22.13

## Desenvolvimento

```bash
npm ci
npm run dev                    # vinext dev — http://localhost:3000
```

Outros scripts:

```bash
npm run build                  # build de produção (dist/)
npm run lint                   # oxlint
npm run format                 # oxfmt
node --test tests/*.test.mjs   # 14 testes da timeline de motion
```

## Build e execução em produção

```bash
npm run build
node dist/standalone/server.js   # PORT e HOST configuráveis (padrão 3000 / 0.0.0.0)
```

O `next.config.ts` usa `output: 'standalone'`, então o build gera três saídas em `dist/`:

| Saída | Para que serve |
|-------|----------------|
| `dist/standalone/` | bundle Node autocontido (`server.js`, `dist/`, `public/`, runtime do vinext) — é o que o Docker usa |
| `dist/client/` e `dist/server/` | saída padrão do vinext (assets com hash + bundle SSR/RSC) |
| `dist/server/wrangler.json` | config do Worker — `npm start` sobe via `wrangler dev` (caminho Cloudflare) |

O mesmo build atende os dois destinos: bundle Node para Docker e Worker para Cloudflare.

## Deploy (Easypanel / Docker)

O `Dockerfile` na raiz é multi-stage:

1. **builder** — `npm ci` completo e `vinext build`;
2. **runner** — `node:22-bookworm-slim` só com `dist/standalone`, rodando como
   usuário `node` e servindo na porta `3000` (imagem final ~390 MB).

> O bundle standalone do vinext 1.0.0-beta.5 não copia o React junto; por isso o
> `Dockerfile` traz `react`, `react-dom`, `react-server-dom-webpack` e `scheduler`
> do estágio de build. Ao atualizar o vinext, vale revisar se ainda é necessário.

```bash
docker build -t designario .
docker run --rm -p 3000:3000 designario
```

No Easypanel, criar um serviço do tipo **App** apontando para este repositório:

- **Build:** Dockerfile (raiz do repositório)
- **Porta:** `3000`
- **Variáveis:** nenhuma obrigatória (`PORT` e `HOST` já vêm definidas na imagem)

A imagem tem `HEALTHCHECK` próprio e o SSL é resolvido pelo Easypanel ao adicionar o domínio.

## Estrutura

```
app/                 # App Router: layout, página, motion e experiências
components/ui/       # componentes shadcn/Base UI
hooks/  lib/         # utilitários
public/              # imagens, vídeo do logo e favicon
public/brand/        # assets de marca + SOURCES.md (procedência)
tests/               # testes Node (node:test) da timeline de motion
```

## Assets de marca

A procedência de cada imagem — o que veio original do perfil da Designário e o
que é tratamento gerado — está documentada em [`public/brand/SOURCES.md`](public/brand/SOURCES.md).
