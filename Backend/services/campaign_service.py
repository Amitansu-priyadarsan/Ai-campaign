import base64
import json
import asyncio
from typing import Optional, AsyncGenerator
from google.genai import types as genai_types
from core.config import genai_client
from models.campaign import CampaignGenerateRequest


# 4 prompts per muse type. Each muse gets its own front / three-quarter / close-up / profile.
PROMPTS_INDIAN_MODEL = [
    "Front-facing straight-on beauty shot of an Indian woman model, captured at eye level, centered composition, looking directly into the camera with a calm confident expression. The jewelry is the clear focal point and is fully visible without any cropping or obstruction. Clean elegant styling, soft natural makeup, smooth skin with realistic texture, subtle pores, detailed facial features, neatly styled hair pulled back or tucked away to keep attention on the jewelry. Studio lighting with soft shadows and even illumination to highlight the shine, craftsmanship, and fine details of the jewelry. High-resolution editorial fashion photography, sharp focus on the jewelry, luxurious aesthetic, premium brand campaign feel, neutral or softly blurred background, realistic proportions, refined composition, no tilt, no side angle, no dramatic pose, no hands covering the product.",
    "Elegant 45-degree three-quarter angle from the left, with an Indian woman model turned slightly toward the camera to create depth and dimension in the jewelry. The jewelry should remain the clear focal point, fully visible, crisp, and unobstructed, with graceful perspective that highlights its contours, craftsmanship, and shine. Eye-level framing, refined posture, soft confident expression, and a luxurious editorial beauty aesthetic. Natural-looking skin texture, polished makeup, and neatly styled hair to keep attention on the jewelry. Soft studio lighting with gentle highlights and controlled shadows to enhance the three-dimensional form of the piece. Premium fashion campaign look, high-resolution, sharp focus on the jewelry, tasteful composition, clean blurred background, realistic proportions, no harsh pose, no extreme angle, no cropping of the jewelry.",
    "Close-up detail shot from a slightly elevated angle on an Indian woman model, tightly framed to emphasize the craftsmanship, intricate setting, and gemstone details of the jewelry. The jewelry should dominate the composition, rendered with exceptional clarity, sharp focus, and visible texture in every fine element. Soft, controlled studio lighting to bring out sparkle, reflections, metal finish, and stone brilliance without harsh glare. Premium luxury editorial aesthetic, elegant and refined, with the model's skin softly visible only as a subtle supporting element. Natural skin texture, polished makeup, and minimal distractions in the background. High-resolution product-focused fashion photography, realistic proportions, clean composition, no wide framing, no clutter, no obstructions, no cropping of the jewelry.",
    "Profile side view from the right of an Indian woman model, captured at eye level with the model turned in a clean, elegant pose so the jewelry is prominently visible in profile. The composition should emphasize how the jewelry catches and reflects light from a dramatic angle, showcasing sparkle, shine, and dimensional detail. The jewelry remains the visual focal point, crisp and unobstructed, with refined styling that keeps attention on the piece. Soft yet directional studio lighting to create luminous highlights and subtle shadow contrast, enhancing the contours and craftsmanship. Luxurious editorial beauty photography, sharp focus, realistic skin texture, polished makeup, neatly styled hair, premium campaign aesthetic, clean blurred background, no front-facing pose, no clutter, no cropping, no distraction from the jewelry.",
]

PROMPTS_JEWELRY_ONLY = [
    "Front-facing straight-on product shot of the jewelry piece on a clean neutral surface, no model, no body parts, no hands. Centered composition with the jewelry fully visible and unobstructed. Soft, even studio lighting with controlled highlights to bring out metal finish, gemstone brilliance, and craftsmanship. High-resolution luxury catalog photography, sharp focus on the jewelry, premium brand aesthetic, softly blurred or seamless neutral background, realistic proportions, no tilt, no dramatic angle, no props.",
    "Elegant 45-degree three-quarter angle product shot of the jewelry piece on a clean neutral surface, no model, no body parts, no hands. The angle creates depth and dimension, highlighting contours, settings, and craftsmanship. Soft directional studio lighting with gentle highlights and controlled shadows to reveal the three-dimensional form. High-resolution luxury catalog photography, crisp sharp focus, premium brand aesthetic, clean blurred background, realistic proportions, refined composition, no model, no clutter.",
    "Macro close-up product shot of the jewelry piece on a clean neutral surface, no model, no body parts, no hands. Tightly framed to emphasize craftsmanship, intricate setting, gemstone facets, and metalwork texture. Exceptional clarity and sharp focus with visible texture in every fine element. Soft, controlled studio lighting to bring out sparkle, reflections, and stone brilliance without harsh glare. Premium luxury catalog aesthetic, minimal distractions, high-resolution product photography, no wide framing, no clutter.",
    "Profile side product shot of the jewelry piece on a clean neutral surface, no model, no body parts, no hands. Captured at eye level so the jewelry is prominently visible in profile, emphasizing how it catches and reflects light from a dramatic angle. Soft yet directional studio lighting creates luminous highlights and subtle shadow contrast, enhancing the contours and craftsmanship. The jewelry remains the visual focal point, crisp and unobstructed. High-resolution luxury catalog photography, premium brand aesthetic, clean blurred background, sharp focus, no front-facing angle, no clutter.",
]

