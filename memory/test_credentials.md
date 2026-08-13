# Test Credentials — GreatWorks Foundation

## Admin / Staff login (JWT email + password)
- **URL:** `/login`
- **Email:** `admin@greatworksf.org`
- **Password:** `GreatWorks@2026`
- **Role:** `Admin`

The admin account is seeded/reset automatically on backend startup from the
`ADMIN_EMAIL` / `ADMIN_PASSWORD` environment variables (see `backend/.env`).
The reset is idempotent: it only updates the password hash if the configured
password no longer matches, so changing `ADMIN_PASSWORD` and restarting the
backend will rotate the credential.

## Auth endpoints
- `POST /api/auth/login`  → `{ token, user }`
- `POST /api/auth/register`
- `GET  /api/auth/me`
- `POST /api/auth/logout`

## Notes
- Hashing: passlib `bcrypt` (`$2b$` hashes).
- JWT signed with `JWT_SECRET` (env). Change it for production.
- To create additional Editor/Volunteer staff, register via `/api/auth/register`
  then promote with `PUT /api/auth/users/{user_id}/role` (Admin only).
