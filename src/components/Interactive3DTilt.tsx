import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'motion/react';

interface Interactive3DTiltProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number;
  scaleHover?: number;
  glare?: boolean;
  glareOpacity?: number;
  perspective?: number;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  id?: string;
}

export function Interactive3DTilt({
  children,
  className = "",
  style = {},
  maxTilt = 12,
  scaleHover = 1.03,
  glare = true,
  glareOpacity = 0.25,
  perspective = 1000,
  onClick,
  id
}: Interactive3DTiltProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // High-frequency spring physics optimized for 120Hz/240Hz screens & 200+ FPS GPU acceleration
  const rotateX = useSpring(0, { stiffness: 280, damping: 24, mass: 0.3, restDelta: 0.0001 });
  const rotateY = useSpring(0, { stiffness: 280, damping: 24, mass: 0.3, restDelta: 0.0001 });
  const scale = useSpring(1, { stiffness: 280, damping: 24, mass: 0.3, restDelta: 0.0001 });
  
  // Dynamic Glare Position
  const glareX = useSpring(50, { stiffness: 280, damping: 24 });
  const glareY = useSpring(50, { stiffness: 280, damping: 24 });
  const glareAlpha = useSpring(0, { stiffness: 280, damping: 24 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width === 0 || height === 0) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = mouseX - width / 2;
    const centerY = mouseY - height / 2;

    const targetX = -(centerY / (height / 2)) * maxTilt;
    const targetY = (centerX / (width / 2)) * maxTilt;

    rotateX.set(targetX);
    rotateY.set(targetY);

    if (glare) {
      glareX.set((mouseX / width) * 100);
      glareY.set((mouseY / height) * 100);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(scaleHover);
    if (glare) glareAlpha.set(glareOpacity);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    if (glare) glareAlpha.set(0);
  };

  return (
    <div
      id={id}
      ref={containerRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none ${className}`}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
        ...style
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
          willChange: 'transform'
        }}
        className="relative w-full h-full"
      >
        {children}

        {/* Dynamic 3D Glare Reflection Ray */}
        {glare && (
          <motion.div
            style={{
              opacity: glareAlpha,
              background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 75%)`,
              transform: 'translateZ(60px)',
              pointerEvents: 'none'
            }}
            className="absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-50 overflow-hidden mix-blend-overlay"
          />
        )}
      </motion.div>
    </div>
  );
}
