# AstroHub Backend

Production-ready REST API for the AstroHub educational platform.

**Tech Stack:** Node.js · TypeScript · Fastify · PostgreSQL · Prisma · Firebase Admin SDK

---

## 📦 Features

| Module | Endpoints | Auth |
|--------|-----------|------|
| Users | Profile management | Firebase token |
| Forum | Posts + comments (CRUD) | Owner/Admin |
| Clubs | Create, join/leave, club posts | Members |
| Blog | Admin-managed posts | Admin write, Public read |
| Roadmaps | CRUD + progress tracking | Admin write, User progress |
| Labs | CRUD + submissions | Admin write, User submit |

> ⚠️ **Courses are NOT implemented** in this backend.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **Docker** (for PostgreSQL) or a PostgreSQL instance
- **Firebase service account key** ([how to get one](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments))

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Start PostgreSQL

```bash
docker-compose up -d
```

This starts a PostgreSQL 16 instance on port 5432.

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:
- `DATABASE_URL` — already set for Docker: `postgresql://astrohub:astrohub_dev@localhost:5432/astrohub?schema=public`
- `FIREBASE_SERVICE_ACCOUNT_KEY` — paste the full JSON from your Firebase service account key file (as one line)
- `ADMIN_EMAILS` — comma-separated list of emails that should be admins

### 4. Run database migrations

```bash
npx prisma migrate dev --name init
```

### 5. Start the server

```bash
npm run dev
```

The API will be running at `http://localhost:4000`. Test it:

```bash
curl http://localhost:4000/health
```

---

## 📡 API Reference

All API endpoints are under `/api/`.

### Health Check
```
GET /health
→ { status: "ok", timestamp, uptime, environment }
```

### Authentication

All protected endpoints require a Firebase ID token in the header:
```
Authorization: Bearer <firebase-id-token>
```

### Users
```
GET    /api/users/me          # Get profile (auth)
PATCH  /api/users/me          # Update profile (auth)
```

### Forum
```
GET    /api/forum/posts            # List posts (public, paginated)
GET    /api/forum/posts/:id        # Get post + comments (public)
POST   /api/forum/posts            # Create post (auth)
PATCH  /api/forum/posts/:id        # Edit post (owner/admin)
DELETE /api/forum/posts/:id        # Delete post (owner/admin)
POST   /api/forum/posts/:id/comments  # Add comment (auth)
DELETE /api/forum/comments/:id        # Delete comment (owner/admin)
```

### Clubs
```
GET    /api/clubs              # List clubs (public, paginated)
GET    /api/clubs/:id          # Get club (public)
POST   /api/clubs              # Create club (auth)
POST   /api/clubs/:id/join     # Join club (auth)
POST   /api/clubs/:id/leave    # Leave club (auth)
GET    /api/clubs/:id/posts    # List club posts (public)
POST   /api/clubs/:id/posts    # Create club post (member)
```

### Blog
```
GET    /api/blog               # List published posts (public)
GET    /api/blog/:slug         # Get post by slug (public)
POST   /api/blog               # Create post (admin)
PATCH  /api/blog/:id           # Update post (admin)
DELETE /api/blog/:id           # Delete post (admin)
```

### Roadmaps
```
GET    /api/roadmaps               # List roadmaps (public)
GET    /api/roadmaps/:id           # Get roadmap (public)
POST   /api/roadmaps               # Create (admin)
PATCH  /api/roadmaps/:id           # Update (admin)
DELETE /api/roadmaps/:id           # Delete (admin)
GET    /api/roadmaps/:id/progress  # Get my progress (auth)
PATCH  /api/roadmaps/:id/progress  # Update my progress (auth)
```

### Labs
```
GET    /api/labs                    # List labs (public)
GET    /api/labs/:id                # Get lab (public)
POST   /api/labs                    # Create (admin)
PATCH  /api/labs/:id                # Update (admin)
DELETE /api/labs/:id                # Delete (admin)
POST   /api/labs/:id/submissions    # Submit work (auth)
GET    /api/labs/:id/submissions    # My submissions (auth)
```

### Pagination

All list endpoints accept query params:
```
?page=1&limit=20
```

Response format:
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3,
    "hasMore": true
  }
}
```

---

## 🚢 Deployment

### Railway

1. Create a new project on [Railway](https://railway.app)
2. Add a **PostgreSQL** database
3. Connect your GitHub repo
4. Set the **Root Directory** to `backend`
5. Add environment variables (from `.env.example`)
6. Railway will auto-detect the Dockerfile

### Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. **Build Command:** `npm ci && npx prisma generate && npm run build`
5. **Start Command:** `npx prisma migrate deploy && node dist/server.js`
6. Add a **PostgreSQL** database and set `DATABASE_URL`
7. Add remaining env vars

---

## 🌐 Connecting a Custom Domain (Future)

When you're ready to connect `api.astro-hub.org` to your backend:

### Step 1: Add your domain to your host

**On Railway:** Settings → Domains → Add Custom Domain → `api.astro-hub.org`

**On Render:** Settings → Custom Domains → Add → `api.astro-hub.org`

### Step 2: Update DNS

Go to your domain registrar (e.g., Namecheap, Cloudflare) and add a **CNAME** record:

| Type | Name | Value |
|------|------|-------|
| CNAME | `api` | `your-app.railway.app` (or `your-app.onrender.com`) |

**What this does:** When someone visits `api.astro-hub.org`, the DNS tells their browser to go to your Railway/Render server.

### Step 3: Update environment variables

```env
API_URL=https://api.astro-hub.org
CORS_ORIGIN=https://astro-hub.org,https://www.astro-hub.org
```

### Step 4: Wait for SSL

Both Railway and Render auto-provision free SSL certificates. It may take a few minutes.

That's it! Your API is now live at `https://api.astro-hub.org` 🎉

---

## 💾 Database Backup

### Manual backup (pg_dump)

```bash
# Export
pg_dump -U astrohub -h localhost -d astrohub > backup_$(date +%Y%m%d).sql

# Import
psql -U astrohub -h localhost -d astrohub < backup_20260419.sql
```

### On Railway/Render

Both platforms offer built-in database backups:
- **Railway:** Automatic daily backups (Pro plan)
- **Render:** Manual snapshots from the dashboard

For automated backups, set up a cron job that runs `pg_dump` and uploads to cloud storage (S3, GCS).

---

## 🛠️ Development Commands

```bash
npm run dev        # Start dev server with hot reload
npm run build      # Compile TypeScript
npm run start      # Run production build
npm run lint       # TypeScript type check
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations (dev)
npm run db:studio    # Open Prisma Studio (DB GUI)
npm run docker:up    # Start PostgreSQL
npm run docker:down  # Stop PostgreSQL
```

---

## 🔒 Security

- **Firebase Auth** — token verification on every protected request
- **Zod validation** — input validation on all endpoints
- **Helmet** — security headers
- **CORS** — env-based allowed origins
- **Rate limiting** — 100 req/min default (configurable)
- **Role-based access** — admin/user roles enforced at route level
