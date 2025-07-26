import sqlite3
import time
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "session_memory.db"

# === Initialize the memory DB ===
def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS memory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT,
                role TEXT,
                content TEXT,
                timestamp REAL
            )
        ''')
        conn.commit()

# === Add a message to memory ===
def add_to_memory(session_id: str, role: str, message: str):
    timestamp = time.time()
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            "INSERT INTO memory (session_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
            (session_id, role, message, timestamp)
        )
        conn.commit()

# === Get all messages for a session ===
def get_conversation(session_id: str):
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.execute('''
            SELECT role, content FROM memory
            WHERE session_id = ?
            ORDER BY timestamp ASC
        ''', (session_id,))
        return [{"role": row[0], "content": row[1]} for row in cursor.fetchall()]

# === Get memory stats ===
def get_memory_stats(session_id: str) -> dict:
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.execute("SELECT COUNT(*) FROM memory WHERE session_id = ?", (session_id,))
        message_count = cursor.fetchone()[0]
        return {
            "session_id": session_id,
            "message_count": message_count
        }

# === Dump memory (for debugging/logging elsewhere) ===
def dump_memory(session_id: str):
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.execute("SELECT * FROM memory WHERE session_id = ?", (session_id,))
        return cursor.fetchall()

# === Delete memory for a session ===
def delete_memory(session_id: str) -> bool:
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.execute('DELETE FROM memory WHERE session_id = ?', (session_id,))
        conn.commit()
        return cursor.rowcount > 0

# Initialize DB on import
init_db()
