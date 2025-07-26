import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Conversation from './components/Conversation';
import Instructions from './components/Instructions';
import VoiceInteraction from './components/VoiceInteraction';
import PlaybillCard from './components/PlayBillCard';
import GenerateScript from './components/GenerateScript';
import Landing from './components/Landing';

import './App.css';

const App = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [scriptAvailable, setScriptAvailable] = useState(false);
  const [scriptText, setScriptText] = useState('');
  const [conversation, setConversation] = useState([]);
  const [playbills, setPlaybills] = useState([]);
  const [started, setStarted] = useState(false);

  const sessionRef = useRef(null);
  if (!sessionRef.current) {
    sessionRef.current = crypto.randomUUID();
    console.log('🆕 Generated new Session ID:', sessionRef.current);
  } else {
    console.log('📌 Reusing existing Session ID:', sessionRef.current);
  }
  const sessionId = sessionRef.current;

  useEffect(() => {
    document.body.style.overflow = started ? 'auto' : 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [started]);

  const downloadScript = () => {
    if (!scriptText) return;
    const blob = new Blob([scriptText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theatrical_script.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearConversation = () => {
    setConversation([]);
    setScriptAvailable(false);
    setScriptText('');
  };

  const addMessageToConversation = (message) => {
    if (!message || !message.content) return;
    setConversation((prev) => [...prev, message]);
  };

  if (!started) {
    return <Landing onStart={() => setStarted(true)} />;
  }

  return (
    <div className="relative min-h-screen w-full text-white overflow-x-hidden">
      {/* 🎨 3D Background */}
      <iframe
        src="https://my.spline.design/particleswithcolorshiftbackground-zTb4huISTDkFlWHn45oX068O/"
        className="fixed top-0 left-0 w-full h-full z-0"
        frameBorder="0"
        title="Animated Background"
      ></iframe>

      {/* 🌌 Foreground Content */}
      <div className="relative z-10 min-h-screen w-full">
        <Header
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          scriptAvailable={scriptAvailable}
          downloadScript={downloadScript}
          clearConversation={clearConversation}
        />

        <main className="flex-grow max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
          {playbills.length > 0 && (
            <section className="rounded-2xl p-6 border border-white/20 shadow-lg bg-transparent">
              <h3 className="text-2xl font-bold text-pink-300 mb-4">🎭 Your Past Plays</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {playbills.map((pb, idx) => (
                  <PlaybillCard key={idx} {...pb} />
                ))}
              </div>
            </section>
          )}

          <section className="rounded-3xl p-6 shadow-lg text-white bg-gradient-to-br from-[#1a002d] to-[#0d001a] border border-white/10">
            <h3 className="text-xl font-semibold text-purple-200 mb-2">🗣️ Ongoing Conversation</h3>
            <Conversation conversation={conversation} />
            <VoiceInteraction
              isMuted={isMuted}
              addMessage={addMessageToConversation}
              sessionId={sessionId}
            />
          </section>

          <section className="rounded-2xl border border-white/10 p-6 shadow-inner bg-transparent">
            <GenerateScript
              sessionId={sessionId}
              setScriptText={setScriptText}
              setScriptAvailable={setScriptAvailable}
            />
          </section>

          {scriptAvailable && scriptText && (
            <section className="border border-white/20 rounded-2xl p-6 shadow-lg bg-transparent">
              <h3 className="text-2xl font-bold text-black mb-4">🎬 Generated Script</h3>
              <div className="max-h-96 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed p-4 rounded-lg text-purple-100 font-mono bg-black">
                <pre>{scriptText}</pre>
              </div>
              <button
                onClick={downloadScript}
                className="mt-4 relative group bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-pink-700 hover:to-purple-700 transition-all duration-300 px-6 py-3 rounded-xl text-white font-bold shadow-lg"
              >
                <span className="relative z-10">⬇️ Download Script</span>
                <span className="absolute inset-0 rounded-xl opacity-50 group-hover:opacity-80 blur-lg bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 transition duration-500 animate-pulse"></span>
              </button>
            </section>
          )}

          <section className="rounded-xl border border-white/10 p-6 shadow-inner bg-transparent">
            <Instructions />
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
