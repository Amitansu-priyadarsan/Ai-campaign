from fastapi import APIRouter
from models.auth import LoginRequest
from services.auth_service import supabase_sign_in

router = APIRouter()


@router.post("/login")
async def login(req: LoginRequest):
    user = await supabase_sign_in(req.email, req.password)
    return {"success": True, "user": user}
