-- =====================================================================
-- Radar | brands — Schema MySQL 8.0+ Completo
-- Site institucional + Dashboard (todas as funcionalidades)
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_0900_ai_ci
-- =====================================================================
-- Convenções:
--   * PK sempre BIGINT UNSIGNED AUTO_INCREMENT (+ coluna `uuid` CHAR(36) UNIQUE
--     para exposição pública/URLs — escalável e resistente a enumeration).
--   * `created_at` / `updated_at` em todas as tabelas transacionais.
--   * `deleted_at` (soft-delete) em tabelas críticas.
--   * Índices compostos por (tenant_id, entidade, created_at) para multi-tenant.
--   * JSON columns para payloads flexíveis (metadata/evidence/config).
--   * FKs com ON DELETE CASCADE nos filhos de tenant; RESTRICT quando há
--     integridade legal (casos, faturas).
--   * Particionamento por RANGE(created_at) sugerido em tabelas de alto volume
--     (events, alerts, mentions, threat_findings) — comentado no final.
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION';

DROP DATABASE IF EXISTS radar_brands;
CREATE DATABASE radar_brands
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;
USE radar_brands;

-- =====================================================================
-- 1. NÚCLEO MULTI-TENANT: ORGANIZAÇÕES, USUÁRIOS, RBAC
-- =====================================================================

CREATE TABLE organizations (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid              CHAR(36) NOT NULL,
  legal_name        VARCHAR(255) NOT NULL,
  trade_name        VARCHAR(255) NULL,
  slug              VARCHAR(120) NOT NULL,
  tax_id            VARCHAR(32)  NULL COMMENT 'CNPJ/EIN/VAT',
  country_code      CHAR(2)      NOT NULL DEFAULT 'BR',
  industry          VARCHAR(120) NULL,
  size_bucket       ENUM('startup','sme','mid','enterprise','global') NULL,
  website           VARCHAR(255) NULL,
  logo_url          VARCHAR(512) NULL,
  timezone          VARCHAR(64)  NOT NULL DEFAULT 'America/Sao_Paulo',
  locale            VARCHAR(10)  NOT NULL DEFAULT 'pt-BR',
  plan_tier         ENUM('free','starter','pro','business','enterprise') NOT NULL DEFAULT 'free',
  status            ENUM('active','suspended','trial','cancelled') NOT NULL DEFAULT 'trial',
  trial_ends_at     DATETIME NULL,
  settings_json     JSON NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at        DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_org_uuid (uuid),
  UNIQUE KEY uk_org_slug (slug),
  KEY idx_org_status (status),
  KEY idx_org_plan (plan_tier)
) ENGINE=InnoDB;

CREATE TABLE users (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid              CHAR(36) NOT NULL,
  email             VARCHAR(255) NOT NULL,
  email_verified_at DATETIME NULL,
  phone             VARCHAR(32)  NULL,
  full_name         VARCHAR(180) NOT NULL,
  display_name      VARCHAR(120) NULL,
  avatar_url        VARCHAR(512) NULL,
  password_hash     VARCHAR(255) NULL COMMENT 'Argon2id/BCrypt; NULL se SSO-only',
  password_algo     VARCHAR(20)  NULL,
  mfa_enabled       BOOLEAN NOT NULL DEFAULT FALSE,
  mfa_secret_enc    VARBINARY(512) NULL,
  locale            VARCHAR(10)  NOT NULL DEFAULT 'pt-BR',
  timezone          VARCHAR(64)  NOT NULL DEFAULT 'America/Sao_Paulo',
  last_login_at     DATETIME NULL,
  last_login_ip     VARBINARY(16) NULL,
  status            ENUM('active','invited','disabled','locked') NOT NULL DEFAULT 'invited',
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at        DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_uuid (uuid),
  UNIQUE KEY uk_users_email (email),
  KEY idx_users_status (status)
) ENGINE=InnoDB;

