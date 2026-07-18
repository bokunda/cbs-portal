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
- [ ] Set `chmod 600` on `.env` file after creation
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

## 4. Increase PITR backup retention to 14 days

**File:** `terraform/cloudsql.tf`
**Severity:** 🟡 Low

Current: `transaction_log_retention_days = 7`

For production readiness, point-in-time recovery should be extended to 14 days. The cost increase is minimal (~$0.10/month for a 10 GB instance).

**Actions:**
- [ ] Change `transaction_log_retention_days` from 7 to 14 in `cloudsql.tf`
- [ ] Change `backup_retention_settings.retained_backups` from 7 to 14

---

## 5. Add Cloud Monitoring alerts

**Severity:** 🟡 Medium

No monitoring alerts are configured for security events.

**Actions:**
- [ ] Create Cloud Monitoring alert for HTTP 401/403 spikes on integration service
- [ ] Create Cloud Audit Logs alert for Secret Manager access anomalies
- [ ] Add Cloud Run uptime check for `/health` endpoints on all services
- [ ] Consider using GCP Security Command Center (free tier available)

---

## Note

All other items from the security report have been either resolved or are being addressed in the current cycle. See the main security report for details on completed fixes.
