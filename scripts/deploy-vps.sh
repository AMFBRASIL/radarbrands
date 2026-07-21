#!/usr/bin/env bash
# =============================================================================
# Radar Brands — deploy completo no VPS
# Uso:
#   cd /www/wwwroot/radarbrands
#   bash scripts/deploy-vps.sh
#
# Flags opcionais:
#   --skip-git     Não faz git pull
#   --skip-seed    Não roda npm run db:seed
#   --skip-build   Não roda npm run build (só deps + prisma + pm2)
#   --no-health    Não testa /api/health no final
# =============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

SKIP_GIT=0
SKIP_SEED=0
SKIP_BUILD=0
NO_HEALTH=0

for arg in "$@"; do
  case "$arg" in
    --skip-git) SKIP_GIT=1 ;;
    --skip-seed) SKIP_SEED=1 ;;
    --skip-build) SKIP_BUILD=1 ;;
    --no-health) NO_HEALTH=1 ;;
    -h|--help)
      sed -n '2,16p' "$0"
      exit 0
      ;;
    *)
      echo "Flag desconhecida: $arg"
      exit 1
      ;;
  esac
done

# aaPanel Node 22 (se existir)
if [[ -d /www/server/nodejs/v22.13.1/bin ]]; then
  export PATH="/www/server/nodejs/v22.13.1/bin:$PATH"
elif [[ -d /www/server/nodejs/v22.12.0/bin ]]; then
  export PATH="/www/server/nodejs/v22.12.0/bin:$PATH"
fi

# Preferir registry oficial (evita npm.pkg.github.com quebrado)
export npm_config_registry="${npm_config_registry:-https://registry.npmjs.org/}"

PORT="$(grep -E '^PORT=' .env 2>/dev/null | cut -d= -f2- | tr -d '"' | tr -d "'" || true)"
PORT="${PORT:-3003}"

log()  { echo -e "\n\033[1;36m==>\033[0m $*"; }
ok()   { echo -e "\033[1;32m✔\033[0m $*"; }
warn() { echo -e "\033[1;33m!\033[0m $*"; }
fail() { echo -e "\033[1;31m✖\033[0m $*"; exit 1; }

log "Radar Brands deploy — $(date '+%Y-%m-%d %H:%M:%S')"
echo "    dir:  $ROOT_DIR"
echo "    node: $(node -v 2>/dev/null || echo 'NÃO ENCONTRADO')"
echo "    npm:  $(npm -v 2>/dev/null || echo 'NÃO ENCONTRADO')"
echo "    port: $PORT"

command -v node >/dev/null || fail "Node.js não encontrado no PATH"
command -v npm >/dev/null || fail "npm não encontrado no PATH"
command -v pm2 >/dev/null || fail "pm2 não encontrado. Instale: npm i -g pm2"

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [[ "$NODE_MAJOR" -lt 22 ]]; then
  warn "Node $(node -v) detectado. Recomendado: v22.12+"
fi

if [[ ! -f .env ]]; then
  if [[ -f .env.example ]]; then
    cp .env.example .env
    fail "Criei .env a partir de .env.example. Edite com nano .env e rode o script de novo."
  fi
  fail "Arquivo .env não encontrado. Crie antes de continuar."
fi

if ! grep -qE '^DATABASE_URL=.+' .env; then
  fail "DATABASE_URL ausente no .env"
fi

# ---------------------------------------------------------------------------
# 1) Git
# ---------------------------------------------------------------------------
if [[ "$SKIP_GIT" -eq 0 ]]; then
  log "Atualizando código (git)"
  if [[ -d .git ]]; then
    git fetch origin
    BRANCH="$(git rev-parse --abbrev-ref HEAD)"
    if [[ "$BRANCH" == "HEAD" ]]; then
      BRANCH="main"
    fi
    # Descarta mudanças locais de código (preserva .env)
    git reset --hard "origin/$BRANCH" || git reset --hard origin/main
    git clean -fd -e .env -e logs -e node_modules -e .output
    ok "Código em $(git log -1 --oneline)"
  else
    warn "Pasta sem .git — pulando pull"
  fi
else
  warn "Pulando git (--skip-git)"
fi

# ---------------------------------------------------------------------------
# 2) Dependências
# ---------------------------------------------------------------------------
log "Instalando dependências"
mkdir -p logs
npm install --registry=https://registry.npmjs.org/
ok "npm install ok"

# ---------------------------------------------------------------------------
# 3) Prisma
# ---------------------------------------------------------------------------
log "Prisma generate + db push"
npx prisma generate
npx prisma db push
ok "Schema sincronizado"

if [[ "$SKIP_SEED" -eq 0 ]]; then
  log "Seed (roles, permissions, endpoints)"
  npm run db:seed
  ok "Seed ok"
else
  warn "Pulando seed (--skip-seed)"
fi

# ---------------------------------------------------------------------------
# 4) Build
# ---------------------------------------------------------------------------
if [[ "$SKIP_BUILD" -eq 0 ]]; then
  log "Build de produção"
  NODE_ENV=production npm run build
  [[ -f .output/server/index.mjs ]] || fail "Build falhou: .output/server/index.mjs não existe"
  ok "Build ok"
else
  warn "Pulando build (--skip-build)"
fi

# ---------------------------------------------------------------------------
# 5) PM2
# ---------------------------------------------------------------------------
log "Reiniciando PM2"
if [[ ! -f ecosystem.config.cjs ]]; then
  fail "ecosystem.config.cjs não encontrado"
fi

# Garante PORT do .env no processo web (ecosystem já tem 3003; reforça via env)
export NODE_ENV=production
export PORT

if pm2 describe radarbrands-web >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
fi

pm2 save
ok "PM2 atualizado"
pm2 status

# ---------------------------------------------------------------------------
# 6) Health check
# ---------------------------------------------------------------------------
if [[ "$NO_HEALTH" -eq 0 ]]; then
  log "Health check http://127.0.0.1:${PORT}/api/health"
  sleep 2
  if command -v curl >/dev/null; then
    if curl -fsS "http://127.0.0.1:${PORT}/api/health" | head -c 400; then
      echo
      ok "API respondeu"
    else
      warn "Health check falhou — veja: pm2 logs radarbrands-web --lines 80"
    fi
  else
    warn "curl não instalado — health check pulado"
  fi
fi

log "Deploy concluído"
echo "    Site:    confira o domínio no Nginx → 127.0.0.1:${PORT}"
echo "    Logs:    pm2 logs radarbrands-web"
echo "    Status:  pm2 status"
echo
ok "Pronto."
