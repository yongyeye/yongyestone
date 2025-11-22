import React, { useEffect, useRef } from 'react';

const BladeCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      // Rotate slightly based on movement to simulate cutting angle
      const angle = (e.movementX) * 2;
      cursor.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed pointer-events-none z-[9999] mix-blend-difference text-white transition-transform duration-75"
      style={{ top: '-100px', left: '-100px' }} // Initial position off-screen
    >
      <svg width="40" height="40" viewBox="0 0 40 40">
        <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="1" />
        <path d="M20,20 L35,35" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
      </svg>
    </div>
  );
};

export default BladeCursor;