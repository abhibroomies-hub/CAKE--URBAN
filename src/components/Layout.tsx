import React, { useState, useEffect } from 'react';
import { Header, AISearchModal } from './Header';
import { Footer } from './Footer';
import { Toaster } from 'sonner';
import { AnnouncementBar } from './AnnouncementBar';
import { FloatingElements } from './FloatingElements';
import { MobileNav } from './MobileNav';
import { AIPersonalShopper } from './AIPersonalShopper';
import { GlobalFloatingActions } from './GlobalFloatingActions';
import { LiveToastAndExitPopup } from './LiveToastAndExitPopup';
import { OfflineBanner } from './OfflineBanner';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useTheme } from '../lib/theme';
import { useLocation } from 'react-router-dom';

export function Layout({ children }: { children: React.ReactNode }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const backgroundRef = React.useRef<HTMLDivElement>(null);
  const { activeTheme } = useTheme();

  useEffect(() => {
    let frameId: number;
    const handleMove = (e: MouseEvent) => {
      if (!backgroundRef.current) return;
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        if (!backgroundRef.current) return;
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        const px = ((x + 1) / 2) * 100;
        const py = ((y + 1) / 2) * 100;
        backgroundRef.current.style.setProperty('--mouse-x', `${x}`);
        backgroundRef.current.style.setProperty('--mouse-y', `${y}`);
        backgroundRef.current.style.setProperty('--mouse-px', `${px}%`);
        backgroundRef.current.style.setProperty('--mouse-py', `${py}%`);
      });
    };

    let scrollFrameId: number;
    const handleScroll = () => {
      if (!backgroundRef.current) return;
      cancelAnimationFrame(scrollFrameId);
      scrollFrameId = requestAnimationFrame(() => {
        if (!backgroundRef.current) return;
        const currentScrollY = window.scrollY;
        backgroundRef.current.style.setProperty('--scroll-y', `${currentScrollY}`);
      });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(scrollFrameId);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fillAccent = (activeTheme?.accent || '#FF4FA3').replace('#', '%23');
  const bgPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cg fill='${fillAccent}' fill-opacity='0.035'%3E%3Cpath d='M15 15c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5zm0 80c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5zm80 0c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5zm0-80c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5zm-50 40c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3zM25 55c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v2c0 .6-.4 1-1 1h-6a1 1 0 01-1-1v-2zm80 0c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v2c0 .6-.4 1-1 1h-6a1 1 0 01-1-1v-2zm-40-5C65 42 75 32 75 32s10 10 10 18H65zm0 14h20v2H65v-2zM15 130l5-3 5 3v6h-10v-6zm80 0l5-3 5 3v6H95v-6z'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col relative overflow-hidden transition-all duration-700 bg-transparent text-[#FFFDFB]"
    >
      {/* 3D FULL WEBSITE PARALLAX & AMBIENT TEXTURE LAYER */}
      <div ref={backgroundRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Dynamic Sweeping Diagonal Sheen */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent -translate-y-full rotate-12 animate-glossy-sheen pointer-events-none" />

        {/* Dynamic Mouse Light Tracking */}
        <div 
          className="hidden md:block absolute inset-0 opacity-35 will-change-transform"
          style={{
            background: `radial-gradient(circle 550px at var(--mouse-px, 50%) var(--mouse-py, 50%), ${activeTheme?.accent || '#C9A24B'}45, transparent)`,
          }}
        />

        {/* Interactive Smooth Shifting Blob with parallax drift */}
        <div className="absolute top-[-10%] left-[-15%] w-[70vw] h-[70vw] pointer-events-none opacity-30">
          <div 
            className="w-full h-full opacity-[0.25] blur-[140px] rounded-full will-change-transform"
            style={{
              backgroundColor: activeTheme?.accent || '#C9A24B',
              transform: `translate3d(calc(var(--mouse-x, 0) * -20px), calc(var(--scroll-y, 0) * -0.08px), 0)`
            }}
          />
        </div>
        
        {/* Secondary Shifting Blob with inverse parallax drift */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] pointer-events-none opacity-25">
          <div 
            className="w-full h-full opacity-[0.2] blur-[160px] rounded-full will-change-transform" 
            style={{
              backgroundColor: activeTheme?.accent || '#C9A24B',
              transform: `translate3d(calc(var(--mouse-x, 0) * 20px), calc(var(--scroll-y, 0) * -0.12px), 0)`
            }}
          />
        </div>

        {/* Floating 3D Perspective Glass Spheres / Bakery Cubes */}
        <div 
          className="hidden md:block absolute top-[20%] left-[5%] w-20 h-20 rounded-3xl bg-gradient-to-br from-[#DFB15B]/20 to-[#26130F] border border-[#DFB15B]/30 backdrop-blur-md shadow-2xl p-2.5 will-change-transform"
          style={{
            transform: `perspective(1000px) rotateY(12deg) rotateX(8deg) translate3d(calc(var(--mouse-x, 0) * -25px), calc(var(--scroll-y, 0) * -0.15px), 30px)`
          }}
        >
          <div className="w-full h-full rounded-2xl bg-black/40 flex items-center justify-center text-[#DFB15B]">
            <span className="text-xl font-black">✨</span>
          </div>
        </div>

        <div 
          className="hidden md:block absolute top-[50%] right-[4%] w-24 h-24 rounded-3xl bg-gradient-to-br from-[#DE9088]/20 to-[#26130F] border border-[#DFB15B]/30 backdrop-blur-md shadow-2xl p-3 will-change-transform"
          style={{
            transform: `perspective(1000px) rotateY(-10deg) rotateX(10deg) translate3d(calc(var(--mouse-x, 0) * 30px), calc(var(--scroll-y, 0) * -0.18px), 50px)`
          }}
        >
          <div className="w-full h-full rounded-2xl bg-black/40 flex items-center justify-center text-[#DFB15B]">
            <span className="text-2xl font-black">🎂</span>
          </div>
        </div>
      </div>

      <OfflineBanner />
      <AnnouncementBar />
      <MobileNav />
      <FloatingElements />
      <AIPersonalShopper />
      <GlobalFloatingActions />
      <LiveToastAndExitPopup />
      
      <Header />
      <AISearchModal />

      <main className="flex-grow flex-1 flex flex-col relative z-10">
        {children}
      </main>
      
      <Footer />
      <Toaster position="top-center" richColors />
    </div>
  );
}
