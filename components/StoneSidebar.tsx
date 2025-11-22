import React from 'react';
import { SectionId } from '../types';

interface StoneSidebarProps {
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
}

const StoneSidebar: React.FC<StoneSidebarProps> = ({ activeSection, setActiveSection }) => {
  const menuItems: { id: SectionId; label: string; sub: string }[] = [
    { id: 'gallery', label: 'EXHIBITS', sub: '陈列' },
    { id: 'about', label: 'PROFILE', sub: '档案' },
    { id: 'statement', label: 'STATEMENT', sub: '自述' }
  ];

  return (
    <aside className="w-24 md:w-64 h-full flex flex-col justify-between relative z-10 stone-gap border-r border-stone-dark/20 bg-stone-base/50 backdrop-blur-sm">
      {/* Logo */}
      <div className="p-8">
        <h1 className="text-4xl font-bold tracking-widest engraved-text text-stone-shadow">脉<br/>络</h1>
        <div className="w-8 h-1 bg-blood/50 mt-4 mb-1 rounded-full"></div>
        <p className="text-[0.5rem] font-mono tracking-[0.3em] text-stone-shadow/60">ANCIENT<br/>SLAB</p>
      </div>

      {/* Menu */}
      <nav className="flex flex-col w-full">
        {menuItems.map((item, index) => (
          <div 
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`group relative w-full p-6 pl-8 cursor-none transition-all duration-500 ${activeSection === item.id ? 'bg-stone-dark/10' : 'hover:bg-stone-light/30'}`}
          >
            <div className="flex flex-col">
              <span className={`font-mono text-[0.6rem] tracking-widest mb-1 transition-colors ${activeSection === item.id ? 'text-blood' : 'text-stone-shadow/40'}`}>
                0{index + 1}
              </span>
              <span className={`text-lg font-serif tracking-widest transition-all duration-300 engraved-text ${activeSection === item.id ? 'translate-x-2 font-bold scale-105' : 'text-stone-shadow/70 group-hover:text-stone-shadow group-hover:translate-x-1'}`}>
                {item.label}
              </span>
            </div>
            {/* Active indicator groove */}
            {activeSection === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blood shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] rounded-r-sm"></div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer ID */}
      <div className="p-8 font-mono text-[0.6rem] text-stone-shadow/40 opacity-50">
        ID: 894-SLAB
      </div>
    </aside>
  );
};

export default StoneSidebar;