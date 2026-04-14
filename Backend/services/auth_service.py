import httpx
from fastapi import HTTPException
from core.config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, preferences_store
from services.profile_service import get_profile


async def supabase_sign_in(email: str, password: str) -> dict:
    url = f"{SUPABASE_URL}/auth/v1/token?grant_type=password"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Content-Type": "application/json",
    }
    payload = {"email": email, "password": password}
    async with httpx.AsyncClient() as client:
        r = await client.post(url, json=payload, headers=headers)
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    data = r.json()
    user = data.get("user", {})
    meta = user.get("user_metadata") or {}
    user_id = user.get("id")
    email_val = user.get("email")

    profile = await get_profile(user_id)
    is_onboarded = bool(profile.get("is_onboarded", False))

    if is_onboarded and profile.get("preferences") and email_val not in preferences_store:
        preferences_store[email_val] = profile["preferences"]

    return {
        "access_token": data.get("access_token"),
        "email": email_val,
        "name": meta.get("name", email_val.split("@")[0]),
        "company": meta.get("company", ""),
        "role": "b2b_user",
        "isOnboarded": is_onboarded,
    }
