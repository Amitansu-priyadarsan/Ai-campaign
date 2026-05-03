from fastapi import APIRouter, Header
from typing import Optional
from models.auth import LoginRequest
from services.auth_service import supabase_sign_in
from core.config import preferences_store
from core.supabase import get_user_from_token
from services.profile_service import get_profile

router = APIRouter()


@router.post("/login")
async def login(req: LoginRequest):
    user = await supabase_sign_in(req.email, req.password)
    return {"success": True, "user": user}


@router.get("/me")
async def get_me(authorization: Optional[str] = Header(default=None)):
    """Return the authenticated user's profile and brand preferences."""
    user = await get_user_from_token(authorization)
    user_id = user.get("id")
    email = user.get("email", "")
    meta = user.get("user_metadata") or {}

    prefs = preferences_store.get(email)
    if not prefs:
        profile = await get_profile(user_id)
        prefs = profile.get("preferences")
        if prefs:
            preferences_store[email] = prefs

    return {
        "success": True,
        "user": {
            "id": user_id,
            "email": email,
            "name": meta.get("name", email.split("@")[0]),
            "company": meta.get("company", ""),
        },
        "brand": prefs,
    }
