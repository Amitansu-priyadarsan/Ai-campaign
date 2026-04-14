from pydantic import BaseModel
from typing import Optional


class PreferencesRequest(BaseModel):
    email: str
    business_name: str
    region: Optional[str] = None
    category: Optional[str] = None
    logo_preview: Optional[str] = None
    style_preset: Optional[str] = None
    typography: Optional[str] = None
    base_canvas: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
