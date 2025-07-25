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

    print(f"\n[🎬 SCRIPT GEN] Requested script for session: {session_id}")

    if not conversation:
        print(f"[⚠️ SCRIPT GEN] No conversation passed for session: {session_id}")
        return {"error": "No conversation provided."}

    # ✅ Log conversation (already pre-fetched by main or frontend)
    print("[📚 SCRIPT GEN] Conversation received:")
    print(json.dumps(conversation, indent=2, ensure_ascii=False))

    try:
        # 🎭 Generate script using passed conversation
        result = generate_script_from_conversation(conversation, session_id=session_id)
        print("[✅ SCRIPT GEN] Script successfully generated.")
        return {
            "script": result["script"]
        }
    except Exception as e:
        print(f"[❌ SCRIPT GEN ERROR] {str(e)}")
        return {"error": f"Server error: {str(e)}"}
