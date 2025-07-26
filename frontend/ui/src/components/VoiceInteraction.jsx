import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

// ✅ Use deployed Railway API
const API_BASE = "https://dramabot-production-c295.up.railway.app";

const VoiceInteraction = ({ isMuted, addMessage, setStoryMode, sessionId }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const triggerStoryMode = (transcript) => {
        if (!transcript || typeof transcript !== "string") return;
        const lower = transcript.toLowerCase();
        if (lower.includes("write") && (lower.includes("script") || lower.includes("play") || lower.includes("scene"))) {
            console.log("🎭 Detected story mode prompt!");
            setStoryMode(true);
        }
    };

    const toggleRecording = async () => {
        if (!sessionId) {
            console.error("❌ No session ID — cannot record.");
            addMessage({ type: "error", content: "No session ID found.", timestamp: new Date().toLocaleTimeString() });
            return;
        }

        if (isRecording) {
            console.log("🛑 Stopping recording...");
            setIsRecording(false);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                mediaRecorderRef.current.stop();
            }
        } else {
            console.log("🎙️ Starting recording...");
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                chunksRef.current = [];

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        chunksRef.current.push(e.data);
                        console.log("📦 Collected audio chunk:", e.data.size, "bytes");
                    }
                };

                mediaRecorder.onstop = async () => {
                    console.log("📥 Recording stopped. Sending audio to backend...");
                    const blob = new Blob(chunksRef.current, { type: "audio/mp3" });
                    const formData = new FormData();
                    formData.append("file", blob, "input.mp3");
                    formData.append("session_id", sessionId);

                    setIsProcessing(true);

                    try {
                        const res = await axios.post(`${API_BASE}/voice/interact`, formData, {
                            headers: { "Content-Type": "multipart/form-data" },
                        });

                        const { user_input, ai_response, audio_url, timestamp } = res.data;

                        console.log("✅ Received AI response:", ai_response);
                        console.log("🔊 Audio URL:", audio_url);

                        triggerStoryMode(user_input);

                        addMessage({ type: "user", content: user_input, timestamp });
                        addMessage({ type: "ai", content: ai_response, audioUrl: `${API_BASE}${audio_url}`, timestamp });

                        if (currentAudio) {
                            currentAudio.pause();
                            currentAudio.currentTime = 0;
                        }

                        if (!isMuted && audio_url) {
                            const audio = new Audio(`${API_BASE}${audio_url}`);
                            audio.play();
                            setCurrentAudio(audio);
                        }
                    } catch (err) {
                        console.error("❌ API error:", err);
                        addMessage({
                            type: "error",
                            content: "Failed to process audio.",
                            timestamp: new Date().toLocaleTimeString()
                        });
                    } finally {
                        setIsProcessing(false);
                    }
                };

                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.start();
                setIsRecording(true);
                console.log("⏺️ MediaRecorder started.");
            } catch (err) {
                console.error("❌ Microphone access denied:", err);
                addMessage({
                    type: "error",
                    content: "Microphone access denied.",
                    timestamp: new Date().toLocaleTimeString()
                });
            }
        }
    };

    return (
        <div className="mt-4 flex flex-col items-center">
            <button
                onClick={toggleRecording}
                disabled={isProcessing}
                className={`px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition-all duration-300 
                    ${isRecording ? "bg-red-600 hover:bg-red-700" : "bg-purple-700 hover:bg-purple-800"} 
                    ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                {isProcessing
                    ? "⏳ Processing..."
                    : isRecording
                        ? "🛑 Stop Recording"
                        : "🎙️ Start Talking"}
            </button>
            <p className="text-sm mt-3 text-gray-400">
                {isRecording
                    ? "Recording... speak clearly and press Stop when done."
                    : "Click to start recording your thoughts."}
            </p>
        </div>
    );
};

export default VoiceInteraction;
