
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

---

## Institutional Redesign (June 2026)
Redesigned the entire PUBLIC site into an official, government/public-sector institutional style (per user brief). Backend unchanged; existing admin CMS at /admin untouched and still functional.

### What changed
- Design system: navy/institutional-blue/charcoal/grey with subtle green accent; Merriweather (headings) + IBM Plex Sans (body) via Google Fonts; flat surfaces, 1px borders, minimal radius, restrained motion. Tokens in `tailwind.config.js` (colors.gov.*) and base classes in `index.css` (.gov-*).
- Government header (`components/Navbar.jsx`): top utility bar (helpline, email, text-resize A-/A+, high-contrast toggle, EN/FR, socials), main header (logo + full name + Donate), primary nav (Home | About | Programs | Projects | Impact | Publications | Partnerships | Get Involved | Contact) with active states, site search, mobile sheet. Skip-to-content link.
- Institutional footer (`components/Footer.jsx`) with 4 columns + newsletter + legal bar.
- New shared components: `Breadcrumbs`, `PageHeader`, `StatCounter` (in-view number counter), `ProjectCard`, `DocumentRow`, `ScrollToTop`. Helper `lib/projects.js` derives project directory from CMS events.
- Home rebuilt: institutional hero ("Working Together for Sustainable Community Development") + verified-facts panel, latest-updates strip, key indicators, about summary, programmes, featured projects, CTA band.
- New pages: `Programs`, `Projects` (filters by programme/location/year/status + detail dialog), `Impact` (indicators + results table + case studies), `Publications` (document library from /annual-reports, category tabs), `Partnerships` (segmented, honest empty states), `Search`.
- Redesigned: `About` (who we are / mission / vision / values / leadership empty state), `Contact` (segmented enquiries + Enugu map), `Donate` (professional, preset amounts), `GetInvolved`, `Stories` (News & Notices), `Gallery` (media library).
- Accessibility: visible focus rings, text-resize + high-contrast controls (classes on <html>), reduced-motion support, semantic headings, aria labels, breadcrumbs.

### Accuracy discipline (per user brief)
- No fabricated registration numbers, government affiliations, financials, awards, or partners. Leadership, partners, and most documents use clearly-marked empty/"to be published" states. Content is factual to existing site (Enugu programmes, contact info, socials). User said "skip [real facts], we can always add later".

### Verification
- Frontend testing agent iteration_3.json: 15/15 public flows pass (nav, search, a11y controls, filters, project dialog, forms POST 200 for contact/donations/volunteers/newsletter). Fixed: removed admin-only /reports call from public Publications page (was causing 401 console noise).

### Redesign backlog (add later when user provides data)
- Real leadership profiles (photos/names/titles/bios).
- Real registration/establishment/tax-exemption identity strip.
- Real government/institutional/CSR partner listings + logos (with permission).
- Real annual reports / audited financials / policy PDFs in the document library.
- Optional: replace admin password + save to /app/memory/test_credentials.md; MySQL export for the user.
