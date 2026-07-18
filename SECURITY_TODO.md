# 🔒 CBS Portal — Security TODO (Deferred Items)

Date: 2026-07-18

---

## 1. `.env` file with real credentials on development machine

**File:** `hubspot-cbs-deal-exporter/.env`
**Severity:** 🔴 Critical

Although `.env` is in `.gitignore`, the file exists on the filesystem with real production secrets:
- `HUBSPOT_ACCESS_TOKEN`
- `GOOGLE_MAPS_API_KEY`
- `MAPBOX_ACCESS_TOKEN`
- `STRAPI_API_TOKEN`

**Actions:**
- [ ] Delete `.env` with real values from the development machine
- [ ] Use `.env.example` as a template for new development machines
- [ ] Verify all tokens have been rotated (if the file was ever committed or backed up)
- [ ] Rotate HubSpot access token (HubSpot Settings → Private Apps)
- [ ] Rotate Strapi API token (Strapi Admin → Settings → API Tokens)
- [ ] Regenerate Google Maps API key with restrictions (GCP Console → APIs & Services → Credentials)

---

## 2. Plain-text `.env` on Hetzner server

**Severity:** 🟠 High

The CI/CD pipeline (`deploy.yml`) generates a `.env` file with all secrets on the server:
```yaml
cat > .env << EOF
HUBSPOT_ACCESS_TOKEN=${{ secrets.HUBSPOT_ACCESS_TOKEN }}
...
EOF
```

This file is readable by anyone with SSH access to the server.

**Actions:**
- [ ] Consider Docker secrets instead of `.env` file
- [x] Set `chmod 600` on `.env` file after creation ✅ (2026-07-18)
- [ ] Minimize number of users with SSH access
- [ ] Consider migrating from Hetzner to GCP Cloud Run (already done for `deploy-gcp.yml`)

---

## 3. wp-data legacy cPanel data

**Severity:** 🟡 Medium

The folder contains:
- `shadow` — Linux password hash (SHA-512 crypt)
- `proftpdpasswd` — FTP accounts with hashed passwords
- `cbs_v5_dump.sql` — complete MySQL database dump

**Actions:**
- [ ] Delete the entire `wp-data/` folder from the development machine
- [ ] If data is needed for archive, store it on an encrypted drive outside the development environment
- [ ] Change all passwords ever associated with these cPanel accounts
- [ ] Check if `cbs_v5_dump.sql` contains personal data subject to GDPR

---

## 4. Increase PITR backup retention to 14 days ✅ DONE (2026-07-18)

**File:** `terraform/cloudsql.tf`
**Severity:** 🟡 Low

Changed `transaction_log_retention_days` and `retained_backups` from 7 to 14.
Added `mapbox-access-token` data source to `secretmanager.tf`.

---

## 5. Add Cloud Monitoring alerts 🟡 TODO (GCP Console, not code)

**Severity:** 🟡 Medium

No monitoring alerts are configured for security events.

**Actions:**
- [ ] Create Cloud Monitoring alert for HTTP 401/403 spikes on integration service
  - GCP Console → Monitoring → Alerting → Create Policy
  - Metric: Cloud Run → Request Count → filter by response_code_class="4xx" on `cbs-hubspot-uat`
  - Condition: > 10 errors in 5 minutes → notify
- [ ] Create Cloud Audit Logs alert for Secret Manager access anomalies
- [ ] Add Cloud Run uptime check for `/health` endpoints on all services
- [ ] Consider using GCP Security Command Center (free tier available)

---

## Resolved (2026-07-18)

| # | Item | Fix |
|---|------|-----|
| 4 | PITR 7→14 days | ✅ `cloudsql.tf` updated |
| — | `mapbox-access-token` missing | ✅ Added to `secretmanager.tf` |
| — | `chmod 600 .env` on Hetzner | ✅ Added to `deploy.yml` |
| — | GitHub token in git clone URL | ✅ Changed to `http.extraheader` approach |

---

## Note

All other items from the security report have been either resolved or are being addressed in the current cycle. See the main security report for details on completed fixes.
