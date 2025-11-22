import React, { useEffect, useRef } from 'react';

interface Props {
  theme: 'light' | 'dark';
}

const StoneVeins: React.FC<Props> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Re-trigger animation when theme changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const parent = canvas.parentElement;
    if (!parent) return;

    let branches: Branch[] = [];
    let rafId: number;

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

      update() {
        if (this.life > 0 && this.depth > 0) {
          this.x += Math.cos(this.angle) * this.speed;
          this.y += Math.sin(this.angle) * this.speed;
          this.life--;
          this.angle += (Math.random() - 0.5) * 0.3;

          if (Math.random() < 0.015 && this.depth > 1) {
            branches.push(new Branch(this.x, this.y, this.angle + 0.6, this.depth - 1));
            branches.push(new Branch(this.x, this.y, this.angle - 0.6, this.depth - 1));
            this.finished = true;
          }
        } else {
          this.finished = true;
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.thickness, 0, Math.PI * 2);
        // Adjust vein color based on theme
        if (theme === 'dark') {
             context.fillStyle = `rgba(200, 200, 200, 0.08)`; // Light veins on dark stone
        } else {
             context.fillStyle = `rgba(60, 20, 20, 0.1)`; // Dark veins on light stone
        }
        context.fill();
      }
    }

    const init = () => {
      if (!parent) return;
      branches = [];
      branches.push(new Branch(0, 0, Math.PI / 4, 9));
      branches.push(new Branch(parent.offsetWidth, parent.offsetHeight, -3 * Math.PI / 4, 9));
      branches.push(new Branch(parent.offsetWidth, 0, 3 * Math.PI / 4, 8));
    };

    const animate = () => {
      branches.forEach((b) => {
        if (!b.finished) {
          b.update();
          b.draw(ctx);
        }
      });
      rafId = requestAnimationFrame(animate);
    };

    const resize = () => {
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      init();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    // Slight delay to ensure layout is ready
    setTimeout(() => {
        resize();
        animate();
    }, 100);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [theme]); // Re-run when theme changes

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay z-0" 
    />
  );
};

export default StoneVeins;
