import React, { useEffect, useRef } from 'react';

const BladeCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);
  const opacity = useRef(0);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const updatePos = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', updatePos);

    const animate = (time: number) => {
      if (!cursor) return;
      const delta = time - lastTime.current;
      lastTime.current = time;

      // Calculate smooth velocity
      const currentLeft = parseFloat(cursor.style.left) || 0;
      const currentTop = parseFloat(cursor.style.top) || 0;
      
      const dx = pos.current.x - currentLeft;
      const dy = pos.current.y - currentTop;
      
      // Instant snap for responsiveness, but track speed for effect
      cursor.style.left = `${pos.current.x}px`;
      cursor.style.top = `${pos.current.y}px`;

      const speed = Math.sqrt(dx*dx + dy*dy);
      
      // Physics for Opacity: Fade in when moving, fade out when still
      const targetOpacity = Math.min(speed * 0.05, 1);
      opacity.current += (targetOpacity - opacity.current) * 0.1;
      
      // Physics for Rotation: Tilt based on horizontal speed
      const angle = Math.min(Math.max(dx * 2, -45), 45);
      
      cursor.style.opacity = `${0.1 + opacity.current * 0.9}`; // Min opacity 0.1
      cursor.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${0.8 + opacity.current * 0.2})`;

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    return () => window.removeEventListener('mousemove', updatePos);
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed pointer-events-none z-[100] mix-blend-exclusion text-stone-800 transition-none"
      style={{ willChange: 'left, top, transform, opacity' }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        {/* Crosshair */}
        <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="1" />
        {/* Blade Edge */}
        <path d="M20,20 L35,35" stroke="currentColor" strokeWidth="2" opacity="0.8"/>
        <circle cx="20" cy="20" r="2" fill="currentColor" />
      </svg>
    </div>
  );
};

export default BladeCursor;