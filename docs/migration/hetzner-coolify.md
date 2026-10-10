# Moving AskBiz off Vercel → Hetzner + Coolify

Goal: cut ~$35/mo to ~$10–15/mo. Run both side by side for a week before DNS cutover.

## What we found in the repo
- 3 apps, all Next.js 14.2.3: root (`/`), `pos-askbiz`, `developer-askbiz`.
- **21 Vercel crons**: 19 in root (incl. `webhook-delivery` every 5 min, `source-sync` hourly), 2 in pos-askbiz.
  Vercel Cron doesn't exist elsewhere → `scripts/gen-crontab.mjs` makes a server crontab from `vercel.json`.
- **Root build needs a 6 GB Node heap** (`--max-old-space-size=6144`). Use a server with **≥ 8 GB RAM** (Hetzner CX32/CPX31) or build in CI.
- Only pos-askbiz has `output: 'standalone'`; root and developer-askbiz need it added for small Docker images (or use Coolify's Nixpacks).
- 5 / 2 / 2 routes use `runtime = 'edge'` — fine on Node, just remove or ignore the export.
- ~114 / 98 / 9 distinct env vars. Vercel "sensitive" vars can't be pulled — copy them from your own records / provider dashboards.

## Steps you must do (account, payment, DNS)
1. Create a Hetzner Cloud account, add a server: Ubuntu 24.04, **CX32 (4 vCPU / 8 GB)**, enable backups, add your SSH key.
2. Point a temporary hostname (e.g. `coolify.askbiz.co`) at the server IP.
3. On the server: `curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash`, open `http://<ip>:8000`, create the admin.
4. In Coolify: connect GitHub (SignalX repo) → create 3 applications:
   | App | Base directory | Build | Port |
   |---|---|---|---|
   | askbiz (root) | `/` | Nixpacks, `npm run build` | 3000 |
   | pos-askbiz | `/pos-askbiz` | Nixpacks | 3000 |
   | developer-askbiz | `/developer-askbiz` | Nixpacks | 3000 |
   Paste each app's env vars. Add `NODE_OPTIONS=--max-old-space-size=6144` as a build variable on root.
5. Give each a **test domain** first (`new.askbiz.co`, `pos-new.askbiz.co`, …). Smoke-test login, POS, factory approvals, WhatsApp send.
6. Crons: `node scripts/gen-crontab.mjs vercel.json https://askbiz.co > cron-root.txt` (and for `pos-askbiz/vercel.json` with `https://pos.askbiz.co`), set the real `CRON_SECRET`, `crontab` it. **Disable the Vercel crons at the same moment** or every job runs twice.
7. Cutover: lower DNS TTL to 60s a day before, switch A records to the Hetzner IP, watch Coolify logs. Keep Vercel deployed (but with crons removed) for a week as rollback.
8. Check afterwards: Supabase auth redirect URLs, OAuth callbacks (Meta, Google, Amazon, Jumia), Stripe/WaafiPay webhook URLs, Meta WhatsApp webhook — all allow-list the old URLs.

## Costs / trade-offs
- Hetzner CX32 ≈ €7–9/mo + backups ≈ €1.5. No per-seat or bandwidth charges worth worrying about.
- You now own uptime, OS updates and backups. No automatic preview deploys. One server = one point of failure (Coolify can add a second later).
