import React from 'react';
import { Mic, MicOff, Loader2, Play, Pause } from 'lucide-react';

const VoiceControls = ({ isRecording, isProcessing, startRecording, stopRecording, togglePlayPause, isPlaying, audioLevel }) => (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10">
        <div className="p-8">
            <div className="text-center">
                <div className="relative inline-block">
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isProcessing}
                        className={`relative w-24 h-24 rounded-full transition-all duration-300 ${isRecording ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/50'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isProcessing ? (
                            <Loader2 size={32} className="animate-spin mx-auto" />
                        ) : isRecording ? (
                            <MicOff size={32} className="mx-auto" />
                        ) : (
                            <Mic size={32} className="mx-auto" />
                        )}
                    </button>
                </div>

                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">{isProcessing ? 'Processing...' : isRecording ? 'Listening...' : 'Tap to speak'}</h3>
                    <p className="text-gray-400 text-sm">
                        {isProcessing ? 'Converting speech and generating response' : isRecording ? 'Speak naturally, tap again to stop' : 'Hold a conversation with the AI agent'}
                    </p>
                </div>

                {audioLevel > 0 && (
                    <div className="relative mt-4 w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-100 ${audioLevel < 0.1 ? 'bg-green-400' : audioLevel < 0.5 ? 'bg-yellow-400' : 'bg-red-400'}`}
                            style={{ width: `${audioLevel * 100}%` }}
                        />
                    </div>
                )}

                {audioLevel <= 0 && <p className="text-sm text-gray-400 mt-2">Waiting for input...</p>}
            </div>

            {isPlaying && (
                <div className="mt-6 flex items-center justify-center space-x-4">
                    <button
                        onClick={togglePlayPause}
                        className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all"
                    >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        <span>{isPlaying ? 'Pause' : 'Play'} Response</span>
                    </button>
                </div>
            )}
        </div>
    </div>
);

export default VoiceControls;
