// src/components/PlaybillCard.jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';

const PlaybillCard = ({ title, description, date, genre, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-gradient-to-br from-purple-800 via-fuchsia-900 to-black border border-white/10 rounded-2xl shadow-lg p-5 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
        >
            <h4 className="text-xl font-bold text-pink-300 mb-2">
                {title || 'Untitled Play'}
            </h4>

            <p className="text-sm text-purple-100 mb-4 whitespace-pre-line">
                {description || 'No description available.'}
            </p>

            <div className="flex justify-between items-center text-xs text-purple-400">
                <span>{date || 'Unknown Date'}</span>
                <span className="bg-pink-700/30 px-2 py-1 rounded-md">
                    {genre || 'Drama'}
                </span>
            </div>

            <div className="pt-2 flex justify-end">
                <ArrowRight className="w-4 h-4 text-pink-300" />
            </div>
        </div>
    );
};

export default PlaybillCard;
