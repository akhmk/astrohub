# AstroHub Backend

Production-ready REST API for the AstroHub educational platform.

**Tech Stack:** Node.js · TypeScript · Fastify · PostgreSQL · Prisma · Firebase Auth (JWT)

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
- A **PostgreSQL** database (we use [Neon](https://neon.tech) — free forever)

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:
- `DATABASE_URL` — your PostgreSQL connection string
- `FIREBASE_PROJECT_ID` — your Firebase project ID (found in `firebase-applet-config.json`)
- `ADMIN_EMAILS` — comma-separated list of admin emails

> **No Firebase service account key needed!** We verify tokens using Google's public JWKs.

### 3. Run database migrations

```bash
npx prisma migrate dev --name init
```

### 4. Start the server

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
GET /health → { status: "ok", timestamp, uptime, environment }
```

### Authentication

All protected endpoints require a Firebase ID token:
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

All list endpoints accept: `?page=1&limit=20`

Response:
```json
{
  "data": [...],
  "meta": { "page": 1, "limit": 20, "total": 42, "totalPages": 3, "hasMore": true }
}
```

---

## 🚢 Deployment

### Railway

1. Create a new project on [Railway](https://railway.app)
2. Add a **PostgreSQL** database
3. Connect your GitHub repo, set **Root Directory** to `backend`
4. Add env vars from `.env.example`

### Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Set **Root Directory** to `backend`
3. **Build:** `npm ci && npx prisma generate && npm run build`
4. **Start:** `npx prisma migrate deploy && node dist/server.js`

---

## 🌐 Custom Domain (Future)

When ready to connect `api.astro-hub.org`:

1. Add domain in Railway/Render settings
2. Add DNS CNAME record: `api` → `your-app.railway.app`
3. Update env vars:
   ```
   API_URL=https://api.astro-hub.org
   CORS_ORIGIN=https://astro-hub.org
   ```
4. SSL is auto-provisioned. Done! 🎉

---

## 💾 Database Backup

```bash
# Export
pg_dump $DATABASE_URL > backup.sql

# Import
psql $DATABASE_URL < backup.sql
```

---

## 🛠️ Commands

```bash
npm run dev          # Dev server with hot reload
npm run build        # Compile TypeScript
npm run start        # Production server
npm run lint         # Type check
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:studio    # Database GUI
```

---

## 🔒 Security

- **Firebase JWT verification** via Google's public keys
- **Zod validation** on all inputs
- **Helmet** security headers
- **CORS** env-based origins
- **Rate limiting** 100 req/min (configurable)
- **Role-based access** admin/user
