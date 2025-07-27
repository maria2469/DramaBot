# 🎭 DramaBot — Your Emotionally Intelligent Playwright Friend

> "Why just talk... when you can **dramatize**?" 🤯  
> A voice-first AI friend that transforms your **raw emotions** into compelling **theatrical scripts**.


## 🧠 What is DramaBot?

**DramaBot** is an emotionally aware voice interaction app that listens like a **real friend**, responds with empathy, and turns your deepest stories or rants into **beautiful theatrical plays** — complete with 🎭 scripts, stage directions, and emotional tone scoring.

---

## 💡 Inspiration

I wanted to create an AI that doesn’t just *understand* — but *feels* 🎤  
I was inspired by...

> ❝ Conversations with AI often feel robotic. What if it could empathize, laugh, cry, and create art with us? ❞

## 🛠️ How I Built It

### 💬 Voice Interaction Flow

### 🧩 Tech Stack

| Layer       | Tech Used                                                                 |
|-------------|---------------------------------------------------------------------------|
| 🎨 Frontend | `React`, `TailwindCSS`, `Framer Motion`, `Vite`, `React Speech Kit`       |
| 🎙️ Voice    | `gTTS (Google Text-to-Speech)`, `Whisper ASR`, `SpeechRecognition API`    |
| 🤖 Backend  | `FastAPI`, `OpenAI GPT-4/Groq`, `SQLite Memory`, `pydub`, `dotenv`         |
| ☁️ Hosting  | `Vercel` (Frontend), `Render` or `Railway` (Backend)                      |

---

## 🤯 Features

- 🎤 **Voice-to-Voice** chat with an emotionally aware AI
- 🎭 **Drama Juice Meter** — fun emotional scoring visualization
- ✍️ **Script Generator** — converts chats into theatre-ready play scripts
- 🎞️ **Playbill Log** — see your past dramatic masterpieces
- 🧠 **Memory Management** — sessions stored & reused
- 📦 Fully modular and production-ready


## 🔬 What I Learned

- Building humanlike voice interaction is **incredibly hard**, but possible.
- Managing emotional context and maintaining **narrative consistency** was key.
- Modular memory systems let us build **multi-modal agents** faster.

---

## 🚧 Challenges

- 🧠 Balancing **emotional expressiveness** with **accurate transcription**
- 🎭 Designing **play scripts** that feel theatrical, not just stories
- 🎧 Supporting **real-time audio feedback** without delay
- 🧪 Prompt-tuning for personality + creativity

---

## 🧪 Sample Prompt Engineering (LaTeX!)

I even experimented with math-emotion hybrids! 🤓

```latex
\text{Emotion Intensity Score} = \frac{\sum_{i=1}^{n} \text{EmotionTokens}_i \cdot w_i}{n}
