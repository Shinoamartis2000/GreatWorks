from fastapi import FastAPI, APIRouter, UploadFile, File, Form, BackgroundTasks, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from pathlib import Path
from PIL import Image
from fpdf import FPDF
import pandas as pd
import hashlib
import uuid
import io
import os
import logging
import requests


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "media").mkdir(exist_ok=True)
(UPLOAD_DIR / "documents").mkdir(exist_ok=True)
(UPLOAD_DIR / "reports").mkdir(exist_ok=True)

app = FastAPI()
api_router = APIRouter(prefix="/api")

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def slugify(text: str) -> str:
    safe = "".join([ch if ch.isalnum() else "-" for ch in text.lower()])
    safe = "-".join([part for part in safe.split("-") if part])
    return safe or str(uuid.uuid4())


def auto_tags(filename: str) -> List[str]:
    base = Path(filename).stem.replace("_", " ").replace("-", " ")
    parts = [p.strip().lower() for p in base.split() if len(p.strip()) > 2]
    return list(dict.fromkeys(parts))[:8]


async def get_settings_doc() -> Dict[str, Any]:
    doc = await db.settings.find_one({"key": "site"}, {"_id": 0})
    if not doc:
        doc = {
            "key": "site",
            "gofundme_url": "",
            "social_handle": "@greatworksf",
            "tagline": "Rebuilding Lives for the Future",
            "language": "EN",
            "cdn_base_url": "",
            "updated_at": now_iso(),
        }
        await db.settings.insert_one(doc)
    return doc


async def ensure_seed_data() -> None:
    if await db.posts.count_documents({}) == 0:
        sample_posts = [
            {
                "id": str(uuid.uuid4()),
                "title": "A village rebuilt after the floods",
                "slug": "a-village-rebuilt-after-the-floods",
                "content": "Our teams partnered with local leaders to rebuild homes, restore water lines, and reopen a school. The community is thriving again.",
                "excerpt": "Homes rebuilt, schools reopened, and families back together.",
                "tags": ["rebuild", "community"],
                "category": "Recovery",
                "author": "GreatWorks Team",
                "status": "published",
                "published_at": now_iso(),
                "cover_image": "/assets/Great works/WhatsApp Image 23.jpeg",
                "program_type": "Shelter",
                "views": 0,
                "version": 1,
                "revisions": [],
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Clean water brings new beginnings",
                "slug": "clean-water-brings-new-beginnings",
                "content": "With a new water pump, children can attend school and families no longer travel hours each day for clean water.",
                "excerpt": "Water access unlocks education, health, and time.",
                "tags": ["water", "health"],
                "category": "Water",
                "author": "Field Reporter",
                "status": "published",
                "published_at": now_iso(),
                "cover_image": "/assets/Great works/WhatsApp Image 25.jpeg",
                "program_type": "Water",
                "views": 0,
                "version": 1,
                "revisions": [],
            },
        ]
        await db.posts.insert_many(sample_posts)

    if await db.programs.count_documents({}) == 0:
        await db.programs.insert_many(
            [
                {
                    "id": str(uuid.uuid4()),
                    "name": "Safe Water Access",
                    "description": "Install and repair community water systems.",
                    "impact": "45,000+ people served",
                    "stats": {"wells": 128, "communities": 62},
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "Education Recovery",
                    "description": "Rebuild classrooms and provide learning kits.",
                    "impact": "12,000+ students supported",
                    "stats": {"schools": 19, "kits": 6400},
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "Shelter & Relief",
                    "description": "Emergency shelter, food, and counseling.",
                    "impact": "8,500+ families rehoused",
                    "stats": {"homes": 1250, "families": 8500},
                },
            ]
        )

    if await db.partners.count_documents({}) == 0:
        await db.partners.insert_many(
            [
                {
                    "id": str(uuid.uuid4()),
                    "name": "Hopewell Logistics",
                    "logo_url": "/assets/Great works/book.jpeg",
                    "website": "https://example.org",
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "Unity Health",
                    "logo_url": "/assets/Great works/gift.jpeg",
                    "website": "https://example.org",
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "Bright Futures",
                    "logo_url": "/assets/Great works/cgj.jpeg",
                    "website": "https://example.org",
                },
            ]
        )


