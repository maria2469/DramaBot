"""
# DramaBot Backend 🎭
FastAPI backend for the AI-powered Theatre Script Generator.

## Endpoints
- `POST /chat/`: Discuss the story with your AI drama friend
- `POST /script/`: Generate full theatrical script
- `POST /voice/speak`: Convert text to emotional voice
- `POST /voice/transcribe`: Turn voice into text (Whisper)

## Run Locally
```bash
uvicorn main:app --reload
```

## Dependencies
- fastapi
- openai
- pydantic
- uvicorn
- aiohttp