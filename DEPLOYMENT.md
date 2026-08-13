# Deployment Guide — GreatWorks Foundation

This app has three pieces:

1. **MongoDB** database → **MongoDB Atlas** (free tier works)
2. **FastAPI backend** → **Render** (Web Service)
3. **React frontend** → **Vercel**

Deploy in that order (database → backend → frontend) so each layer has the URL it depends on.

---

## 0. Prerequisites
- A GitHub account with this repository pushed to it (use the **"Save to GitHub"** button in the Emergent chat input).
- Accounts on [MongoDB Atlas](https://www.mongodb.com/atlas), [Render](https://render.com), and [Vercel](https://vercel.com).

---

## 1. MongoDB Atlas (database)

1. Create a free **M0 cluster**.
2. **Database Access** → Add a database user (username + password). Save these.
3. **Network Access** → Add IP `0.0.0.0/0` (allow from anywhere) so Render can connect.
4. **Connect → Drivers** → copy the connection string, e.g.
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Keep this string; it becomes `MONGO_URL` on the backend.

---

## 2. Backend on Render (FastAPI)

The repo already contains `backend/requirements.txt`.

1. Render Dashboard → **New → Web Service** → connect your GitHub repo.
2. Configure:
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:**
     ```
     pip install -r requirements.txt
     ```
   - **Start Command:**
     ```
     uvicorn server:app --host 0.0.0.0 --port $PORT
     ```
     (Render provides `$PORT`. Do **not** hardcode 8001 in production.)
   - **Instance Type:** Free (or Starter for always-on).
3. **Environment Variables** (Render → Environment):
   | Key | Value |
   |---|---|
   | `MONGO_URL` | your Atlas connection string |
   | `DB_NAME` | `greatworks` |
   | `CORS_ORIGINS` | leave blank for now; set to your Vercel URL after step 3 |
   | `JWT_SECRET` | run `openssl rand -hex 32` and paste the result |
   | `ADMIN_EMAIL` | `admin@greatworksf.org` |
   | `ADMIN_PASSWORD` | a strong password (avoid the `$` character) |
   | `ADMIN_NAME` | `GreatWorks Admin` |
4. **Create Web Service.** Wait for the deploy to finish.
5. Note your backend URL, e.g. `https://greatworks-api.onrender.com`.
6. Verify it works:
   ```
   curl https://greatworks-api.onrender.com/api/
   # → {"message":"GreatWorks Foundation API"}
   ```
7. The Admin account is auto-seeded on first startup from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

> **File uploads note:** Render's filesystem is ephemeral. Uploaded media/report files are stored under
> `backend/uploads/` and will be lost on redeploy/restart. For persistent uploads, add a Render **Disk**
> mounted at `backend/uploads`, or switch to external object storage.

---

## 3. Frontend on Vercel (React / CRA)

1. Vercel Dashboard → **Add New → Project** → import your GitHub repo.
2. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Create React App`
   - **Build Command:** `yarn build` (or `npm run build`)
   - **Output Directory:** `build`
3. **Environment Variables** (Vercel → Settings → Environment Variables):
   | Key | Value |
   |---|---|
   | `REACT_APP_BACKEND_URL` | your Render backend URL, e.g. `https://greatworks-api.onrender.com` (no trailing slash) |
4. **Deploy.** Note your frontend URL, e.g. `https://greatworks.vercel.app`.

### Client-side routing (important for CRA + React Router)
Add a `frontend/vercel.json` so deep links (e.g. `/projects`, `/publications`) don't 404 on refresh:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
*(This file is already included in the repo — see `frontend/vercel.json`.)*

---

## 4. Connect the two (CORS)

1. Go back to **Render → your backend → Environment**.
2. Set `CORS_ORIGINS` to your exact Vercel URL (no trailing slash), e.g.
   ```
   CORS_ORIGINS=https://greatworks.vercel.app
   ```
   For multiple origins, comma-separate them:
   ```
   CORS_ORIGINS=https://greatworks.vercel.app,https://www.greatworks.org
   ```
3. Save → Render redeploys automatically.

---

## 5. Post-deploy checklist
- [ ] `GET https://<backend>/api/` returns the API message.
- [ ] Frontend loads and pages navigate without 404 on refresh.
- [ ] Login at `/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD` works.
- [ ] Contact / Donate / Volunteer / Newsletter forms submit successfully (check browser Network tab → 200).
- [ ] No CORS errors in the browser console.

---

## 6. Custom domain (optional)
- **Vercel:** Project → Settings → Domains → add your domain, follow DNS instructions.
- After adding a custom domain, append it to the backend `CORS_ORIGINS`.

---

## Environment variables reference
See `frontend/ENVIRONMENT_VARIABLES.md` for the full list of variables used by both services.