class NewsletterSignup(BaseModel):
    email: EmailStr


class ContactInquiryIn(BaseModel):
    name: str
    email: EmailStr
    message: str
    phone: Optional[str] = ""
    topic: Optional[str] = "General"


class BlogPostIn(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = ""
    tags: List[str] = []
    category: Optional[str] = "General"
    author: Optional[str] = "GreatWorks Team"
    status: Optional[str] = "draft"
    scheduled_for: Optional[str] = None
    cover_image: Optional[str] = None
    program_type: Optional[str] = None


class PageContentIn(BaseModel):
    slug: str
    title: str
    content: str
    status: Optional[str] = "draft"


class EventIn(BaseModel):
    title: str
    description: str
    start_datetime: str
    end_datetime: str
    location: str
    capacity: Optional[int] = 0
    cover_image: Optional[str] = None
    recurrence: Optional[Dict[str, Any]] = None


class RegistrationIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""


class FeedbackIn(BaseModel):
    rating: int
    comments: Optional[str] = ""


class VolunteerUpdateIn(BaseModel):
    status: Optional[str] = ""
    hours_logged: Optional[float] = 0
    notes: Optional[str] = ""


class DonorIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    segment: Optional[str] = "General"


class DonationIn(BaseModel):
    donor_name: str
    donor_email: EmailStr
    amount: float
    currency: Optional[str] = "USD"
    recurring: Optional[bool] = False
    frequency: Optional[str] = ""
    campaign: Optional[str] = "General"


class DonationGoalIn(BaseModel):
    title: str
    target_amount: float


class ImpactUpdateIn(BaseModel):
    donor_id: str
    title: str
    message: str


class IntegrationConfigIn(BaseModel):
    type: str
    config: Dict[str, Any]


class WebhookIn(BaseModel):
    event: str
    url: str
    secret: Optional[str] = ""
    active: Optional[bool] = True


class SocialPostIn(BaseModel):
    platform: str
    content: str
    scheduled_for: Optional[str] = None


class ProgramIn(BaseModel):
    name: str
    description: str
    impact: str
    stats: Dict[str, Any]


class StaffUserIn(BaseModel):
    name: str
    email: EmailStr
    role: str


class PartnerIn(BaseModel):
    name: str
    logo_url: str
    website: Optional[str] = ""


class GalleryCollectionIn(BaseModel):
    title: str
    program_type: str
    media_ids: List[str]


class AnalyticsEventIn(BaseModel):
    event_type: str
    metadata: Dict[str, Any] = {}


async def trigger_webhooks(event: str, payload: Dict[str, Any]) -> None:
    hooks = await db.webhooks.find({"event": event, "active": True}, {"_id": 0}).to_list(1000)
    for hook in hooks:
        try:
            requests.post(hook["url"], json=payload, timeout=4)
        except Exception:
            continue


async def store_notification(notification: Dict[str, Any]) -> None:
    await db.notifications.insert_one(notification)


@api_router.get("/")
async def root():
    return {"message": "GreatWorks Foundation API"}


@api_router.get("/settings")
async def get_settings():
    return await get_settings_doc()


@api_router.put("/settings")
async def update_settings(payload: Dict[str, Any]):
    payload["updated_at"] = now_iso()
    await db.settings.update_one({"key": "site"}, {"$set": payload}, upsert=True)
    return await get_settings_doc()


@api_router.post("/newsletter")
async def newsletter_signup(payload: NewsletterSignup):
    exists = await db.newsletter.find_one({"email": payload.email}, {"_id": 0})
    if exists:
        return {"status": "exists"}
    doc = {"id": str(uuid.uuid4()), "email": payload.email, "created_at": now_iso()}
    await db.newsletter.insert_one(doc)
    await store_notification({"id": str(uuid.uuid4()), "type": "email", "recipient": payload.email, "subject": "Welcome", "body": "Thanks for joining", "status": "queued", "created_at": now_iso()})
    return {"status": "subscribed"}


@api_router.get("/newsletter")
async def list_newsletter():
    return await db.newsletter.find({}, {"_id": 0}).to_list(5000)


@api_router.post("/contact")
async def create_contact(payload: ContactInquiryIn):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now_iso(), "status": "new"})
    await db.contacts.insert_one(doc)
    return {"status": "received"}


