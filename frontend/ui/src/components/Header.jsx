import React from 'react';
import { MessageCircle, RotateCcw } from 'lucide-react';

const Header = ({ clearConversation }) => {
    return (
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

                    {/* Clear Button Only */}
                    <div className="flex items-center space-x-3">
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
};

export default Header;
