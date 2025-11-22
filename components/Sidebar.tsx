import React from 'react';
import { MenuItem, SectionId } from '../types';

interface Props {
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;
}

const Sidebar: React.FC<Props> = ({ activeSection, setActiveSection }) => {
  const menuItems: MenuItem[] = [
    { id: 'gallery', label: '遗迹陈列', sub: '陈列' },
    { id: 'about', label: '挖掘档案', sub: '档案' },
    { id: 'statement', label: '石板自述', sub: '自述' }
  ];

  return (
    <aside className="w-24 md:w-72 h-full flex flex-col justify-between relative z-10 border-r border-stone-700/10 bg-stone-300/40 backdrop-blur-[2px]">
      {/* Logo Area */}
      <div className="p-6 md:p-10">
        <h1 className="text-4xl font-bold tracking-widest engraved-text text-stone-800 leading-none">
          脉<br/>络
        </h1>
        <div className="w-12 h-1 bg-red-900/60 mt-4 mb-2 rounded-full"></div>
        <p className="hidden md:block text-[0.5rem] font-mono tracking-[0.4em] text-stone-600">
          旧石器数字接口<br/>PALEOLITHIC
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col w-full">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`group relative w-full p-6 md:pl-10 text-left transition-all duration-500 outline-none ${
              activeSection === item.id ? 'bg-stone-800/5' : 'hover:bg-stone-100/20'
            }`}
          >
            <div className="flex flex-col relative z-10">
              <span 
                className={`font-mono text-[0.6rem] tracking-widest mb-1 transition-colors duration-300 ${
                  activeSection === item.id ? 'text-red-900' : 'text-stone-500'
                }`}
              >
                0{index + 1}
              </span>
              <span 
                className={`text-sm md:text-xl font-serif tracking-widest transition-all duration-300 engraved-text ${
                  activeSection === item.id 
                    ? 'translate-x-2 font-bold scale-105 text-stone-900' 
                    : 'text-stone-600 group-hover:text-stone-800 group-hover:translate-x-1'
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
          文物编号: 894-SLAB<br/>
          出土年份: 2024
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;