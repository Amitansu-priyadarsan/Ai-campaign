import httpx
from fastapi import HTTPException
from datetime import datetime
from core.config import SUPABASE_URL
from core.supabase import supabase_rest_headers


async def list_campaigns(user_id: str) -> list:
    url = f"{SUPABASE_URL}/rest/v1/campaigns?user_id=eq.{user_id}&select=*&order=created_at.desc"
    async with httpx.AsyncClient() as client:
        r = await client.get(url, headers=supabase_rest_headers())
    if r.status_code != 200:
        return []
    rows = r.json() or []
    return [_to_ui(c) for c in rows]


async def create_campaign(user_id: str, payload: dict) -> dict:
    url = f"{SUPABASE_URL}/rest/v1/campaigns"
    body = {
        "user_id": user_id,
        "title": payload.get("title") or "Untitled Campaign",
        "status": payload.get("status", "Active"),
        "platform": payload.get("platform", "Instagram"),
        "image": payload.get("image"),
        "metadata": payload.get("metadata") or {},
    }
    headers = {**supabase_rest_headers(), "Prefer": "return=representation"}
    async with httpx.AsyncClient() as client:
        r = await client.post(url, json=body, headers=headers)
    if r.status_code not in (200, 201):
        raise HTTPException(status_code=502, detail="Failed to create campaign: " + r.text)
    row = r.json()
    if isinstance(row, list):
        row = row[0] if row else {}
    return _to_ui(row)


def _to_ui(row: dict) -> dict:
    created = row.get("created_at") or ""
    date_str = ""
    if created:
        try:
            date_str = datetime.fromisoformat(created.replace("Z", "+00:00")).strftime("%b %d, %Y")
        except Exception:
            date_str = created[:10]
    return {
        "id": row.get("id"),
        "title": row.get("title"),
        "status": row.get("status"),
        "platform": row.get("platform"),
        "image": row.get("image"),
        "metadata": row.get("metadata"),
        "impressions": row.get("impressions") or "—",
        "conversions": row.get("conversions") or "—",
        "date": date_str,
    }
