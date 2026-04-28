import httpx
from typing import Optional
from fastapi import HTTPException
from core.config import SUPABASE_URL
from core.supabase import supabase_rest_headers

# kind -> table name mapping. Keeps endpoints unified.
TABLES = {
    "muses": "custom_muses",
    "drapings": "custom_drapings",
    "locations": "custom_locations",
}


def _table(kind: str) -> str:
    if kind not in TABLES:
        raise HTTPException(status_code=400, detail=f"Unknown asset kind: {kind}")
    return TABLES[kind]


async def list_assets(user_id: str, kind: str) -> list:
    table = _table(kind)
    url = f"{SUPABASE_URL}/rest/v1/{table}?user_id=eq.{user_id}&select=id,label,image,created_at&order=created_at.desc"
    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.get(url, headers=supabase_rest_headers())
    if r.status_code != 200:
        return []
    return r.json() or []


async def create_asset(user_id: str, kind: str, label: str, image: Optional[str]) -> dict:
    table = _table(kind)
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    body = {"user_id": user_id, "label": label, "image": image}
    async with httpx.AsyncClient(timeout=60.0) as client:
        r = await client.post(url, json=body, headers=supabase_rest_headers())
    if r.status_code not in (200, 201):
        raise HTTPException(status_code=502, detail=f"Failed to create {kind}: {r.text}")
    row = r.json()
    if isinstance(row, list):
        row = row[0] if row else {}
    return row


async def delete_asset(user_id: str, kind: str, asset_id: str) -> None:
    table = _table(kind)
    url = f"{SUPABASE_URL}/rest/v1/{table}?id=eq.{asset_id}&user_id=eq.{user_id}"
    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.delete(url, headers=supabase_rest_headers())
    if r.status_code not in (200, 204):
        raise HTTPException(status_code=502, detail=f"Failed to delete {kind}: {r.text}")
