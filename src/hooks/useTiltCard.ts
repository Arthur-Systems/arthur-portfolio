'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface TiltOptions {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  easing?: string;
}

export const useTiltCard = (options: TiltOptions = {}) => {
  const {
    maxTilt = 15,
    perspective = 1000,
    scale = 1.05,
    speed = 0.5,
    easing = 'power2.out',
  } = options;

  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX = (e.clientX - centerX) / (rect.width / 2);
      mouseY = (e.clientY - centerY) / (rect.height / 2);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      gsap.to(card, {
        scale,
        duration: speed,
        ease: easing,
      });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      gsap.to(card, {
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        duration: speed,
        ease: easing,
      });
    };

    const animate = () => {
      if (isHovered) {
        targetX = mouseX * maxTilt;
        targetY = -mouseY * maxTilt;
        
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;
        
        gsap.set(card, {
          rotateX: currentY,
          rotateY: currentX,
          transformPerspective: perspective,
        });
      }
      
      requestAnimationFrame(animate);
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    const animationId = requestAnimationFrame(animate);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [maxTilt, perspective, scale, speed, easing, isHovered]);

  return cardRef;
};