import React from 'react';
import { FileText } from 'lucide-react';

const Instructions = () => (
    <div className="mt-10 bg-gradient-to-br from-[#1a002d] to-[#0d001a] rounded-3xl border border-white/10 p-8 shadow-xl text-white animate-fade-in">
        <div className="flex items-center space-x-3 mb-6">
            <FileText size={24} className="text-blue-400 drop-shadow-md animate-pulse" />
            <h3 className="text-2xl font-bold text-blue-200 tracking-wide">How to Use</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6 text-base text-purple-100">
            <div>
                <h4 className="font-semibold text-white mb-2 text-lg">🎤 Voice Interaction</h4>
                <ul className="space-y-2 list-disc list-inside">
                    <li>Click the microphone to start recording</li>
                    <li>Speak naturally and clearly</li>
                    <li>Click again to stop and send your message</li>
                    <li>The AI will respond with both text and speech</li>
                </ul>
            </div>

            <div>
                <h4 className="font-semibold text-white mb-2 text-lg">📝 Script Generation</h4>
                <ul className="space-y-2 list-disc list-inside">
                    <li>Ask the AI to “generate a script” or “create a play”</li>
                    <li>The AI formats the conversation into a full theatre script</li>
                    <li>A download button appears when the script is ready</li>
                    <li>Scripts follow professional theatre format with scenes/acts</li>
                </ul>
            </div>
        </div>
    </div>
);

export default Instructions;
