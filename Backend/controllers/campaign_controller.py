from fastapi import APIRouter, Header
from typing import Optional
from core.supabase import get_user_from_token
from models.campaign import CampaignGenerateRequest
from models.campaign_save import CampaignSaveRequest
from services.campaign_service import generate_campaign
from services.campaigns_db_service import create_campaign, list_campaigns

router = APIRouter(prefix="/campaign")


@router.post("/generate")
async def generate_campaign_images(req: CampaignGenerateRequest):
    """Generate 4 campaign images at different angles using Gemini."""
    return await generate_campaign(req)


@router.post("/save")
async def save_campaign(
    req: CampaignSaveRequest,
    authorization: Optional[str] = Header(default=None),
):
    """Persist a published campaign for the authenticated user."""
    user = await get_user_from_token(authorization)
    user_id = user.get("id")
    saved = await create_campaign(user_id, req.model_dump())
    return {"success": True, "campaign": saved}


campaigns_router = APIRouter(prefix="/campaigns")


@campaigns_router.get("")
async def get_campaigns(authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    user_id = user.get("id")
    data = await list_campaigns(user_id)
    return {"success": True, "campaigns": data}
