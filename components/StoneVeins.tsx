import React, { useEffect, useRef } from 'react';

class Branch {
  x: number;
  y: number;
  angle: number;
  depth: number;
  speed: number;
  life: number;
  thickness: number;
  finished: boolean;

  constructor(x: number, y: number, angle: number, depth: number) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.depth = depth;
    this.speed = Math.random() * 0.4 + 0.1;
    this.life = 150 + Math.random() * 100;
    this.thickness = depth * 0.4;
    this.finished = false;
  }

  update(branches: Branch[]) {
    if (this.life > 0 && this.depth > 0) {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.life--;
      this.angle += (Math.random() - 0.5) * 0.3; // Tortuous path

      if (Math.random() < 0.02 && this.depth > 1) {
        branches.push(new Branch(this.x, this.y, this.angle + 0.6, this.depth - 1));
        branches.push(new Branch(this.x, this.y, this.angle - 0.6, this.depth - 1));
        this.finished = true;
      }
    } else {
      this.finished = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.thickness, 0, Math.PI * 2);
    // Color: Dark mineral veins
    ctx.fillStyle = `rgba(60, 20, 20, 0.15)`;
    ctx.fill();
  }
}

const StoneVeins: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let width: number, height: number;
    let branches: Branch[] = [];
    let rafId: number;

    const init = () => {
      branches = [];
      // Grow from corners
      branches.push(new Branch(0, 0, Math.PI / 4, 8));
      branches.push(new Branch(width, height, -3 * Math.PI / 4, 8));
    };

    const animate = () => {
      branches.forEach(b => {
        if (!b.finished) {
          b.update(branches);
          b.draw(ctx);
        }
      });
      rafId = requestAnimationFrame(animate);
    };

    const resize = () => {
      width = parent.offsetWidth;
      height = parent.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    };

    const ro = new ResizeObserver(() => {
      // Re-init on heavy resize, or just clear? 
      // For stone effect, re-drawing is acceptable.
      resize();
    });
    
    ro.observe(parent);
    
    // Small delay to ensure initial layout is calculated
    setTimeout(() => {
      resize();
      animate();
    }, 100);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply opacity-80 z-0" 
    />
  );
};

export default StoneVeins;