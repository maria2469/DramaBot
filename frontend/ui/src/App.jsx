import React, { useState, useRef } from 'react';
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
    <div className="min-h-screen w-full text-white flex flex-col bg-black">
      {/* 🌄 Header with 3D Animation */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        <iframe
          src="https://my.spline.design/lostorbinthemountains-wnWOlt4g3IL2NMcmBdIw4gZX/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="absolute top-0 left-0 w-full h-full z-0"
          title="3D Hero Animation"
        />
        <div className="absolute top-0 left-0 w-full h-full z-10 bg-black/30 flex items-center justify-center">
          <Header
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            scriptAvailable={scriptAvailable}
            downloadScript={downloadScript}
            clearConversation={clearConversation}
          />
        </div>
      </div>

      {/* 📜 Main Content */}
      <div className="flex-grow max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
        {playbills.length > 0 && (
          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <h3 className="text-2xl font-bold text-pink-300 mb-4">🎭 Your Past Plays</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {playbills.map((pb, idx) => (
                <PlaybillCard key={idx} {...pb} />
              ))}
            </div>
          </section>
        )}

        <section className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-inner">
          <h3 className="text-xl font-semibold text-purple-200 mb-2">🗣️ Ongoing Conversation</h3>
          <Conversation conversation={conversation} />
          <VoiceInteraction
            isMuted={isMuted}
            addMessage={addMessageToConversation}
            sessionId={sessionId}
          />
        </section>

        <section className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-inner">
          <GenerateScript
            sessionId={sessionId}
            setScriptText={setScriptText}
            setScriptAvailable={setScriptAvailable}
          />
        </section>

        {scriptAvailable && scriptText && (
          <section className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-indigo-300 mb-4">🎬 Generated Script</h3>
            <div className="max-h-96 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed p-4 bg-black/30 rounded-lg text-purple-100 font-mono">
              <pre>{scriptText}</pre>
            </div>
            <button
              onClick={downloadScript}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2 rounded-xl text-white font-semibold shadow-md"
            >
              ⬇️ Download Script
            </button>
          </section>
        )}

        <section className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-inner">
          <Instructions />
        </section>
      </div>
    </div>
  );
};

export default App;
