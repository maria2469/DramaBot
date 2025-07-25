// src/components/PlaybillCard.jsx
import React from "react";
import { ArrowRight } from "lucide-react";

const PlaybillCard = ({ title, timestamp, mood, summary, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm border border-neutral-200"
        >
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-neutral-800 truncate max-w-[70%]">
                        {title || "Untitled Story"}
                    </h2>
                    <span className="text-xs border border-neutral-400 text-neutral-700 px-2 py-0.5 rounded-full">
                        {mood || "✨ Emotional"}
                    </span>
                </div>
                <p className="text-sm text-neutral-600 line-clamp-2">
                    {summary || "A human-AI co-written story. Click to revisit the vibes."}
                </p>
                <div className="flex justify-between items-center pt-2 text-xs text-neutral-500">
                    <span>{timestamp || "Just now"}</span>
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
};

export default PlaybillCard;
