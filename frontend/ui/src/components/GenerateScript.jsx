import React, { useState } from 'react';
import axios from 'axios';

// 🌐 Automatically switch between local and deployed backend
const API_BASE =
    window.location.hostname === 'localhost'
        ? 'http://localhost:8000'
        : 'https://dramabot-production-c295.up.railway.app';

const GenerateScript = ({ sessionId, setScriptText, setScriptAvailable }) => {
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!sessionId) {
            
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(`${API_BASE}/script/generate`, {
                session_id: sessionId,
            });

            const { script, error } = res.data;

            if (error || !script) {
                
                setScriptText("❌ Script generation failed. Please try again.");
                setScriptAvailable(false);
            } else {
                
                setScriptText(script);
                setScriptAvailable(true);
            }

        } catch (err) {
            
            setScriptText("❌ Error generating script.");
            setScriptAvailable(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-6 mx-auto max-w-xl p-6 bg-gradient-to-br from-[#1a002d] to-[#0d001a] shadow-lg rounded-3xl text-white">
            <div className="text-center">
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-md transition-all"
                >
                    {loading ? "🎭 Generating Script..." : "📝 Generate Theatre Script"}
                </button>
            </div>
        </div>
    );
};

export default GenerateScript;
