import base64
from typing import Optional
from fastapi import HTTPException
from google.genai import types as genai_types
from core.config import genai_client
from models.campaign import CampaignGenerateRequest


ANGLE_DESCRIPTIONS = [
    "front-facing straight-on view, jewelry clearly visible on the model, shot at eye level",
    "elegant 45-degree three-quarter angle from the left, showing depth and dimension of the jewelry",
    "close-up detail shot from a slightly elevated angle, emphasizing the craftsmanship and gemstone details",
    "profile side view from the right, capturing how the jewelry catches light from a dramatic angle",
]


def build_generation_prompt(angle_desc: str, muse_label: str, draping: str, location: str, draping_physics: int) -> str:
    physics_style = "flowing and loose traditional drape" if draping_physics > 50 else "structured and modern fitted drape"
    return (
        f"Generate a photorealistic high-fashion jewelry campaign image. "
        f"The model ({muse_label}) is wearing the uploaded jewelry piece prominently. "
        f"She is dressed in a {draping} saree/fabric with a {physics_style}. "
        f"The setting is a luxurious {location} backdrop with cinematic lighting. "
        f"Camera angle: {angle_desc}. "
        f"The jewelry must be the hero element — sharply in focus, catching light beautifully. "
        f"Style: editorial high-fashion photography, 8K quality, rich colors, "
        f"shallow depth of field on the background, professional studio-grade output. "
        f"The image should look like it belongs in Vogue or a premium jewelry brand campaign."
    )


def _extract_image_b64(response) -> Optional[str]:
    """Pull the first inline image out of a gemini image-gen response."""
    if not response or not response.candidates:
        return None
    for cand in response.candidates:
        parts = getattr(cand.content, "parts", None) or []
        for part in parts:
            inline = getattr(part, "inline_data", None)
            if inline and getattr(inline, "data", None):
                data = inline.data
                if isinstance(data, bytes):
                    return base64.b64encode(data).decode("utf-8")
                # SDK sometimes returns base64 string already
                return data if isinstance(data, str) else None
    return None


async def generate_campaign(req: CampaignGenerateRequest) -> dict:
    try:
        image_bytes = base64.b64decode(req.jewelry_image)
        jewelry_part = genai_types.Part.from_bytes(data=image_bytes, mime_type="image/png")

        generated_images = []
        for i, angle_desc in enumerate(ANGLE_DESCRIPTIONS):
            prompt = build_generation_prompt(
                angle_desc, req.muse_label, req.draping,
                req.location, req.draping_physics
            )
            try:
                response = genai_client.models.generate_content(
                    model="gemini-2.5-flash-image",
                    contents=[prompt, jewelry_part],
                )
                img_b64 = _extract_image_b64(response)
                if img_b64:
                    generated_images.append({
                        "id": chr(65 + i),
                        "label": f"Variation {chr(65 + i)}",
                        "angle": angle_desc,
                        "image": f"data:image/png;base64,{img_b64}",
                    })
                else:
                    generated_images.append({
                        "id": chr(65 + i),
                        "label": f"Variation {chr(65 + i)}",
                        "angle": angle_desc,
                        "image": None,
                        "error": "No image returned for this angle",
                    })
            except Exception as angle_err:
                generated_images.append({
                    "id": chr(65 + i),
                    "label": f"Variation {chr(65 + i)}",
                    "angle": angle_desc,
                    "image": None,
                    "error": str(angle_err),
                })

        return {
            "success": True,
            "images": generated_images,
            "metadata": {
                "muse": req.muse_label,
                "draping": req.draping,
                "location": req.location,
                "draping_physics": req.draping_physics,
            },
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")
