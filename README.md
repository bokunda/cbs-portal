# CBS Portal — Cushman & Wakefield Serbia

**Headless CMS real estate website** built with Next.js 16 + Strapi 5.48.  
Dual-locale (EN/SR) with 65+ legacy WP redirects, 451 migrated publications, 6 content types.

## Structure

```
portal/
├── cbs-portal-ui/          # Next.js 16 frontend (App Router, TypeScript, ISR)
│   └── docs/confluence_*.md  # Architecture, SEO, migrations, fixes
├── cbs-portal-strapi-be/   # Strapi 5.48 CMS backend (PostgreSQL prod, SQLite dev)
│   ├── migration-tool/      # WordPress → Strapi migration scripts (451+ items)
│   └── docs/               # Schema reference & admin usage guide
├── wp-data/                # Legacy WordPress MySQL dump + uploads (read-only)
└── CW knjiga standarda/    # Design standard book (PDF references)
```

## 🌐 UAT Environment

| Service | URL | CI/CD |
|---------|-----|:-----:|
| **Frontend** | [cbs-ui-uat-147527109622.europe-west1.run.app](https://cbs-ui-uat-147527109622.europe-west1.run.app) | ✅ |
| **Strapi CMS** | [cbs-strapi-uat-147527109622.europe-west1.run.app](https://cbs-strapi-uat-147527109622.europe-west1.run.app) | ✅ |
| **Strapi Admin** | [cbs-strapi-uat-147527109622.europe-west1.run.app/admin](https://cbs-strapi-uat-147527109622.europe-west1.run.app/admin) | — |
| **HubSpot Export** | [cbs-hubspot-uat-147527109622.europe-west1.run.app](https://cbs-hubspot-uat-147527109622.europe-west1.run.app) | ✅ |

## Quick Start

### Prerequisites
- Node.js 20+
- npm 10+

### Backend (Strapi)
```bash
cd cbs-portal-strapi-be
cp .env.example .env        # configure secrets
npm install
npm run develop             # http://localhost:1337/admin
```

### Frontend (Next.js)
```bash
cd cbs-portal-ui
cp .env.example .env.local  # configure Strapi URL
npm install
npm run dev                 # http://localhost:3000
```

### Run Migrations (populate from WordPress)
```bash
cd cbs-portal-strapi-be/migration-tool
cp .env.example .env        # configure WP DB connection
npm install
node index.js all-pubs      # runs full migration pipeline
```

> **🔒 UAT Gate Protection**: The UAT site is password-protected by default (`GATE_ENABLED=true`). Login at `/gate`.

## Documentation Index

### 🏗️ Infrastructure & DevOps
| Topic | File |
|-------|------|
| **Infrastructure Overview** | [`terraform/docs/INFRASTRUCTURE.md`](terraform/docs/INFRASTRUCTURE.md) |
| **CI/CD Guide** | [`terraform/docs/CI-CD.md`](terraform/docs/CI-CD.md) |
| **Deployment Guide** | [`terraform/docs/DEPLOYMENT.md`](terraform/docs/DEPLOYMENT.md) |
| **Terraform IaC** | [`terraform/README.md`](terraform/README.md) |

### �️ Security & Access
| Topic | File |
|-------|------|
| **Gate Protection (Password Gate)** | [`cbs-portal-ui/docs/confluence_04_deployment_and_operations.md`](cbs-portal-ui/docs/confluence_04_deployment_and_operations.md) §4 |
| GCP Security Strategy | [`cbs-portal-ui/docs/confluence_07_gcp_deployment_and_security.md`](cbs-portal-ui/docs/confluence_07_gcp_deployment_and_security.md) |

### �📦 Application
| Topic | File |
|-------|------|
| Architecture Overview | `cbs-portal-ui/docs/confluence_01_architecture_overview.md` |
| Frontend (Next.js) | `cbs-portal-ui/docs/confluence_02_frontend_nextjs.md` |
| Backend (Strapi) | `cbs-portal-ui/docs/confluence_03_backend_strapi.md` |
| Strapi Admin Usage | `cbs-portal-strapi-be/docs/backend-strapi-usage.md` |
| Strapi Schema | `cbs-portal-strapi-be/docs/backend-schema.md` |
| Component Catalog | `cbs-portal-ui/docs/frontend-components.md` |
| HubSpot Service | `cbs-integration-service/docs/confluence/` |

### 🔄 Data & Migrations
| Topic | File |
|-------|------|
| **Migration Status** | [`cbs-portal-strapi-be/docs/MIGRATION_STATUS.md`](cbs-portal-strapi-be/docs/MIGRATION_STATUS.md) |
| Data Migrations | `cbs-portal-ui/docs/confluence_05_data_migrations.md` |
| Migration Tool | `cbs-portal-strapi-be/migration-tool/README.md` |

### 🐛 Troubleshooting & History
| Topic | File |
|-------|------|
| **Regex Corruption Bug** | [`cbs-portal-ui/docs/BUGFIX-REGEX-CORRUPTION.md`](cbs-portal-ui/docs/BUGFIX-REGEX-CORRUPTION.md) |
| Post-Migration Fixes | `cbs-portal-ui/docs/confluence_06_post_migration_fixes.md` |
| Architecture Review | `ARCHITECTURE_REVIEW.md` |

## Tech Stack

- **Frontend**: Next.js 16 (Turbopack), React 19, TypeScript, Bootstrap 5 (grid only)
- **Backend**: Strapi 5.48, PostgreSQL 16 (Cloud SQL), GCS (media uploads)
- **Infrastructure**: GCP Cloud Run + Cloud SQL + Cloud Storage + Secret Manager
- **IaC**: Terraform 1.15+
