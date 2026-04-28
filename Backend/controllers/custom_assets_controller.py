from fastapi import APIRouter, Header
from typing import Optional
from core.supabase import get_user_from_token
from models.custom_asset import CustomAssetCreate
from services.custom_assets_service import list_assets, create_asset, delete_asset

router = APIRouter(prefix="/custom")


@router.get("/{kind}")
async def get_assets(kind: str, authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    items = await list_assets(user["id"], kind)
    return {"success": True, "items": items}


@router.post("/{kind}")
async def add_asset(
    kind: str,
    req: CustomAssetCreate,
    authorization: Optional[str] = Header(default=None),
):
    user = await get_user_from_token(authorization)
    item = await create_asset(user["id"], kind, req.label, req.image)
    return {"success": True, "item": item}


@router.delete("/{kind}/{asset_id}")
async def remove_asset(
    kind: str,
    asset_id: str,
    authorization: Optional[str] = Header(default=None),
):
    user = await get_user_from_token(authorization)
    await delete_asset(user["id"], kind, asset_id)
    return {"success": True}
