import React from 'react';
import { motion } from 'motion/react';
import { playBtnTap } from '../lib/sound';

interface DashboardCardProps {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  count?: string | number;
  icon: 'orders' | 'alerts' | 'rewards' | 'addresses';
  isActive?: boolean;
  onClick?: () => void;
}

export const PatisserieDashboardCards: React.FC<{
  activeCard?: string;
  onSelectCard?: (id: string) => void;
  ordersCount?: number;
  unreadAlertsCount?: number;
  rewardsPoints?: number;
  savedAddressesCount?: number;
}> = ({
  activeCard = 'orders',
  onSelectCard,
  ordersCount = 0,
  unreadAlertsCount = 2,
  rewardsPoints = 450,
  savedAddressesCount = 2,
}) => {
  const cards: DashboardCardProps[] = [
    {
      id: 'orders',
      title: 'My Orders',
      subtitle: 'Track, view, reorder receipts',
      badge: ordersCount > 0 ? `${ordersCount} Active` : undefined,
      icon: 'orders',
    },
    {
      id: 'notifications',
      title: 'Milestone Alerts',
      subtitle: 'Birthday & anniversary alerts',
      badge: unreadAlertsCount > 0 ? `${unreadAlertsCount} New` : undefined,
      icon: 'alerts',
    },
    {
      id: 'rewards',
      title: 'Rewards Program',
      subtitle: `${rewardsPoints} Pts • Gourmet perks`,
      badge: 'Tier I',
      icon: 'rewards',
    },
    {
      id: 'addresses',
      title: 'Saved Addresses',
      subtitle: `${savedAddressesCount} Delivery coordinates`,
      icon: 'addresses',
    },
  ];

  return (
    <div className="relative w-full overflow-hidden rounded-[32px] p-6 sm:p-8 bg-[#0D0D0F] border border-[#DFB15B]/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] my-8">
      {/* Background Ambient Gold Particles & Light Trails */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Gold Ambient Glows */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#DFB15B]/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-[#DFB15B]/8 rounded-full blur-[110px]" />
        
        {/* Subtle Geometric Wireframe Etching Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="patisserie-wireframe-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#DFB15B" strokeWidth="0.5" strokeDasharray="2 4" />
              <circle cx="20" cy="20" r="1" fill="#DFB15B" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#patisserie-wireframe-grid)" />
        </svg>

        {/* Floating Gold Light Trails */}
        <motion.div 
          animate={{ x: [-100, 800], opacity: [0, 0.4, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="absolute top-1/2 left-0 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#DFB15B] to-transparent blur-[0.5px]"
        />
        <motion.div 
          animate={{ x: [800, -100], opacity: [0, 0.3, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear", delay: 2 }}
          className="absolute top-1/3 left-0 w-64 h-[1px] bg-gradient-to-r from-transparent via-[#DFB15B] to-transparent blur-[0.5px]"
        />
      </div>

      {/* Header Tagline */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-[#DFB15B]/15 mb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#DFB15B] block mb-1">
            HAUTE PATISSERIE MEMBER LOUNGE
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            Unified Artisan Dashboard
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#DFB15B] animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
            Gold Wireframe Suite
          </span>
        </div>
      </div>

      {/* Unified Cards Grid in Single Row */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card) => {
          const isSelected = activeCard === card.id;

          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                playBtnTap();
                if (onSelectCard) onSelectCard(card.id);
              }}
              className={`group relative rounded-[24px] p-6 text-center cursor-pointer transition-all duration-300 overflow-hidden flex flex-col items-center justify-between min-h-[220px] ${
                isSelected
                  ? 'bg-gradient-to-b from-[#1C1812]/90 to-[#121113]/95 border-2 border-[#DFB15B] shadow-[0_0_35px_rgba(223,177,91,0.35)]'
                  : 'bg-[#151518]/70 backdrop-blur-xl border border-[#DFB15B]/25 hover:border-[#DFB15B]/60 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(223,177,91,0.2)]'
              }`}
            >
              {/* Frosted Glass Internal Halo / Edge Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
              
              {/* Internal Delicate Wireframe Border Inset */}
              <div className="absolute inset-1.5 rounded-[20px] border border-[#DFB15B]/15 group-hover:border-[#DFB15B]/30 pointer-events-none transition-colors" />

              {/* Badge if available */}
              {card.badge && (
                <div className="absolute top-3.5 right-3.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#DFB15B]/20 text-[#DFB15B] border border-[#DFB15B]/40 shadow-sm">
                    {card.badge}
                  </span>
                </div>
              )}

              {/* Top Gilded Line-Art Icon */}
              <div className="pt-2 pb-3">
                <div className="w-16 h-16 mx-auto relative flex items-center justify-center">
                  {/* Soft Radiant Backglow */}
                  <div className="absolute inset-0 bg-[#DFB15B]/15 rounded-full blur-md group-hover:bg-[#DFB15B]/30 transition-all duration-300" />
                  
                  {card.icon === 'orders' && (
                    /* Detailed gilded sketch of a multi-tier cake with a magnifying glass at the top */
                    <svg className="w-12 h-12 text-[#DFB15B] relative z-10 transition-transform group-hover:scale-110" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      {/* Cake Base Tier */}
                      <path d="M12 48 C12 44, 52 44, 52 48 L52 56 C52 60, 12 60, 12 56 Z" stroke="#DFB15B" fill="#DFB15B" fillOpacity="0.08" />
                      {/* Middle Tier */}
                      <path d="M18 36 C18 32, 46 32, 46 36 L46 44 C46 48, 18 48, 18 44 Z" stroke="#DFB15B" fill="#DFB15B" fillOpacity="0.12" />
                      {/* Top Tier */}
                      <path d="M24 26 C24 23, 40 23, 40 26 L40 32 C40 35, 24 35, 24 32 Z" stroke="#DFB15B" fill="#DFB15B" fillOpacity="0.16" />
                      {/* Delicate Frosting Droplets */}
                      <path d="M18 36 Q25 40 32 36 Q39 40 46 36" stroke="#DFB15B" strokeWidth="1" />
                      <path d="M12 48 Q22 52 32 48 Q42 52 52 48" stroke="#DFB15B" strokeWidth="1" />
                      {/* Magnifying Glass Over Top */}
                      <circle cx="36" cy="16" r="7" stroke="#FFE194" strokeWidth="2" fill="#DFB15B" fillOpacity="0.25" />
                      <line x1="41" y1="21" x2="48" y2="28" stroke="#FFE194" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="36" cy="16" r="3" stroke="#FFE194" strokeWidth="0.8" strokeDasharray="1 1" />
                    </svg>
                  )}

                  {card.icon === 'alerts' && (
                    /* Gilded envelope icon with milestone seal & sparkles */
                    <svg className="w-12 h-12 text-[#DFB15B] relative z-10 transition-transform group-hover:scale-110" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="10" y="18" width="44" height="32" rx="4" stroke="#DFB15B" fill="#DFB15B" fillOpacity="0.1" />
                      <path d="M10 20 L32 36 L54 20" stroke="#FFE194" strokeWidth="1.75" />
                      <path d="M10 50 L26 34" stroke="#DFB15B" strokeWidth="1.2" />
                      <path d="M54 50 L38 34" stroke="#DFB15B" strokeWidth="1.2" />
                      {/* Gold Royal Seal */}
                      <circle cx="32" cy="36" r="6" stroke="#DFB15B" fill="#DFB15B" />
                      <path d="M30 36 L32 38 L35 34" stroke="#0D0D0F" strokeWidth="1.5" />
                      {/* Sparkles */}
                      <path d="M48 12 L50 16 L54 18 L50 20 L48 24 L46 20 L42 18 L46 16 Z" fill="#FFE194" />
                    </svg>
                  )}

                  {card.icon === 'rewards' && (
                    /* Gilded gift box icon with ribbon & sparkles */
                    <svg className="w-12 h-12 text-[#DFB15B] relative z-10 transition-transform group-hover:scale-110" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="14" y="24" width="36" height="30" rx="3" stroke="#DFB15B" fill="#DFB15B" fillOpacity="0.1" />
                      <rect x="10" y="18" width="44" height="8" rx="2" stroke="#FFE194" fill="#DFB15B" fillOpacity="0.2" strokeWidth="1.75" />
                      <line x1="32" y1="18" x2="32" y2="54" stroke="#FFE194" strokeWidth="2" />
                      {/* Ribbon Bow */}
                      <path d="M32 18 C28 10, 18 10, 22 18 C26 18, 32 18, 32 18 Z" stroke="#FFE194" fill="#DFB15B" fillOpacity="0.3" />
                      <path d="M32 18 C36 10, 46 10, 42 18 C38 18, 32 18, 32 18 Z" stroke="#FFE194" fill="#DFB15B" fillOpacity="0.3" />
                      {/* Sparkles */}
                      <circle cx="16" cy="14" r="1.5" fill="#FFE194" />
                      <circle cx="48" cy="12" r="1.5" fill="#FFE194" />
                    </svg>
                  )}

                  {card.icon === 'addresses' && (
                    /* Gilded location pin with radar rings */
                    <svg className="w-12 h-12 text-[#DFB15B] relative z-10 transition-transform group-hover:scale-110" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      {/* Ground Radar Rings */}
                      <ellipse cx="32" cy="52" rx="16" ry="5" stroke="#DFB15B" strokeWidth="1" strokeDasharray="3 3" fill="#DFB15B" fillOpacity="0.05" />
                      <ellipse cx="32" cy="52" rx="8" ry="2.5" stroke="#FFE194" strokeWidth="1.2" />
                      {/* Location Pin */}
                      <path d="M32 12 C23 12 16 19 16 28 C16 39 32 50 32 50 C32 50 48 39 48 28 C48 19 41 12 32 12 Z" stroke="#FFE194" strokeWidth="2" fill="#DFB15B" fillOpacity="0.18" />
                      <circle cx="32" cy="26" r="5" stroke="#FFE194" strokeWidth="1.5" fill="#DFB15B" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Central Title & Legible Serif Font */}
              <div className="space-y-1.5 w-full">
                <h4 className="text-lg font-serif font-bold text-white tracking-wide group-hover:text-[#FFE194] transition-colors">
                  {card.title}
                </h4>
                <p className="text-[11px] font-sans text-zinc-400 font-medium leading-relaxed max-w-[180px] mx-auto">
                  {card.subtitle}
                </p>
              </div>

              {/* Bottom Subtle Indicator / Action Indicator */}
              <div className="pt-4 mt-2 w-full border-t border-white/5 flex items-center justify-center">
                <span className={`text-[9px] font-black uppercase tracking-widest transition-all ${
                  isSelected ? 'text-[#DFB15B]' : 'text-zinc-500 group-hover:text-[#DFB15B]'
                }`}>
                  {isSelected ? '✦ ACTIVE VIEW' : 'EXPLORE ➔'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
