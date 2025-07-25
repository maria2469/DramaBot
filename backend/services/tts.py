import os
import re
import sys
import uuid
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
import emoji
from gtts import gTTS

# Load .env variables
load_dotenv()

# Ensure static/audio directory exists
STATIC_DIR = Path("static/audio")
STATIC_DIR.mkdir(parents=True, exist_ok=True)

# Cache for repeat generation (basic memory)
AUDIO_CACHE = {}
def split_text_into_chunks(text: str, max_len: int = 450) -> list:
    """Split text into chunks that gTTS can handle."""
    sentences = re.split(r'(?<=[.?!])\s+', text)
    chunks = []
    current = ""

    for sentence in sentences:
        if len(current) + len(sentence) < max_len:
            current += " " + sentence
        else:
            chunks.append(current.strip())
            current = sentence
    if current:
        chunks.append(current.strip())

    return chunks

def clean_text_for_tts(text: str) -> str:
    """Clean text for TTS (remove emojis, links, markdown)."""
    text = emoji.replace_emoji(text, replace='')                     # Remove emojis
    text = re.sub(r'!\[.*?\]\(.*?\)', '', text)                      # Remove markdown images
    text = re.sub(r'https?://\S+', '', text)                         # Remove URLs
    text = re.sub(r'[^a-zA-Z0-9.,;:!?\'"\s-]', '', text)             # Remove non-verbal symbols
    text = re.sub(r'\s{2,}', ' ', text).strip()                      # Normalize whitespace
    return text[:500]  # gTTS works best under ~500 chars

class TTSService:
    """TTS using Google gTTS (optimized for speed + caching)."""

    def __init__(self):
        print(f"🐍 Using Python from: {sys.executable}")

    def generate_emotional_audio(self, text: str, voice_id: Optional[str] = None) -> str:
        cleaned_text = clean_text_for_tts(text)

        if cleaned_text in AUDIO_CACHE:
            return AUDIO_CACHE[cleaned_text]  # Return cached audio path

        filename = f"tts_{uuid.uuid4().hex[:8]}.mp3"
        filepath = STATIC_DIR / filename

        try:
            tts = gTTS(text=cleaned_text, lang='en', slow=False)
            tts.save(str(filepath))
            url_path = f"/static/audio/{filename}"
            AUDIO_CACHE[cleaned_text] = url_path
            print(f"✅ gTTS saved: {url_path}")
            return url_path
        except Exception as e:
            print(f"❌ gTTS error: {e}")
            return ""

# Create global TTS instance
tts_service = TTSService()

# Public API
def generate_emotional_audio(text: str, voice_id: str = "21m00Tcm4TlvDq8ikWAM") -> str:
    return tts_service.generate_emotional_audio(text, voice_id)

def text_to_speech(text: str) -> str:
    return tts_service.generate_emotional_audio(text)
