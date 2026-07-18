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

## Note

All other items from the security report have been either resolved or are being addressed in the current cycle. See the main security report for details on completed fixes.
