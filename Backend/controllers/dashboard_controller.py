from fastapi import APIRouter, Header
from typing import Optional
from core.config import preferences_store
from core.supabase import get_user_from_token
from services.campaigns_db_service import list_campaigns
from services.profile_service import get_profile

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard(authorization: Optional[str] = Header(default=None)):
    """Return aggregated dashboard data for the authenticated user."""
    user = await get_user_from_token(authorization)
    user_id = user.get("id")
    email = user.get("email", "")

    prefs = preferences_store.get(email)
    if not prefs:
        profile = await get_profile(user_id)
        prefs = profile.get("preferences")
        if prefs:
            preferences_store[email] = prefs
    brand = prefs if prefs else None

    user_campaigns = await list_campaigns(user_id)
    total = len(user_campaigns)
    active = sum(1 for c in user_campaigns if c.get("status") == "Active")

    stats = {
        "totalCampaigns": total,
        "activeCampaigns": active,
        "totalReach": 0,
        "avgEngagement": "0%",
        "totalConversions": "0%",
        "revenue": "$0",
    }

    analytics = {
        "weeklyReach": [
            {"label": "Mon", "value": 0},
            {"label": "Tue", "value": 0},
            {"label": "Wed", "value": 0},
            {"label": "Thu", "value": 0},
            {"label": "Fri", "value": 0},
            {"label": "Sat", "value": 0},
        ],
    }

    return {
        "success": True,
        "brand": brand,
        "stats": stats,
        "campaigns": user_campaigns,
        "analytics": analytics,
    }
