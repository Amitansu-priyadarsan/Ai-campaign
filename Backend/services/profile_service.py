import httpx
from fastapi import HTTPException
from core.config import SUPABASE_URL
from core.supabase import supabase_rest_headers


async def get_profile(user_id: str) -> dict:
    """Fetch a row from the profiles table by user id."""
    url = f"{SUPABASE_URL}/rest/v1/profiles?id=eq.{user_id}&select=is_onboarded,preferences"
    async with httpx.AsyncClient() as client:
        r = await client.get(url, headers=supabase_rest_headers())
    if r.status_code != 200:
        return {}
    rows = r.json()
    return rows[0] if rows else {}


async def upsert_profile(user_id: str, is_onboarded: bool, preferences: dict) -> None:
    """Upsert is_onboarded and preferences into the profiles table."""
    url = f"{SUPABASE_URL}/rest/v1/profiles"
    payload = {
        "id": user_id,
        "is_onboarded": is_onboarded,
        "preferences": preferences,
        "updated_at": "now()",
    }
    headers = {**supabase_rest_headers(), "Prefer": "resolution=merge-duplicates,return=minimal"}
    async with httpx.AsyncClient() as client:
        r = await client.post(url, json=payload, headers=headers)
    if r.status_code not in (200, 201, 204):
        raise HTTPException(status_code=502, detail="Failed to upsert profile: " + r.text)
