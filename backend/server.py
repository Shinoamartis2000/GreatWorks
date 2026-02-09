from fastapi import FastAPI, APIRouter, UploadFile, File, Form, BackgroundTasks, HTTPException, Request, Response, Depends
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
from passlib.context import CryptContext
from fpdf import FPDF
import pandas as pd
import hashlib
import re
import jwt
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

JWT_SECRET = os.environ.get("JWT_SECRET", "change-me")
JWT_ALGORITHM = "HS256"
SESSION_DAYS = 7
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


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


def strip_html(value: str, length: int = 160) -> str:
    text = re.sub("<[^<]+?>", "", value or "")
    return text[:length]


async def insert_doc(collection, doc: Dict[str, Any]) -> Dict[str, Any]:
    await collection.insert_one({**doc})
    doc.pop("_id", None)
    return doc


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: Dict[str, Any], expires_delta: timedelta) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    return await db.users.find_one({"user_id": user_id}, {"_id": 0, "password_hash": 0})


async def get_current_user(request: Request) -> Dict[str, Any]:
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.replace("Bearer ", "")
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await get_user_by_id(payload.get("user_id", ""))
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user

    session_token = request.cookies.get("session_token")
    if session_token:
        session = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
        if not session:
            raise HTTPException(status_code=401, detail="Session not found")
        expires_at = session.get("expires_at")
        if isinstance(expires_at, str):
            expires_at = datetime.fromisoformat(expires_at)
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=401, detail="Session expired")
        user = await get_user_by_id(session.get("user_id", ""))
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user

    raise HTTPException(status_code=401, detail="Not authenticated")


