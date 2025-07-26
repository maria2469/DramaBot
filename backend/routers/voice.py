# routers/voice.py
from fastapi import APIRouter
from services.llm import generate_script_from_conversation

router = APIRouter()

@router.post("/generate-script")
def generate_script(payload: dict):
    session_id = payload["session_id"]
    messages = payload["conversation"]

    print(f"🎭 [Voice Router] Script generation request for session: {session_id}")
    
    if not messages:
        return {"success": False, "script": "", "error": "No messages provided."}

    script = generate_script_from_conversation(messages, session_id=session_id)

    
    

    return {"success": True, "script": script, "session_id": session_id}
