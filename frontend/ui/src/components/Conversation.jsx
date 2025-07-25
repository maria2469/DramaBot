import React, { useEffect, useRef } from 'react';
import { MessageCircle, Play, Sparkles } from 'lucide-react';

const Conversation = ({ conversation, playAudio }) => {
    const endRef = useRef(null);

    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversation]);

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-purple-300/10 shadow-lg p-6 max-h-[80vh] overflow-y-auto w-full lg:w-[90%] mx-auto mt-4">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
                <MessageCircle className="text-purple-300 animate-pulse" size={22} />
                <h2 className="text-xl font-bold text-white tracking-wide">Our Chat 🧠</h2>
            </div>

            {/* Messages */}
            <div className="space-y-5">
                {conversation.length === 0 ? (
                    <div className="text-center py-12 text-purple-300/60">
                        <MessageCircle size={48} className="mx-auto mb-4 opacity-40 animate-bounce" />
                        <p className="text-lg italic">Start talking! I don’t bite... probably 🐭🎤</p>
                    </div>
                ) : (
                    conversation.map((message, index) => {
                        const isUser = message.type === 'user';
                        const isAI = message.type === 'ai';
                        const isError = message.type === 'error';

                        const bgClass = isUser
                            ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white'
                            : isError
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : 'bg-gradient-to-br from-purple-800/40 to-black/20 text-white backdrop-blur-md';

                        const bubbleAlignment = isUser ? 'justify-end' : 'justify-start';
                        const bubbleRounded = isUser ? 'rounded-br-none' : 'rounded-bl-none';

                        return (
                            <div key={index} className={`flex ${bubbleAlignment}`}>
                                <div className={`relative max-w-sm lg:max-w-md px-5 py-4 rounded-3xl ${bubbleRounded} ${bgClass} shadow-md`}>

                                    {/* Tone / Emotion label */}
                                    {message.tone && (
                                        <div className="absolute -top-3 left-0 bg-purple-500/80 text-xs px-3 py-1 rounded-full text-white shadow-md flex items-center gap-1">
                                            <Sparkles size={12} className="text-yellow-300" />
                                            <span>{message.tone}</span>
                                        </div>
                                    )}

                                    {/* Story mode label */}
                                    {message.mode === 'story' && (
                                        <p className="text-xs italic mb-1 text-purple-300">🎭 Script Mode</p>
                                    )}

                                    {/* Message content */}
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between mt-3 text-xs text-purple-200">
                                        <span>{message.timestamp || ''}</span>
                                        {message.audioUrl && isAI && (
                                            <button
                                                onClick={() => playAudio(message.audioUrl)}
                                                className="p-1 rounded-full hover:bg-white/20 transition duration-200"
                                                aria-label="Play audio"
                                            >
                                                <Play size={16} className="text-white" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Scroll anchor */}
                <div ref={endRef} />
            </div>
        </div>
    );
};

export default Conversation;
