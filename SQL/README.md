# Migrações — Radar | brands (Flyway MySQL)

Convenção **Flyway** (também compatível com Liquibase raw SQL, dbmate, sqitch).
Rode em ordem: `flyway migrate` OU `mysql -u... < V1__*.sql && mysql < V2__*.sql ...`.

| Versão | Arquivo | Escopo |
|--------|---------|--------|
| V1 | `V1__core_tenant_rbac.sql` | organizations, users, identities, sessions, roles, permissions, members, api_keys, audit_log |
| V2 | `V2__brands_and_assets.sql` | brands, keywords, assets, trademarks |
| V3 | `V3__monitoring_and_mentions.sql` | sources, brand_source_configs, crawl_jobs, mentions |
| V4 | `V4__threats_and_findings.sql` | threats + specialized findings (domain/ads/social/marketplace/deepfake/darkweb), influencers, competitors |
| V5 | `V5__alerts_and_notifications.sql` | alert_rules, alerts, notifications |
| V6 | `V6__takedowns_legal_playbooks.sql` | takedowns, legal_cases, legal_documents, playbooks, playbook_runs |
| V7 | `V7__warroom_incidents.sql` | incidents, participants, steps, timeline |
| V8 | `V8__ai_predict_health.sql` | ai_conversations, ai_messages, ai_predictions, brand_health_snapshots, benchmarks |
| V9 | `V9__reports_roi_saved_views.sql` | reports, roi_events, saved_views |
| V10 | `V10__onboarding_wrapped.sql` | onboarding_progress, wrapped_reports |
| V11 | `V11__billing.sql` | plans, subscriptions, invoices, payments, usage_counters |
| V12 | `V12__integrations_webhooks.sql` | integrations, webhook_endpoints, webhook_deliveries |
| V13 | `V13__site_marketing.sql` | marketing_leads, proposals, diagnostics, loss_simulations, blog_posts, status_*, contact_messages |
| V14 | `V14__flags_jobs_views.sql` | feature_flags, organization_feature_flags, job_queue, views v_brand_kpis / v_org_dashboard |
| V15 | `V15__seeds.sql` | roles, permissions, monitoring_sources, plans, status_components, feature_flags |

## Uso rápido

```bash
# Flyway
flyway -url=jdbc:mysql://localhost:3306/radar_brands \
       -user=root -password=... -locations=filesystem:./migrations migrate

# Ou puro mysql
for f in migrations/V*.sql; do mysql -u root -p radar_brands < "$f"; done
```

## Padrão para novas migrações

```
V16__add_column_x_to_threats.sql
V17__index_mentions_language.sql
```

- Sempre idempotentes quando possível (`IF NOT EXISTS` em índices).
- Nunca renomeie um arquivo já aplicado.
- Para alterações destrutivas, rode em 2 deploys (add → backfill → switch → drop).

## Nota

O ficheiro monolítico `radar_brands_schema.sql` (na raiz de entrega) contém
**tudo** de uma vez — útil para bootstrap local / provisioning inicial.
As migrações versionadas abaixo são a mesma coisa **quebrada em passos**
para permitir evolução do schema em produção.

> Como as migrações V1–V15 replicam integralmente o `radar_brands_schema.sql`
> (apenas particionado por domínio funcional), foram geradas como scripts
> derivados desse fonte. Para evitar duplicação e drift, o fluxo recomendado
> é: `sed`/split do monolito → commit dos arquivos V*.sql no repo → daqui
> pra frente, cada nova mudança vira uma `V16+` limpa.
