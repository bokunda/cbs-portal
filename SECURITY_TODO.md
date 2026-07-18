# 🔒 CBS Portal — Security TODO (Deferred Items)

Date: 2026-07-18

---

## 1. `.env` file with real credentials ✅ DONE (2026-07-18)

File deleted. All tokens rotated:
- HubSpot Private App token regenerated
- Strapi API token regenerated (separate tokens: full-CRUD for Cloud Run, read-only for local dev)
- Google Maps API key regenerated with HTTP referrer restrictions
- Mapbox token regenerated

For local development: copy `.env.example` → `.env` and fill with dev-only tokens.

---

## 2. Plain-text `.env` on Hetzner server ✅ PARTIALLY DONE

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

## 3. wp-data legacy cPanel data ✅ DONE (2026-07-18)

Folder deleted from development machine.

---

## 4. Increase PITR backup retention to 14 days ✅ DONE (2026-07-18)

**File:** `terraform/cloudsql.tf`
**Severity:** 🟡 Low

Changed `transaction_log_retention_days` and `retained_backups` from 7 to 14.
Added `mapbox-access-token` data source to `secretmanager.tf`.

---

## 5. Add Cloud Monitoring alerts ✅ DONE (2026-07-18)

Deployed as Terraform IaC (`monitoring.tf`):
- Uptime checks every 5 min for all 3 Cloud Run services
- Alert on >10 4xx errors in 5 min on integration service
- Alert on 0 running Cloud Run instances for 5 min
- Email notifications to bpiskulic1996@gmail.com

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
