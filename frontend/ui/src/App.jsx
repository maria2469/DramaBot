import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Conversation from './components/Conversation';
import Instructions from './components/Instructions';
import VoiceInteraction from './components/VoiceInteraction';
import PlaybillCard from './components/PlaybillCard';
import GenerateScript from './components/GenerateScript';
import Landing from './components/Landing';
import DramaJuiceMeter from './components/DramaJuiceMeter';

import './App.css';

const App = () => {
  const [scriptAvailable, setScriptAvailable] = useState(false);
  const [scriptText, setScriptText] = useState('');
  const [conversation, setConversation] = useState([]);
  const [playbills, setPlaybills] = useState([]);
  const [started, setStarted] = useState(false);
  const [storyMode, setStoryMode] = useState(false);
  const [latestEmotionScore, setLatestEmotionScore] = useState(0);

  const sessionRef = useRef(crypto.randomUUID());
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

  const saveScriptToPlaybills = () => {
    if (!scriptText) return;

    const titleMatch = scriptText.match(/\*\*Title:\*\*\s*"(.*?)"/);
    const title = titleMatch ? titleMatch[1].trim() : `Play ${playbills.length + 1}`;

    const charactersMatch = scriptText.match(/\*\*Characters:\*\*\s*\n\n([\s\S]*?)\n\n/i);
    let description = charactersMatch
      ? charactersMatch[1]
        .replace(/\*\*(.*?)\*\*: /g, '$1: ')
        .trim()
        .split('\n')
        .slice(0, 3)
        .join('\n')
      : 'No description available.';

    const newPlay = {
      title,
      description,
      date: new Date().toLocaleDateString(),
      genre: 'Drama',
      script: scriptText,
    };

    setPlaybills((prev) => [newPlay, ...prev]);
  };

  const clearConversation = () => {
    setConversation([]);
    setScriptAvailable(false);
    setScriptText('');
  };

  const addMessageToConversation = (message) => {
    if (message?.content) {
      setConversation((prev) => [...prev, message]);
    }
  };

  if (!started) {
    return <Landing onStart={() => setStarted(true)} />;
  }

  return (
    <div className="relative min-h-screen w-full text-white overflow-x-hidden">
      {/* 🎨 Background Animation */}
      <iframe
        src="https://my.spline.design/particleswithcolorshiftbackground-zTb4huISTDkFlWHn45oX068O/"
        className="fixed top-0 left-0 w-full h-full z-0"
        frameBorder="0"
        title="Animated Background"
      ></iframe>

      {/* 🌌 Foreground Content */}
      <div className="relative z-10 min-h-screen w-full">
        <Header
          scriptAvailable={scriptAvailable}
          downloadScript={downloadScript}
          clearConversation={clearConversation}
        />

        <main className="flex-grow max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
          {/* 🎭 Past Plays */}
          {playbills.length > 0 && (
            <section className="rounded-2xl p-6 border border-white/20 shadow-lg bg-black">
              <h3 className="text-2xl font-bold text-pink-300 mb-4">🎭 Your Past Plays</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {playbills.map((pb, idx) => (
                  <PlaybillCard
                    key={idx}
                    title={pb.title}
                    description={pb.description}
                    date={pb.date}
                    genre={pb.genre}
                    onClick={() => alert(`Viewing: ${pb.title}`)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 🗣️ Conversation Area + Juice Meter Inside Scrollable Layout */}
          <section className="rounded-3xl p-6 shadow-lg text-white bg-gradient-to-br from-[#1a002d] to-[#0d001a] border border-white/10">
            <h3 className="text-xl font-semibold text-purple-200 mb-4">🗣️ Ongoing Conversation</h3>

            {/* Conversation + Drama Meter side-by-side */}
            <div className="flex flex-col lg:flex-row gap-6 max-h-[500px] overflow-y-auto pr-2">

              {/* 🧪 Drama Juice Meter - sticky inside scroll area */}
              <div className="lg:w-1/4 w-full sticky top-0 z-10">
                <DramaJuiceMeter score={latestEmotionScore} />
              </div>

              {/* 💬 Scrollable Conversation */}
              <div className="lg:w-3/4 w-full space-y-4">
                <Conversation conversation={conversation} />
              </div>
            </div>

            {/* 🎤 Voice Interaction - below conversation */}
            <div className="mt-6">
              <VoiceInteraction
                addMessage={addMessageToConversation}
                sessionId={sessionId}
                setStoryMode={setStoryMode}
                setIntensityScore={setLatestEmotionScore}
              />
            </div>
          </section>



          {/* 🎬 Generate Script */}
          <section className="rounded-2xl border border-white/10 p-6 shadow-inner bg-transparent">
            <GenerateScript
              sessionId={sessionId}
              setScriptText={setScriptText}
              setScriptAvailable={setScriptAvailable}
            />
          </section>

          {/* 📜 Display Script */}
          {scriptAvailable && scriptText && (
            <section className="border border-white/20 rounded-2xl p-6 shadow-lg bg-transparent">
              <h3 className="text-2xl font-bold text-black mb-4">🎬 Generated Script</h3>
              <div className="max-h-96 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed p-4 rounded-lg text-purple-100 font-mono bg-black">
                <pre>{scriptText}</pre>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={downloadScript}
                  className="relative group bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-pink-700 hover:to-purple-700 transition-all duration-300 px-6 py-3 rounded-xl text-white font-bold shadow-lg"
                >
                  <span className="relative z-10">⬇️ Download Script</span>
                  <span className="absolute inset-0 rounded-xl opacity-50 group-hover:opacity-80 blur-lg bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 transition duration-500 animate-pulse"></span>
                </button>

                <button
                  onClick={saveScriptToPlaybills}
                  className="relative group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 px-6 py-3 rounded-xl text-white font-bold shadow-lg"
                >
                  <span className="relative z-10">💾 Save Script</span>
                  <span className="absolute inset-0 rounded-xl opacity-50 group-hover:opacity-80 blur-lg bg-green-500 transition duration-500 animate-pulse"></span>
                </button>
              </div>
            </section>
          )}

          {/* 📖 Instructions */}
          <section className="rounded-xl border border-white/10 p-6 shadow-inner bg-transparent">
            <Instructions />
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
