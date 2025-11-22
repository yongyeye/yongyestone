import React, { useEffect, useRef } from 'react';

const DustParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: {x: number, y: number, vx: number, vy: number, size: number, alpha: number}[] = [];
    let w = 0;
    let h = 0;

    const resize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        
        // Reset particles on resize
        particles = [];
        const count = Math.floor((w * h) / 15000); // Density
        for(let i=0; i<count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 1.5,
                alpha: Math.random() * 0.5
            });
        }
    };

    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
        ctx.clearRect(0, 0, w, h);
        
        ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            // Wrap around
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            ctx.beginPath();
            ctx.globalAlpha = p.alpha;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0;
        requestAnimationFrame(animate);
    };
    
    animate();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[5] mix-blend-screen opacity-40"
    />
  );
};

export default DustParticles;