PROMPTS_HAND = [
    "Front-facing close-up of a graceful woman's hand wearing the jewelry (ring or bracelet), captured at eye level, centered composition. The jewelry is the clear focal point and is fully visible without any cropping or obstruction. Elegant, relaxed hand pose with smooth realistic skin texture, well-groomed nails, and neutral manicure that does not distract from the piece. Soft studio lighting with even illumination to highlight the shine, gemstone facets, and craftsmanship of the jewelry. High-resolution editorial product photography, sharp focus on the jewelry, luxurious aesthetic, premium brand campaign feel, neutral or softly blurred background, realistic proportions.",
    "Elegant 45-degree three-quarter angle close-up of a woman's hand wearing the jewelry (ring or bracelet), with the hand turned slightly to create depth and dimension. The jewelry should remain the clear focal point, fully visible, crisp, and unobstructed, with graceful perspective that highlights its contours and craftsmanship. Refined hand pose, smooth natural skin texture, neutral manicure. Soft studio lighting with gentle highlights and controlled shadows to enhance the three-dimensional form. Premium editorial product photography, high-resolution, sharp focus, clean blurred background, realistic proportions, no awkward pose, no cropping of the jewelry.",
    "Macro close-up of a woman's hand wearing the jewelry (ring or bracelet), tightly framed to emphasize craftsmanship, intricate setting, and gemstone details. The jewelry dominates the composition with exceptional clarity, sharp focus, and visible texture in every fine element. Soft, controlled studio lighting to bring out sparkle, reflections, metal finish, and stone brilliance without harsh glare. Skin appears as a subtle supporting element with realistic texture. Premium luxury editorial aesthetic, minimal distractions, high-resolution product photography, no wide framing, no clutter.",
    "Profile side close-up of a woman's hand wearing the jewelry (ring or bracelet), captured at eye level with the hand in a clean elegant pose so the jewelry is prominently visible in profile. The composition emphasizes how the jewelry catches and reflects light from a dramatic angle, showcasing sparkle, shine, and dimensional detail. Soft directional studio lighting creates luminous highlights and subtle shadow contrast. High-resolution editorial product photography, sharp focus on the jewelry, refined hand pose, neutral manicure, clean blurred background, premium campaign aesthetic, no front-facing angle, no cropping.",
]

PROMPTS_NECK = [
    "Front-facing straight-on close-up of a woman's neck and décolletage wearing the jewelry (necklace or earrings), captured at eye level, centered composition. The jewelry is the clear focal point and is fully visible without any cropping or obstruction. Smooth realistic skin texture, soft natural makeup, neatly styled hair pulled back or tucked away to keep attention on the jewelry. Soft studio lighting with even illumination to highlight the shine, gemstone facets, and craftsmanship of the piece. High-resolution editorial fashion photography, sharp focus on the jewelry, luxurious aesthetic, premium brand campaign feel, neutral or softly blurred background, realistic proportions.",
    "Elegant 45-degree three-quarter angle close-up of a woman's neck and décolletage wearing the jewelry (necklace or earrings), with the model turned slightly to create depth and dimension. The jewelry should remain the clear focal point, fully visible, crisp, and unobstructed, with graceful perspective that highlights its contours and craftsmanship. Refined posture, natural skin texture, polished makeup, neat hair. Soft studio lighting with gentle highlights and controlled shadows to enhance the three-dimensional form. Premium editorial fashion photography, high-resolution, sharp focus, clean blurred background, realistic proportions, no awkward pose, no cropping.",
    "Macro close-up of a woman's neckline wearing the jewelry (necklace or earrings), tightly framed to emphasize craftsmanship, intricate setting, and gemstone details. The jewelry dominates the composition with exceptional clarity, sharp focus, and visible texture in every fine element. Soft, controlled studio lighting brings out sparkle, reflections, metal finish, and stone brilliance without harsh glare. Skin appears as a subtle supporting element with realistic texture and soft makeup. Premium luxury editorial aesthetic, minimal distractions, high-resolution fashion photography, no wide framing, no clutter.",
    "Profile side close-up of a woman's neck and ear wearing the jewelry (necklace or earrings), captured at eye level with the model turned in a clean elegant pose so the jewelry is prominently visible in profile. The composition emphasizes how the jewelry catches and reflects light from a dramatic angle, showcasing sparkle, shine, and dimensional detail. Soft directional studio lighting creates luminous highlights and subtle shadow contrast. High-resolution editorial fashion photography, sharp focus on the jewelry, neat hair, polished makeup, clean blurred background, premium campaign aesthetic, no front-facing angle, no cropping.",
]

