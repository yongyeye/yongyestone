
import React, { useEffect, useRef } from 'react';

interface Props {
  isActive: boolean;
  type: 'fracture' | 'rain';
  onMidpoint: () => void;
  onComplete: () => void;
}

const PageTransition: React.FC<Props> = ({ isActive, type, onMidpoint, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    startTimeRef.current = Date.now();

    let particles: any[] = [];
    
    // Initialize logic based on type
    if (type === 'fracture') {
        // Generate a random crack path
        const startX = Math.random() * canvas.width;
        const endX = Math.random() * canvas.width;
        const points = [];
        let currX = startX;
        let currY = 0;
        const segments = 20;
        const stepY = canvas.height / segments;
        
        points.push({x: currX, y: currY});
        for(let i=0; i<segments; i++) {
            currY += stepY;
            currX += (Math.random() - 0.5) * 200; // Jaggedness
            points.push({x: currX, y: currY});
        }
        particles = points;
    } else if (type === 'rain') {
        // Initialize rain drops
        for(let i=0; i<15; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: -Math.random() * 500,
                speed: 15 + Math.random() * 20,
                size: 2 + Math.random() * 3,
                splatY: Math.random() * canvas.height * 0.8 + canvas.height * 0.1,
                state: 'falling', // falling, splatting
                splatRadius: 0,
                maxSplat: 50 + Math.random() * 100
            });
        }
    }

    let midPointTriggered = false;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Trigger content change halfway through
      if (!midPointTriggered && elapsed > 800) {
          onMidpoint();
          midPointTriggered = true;
      }

      if (elapsed > 1800) {
          onComplete();
          return;
      }

      if (type === 'fracture') {
        // FRACTURE ANIMATION
        const progress = Math.min(elapsed / 400, 1); // Draw fast
        const fade = elapsed > 1000 ? 1 - (elapsed - 1000)/800 : 1;

        if (fade <= 0) { 
            // End
        } else {
            ctx.save();
            ctx.globalAlpha = fade;
            
            // Draw the crack
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(220, 38, 38, 0.9)'; // Red
            ctx.lineWidth = 3 + Math.random() * 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(255, 200, 200, 0.8)';
            
            const drawCount = Math.floor(particles.length * progress);
            
            if (drawCount > 0) {
                ctx.moveTo(particles[0].x, particles[0].y);
                for(let i=1; i<drawCount; i++) {
                    ctx.lineTo(particles[i].x, particles[i].y);
                }
                ctx.stroke();
            }

            // Flash screen
            if (elapsed < 100) {
                ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * (1 - elapsed/100)})`;
                ctx.fillRect(0,0, canvas.width, canvas.height);
            }

            ctx.restore();
        }

      } else if (type === 'rain') {
        // BLOOD RAIN ANIMATION
        ctx.save();
        
        // Global fade out at the end
        if (elapsed > 1200) {
            ctx.globalAlpha = 1 - (elapsed - 1200) / 600;
        }

        particles.forEach(p => {
            if (p.state === 'falling') {
                p.y += p.speed;
                ctx.fillStyle = '#7f1d1d'; // Deep red
                ctx.beginPath();
                ctx.rect(p.x, p.y, p.size, p.size * 4);
                ctx.fill();

                if (p.y >= p.splatY) {
                    p.state = 'splatting';
                }
            } else if (p.state === 'splatting') {
                // Expand splat
                p.splatRadius += (p.maxSplat - p.splatRadius) * 0.1;
                
                ctx.fillStyle = 'rgba(127, 29, 29, 0.8)'; // Blood color
                ctx.beginPath();
                ctx.arc(p.x, p.splatY, p.splatRadius, 0, Math.PI * 2);
                ctx.fill();
                
                // Drips from splat
                ctx.beginPath();
                ctx.moveTo(p.x, p.splatY);
                ctx.lineTo(p.x, p.splatY + p.splatRadius * 1.5);
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(127, 29, 29, 0.6)';
                ctx.stroke();
            }
        });
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, type, onMidpoint, onComplete]);

  if (!isActive) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-[60] pointer-events-none"
    />
  );
};

export default PageTransition;
