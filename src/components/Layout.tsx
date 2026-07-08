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
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useTheme } from '../lib/theme';
import { useLocation } from 'react-router-dom';

export function Layout({ children }: { children: React.ReactNode }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const backgroundRef = React.useRef<HTMLDivElement>(null);
  const { activeTheme } = useTheme();
  const location = useLocation();
  
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (isHomePage) return;
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
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;
        backgroundRef.current.style.setProperty('--scroll-y', `${scrollY}`);
        backgroundRef.current.style.setProperty('--scroll-y-px', `${scrollY}px`);
        backgroundRef.current.style.setProperty('--scroll-percent', `${scrollPercent}`);
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
  }, [isHomePage]);

  if (isHomePage) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden text-slate-900 font-sans flex flex-col">
        <Header />
        <main className="flex-grow flex-1 flex flex-col relative z-10">
          {children}
        </main>
        <MobileNav />
        <AIPersonalShopper />
        <GlobalFloatingActions />
        <Toaster position="top-center" richColors />
      </div>
    );
  }

  const fillAccent = (activeTheme?.accent || '#FF4FA3').replace('#', '%23');
  const bgPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cg fill='${fillAccent}' fill-opacity='0.035'%3E%3Cpath d='M15 15c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5zm0 80c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5zm80 0c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5zm0-80c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5zm-50 40c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3zM25 55c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v2c0 .6-.4 1-1 1h-6a1 1 0 01-1-1v-2zm80 0c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v2c0 .6-.4 1-1 1h-6a1 1 0 01-1-1v-2zm-40-5C65 42 75 32 75 32s10 10 10 18H65zm0 14h20v2H65v-2zM15 130l5-3 5 3v6h-10v-6zm80 0l5-3 5 3v6H95v-6z'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col relative overflow-hidden transition-all duration-700"
      style={{ 
        backgroundColor: 'var(--theme-bg)',
        backgroundImage: `${bgPattern}, linear-gradient(to bottom, var(--theme-bg) 0%, var(--theme-bg-via) 50%, var(--theme-bg-to) 100%)`,
        backgroundAttachment: 'fixed, scroll, fixed',
        backgroundSize: 'auto, cover, cover',
        backgroundPosition: 'center',
        color: 'var(--theme-text)'
      }}
    >
      {/* 3D Glossy Live Moving Wave Elements & Mouse Tracker Parallax Layers */}
      <div ref={backgroundRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* Dynamic Premium Ambient Luxury Video Background Layer - Only active in dark mode */}
        {activeTheme.isDark && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="hidden md:block fixed inset-0 w-screen h-screen object-cover opacity-[0.22] pointer-events-none mix-blend-screen z-0"
            poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-golden-particles-slowly-drifting-in-the-air-42353-large.mp4" type="video/mp4" />
          </video>
        )}

        {/* Dynamic Sweeping Diagonal Metallic Reflection / Glass Sheen - Hidden on mobile to save layout cycles */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.045] to-transparent -translate-y-full rotate-12 animate-glossy-sheen pointer-events-none" />

        {/* Dynamic interactive background gradient tracking the cursor - Hidden on mobile */}
        <div 
          className="hidden md:block absolute inset-0 opacity-40 transition-transform duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle 480px at var(--mouse-px, 50%) var(--mouse-py, 50%), ${activeTheme.accentLight}, transparent)`,
          }}
        />

        {/* Interactive Smooth Camel Gold Shifting Blob with parallax drift - Hidden on mobile */}
        <div className="hidden md:block absolute top-[-10%] left-[-15%] w-[80vw] h-[80vw] sm:w-[60vw] sm:h-[60vw] animate-wave-slow mix-blend-multiply pointer-events-none opacity-40">
          <div 
            className="w-full h-full opacity-[0.14] blur-[100px] sm:blur-[140px] rounded-full transition-none"
            style={{
              backgroundColor: activeTheme.accent,
              transform: `translate3d(calc(var(--mouse-x, 0) * -25px), calc(var(--mouse-y, 0) * -25px + var(--scroll-y, 0) * 0.1px), 0)`,
              willChange: 'transform'
            }}
          />
        </div>
        
        {/* Luxurious Rose Syrup Shifting Blob with inverse parallax drift - Hidden on mobile */}
        <div className="hidden md:block absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] sm:w-[65vw] sm:h-[65vw] animate-wave-secondary mix-blend-multiply pointer-events-none opacity-40">
          <div 
            className="w-full h-full opacity-[0.11] blur-[120px] sm:blur-[160px] rounded-full transition-none" 
            style={{
              backgroundColor: activeTheme.accent,
              transform: `translate3d(calc(var(--mouse-x, 0) * 25px), calc(var(--mouse-y, 0) * 25px - var(--scroll-y, 0) * 0.15px), 0)`,
              willChange: 'transform'
            }}
          />
        </div>
        
        {/* Ambient Velvet Fudge Accent Blob - Hidden on mobile */}
        <div className="hidden md:block absolute top-[35%] left-[20%] w-[60vw] h-[60vw] animate-wave-third pointer-events-none opacity-30">
          <div 
            className="w-full h-full bg-[#FF4FA3] opacity-[0.06] blur-[110px] sm:blur-[130px] rounded-full transition-none"
            style={{
              transform: `translate3d(calc(var(--mouse-x, 0) * -10px), calc(var(--mouse-y, 0) * 15px + var(--scroll-y, 0) * 0.05px), 0)`,
              willChange: 'transform'
            }}
          />
        </div>

        {/* Realistic Translucent 3D Floating Glass Spheres with real drop-shadows (4D depth layer) - Hidden on mobile to prevent extreme rendering overhead */}
        <div 
          className="hidden md:block absolute top-[18%] left-[8%] w-16 h-16 rounded-full bg-pink-100/10 border border-pink-200/20 shadow-2xl backdrop-blur-sm"
          style={{
            transform: `translate3d(calc(var(--mouse-x, 0) * -35px), calc(var(--mouse-y, 0) * -35px + var(--scroll-y, 0) * 0.12px), 0) rotate(calc(var(--mouse-x, 0) * 12deg))`,
            boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.05), inset 8px 8px 20px rgba(255,255,255,0.2), 0 20px 40px rgba(255,100,180,0.08)',
            willChange: 'transform'
          }}
        />

        <div 
          className="hidden md:block absolute bottom-[22%] right-[12%] w-24 h-24 rounded-full bg-pink-100/5 border border-pink-200/10 shadow-2xl backdrop-blur-sm"
          style={{
            transform: `translate3d(calc(var(--mouse-x, 0) * 40px), calc(var(--mouse-y, 0) * 40px - var(--scroll-y, 0) * 0.18px), 0) rotate(calc(var(--mouse-y, 0) * -15deg))`,
            boxShadow: 'inset -12px -12px 30px rgba(0,0,0,0.06), inset 12px 12px 30px rgba(255,255,255,0.15), 0 35px 50px rgba(255,100,180,0.05)',
            willChange: 'transform'
          }}
        />

        <div 
          className="hidden md:block absolute top-[65%] left-[85%] w-12 h-12 rounded-full bg-pink-200/[0.08] border border-pink-300/20 shadow-2xl backdrop-blur-sm"
          style={{
            transform: `translate3d(calc(var(--mouse-x, 0) * -20px), calc(var(--mouse-y, 0) * -20px + var(--scroll-y, 0) * 0.08px), 0)`,
            boxShadow: 'inset -5px -5px 12px rgba(0,0,0,0.04), inset 5px 5px 12px rgba(255,255,255,0.2), 0 15px 30px rgba(255,100,180,0.06)',
            willChange: 'transform'
          }}
        />
      </div>

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
