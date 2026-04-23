import base64
import json
import asyncio
from typing import Optional, AsyncGenerator
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


def build_generation_prompt(angle_desc, muse_label, draping, location, draping_physics):
    # type: (str, str, str, str, int) -> str
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


def _extract_image_b64(response):
    # type: (...) -> Optional[str]
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
                return data if isinstance(data, str) else None
    return None


def _generate_one(i, angle_desc, jewelry_part, req):
    # type: (int, str, ..., CampaignGenerateRequest) -> dict
    """Synchronous call — will be run via asyncio.to_thread."""
    prompt = build_generation_prompt(
        angle_desc, req.muse_label, req.draping,
        req.location, req.draping_physics
    )
    try:
        response = genai_client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=[prompt, jewelry_part],
            config=genai_types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"],
            ),
        )
        img_b64 = _extract_image_b64(response)
        if img_b64:
            return {
                "id": chr(65 + i),
                "label": "Variation %s" % chr(65 + i),
                "angle": angle_desc,
                "image": "data:image/png;base64,%s" % img_b64,
            }
        return {
            "id": chr(65 + i),
            "label": "Variation %s" % chr(65 + i),
            "angle": angle_desc,
            "image": None,
            "error": "No image returned for this angle",
        }
    except Exception as err:
        return {
            "id": chr(65 + i),
            "label": "Variation %s" % chr(65 + i),
            "angle": angle_desc,
            "image": None,
            "error": str(err),
        }


async def generate_campaign_stream(req):
    # type: (CampaignGenerateRequest) -> AsyncGenerator[str, None]
    """SSE generator — yields each image as a separate event the moment it's ready."""
    image_bytes = base64.b64decode(req.jewelry_image)
    jewelry_part = genai_types.Part.from_bytes(data=image_bytes, mime_type="image/png")

    metadata = {
        "muse": req.muse_label,
        "draping": req.draping,
        "location": req.location,
        "draping_physics": req.draping_physics,
    }

    # Send metadata first
    yield "data: %s\n\n" % json.dumps({"type": "metadata", "metadata": metadata})

    # Fire all 4 in parallel using asyncio tasks
    tasks = []
    for i, angle_desc in enumerate(ANGLE_DESCRIPTIONS):
        task = asyncio.get_event_loop().run_in_executor(
            None, _generate_one, i, angle_desc, jewelry_part, req
        )
        tasks.append(task)

    # Stream each result as it completes
    errors = []
    success = 0
    for coro in asyncio.as_completed(tasks):
        result = await coro
        if result.get("image"):
            success += 1
        elif result.get("error"):
            errors.append(result["error"])
        yield "data: %s\n\n" % json.dumps({"type": "image", "image": result})

    if success == 0 and errors:
        joined = " | ".join(errors)
        low = joined.lower()
        if any(k in low for k in ("quota", "resource_exhausted", "429", "billing", "rate limit", "insufficient")):
            msg = "Your Gemini API credits/quota are exhausted. Please check your billing. (%s)" % joined
        elif any(k in low for k in ("api key", "permission", "unauthenticated", "401", "403")):
            msg = "Gemini API key rejected. Check GEMINI_API_KEY. (%s)" % joined
        else:
            msg = "Image generation failed: %s" % joined
        yield "data: %s\n\n" % json.dumps({"type": "error", "message": msg})

    yield "data: %s\n\n" % json.dumps({"type": "done"})
