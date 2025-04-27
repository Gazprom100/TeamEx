import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import useSafeAnimation from '../hooks/useSafeAnimation';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: var(--z-background);
  overflow: hidden;
  background: var(--bg-primary);
`;

const StyledCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.4;
`;

const GradientOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 50% 10%, 
    rgba(var(--accent-primary-rgb), 0.15) 0%, 
    rgba(var(--accent-secondary-rgb), 0.05) 30%, 
    rgba(0, 0, 0, 0.8) 80%
  );
  z-index: 0;
  
  @media (prefers-reduced-motion: reduce) {
    opacity: 1 !important;
  }
`;

const ParticlesBackground = ({ 
  type = 'default', 
  density = 'auto', // 'low', 'medium', 'high', 'auto'
  speed = 'medium',  // 'slow', 'medium', 'fast',
  color = 'theme'    // 'theme', 'blue', 'green', 'white'
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [canvasSupported, setCanvasSupported] = useState(true);
  const { isMounted } = useSafeAnimation(300);
  
  // Determine if we should use simple mode based on device performance
  const [simpleMode, setSimpleMode] = useState(false);
  
  useEffect(() => {
    // Check device performance and set simple mode for low-end devices
    const checkPerformance = () => {
      // Check if we're on a mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Check if reduced motion is preferred
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Check if it's a low memory device
      const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
      
      // Use simple mode if any condition is true or density is set to low
      setSimpleMode(isMobile || prefersReducedMotion || isLowMemory || density === 'low');
    };
    
    checkPerformance();
    
    // Also check if canvas is supported
    try {
      const canvas = document.createElement('canvas');
      setCanvasSupported(!!canvas.getContext('2d'));
    } catch (e) {
      setCanvasSupported(false);
    }
  }, [density]);
  
  // Get particle color based on settings
  const getParticleColor = useCallback(() => {
    switch (color) {
      case 'blue':
        return 'rgba(56, 139, 253, ';
      case 'green':
        return 'rgba(46, 160, 67, ';
      case 'white':
        return 'rgba(255, 255, 255, ';
      default: // theme
        return `rgba(var(--accent-primary-rgb), `;
    }
  }, [color]);
  
  // Get speed multiplier based on settings
  const getSpeedMultiplier = useCallback(() => {
    switch (speed) {
      case 'slow': return 0.5;
      case 'fast': return 1.5;
      default: return 1; // medium
    }
  }, [speed]);
  
  // Get number of particles based on density setting and screen size
  const getParticleCount = useCallback(() => {
    const screenArea = window.innerWidth * window.innerHeight;
    const baseDensity = Math.sqrt(screenArea) / 10;
    
    // Adjust based on density setting
    switch (density) {
      case 'low': return baseDensity * 0.3;
      case 'medium': return baseDensity * 0.6;
      case 'high': return baseDensity;
      default: // auto - based on device capability
        return simpleMode ? baseDensity * 0.3 : baseDensity * 0.6;
    }
  }, [density, simpleMode]);
  
  const initMatrix = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * canvas.height);
    }
    
    // Символы для отображения (можно заменить на другие наборы)
    const characters = '01';
    
    const particleColor = getParticleColor();
    const speedMult = getSpeedMultiplier();
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = `${particleColor}0.8)`;
      ctx.font = `${fontSize}px monospace`;
      
      for(let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i] += speedMult;
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
  }, [getParticleColor, getSpeedMultiplier]);
  
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particlesArray = [];
    const numberOfParticles = getParticleCount();
    const speedMult = getSpeedMultiplier();
    const particleColor = getParticleColor();
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() * 0.5 - 0.25) * speedMult;
        this.speedY = (Math.random() * 0.5 - 0.25) * speedMult;
        this.color = `${particleColor}${Math.random() * 0.2})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    function init() {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      // Only draw connections in high performance mode
      if (!simpleMode) {
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        
        const connectionDistance = canvas.width < 768 ? 80 : 100;
        
        for (let i = 0; i < particlesArray.length; i++) {
          // Optimize by only checking nearby particles
          for (let j = i; j < Math.min(i + 20, particlesArray.length); j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < connectionDistance) {
              const opacity = 1 - distance / connectionDistance;
              ctx.strokeStyle = `${particleColor}${opacity * 0.1})`;
              ctx.beginPath();
              ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
              ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
              ctx.stroke();
            }
          }
        }
        
        ctx.restore();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    }
    
    init();
    animate();
  }, [getParticleCount, getSpeedMultiplier, getParticleColor, simpleMode]);

  useEffect(() => {
    if (!canvasSupported || !isMounted) return;
    
    let timeout;
    
    // Delayed initialization for better performance during page load
    timeout = setTimeout(() => {
      if (type === 'matrix') {
        initMatrix();
      } else {
        initParticles();
      }
    }, 300);
    
    const handleResize = () => {
      if (canvasRef.current && animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        
        // Debounce resize to improve performance
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
          
          if (type === 'matrix') {
            initMatrix();
          } else {
            initParticles();
          }
        }, 200);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [type, initMatrix, initParticles, canvasSupported, isMounted]);
  
  // Don't render canvas if not supported or in reduced motion mode
  if (!canvasSupported || !isMounted) {
    return (
      <BackgroundContainer>
        <GradientOverlay style={{ opacity: 1 }} />
      </BackgroundContainer>
    );
  }
  
  return (
    <BackgroundContainer>
      <StyledCanvas ref={canvasRef} />
      <GradientOverlay 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
    </BackgroundContainer>
  );
};

export default ParticlesBackground; 