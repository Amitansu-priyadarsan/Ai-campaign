from fastapi import APIRouter
from models.chat import ChatRequest
from services.chat_service import send_chat

router = APIRouter()


@router.post("/chat")
def chat(req: ChatRequest):
    return send_chat(req.message)