@api_router.get("/contact")
async def list_contacts():
    return await db.contacts.find({}, {"_id": 0}).to_list(2000)


@api_router.post("/posts")
async def create_post(payload: BlogPostIn, background_tasks: BackgroundTasks):
    doc = payload.model_dump()
    doc.update(
        {
            "id": str(uuid.uuid4()),
            "slug": slugify(payload.title),
            "created_at": now_iso(),
            "published_at": now_iso() if payload.status == "published" else "",
            "views": 0,
            "version": 1,
            "revisions": [],
        }
    )
    await db.posts.insert_one(doc)
    background_tasks.add_task(trigger_webhooks, "post.created", doc)
    return doc


@api_router.get("/posts")
async def list_posts(status: Optional[str] = None):
    query: Dict[str, Any] = {}
    if status:
        query["status"] = status
    return await db.posts.find(query, {"_id": 0}).sort("created_at", -1).to_list(2000)


@api_router.get("/posts/{slug}")
async def get_post(slug: str):
    post = await db.posts.find_one({"slug": slug}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    await db.posts.update_one({"slug": slug}, {"$inc": {"views": 1}})
    post["views"] = post.get("views", 0) + 1
    return post


@api_router.put("/posts/{post_id}")
async def update_post(post_id: str, payload: BlogPostIn):
    existing = await db.posts.find_one({"id": post_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Post not found")
    revision = {"version": existing.get("version", 1), "content": existing.get("content", ""), "updated_at": now_iso()}
    update_doc = payload.model_dump()
    update_doc.update({"slug": slugify(payload.title), "updated_at": now_iso()})
    await db.posts.update_one({"id": post_id}, {"$set": update_doc, "$push": {"revisions": revision}, "$inc": {"version": 1}})
    return await db.posts.find_one({"id": post_id}, {"_id": 0})


@api_router.delete("/posts/{post_id}")
async def delete_post(post_id: str):
    await db.posts.delete_one({"id": post_id})
    return {"status": "deleted"}


@api_router.post("/pages")
async def create_page(payload: PageContentIn):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "version": 1, "revisions": [], "updated_at": now_iso()})
    await db.pages.insert_one(doc)
    return doc


@api_router.get("/pages/{slug}")
async def get_page(slug: str):
    page = await db.pages.find_one({"slug": slug}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page


@api_router.get("/pages")
async def list_pages():
    return await db.pages.find({}, {"_id": 0}).to_list(2000)


@api_router.put("/pages/{page_id}")
async def update_page(page_id: str, payload: PageContentIn):
    existing = await db.pages.find_one({"id": page_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Page not found")
    revision = {"version": existing.get("version", 1), "content": existing.get("content", ""), "updated_at": now_iso()}
    update_doc = payload.model_dump()
    update_doc.update({"updated_at": now_iso()})
    await db.pages.update_one({"id": page_id}, {"$set": update_doc, "$push": {"revisions": revision}, "$inc": {"version": 1}})
    return await db.pages.find_one({"id": page_id}, {"_id": 0})


@api_router.post("/media/upload")
async def upload_media(files: List[UploadFile] = File(...), program_type: str = Form("General")):
    saved_items = []
    for upload in files:
        content = await upload.read()
        file_hash = hashlib.sha256(content).hexdigest()
        existing = await db.media.find_one({"hash": file_hash}, {"_id": 0})
        if existing:
            saved_items.append({"status": "duplicate", "item": existing})
            continue
        ext = Path(upload.filename).suffix.lower()
        uid = str(uuid.uuid4())
        filename = f"{uid}{ext}"
        file_path = UPLOAD_DIR / "media" / filename
        with open(file_path, "wb") as f:
            f.write(content)
        media_type = "video" if ext in [".mp4", ".mov", ".webm"] else "image"
        optimized_url = ""
        webp_url = ""
        if media_type == "image":
            try:
                image = Image.open(io.BytesIO(content))
                image = image.convert("RGB")
                image.thumbnail((1600, 1600))
                optimized_name = f"{uid}-optimized.jpg"
                optimized_path = UPLOAD_DIR / "media" / optimized_name
                image.save(optimized_path, format="JPEG", quality=82)
                webp_name = f"{uid}.webp"
                webp_path = UPLOAD_DIR / "media" / webp_name
                image.save(webp_path, format="WEBP", quality=80)
                optimized_url = f"/uploads/media/{optimized_name}"
                webp_url = f"/uploads/media/{webp_name}"
            except Exception:
                optimized_url = f"/uploads/media/{filename}"
        doc = {
            "id": uid,
            "filename": upload.filename,
            "hash": file_hash,
            "type": media_type,
            "tags": auto_tags(upload.filename),
            "program_type": program_type,
            "original_url": f"/uploads/media/{filename}",
            "optimized_url": optimized_url,
            "webp_url": webp_url,
            "size": len(content),
            "created_at": now_iso(),
        }
        await db.media.insert_one(doc)
        saved_items.append({"status": "uploaded", "item": doc})
    return {"items": saved_items}


@api_router.get("/media")
async def list_media(program_type: Optional[str] = None):
    query: Dict[str, Any] = {}
    if program_type and program_type != "All":
        query["program_type"] = program_type
    return await db.media.find(query, {"_id": 0}).sort("created_at", -1).to_list(5000)


@api_router.delete("/media/{media_id}")
async def delete_media(media_id: str):
    await db.media.delete_one({"id": media_id})
    return {"status": "deleted"}


@api_router.get("/media/storage")
async def get_storage_usage():
    total = 0
    for root, _, files in os.walk(UPLOAD_DIR):
        for file in files:
            total += (Path(root) / file).stat().st_size
    return {"bytes": total, "megabytes": round(total / (1024 * 1024), 2)}


@api_router.post("/events")
async def create_event(payload: EventIn, background_tasks: BackgroundTasks):
    doc = payload.model_dump()
    doc.update(
        {
            "id": str(uuid.uuid4()),
            "created_at": now_iso(),
            "registration_count": 0,
            "waitlist_count": 0,
            "status": "scheduled",
        }
    )
    await db.events.insert_one(doc)
    background_tasks.add_task(trigger_webhooks, "event.created", doc)
    return doc


@api_router.get("/events")
async def list_events():
    return await db.events.find({}, {"_id": 0}).sort("start_datetime", 1).to_list(2000)


@api_router.get("/events/{event_id}")
async def get_event(event_id: str):
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@api_router.put("/events/{event_id}")
async def update_event(event_id: str, payload: EventIn):
    await db.events.update_one({"id": event_id}, {"$set": payload.model_dump()})
    return await db.events.find_one({"id": event_id}, {"_id": 0})


@api_router.post("/events/{event_id}/register")
async def register_event(event_id: str, payload: RegistrationIn, background_tasks: BackgroundTasks):
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    capacity = event.get("capacity", 0)
    registration_count = event.get("registration_count", 0)
    status = "registered"
    if capacity and registration_count >= capacity:
        status = "waitlist"
    doc = payload.model_dump()
    doc.update(
        {
            "id": str(uuid.uuid4()),
            "event_id": event_id,
            "status": status,
            "created_at": now_iso(),
        }
    )
    await db.registrations.insert_one(doc)
    if status == "registered":
        await db.events.update_one({"id": event_id}, {"$inc": {"registration_count": 1}})
    else:
        await db.events.update_one({"id": event_id}, {"$inc": {"waitlist_count": 1}})
    background_tasks.add_task(
        store_notification,
        {
            "id": str(uuid.uuid4()),
            "type": "email",
            "recipient": payload.email,
            "subject": f"Event registration: {event.get('title')}",
            "body": f"Status: {status}",
            "status": "queued",
            "created_at": now_iso(),
        },
    )
    return {"status": status}


@api_router.post("/events/{event_id}/feedback")
async def add_feedback(event_id: str, payload: FeedbackIn):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "event_id": event_id, "created_at": now_iso()})
    await db.feedback.insert_one(doc)
    return {"status": "received"}


@api_router.get("/events/{event_id}/ics")
async def download_event_ics(event_id: str):
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    start_dt = datetime.fromisoformat(event["start_datetime"]).strftime("%Y%m%dT%H%M%SZ")
    end_dt = datetime.fromisoformat(event["end_datetime"]).strftime("%Y%m%dT%H%M%SZ")
    ics = "\n".join(
        [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "BEGIN:VEVENT",
            f"UID:{event['id']}",
            f"DTSTAMP:{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}",
            f"DTSTART:{start_dt}",
            f"DTEND:{end_dt}",
            f"SUMMARY:{event['title']}",
            f"DESCRIPTION:{event['description']}",
            f"LOCATION:{event['location']}",
            "END:VEVENT",
            "END:VCALENDAR",
        ]
    )
    return StreamingResponse(
        io.BytesIO(ics.encode("utf-8")),
        media_type="text/calendar",
        headers={"Content-Disposition": "attachment; filename=event.ics"},
    )


@api_router.post("/volunteers")
async def create_volunteer(
    name: str = Form(...),
    email: EmailStr = Form(...),
    phone: str = Form(""),
    skills: str = Form(""),
    availability: str = Form(""),
    motivation: str = Form(""),
    resume: Optional[UploadFile] = File(None),
):
    resume_url = ""
    if resume:
        content = await resume.read()
        resume_name = f"{uuid.uuid4()}-{resume.filename}"
        resume_path = UPLOAD_DIR / "documents" / resume_name
        with open(resume_path, "wb") as f:
            f.write(content)
        resume_url = f"/uploads/documents/{resume_name}"
    doc = {
        "id": str(uuid.uuid4()),
        "name": name,
        "email": email,
        "phone": phone,
        "skills": [s.strip() for s in skills.split(",") if s.strip()],
        "availability": availability,
        "motivation": motivation,
        "resume_url": resume_url,
        "status": "applied",
        "hours_logged": 0,
        "recognitions": [],
        "training_status": "pending",
        "background_check_status": "pending",
        "created_at": now_iso(),
    }
    await db.volunteers.insert_one(doc)
    return {"status": "submitted"}


@api_router.get("/volunteers")
async def list_volunteers():
    return await db.volunteers.find({}, {"_id": 0}).sort("created_at", -1).to_list(2000)


@api_router.put("/volunteers/{volunteer_id}")
async def update_volunteer(volunteer_id: str, payload: VolunteerUpdateIn):
    await db.volunteers.update_one({"id": volunteer_id}, {"$set": payload.model_dump()})
    return await db.volunteers.find_one({"id": volunteer_id}, {"_id": 0})


@api_router.post("/volunteers/{volunteer_id}/hours")
async def log_hours(volunteer_id: str, hours: float = Form(...)):
    await db.volunteers.update_one({"id": volunteer_id}, {"$inc": {"hours_logged": hours}})
    return {"status": "logged"}


@api_router.post("/donors")
async def create_donor(payload: DonorIn):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now_iso(), "total_donated": 0})
    await db.donors.insert_one(doc)
    return doc


