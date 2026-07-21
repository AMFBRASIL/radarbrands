# Radar Brands — Arquitetura (Fase 1)

## Stack de produção (VPS + aaPanel)

| Camada | Tecnologia |
|--------|------------|
| App web | TanStack Start + Nitro `node-server` |
| Runtime | Node.js LTS (20+) |
| Banco | MySQL 8 (remoto ou local no VPS) |
| ORM | Prisma |
| Cache/Filas | Redis + BullMQ (workers em processo separado na fase 4+) |
| Process manager | PM2 (`ecosystem.config.cjs`) ou gerenciador Node do aaPanel |

## Estrutura do backend

```text
src/
  routes/
    api.health*.ts          # Server routes (API HTTP)
  server/
    modules/                # Domínios (health, auth, brands…)
    shared/
      env/                  # Variáveis validadas (Zod)
      errors/               # Hierarquia AppError
      logger/               # Pino JSON
      database/             # Prisma client
      cache/                # Redis
      queue/                # BullMQ
      http/                 # Envelope API + request ID
prisma/
  schema.prisma             # Espelho do SQL existente
  seed.ts
```

## API

- `GET /api/health` — resumo (DB + Redis)
- `GET /api/health/live` — liveness
- `GET /api/health/ready` — readiness (503 se DB down)

Resposta padrão:

```json
{ "success": true, "data": {}, "requestId": "uuid" }
```

## Deploy no VPS (aaPanel)

Script completo (recomendado):

```bash
cd /www/wwwroot/radarbrands
bash scripts/deploy-vps.sh
```

O script faz: `git pull` → `npm install` → Prisma → seed → `build` → restart PM2 → health check.

Flags: `--skip-git` `--skip-seed` `--skip-build` `--no-health`

Manual:

1. Instalar Node 20+, Redis (opcional mas recomendado).
2. Clonar repo e `cp .env.example .env` (preencher credenciais).
3. `npm ci && npm run db:generate`
4. `npm run build`
5. `pm2 start ecosystem.config.cjs` ou configurar site Node no aaPanel apontando para `npm start`.
6. Proxy reverso (Nginx) para `http://127.0.0.1:3003`.

## Desenvolvimento local

```bash
cp .env.example .env
docker compose up -d redis   # opcional
npm install
npm run dev
```

## Próximas fases

- **Fase 2:** Auth (Better Auth), organizações, RBAC, guards no dashboard
- **Fase 3:** CRUD de marcas
- **Fase 4+:** Monitoramento, workers, integrações
