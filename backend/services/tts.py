import os
import re
import sys
import uuid
from pathlib import Path
from typing import Optional, Tuple

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

def split_text_into_chunks(text: str, max_len: int = 1000) -> list:
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
    """TTS using Google gTTS with emotional score logging."""

    def __init__(self):
        print(f"🐍 Using Python from: {sys.executable}")

    def generate_emotional_audio(self, text: str, voice_id: Optional[str] = None) -> Tuple[str, dict]:
        cleaned_text = clean_text_for_tts(text)

        if cleaned_text in AUDIO_CACHE:
            print("🧠 Returning cached audio.")
            return AUDIO_CACHE[cleaned_text], {
                "score": 0, "level": "Low", "emoji": "😐", "color": "#aaa"
            }

        # --- Emotion Feature Extraction ---
        exclamations = cleaned_text.count("!")
        all_caps_count = sum(1 for word in cleaned_text.split() if word.isupper() and len(word) > 2)
        intense_punct_count = len(re.findall(r"\?!|!\?", cleaned_text))

        intense_keywords = re.findall(
            r"\b(love|hate|crying|exploding|raging|furious|ecstatic|devastated|insane|nooo+|yaaa+|ugh|omg|shaking|lit|wild)\b",
            cleaned_text, re.IGNORECASE)
        moderate_keywords = re.findall(
            r"\b(happy|sad|hopeful|upset|calm|gentle|sweet|nervous|touched|lonely|tired|meh|confused|awkward|emotional)\b",
            cleaned_text, re.IGNORECASE)

        intense_emojis = {"😭", "😡", "🔥", "💔", "🤯", "🤬", "😤", "😱"}
        moderate_emojis = {"😊", "😅", "🥲", "🙂", "🤗", "❤️", "✨", "😐", "😔", "😳"}
        emoji_score = sum(2 for e in intense_emojis if e in text) + sum(1 for e in moderate_emojis if e in text)

        emotional_words = re.findall(
            r"\b(I|you|we|feel|miss|trust|care|hurt|friend|connect|burning|mad|terrified|anxious|desperate)\b",
            cleaned_text, re.IGNORECASE)
        emotional_depth = len(emotional_words)

        # --- Intensity Score Calculation ---
        intensity_score = (
            all_caps_count * 2 +
            exclamations * 1.5 +
            intense_punct_count * 3 +
            len(intense_keywords) * 3 +
            len(moderate_keywords) * 1.5 +
            emoji_score * 2 +
            emotional_depth * 1.2
        )

        word_count = len(cleaned_text.split())
        est_time = max(1.0, word_count / 100.0)  # ~100wpm
        raw_score = intensity_score / est_time
        scaled_score = min(10, max(1, round(raw_score / 5.5)))

        # --- Score Mapping ---
        score_map = {
            1: {"level": "Numb", "emoji": "😐", "color": "#9ca3af"},
            2: {"level": "Mellow", "emoji": "🙂", "color": "#a3e635"},
            3: {"level": "Warm", "emoji": "😊", "color": "#facc15"},
            4: {"level": "Touched", "emoji": "🥺", "color": "#fb923c"},
            5: {"level": "Spicy", "emoji": "🌶️", "color": "#f87171"},
            6: {"level": "Dramatic", "emoji": "🎭", "color": "#f472b6"},
            7: {"level": "Fiery", "emoji": "🔥", "color": "#ef4444"},
            8: {"level": "Explosive", "emoji": "💥", "color": "#e11d48"},
            9: {"level": "Meltdown", "emoji": "🤯", "color": "#be123c"},
            10: {"level": "DRAMA BOMB", "emoji": "🎆", "color": "#881337"},
        }

        score_data = {
            "score": scaled_score,
            **score_map[scaled_score]
        }

        

        # --- Audio Generation ---
        filename = f"tts_{uuid.uuid4().hex[:8]}.mp3"
        filepath = STATIC_DIR / filename

        try:
            tts = gTTS(text=cleaned_text, lang='en', slow=False)
            tts.save(str(filepath))
            url_path = f"/static/audio/{filename}"
            AUDIO_CACHE[cleaned_text] = url_path
            
            return url_path, score_data
        except Exception as e:
            print(f"❌ gTTS error: {e}")
            return "", {"score": 0, "level": "Error", "emoji": "❌", "color": "#000"}





# Create global TTS instance
tts_service = TTSService()

# 🌟 Main Public API
def generate_emotional_audio(text: str, voice_id: str = "21m00Tcm4TlvDq8ikWAM") -> Tuple[str, int]:
    """Generate audio and return (URL path, emotional score)."""
    return tts_service.generate_emotional_audio(text, voice_id)

# Legacy alias
def text_to_speech(text: str) -> str:
    """Legacy alias for compatibility — returns audio URL only."""
    url, _ = generate_emotional_audio(text)
    return url