@api_router.get("/donors")
async def list_donors():
    return await db.donors.find({}, {"_id": 0}).to_list(2000)


@api_router.post("/donations")
async def create_donation(payload: DonationIn, background_tasks: BackgroundTasks):
    donor = await db.donors.find_one({"email": payload.donor_email}, {"_id": 0})
    if not donor:
        donor = {
            "id": str(uuid.uuid4()),
            "name": payload.donor_name,
            "email": payload.donor_email,
            "phone": "",
            "segment": "General",
            "created_at": now_iso(),
            "total_donated": 0,
        }
        await db.donors.insert_one(donor)
    donation_doc = payload.model_dump()
    donation_doc.update(
        {
            "id": str(uuid.uuid4()),
            "donor_id": donor["id"],
            "created_at": now_iso(),
            "status": "received",
        }
    )
    await db.donations.insert_one(donation_doc)
    await db.donors.update_one({"id": donor["id"]}, {"$inc": {"total_donated": payload.amount}})
    await db.goals.update_many({}, {"$inc": {"current_amount": payload.amount}})
    background_tasks.add_task(
        store_notification,
        {
            "id": str(uuid.uuid4()),
            "type": "email",
            "recipient": payload.donor_email,
            "subject": "Thank you for your donation",
            "body": f"We received your gift of {payload.amount} {payload.currency}.",
            "status": "queued",
            "created_at": now_iso(),
        },
    )
    background_tasks.add_task(trigger_webhooks, "donation.created", donation_doc)
    return donation_doc


