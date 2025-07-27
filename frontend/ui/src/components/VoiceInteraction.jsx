import React, { useState, useRef } from "react";
import axios from "axios";

const API_BASE = "https://dramabot-production-c295.up.railway.app";

const VoiceInteraction = ({ isMuted, addMessage, setStoryMode, sessionId, setIntensityScore }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const triggerStoryMode = (transcript) => {
        if (!transcript || typeof transcript !== "string") return;
        const lower = transcript.toLowerCase();
        if (lower.includes("write") && (lower.includes("script") || lower.includes("play") || lower.includes("scene"))) {
            setStoryMode(true);
        }
    };

    const toggleRecording = async () => {
        if (!sessionId) {
            addMessage?.({
                type: "error",
                content: "No session ID found.",
                timestamp: new Date().toLocaleTimeString(),
            });
            return;
        }

        if (isRecording) {
            setIsRecording(false);
            if (mediaRecorderRef.current?.state !== "inactive") {
                mediaRecorderRef.current.stop();
            }
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                chunksRef.current = [];

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) chunksRef.current.push(e.data);
                };

                mediaRecorder.onstop = async () => {
                    const blob = new Blob(chunksRef.current, { type: "audio/mp3" });
                    const formData = new FormData();
                    formData.append("file", blob, "input.mp3");
                    formData.append("session_id", sessionId);
                    setIsProcessing(true);

                    try {
                        const res = await axios.post(`${API_BASE}/voice/interact`, formData, {
                            headers: { "Content-Type": "multipart/form-data" },
                        });

                        const { transcript, ai_response, audio_url, timestamp, emotional_score } = res.data;

                        addMessage?.({ type: "user", content: transcript, timestamp });
                        addMessage?.({
                            type: "ai",
                            content: ai_response,
                            audioUrl: `${API_BASE}${audio_url}`,
                            timestamp,
                            intensity: emotional_score?.score || 0,
                        });

                        setIntensityScore?.(Number(emotional_score?.score) || 0);
                        triggerStoryMode(transcript);

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
                        console.error("❌ Voice processing failed:", err);
                        addMessage?.({
                            type: "error",
                            content: "Failed to process audio.",
                            timestamp: new Date().toLocaleTimeString(),
                        });
                    } finally {
                        setIsProcessing(false);
                    }
                };

                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.start();
                setIsRecording(true);

            } catch (err) {
                console.error("🎙️ Microphone access error:", err);
                addMessage?.({
                    type: "error",
                    content: "Microphone access denied or unavailable.",
                    timestamp: new Date().toLocaleTimeString(),
                });
            }
        }
    };

    return (
        <div className="mt-6 flex flex-col items-center">
            <button
                onClick={toggleRecording}
                disabled={isProcessing}
                className={`px-6 py-3 rounded-full text-lg font-bold shadow-xl transition duration-300 ease-in-out
                    ${isRecording ? "bg-red-600 hover:bg-red-700" : "bg-pink-600 hover:bg-pink-700"}
                    ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
                `}
            >
                {isProcessing ? "⏳ Processing..." : isRecording ? "🛑 Stop Talking" : "🎤 Start Voice"}
            </button>
            <p className="text-sm mt-3 text-gray-400 italic">
                {isRecording ? "Listening... press Stop when done." : "Press to record your voice input."}
            </p>
        </div>
    );
};

export default VoiceInteraction;
