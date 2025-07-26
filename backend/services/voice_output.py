# backend/services/voice_output.py
import os
from elevenlabs import generate, save, set_api_key

set_api_key(os.getenv("ELEVENLABS_API_KEY"))

def speak_text(text, voice="Rachel", output_path="output.wav"):
    try:
        audio = generate(
            text=text,
            voice=voice,
            model="eleven_multilingual_v2",  # Best expressive model
            stream=False
        )
        save(audio, output_path)
        
        return output_path
    except Exception as e:
        print(f"❌ Error in TTS: {e}")
        raise
