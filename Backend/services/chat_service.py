from fastapi import HTTPException
from core.config import gemini_model


def send_chat(message: str) -> dict:
    try:
        response = gemini_model.generate_content(message)
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
