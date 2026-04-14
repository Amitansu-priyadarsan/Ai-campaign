from pydantic import BaseModel


class CampaignGenerateRequest(BaseModel):
    jewelry_image: str  # base64-encoded image
    muse_id: int
    muse_label: str
    draping: str
    location: str
    draping_physics: int
