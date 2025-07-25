import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const GenerateScript = ({ sessionId, setScriptText, setScriptAvailable }) => {
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!sessionId) {
            console.error("❌ Session ID missing. Cannot generate script.");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(`${API_BASE}/script/generate`, {
                session_id: sessionId,
            });

            const { script, error } = res.data;

            if (error || !script) {
                console.error("❌ Script generation failed or returned empty:", error);
                setScriptText("❌ Script generation failed. Please try again.");
                setScriptAvailable(false);
            } else {
                console.log("✅ Full script received:", script.slice(0, 500)); // preview
                setScriptText(script);
                setScriptAvailable(true);
            }

        } catch (err) {
            console.error("❌ API error during script generation:", err);
            setScriptText("❌ Error generating script.");
            setScriptAvailable(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-4 text-center">
            <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-md transition-all"
            >
                {loading ? "🎭 Generating Script..." : "📝 Generate Theatre Script"}
            </button>
        </div>
    );
};

export default GenerateScript;