CREATE TABLE identities (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       BIGINT UNSIGNED NOT NULL,
  provider      ENUM('password','google','apple','microsoft','github','saml','oidc') NOT NULL,
  provider_uid  VARCHAR(255) NOT NULL,
  meta_json     JSON NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_identity (provider, provider_uid),
  KEY idx_identity_user (user_id),
  CONSTRAINT fk_identity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE sessions (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       BIGINT UNSIGNED NOT NULL,
  token_hash    CHAR(64) NOT NULL COMMENT 'SHA-256 do refresh token',
  ip            VARBINARY(16) NULL,
  user_agent    VARCHAR(512) NULL,
  device_label  VARCHAR(120) NULL,
  expires_at    DATETIME NOT NULL,
  revoked_at    DATETIME NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_session_token (token_hash),
  KEY idx_session_user (user_id, expires_at),
  CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE roles (
  id           SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code         VARCHAR(40) NOT NULL,
  name         VARCHAR(80) NOT NULL,
  scope        ENUM('system','org') NOT NULL DEFAULT 'org',
  description  VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_role_code (code)
) ENGINE=InnoDB;

CREATE TABLE permissions (
  id       SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code     VARCHAR(80) NOT NULL COMMENT 'ex: alerts.read, threats.takedown',
  category VARCHAR(40) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_perm_code (code)
) ENGINE=InnoDB;

CREATE TABLE role_permissions (
  role_id       SMALLINT UNSIGNED NOT NULL,
  permission_id SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_rp_perm FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE organization_members (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  user_id       BIGINT UNSIGNED NOT NULL,
  role_id       SMALLINT UNSIGNED NOT NULL,
  title         VARCHAR(120) NULL COMMENT 'CMO, Jurídico, PR...',
  invited_by    BIGINT UNSIGNED NULL,
  invited_at    DATETIME NULL,
  accepted_at   DATETIME NULL,
  status        ENUM('active','invited','removed') NOT NULL DEFAULT 'invited',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_member (organization_id, user_id),
  KEY idx_member_user (user_id),
  CONSTRAINT fk_mem_org  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_mem_user FOREIGN KEY (user_id)         REFERENCES users(id)         ON DELETE CASCADE,
  CONSTRAINT fk_mem_role FOREIGN KEY (role_id)         REFERENCES roles(id)
) ENGINE=InnoDB;

CREATE TABLE api_keys (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  name          VARCHAR(120) NOT NULL,
  prefix        CHAR(8) NOT NULL,
  key_hash      CHAR(64) NOT NULL,
  scopes_json   JSON NOT NULL,
  last_used_at  DATETIME NULL,
  expires_at    DATETIME NULL,
  created_by    BIGINT UNSIGNED NULL,
  revoked_at    DATETIME NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_apikey_hash (key_hash),
  KEY idx_apikey_org (organization_id),
  CONSTRAINT fk_apikey_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE audit_log (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NULL,
  actor_user_id BIGINT UNSIGNED NULL,
  actor_type    ENUM('user','system','api','ai_agent','webhook') NOT NULL DEFAULT 'user',
  action        VARCHAR(80)  NOT NULL,
  entity_type   VARCHAR(60)  NOT NULL,
  entity_id     BIGINT UNSIGNED NULL,
  ip            VARBINARY(16) NULL,
  user_agent    VARCHAR(512) NULL,
  before_json   JSON NULL,
  after_json    JSON NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_org_time (organization_id, created_at),
  KEY idx_audit_entity (entity_type, entity_id)
) ENGINE=InnoDB;

-- =====================================================================
-- 2. MARCAS, TERMOS-CHAVE E ATIVOS PROTEGIDOS
-- =====================================================================

CREATE TABLE brands (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid            CHAR(36) NOT NULL,
  organization_id BIGINT UNSIGNED NOT NULL,
  name            VARCHAR(180) NOT NULL,
  slug            VARCHAR(120) NOT NULL,
  official_domain VARCHAR(255) NULL,
  aliases_json    JSON NULL COMMENT 'variantes ["cadbrasil","cad-brasil"]',
  color_primary   CHAR(9) NULL,
  logo_url        VARCHAR(512) NULL,
  industry        VARCHAR(120) NULL,
  is_primary      BOOLEAN NOT NULL DEFAULT FALSE,
  status          ENUM('active','paused','archived') NOT NULL DEFAULT 'active',
  health_score    DECIMAL(5,2) NOT NULL DEFAULT 0 COMMENT '0-100 (Brand Health)',
  health_updated_at DATETIME NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_brand_uuid (uuid),
  UNIQUE KEY uk_brand_org_slug (organization_id, slug),
  KEY idx_brand_org_status (organization_id, status),
  CONSTRAINT fk_brand_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE brand_keywords (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  brand_id   BIGINT UNSIGNED NOT NULL,
  keyword    VARCHAR(255) NOT NULL,
  kind       ENUM('exact','phrase','regex','fuzzy') NOT NULL DEFAULT 'phrase',
  language   VARCHAR(10) NULL,
  weight     TINYINT UNSIGNED NOT NULL DEFAULT 5 COMMENT '1-10',
  is_negative BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_brand_keyword (brand_id, keyword, kind),
  CONSTRAINT fk_bk_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE brand_assets (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  brand_id   BIGINT UNSIGNED NOT NULL,
  kind       ENUM('logo','image','video','doc','font','other') NOT NULL,
  url        VARCHAR(1024) NOT NULL,
  hash_perceptual VARCHAR(64) NULL COMMENT 'pHash p/ deepfake / imagem',
  meta_json  JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_asset_brand (brand_id),
  KEY idx_asset_hash (hash_perceptual),
  CONSTRAINT fk_asset_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE trademarks (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  brand_id           BIGINT UNSIGNED NOT NULL,
  registry           VARCHAR(20) NOT NULL COMMENT 'INPI, USPTO, EUIPO...',
  registration_no    VARCHAR(80) NOT NULL,
  class_nice         VARCHAR(100) NOT NULL COMMENT 'classes NCL separadas por vírgula',
  status             ENUM('pending','granted','opposed','expired','cancelled') NOT NULL,
  filed_at           DATE NULL,
  granted_at         DATE NULL,
  expires_at         DATE NULL,
  jurisdiction       CHAR(2) NOT NULL DEFAULT 'BR',
  owner_name         VARCHAR(255) NULL,
  document_url       VARCHAR(1024) NULL,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_tm (registry, registration_no, jurisdiction),
  KEY idx_tm_brand (brand_id),
  KEY idx_tm_exp (expires_at),
  CONSTRAINT fk_tm_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================================
-- 3. FONTES DE MONITORAMENTO (13+ canais)
-- =====================================================================

CREATE TABLE monitoring_sources (
  id           SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code         VARCHAR(40) NOT NULL COMMENT 'google, bing, instagram, tiktok...',
  name         VARCHAR(80) NOT NULL,
  category     ENUM('search','social','marketplace','news','forum','domain','app_store','darkweb','ads','video','review') NOT NULL,
  icon         VARCHAR(60) NULL,
  is_enabled   BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id),
  UNIQUE KEY uk_src_code (code)
) ENGINE=InnoDB;

CREATE TABLE brand_source_configs (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  brand_id     BIGINT UNSIGNED NOT NULL,
  source_id    SMALLINT UNSIGNED NOT NULL,
  is_enabled   BOOLEAN NOT NULL DEFAULT TRUE,
  poll_seconds INT UNSIGNED NOT NULL DEFAULT 900,
  config_json  JSON NULL,
  last_run_at  DATETIME NULL,
  next_run_at  DATETIME NULL,
  last_status  ENUM('ok','warn','error') NULL,
  last_error   VARCHAR(512) NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_brand_src (brand_id, source_id),
  KEY idx_bsc_next (next_run_at),
  CONSTRAINT fk_bsc_brand FOREIGN KEY (brand_id)  REFERENCES brands(id)             ON DELETE CASCADE,
  CONSTRAINT fk_bsc_src   FOREIGN KEY (source_id) REFERENCES monitoring_sources(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE crawl_jobs (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  brand_id       BIGINT UNSIGNED NOT NULL,
  source_id      SMALLINT UNSIGNED NOT NULL,
  status         ENUM('queued','running','done','failed','cancelled') NOT NULL DEFAULT 'queued',
  attempts       TINYINT UNSIGNED NOT NULL DEFAULT 0,
  scheduled_at   DATETIME NOT NULL,
  started_at     DATETIME NULL,
  finished_at    DATETIME NULL,
  items_found    INT UNSIGNED NOT NULL DEFAULT 0,
  error          VARCHAR(1024) NULL,
  meta_json      JSON NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_job_status_sched (status, scheduled_at),
  KEY idx_job_brand (brand_id, created_at),
  CONSTRAINT fk_job_brand FOREIGN KEY (brand_id)  REFERENCES brands(id)             ON DELETE CASCADE,
  CONSTRAINT fk_job_src   FOREIGN KEY (source_id) REFERENCES monitoring_sources(id)
) ENGINE=InnoDB;

-- =====================================================================
-- 4. MENÇÕES, SENTIMENTO E EVENTOS BRUTOS
-- =====================================================================

CREATE TABLE mentions (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid            CHAR(36) NOT NULL,
  organization_id BIGINT UNSIGNED NOT NULL,
  brand_id        BIGINT UNSIGNED NOT NULL,
  source_id       SMALLINT UNSIGNED NOT NULL,
  external_id     VARCHAR(191) NULL COMMENT 'ID no canal (post id, url hash)',
  url             VARCHAR(1024) NULL,
  author_handle   VARCHAR(191) NULL,
  author_url      VARCHAR(512) NULL,
  author_followers INT UNSIGNED NULL,
  language        VARCHAR(10) NULL,
  title           VARCHAR(512) NULL,
  content         MEDIUMTEXT NULL,
  content_hash    CHAR(64) NOT NULL COMMENT 'SHA-256 p/ dedup',
  sentiment       ENUM('positive','neutral','negative','mixed') NULL,
  sentiment_score DECIMAL(4,3) NULL COMMENT '-1.000 a 1.000',
  reach_estimate  INT UNSIGNED NULL,
  engagement      INT UNSIGNED NULL,
  is_crisis_signal BOOLEAN NOT NULL DEFAULT FALSE,
  detected_at     DATETIME NOT NULL,
  published_at    DATETIME NULL,
  raw_json        JSON NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_mention_uuid (uuid),
  UNIQUE KEY uk_mention_dedup (brand_id, source_id, content_hash),
  KEY idx_mention_org_time (organization_id, detected_at),
  KEY idx_mention_brand_time (brand_id, detected_at),
  KEY idx_mention_sent (brand_id, sentiment, detected_at),
  FULLTEXT KEY ft_mention_content (title, content),
  CONSTRAINT fk_mention_org   FOREIGN KEY (organization_id) REFERENCES organizations(id)     ON DELETE CASCADE,
  CONSTRAINT fk_mention_brand FOREIGN KEY (brand_id)        REFERENCES brands(id)            ON DELETE CASCADE,
  CONSTRAINT fk_mention_src   FOREIGN KEY (source_id)       REFERENCES monitoring_sources(id)
) ENGINE=InnoDB;

-- =====================================================================
-- 5. AMEAÇAS UNIFICADAS (threats) — modelo poliformico
--    Cada módulo (domínios, ads, marketplace, social, deepfake, darkweb,
--    influencer, competitor) referencia OU herda desta tabela central.
-- =====================================================================

CREATE TABLE threats (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid            CHAR(36) NOT NULL,
  organization_id BIGINT UNSIGNED NOT NULL,
  brand_id        BIGINT UNSIGNED NOT NULL,
  category        ENUM(
                    'domain_squat','phishing','fake_profile','fake_ad','impersonation',
                    'counterfeit','unauthorized_reseller','trademark_misuse','deepfake',
                    'leak','darkweb','review_bomb','crisis','other'
                  ) NOT NULL,
  source_id       SMALLINT UNSIGNED NULL,
  mention_id      BIGINT UNSIGNED NULL,
  title           VARCHAR(300) NOT NULL,
  description     TEXT NULL,
  url             VARCHAR(1024) NULL,
  severity        ENUM('info','low','medium','high','critical') NOT NULL DEFAULT 'medium',
  risk_score      DECIMAL(5,2) NOT NULL DEFAULT 0 COMMENT '0-100',
  status          ENUM('new','triage','investigating','action_pending','in_takedown','resolved','dismissed','false_positive') NOT NULL DEFAULT 'new',
  assigned_to     BIGINT UNSIGNED NULL,
  evidence_json   JSON NULL,
  first_seen_at   DATETIME NOT NULL,
  last_seen_at    DATETIME NOT NULL,
  resolved_at     DATETIME NULL,
  estimated_loss_brl DECIMAL(14,2) NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_threat_uuid (uuid),
  KEY idx_threat_org_status (organization_id, status, severity),
  KEY idx_threat_brand_cat (brand_id, category, status),
  KEY idx_threat_assignee (assigned_to, status),
  KEY idx_threat_first_seen (first_seen_at),
  CONSTRAINT fk_threat_org   FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_threat_brand FOREIGN KEY (brand_id)        REFERENCES brands(id)        ON DELETE CASCADE,
  CONSTRAINT fk_threat_src   FOREIGN KEY (source_id)       REFERENCES monitoring_sources(id),
  CONSTRAINT fk_threat_ment  FOREIGN KEY (mention_id)      REFERENCES mentions(id)      ON DELETE SET NULL,
  CONSTRAINT fk_threat_user  FOREIGN KEY (assigned_to)     REFERENCES users(id)         ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE threat_evidence (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  threat_id   BIGINT UNSIGNED NOT NULL,
  kind        ENUM('screenshot','html','pdf','video','whois','dns','har','other') NOT NULL,
  url         VARCHAR(1024) NOT NULL,
  sha256      CHAR(64) NULL,
  captured_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  meta_json   JSON NULL,
  PRIMARY KEY (id),
  KEY idx_evidence_threat (threat_id),
  CONSTRAINT fk_evidence_threat FOREIGN KEY (threat_id) REFERENCES threats(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE threat_comments (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  threat_id  BIGINT UNSIGNED NOT NULL,
  user_id    BIGINT UNSIGNED NULL,
  is_ai      BOOLEAN NOT NULL DEFAULT FALSE,
  body       MEDIUMTEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tc_threat (threat_id, created_at),
  CONSTRAINT fk_tc_threat FOREIGN KEY (threat_id) REFERENCES threats(id) ON DELETE CASCADE,
  CONSTRAINT fk_tc_user   FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================================
-- 6. MÓDULOS ESPECIALIZADOS (detalhes específicos por categoria)
-- =====================================================================

-- 6.1 Domain Guardian
CREATE TABLE domain_findings (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  threat_id     BIGINT UNSIGNED NOT NULL,
  domain        VARCHAR(255) NOT NULL,
  tld           VARCHAR(20)  NOT NULL,
  registrar     VARCHAR(120) NULL,
  registered_at DATE NULL,
  expires_at    DATE NULL,
  ns_records    JSON NULL,
  a_records     JSON NULL,
  mx_records    JSON NULL,
  whois_json    JSON NULL,
  similarity    DECIMAL(4,3) NULL COMMENT 'Levenshtein/typosquat score',
  has_mx        BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'sinal de phishing',
  has_ssl       BOOLEAN NOT NULL DEFAULT FALSE,
  ssl_issuer    VARCHAR(255) NULL,
  screenshot_url VARCHAR(1024) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_domain_threat (threat_id),
  KEY idx_domain_name (domain),
  CONSTRAINT fk_df_threat FOREIGN KEY (threat_id) REFERENCES threats(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6.2 Ads Guardian (Google/Meta bidding em brand)
CREATE TABLE ad_findings (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  threat_id    BIGINT UNSIGNED NOT NULL,
  network      ENUM('google_ads','meta_ads','tiktok_ads','bing_ads','other') NOT NULL,
  advertiser   VARCHAR(255) NULL,
  keyword      VARCHAR(255) NULL,
  landing_url  VARCHAR(1024) NULL,
  ad_copy      TEXT NULL,
  first_seen_at DATETIME NOT NULL,
  active_days  INT UNSIGNED NOT NULL DEFAULT 0,
  spend_estimate DECIMAL(12,2) NULL,
  region       VARCHAR(80) NULL,
  screenshot_url VARCHAR(1024) NULL,
  PRIMARY KEY (id),
  KEY idx_ad_threat (threat_id),
  KEY idx_ad_advertiser (advertiser),
  CONSTRAINT fk_ad_threat FOREIGN KEY (threat_id) REFERENCES threats(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6.3 Social Media (perfis falsos)
CREATE TABLE social_findings (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  threat_id    BIGINT UNSIGNED NOT NULL,
  network      ENUM('instagram','facebook','tiktok','youtube','linkedin','twitter','threads','other') NOT NULL,
  handle       VARCHAR(120) NOT NULL,
  profile_url  VARCHAR(1024) NOT NULL,
  followers    INT UNSIGNED NULL,
  is_verified_fake BOOLEAN NOT NULL DEFAULT FALSE,
  posts_count  INT UNSIGNED NULL,
  similarity   DECIMAL(4,3) NULL,
  bio          TEXT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_social_threat (threat_id),
  KEY idx_social_handle (network, handle),
  CONSTRAINT fk_sf_threat FOREIGN KEY (threat_id) REFERENCES threats(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6.4 Marketplace
CREATE TABLE marketplace_findings (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  threat_id    BIGINT UNSIGNED NOT NULL,
  marketplace  ENUM('amazon','mercadolivre','shopee','magalu','americanas','ebay','aliexpress','other') NOT NULL,
  seller       VARCHAR(255) NULL,
  listing_id   VARCHAR(120) NULL,
  title        VARCHAR(512) NULL,
  price        DECIMAL(12,2) NULL,
  currency     CHAR(3) NULL,
  stock        INT NULL,
  is_counterfeit BOOLEAN NOT NULL DEFAULT FALSE,
  is_unauthorized_reseller BOOLEAN NOT NULL DEFAULT FALSE,
  screenshot_url VARCHAR(1024) NULL,
  PRIMARY KEY (id),
  KEY idx_mp_threat (threat_id),
  KEY idx_mp_seller (marketplace, seller),
  CONSTRAINT fk_mp_threat FOREIGN KEY (threat_id) REFERENCES threats(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6.5 Deepfake / uso indevido de imagem/voz
CREATE TABLE deepfake_findings (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  threat_id    BIGINT UNSIGNED NOT NULL,
  media_kind   ENUM('image','video','audio') NOT NULL,
  media_url    VARCHAR(1024) NOT NULL,
  detected_person VARCHAR(255) NULL,
  confidence   DECIMAL(4,3) NOT NULL COMMENT '0.000-1.000',
  model_used   VARCHAR(80) NULL,
  frames_json  JSON NULL,
  audio_features_json JSON NULL,
  PRIMARY KEY (id),
  KEY idx_df_threat (threat_id),
  CONSTRAINT fk_df2_threat FOREIGN KEY (threat_id) REFERENCES threats(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6.6 Dark web
CREATE TABLE darkweb_findings (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  threat_id    BIGINT UNSIGNED NOT NULL,
  source_name  VARCHAR(120) NOT NULL COMMENT 'forum/onion/telegram',
  onion_url    VARCHAR(512) NULL,
  actor        VARCHAR(120) NULL,
  leak_type    ENUM('credentials','pii','financial','source_code','documents','chatter','other') NOT NULL,
  sample_hash  CHAR(64) NULL,
  records_count INT UNSIGNED NULL,
  price_btc    DECIMAL(18,8) NULL,
  first_posted_at DATETIME NULL,
  PRIMARY KEY (id),
  KEY idx_dw_threat (threat_id),
  CONSTRAINT fk_dw_threat FOREIGN KEY (threat_id) REFERENCES threats(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6.7 Influenciadores
CREATE TABLE influencers (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  brand_id      BIGINT UNSIGNED NULL,
  handle        VARCHAR(120) NOT NULL,
  network       ENUM('instagram','tiktok','youtube','twitter','linkedin','other') NOT NULL,
  followers     INT UNSIGNED NULL,
  engagement_rate DECIMAL(5,2) NULL,
  relationship  ENUM('official','affiliate','organic','risky','banned') NOT NULL DEFAULT 'organic',
  meta_json     JSON NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_influencer (organization_id, network, handle),
  KEY idx_infl_brand (brand_id),
  CONSTRAINT fk_infl_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_infl_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6.8 Concorrentes rastreados
CREATE TABLE competitors (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  brand_id     BIGINT UNSIGNED NOT NULL,
  name         VARCHAR(180) NOT NULL,
  website      VARCHAR(255) NULL,
  aliases_json JSON NULL,
  notes        TEXT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_comp (brand_id, name),
  CONSTRAINT fk_comp_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================================
-- 7. ALERTAS & NOTIFICAÇÕES
-- =====================================================================

CREATE TABLE alert_rules (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  brand_id      BIGINT UNSIGNED NULL,
  name          VARCHAR(180) NOT NULL,
  description   TEXT NULL,
  trigger_json  JSON NOT NULL COMMENT 'ex: {"category":"phishing","severity_min":"high"}',
  channels_json JSON NOT NULL COMMENT '["email","slack","webhook","sms","inapp"]',
  is_enabled    BOOLEAN NOT NULL DEFAULT TRUE,
  cooldown_seconds INT UNSIGNED NOT NULL DEFAULT 300,
  created_by    BIGINT UNSIGNED NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_rule_org (organization_id, is_enabled),
  CONSTRAINT fk_rule_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_rule_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE alerts (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid            CHAR(36) NOT NULL,
  organization_id BIGINT UNSIGNED NOT NULL,
  brand_id        BIGINT UNSIGNED NOT NULL,
  rule_id         BIGINT UNSIGNED NULL,
  threat_id       BIGINT UNSIGNED NULL,
  severity        ENUM('info','low','medium','high','critical') NOT NULL,
  title           VARCHAR(300) NOT NULL,
  body            TEXT NULL,
  status          ENUM('new','ack','snoozed','resolved','dismissed') NOT NULL DEFAULT 'new',
  ack_by          BIGINT UNSIGNED NULL,
  ack_at          DATETIME NULL,
  snooze_until    DATETIME NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_alert_uuid (uuid),
  KEY idx_alert_org_status (organization_id, status, severity),
  KEY idx_alert_brand_time (brand_id, created_at),
  CONSTRAINT fk_alert_org   FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_alert_brand FOREIGN KEY (brand_id)        REFERENCES brands(id)        ON DELETE CASCADE,
  CONSTRAINT fk_alert_rule  FOREIGN KEY (rule_id)         REFERENCES alert_rules(id)   ON DELETE SET NULL,
  CONSTRAINT fk_alert_threat FOREIGN KEY (threat_id)      REFERENCES threats(id)       ON DELETE SET NULL,
  CONSTRAINT fk_alert_ack   FOREIGN KEY (ack_by)          REFERENCES users(id)         ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE notifications (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       BIGINT UNSIGNED NOT NULL,
  organization_id BIGINT UNSIGNED NOT NULL,
  alert_id      BIGINT UNSIGNED NULL,
  channel       ENUM('inapp','email','sms','slack','webhook','push') NOT NULL,
  title         VARCHAR(255) NOT NULL,
  body          TEXT NULL,
  link_url      VARCHAR(1024) NULL,
  is_read       BOOLEAN NOT NULL DEFAULT FALSE,
  read_at       DATETIME NULL,
  delivery_status ENUM('queued','sent','delivered','failed','bounced') NOT NULL DEFAULT 'queued',
  delivery_error VARCHAR(512) NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notif_user_unread (user_id, is_read, created_at),
  KEY idx_notif_alert (alert_id),
  CONSTRAINT fk_notif_user  FOREIGN KEY (user_id)         REFERENCES users(id)         ON DELETE CASCADE,
  CONSTRAINT fk_notif_org   FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_notif_alert FOREIGN KEY (alert_id)        REFERENCES alerts(id)        ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================================
-- 8. TAKEDOWNS, JURÍDICO & PLAYBOOKS
-- =====================================================================

CREATE TABLE takedowns (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid            CHAR(36) NOT NULL,
  organization_id BIGINT UNSIGNED NOT NULL,
  threat_id       BIGINT UNSIGNED NOT NULL,
  channel         ENUM('registrar','hosting','google','meta','tiktok','marketplace','app_store','isp','court','other') NOT NULL,
  target          VARCHAR(512) NOT NULL,
  method          ENUM('dmca','tos','trademark','court_order','ce_notice','api') NOT NULL,
  status          ENUM('draft','submitted','ack','in_review','approved','rejected','removed','partial','expired') NOT NULL DEFAULT 'draft',
  submitted_at    DATETIME NULL,
  responded_at    DATETIME NULL,
  removed_at      DATETIME NULL,
  reference_no    VARCHAR(120) NULL,
  request_body    MEDIUMTEXT NULL,
  response_body   MEDIUMTEXT NULL,
  assigned_to     BIGINT UNSIGNED NULL,
  cost_brl        DECIMAL(12,2) NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_td_uuid (uuid),
  KEY idx_td_org_status (organization_id, status),
  KEY idx_td_threat (threat_id),
  CONSTRAINT fk_td_org    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_td_threat FOREIGN KEY (threat_id)       REFERENCES threats(id)       ON DELETE CASCADE,
  CONSTRAINT fk_td_user   FOREIGN KEY (assigned_to)     REFERENCES users(id)         ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE legal_cases (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  brand_id        BIGINT UNSIGNED NOT NULL,
  case_type       ENUM('extrajudicial_notice','opposition','lawsuit','arbitration','regulatory','other') NOT NULL,
  title           VARCHAR(255) NOT NULL,
  status          ENUM('draft','preparing','sent','ongoing','won','lost','settled','closed') NOT NULL DEFAULT 'draft',
  jurisdiction    CHAR(2) NULL,
  case_no         VARCHAR(120) NULL,
  counterparty    VARCHAR(255) NULL,
  law_firm        VARCHAR(255) NULL,
  opened_at       DATE NULL,
  closed_at       DATE NULL,
  cost_brl        DECIMAL(14,2) NULL,
  summary         TEXT NULL,
  ai_draft_json   JSON NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_lc_org (organization_id, status),
  KEY idx_lc_brand (brand_id),
  CONSTRAINT fk_lc_org   FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_lc_brand FOREIGN KEY (brand_id)        REFERENCES brands(id)        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE legal_documents (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  case_id      BIGINT UNSIGNED NULL,
  threat_id    BIGINT UNSIGNED NULL,
  organization_id BIGINT UNSIGNED NOT NULL,
  kind         ENUM('notice','opposition','power_of_attorney','contract','report','court_doc','other') NOT NULL,
  title        VARCHAR(255) NOT NULL,
  file_url     VARCHAR(1024) NOT NULL,
  sha256       CHAR(64) NULL,
  generated_by ENUM('ai','human','template') NOT NULL DEFAULT 'human',
  version      SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ldoc_case (case_id),
  KEY idx_ldoc_threat (threat_id),
  CONSTRAINT fk_ldoc_org    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_ldoc_case   FOREIGN KEY (case_id)         REFERENCES legal_cases(id)   ON DELETE CASCADE,
  CONSTRAINT fk_ldoc_threat FOREIGN KEY (threat_id)       REFERENCES threats(id)       ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE playbooks (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NULL COMMENT 'NULL = template global',
  name            VARCHAR(180) NOT NULL,
  description     TEXT NULL,
  trigger_json    JSON NOT NULL,
  steps_json      JSON NOT NULL,
  is_autopilot    BOOLEAN NOT NULL DEFAULT FALSE,
  is_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
  created_by      BIGINT UNSIGNED NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pb_org (organization_id, is_enabled),
  CONSTRAINT fk_pb_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE playbook_runs (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  playbook_id  BIGINT UNSIGNED NOT NULL,
  threat_id    BIGINT UNSIGNED NULL,
  alert_id     BIGINT UNSIGNED NULL,
  triggered_by ENUM('auto','manual','api','ai') NOT NULL,
  status       ENUM('running','paused','done','failed','cancelled') NOT NULL DEFAULT 'running',
  step_state_json JSON NULL,
  started_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at  DATETIME NULL,
  error        VARCHAR(1024) NULL,
  PRIMARY KEY (id),
  KEY idx_pr_playbook (playbook_id, started_at),
  CONSTRAINT fk_pr_pb     FOREIGN KEY (playbook_id) REFERENCES playbooks(id) ON DELETE CASCADE,
  CONSTRAINT fk_pr_threat FOREIGN KEY (threat_id)   REFERENCES threats(id)   ON DELETE SET NULL,
  CONSTRAINT fk_pr_alert  FOREIGN KEY (alert_id)    REFERENCES alerts(id)    ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================================
-- 9. WAR ROOM / CRISE / INCIDENTES
-- =====================================================================

CREATE TABLE incidents (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid            CHAR(36) NOT NULL,
  organization_id BIGINT UNSIGNED NOT NULL,
  brand_id        BIGINT UNSIGNED NOT NULL,
  code            VARCHAR(20) NOT NULL COMMENT 'WR-2408',
  title           VARCHAR(300) NOT NULL,
  description     TEXT NULL,
  severity_index  DECIMAL(5,2) NOT NULL DEFAULT 0 COMMENT '0-100',
  status          ENUM('open','contained','resolved','post_mortem','closed') NOT NULL DEFAULT 'open',
  sentiment_score DECIMAL(4,3) NULL,
  mentions_delta_pct DECIMAL(6,2) NULL,
  sla_seconds     INT UNSIGNED NOT NULL DEFAULT 900,
  sla_started_at  DATETIME NULL,
  sla_first_response_at DATETIME NULL,
  opened_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at     DATETIME NULL,
  post_mortem_url VARCHAR(1024) NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_inc_uuid (uuid),
  UNIQUE KEY uk_inc_code (organization_id, code),
  KEY idx_inc_status (organization_id, status),
  CONSTRAINT fk_inc_org   FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_inc_brand FOREIGN KEY (brand_id)        REFERENCES brands(id)        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE incident_participants (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  incident_id  BIGINT UNSIGNED NOT NULL,
  user_id      BIGINT UNSIGNED NOT NULL,
  role_label   VARCHAR(80) NULL COMMENT 'CMO, Jurídico, PR...',
  presence     ENUM('on','away','off') NOT NULL DEFAULT 'on',
  joined_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  left_at      DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_ip (incident_id, user_id),
  CONSTRAINT fk_ip_inc  FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
  CONSTRAINT fk_ip_user FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE incident_steps (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  incident_id  BIGINT UNSIGNED NOT NULL,
  ord          SMALLINT UNSIGNED NOT NULL,
  label        VARCHAR(255) NOT NULL,
  is_done      BOOLEAN NOT NULL DEFAULT FALSE,
  done_by      BIGINT UNSIGNED NULL,
  done_at      DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_step_ord (incident_id, ord),
  CONSTRAINT fk_is_inc  FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
  CONSTRAINT fk_is_user FOREIGN KEY (done_by)     REFERENCES users(id)     ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE incident_timeline (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  incident_id  BIGINT UNSIGNED NOT NULL,
  actor_user_id BIGINT UNSIGNED NULL,
  event_type   VARCHAR(60) NOT NULL COMMENT 'note, action, status_change, ai_message',
  body         TEXT NULL,
  meta_json    JSON NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_itl_inc (incident_id, created_at),
  CONSTRAINT fk_itl_inc  FOREIGN KEY (incident_id)   REFERENCES incidents(id) ON DELETE CASCADE,
  CONSTRAINT fk_itl_user FOREIGN KEY (actor_user_id) REFERENCES users(id)     ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================================
-- 10. INTELIGÊNCIA / IA / PREDIÇÃO
-- =====================================================================

CREATE TABLE ai_conversations (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  user_id      BIGINT UNSIGNED NULL,
  brand_id     BIGINT UNSIGNED NULL,
  title        VARCHAR(255) NULL,
  context_kind ENUM('global','brand','threat','incident','report') NOT NULL DEFAULT 'global',
  context_ref_id BIGINT UNSIGNED NULL,
  model        VARCHAR(80) NOT NULL DEFAULT 'gpt-5',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_aic_org_user (organization_id, user_id, updated_at),
  CONSTRAINT fk_aic_org  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_aic_user FOREIGN KEY (user_id)         REFERENCES users(id)         ON DELETE SET NULL,
  CONSTRAINT fk_aic_brand FOREIGN KEY (brand_id)       REFERENCES brands(id)        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE ai_messages (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conversation_id BIGINT UNSIGNED NOT NULL,
  role            ENUM('system','user','assistant','tool') NOT NULL,
  content         MEDIUMTEXT NULL,
  tool_calls_json JSON NULL,
  tokens_in       INT UNSIGNED NULL,
  tokens_out      INT UNSIGNED NULL,
  cost_usd        DECIMAL(10,6) NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_aim_conv (conversation_id, created_at),
  CONSTRAINT fk_aim_conv FOREIGN KEY (conversation_id) REFERENCES ai_conversations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE ai_predictions (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  brand_id        BIGINT UNSIGNED NOT NULL,
  kind            ENUM('crisis_probability','threat_volume','sentiment_forecast','loss_forecast','churn_risk','custom') NOT NULL,
  horizon_days    SMALLINT UNSIGNED NOT NULL,
  probability     DECIMAL(5,4) NULL,
  value_forecast  DECIMAL(14,2) NULL,
  confidence      DECIMAL(4,3) NULL,
  drivers_json    JSON NULL,
  model_version   VARCHAR(40) NOT NULL,
  computed_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pred_brand_kind (brand_id, kind, computed_at),
  CONSTRAINT fk_pred_org   FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_pred_brand FOREIGN KEY (brand_id)        REFERENCES brands(id)        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE brand_health_snapshots (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  brand_id        BIGINT UNSIGNED NOT NULL,
  captured_at     DATETIME NOT NULL,
  score           DECIMAL(5,2) NOT NULL,
  score_delta     DECIMAL(6,2) NULL,
  components_json JSON NOT NULL COMMENT '{"reputation":78,"legal":90,...}',
  PRIMARY KEY (id),
  KEY idx_bhs_brand_time (brand_id, captured_at),
  CONSTRAINT fk_bhs_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE benchmarks (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  industry        VARCHAR(120) NOT NULL,
  metric          VARCHAR(80) NOT NULL,
  percentile      TINYINT UNSIGNED NOT NULL,
  value           DECIMAL(14,4) NOT NULL,
  sample_size     INT UNSIGNED NOT NULL,
  period_start    DATE NOT NULL,
  period_end      DATE NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_bench (industry, metric, percentile, period_end)
) ENGINE=InnoDB;

-- =====================================================================
-- 11. RELATÓRIOS, ROI, DASHBOARDS SALVOS
-- =====================================================================

CREATE TABLE reports (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  brand_id        BIGINT UNSIGNED NULL,
  kind            ENUM('executive','quarterly','audit','custom','wrapped') NOT NULL,
  title           VARCHAR(255) NOT NULL,
  period_start    DATE NOT NULL,
  period_end      DATE NOT NULL,
  pages           SMALLINT UNSIGNED NULL,
  file_url        VARCHAR(1024) NULL,
  status          ENUM('generating','ready','failed','archived') NOT NULL DEFAULT 'generating',
  generated_by    BIGINT UNSIGNED NULL,
  meta_json       JSON NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_rep_org (organization_id, kind, created_at),
  CONSTRAINT fk_rep_org   FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_rep_brand FOREIGN KEY (brand_id)        REFERENCES brands(id)        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE roi_events (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  brand_id        BIGINT UNSIGNED NOT NULL,
  threat_id       BIGINT UNSIGNED NULL,
  takedown_id     BIGINT UNSIGNED NULL,
  kind            ENUM('loss_prevented','revenue_recovered','cost_avoided','ad_savings','settlement') NOT NULL,
  amount_brl      DECIMAL(14,2) NOT NULL,
  currency        CHAR(3) NOT NULL DEFAULT 'BRL',
  basis           VARCHAR(255) NULL COMMENT 'como calculou (fórmula)',
  occurred_at     DATETIME NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_roi_org_time (organization_id, occurred_at),
  KEY idx_roi_brand_kind (brand_id, kind),
  CONSTRAINT fk_roi_org   FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_roi_brand FOREIGN KEY (brand_id)        REFERENCES brands(id)        ON DELETE CASCADE,
  CONSTRAINT fk_roi_threat FOREIGN KEY (threat_id)      REFERENCES threats(id)       ON DELETE SET NULL,
  CONSTRAINT fk_roi_td    FOREIGN KEY (takedown_id)     REFERENCES takedowns(id)     ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE saved_views (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  user_id         BIGINT UNSIGNED NULL,
  name            VARCHAR(120) NOT NULL,
  entity          VARCHAR(40)  NOT NULL COMMENT 'threats, alerts, ads...',
  filters_json    JSON NOT NULL,
  is_shared       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_sv_org (organization_id, entity),
  CONSTRAINT fk_sv_org  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_sv_user FOREIGN KEY (user_id)         REFERENCES users(id)         ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================================
-- 12. ONBOARDING, ENGAJAMENTO, WRAPPED
-- =====================================================================

CREATE TABLE onboarding_progress (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  user_id         BIGINT UNSIGNED NOT NULL,
  step_code       VARCHAR(60) NOT NULL,
  completed       BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at    DATETIME NULL,
  data_json       JSON NULL,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_ob (organization_id, user_id, step_code),
  CONSTRAINT fk_ob_org  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_ob_user FOREIGN KEY (user_id)         REFERENCES users(id)         ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE wrapped_reports (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  brand_id        BIGINT UNSIGNED NULL,
  year            SMALLINT UNSIGNED NOT NULL,
  data_json       JSON NOT NULL COMMENT 'stats do ano estilo Spotify Wrapped',
  share_slug      VARCHAR(80) NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_wrapped (organization_id, brand_id, year),
  KEY idx_wrapped_share (share_slug),
  CONSTRAINT fk_wr_org   FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_wr_brand FOREIGN KEY (brand_id)        REFERENCES brands(id)        ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================================
-- 13. BILLING / PLANOS / PAGAMENTOS / USO
-- =====================================================================

CREATE TABLE plans (
  id            SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code          VARCHAR(40) NOT NULL,
  name          VARCHAR(80) NOT NULL,
  price_monthly_brl DECIMAL(10,2) NOT NULL,
  price_yearly_brl  DECIMAL(10,2) NOT NULL,
  brand_limit   INT UNSIGNED NOT NULL,
  user_limit    INT UNSIGNED NOT NULL,
  monitor_limit INT UNSIGNED NOT NULL,
  takedown_limit_monthly INT UNSIGNED NOT NULL,
  features_json JSON NOT NULL,
  is_public     BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id),
  UNIQUE KEY uk_plan_code (code)
) ENGINE=InnoDB;

CREATE TABLE subscriptions (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  plan_id         SMALLINT UNSIGNED NOT NULL,
  status          ENUM('trialing','active','past_due','paused','cancelled','expired') NOT NULL,
  billing_cycle   ENUM('monthly','yearly') NOT NULL,
  provider        ENUM('stripe','pagarme','iugu','manual','paddle') NOT NULL,
  provider_customer_id VARCHAR(120) NULL,
  provider_subscription_id VARCHAR(120) NULL,
  current_period_start DATETIME NOT NULL,
  current_period_end   DATETIME NOT NULL,
  cancel_at       DATETIME NULL,
  cancelled_at    DATETIME NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_sub_org (organization_id),
  CONSTRAINT fk_sub_org  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_sub_plan FOREIGN KEY (plan_id)         REFERENCES plans(id)
) ENGINE=InnoDB;

CREATE TABLE invoices (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  subscription_id BIGINT UNSIGNED NULL,
  number          VARCHAR(60) NOT NULL,
  amount_brl      DECIMAL(12,2) NOT NULL,
  tax_brl         DECIMAL(12,2) NOT NULL DEFAULT 0,
  currency        CHAR(3) NOT NULL DEFAULT 'BRL',
  status          ENUM('draft','open','paid','void','uncollectible','refunded') NOT NULL DEFAULT 'open',
  provider        VARCHAR(20) NOT NULL,
  provider_invoice_id VARCHAR(120) NULL,
  hosted_url      VARCHAR(1024) NULL,
  issued_at       DATETIME NOT NULL,
  due_at          DATETIME NULL,
  paid_at         DATETIME NULL,
  items_json      JSON NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_inv_number (organization_id, number),
  KEY idx_inv_status (organization_id, status),
  CONSTRAINT fk_inv_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_inv_sub FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE payments (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  invoice_id      BIGINT UNSIGNED NOT NULL,
  method          ENUM('card','pix','boleto','wire','manual') NOT NULL,
  status          ENUM('pending','authorized','paid','failed','refunded','chargeback') NOT NULL,
  amount_brl      DECIMAL(12,2) NOT NULL,
  provider_txn_id VARCHAR(120) NULL,
  paid_at         DATETIME NULL,
  raw_json        JSON NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pay_inv (invoice_id),
  CONSTRAINT fk_pay_inv FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE usage_counters (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  metric          VARCHAR(60) NOT NULL COMMENT 'takedowns, ai_tokens, monitored_urls',
  period_ym       CHAR(7) NOT NULL COMMENT '2026-11',
  quantity        BIGINT UNSIGNED NOT NULL DEFAULT 0,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_usage (organization_id, metric, period_ym),
  CONSTRAINT fk_usage_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================================
-- 14. INTEGRAÇÕES / APPS / WEBHOOKS
-- =====================================================================

CREATE TABLE integrations (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  provider        VARCHAR(60) NOT NULL COMMENT 'slack, teams, google, meta, hubspot...',
  status          ENUM('connected','disconnected','error') NOT NULL DEFAULT 'connected',
  config_json     JSON NULL,
  credentials_enc VARBINARY(2048) NULL COMMENT 'AES-GCM',
  connected_by    BIGINT UNSIGNED NULL,
  connected_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_sync_at    DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_integ (organization_id, provider),
  CONSTRAINT fk_integ_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE webhook_endpoints (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_id BIGINT UNSIGNED NOT NULL,
  url             VARCHAR(1024) NOT NULL,
  secret_enc      VARBINARY(512) NOT NULL,
  events_json     JSON NOT NULL,
  is_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_wh_org (organization_id),
  CONSTRAINT fk_wh_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE webhook_deliveries (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  endpoint_id  BIGINT UNSIGNED NOT NULL,
  event_type   VARCHAR(80) NOT NULL,
  payload_json JSON NOT NULL,
  http_status  SMALLINT NULL,
  response_body TEXT NULL,
  attempts     TINYINT UNSIGNED NOT NULL DEFAULT 0,
  next_retry_at DATETIME NULL,
  delivered_at DATETIME NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_wd_endpoint (endpoint_id, created_at),
  KEY idx_wd_retry (next_retry_at),
  CONSTRAINT fk_wd_endpoint FOREIGN KEY (endpoint_id) REFERENCES webhook_endpoints(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================================
-- 15. SITE INSTITUCIONAL (leads, propostas, blog, status page)
-- =====================================================================

CREATE TABLE marketing_leads (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name    VARCHAR(180) NOT NULL,
  email        VARCHAR(255) NOT NULL,
  phone        VARCHAR(32)  NULL,
  company      VARCHAR(180) NULL,
  role_title   VARCHAR(120) NULL,
  brand_name   VARCHAR(180) NULL,
  message      TEXT NULL,
  source       VARCHAR(80) NULL COMMENT 'landing:hero, /diagnostico, /juridico',
  utm_source   VARCHAR(120) NULL,
  utm_medium   VARCHAR(120) NULL,
  utm_campaign VARCHAR(120) NULL,
  utm_content  VARCHAR(120) NULL,
  utm_term     VARCHAR(120) NULL,
  referrer     VARCHAR(512) NULL,
  ip           VARBINARY(16) NULL,
  user_agent   VARCHAR(512) NULL,
  status       ENUM('new','contacted','qualified','proposal','won','lost') NOT NULL DEFAULT 'new',
  organization_id BIGINT UNSIGNED NULL COMMENT 'set após conversão',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_lead_email (email),
  KEY idx_lead_status (status, created_at),
  CONSTRAINT fk_lead_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE proposals (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  lead_id      BIGINT UNSIGNED NULL,
  organization_id BIGINT UNSIGNED NULL,
  code         VARCHAR(30) NOT NULL,
  title        VARCHAR(255) NOT NULL,
  amount_brl   DECIMAL(12,2) NOT NULL,
  status       ENUM('draft','sent','viewed','accepted','declined','expired') NOT NULL DEFAULT 'draft',
  valid_until  DATE NULL,
  content_json JSON NOT NULL,
  file_url     VARCHAR(1024) NULL,
  sent_at      DATETIME NULL,
  viewed_at    DATETIME NULL,
  decided_at   DATETIME NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_prop_code (code),
  KEY idx_prop_lead (lead_id),
  CONSTRAINT fk_prop_lead FOREIGN KEY (lead_id)         REFERENCES marketing_leads(id) ON DELETE SET NULL,
  CONSTRAINT fk_prop_org  FOREIGN KEY (organization_id) REFERENCES organizations(id)   ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE diagnostics (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  lead_id      BIGINT UNSIGNED NULL,
  brand_name   VARCHAR(180) NOT NULL,
  website      VARCHAR(255) NULL,
  input_json   JSON NOT NULL,
  score        DECIMAL(5,2) NULL,
  result_json  JSON NULL,
  status       ENUM('queued','running','done','failed') NOT NULL DEFAULT 'queued',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at  DATETIME NULL,
  PRIMARY KEY (id),
  KEY idx_diag_lead (lead_id),
  CONSTRAINT fk_diag_lead FOREIGN KEY (lead_id) REFERENCES marketing_leads(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE loss_simulations (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  lead_id      BIGINT UNSIGNED NULL,
  revenue_brl  DECIMAL(14,2) NOT NULL,
  industry     VARCHAR(120) NULL,
  channels_json JSON NULL,
  estimated_loss_brl DECIMAL(14,2) NOT NULL,
  breakdown_json JSON NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_sim_lead (lead_id),
  CONSTRAINT fk_sim_lead FOREIGN KEY (lead_id) REFERENCES marketing_leads(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE blog_posts (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug         VARCHAR(180) NOT NULL,
  title        VARCHAR(255) NOT NULL,
  excerpt      VARCHAR(500) NULL,
  content_md   MEDIUMTEXT NOT NULL,
  cover_url    VARCHAR(1024) NULL,
  author_id    BIGINT UNSIGNED NULL,
  tags_json    JSON NULL,
  seo_title    VARCHAR(180) NULL,
  seo_desc     VARCHAR(320) NULL,
  status       ENUM('draft','scheduled','published','archived') NOT NULL DEFAULT 'draft',
  published_at DATETIME NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_post_slug (slug),
  KEY idx_post_status (status, published_at),
  FULLTEXT KEY ft_post (title, excerpt, content_md),
  CONSTRAINT fk_post_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE status_components (
  id           SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code         VARCHAR(60) NOT NULL,
  name         VARCHAR(120) NOT NULL,
  description  VARCHAR(255) NULL,
  ord          SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  is_public    BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id),
  UNIQUE KEY uk_stcomp (code)
) ENGINE=InnoDB;

CREATE TABLE status_incidents (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title        VARCHAR(255) NOT NULL,
  impact       ENUM('none','minor','major','critical','maintenance') NOT NULL,
  status       ENUM('investigating','identified','monitoring','resolved') NOT NULL,
  body         MEDIUMTEXT NULL,
  started_at   DATETIME NOT NULL,
  resolved_at  DATETIME NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_sti_started (started_at)
) ENGINE=InnoDB;

CREATE TABLE status_incident_components (
  status_incident_id BIGINT UNSIGNED NOT NULL,
  component_id       SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (status_incident_id, component_id),
  CONSTRAINT fk_sic_inc  FOREIGN KEY (status_incident_id) REFERENCES status_incidents(id) ON DELETE CASCADE,
  CONSTRAINT fk_sic_comp FOREIGN KEY (component_id)        REFERENCES status_components(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE status_metrics_daily (
  component_id SMALLINT UNSIGNED NOT NULL,
  day          DATE NOT NULL,
  uptime_pct   DECIMAL(6,4) NOT NULL,
  latency_p95_ms INT UNSIGNED NULL,
  incidents_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (component_id, day),
  CONSTRAINT fk_smd_comp FOREIGN KEY (component_id) REFERENCES status_components(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE contact_messages (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name    VARCHAR(180) NOT NULL,
  email        VARCHAR(255) NOT NULL,
  subject      VARCHAR(255) NULL,
  body         TEXT NOT NULL,
  ip           VARBINARY(16) NULL,
  status       ENUM('new','read','replied','spam') NOT NULL DEFAULT 'new',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_cm_status (status, created_at)
) ENGINE=InnoDB;

-- =====================================================================
-- 16. FEATURE FLAGS / EXPERIMENTOS / CONFIG GLOBAL
-- =====================================================================

CREATE TABLE feature_flags (
  id           SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code         VARCHAR(80) NOT NULL,
  description  VARCHAR(255) NULL,
  is_enabled_default BOOLEAN NOT NULL DEFAULT FALSE,
  rollout_pct  TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uk_ff (code)
) ENGINE=InnoDB;

CREATE TABLE organization_feature_flags (
  organization_id BIGINT UNSIGNED NOT NULL,
  flag_id         SMALLINT UNSIGNED NOT NULL,
  is_enabled      BOOLEAN NOT NULL,
  PRIMARY KEY (organization_id, flag_id),
  CONSTRAINT fk_off_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_off_flag FOREIGN KEY (flag_id)        REFERENCES feature_flags(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================================
-- 17. FILA GENÉRICA DE JOBS (crawlers, PDFs, AI, exports)
-- =====================================================================

CREATE TABLE job_queue (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  queue        VARCHAR(60) NOT NULL DEFAULT 'default',
  kind         VARCHAR(80) NOT NULL,
  payload_json JSON NOT NULL,
  priority     TINYINT UNSIGNED NOT NULL DEFAULT 5,
  status       ENUM('queued','running','done','failed','dead') NOT NULL DEFAULT 'queued',
  attempts     TINYINT UNSIGNED NOT NULL DEFAULT 0,
  max_attempts TINYINT UNSIGNED NOT NULL DEFAULT 5,
  available_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reserved_at  DATETIME NULL,
  finished_at  DATETIME NULL,
  error        TEXT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_jq_pick (queue, status, available_at, priority)
) ENGINE=InnoDB;

-- =====================================================================
-- 18. VIEWS ANALÍTICAS (dashboard)
-- =====================================================================

CREATE OR REPLACE VIEW v_brand_kpis AS
SELECT
  b.id                       AS brand_id,
  b.organization_id,
  b.name                     AS brand_name,
  b.health_score,
  (SELECT COUNT(*) FROM threats  t
    WHERE t.brand_id = b.id AND t.status NOT IN ('resolved','dismissed','false_positive')) AS threats_open,
  (SELECT COUNT(*) FROM alerts   a
    WHERE a.brand_id = b.id AND a.status = 'new')                                          AS alerts_new,
  (SELECT COUNT(*) FROM takedowns d
    JOIN threats th ON th.id = d.threat_id
    WHERE th.brand_id = b.id AND d.status = 'removed')                                     AS takedowns_removed,
  (SELECT COALESCE(SUM(amount_brl),0) FROM roi_events r
    WHERE r.brand_id = b.id AND r.occurred_at >= (NOW() - INTERVAL 30 DAY))                AS roi_30d_brl
FROM brands b
WHERE b.deleted_at IS NULL;

CREATE OR REPLACE VIEW v_org_dashboard AS
SELECT
  o.id AS organization_id,
  o.trade_name,
  (SELECT COUNT(*) FROM brands b WHERE b.organization_id = o.id AND b.deleted_at IS NULL) AS brand_count,
  (SELECT COUNT(*) FROM threats t WHERE t.organization_id = o.id AND t.status = 'new')    AS threats_new,
  (SELECT AVG(health_score) FROM brands b WHERE b.organization_id = o.id AND b.deleted_at IS NULL) AS avg_health
FROM organizations o
WHERE o.deleted_at IS NULL;

-- =====================================================================
-- 19. SEEDS ESSENCIAIS
-- =====================================================================

INSERT INTO roles (code,name,scope,description) VALUES
 ('owner','Owner','org','Dono da conta — controle total'),
 ('admin','Admin','org','Administrador da organização'),
 ('security','Security Analyst','org','Analista de ameaças e takedowns'),
 ('legal','Jurídico','org','Advogado / casos legais'),
 ('marketing','Marketing / PR','org','Comunicação e crise'),
 ('viewer','Viewer','org','Somente leitura'),
 ('superadmin','Super Admin','system','Equipe Radar');

INSERT INTO permissions (code,category) VALUES
 ('brands.read','brands'), ('brands.write','brands'),
 ('threats.read','threats'), ('threats.write','threats'), ('threats.takedown','threats'),
 ('alerts.read','alerts'), ('alerts.manage','alerts'),
 ('legal.read','legal'), ('legal.write','legal'),
 ('reports.read','reports'), ('reports.generate','reports'),
 ('billing.read','billing'), ('billing.manage','billing'),
 ('team.manage','team'),
 ('integrations.manage','integrations'),
 ('ai.use','ai'),
 ('warroom.access','warroom');

INSERT INTO monitoring_sources (code,name,category,icon) VALUES
 ('google','Google Search','search','search'),
 ('bing','Bing','search','search'),
 ('instagram','Instagram','social','instagram'),
 ('facebook','Facebook','social','facebook'),
 ('tiktok','TikTok','social','tiktok'),
 ('youtube','YouTube','video','youtube'),
 ('linkedin','LinkedIn','social','linkedin'),
 ('twitter','Twitter/X','social','twitter'),
 ('reclame_aqui','Reclame Aqui','review','shield'),
 ('news','Notícias','news','newspaper'),
 ('blogs','Blogs','news','pen'),
 ('forums','Fóruns','forum','messages'),
 ('marketplaces','Marketplaces','marketplace','shopping-cart'),
 ('domains','Domínios','domain','globe'),
 ('google_ads','Google Ads','ads','megaphone'),
 ('meta_ads','Meta Ads','ads','megaphone'),
 ('darkweb','Dark Web','darkweb','skull'),
 ('appstore','App Store','app_store','smartphone'),
 ('playstore','Play Store','app_store','smartphone');

INSERT INTO plans (code,name,price_monthly_brl,price_yearly_brl,brand_limit,user_limit,monitor_limit,takedown_limit_monthly,features_json,is_public) VALUES
 ('free','Free',0,0,1,2,5,0,'["monitoring_basic"]',TRUE),
 ('starter','Starter',497,4970,3,5,25,5,'["monitoring","alerts","reports_basic"]',TRUE),
 ('pro','Pro',1997,19970,10,15,100,25,'["monitoring","alerts","reports","ai_chat","playbooks","legal_docs"]',TRUE),
 ('business','Business',4997,49970,25,50,500,100,'["all_pro","warroom","predict","deepfake","darkweb","autopilot"]',TRUE),
 ('enterprise','Enterprise',0,0,999,999,99999,9999,'["all","sso","sla_15min","dedicated_success"]',FALSE);

INSERT INTO status_components (code,name,description,ord,is_public) VALUES
 ('api','API','Endpoints principais',1,TRUE),
 ('dashboard','Dashboard Web','Interface web',2,TRUE),
 ('crawlers','Crawlers','Coleta de menções',3,TRUE),
 ('ai','Radar AI','Inteligência e chat',4,TRUE),
 ('takedown','Takedown Engine','Fluxo de remoções',5,TRUE),
 ('notifications','Notificações','Email/Slack/SMS',6,TRUE);

INSERT INTO feature_flags (code,description,is_enabled_default,rollout_pct) VALUES
 ('warroom_v2','Nova War Room',TRUE,100),
 ('autopilot','Autopilot de resposta',FALSE,25),
 ('deepfake_detector','Detector de deepfake',TRUE,100),
 ('tv_mode','Modo TV / apresentação',TRUE,100),
 ('wrapped','Radar Wrapped anual',TRUE,100);

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- 20. RECOMENDAÇÕES DE ESCALA (opcionais, aplicar quando volume exigir)
-- =====================================================================
-- a) Particionar tabelas de alto volume por RANGE(YEAR(created_at)):
--    ALTER TABLE mentions PARTITION BY RANGE (YEAR(detected_at)) (
--      PARTITION p2025 VALUES LESS THAN (2026),
--      PARTITION p2026 VALUES LESS THAN (2027),
--      PARTITION pmax  VALUES LESS THAN MAXVALUE);
--    Idem para: threats, alerts, notifications, audit_log, webhook_deliveries,
--    ai_messages, job_queue (concluídos), incident_timeline.
--
-- b) Usar tabelas de arquivamento (mentions_archive) via evento agendado
--    para mover linhas > 12 meses e manter as ativas leves.
--
-- c) Buscas textuais pesadas (mentions/blog_posts) — considerar OpenSearch
--    espelhado; MySQL FULLTEXT já cobre o MVP.
--
-- d) Cache read-heavy: v_brand_kpis / v_org_dashboard materializadas em
--    tabelas snapshot atualizadas a cada 30-60s (evita joins caros).
--
-- e) Multi-região: sharding por organization_id (Vitess/PlanetScale) —
--    todo modelo já usa organization_id como chave de tenant.
--
-- f) Segurança: rotate secrets em `integrations.credentials_enc` e
--    `webhook_endpoints.secret_enc` via KMS externo (envelope encryption).
--
-- g) Retenção LGPD: script mensal apagando marketing_leads > 24 meses sem
--    conversão e sessions/notifications > 6 meses.
-- =====================================================================
-- FIM
-- =====================================================================
