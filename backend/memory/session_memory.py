import sqlite3
import time
from pathlib import Path
import os

DB_PATH = Path(__file__).resolve().parent.parent / "session_memory.db"

print(f"📁 Using DB path: {os.path.abspath(DB_PATH)}")


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
print("🔍 DB PATH USED:", DB_PATH)

def add_to_memory(session_id: str, role: str, message: str):
    timestamp = time.time()
    try:
        print(f"🧠 Inserting into memory: Session={session_id}, Role={role}, Msg='{message}'")
        with sqlite3.connect(DB_PATH) as conn:
            conn.execute(
                "INSERT INTO memory (session_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
                (session_id, role, message, timestamp)
            )
            conn.commit()
        print("✅ Memory insertion successful.")
    except Exception as e:
        print(f"❌ Memory insertion failed: {e}")



# === Get all messages for a session ===
def get_conversation(session_id: str):
    print(f"📚 Fetching conversation for session: {session_id}")
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.execute('''
            SELECT role, content FROM memory
            WHERE session_id = ?
            ORDER BY timestamp ASC
        ''', (session_id,))
        messages = [{"role": row[0], "content": row[1]} for row in cursor.fetchall()]
        print(f"📨 Retrieved {len(messages)} messages.")
        return messages


# === Get memory stats ===
print("🔍 DB PATH USED:", DB_PATH)

def get_memory_stats(session_id: str) -> dict:
    print(f"📊 Getting memory stats for session: {session_id}")
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM memory WHERE session_id = ?", (session_id,))
        message_count = cursor.fetchone()[0]
    print(f"📈 Message count: {message_count}")
    return {
        "session_id": session_id,
        "message_count": message_count
    }


# === Delete memory for a session ===
print("🔍 DB PATH USED:", DB_PATH)
def dump_memory(session_id: str):
    print(f"📦 Dumping all memory entries for session: {session_id}")
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.execute("SELECT * FROM memory WHERE session_id = ?", (session_id,))
        rows = cursor.fetchall()
        for row in rows:
            print(row)

def delete_memory(session_id: str):
    print(f"🗑️ Deleting memory for session: {session_id}")
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.execute('DELETE FROM memory WHERE session_id = ?', (session_id,))
        conn.commit()
        success = cursor.rowcount > 0
        print("✅ Deletion successful." if success else "⚠️ No memory found to delete.")
        return success


# Initialize the table when imported
init_db()
