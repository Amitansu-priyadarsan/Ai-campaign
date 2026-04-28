from typing import Optional
from pydantic import BaseModel


class CustomAssetCreate(BaseModel):
    label: str
    image: Optional[str] = None  # full data URL or base64; stored as-is
