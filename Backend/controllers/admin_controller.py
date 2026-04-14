from fastapi import APIRouter, Header, HTTPException
from typing import Optional
from core.config import ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_SECRET
from core.supabase import require_admin
from models.admin import AdminLoginRequest, CreateUserRequest
from services.admin_service import supabase_list_users, supabase_create_user, supabase_delete_user

router = APIRouter(prefix="/admin")


@router.post("/login")
def admin_login(req: AdminLoginRequest):
    """Admin panel sign-in. Returns an admin secret token on success."""
    if req.email != ADMIN_EMAIL or req.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
    return {
        "success": True,
        "admin_secret": ADMIN_SECRET,
        "admin": {"email": ADMIN_EMAIL, "role": "superadmin"},
    }


@router.get("/users")
async def list_users(x_admin_secret: Optional[str] = Header(default=None)):
    require_admin(x_admin_secret)
    users = await supabase_list_users()
    return {"success": True, "users": users}


@router.post("/users")
async def create_user(
    req: CreateUserRequest,
    x_admin_secret: Optional[str] = Header(default=None),
):
    require_admin(x_admin_secret)
    user = await supabase_create_user(req.email, req.password, req.name, req.company)
    return {"success": True, "user": user}


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    x_admin_secret: Optional[str] = Header(default=None),
):
    require_admin(x_admin_secret)
    await supabase_delete_user(user_id)
    return {"success": True, "message": "User deleted"}
