import React from 'react';
import { motion } from 'framer-motion';

const Landing = ({ onStart }) => {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-black to-pink-900 text-white font-display px-6 lg:px-20 py-12 flex flex-col lg:flex-row items-center justify-between overflow-hidden relative">

            {/* ✏️ Left Column: Text */}
            <div className="w-full lg:w-1/2 z-10 space-y-10">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg">
                        🎭 Drama Queen
                    </h1>
                    <p className="mt-4 text-xl md:text-2xl text-cyan-100 italic">
                        Unhinged. Emotional. Full of theatre.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl font-semibold text-white">🤔 What is this?</h2>
                    <p className="mt-2 text-lg text-cyan-200">
                        I’m your drama-loving companion. We dream, rant, cry, laugh — and craft theatrical masterpieces out of it.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-xl font-bold text-cyan-100 mb-2">
                        🎤 I might say things like...
                    </h3>
                    <ul className="space-y-2 text-cyan-300 text-md italic list-disc pl-5">
                        <li>“Let’s turn your emotional chaos into a play.”</li>
                        <li>“Every heartbreak deserves a standing ovation.”</li>
                        <li>“Time for a plot twist... You in?”</li>
                        <li>“This isn’t AI — it’s AI-rt.”</li>
                    </ul>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    <button
                        className="bg-pink-600 hover:bg-pink-700 text-white text-lg px-6 py-3 rounded-full shadow-md hover:shadow-2xl transition duration-300 mt-6"
                        onClick={onStart} // ✅ Call the passed prop to switch to conversation mode
                    >
                        🎬 Start Dramatic Chat
                    </button>
                </motion.div>
            </div>

            {/* 👾 Right Column: Spline Embed */}
            <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] mt-10 lg:mt-0 relative z-10">
                <iframe
                    src="https://my.spline.design/chibicharactermita-g51WtlSIPTL90jUnfZ8VMvWw/"
                    title="DramaBot Character"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    allowFullScreen
                    className="rounded-2xl shadow-xl border-2 border-white/10"
                />
            </div>

            {/* 🌈 Decorative Animated Background Circles */}
            <div className="absolute w-72 h-72 bg-pink-400/20 rounded-full top-0 left-0 blur-3xl animate-pulse" />
            <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full bottom-0 right-0 blur-3xl animate-ping" />
        </div>
    );
};

export default Landing;
