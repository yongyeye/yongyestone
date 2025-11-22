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

  const handleClick = (id: SectionId) => {
    audioService.playClick();
    setActiveSection(id);
  };

  return (
    <aside className={`w-24 md:w-72 h-full flex flex-col justify-between relative z-10 border-r backdrop-blur-[2px] transition-colors duration-700 ${
        theme === 'dark' 
          ? 'border-stone-500/10 bg-stone-900/60' 
          : 'border-stone-700/10 bg-stone-300/40'
      }`}>
      
      {/* Logo Area */}
      <div className="p-6 md:p-10">
        <h1 className={`text-4xl font-bold tracking-widest engraved-text leading-none whitespace-pre-line ${
            theme === 'dark' ? 'text-stone-300' : 'text-stone-800'
        }`}>
          {t.title}
        </h1>
        <div className="w-12 h-1 bg-red-900/60 mt-4 mb-2 rounded-full"></div>
        <p className="hidden md:block text-[0.5rem] font-mono tracking-[0.4em] text-stone-500">
          {t.subtitle}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col w-full">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`group relative w-full p-6 md:pl-10 text-left transition-all duration-500 outline-none ${
              activeSection === item.id 
                ? (theme === 'dark' ? 'bg-stone-100/5' : 'bg-stone-800/5')
                : 'hover:bg-stone-500/10'
            }`}
          >
            <div className="flex flex-col relative z-10">
              <span 
                className={`font-mono text-[0.6rem] tracking-widest mb-1 transition-colors duration-300 ${
                  activeSection === item.id ? 'text-red-800' : 'text-stone-500'
                }`}
              >
                0{index + 1}
              </span>
              <span 
                className={`text-sm md:text-xl font-serif tracking-widest transition-all duration-300 engraved-text ${
                  activeSection === item.id 
                    ? `translate-x-2 font-bold scale-105 ${theme === 'dark' ? 'text-stone-200' : 'text-stone-900'}` 
                    : 'text-stone-500 group-hover:translate-x-1'
                }`}
              >
                {item.label}
              </span>
            </div>
            
            {/* Active Indicator Groove */}
            {activeSection === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-full bg-red-900/80 shadow-[1px_0_5px_rgba(0,0,0,0.2)]"></div>
            )}
          </button>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-6 md:p-10 font-mono text-[0.6rem] text-stone-500 opacity-60">
        <div className="md:hidden">ID: 894</div>
        <div className="hidden md:block">
          {t.idLabel}: 894-SLAB<br/>
          2025
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
