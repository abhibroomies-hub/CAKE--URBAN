import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Search, Heart, ShoppingBag, User, Sparkles, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUI, useCart } from '../lib/store';
import { playBtnTap } from '../lib/sound';
import { useTheme } from '../lib/theme';

export function MobileNav() {
  const location = useLocation();
  const { setSearchOpen } = useUI();
  const { activeTheme } = useTheme();
  const cartItems = useCart((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Keep track of clicked indexes for visual haptic ripples
  const [pulseIndex, setPulseIndex] = useState<number | null>(null);

  const NAV_ITEMS = [
    { icon: Home, label: 'Home', path: '/', color: '#FF5E84', bgLight: 'rgba(255, 94, 132, 0.15)' },
    { icon: Grid, label: 'Shop', path: '/shop', color: '#FFA800', bgLight: 'rgba(255, 168, 0, 0.15)' },
    { icon: Search, label: 'Search', action: () => setSearchOpen(true), color: '#00D5FA', bgLight: 'rgba(0, 213, 250, 0.15)' },
    // Center element will be our special highlighted theme color button (Custom Studio)
    { icon: ChefHat, label: 'Studio', path: '/custom-order', isCenter: true, color: '#FF3B81', bgLight: 'rgba(255, 59, 129, 0.15)' },
    { icon: Heart, label: 'Wishlist', path: '/profile?tab=wishlist', color: '#FF2E54', bgLight: 'rgba(255, 46, 84, 0.15)' },
    { icon: ShoppingBag, label: 'Cart', path: '/cart', badge: cartCount, color: '#10B981', bgLight: 'rgba(16, 185, 129, 0.15)' },
    { icon: User, label: 'Account', path: '/profile', color: '#9061F9', bgLight: 'rgba(144, 97, 249, 0.15)' },
  ];

  const handleTriggerPulse = (index: number) => {
    playBtnTap();
    setPulseIndex(index);
    setTimeout(() => setPulseIndex(null), 700);
  };

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[96%] max-w-[440px] select-none">
      {/* Curved Console Border Glow */}
      <div 
        className="absolute inset-0 blur-lg rounded-[36px] -z-10 transition-all duration-500" 
        style={{
          background: `linear-gradient(to top, ${activeTheme.accent}25, transparent)`
        }}
      />

      {/* Main Console */}
      <nav 
        className="relative backdrop-blur-2xl border rounded-[36px] px-2.5 py-2 flex items-center justify-between shadow-[0_24px_60px_rgba(0,0,0,0.5)] transition-all duration-500"
        style={{
          backgroundColor: activeTheme.isDark ? 'rgba(12, 6, 7, 0.96)' : 'rgba(255, 255, 255, 0.97)',
          borderColor: activeTheme.isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
        }}
      >
        
        {/* Subtle decorative theme line across the console layout */}
        <div 
          className="absolute left-6 right-6 top-[48%] h-[1px] pointer-events-none transition-all duration-500" 
          style={{
            background: `linear-gradient(to r, transparent, ${activeTheme.accent}15, transparent)`
          }}
        />

        {NAV_ITEMS.map((item, index) => {
          const isActive = item.path ? (location.pathname === item.path || (item.path.startsWith('/profile') && location.pathname === '/profile')) : false;
          const isPulseActive = pulseIndex === index;

          if (item.isCenter) {
            // CENTRAL PROMINENT CIRCULAR THEME COLOR BUTTON
            return (
              <div key={index} className="relative -mt-6 shrink-0 z-20">
                {/* Visual pulse rings radiating from center */}
                <div 
                  className="absolute -inset-1.5 rounded-full animate-ping duration-2000" 
                  style={{ backgroundColor: `${item.color}30` }}
                />
                <div 
                  className="absolute -inset-3.5 rounded-full animate-pulse duration-3000" 
                  style={{ backgroundColor: `${item.color}15` }}
                />
                
                <Link
                  to={item.path || '#'}
                  onClick={() => handleTriggerPulse(index)}
                  className="relative flex flex-col items-center justify-center w-15 h-15 rounded-full shadow-lg border-2 transition-all duration-300 scale-110 active:scale-95 group"
                  style={{
                    background: 'linear-gradient(135deg, #FF3F7C 0%, #FF8F3C 50%, #FFD000 100%)',
                    color: '#FFFFFF',
                    borderColor: activeTheme.isDark ? '#2D0A16' : '#FFFFFF'
                  }}
                >
                  <item.icon className="w-6 h-6 animate-pulse text-white" strokeWidth={2.5} />
                  <span className="text-[8px] font-black uppercase tracking-widest text-white leading-none mt-0.5">{item.label}</span>
                  
                  {/* Miniature decorative star */}
                  <div className="absolute -top-1 right-2">
                    <Sparkles className="w-3 h-3 text-white fill-white animate-spin-slow" />
                  </div>
                </Link>
              </div>
            );
          }

          const itemContent = (
            <div 
              className="flex flex-col items-center justify-center py-1 px-1.5 rounded-2xl transition-all duration-300 relative border border-transparent min-w-[42px]"
              style={{
                backgroundColor: isActive ? item.bgLight : 'transparent',
                borderColor: isActive ? `${item.color}35` : 'transparent'
              }}
            >
              {/* Dynamic Haptic Visual Pulse Ring */}
              <AnimatePresence>
                {isPulseActive && (
                  <motion.span
                    initial={{ scale: 0.2, opacity: 0.9 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 rounded-full filter blur-[2px] pointer-events-none -z-10"
                    style={{
                      background: `radial-gradient(circle, ${item.color}80 0%, transparent 70%)`
                    }}
                  />
                )}
              </AnimatePresence>

              <item.icon 
                className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] mb-0.5 transition-all duration-200" 
                strokeWidth={isActive ? 2.8 : 2.2} 
                style={{ 
                  color: item.color,
                  filter: `drop-shadow(0 2px 4px ${item.color}35)`
                }} 
              />
              
              <span 
                className="text-[8px] sm:text-[9.5px] font-black uppercase tracking-wide leading-none mt-0.5 transition-colors duration-300"
                style={{
                  color: isActive 
                    ? (activeTheme.isDark ? '#FFFFFF' : '#1A080E') 
                    : (activeTheme.isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(30, 10, 15, 0.85)')
                }}
              >
                {item.label}
              </span>
              
              {/* Cart Items count badge */}
              {item.badge !== undefined && item.badge > 0 && (
                <span 
                  className="absolute -top-1 -right-1 text-white text-[8px] font-black rounded-full h-3.5 w-3.5 flex items-center justify-center border"
                  style={{
                    backgroundColor: item.color,
                    borderColor: activeTheme.isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'
                  }}
                >
                  {item.badge}
                </span>
              )}
              
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 8px ${item.color}`
                  }}
                />
              )}
            </div>
          );

          if (item.action) {
            return (
              <button 
                key={index} 
                onClick={() => { handleTriggerPulse(index); item.action(); }}
                className="focus:outline-none shrink-0"
              >
                {itemContent}
              </button>
            );
          }

          return (
            <Link
              key={index}
              to={item.path || '#'}
              onClick={() => handleTriggerPulse(index)}
              className="shrink-0"
            >
              {itemContent}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
