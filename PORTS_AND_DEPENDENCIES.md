# Elaman Group - Port & Dependency Tracker

**Last Updated:** 5 April 2026

## Active Projects & Port Assignments

| Project | Port | Status | Dependencies | Notes |
|---------|------|--------|--------------|-------|
| **Elaman Executive Dashboard** | 5174 | ✅ Running | React + Vite + Tailwind | Main command center |
| **DVSA DriveTime Saver** | 5173 | ✅ Running | React + Express + PostgreSQL | Backend: 4001 |
| **AI Tools Blog** | 3000 (Vercel) | 🔄 Ready for deploy | Next.js + Contentlayer | Static export, no dev port |
| **Ghana Reconcile Pro** | 8080 (dev) / 5001 (prod) | ⏸️ Paused | React + Express + PostgreSQL | Database: 5433 |

## Port Ranges by Project Type

| Range | Use Case |
|-------|----------|
| 5170-5179 | Vite React projects (frontend) |
| 4000-4009 | Express API servers (backend) |
| 3000 | Next.js default |
| 8080-8089 | Production preview servers |
| 5432-5435 | PostgreSQL databases |

## Dependency Conflicts to Avoid

| Package | Version | Projects Using | Conflict Risk |
|---------|---------|----------------|---------------|
| React | 18.x/19.x | All | None, isolated per project |
| Vite | 5.x+ | Dashboard, DVSA | None |
| Tailwind CSS | 3.x+ | All | PostCSS config per project |
| PostgreSQL | 16 | DVSA, Ghana Reconcile | Port 5432 vs 5433 (separate) |
| Express | 4.x | DVSA, Ghana Reconcile | Separate ports, no conflict |

## Quick Commands

### Check what's running
```bash
lsof -i :5173   # DVSA
lsof -i :5174   # Dashboard
lsof -i :4001   # DVSA API
lsof -i :8080   # Ghana Reconcile (if running)
```

### Kill a process on port
```bash
kill $(lsof -t -i:5174)
```

### Start projects in order
```bash
# 1. Dashboard (5174)
cd /Users/kofi/.openclaw/workspace/elaman-dashboard && npm run dev

# 2. DVSA (5173 + 4001)
cd /Users/kofi/.openclaw/workspace/dvsa-drivetime-saver && npm run dev

# 3. Ghana Reconcile (8080 + 5001)
cd /Users/kofi/.openclaw/workspace/ghana-reconcile-pro && npm run dev
```

## Future Projects - Reserved Ports

| Project | Reserved Port | Status |
|---------|---------------|--------|
| Career Pilot Pro | 5175 | TBD |
| Job Matcher Pro | 5176 | TBD |
| Atlas Business Hub | 5177 | TBD |

## Deployment URLs

| Project | Dev | Production |
|---------|-----|------------|
| Dashboard | http://localhost:5174 | N/A (local only) |
| DVSA | http://localhost:5173 | Render TBD |
| AI Blog | http://localhost:3000 | Vercel TBD |
| Ghana Reconcile | http://localhost:8080 | Render TBD |