MUSE_PROMPT_SETS = {
    "indian_model": PROMPTS_INDIAN_MODEL,
    "jewelry_only": PROMPTS_JEWELRY_ONLY,
    "hand": PROMPTS_HAND,
    "neck": PROMPTS_NECK,
    "custom": PROMPTS_INDIAN_MODEL,  # custom uses model prompts + uploaded reference image
}

ANGLE_LABELS = ["Front", "Three-Quarter", "Close-Up", "Profile"]


def _physics_phrase(draping_physics):
    return "flowing and loose traditional drape" if draping_physics > 50 else "structured and modern fitted drape"


def build_generation_prompt(angle_prompt, muse_type, draping, location, draping_physics):
    """Compose the angle-specific prompt with optional draping/location context.

    For muses where a model is present (indian_model, neck, custom) we add saree + location.
    For jewelry_only and hand we keep the prompt clean — those scenes don't need attire.
    """
    if muse_type in ("jewelry_only", "hand"):
        return angle_prompt
    return (
        f"{angle_prompt} "
        f"The model is dressed in a {draping} saree/fabric with a {_physics_phrase(draping_physics)}. "
        f"The setting evokes a luxurious {location} backdrop, kept softly blurred so the jewelry remains the hero."
    )


def _extract_image_b64(response):
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


def _generate_one(i, angle_prompt, content_parts, req):
    prompt = build_generation_prompt(
        angle_prompt, req.muse_type, req.draping, req.location, req.draping_physics
    )
    full_contents = [prompt] + content_parts
    angle_label = ANGLE_LABELS[i] if i < len(ANGLE_LABELS) else f"Angle {i+1}"
    try:
        response = genai_client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=full_contents,
            config=genai_types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"],
            ),
        )
        img_b64 = _extract_image_b64(response)
        if img_b64:
            return {
                "id": chr(65 + i),
                "label": "Variation %s" % chr(65 + i),
                "angle": angle_label,
                "image": "data:image/png;base64,%s" % img_b64,
            }
        return {
            "id": chr(65 + i),
            "label": "Variation %s" % chr(65 + i),
            "angle": angle_label,
            "image": None,
            "error": "No image returned for this angle",
        }
    except Exception as err:
        return {
            "id": chr(65 + i),
            "label": "Variation %s" % chr(65 + i),
            "angle": angle_label,
            "image": None,
            "error": str(err),
        }


async def generate_campaign_stream(req):
    # type: (CampaignGenerateRequest) -> AsyncGenerator[str, None]
    """SSE generator — yields each image as a separate event the moment it's ready."""
    image_bytes = base64.b64decode(req.jewelry_image)
    jewelry_part = genai_types.Part.from_bytes(data=image_bytes, mime_type="image/png")

    content_parts = [jewelry_part]
    if req.muse_type == "custom" and req.custom_muse_image:
        try:
            muse_bytes = base64.b64decode(req.custom_muse_image)
            muse_part = genai_types.Part.from_bytes(data=muse_bytes, mime_type="image/png")
            content_parts.append(muse_part)
        except Exception:
            pass  # if the custom upload is malformed, just fall back to the angle prompt

    prompts = MUSE_PROMPT_SETS.get(req.muse_type, PROMPTS_INDIAN_MODEL)

    metadata = {
        "muse": req.muse_label,
        "muse_type": req.muse_type,
        "draping": req.draping,
        "location": req.location,
        "draping_physics": req.draping_physics,
    }

    yield "data: %s\n\n" % json.dumps({"type": "metadata", "metadata": metadata})

    tasks = []
    for i, angle_prompt in enumerate(prompts):
        task = asyncio.get_event_loop().run_in_executor(
            None, _generate_one, i, angle_prompt, content_parts, req
        )
        tasks.append(task)

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