@api_router.get("/donations")
async def list_donations():
    return await db.donations.find({}, {"_id": 0}).sort("created_at", -1).to_list(2000)


@api_router.get("/donations/{donation_id}/receipt")
async def donation_receipt(donation_id: str):
    donation = await db.donations.find_one({"id": donation_id}, {"_id": 0})
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    donor = await db.donors.find_one({"id": donation["donor_id"]}, {"_id": 0})
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", size=14)
    pdf.cell(0, 10, "GreatWorks Foundation - Tax Receipt", ln=1)
    pdf.set_font("Helvetica", size=12)
    pdf.cell(0, 10, f"Donor: {donor.get('name', '')}", ln=1)
    pdf.cell(0, 10, f"Email: {donor.get('email', '')}", ln=1)
    pdf.cell(0, 10, f"Amount: {donation['amount']} {donation['currency']}", ln=1)
    pdf.cell(0, 10, f"Date: {donation['created_at']}", ln=1)
    output = pdf.output(dest="S").encode("latin-1")
    return StreamingResponse(io.BytesIO(output), media_type="application/pdf")


@api_router.post("/goals")
async def create_goal(payload: DonationGoalIn):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "current_amount": 0, "created_at": now_iso()})
    await db.goals.insert_one(doc)
    return doc


