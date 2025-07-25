import React from 'react';
import { FileText } from 'lucide-react';

const Instructions = () => (
    <div className="mt-8 bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
        <div className="flex items-center space-x-2 mb-4">
            <FileText size={20} className="text-blue-400" />
            <h3 className="text-lg font-semibold">How to Use</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
                <h4 className="font-medium text-white mb-2">Voice Interaction</h4>
                <ul className="space-y-1">
                    <li>• Click the microphone to start recording</li>
                    <li>• Speak naturally and clearly</li>
                    <li>• Click again to stop and send your message</li>
                    <li>• The AI will respond with both text and speech</li>
                </ul>
            </div>
            <div>
                <h4 className="font-medium text-white mb-2">Script Generation</h4>
                <ul className="space-y-1">
                    <li>• Ask the AI to "generate a script" or "create a script"</li>
                    <li>• The AI will format your conversation as a script</li>
                    <li>• Download button will appear when script is ready</li>
                    <li>• Scripts are saved in standard theatrical format</li>
                </ul>
            </div>
        </div>
    </div>
);

export default Instructions;
