import os
from pathlib import Path
from typing import Dict, Any
from services.whisper import transcribe_audio_file
from services.llm import get_llm_response
from services.tts import generate_emotional_audio
from memory.session_memory import add_to_memory, get_conversation

# Ensure audio directory exists
STATIC_DIR = Path("static/audio")
STATIC_DIR.mkdir(parents=True, exist_ok=True)

# Default fallback emotional score
DEFAULT_SCORE = {
    "score": 0,
    "level": "Low",
    "emoji": "😐",
    "color": "#aaa",
}

def validate_emotional_score(score: Any) -> Dict[str, Any]:
    """Ensure emotional score is valid dict, else return default."""
    if isinstance(score, dict) and "score" in score:
        return score
    
    return DEFAULT_SCORE

async def process_voice_interaction(file_path: str, session_id: str) -> Dict[str, Any]:
    try:
        
        transcript = await transcribe_audio_file(file_path)

        if not transcript or not transcript.strip():
            return {
                "error": "Could not transcribe audio or audio was empty.",
                "session_id": session_id,
                "type": "voice"
            }

        
        add_to_memory(session_id, "user", transcript)
        

       
        ai_response = get_llm_response(transcript, session_id=session_id)
        add_to_memory(session_id, "assistant", ai_response)
        

        
        audio_url, score = generate_emotional_audio(ai_response)
        emotional_score = validate_emotional_score(score)

        # Cleanup temp audio file
        try:
            os.unlink(file_path)
        except Exception as e:
            print(f"🧹 Could not delete file: {e}")

        # Dump memory for debugging
        print(f"\n[🗂️ MEMORY for session {session_id}]")
        for turn in get_conversation(session_id):
            print(f"[{turn['role'].upper()}] {turn['content']}")
        

        return {
            "session_id": session_id,
            "type": "voice",
            "transcript": transcript,
            "ai_response": ai_response,
            "audio_url": audio_url,
            "conversation_length": len(get_conversation(session_id)),
            "emotional_score": emotional_score
        }

    except Exception as e:
        print(f"❌ Error during voice interaction: {e}")
        return {
            "error": str(e),
            "session_id": session_id,
            "type": "voice"
        }

async def process_text_to_speech(text: str, session_id: str = None) -> Dict[str, Any]:
    try:
        
        audio_url, score = generate_emotional_audio(text)
        emotional_score = validate_emotional_score(score)

        return {
            "text": text,
            "audio_url": audio_url,
            "emotional_score": emotional_score,
            "session_id": session_id
        }

    except Exception as e:
        print(f"❌ Error during TTS: {e}")
        return {
            "error": str(e),
            "text": text,
            "session_id": session_id
        }
