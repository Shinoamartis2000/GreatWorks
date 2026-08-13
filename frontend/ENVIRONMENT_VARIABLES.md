# Environment Variables — GreatWorks Foundation

This project has two services: a **React (CRA) frontend** and a **FastAPI + MongoDB backend**.
Below are all environment variables used across both. Do **not** commit real secret values to git.

> This is a reference document only. Actual values live in `frontend/.env` and `backend/.env`
> (and in your hosting provider's dashboard for production).

---

## Frontend (`frontend/.env`)

| Variable | Required | Example (local) | Example (production) | Description |
|---|---|---|---|---|
| `REACT_APP_BACKEND_URL` | ✅ | `http://localhost:8001` | `https://greatworks-api.onrender.com` | Base URL of the backend. The app appends `/api` to every request. Must NOT end with a trailing slash. |
| `WDS_SOCKET_PORT` | optional | `443` | `443` | Webpack dev-server socket port (used by the preview/dev tooling). Not needed in a production build. |
| `ENABLE_HEALTH_CHECK` | optional | `false` | `false` | Internal preview flag. Leave as-is. |

**Notes**
- All frontend env vars **must** be prefixed with `REACT_APP_` to be exposed to the browser (Create React App rule).
- Env vars are read at **build time**. If you change `REACT_APP_BACKEND_URL` you must rebuild/redeploy the frontend.

---

## Backend (`backend/.env`)

| Variable | Required | Example (local) | Example (production) | Description |
|---|---|---|---|---|
| `MONGO_URL` | ✅ | `mongodb://localhost:27017` | `mongodb+srv://user:pass@cluster.mongodb.net` | MongoDB connection string. Use MongoDB Atlas for production. |
| `DB_NAME` | ✅ | `test_database` | `greatworks` | Database name. Do not rename after data exists. |
| `CORS_ORIGINS` | ✅ (prod) | `*` | `https://greatworks.vercel.app` | Comma-separated list of allowed frontend origins. Set to your exact deployed frontend URL in production (no trailing slash). |
| `JWT_SECRET` | ✅ | `change-me` | `<random 64-char hex>` | Secret used to sign JWT auth tokens. Generate with `openssl rand -hex 32`. |
| `ADMIN_EMAIL` | ✅ | `admin@greatworksf.org` | `admin@greatworksf.org` | Email of the auto-seeded staff Admin account. |
| `ADMIN_PASSWORD` | ✅ | `GreatWorks@2026` | `<strong password>` | Password for the seeded Admin. Changing this + restarting rotates the credential. Avoid the `$` character in `.env`. |
| `ADMIN_NAME` | optional | `GreatWorks Admin` | `GreatWorks Admin` | Display name for the seeded Admin. |

**Notes**
- The backend serves all routes under the `/api` prefix.
- Uploaded files (media, reports, documents) are written to `backend/uploads/` and served from `/uploads`.
  On ephemeral hosts (e.g. Render free tier) this storage is **not persistent** — attach a persistent disk or use
  external object storage for uploads that must survive restarts/redeploys.

---

## Quick reference — `.env.example` snippets

**`frontend/.env`**
```
REACT_APP_BACKEND_URL=https://your-backend-domain.com
```

**`backend/.env`**
```
MONGO_URL="mongodb+srv://user:pass@cluster.mongodb.net"
DB_NAME="greatworks"
CORS_ORIGINS="https://your-frontend-domain.com"
JWT_SECRET="replace-with-openssl-rand-hex-32"
ADMIN_EMAIL="admin@greatworksf.org"
ADMIN_PASSWORD="ChangeThisStrongPassword"
ADMIN_NAME="GreatWorks Admin"
```
