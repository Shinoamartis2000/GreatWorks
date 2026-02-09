
# GreatWorks Foundation NGO Platform PRD

## Original Problem Statement
Create a professional NGO website for "GreatWorks Foundation" that communicates humanitarian work, drives donations, includes multi-page public site, gallery, blog/CMS, event management, volunteer/donor systems, analytics, integrations, and admin dashboard. Requirements include GoFundMe CTA, social proof @greatworksf, newsletter signup, annual report download, event countdown, volunteer application with file upload, and responsive design.

## Architecture Decisions
- Frontend: React (CRA) + Tailwind + shadcn UI components + Framer Motion animations.
- Backend: FastAPI with MongoDB (MONGO_URL). All APIs served under /api.
- Files: Local uploads served from /uploads (media, documents, reports).
- MySQL: Separate schema file provided for external MySQL/XAMPP usage.

## Implemented Features
- Multi-page NGO site (Home, About, Stories, Gallery, Donate, Get Involved, Contact, Admin Dashboard).
- CMS: WYSIWYG blog + pages, media library with upload/optimization, scheduling fields, revisions, tags.
- Event management: create events, registrations, waitlist handling, feedback, ICS downloads.
- Volunteer management: application portal with file upload, skills, availability, status, hours tracking.
- Donor/DRM: donor profiles, donations, goals, receipts (PDF), impact updates.
- Analytics dashboard with summary metrics and report export endpoints.
- Newsletter signup + contact inquiries stored in DB.
- Annual report upload + download.
- Integrations storage (Mailchimp/Stripe/PayPal/SMS/GA) and webhooks.
- Auth: JWT email/password plus Emergent Google OAuth with role-based access (Admin/Editor/Volunteer).
- Media gallery with 87+ assets, partner carousel, success counters, event countdown, social sharing.

## Prioritized Backlog
### P0
- Add authentication/role-based access for Admin, Editor, Volunteer.
- Implement real email/SMS sending integrations with credentials.

### P1
- Add richer WYSIWYG editor with image embeds for CMS.
- Add advanced analytics charts and scheduled report email delivery.

### P2
- Add PWA offline caching and push notification subscription storage.
- Add advanced duplicate detection + AI tagging via LLM/Vision API.

## Next Tasks
- Connect GoFundMe link when available.
- Provide real integration keys (email/SMS/payment) to activate automations.
- Import legacy content and media into the CMS.
