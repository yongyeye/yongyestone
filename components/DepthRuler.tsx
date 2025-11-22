
import React, { useEffect, useState } from 'react';

interface Props {
  scrollContainerRef: React.RefObject<HTMLElement>;
  theme: 'light' | 'dark';
}

const DepthRuler: React.FC<Props> = ({ scrollContainerRef, theme }) => {
  const [depth, setDepth] = useState(0);
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      setScrollPos(scrollTop);
      // Convert pixels to arbitrary "meters"
      setDepth(scrollTop / 20); 
    };

    // Initial calc
    handleScroll();

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollContainerRef]);

  // Dynamic styles based on theme
  const borderColor = theme === 'dark' ? 'border-stone-800' : 'border-stone-300';
  const textColor = theme === 'dark' ? 'text-stone-600' : 'text-stone-400';
  
  // Ruler tick marks using repeating linear gradient
  const tickColor = theme === 'dark' ? 'rgba(60, 60, 60, 0.5)' : 'rgba(160, 160, 160, 0.5)';
  const rulerStyle: React.CSSProperties = {
    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 19px, ${tickColor} 20px)`,
    backgroundPosition: `0 -${scrollPos}px`, // Move ticks with scroll
    backgroundSize: '100% 20px'
  };

  return (
    <div className={`hidden md:flex w-12 h-full flex-col items-center border-r ${borderColor} relative select-none z-20`}>
      {/* Top Indicator */}
      <div className={`w-full py-4 text-[0.5rem] font-mono text-center tracking-widest ${textColor} opacity-50`}>
        DPTH
      </div>

      {/* Moving Ruler Track */}
      <div className="flex-1 w-full relative overflow-hidden">
         {/* The Ticks */}
         <div className="absolute inset-y-0 right-0 w-1/2 h-full" style={rulerStyle}></div>
         
         {/* Floating Depth Marker */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 bg-opacity-80 backdrop-blur-sm p-1 rounded">
            <span className={`text-[0.6rem] font-mono font-bold tracking-wider ${theme === 'dark' ? 'text-red-900' : 'text-red-800'}`}>
                {depth.toFixed(1)}m
            </span>
            <div className={`w-px h-8 ${theme === 'dark' ? 'bg-red-900' : 'bg-red-800'}`}></div>
            <div className={`w-2 h-px ${theme === 'dark' ? 'bg-red-900' : 'bg-red-800'}`}></div>
         </div>
      </div>

      {/* Bottom Decoration */}
      <div className={`w-full py-4 border-t ${borderColor} flex flex-col items-center gap-1`}>
          <div className={`w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-stone-700' : 'bg-stone-400'}`}></div>
          <div className={`w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-stone-700' : 'bg-stone-400'}`}></div>
      </div>
    </div>
  );
};

export default DepthRuler;
