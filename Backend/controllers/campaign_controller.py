from fastapi import APIRouter
from models.campaign import CampaignGenerateRequest
from services.campaign_service import generate_campaign

router = APIRouter(prefix="/campaign")


@router.post("/generate")
async def generate_campaign_images(req: CampaignGenerateRequest):
    """Generate 4 campaign images at different angles using Gemini."""
    return await generate_campaign(req)
