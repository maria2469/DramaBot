import React from 'react';
import { MessageCircle, Volume2, VolumeX, Download, RotateCcw } from 'lucide-react';

const Header = ({ isMuted, setIsMuted, scriptAvailable, downloadScript, clearConversation }) => (
    <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <MessageCircle size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Voice Agent</h1>
                        <p className="text-sm text-gray-300">Interactive AI Assistant</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-2 rounded-full transition-all ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>

                    {scriptAvailable && (
                        <button
                            onClick={downloadScript}
                            className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full hover:bg-green-500/30 transition-all"
                        >
                            <Download size={16} />
                            <span>Download Script</span>
                        </button>
                    )}

                    <button
                        onClick={clearConversation}
                        className="flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-full hover:bg-white/20 transition-all"
                    >
                        <RotateCcw size={16} />
                        <span>Clear</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default Header;