@api_router.get("/goals")
async def list_goals():
    return await db.goals.find({}, {"_id": 0}).to_list(2000)


@api_router.post("/impact-updates")
async def create_impact_update(payload: ImpactUpdateIn):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now_iso()})
    await db.impact_updates.insert_one(doc)
    return doc


@api_router.get("/impact-updates/{donor_id}")
async def list_impact_updates(donor_id: str):
    return await db.impact_updates.find({"donor_id": donor_id}, {"_id": 0}).to_list(2000)


@api_router.post("/integrations")
async def save_integration(payload: IntegrationConfigIn):
    doc = payload.model_dump()
    await db.integrations.update_one({"type": payload.type}, {"$set": doc}, upsert=True)
    return doc


@api_router.get("/integrations")
async def list_integrations():
    return await db.integrations.find({}, {"_id": 0}).to_list(2000)


@api_router.post("/webhooks")
async def create_webhook(payload: WebhookIn):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now_iso()})
    await db.webhooks.insert_one(doc)
    return doc


@api_router.get("/webhooks")
async def list_webhooks():
    return await db.webhooks.find({}, {"_id": 0}).to_list(2000)


@api_router.post("/social-posts")
async def create_social_post(payload: SocialPostIn):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "status": "queued", "created_at": now_iso()})
    await db.social_posts.insert_one(doc)
    return doc


@api_router.get("/social-posts")
async def list_social_posts():
    return await db.social_posts.find({}, {"_id": 0}).to_list(2000)


@api_router.post("/programs")
async def create_program(payload: ProgramIn):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4())})
    await db.programs.insert_one(doc)
    return doc


@api_router.get("/programs")
async def list_programs():
    return await db.programs.find({}, {"_id": 0}).to_list(2000)


@api_router.post("/partners")
async def create_partner(payload: PartnerIn):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4())})
    await db.partners.insert_one(doc)
    return doc


@api_router.get("/partners")
async def list_partners():
    return await db.partners.find({}, {"_id": 0}).to_list(2000)


