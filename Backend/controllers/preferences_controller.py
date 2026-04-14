from fastapi import APIRouter, Header
from typing import Optional
from core.config import preferences_store
from core.supabase import get_user_from_token
from models.preferences import PreferencesRequest
from services.profile_service import upsert_profile, get_profile

router = APIRouter()


@router.post("/preferences")
async def save_preferences(req: PreferencesRequest, authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    user_id = user.get("id")
    email = user.get("email", req.email)
    prefs = req.model_dump(exclude={"email"})
    preferences_store[email] = prefs
    await upsert_profile(user_id, is_onboarded=True, preferences=prefs)
    return {"success": True, "message": "Preferences saved", "isOnboarded": True}


@router.get("/preferences")
async def get_preferences(authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    user_id = user.get("id")
    email = user.get("email", "")
    prefs = preferences_store.get(email)
    if not prefs:
        profile = await get_profile(user_id)
        prefs = profile.get("preferences")
        if prefs:
            preferences_store[email] = prefs
    if not prefs:
        return {"success": False, "preferences": None}
    return {"success": True, "preferences": prefs}
