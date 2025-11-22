import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  life: number;
  width: number;
}

const ScissorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const addPoint = (e: MouseEvent) => {
      const jitter = 1.5;
      pointsRef.current.push({
        x: e.clientX + (Math.random() - 0.5) * jitter,
        y: e.clientY + (Math.random() - 0.5) * jitter,
        life: 1.0,
        width: Math.random() * 2 + 0.5
      });
    };
    window.addEventListener('mousemove', addPoint);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (pointsRef.current.length > 1) {
        ctx.beginPath();
        // Bright red, resembling sparks or blood
        ctx.strokeStyle = 'rgba(200, 0, 0, 0.7)';
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';

        for (let i = 0; i < pointsRef.current.length - 1; i++) {
          const p1 = pointsRef.current[i];
          const p2 = pointsRef.current[i + 1];
          
          if (p1.life > 0) {
            ctx.lineWidth = p1.width * p1.life;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
          p1.life -= 0.03; // Fade out speed
        }
      }
      
      // Remove dead points
      pointsRef.current = pointsRef.current.filter(p => p.life > 0);
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', addPoint);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-50" />;
};

export default ScissorTrail;