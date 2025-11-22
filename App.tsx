import React, { useState } from 'react';
import { SectionId } from './types';
import BladeCursor from './components/BladeCursor';
import ScissorTrail from './components/ScissorTrail';
import StoneVeins from './components/StoneVeins';
import StoneSidebar from './components/StoneSidebar';
import MainContent from './components/MainContent';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('gallery');

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-10">
      {/* Visual FX Overlays */}
      <BladeCursor />
      <ScissorTrail />
      
      {/* Stone Slab Container */}
      <div className="relative w-full max-w-[1400px] h-[90vh] md:h-[85vh] stone-texture rounded-lg shadow-slab flex overflow-hidden border border-white/10 rough-edge transform transition-transform duration-1000 hover:scale-[1.002]">
        
        {/* Internal Background Effects */}
        <StoneVeins />
        
        {/* Lighting Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/20 via-transparent to-black/30 z-20 mix-blend-overlay"></div>

        {/* Main Content Grid */}
        <StoneSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <MainContent activeSection={activeSection} />

      </div>
    </div>
  );
};

export default App;