def require_roles(roles: List[str]):
    async def role_checker(user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
        if user.get("role") not in roles:
            raise HTTPException(status_code=403, detail="Access denied")
        return user

    return role_checker


async def get_settings_doc() -> Dict[str, Any]:
    doc = await db.settings.find_one({"key": "site"}, {"_id": 0})
    if not doc:
        doc = {
            "key": "site",
            "gofundme_url": "https://gofundme.com",
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
                "title": "Urban Scholarship Program reaches new students in Enugu",
                "slug": "urban-scholarship-program-enugu",
                "content": "GreatWorks Foundation awarded scholarships and mentorship support to students in Enugu, covering tuition, learning materials, and guidance for their next academic year.",
                "excerpt": "Scholarship recipients are now fully equipped for the new term in Enugu.",
                "tags": ["scholarship", "enugu"],
                "category": "Urban Scholarship",
                "author": "GreatWorks Team",
                "status": "published",
                "published_at": now_iso(),
                "cover_image": "/assets/Great works/WhatsApp Image 22.jpeg",
                "program_type": "Urban Scholarship",
                "views": 0,
                "version": 1,
                "revisions": [],
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Valentine Outreach 2022 celebrates widows and street families",
                "slug": "valentine-outreach-2022",
                "content": "Our Valentine Outreach delivered meals, care packs, and counseling for widows and street families, restoring dignity and warmth.",
                "excerpt": "A day of care and connection for widows and street families.",
                "tags": ["outreach", "valentine"],
                "category": "Valentine Outreach",
                "author": "Field Reporter",
                "status": "published",
                "published_at": now_iso(),
                "cover_image": "/assets/Great works/WhatsApp Image 23.jpeg",
                "program_type": "Valentine Outreach",
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
                    "name": "Urban Scholarship Program (Enugu)",
                    "description": "Scholarships, mentoring, and academic support for youth in Enugu.",
                    "impact": "Scholarships funded across urban schools",
                    "stats": {"students": 210, "mentors": 18},
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "Valentine Outreach 2022 (Widows & Street)",
                    "description": "Care packs, meals, and counseling for widows and street families.",
                    "impact": "Families supported through compassionate outreach",
                    "stats": {"families": 320, "care_packs": 500},
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "Community Relief & Recovery",
                    "description": "Emergency relief, food support, and recovery partnerships.",
                    "impact": "Ongoing relief for communities in Enugu",
                    "stats": {"outreaches": 24, "volunteers": 180},
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

    if await db.events.count_documents({}) == 0:
        await db.events.insert_many(
            [
                {
                    "id": str(uuid.uuid4()),
                    "title": "Urban Scholarship Mentorship Drive",
                    "description": "Mentorship and scholarship briefing for Enugu students.",
                    "start_datetime": (datetime.now(timezone.utc) + timedelta(days=10)).isoformat(),
                    "end_datetime": (datetime.now(timezone.utc) + timedelta(days=10, hours=2)).isoformat(),
                    "location": "Enugu City Center",
                    "capacity": 120,
                    "cover_image": "/assets/Great works/WhatsApp Image 22.jpeg",
                    "recurrence": None,
                    "registration_count": 0,
                    "waitlist_count": 0,
                    "status": "scheduled",
                    "created_at": now_iso(),
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Valentine Outreach Follow-up",
                    "description": "Community care packs and counseling for widows and street families.",
                    "start_datetime": (datetime.now(timezone.utc) + timedelta(days=22)).isoformat(),
                    "end_datetime": (datetime.now(timezone.utc) + timedelta(days=22, hours=3)).isoformat(),
                    "location": "Ogui Road, Enugu",
                    "capacity": 200,
                    "cover_image": "/assets/Great works/WhatsApp Image 23.jpeg",
                    "recurrence": None,
                    "registration_count": 0,
                    "waitlist_count": 0,
                    "status": "scheduled",
                    "created_at": now_iso(),
                },
            ]
        )


class NewsletterSignup(BaseModel):
    email: EmailStr


class UserRegisterIn(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "Volunteer"


class UserLoginIn(BaseModel):
    email: EmailStr
    password: str


class EmergentSessionIn(BaseModel):
    session_id: str


class UserRoleUpdateIn(BaseModel):
    role: str


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


@api_router.post("/auth/register")
async def register_user(payload: UserRegisterIn):
    existing = await db.users.find_one({"email": payload.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = {
        "user_id": f"user_{uuid.uuid4().hex[:12]}",
        "name": payload.name,
        "email": payload.email,
        "role": payload.role or "Volunteer",
        "password_hash": hash_password(payload.password),
        "auth_provider": "local",
        "created_at": now_iso(),
    }
    await insert_doc(db.users, user)
    user_response = {**user}
    user_response.pop("password_hash", None)
    return {"user": user_response}


@api_router.post("/auth/login")
async def login_user(payload: UserLoginIn):
    user = await db.users.find_one({"email": payload.email}, {"_id": 0})
    if not user or not user.get("password_hash"):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"user_id": user["user_id"], "role": user["role"]}, timedelta(days=SESSION_DAYS))
    user_response = {k: v for k, v in user.items() if k != "password_hash"}
    return {"token": token, "user": user_response}


@api_router.post("/auth/emergent/session")
async def emergent_session(payload: EmergentSessionIn, response: Response):
    session_response = requests.get(
        "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
        headers={"X-Session-ID": payload.session_id},
        timeout=10,
    )
    if session_response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session")
    session_data = session_response.json()
    user = await db.users.find_one({"email": session_data["email"]}, {"_id": 0})
    if not user:
        user = {
            "user_id": f"user_{uuid.uuid4().hex[:12]}",
            "name": session_data.get("name", ""),
            "email": session_data.get("email", ""),
            "picture": session_data.get("picture", ""),
            "role": "Volunteer",
            "auth_provider": "google",
            "created_at": now_iso(),
        }
        await insert_doc(db.users, user)
    session_token = session_data.get("session_token")
    expires_at = datetime.now(timezone.utc) + timedelta(days=SESSION_DAYS)
    await insert_doc(
        db.user_sessions,
        {
            "user_id": user["user_id"],
            "session_token": session_token,
            "expires_at": expires_at.isoformat(),
            "created_at": now_iso(),
        },
    )
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=SESSION_DAYS * 24 * 60 * 60,
    )
    return {"user": user}


@api_router.get("/auth/me")
async def auth_me(user: Dict[str, Any] = Depends(get_current_user)):
    return user


@api_router.post("/auth/logout")
async def logout_user(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    response.delete_cookie("session_token")
    return {"status": "logged_out"}


@api_router.put("/auth/users/{user_id}/role")
async def update_user_role(user_id: str, payload: UserRoleUpdateIn, user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    await db.users.update_one({"user_id": user_id}, {"$set": {"role": payload.role}})
    return await db.users.find_one({"user_id": user_id}, {"_id": 0})


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
async def create_post(
    payload: BlogPostIn,
    background_tasks: BackgroundTasks,
    user: Dict[str, Any] = Depends(require_roles(["Admin", "Editor"])),
):
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
    await insert_doc(db.posts, doc)
    background_tasks.add_task(trigger_webhooks, "post.created", doc)
    return doc


@api_router.get("/posts")
async def list_posts(status: Optional[str] = None):
    now_value = now_iso()
    await db.posts.update_many(
        {"status": "scheduled", "scheduled_for": {"$lte": now_value}},
        {"$set": {"status": "published", "published_at": now_value}},
    )
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
async def update_post(
    post_id: str,
    payload: BlogPostIn,
    user: Dict[str, Any] = Depends(require_roles(["Admin", "Editor"])),
):
    existing = await db.posts.find_one({"id": post_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Post not found")
    revision = {"version": existing.get("version", 1), "content": existing.get("content", ""), "updated_at": now_iso()}
    update_doc = payload.model_dump()
    update_doc.update({"slug": slugify(payload.title), "updated_at": now_iso()})
    await db.posts.update_one({"id": post_id}, {"$set": update_doc, "$push": {"revisions": revision}, "$inc": {"version": 1}})
    return await db.posts.find_one({"id": post_id}, {"_id": 0})


@api_router.delete("/posts/{post_id}")
async def delete_post(post_id: str, user: Dict[str, Any] = Depends(require_roles(["Admin", "Editor"]))):
    await db.posts.delete_one({"id": post_id})
    return {"status": "deleted"}


@api_router.post("/pages")
async def create_page(payload: PageContentIn, user: Dict[str, Any] = Depends(require_roles(["Admin", "Editor"]))):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "version": 1, "revisions": [], "updated_at": now_iso()})
    await insert_doc(db.pages, doc)
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
async def update_page(
    page_id: str,
    payload: PageContentIn,
    user: Dict[str, Any] = Depends(require_roles(["Admin", "Editor"])),
):
    existing = await db.pages.find_one({"id": page_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Page not found")
    revision = {"version": existing.get("version", 1), "content": existing.get("content", ""), "updated_at": now_iso()}
    update_doc = payload.model_dump()
    update_doc.update({"updated_at": now_iso()})
    await db.pages.update_one({"id": page_id}, {"$set": update_doc, "$push": {"revisions": revision}, "$inc": {"version": 1}})
    return await db.pages.find_one({"id": page_id}, {"_id": 0})


@api_router.delete("/pages/{page_id}")
async def delete_page(page_id: str, user: Dict[str, Any] = Depends(require_roles(["Admin", "Editor"]))):
    await db.pages.delete_one({"id": page_id})
    return {"status": "deleted"}


@api_router.post("/media/upload")
async def upload_media(
    files: List[UploadFile] = File(...),
    program_type: str = Form("General"),
    user: Dict[str, Any] = Depends(require_roles(["Admin", "Editor"])),
):
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
        await insert_doc(db.media, doc)
        saved_items.append({"status": "uploaded", "item": doc})
    return {"items": saved_items}


@api_router.get("/media")
async def list_media(program_type: Optional[str] = None):
    query: Dict[str, Any] = {}
    if program_type and program_type != "All":
        query["program_type"] = program_type
    return await db.media.find(query, {"_id": 0}).sort("created_at", -1).to_list(5000)


@api_router.put("/media/{media_id}")
async def update_media(
    media_id: str,
    tags: List[str] = Form([]),
    program_type: str = Form("General"),
    user: Dict[str, Any] = Depends(require_roles(["Admin", "Editor"])),
):
    await db.media.update_one({"id": media_id}, {"$set": {"tags": tags, "program_type": program_type}})
    return await db.media.find_one({"id": media_id}, {"_id": 0})


@api_router.delete("/media/{media_id}")
async def delete_media(media_id: str, user: Dict[str, Any] = Depends(require_roles(["Admin", "Editor"]))):
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
async def create_event(
    payload: EventIn,
    background_tasks: BackgroundTasks,
    user: Dict[str, Any] = Depends(require_roles(["Admin", "Editor"])),
):
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
    await insert_doc(db.events, doc)
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
async def update_event(
    event_id: str,
    payload: EventIn,
    user: Dict[str, Any] = Depends(require_roles(["Admin", "Editor"])),
):
    await db.events.update_one({"id": event_id}, {"$set": payload.model_dump()})
    return await db.events.find_one({"id": event_id}, {"_id": 0})


@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, user: Dict[str, Any] = Depends(require_roles(["Admin", "Editor"]))):
    await db.events.delete_one({"id": event_id})
    return {"status": "deleted"}


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
    await insert_doc(db.registrations, doc)
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
    await insert_doc(db.feedback, doc)
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
    await insert_doc(db.volunteers, doc)
    return {"status": "submitted"}


@api_router.get("/volunteers")
async def list_volunteers(user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    return await db.volunteers.find({}, {"_id": 0}).sort("created_at", -1).to_list(2000)


@api_router.put("/volunteers/{volunteer_id}")
async def update_volunteer(
    volunteer_id: str,
    payload: VolunteerUpdateIn,
    user: Dict[str, Any] = Depends(require_roles(["Admin"])),
):
    await db.volunteers.update_one({"id": volunteer_id}, {"$set": payload.model_dump()})
    return await db.volunteers.find_one({"id": volunteer_id}, {"_id": 0})


@api_router.post("/volunteers/{volunteer_id}/hours")
async def log_hours(
    volunteer_id: str,
    hours: float = Form(...),
    user: Dict[str, Any] = Depends(require_roles(["Admin"])),
):
    await db.volunteers.update_one({"id": volunteer_id}, {"$inc": {"hours_logged": hours}})
    return {"status": "logged"}


@api_router.delete("/volunteers/{volunteer_id}")
async def delete_volunteer(volunteer_id: str, user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    await db.volunteers.delete_one({"id": volunteer_id})
    return {"status": "deleted"}


@api_router.post("/donors")
async def create_donor(payload: DonorIn, user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now_iso(), "total_donated": 0})
    await insert_doc(db.donors, doc)
    return doc


@api_router.get("/donors")
async def list_donors(user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    return await db.donors.find({}, {"_id": 0}).to_list(2000)


@api_router.put("/donors/{donor_id}")
async def update_donor(donor_id: str, payload: DonorIn, user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    await db.donors.update_one({"id": donor_id}, {"$set": payload.model_dump()})
    return await db.donors.find_one({"id": donor_id}, {"_id": 0})


@api_router.delete("/donors/{donor_id}")
async def delete_donor(donor_id: str, user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    await db.donors.delete_one({"id": donor_id})
    return {"status": "deleted"}


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
        await insert_doc(db.donors, donor)
    donation_doc = payload.model_dump()
    donation_doc.update(
        {
            "id": str(uuid.uuid4()),
            "donor_id": donor["id"],
            "created_at": now_iso(),
            "status": "received",
        }
    )
    await insert_doc(db.donations, donation_doc)
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
async def list_donations(user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
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
    output = pdf.output(dest="S")
    output_bytes = bytes(output) if isinstance(output, (bytearray, bytes)) else str(output).encode("latin-1")
    return StreamingResponse(io.BytesIO(output_bytes), media_type="application/pdf")


@api_router.post("/goals")
async def create_goal(payload: DonationGoalIn, user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "current_amount": 0, "created_at": now_iso()})
    await insert_doc(db.goals, doc)
    return doc


@api_router.put("/goals/{goal_id}")
async def update_goal(goal_id: str, payload: DonationGoalIn, user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    await db.goals.update_one({"id": goal_id}, {"$set": payload.model_dump()})
    return await db.goals.find_one({"id": goal_id}, {"_id": 0})


@api_router.delete("/goals/{goal_id}")
async def delete_goal(goal_id: str, user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    await db.goals.delete_one({"id": goal_id})
    return {"status": "deleted"}


@api_router.get("/goals")
async def list_goals():
    return await db.goals.find({}, {"_id": 0}).to_list(2000)


@api_router.post("/impact-updates")
async def create_impact_update(payload: ImpactUpdateIn, user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now_iso()})
    await insert_doc(db.impact_updates, doc)
    return doc


@api_router.get("/impact-updates/{donor_id}")
async def list_impact_updates(donor_id: str):
    return await db.impact_updates.find({"donor_id": donor_id}, {"_id": 0}).to_list(2000)


@api_router.post("/integrations")
async def save_integration(payload: IntegrationConfigIn, user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    doc = payload.model_dump()
    await db.integrations.update_one({"type": payload.type}, {"$set": doc}, upsert=True)
    return doc


@api_router.get("/integrations")
async def list_integrations(user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    return await db.integrations.find({}, {"_id": 0}).to_list(2000)


@api_router.post("/webhooks")
async def create_webhook(payload: WebhookIn, user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now_iso()})
    await insert_doc(db.webhooks, doc)
    return doc


@api_router.get("/webhooks")
async def list_webhooks(user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    return await db.webhooks.find({}, {"_id": 0}).to_list(2000)


@api_router.post("/social-posts")
async def create_social_post(payload: SocialPostIn, user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "status": "queued", "created_at": now_iso()})
    await insert_doc(db.social_posts, doc)
    return doc


@api_router.get("/social-posts")
async def list_social_posts(user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    return await db.social_posts.find({}, {"_id": 0}).to_list(2000)


@api_router.post("/programs")
async def create_program(payload: ProgramIn, user: Dict[str, Any] = Depends(require_roles(["Admin", "Editor"]))):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4())})
    await insert_doc(db.programs, doc)
    return doc


@api_router.get("/programs")
async def list_programs():
    return await db.programs.find({}, {"_id": 0}).to_list(2000)


@api_router.put("/programs/{program_id}")
async def update_program(
    program_id: str,
    payload: ProgramIn,
    user: Dict[str, Any] = Depends(require_roles(["Admin", "Editor"])),
):
    await db.programs.update_one({"id": program_id}, {"$set": payload.model_dump()})
    return await db.programs.find_one({"id": program_id}, {"_id": 0})


@api_router.delete("/programs/{program_id}")
async def delete_program(program_id: str, user: Dict[str, Any] = Depends(require_roles(["Admin", "Editor"]))):
    await db.programs.delete_one({"id": program_id})
    return {"status": "deleted"}


@api_router.post("/partners")
async def create_partner(payload: PartnerIn, user: Dict[str, Any] = Depends(require_roles(["Admin", "Editor"]))):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4())})
    await insert_doc(db.partners, doc)
    return doc


@api_router.get("/partners")
async def list_partners():
    return await db.partners.find({}, {"_id": 0}).to_list(2000)


@api_router.put("/partners/{partner_id}")
async def update_partner(
    partner_id: str,
    payload: PartnerIn,
    user: Dict[str, Any] = Depends(require_roles(["Admin", "Editor"])),
):
    await db.partners.update_one({"id": partner_id}, {"$set": payload.model_dump()})
    return await db.partners.find_one({"id": partner_id}, {"_id": 0})


@api_router.delete("/partners/{partner_id}")
async def delete_partner(partner_id: str, user: Dict[str, Any] = Depends(require_roles(["Admin", "Editor"]))):
    await db.partners.delete_one({"id": partner_id})
    return {"status": "deleted"}


@api_router.post("/gallery-collections")
async def create_gallery_collection(payload: GalleryCollectionIn, user: Dict[str, Any] = Depends(require_roles(["Admin", "Editor"]))):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now_iso()})
    await insert_doc(db.gallery_collections, doc)
    return doc


@api_router.get("/gallery-collections")
async def list_gallery_collections():
    return await db.gallery_collections.find({}, {"_id": 0}).to_list(2000)


@api_router.post("/staff-users")
async def create_staff_user(payload: StaffUserIn, user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now_iso()})
    await insert_doc(db.staff_users, doc)
    return doc


@api_router.get("/staff-users")
async def list_staff_users(user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    return await db.staff_users.find({}, {"_id": 0}).to_list(2000)


@api_router.post("/annual-reports")
async def upload_annual_report(
    title: str = Form(...),
    year: str = Form(...),
    file: UploadFile = File(...),
    user: Dict[str, Any] = Depends(require_roles(["Admin"]))
):
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
    await insert_doc(db.reports_library, doc)
    return doc


@api_router.delete("/annual-reports/{report_id}")
async def delete_annual_report(report_id: str, user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    await db.reports_library.delete_one({"id": report_id})
    return {"status": "deleted"}


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
    output = pdf.output(dest="S")
    output_bytes = bytes(output) if isinstance(output, (bytearray, bytes)) else str(output).encode("latin-1")
    filename = f"report-{uuid.uuid4()}.pdf"
    file_path = UPLOAD_DIR / "reports" / filename
    with open(file_path, "wb") as f:
        f.write(output_bytes)
    doc = {
        "id": str(uuid.uuid4()),
        "title": "Annual Report",
        "year": str(datetime.now().year),
        "file_url": f"/uploads/reports/{filename}",
        "created_at": now_iso(),
    }
    await insert_doc(db.reports_library, doc)
    return [doc]


@api_router.post("/analytics/event")
async def track_event(payload: AnalyticsEventIn):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now_iso()})
    await insert_doc(db.analytics_events, doc)
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
async def generate_report(period: str = Form("monthly"), user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    summary = await analytics_summary()
    report_doc = {
        "id": str(uuid.uuid4()),
        "period": period,
        "generated_at": now_iso(),
        "data": summary,
    }
    await insert_doc(db.reports, report_doc)
    return report_doc


@api_router.get("/reports")
async def list_reports(user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    return await db.reports.find({}, {"_id": 0}).to_list(2000)


@api_router.get("/reports/{report_id}/export")
async def export_report(report_id: str, format: str = "excel", user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
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


@api_router.delete("/reports/{report_id}")
async def delete_report(report_id: str, user: Dict[str, Any] = Depends(require_roles(["Admin"]))):
    await db.reports.delete_one({"id": report_id})
    return {"status": "deleted"}


@api_router.get("/notifications")
async def list_notifications():
    return await db.notifications.find({}, {"_id": 0}).sort("created_at", -1).to_list(2000)


app.include_router(api_router)

allowed_origins = os.environ.get("CORS_ORIGINS", "*").split(",")
if "*" in allowed_origins or allowed_origins == [""]:
    allowed_origins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://ngo-greatworks.preview.emergentagent.com",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=allowed_origins,
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