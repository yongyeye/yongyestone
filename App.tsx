
import React, { useState } from 'react';
import BladeCursor from './components/BladeCursor';
import ScissorTrail from './components/ScissorTrail';
import StoneVeins from './components/StoneVeins';
import Sidebar from './components/Sidebar';
import ArtworkCard from './components/ArtworkCard';
import Intro from './components/Intro'; // Import Intro
import { chatWithSlab } from './services/geminiService';
import { Artwork, ChatMessage, SectionId } from './types';

// Mock Data
const artworks: Artwork[] = [
  { id: 1, serial: "FRAG-01", title: "Erosion", type: "Mixed Media", desc: "A study of wind wearing down granite over a millennia.", image: "https://picsum.photos/800/1000?grayscale" },
  { id: 2, serial: "FRAG-02", title: "Stasis", type: "Oil on Slate", desc: "A moment frozen in amber and dust.", image: "https://picsum.photos/801/1001?grayscale" },
  { id: 3, serial: "FRAG-03", title: "Fissure", type: "Photography", desc: "The exact moment the structure failed.", image: "https://picsum.photos/802/1002?grayscale" },
  { id: 4, serial: "FRAG-04", title: "Sediment", type: "Digital Scan", desc: "Layers of forgotten history compressed.", image: "https://picsum.photos/803/1003?grayscale" },
];

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('gallery');
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'ai', text: 'The stone is listening...' }]);
  const [chatLoading, setChatLoading] = useState(false);
  const [introDone, setIntroDone] = useState(false); // State for intro completion

  const handleChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    
    const userQ = chatInput;
    setChatInput("");
    setChatLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: userQ }]);

    const answer = await chatWithSlab(userQ);
    setMessages(prev => [...prev, { role: 'ai', text: answer }]);
    setChatLoading(false);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-2 md:p-8 lg:p-12 bg-stone-200 overflow-hidden">
      <Intro onComplete={() => setIntroDone(true)} />
      
      <BladeCursor />
      <ScissorTrail />

      {/* Main Slab Container - Added transition for entrance effect */}
      <div 
        className={`relative w-full max-w-[1600px] h-full md:h-[90vh] stone-texture rounded-sm shadow-[20px_20px_60px_rgba(0,0,0,0.3),-20px_-20px_60px_rgba(255,255,255,0.5)] flex overflow-hidden border border-white/20 rough-edge transition-all duration-[2000ms] ease-out ${
          introDone ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        
        {/* Background Effects */}
        <StoneVeins />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/10 via-transparent to-black/20 z-10 mix-blend-overlay"></div>

        {/* Layout */}
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

        {/* Scrollable Content Area */}
        <main className="flex-1 h-full overflow-y-auto custom-scrollbar relative z-10 bg-stone-100/5">
          <div className="min-h-full p-8 md:p-16 pb-32">
            
            {/* Header Section */}
            <header className="mb-16 border-b border-stone-600/20 pb-8 relative">
              <h2 className="text-6xl md:text-9xl font-bold text-stone-600/5 absolute -top-6 md:-top-12 -left-4 select-none z-0 engraved-text uppercase">
                {activeSection}
              </h2>
              <h2 className="text-3xl md:text-4xl font-serif text-stone-800 relative z-10 engraved-text pl-2">
                {activeSection === 'gallery' && 'Recovered Artifacts'}
                {activeSection === 'about' && 'Excavation Log'}
                {activeSection === 'statement' && 'Stone Inscription'}
              </h2>
            </header>

            {/* Content Switching */}
            <div className="animate-fade-in">
              {activeSection === 'gallery' && (
                <div className="columns-1 md:columns-2 lg:columns-2 gap-12 space-y-12 pr-4">
                  {artworks.map(work => <ArtworkCard key={work.id} work={work} />)}
                </div>
              )}

              {activeSection === 'about' && (
                <div className="max-w-2xl space-y-8 text-stone-700">
                  <p className="leading-loose font-serif text-xl engraved-text">
                    We do not build; we uncover. This interface is a digital excavation of memory. 
                    Like fossils trapped in slate, these works are preserved moments of tension and release.
                  </p>
                  <div className="p-8 bg-stone-800/5 border border-stone-800/10 rounded-sm shadow-inner">
                    <h4 className="font-mono text-xs mb-6 text-stone-500 tracking-widest">SYSTEM ARCHIVE</h4>
                    <ul className="space-y-4 font-mono text-xs text-stone-600">
                      <li className="flex items-center gap-2">
                        <span className="text-red-900">{">>>"}</span> 
                        <span>Sequence 01: Initialization complete.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-red-900">{">>>"}</span>
                        <span>Vein mapping initialized.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-red-900">{">>>"}</span>
                        <span>Gemini-2.5 Uplink established.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeSection === 'statement' && (
                <div className="max-w-3xl mx-auto mt-8">
                  <div className="text-center mb-12">
                    <p className="text-2xl font-serif italic text-stone-600">
                      "The stone does not speak, but it remembers everything."
                    </p>
                  </div>
                  
                  {/* Chat Interface */}
                  <div className="border border-stone-500/20 bg-stone-400/10 p-6 md:p-8 min-h-[400px] flex flex-col rounded-sm shadow-[inset_2px_2px_8px_rgba(0,0,0,0.1)] backdrop-blur-sm">
                    <div className="flex-1 overflow-y-auto space-y-6 mb-6 custom-scrollbar pr-4 max-h-[50vh]">
                      {messages.map((m, i) => (
                        <div 
                          key={i} 
                          className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`
                            max-w-[80%] p-4 rounded-sm text-sm font-serif leading-relaxed shadow-sm
                            ${m.role === 'user' 
                              ? 'bg-stone-800 text-stone-200 rounded-br-none' 
                              : 'bg-stone-200/60 text-stone-800 rounded-bl-none border border-stone-300'}
                          `}>
                            {m.text}
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="text-xs text-red-800 font-mono animate-pulse pl-2">
                          ECHOING...
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-4 border-t border-stone-500/20 pt-6">
                      <input 
                        value={chatInput} 
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleChat()}
                        className="flex-1 bg-transparent border-b border-stone-400/30 py-2 px-2 outline-none text-base font-serif text-stone-800 placeholder-stone-400/50 focus:border-red-900/50 transition-colors"
                        placeholder="Engrave your question onto the slab..."
                      />
                      <button 
                        onClick={handleChat} 
                        className="px-6 py-2 bg-stone-800 text-stone-200 text-xs font-mono tracking-widest hover:bg-red-900 transition-colors shadow-md"
                      >
                        ENGRAVE
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
