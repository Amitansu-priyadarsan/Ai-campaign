import httpx
from fastapi import HTTPException
from core.config import SUPABASE_URL
from core.supabase import supabase_admin_headers


async def supabase_list_users() -> list:
    url = f"{SUPABASE_URL}/auth/v1/admin/users"
    async with httpx.AsyncClient() as client:
        r = await client.get(url, headers=supabase_admin_headers())
    if r.status_code != 200:
        raise HTTPException(status_code=502, detail="Supabase error: " + r.text)
    data = r.json()
    users = data.get("users", data) if isinstance(data, dict) else data
    return [
        {
            "id": u.get("id"),
            "email": u.get("email"),
            "name": (u.get("user_metadata") or {}).get("name", ""),
            "company": (u.get("user_metadata") or {}).get("company", ""),
            "created_at": u.get("created_at"),
            "confirmed": u.get("email_confirmed_at") is not None,
        }
        for u in users
    ]


async def supabase_create_user(email: str, password: str, name: str, company: str) -> dict:
    url = f"{SUPABASE_URL}/auth/v1/admin/users"
    payload = {
        "email": email,
        "password": password,
        "email_confirm": True,
        "user_metadata": {"name": name, "company": company},
    }
    async with httpx.AsyncClient() as client:
        r = await client.post(url, json=payload, headers=supabase_admin_headers())
    if r.status_code not in (200, 201):
        raise HTTPException(status_code=400, detail=r.json().get("message", r.text))
    u = r.json()
    return {
        "id": u.get("id"),
        "email": u.get("email"),
        "name": name,
        "company": company,
    }


async def supabase_delete_user(user_id: str) -> None:
    url = f"{SUPABASE_URL}/auth/v1/admin/users/{user_id}"
    async with httpx.AsyncClient() as client:
        r = await client.delete(url, headers=supabase_admin_headers())
    if r.status_code not in (200, 204):
        raise HTTPException(status_code=400, detail="Failed to delete user: " + r.text)
