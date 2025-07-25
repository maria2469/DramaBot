# services/whisper.py
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Initialize Groq client for Whisper transcription
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def transcribe_audio_file(file_path: str) -> str:
    """
    Transcribe audio file using Groq's Whisper implementation
    """
    try:
        with open(file_path, "rb") as audio:
            response = groq_client.audio.transcriptions.create(
                model="whisper-large-v3",  # or whisper-large-v3-turbo for speed
                file=audio,
                response_format="text"
            )
        return response
    except Exception as e:
        print(f"❌ Error in transcription: {e}")
        raise
