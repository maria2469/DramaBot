import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const getJuiceLevel = (score) => {
    if (score >= 7) return { level: 'overflowing', icon: '🔥', color: 'bg-red-500' };
    if (score >= 2) return { level: 'bubbling', icon: '💧', color: 'bg-blue-400' };
    return { level: 'empty', icon: '🫙', color: 'bg-gray-300' };
};

const DramaJuiceMeter = ({ score = 0 }) => {
    const { level, icon, color } = getJuiceLevel(score);
    const fillHeight = Math.min(10, score); // clamp to 10% for height usage

    // Optional: Scroll effect (translateY)
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 300], [0, -20]);

    return (
        <motion.div
            className="flex flex-col items-center gap-2 mt-4"
            style={{ y }} // scroll parallax
        >
            <div className="text-xl font-bold text-purple-200">🧪 DRAMA JUICE</div>

            <div className="relative w-14 h-40 border-4 border-purple-700 rounded-b-full overflow-hidden bg-gray-100">
                <motion.div
                    className={`absolute bottom-0 w-full ${color}`}
                    style={{ height: `${fillHeight * 10}%` }}
                    animate={{ height: `${fillHeight * 10}%` }}
                    transition={{ duration: 0.6 }}
                />
                {icon && (
                    <motion.div
                        className="absolute top-1/2 left-1/2 text-3xl"
                        style={{ transform: 'translate(-50%, -50%)' }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    >
                        {icon}
                    </motion.div>
                )}
            </div>

            <div className="text-sm text-purple-200">
                {level.toUpperCase()} — {score}/10
            </div>
        </motion.div>
    );
};

export default DramaJuiceMeter;
