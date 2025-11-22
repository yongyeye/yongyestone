import React, { useState, useEffect } from 'react';
import BladeCursor from './components/BladeCursor';
import ScissorTrail from './components/ScissorTrail';
import StoneVeins from './components/StoneVeins';
import Sidebar from './components/Sidebar';
import ArtworkCard from './components/ArtworkCard';
import Intro from './components/Intro';
import PageTransition from './components/PageTransition';
import { chatWithSlab } from './services/geminiService';
import { Artwork, ChatMessage, SectionId } from './types';
import { Language, translations } from './translations';
import { audioService } from './services/audioService';

// Mock Data
const artworks: Artwork[] = [
  { id: 1, serial: "FRAG-01", title: "风化", type: "Mixed Media", desc: "Granite eroded by wind over a millennium.", image: "https://picsum.photos/800/1000?grayscale" },
  { id: 2, serial: "FRAG-02", title: "凝固", type: "Oil", desc: "A moment frozen in amber and dust.", image: "https://picsum.photos/801/1001?grayscale" },
  { id: 3, serial: "FRAG-03", title: "裂痕", type: "Photo", desc: "The exact moment of structural failure.", image: "https://picsum.photos/802/1002?grayscale" },
  { id: 4, serial: "FRAG-04", title: "沉积", type: "Scan", desc: "Compressed layers of forgotten history.", image: "https://picsum.photos/803/1003?grayscale" },
];

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('gallery');
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  
  // Settings State
  const [lang, setLang] = useState<Language>('zh');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  // Default Audio ON, but waits for user interaction to start
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Transition State
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState<'fracture' | 'rain'>('fracture');
  const [pendingSection, setPendingSection] = useState<SectionId | null>(null);

  const t = translations[lang];

  // Global Audio Wake-up
  useEffect(() => {
    const wakeUpAudio = () => {
      if (audioEnabled) {
        audioService.resume();
      }
      // Remove listener after first interaction
      document.removeEventListener('click', wakeUpAudio);
    };
    
    document.addEventListener('click', wakeUpAudio);
    return () => document.removeEventListener('click', wakeUpAudio);
  }, [audioEnabled]);

  const handleSectionChange = (id: SectionId) => {
    if (activeSection === id) return;
    audioService.playClick();

    // Randomly select a transition effect
    const effects: ('fracture' | 'rain')[] = ['fracture', 'rain'];
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    
    setTransitionType(randomEffect);
    setPendingSection(id);
    setIsTransitioning(true);
  };

  const handleChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    
    audioService.playClick();
    const userQ = chatInput;
    setChatInput("");
    setChatLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: userQ }]);

    const answer = await chatWithSlab(userQ, lang);
    setMessages(prev => [...prev, { role: 'ai', text: answer }]);
    setChatLoading(false);
  };

  const toggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    audioService.toggleMute(!newState); // If disabled (false), mute (true)
    if (newState) audioService.playClick();
  };

  const toggleTheme = () => {
    audioService.playClick();
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLang = () => {
    audioService.playClick();
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  };

  // Dynamic Styles based on Theme
  // Removed standard box-shadow and borders in favor of clip-path compatible styles
  const containerClass = theme === 'dark' 
    ? 'bg-stone-900 text-stone-300' 
    : 'bg-stone-300 text-stone-800';

  const mainBgClass = theme === 'dark' ? 'bg-stone-950/50' : 'bg-stone-100/5';
  const headerClass = theme === 'dark' ? 'text-stone-200' : 'text-stone-800';
  const bigTextClass = theme === 'dark' ? 'text-stone-800/20' : 'text-stone-600/5';

  return (
    <div className={`w-full h-screen flex items-center justify-center p-2 md:p-8 lg:p-12 overflow-hidden transition-colors duration-1000 ${theme === 'dark' ? 'bg-stone-950' : 'bg-stone-200'}`}>
      { !introDone && <Intro onComplete={() => setIntroDone(true)} lang={lang} /> }
      
      <BladeCursor />
      <ScissorTrail />
      
      <PageTransition 
        isActive={isTransitioning} 
        type={transitionType}
        onMidpoint={() => {
            if (pendingSection) setActiveSection(pendingSection);
        }}
        onComplete={() => {
            setIsTransitioning(false);
            setPendingSection(null);
        }}
      />

      {/* Settings Panel (Floating) - Simplified */}
      <div className="fixed top-4 right-4 md:right-12 z-50 flex flex-col items-end md:flex-row gap-2 md:gap-4 font-mono text-[0.6rem] tracking-widest select-none">
         <div className="flex gap-4">
             <button onClick={toggleAudio} className={`hover:text-red-600 transition-colors ${theme === 'dark' ? (audioEnabled ? 'text-red-500' : 'text-stone-600') : (audioEnabled ? 'text-red-800' : 'text-stone-400')}`}>
                [{t.settings.audio}: {audioEnabled ? 'ON' : 'OFF'}]
             </button>
             <button onClick={toggleTheme} className={`hover:text-red-600 transition-colors ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                [{t.settings.theme}: {theme === 'dark' ? 'OBSIDIAN' : 'GRANITE'}]
             </button>
             <button onClick={toggleLang} className={`hover:text-red-600 transition-colors ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                [{t.settings.lang}: {lang.toUpperCase()}]
             </button>
         </div>
      </div>

      {/* Main Slab Container */}
      <div 
        className={`relative w-full max-w-[1600px] h-full md:h-[90vh] stone-texture flex overflow-hidden rough-edge transition-all duration-[1000ms] ease-out ${
          introDone ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        } ${containerClass}`}
        style={{
            // Irregular Hexagon Shape:
            // Top-Left Chamfer: 40px
            // Top-Right Chamfer: 60px
            clipPath: 'polygon(40px 0, calc(100% - 60px) 0, 100% 60px, 100% 100%, 0 100%, 0 40px)',
            // Drop shadow filter allows shadow to follow the clipped shape (unlike box-shadow)
            filter: theme === 'dark' 
                ? 'drop-shadow(20px 20px 40px rgba(0,0,0,0.6))' 
                : 'drop-shadow(20px 20px 40px rgba(0,0,0,0.25))'
        }}
      >
        
        {/* Background Effects */}
        <StoneVeins theme={theme} />
        <div className={`absolute inset-0 pointer-events-none z-10 mix-blend-overlay bg-gradient-to-br ${theme === 'dark' ? 'from-black/60 via-transparent to-black/80' : 'from-white/10 via-transparent to-black/20'}`}></div>

        {/* Layout */}
        <Sidebar activeSection={activeSection} setActiveSection={handleSectionChange} lang={lang} theme={theme} />

        {/* Scrollable Content Area */}
        <main className={`flex-1 h-full overflow-y-auto custom-scrollbar relative z-10 transition-colors duration-700 ${mainBgClass}`}>
          <div className="min-h-full p-8 md:p-16 pb-32">
            
            {/* Header Section */}
            <header className={`mb-16 border-b pb-8 relative transition-colors duration-700 ${theme === 'dark' ? 'border-stone-700/30' : 'border-stone-600/20'}`}>
              <h2 className={`text-6xl md:text-9xl font-bold absolute -top-6 md:-top-12 -left-4 select-none z-0 engraved-text uppercase transition-colors duration-700 ${bigTextClass}`}>
                {t.menu[activeSection]}
              </h2>
              <h2 className={`text-3xl md:text-4xl font-serif relative z-10 engraved-text pl-2 transition-colors duration-700 ${headerClass}`}>
                {t.menu[activeSection]}
              </h2>
            </header>

            <div className="animate-fade-in">
              {/* GALLERY */}
              {activeSection === 'gallery' && (
                <div className="columns-1 md:columns-2 lg:columns-2 gap-12 space-y-12 pr-4">
                  {artworks.map(work => <ArtworkCard key={work.id} work={work} lang={lang} theme={theme} />)}
                </div>
              )}

              {/* ABOUT */}
              {activeSection === 'about' && (
                <div className={`max-w-2xl space-y-8 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-700'}`}>
                  <p className="leading-loose font-serif text-xl engraved-text">
                    {t.about.text}
                  </p>
                  <div className={`p-8 border rounded-sm shadow-inner transition-colors duration-700 ${theme === 'dark' ? 'bg-stone-900/50 border-stone-800' : 'bg-stone-800/5 border-stone-800/10'}`}>
                    <h4 className="font-mono text-xs mb-6 text-stone-500 tracking-widest">{t.about.logTitle}</h4>
                    <ul className="space-y-4 font-mono text-xs text-stone-500">
                      {t.about.logs.map((log, i) => (
                         <li key={i} className="flex items-center gap-2">
                           <span className="text-red-800">{">>>"}</span> 
                           <span>{log}</span>
                         </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* STATEMENT */}
              {activeSection === 'statement' && (
                <div className="max-w-3xl mx-auto mt-8">
                  <div className="text-center mb-12">
                    <p className={`text-2xl font-serif italic ${theme === 'dark' ? 'text-stone-500' : 'text-stone-600'}`}>
                      {t.statement.quote}
                    </p>
                  </div>
                  
                  <div className={`border p-6 md:p-8 min-h-[400px] flex flex-col rounded-sm shadow-[inset_2px_2px_8px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-colors duration-700 ${
                      theme === 'dark' ? 'border-stone-700/30 bg-stone-900/30' : 'border-stone-500/20 bg-stone-400/10'
                  }`}>
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
                              : (theme === 'dark' ? 'bg-stone-800/60 text-stone-300 border-stone-700' : 'bg-stone-200/60 text-stone-800 border-stone-300') + ' rounded-bl-none border'}
                          `}>
                            {m.text}
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="text-xs text-red-800 font-mono animate-pulse pl-2">
                          {t.statement.loading}
                        </div>
                      )}
                    </div>
                    
                    <div className={`flex gap-4 border-t pt-6 ${theme === 'dark' ? 'border-stone-700/30' : 'border-stone-500/20'}`}>
                      <input 
                        value={chatInput} 
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleChat()}
                        className={`flex-1 bg-transparent border-b py-2 px-2 outline-none text-base font-serif placeholder-stone-500/50 focus:border-red-900/50 transition-colors ${
                            theme === 'dark' ? 'border-stone-700 text-stone-300' : 'border-stone-400/30 text-stone-800'
                        }`}
                        placeholder={t.statement.placeholder}
                      />
                      <button 
                        onClick={handleChat} 
                        className="px-6 py-2 bg-stone-800 text-stone-200 text-xs font-mono tracking-widest hover:bg-red-900 transition-colors shadow-md"
                      >
                        {t.statement.send}
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