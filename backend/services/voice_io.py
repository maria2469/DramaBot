import os
from pathlib import Path
from typing import Dict, Any

from services.whisper import transcribe_audio_file
from services.llm import get_llm_response
from services.tts import generate_emotional_audio

# ✅ Updated import to use the SQLite-backed memory system
from memory.session_memory import add_to_memory, get_conversation

# Ensure static/audio directory exists
STATIC_DIR = Path("static/audio")
STATIC_DIR.mkdir(parents=True, exist_ok=True)

async def process_voice_interaction(file_path: str, session_id: str) -> Dict[str, Any]:
    """
    Complete voice interaction pipeline:
    1. Transcribe audio to text
    2. Generate AI response
    3. Convert response to speech
    4. Store conversation in SQLite-backed memory
    """
    try:
        print(f"🎤 Transcribing audio: {file_path}")
        transcript = await transcribe_audio_file(file_path)

        print(f"📝 Transcript:  {transcript}")
        if not transcript or not transcript.strip():
            return {
                "error": "Could not transcribe audio or audio was empty",
                "session_id": session_id,
                "type": "voice"
            }

        # 🧠 Store user's message in SQLite memory
        add_to_memory(session_id, "user", transcript)
        print(f"🧠 [Memory] Added USER message to session: {session_id}")

        print(f"🤖 Generating response for session: {session_id}")
        ai_response = get_llm_response(transcript, session_id=session_id)
        print(f"💬 LLM Response: {ai_response}")

        # 🧠 Store bot's response in SQLite memory
        add_to_memory(session_id, "assistant", ai_response)
        print(f"🧠 [Memory] Added BOT message to session: {session_id}")

        print(f"🔊 Generating speech...")
        audio_url = generate_emotional_audio(ai_response)
        print(f"✅ Voice saved at: {audio_url}")

        # 🧠 Optional: Print conversation so far
        print(f"\n[🗂️ FULL MEMORY DUMP] Session: {session_id}")
        memory = get_conversation(session_id)
        for turn in memory:
            print(f"[{turn['role'].upper()}] {turn['content']}")
        print(f"🔚 End of memory for session: {session_id}\n")

        # Clean up temp file
        try:
            os.unlink(file_path)
        except Exception as e:
            print(f"⚠️ Could not delete temp file: {e}")

        return {
            "session_id": session_id,
            "transcript": transcript,
            "ai_response": ai_response,
            "audio_url": audio_url,
            "conversation_length": len(memory),
            "type": "voice"
        }

    except Exception as e:
        print(f"❌ Voice interaction error: {e}")
        return {
            "error": str(e),
            "session_id": session_id,
            "type": "voice"
        }

async def process_text_to_speech(text: str, session_id: str = None) -> Dict[str, Any]:
    """
    Convert plain text to speech
    """
    try:
        print(f"🔊 Converting plain text to emotional voice...")
        audio_url = generate_emotional_audio(text)
        print(f"✅ Voice generated: {audio_url}")

        return {
            "text": text,
            "audio_url": audio_url,
            "session_id": session_id
        }

    except Exception as e:
        print(f"❌ TTS error: {e}")
        return {
            "error": str(e),
            "text": text,
            "session_id": session_id
        }
