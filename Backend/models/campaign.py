from typing import Optional
from pydantic import BaseModel


class CampaignGenerateRequest(BaseModel):
    jewelry_image: str  # base64-encoded jewelry image
    muse_type: str = "indian_model"  # indian_model | jewelry_only | hand | neck | custom
    muse_label: str = "Indian Model"
    custom_muse_image: Optional[str] = None  # base64 reference photo, used when muse_type == "custom"
    draping: str = ""
    location: str = ""
    draping_physics: int = 50
    # legacy field kept optional for back-compat with older clients
    muse_id: Optional[int] = None
