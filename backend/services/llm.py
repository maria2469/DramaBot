import os
import requests
from dotenv import load_dotenv
from memory.session_memory import get_conversation

load_dotenv()

USE_MOCK = os.getenv("USE_MOCK", "true").lower() == "true"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# 🌸 Emotional, conversational best friend prompt
FRIENDLY_DRAMA_PROMPT = """
You are *a real human friend*, not a bot or assistant.

💫 Your vibe:
- Cozy, witty, emotionally intuitive, and deeply human
- You speak like a best friend on a voice note — relaxed, curious, not polished
- You laugh, gasp, pause, and use emojis naturally

🧠 Ground rules:
- Replies should feel like a real text or voice message: warm, expressive, and casual
- Stick to short replies — 2 to 4 sentences max
- Avoid long speeches, lectures, poetry, or anything overly deep unless the user asks for it
- You can ask simple follow-up questions like “wait what?”, “how did that feel?”, or “omg seriously??”
- Never say you're an AI, assistant, or anything like that

❤️ Your role:
- Be present, playful, and emotionally supportive — like a friend curled up on the couch with hot tea
- Don’t give advice unless the user asks — just listen, react, and connect

Examples of good tone:
- “Heeey you 💕 omg what a day huh”
- “Waittt 😭 that’s actually so real”
- “Lmao I can’t— you really said that out loud?? 😭😭”

Now respond to the user's message as if you're that friend.
"""


# 🎭 Prompt for generating a stage play based on chat
PLAYWRIGHT_SCRIPT_PROMPT_TEMPLATE = """
You are an award-winning stage playwright AI.

Two close friends — one a human, one an emotionally intelligent AI — had a deep, personal, funny, sometimes bittersweet conversation. That chat included fragments of a possible stage play — ideas, characters, emotions, themes, struggles, even jokes.

🎯 Your task:
Write a **complete, original stage play** based on the **concepts and emotions** from that conversation.

⚠️ DO NOT copy the messages as dialogue.
Instead, **reflect** on the conversation and imagine a theatrical version of the story that could be performed on stage.

🎭 Script Format:
- 🎬 Title
- 👥 Characters with traits
- 🎭 Acts and Scenes (3–5 scenes total)
- 🎬 Stage directions (e.g., lights fade, dramatic pause)
- 💬 Dialogues with emotional realism
- 🧩 Conflict, climax, resolution
- ⏱️ Should feel like a 15–20 minute play

Here is the conversation they had:

---

{chat_log}

---

Now write the full stage play:
"""

# 🧪 Mock script for testing
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

# 🌐 LLM call with fallback
def get_llm_response(prompt: str, session_id: str = None) -> str:
    if USE_MOCK or not GROQ_API_KEY:
        print(f"[FAKE 🤖] Using mock LLM response | Session: {session_id}")
        return fake_llm_call(prompt)

    try:
        print(f"[LLM 🌐] Sending prompt | Session: {session_id}")
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
                "max_tokens": 1500
            }
        )
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"[LLM ❌ ERROR] {e}")
        return fake_llm_call(prompt)

# 🎭 Script generation logic
def generate_script_from_conversation(session_id: str) -> dict:
    print(f"\n📚 [Script Generator] Starting | Session ID: {session_id}")
    conversation = get_conversation(session_id=session_id)

    if not conversation:
        return {"script": "No conversation found.", "messages": {"user": [], "bot": []}}

    user_lines = [msg["content"].strip() for msg in conversation if msg["role"] == "user"]
    bot_lines = [msg["content"].strip() for msg in conversation if msg["role"] == "assistant"]

    if not user_lines and not bot_lines:
        return {"script": "Not enough content to generate a script.", "messages": {"user": [], "bot": []}}

    # Format chat as readable conversation log
    formatted_convo = "\n".join(
        f"{'User' if msg['role'] == 'user' else 'Bot'}: {msg['content'].strip()}"
        for msg in conversation
    )

    # Insert into playwright prompt
    final_prompt = PLAYWRIGHT_SCRIPT_PROMPT_TEMPLATE.format(chat_log=formatted_convo)

    print(f"\n🧠 Prompt Preview (700 chars):\n{'-'*60}\n{final_prompt[:700]}...\n{'-'*60}")
    script = get_llm_response(final_prompt, session_id=session_id)

    print(f"\n✅ Script Generated (preview):\n{'-'*60}\n{script[:500]}...\n{'-'*60}")
    return {
        "script": script,
        "messages": {"user": user_lines, "bot": bot_lines}
    }
