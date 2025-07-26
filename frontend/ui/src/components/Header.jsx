import React from 'react';
import { MessageCircle, Volume2, VolumeX, Download, RotateCcw } from 'lucide-react';

const Header = ({ isMuted, setIsMuted, scriptAvailable, downloadScript, clearConversation }) => (
    <div className="bg-gradient-to-r from-purple-800/60 to-indigo-800/60 border-b border-white/10 shadow-md transition-all duration-700 ease-in-out">
        <div className="max-w-6xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
                {/* Logo & Title */}
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <MessageCircle size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-wide">Drama Queen</h1>
                        <p className="text-sm text-gray-300">Your Emotional AI Playwright 🎭</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                    {/* Mute Toggle */}
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 shadow-md 
                            ${isMuted
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-600/40'
                                : 'bg-blue-500/20 text-blue-300 hover:bg-blue-600/40'
                            }`}
                        title={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>

                    {/* Download Script */}
                    {scriptAvailable && (
                        <button
                            onClick={downloadScript}
                            className="flex items-center space-x-2 bg-green-600/20 text-green-300 px-4 py-2 rounded-full hover:bg-green-600/40 transition-all duration-300 transform hover:scale-105 shadow-md"
                        >
                            <Download size={16} />
                            <span>Download Script</span>
                        </button>
                    )}

                    {/* Clear Button */}
                    <button
                        onClick={clearConversation}
                        className="flex items-center space-x-2 bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full hover:bg-yellow-500/40 transition-all duration-300 transform hover:scale-105 shadow-md"
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
