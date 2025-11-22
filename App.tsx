
import React, { useState, useEffect, useMemo, useRef } from 'react';
import BladeCursor from './components/BladeCursor';
import ScissorTrail from './components/ScissorTrail';
import StoneVeins from './components/StoneVeins';
import Sidebar from './components/Sidebar';
import ArtworkCard from './components/ArtworkCard';
import Intro from './components/Intro';
import PageTransition from './components/PageTransition';
import DepthRuler from './components/DepthRuler'; // Import Ruler
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

// Pre-calculated fracture paths for the overlay
const FRACTURE_PATHS = [
    "M 20 0 L 50 100 L 40 200 L 80 300 L 60 400",
    "M 200 0 L 180 150 L 220 250 L 210 450",
    "M 500 0 L 520 120 L 490 240 L 550 600",
    "M 800 0 L 750 200 L 820 400 L 780 800",
    "M 0 300 L 100 320 L 300 280 L 600 350",
    "M 1000 100 L 900 300 L 950 500 L 880 700",
    "M 300 800 L 350 600 L 250 400 L 400 200",
    "M 600 800 L 620 700 L 580 500 L 650 300"
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
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Transition & Damage State
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState<'fracture' | 'rain'>('fracture');
  const [pendingSection, setPendingSection] = useState<SectionId | null>(null);
  const [damage, setDamage] = useState({ fracture: 0, blood: 0 });
  const [interactionCount, setInteractionCount] = useState(0); // Track total interactions

  // Refs
  const mainContentRef = useRef<HTMLDivElement>(null);

  const t = translations[lang];

  // Global Audio Wake-up
  useEffect(() => {
    const wakeUpAudio = () => {
      if (audioEnabled) {
        audioService.resume();
      }
      document.removeEventListener('click', wakeUpAudio);
    };
    document.addEventListener('click', wakeUpAudio);
    return () => document.removeEventListener('click', wakeUpAudio);
  }, [audioEnabled]);

  const handleSectionChange = (id: SectionId) => {
    if (activeSection === id) return;
    
    // Random effect
    const effects: ('fracture' | 'rain')[] = ['fracture', 'rain'];
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    
    // Increment interaction count
    const newCount = interactionCount + 1;
    setInteractionCount(newCount);

    // Trigger specific sound & Apply damage ONLY if interactions > 10
    if (randomEffect === 'fracture') {
        audioService.playFracture();
        if (newCount > 10) {
            setDamage(prev => ({ ...prev, fracture: Math.min(prev.fracture + 1, 8) }));
        }
    } else {
        audioService.playRain();
        if (newCount > 10) {
            setDamage(prev => ({ ...prev, blood: Math.min(prev.blood + 1, 10) }));
        }
    }
    
    setTransitionType(randomEffect);
    setPendingSection(id);
    setIsTransitioning(true);
  };

  const handleRepair = () => {
      audioService.playRepair();
      setDamage({ fracture: 0, blood: 0 });
      setInteractionCount(0); // Reset safety counter
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
    audioService.toggleMute(!newState);
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

  // --- DAMAGE VISUAL CALCS ---
  const totalDamage = damage.fracture + damage.blood;
  
  // Content Distortion
  const contentStyle: React.CSSProperties = {
      filter: `blur(${totalDamage * 0.6}px) grayscale(${totalDamage * 8}%) contrast(${100 + totalDamage * 5}%)`,
      transform: `skew(${totalDamage * 0.2}deg, ${damage.fracture * 0.1}deg) scale(${1 + damage.blood * 0.002})`,
      opacity: Math.max(0.1, 1 - totalDamage * 0.08), // Becomes unreadable
      transition: 'all 0.5s ease-out'
  };

  // Blood Overlay Spots
  const bloodSpots = useMemo(() => {
      return Array.from({ length: damage.blood * 2 }).map((_, i) => ({
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          size: `${50 + Math.random() * 150}px`
      }));
  }, [damage.blood]);


  // Theme Styles
  const containerClass = theme === 'dark' 
    ? 'bg-stone-900 text-stone-300' 
    : 'bg-stone-300 text-stone-800';
  const mainBgClass = theme === 'dark' ? 'bg-stone-950/50' : 'bg-stone-100/5';
  const headerClass = theme === 'dark' ? 'text-stone-200' : 'text-stone-800';
  // Increased visibility for background text
  const bigTextClass = theme === 'dark' ? 'text-stone-800/40' : 'text-stone-400/30'; 
  const slabShapePoly = 'polygon(40px 0, calc(100% - 60px) 0, 100% 60px, 100% 100%, 0 100%, 0 40px)';

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

      {/* Settings Panel (Floating) */}
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
             {totalDamage > 0 && (
                 <button onClick={handleRepair} className="text-red-600 animate-pulse font-bold hover:text-red-400">
                    [{t.settings.repair}]
                 </button>
             )}
         </div>
      </div>

      {/* Layout Container */}
      <div className={`relative w-full max-w-[1600px] h-full md:h-[90vh] transition-all duration-[1000ms] ease-out ${
          introDone ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
      }`}>
        
        {/* MAIN FACE LAYER */}
        <div 
            className={`relative w-full h-full stone-texture flex overflow-hidden rough-edge z-10 border-t border-l ${theme === 'dark' ? 'border-stone-700' : 'border-stone-100/50'} ${containerClass}`}
            style={{ clipPath: slabShapePoly }}
        >
            {/* Stone Veins Background */}
            <StoneVeins theme={theme} />

            {/* 1. VISUAL DECAY LAYERS */}
            
            {/* Blood Overlay */}
            {damage.blood > 0 && (
                <div className="absolute inset-0 pointer-events-none mix-blend-multiply z-[5]">
                    {/* General Haze */}
                    <div className="absolute inset-0 bg-red-900" style={{ opacity: damage.blood * 0.05 }}></div>
                    {/* Spots */}
                    {bloodSpots.map((spot, i) => (
                         <div 
                            key={i}
                            className="absolute rounded-full bg-red-900 blur-xl opacity-40"
                            style={{ ...spot }}
                         />
                    ))}
                </div>
            )}
            
            {/* Fracture Overlay */}
            {damage.fracture > 0 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-[5] mix-blend-multiply opacity-60">
                    {FRACTURE_PATHS.slice(0, damage.fracture).map((path, i) => (
                        <path 
                            key={i}
                            d={path}
                            stroke={theme === 'dark' ? '#000' : '#292524'}
                            strokeWidth={1 + Math.random()}
                            fill="none"
                            filter="drop-shadow(1px 1px 1px rgba(255,255,255,0.2))"
                        />
                    ))}
                </svg>
            )}

            {/* 2. CONTENT STRUCTURE */}
            <div className="flex flex-col md:flex-row w-full h-full" style={contentStyle}>
                <Sidebar activeSection={activeSection} setActiveSection={handleSectionChange} lang={lang} theme={theme} />
                
                {/* DEPTH RULER */}
                <DepthRuler scrollContainerRef={mainContentRef} theme={theme} />

                <main 
                    ref={mainContentRef}
                    className={`flex-1 h-full overflow-y-auto custom-scrollbar relative z-10 ${mainBgClass}`}
                >
                    <div className="min-h-full p-6 md:p-16 pb-32">
                        {/* Header */}
                        <header className="mb-12 md:mb-20 border-b pb-8 relative select-none transition-colors duration-500 border-stone-500/20">
                            <h2 className={`text-[4rem] md:text-[6rem] font-bold absolute -top-10 md:-top-16 -left-4 z-0 engraved-text opacity-25 ${bigTextClass}`}>
                                {activeSection.toUpperCase()}
                            </h2>
                            <h2 className={`text-2xl md:text-4xl font-serif relative z-10 tracking-widest engraved-text ${headerClass}`}>
                                {activeSection === 'gallery' && t.menu.gallery}
                                {activeSection === 'about' && t.menu.about}
                                {activeSection === 'statement' && t.menu.statement}
                            </h2>
                        </header>

                        {/* GALLERY SECTION */}
                        {activeSection === 'gallery' && (
                            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                                {artworks.map(work => (
                                    <ArtworkCard key={work.id} work={work} lang={lang} theme={theme} />
                                ))}
                            </div>
                        )}

                        {/* ABOUT SECTION */}
                        {activeSection === 'about' && (
                            <div className={`max-w-2xl space-y-8 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                                <p className="leading-loose font-serif text-lg md:text-xl engraved-text">
                                    {t.about.text}
                                </p>
                                <div className={`p-6 border rounded-sm ${theme === 'dark' ? 'bg-stone-800/20 border-stone-700' : 'bg-stone-500/5 border-stone-400/20'}`}>
                                    <h4 className="font-mono text-xs mb-4 opacity-50 tracking-widest">{t.about.logTitle}</h4>
                                    <ul className="space-y-2 font-mono text-xs opacity-70">
                                        {t.about.logs.map((log, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <span className="text-red-800">{">>>"}</span>
                                                <span>{log}</span>
                                            </li>
                                        ))}
                                        {damage.blood > 0 && <li className="text-red-800">!!! ORGANIC CONTAMINATION DETECTED</li>}
                                        {damage.fracture > 0 && <li className="text-red-800">!!! STRUCTURAL INTEGRITY COMPROMISED</li>}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* STATEMENT SECTION */}
                        {activeSection === 'statement' && (
                            <div className="max-w-2xl mx-auto mt-10">
                                <div className="text-center mb-12">
                                    <p className={`text-xl md:text-2xl font-serif italic opacity-70 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-600'}`}>
                                        {t.statement.quote}
                                    </p>
                                </div>
                                <div className={`border p-6 min-h-[400px] flex flex-col rounded-sm shadow-inner transition-colors duration-500 ${
                                    theme === 'dark' ? 'border-stone-700 bg-stone-900/80' : 'border-stone-400/30 bg-stone-100/30'
                                }`}>
                                    <div className="flex-1 overflow-y-auto space-y-6 mb-6 custom-scrollbar pr-2">
                                        {messages.map((m, i) => (
                                            <div key={i} className={`text-sm font-serif p-4 rounded-sm max-w-[85%] leading-relaxed shadow-sm ${
                                                m.role === 'user' 
                                                    ? `ml-auto ${theme === 'dark' ? 'bg-stone-800 text-stone-300' : 'bg-stone-700 text-stone-100'}` 
                                                    : `mr-auto ${theme === 'dark' ? 'bg-stone-950/50 text-stone-400' : 'bg-stone-200/50 text-stone-800'}`
                                            }`}>
                                                {m.text}
                                            </div>
                                        ))}
                                        {chatLoading && <div className="text-xs text-red-700 animate-pulse tracking-widest">{t.statement.loading}</div>}
                                    </div>
                                    <div className={`flex gap-2 border-t pt-4 ${theme === 'dark' ? 'border-stone-700' : 'border-stone-400/20'}`}>
                                        <input 
                                            value={chatInput} 
                                            onChange={e => setChatInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleChat()}
                                            className={`flex-1 bg-transparent outline-none text-base font-serif placeholder-opacity-30 ${
                                                theme === 'dark' ? 'text-stone-200 placeholder-stone-500' : 'text-stone-800 placeholder-stone-800'
                                            }`}
                                            placeholder={t.statement.placeholder}
                                        />
                                        <button 
                                            onClick={handleChat} 
                                            className="text-red-800 text-xs hover:text-red-600 font-mono tracking-widest transition-colors px-4 uppercase"
                                        >
                                            {t.statement.send}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;
