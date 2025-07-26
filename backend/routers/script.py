from fastapi import APIRouter, Request
from pydantic import BaseModel
from services.llm import generate_script_from_conversation
import json

router = APIRouter()

class GenerateScriptRequest(BaseModel):
    session_id: str

@router.post("/")
async def generate_script(payload: GenerateScriptRequest, request: Request):
    session_id = payload.session_id
    print(f"\n🎬 [SCRIPT GEN] Script requested for session: {session_id}")

    # Get conversation memory from app state
    session_memory = request.app.state.session_memory
    conversation = session_memory.get(session_id, [])

    if not conversation:
        
        return {"error": "No conversation found for this session ID."}

    
    

    try:
        result = generate_script_from_conversation(session_id=session_id)
        print("[✅ SCRIPT GEN] Script generation successful.")
        return {"script": result["script"]}
    except Exception as e:
        
        return {"error": f"Server error: {str(e)}"}
