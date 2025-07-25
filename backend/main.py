# main.py
import shutil
import tempfile
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from memory import session_memory

# === Load environment variables ===
load_dotenv()

# === Internal Modules (Memory) ===
from memory.session_memory import (
    get_conversation,
    add_to_memory,
    get_memory_stats,
    delete_memory,
    dump_memory,
)

# === Services ===
from services.voice_io import process_voice_interaction, process_text_to_speech
from services.llm import generate_script_from_conversation

# === App Initialization ===
app = FastAPI(title="🎭 Theatrical Drama Bot", version="1.0.0")

# === CORS Setup ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Serve Static Audio Files ===
STATIC_DIR = Path("static")
STATIC_DIR.mkdir(exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# === Request Models ===
class TTSRequest(BaseModel):
    text: str
    session_id: str

class GenerateScriptRequest(BaseModel):
    session_id: str

# === Middleware: Attach Memory to Request ===
@app.middleware("http")
async def attach_session_memory(request: Request, call_next):
    session_id = request.query_params.get("session_id") or request.headers.get("X-Session-ID")
    if session_id:
        print(f"🔍 Middleware: Calling get_conversation for session_id={session_id}")
        memory = session_memory.get_conversation(session_id)
        print(f"✅ Middleware: Retrieved memory (len={len(memory)})")
        request.state.session_id = session_id
        request.state.session_memory = memory
    else:
        print("⚠️ Middleware: No session_id found.")
        request.state.session_memory = None
        request.state.session_id = None

    response = await call_next(request)
    return response



# === Voice Input Endpoint ===
@app.post("/voice/interact")
async def voice_interact(file: UploadFile = File(...), session_id: str = Form(...)):
    print(f"🎤 /voice/interact | Session ID: {session_id}")
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
            shutil.copyfileobj(file.file, temp_audio)
            temp_path = temp_audio.name
            print(f"🎧 Saved audio to: {temp_path}")

        # Process the audio
        result = await process_voice_interaction(temp_path, session_id)

        user_text = result.get("user_text", "").strip()
        bot_response = result.get("bot_response", "").strip()

        if user_text:
            print(f"📝 Calling add_to_memory (user): {user_text}")
            add_to_memory(session_id, "user", user_text)
        if bot_response:
            print(f"🎭 Calling add_to_memory (bot): {bot_response}")
            add_to_memory(session_id, "bot", bot_response)

        print("📦 Calling dump_memory after interaction:")
        dump_memory(session_id)

        print("📊 Calling get_memory_stats")
        stats = get_memory_stats(session_id)
        print(f"Memory Stats: {stats}")

        return JSONResponse(content=result)
    except Exception as e:
        print(f"❌ Voice interaction failed: {e}")
        raise HTTPException(status_code=500, detail="Voice interaction failed.")


# === Text-to-Speech Endpoint ===
@app.post("/voice/tts")
async def tts_endpoint(payload: TTSRequest):
    print(f"🔊 /voice/tts | Session: {payload.session_id} | Text: {payload.text[:50]}...")
    try:
        result = await process_text_to_speech(payload.text, payload.session_id)
        return result
    except Exception as e:
        print(f"❌ TTS failed: {e}")
        raise HTTPException(status_code=500, detail="Text-to-speech failed.")

# === Script Generation Endpoint ===

@app.post("/script/generate")
def generate_script_api(payload: GenerateScriptRequest):
    session_id = payload.session_id
    print(f"\n📝 /script/generate called | Session: {session_id}")
    
    memory = get_conversation(session_id)
    if not memory:
        print("⚠️ No memory found for script generation.")
        return JSONResponse(status_code=404, content={"error": f"No memory for session {session_id}"})

    try:
        result = generate_script_from_conversation(session_id)
        return JSONResponse(content=result)
    except Exception as e:
        print(f"❌ Script generation error: {e}")
        raise HTTPException(status_code=500, detail="Script generation failed.")


# === End Session ===
@app.post("/session/end")
def end_session(session_id: str):
    try:
        print(f"🧹 Calling delete_memory for session: {session_id}")
        deleted = delete_memory(session_id)
        if deleted:
            print(f"✅ Memory deleted for session: {session_id}")
            return {"message": f"Session {session_id} ended and memory cleared."}
        else:
            print(f"⚠️ No memory found for session: {session_id}")
            return JSONResponse(status_code=404, content={"error": f"Session {session_id} not found."})
    except Exception as e:
        print(f"❌ Error ending session: {e}")
        raise HTTPException(status_code=500, detail="Failed to end session.")

# === Debug Endpoints ===
@app.get("/debug/conversation/{session_id}")
def get_conversation_debug(session_id: str):
    print(f"🐛 Debug: get_conversation for {session_id}")
    memory = get_conversation(session_id)
    return {
        "session_id": session_id,
        "conversation_length": len(memory),
        "conversation": memory,
    }


@app.get("/debug/memory")
def get_all_memory_stats():
    try:
        print("🧠 Debug: Calling get_memory_stats")
        stats = get_memory_stats()
        return stats
    except Exception as e:
        print(f"❌ Memory stats error: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

# === Health Check ===
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# === Root Info ===
@app.get("/")
def root():
    return {
        "message": "🎭 Theatrical Drama Bot API",
        "version": "1.0.0",
        "endpoints": {
            "voice_interact": "/voice/interact",
            "text_to_speech": "/voice/tts",
            "generate_script": "/script/generate",
            "end_session": "/session/end",
            "debug_conversation": "/debug/conversation/{session_id}",
            "debug_memory": "/debug/memory",
            "health": "/health",
        },
    }