@api_router.post("/gallery-collections")
async def create_gallery_collection(payload: GalleryCollectionIn):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now_iso()})
    await db.gallery_collections.insert_one(doc)
    return doc


@api_router.get("/gallery-collections")
async def list_gallery_collections():
    return await db.gallery_collections.find({}, {"_id": 0}).to_list(2000)


@api_router.post("/staff-users")
async def create_staff_user(payload: StaffUserIn):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now_iso()})
    await db.staff_users.insert_one(doc)
    return doc


@api_router.get("/staff-users")
async def list_staff_users():
    return await db.staff_users.find({}, {"_id": 0}).to_list(2000)


@api_router.post("/annual-reports")
async def upload_annual_report(title: str = Form(...), year: str = Form(...), file: UploadFile = File(...)):
    content = await file.read()
    filename = f"{uuid.uuid4()}-{file.filename}"
    file_path = UPLOAD_DIR / "reports" / filename
    with open(file_path, "wb") as f:
        f.write(content)
    doc = {
        "id": str(uuid.uuid4()),
        "title": title,
        "year": year,
        "file_url": f"/uploads/reports/{filename}",
        "created_at": now_iso(),
    }
    await db.reports_library.insert_one(doc)
    return doc


@api_router.get("/annual-reports")
async def list_annual_reports():
    reports = await db.reports_library.find({}, {"_id": 0}).sort("year", -1).to_list(100)
    if reports:
        return reports
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", size=16)
    pdf.cell(0, 10, "GreatWorks Foundation Annual Report", ln=1)
    pdf.set_font("Helvetica", size=12)
    pdf.multi_cell(0, 8, "This is a placeholder annual report. Upload the official PDF from the admin dashboard.")
    output = pdf.output(dest="S").encode("latin-1")
    filename = f"report-{uuid.uuid4()}.pdf"
    file_path = UPLOAD_DIR / "reports" / filename
    with open(file_path, "wb") as f:
        f.write(output)
    doc = {
        "id": str(uuid.uuid4()),
        "title": "Annual Report",
        "year": str(datetime.now().year),
        "file_url": f"/uploads/reports/{filename}",
        "created_at": now_iso(),
    }
    await db.reports_library.insert_one(doc)
    return [doc]


@api_router.post("/analytics/event")
async def track_event(payload: AnalyticsEventIn):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now_iso()})
    await db.analytics_events.insert_one(doc)
    return {"status": "tracked"}


@api_router.get("/analytics/summary")
async def analytics_summary():
    donations = await db.donations.find({}, {"_id": 0}).to_list(5000)
    total_donations = sum([d.get("amount", 0) for d in donations])
    return {
        "donors": await db.donors.count_documents({}),
        "donations_total": total_donations,
        "volunteers": await db.volunteers.count_documents({}),
        "events": await db.events.count_documents({}),
        "newsletter": await db.newsletter.count_documents({}),
        "posts": await db.posts.count_documents({}),
    }


@api_router.post("/reports/generate")
async def generate_report(period: str = Form("monthly")):
    summary = await analytics_summary()
    report_doc = {
        "id": str(uuid.uuid4()),
        "period": period,
        "generated_at": now_iso(),
        "data": summary,
    }
    await db.reports.insert_one(report_doc)
    return report_doc


@api_router.get("/reports")
async def list_reports():
    return await db.reports.find({}, {"_id": 0}).to_list(2000)


@api_router.get("/reports/{report_id}/export")
async def export_report(report_id: str, format: str = "excel"):
    report = await db.reports.find_one({"id": report_id}, {"_id": 0})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    df = pd.DataFrame([report["data"]])
    if format == "excel":
        output = io.BytesIO()
        df.to_excel(output, index=False)
        output.seek(0)
        return StreamingResponse(output, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    output = io.BytesIO()
    df.to_csv(output, index=False)
    output.seek(0)
    return StreamingResponse(output, media_type="text/csv")


@api_router.get("/notifications")
async def list_notifications():
    return await db.notifications.find({}, {"_id": 0}).sort("created_at", -1).to_list(2000)


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_event():
    await get_settings_doc()
    await ensure_seed_data()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()