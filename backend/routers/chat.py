# routers/voice.py
from fastapi import APIRouter
from pydantic import BaseModel
from services.llm import generate_script_from_conversation
import json

router = APIRouter()

class GenerateScriptRequest(BaseModel):
    session_id: str
    conversation: list  # Now passing full memory from frontend or main.py

@router.post("/generate-script")
async def generate_script(payload: GenerateScriptRequest):
    session_id = payload.session_id
    conversation = payload.conversation  # 👈 Use conversation passed from upstream

    

    if not conversation:
        
        return {"error": "No conversation provided."}

    # ✅ Log conversation (already pre-fetched by main or frontend)
    

    try:
        # 🎭 Generate script using passed conversation
        result = generate_script_from_conversation(conversation, session_id=session_id)
        
        return {
            "script": result["script"]
        }
    except Exception as e:
        
        return {"error": f"Server error: {str(e)}"}
