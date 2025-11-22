import React from 'react';
import { MenuItem, SectionId } from '../types';
import { Language, translations } from '../translations';
import { audioService } from '../services/audioService';

interface Props {
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;
  lang: Language;
  theme: 'light' | 'dark';
}

const Sidebar: React.FC<Props> = ({ activeSection, setActiveSection, lang, theme }) => {
  const t = translations[lang];

  const menuItems: MenuItem[] = [
    { id: 'gallery', label: t.menu.gallery, sub: 'I' },
    { id: 'about', label: t.menu.about, sub: 'II' },
    { id: 'statement', label: t.menu.statement, sub: 'III' }
  ];

  const handleClick = (e: React.MouseEvent, id: SectionId) => {
    // Calculate basic pan based on click height or just random?
    // Let's use window relative X for pan (Sidebar is on left, so -0.5 approx)
    audioService.playClick(-0.5);
    setActiveSection(id);
  };

  return (
    <aside className={`w-24 md:w-32 h-full flex flex-col justify-between relative z-10 border-r backdrop-blur-[2px] transition-colors duration-700 ${
        theme === 'dark' 
          ? 'border-stone-500/10 bg-stone-900/60' 
          : 'border-stone-700/10 bg-stone-300/40'
      }`}>
      
      {/* Logo Area */}
      <div className="p-6 flex flex-col items-center">
        <h1 className={`text-3xl md:text-4xl font-bold tracking-widest engraved-text leading-none whitespace-pre-line ${
            theme === 'dark' ? 'text-stone-300' : 'text-stone-800'
        }`}>
          {t.title}
        </h1>
        <div className="w-1 h-12 bg-red-900/60 mt-4 mb-2 rounded-full"></div>
        <p 
            className="hidden md:block text-[0.5rem] font-mono tracking-[0.4em] text-stone-500"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          {t.subtitle}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col w-full gap-4">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={(e) => handleClick(e, item.id)}
            className={`group relative w-full py-6 flex justify-center items-center transition-all duration-500 outline-none ${
              activeSection === item.id 
                ? (theme === 'dark' ? 'bg-stone-100/5' : 'bg-stone-800/5')
                : 'hover:bg-stone-500/10'
            }`}
          >
            <div className="flex flex-col items-center relative z-10 gap-2">
              <span 
                className={`font-mono text-[0.6rem] tracking-widest transition-colors duration-300 ${
                  activeSection === item.id ? 'text-red-800' : 'text-stone-500'
                }`}
                style={{ writingMode: 'vertical-rl' }}
              >
                0{index + 1}
              </span>
              <span 
                className={`text-sm md:text-base font-serif tracking-widest transition-all duration-300 engraved-text ${
                  activeSection === item.id 
                    ? `font-bold scale-110 ${theme === 'dark' ? 'text-stone-200' : 'text-stone-900'}` 
                    : 'text-stone-500 opacity-70 group-hover:opacity-100'
                }`}
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
              >
                {item.label}
              </span>
            </div>
            
            {/* Active Indicator Groove */}
            {activeSection === item.id && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-red-900/80 shadow-[1px_0_5px_rgba(0,0,0,0.2)]"></div>
            )}
          </button>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-6 flex flex-col items-center font-mono text-[0.6rem] text-stone-500 opacity-60">
        <div className="hidden md:block" style={{ writingMode: 'vertical-rl' }}>
          894-SLAB
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;