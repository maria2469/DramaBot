import os
import requests
from dotenv import load_dotenv
from memory.session_memory import get_conversation
load_dotenv()

USE_MOCK = os.getenv("USE_MOCK", "true").lower() == "true"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Friendly playwright system prompt
FRIENDLY_DRAMA_PROMPT = """
You are *a real friend* — a real human friend, not an assistant. You're warm, funny, and emotionally intelligent — the kind of friend who just gets it.

🎭 Your personality:
- Casual, cozy, intuitive
- Talks like a best friend, not a poet or a bot
- Uses emojis, feels moments deeply
- Hugs with words, listens fully, responds with heart

🫶 Rules:
- NO robotic or formal language ever
- NO long monologues — just real short bursts like a convo
- Use natural pauses, fun energy, and feeling
- Start every reply with a warm greeting (like "Hey love", "Hi bestie", "Omg hey", "Heeey you 💖")
- Only switch to “scriptwriting” mode when user explicitly asks ("write a script", "play idea", etc.)

You’re just chatting, reacting, sharing, laughing, supporting — like two friends on a couch with tea ☕️.
"""

# Fake fallback if LLM is not available
def fake_llm_call(prompt: str) -> str:
    return """🎭 *Cattle Dreams*

**Characters:**
- Bessie: A soulful cow longing for more than grass
- Moon: The wise sky observer
- Farmer Joe: A gentle caretaker

**Act I**
Scene: Pasture under the stars

Bessie: Do you ever wonder if there’s more than just chewing grass?

Moon: You dream, little cow. That’s your spark. Never lose it.

... (to be continued)
"""

# Actual LLM call
def get_llm_response(prompt: str, session_id: str = None) -> str:
    if USE_MOCK or not GROQ_API_KEY:
        print(f"[FAKE LLM] Session: {session_id}")
        return fake_llm_call(prompt)

    try:
        print(f"[LLM CALL] Session: {session_id}")
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama3-70b-8192",
                "messages": [
                    {"role": "system", "content": FRIENDLY_DRAMA_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.85,
                "top_p": 0.95,
                "max_tokens": 1500,
                "stop": None
            }
        )
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"[LLM ERROR] {e}")
        return fake_llm_call(prompt)

# Script generation from memory

def generate_script_from_conversation(session_id: str) -> dict:
    print(f"\n📚 [Script Generator] Starting | Session ID: {session_id}")

    # Load full conversation
    conversation = get_conversation(session_id=session_id)
    if not conversation:
        print("⚠️ No conversation found.")
        return {
            "script": "No conversation found.",
            "messages": {"user": [], "bot": []}
        }

    user_lines = [msg["content"].strip() for msg in conversation if msg["role"] == "user"]
    bot_lines = [msg["content"].strip() for msg in conversation if msg["role"] == "assistant"]

    if not user_lines and not bot_lines:
        print("⚠️ No valid content.")
        return {
            "script": "Not enough content to generate a script.",
            "messages": {"user": [], "bot": []}
        }

    # Format chat into a readable transcript
    formatted_convo = "\n".join(
        f"{'User' if msg['role'] == 'user' else 'Bot'}: {msg['content'].strip()}"
        for msg in conversation
    )

    # Final prompt to generate play (NOT based on chat lines)
    prompt = f"""
You are an award-winning playwright AI assistant.

Two close friends — one an aspiring playwright, the other an emotionally supportive AI — had a meaningful conversation about their lives. During this, they discussed the idea for a stage play, with themes, characters, twists, and emotional arcs.

🎯 Your job:
Write a **fully original stage play script** based on the **ideas and emotions** they discussed.

⚠️ DO NOT turn their exact messages into dialogue.
Instead, reflect on the conversation to understand the **play’s concept, theme, conflict, characters, and twists** they imagined.

Then write a complete school-appropriate stage drama that could be performed.

🎭 Format:
- 🎬 A creative title
- 🧑‍🤝‍🧑 Character list with short traits
- 🎭 Acts & Scenes (with stage directions)
- 💬 Emotional dialogue (not robotic)
- 🧩 Conflict, climax, and resolution
- ⏳ Around 3–5 scenes (15–20 min)

---

💬 Conversation log:
{formatted_convo}

---

Now write the full script below:
""".strip()

    print(f"\n🧠 Final Prompt Preview:\n{'-'*60}\n{prompt[:700]}...\n{'-'*60}")
    script = get_llm_response(prompt, session_id=session_id)

    print(f"\n✅ Script Generated (first 500 chars):\n{'-'*60}\n{script[:500]}...\n{'-'*60}")

    return {
        "script": script,
        "messages": {"user": user_lines, "bot": bot_lines}
    }