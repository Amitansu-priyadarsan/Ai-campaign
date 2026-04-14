from pydantic import BaseModel
from typing import Optional, Any, Dict


class CampaignSaveRequest(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = "Active"
    platform: Optional[str] = "Instagram"
    image: Optional[str] = None  # data URL of selected variation
    metadata: Optional[Dict[str, Any]] = None
