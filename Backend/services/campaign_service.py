import base64
import google.generativeai as genai
from fastapi import HTTPException
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


async def generate_campaign(req: CampaignGenerateRequest) -> dict:
    try:
        image_data = base64.b64decode(req.jewelry_image)
        image_part = {"mime_type": "image/png", "data": image_data}
        gen_model = genai.GenerativeModel("gemini-2.0-flash-exp")

        generated_images = []
        for i, angle_desc in enumerate(ANGLE_DESCRIPTIONS):
            prompt = build_generation_prompt(
                angle_desc, req.muse_label, req.draping,
                req.location, req.draping_physics
            )
            try:
                response = gen_model.generate_content(
                    [prompt, image_part],
                    generation_config=genai.GenerationConfig(
                        response_mime_type="image/png",
                    ),
                )
                if response.candidates and response.candidates[0].content.parts:
                    for part in response.candidates[0].content.parts:
                        if hasattr(part, "inline_data") and part.inline_data:
                            img_b64 = base64.b64encode(part.inline_data.data).decode("utf-8")
                            generated_images.append({
                                "id": chr(65 + i),
                                "label": f"Variation {chr(65 + i)}",
                                "angle": angle_desc,
                                "image": f"data:image/png;base64,{img_b64}",
                            })
                            break
                    else:
                        generated_images.append({
                            "id": chr(65 + i),
                            "label": f"Variation {chr(65 + i)}",
                            "angle": angle_desc,
                            "image": None,
                            "error": "No image generated for this angle",
                        })
                else:
                    generated_images.append({
                        "id": chr(65 + i),
                        "label": f"Variation {chr(65 + i)}",
                        "angle": angle_desc,
                        "image": None,
                        "error": "Empty response from model",
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
