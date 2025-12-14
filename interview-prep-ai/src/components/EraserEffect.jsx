import { useEffect, useRef } from 'react';

const EraserEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let startTime = Date.now();
    const duration = 2500; // 2.5 seconds animation

    const brushSize = 100;

    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Draw black overlay instead of white
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create eraser effect
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';

      // Multiple eraser strokes following animated path
      const pathCount = Math.floor(progress * 18);
      
      for (let i = 0; i < pathCount; i++) {
        const pathProgress = i / 18;
        const offsetX = (Math.sin(pathProgress * Math.PI * 2 + progress * Math.PI * 4) * 250 + canvas.width / 2);
        const offsetY = (Math.cos(pathProgress * Math.PI * 2 + progress * Math.PI * 4) * 180 + canvas.height / 2);

        const opacity = Math.max(0.4, 1 - (progress - pathProgress) * 2.5);
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        
        // Main eraser circle
        ctx.beginPath();
        ctx.arc(offsetX, offsetY, brushSize * (0.85 + Math.sin(progress * Math.PI) * 0.35), 0, Math.PI * 2);
        ctx.fill();

        // Secondary eraser particles for softer edges
        for (let j = 0; j < 6; j++) {
          const randomAngle = (pathProgress + j * 0.1) * Math.PI * 2;
          const randomDist = (j / 6) * 350 * progress;
          const rx = offsetX + Math.cos(randomAngle) * randomDist;
          const ry = offsetY + Math.sin(randomAngle) * randomDist;
          
          ctx.fillStyle = `rgba(0, 0, 0, ${opacity * (1 - j / 6) * 0.8})`;
          ctx.beginPath();
          ctx.arc(rx, ry, brushSize * (0.55 * (1 - j / 6)), 0, Math.PI * 2);
          ctx.fill();
        }

        // Soft glow effect for professional look
        ctx.globalCompositeOperation = 'destination-out';
        for (let k = 0; k < 3; k++) {
          const glowRadius = brushSize * (1.2 + k * 0.3);
          const glowOpacity = opacity * (0.3 / (k + 1));
          ctx.fillStyle = `rgba(0, 0, 0, ${glowOpacity})`;
          ctx.beginPath();
          ctx.arc(offsetX, offsetY, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalCompositeOperation = 'source-over';

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        canvas.style.pointerEvents = 'none';
        canvas.style.opacity = '0';
        canvas.style.transition = 'opacity 0.6s ease-out';
      }
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        transition: 'opacity 0.6s ease-out'
      }}
    />
  );
};

export default EraserEffect;