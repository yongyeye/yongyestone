import React, { useEffect, useState } from 'react';
import { Language, translations } from '../translations';

interface IntroProps {
  onComplete: () => void;
  lang: Language;
}

const Intro: React.FC<IntroProps> = ({ onComplete, lang }) => {
  const [phase, setPhase] = useState(0); // 0: Idle, 1: Text, 2: Line Draw, 3: Split, 4: Done
  const t = translations[lang].intro;

  useEffect(() => {
    const timeline = [
      { t: 500, action: () => setPhase(1) },
      { t: 2000, action: () => setPhase(2) },
      { t: 2800, action: () => setPhase(3) },
      { t: 4500, action: () => {
          setPhase(4);
          onComplete();
        } 
      }
    ];

    const timeouts = timeline.map(item => setTimeout(item.action, item.t));
    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === 4) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex pointer-events-none">
      {/* Left Panel */}
      <div 
        className={`relative w-1/2 h-full bg-stone-900 stone-texture border-r border-stone-800 z-20 transition-transform duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
          phase >= 3 ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className={`absolute right-0 top-1/2 -translate-y-1/2 pr-8 text-right transition-opacity duration-500 ${phase === 1 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="font-mono text-[0.6rem] text-stone-500 tracking-[0.2em] mb-2">SYS.894</div>
          <div className="font-serif text-2xl text-stone-200 tracking-widest engraved-text">{t.sys}</div>
        </div>
      </div>

      {/* Right Panel */}
      <div 
        className={`relative w-1/2 h-full bg-stone-900 stone-texture border-l border-stone-800 z-20 transition-transform duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
          phase >= 3 ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 pl-8 text-left transition-opacity duration-500 ${phase === 1 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="font-mono text-[0.6rem] text-stone-500 tracking-[0.2em] mb-2">{t.depth}: 0.0m</div>
          <div className="font-serif text-2xl text-stone-200 tracking-widest engraved-text">{t.core}</div>
        </div>
      </div>

      {/* Central Fissure */}
      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
        <div 
          className={`w-[2px] bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)] transition-all duration-[800ms] ease-in-out ${
            phase === 2 ? 'h-full opacity-100' : phase > 2 ? 'h-full opacity-0' : 'h-0 opacity-0'
          }`}
        />
        <div 
          className={`absolute inset-0 bg-white transition-opacity duration-700 ${
            phase === 3 ? 'opacity-20' : 'opacity-0'
          }`}
        />
      </div>

      <div className={`absolute inset-0 bg-black transition-opacity duration-1000 z-10 ${phase >= 3 ? 'opacity-0' : 'opacity-100'}`} />
    </div>
  );
};

export default Intro;
