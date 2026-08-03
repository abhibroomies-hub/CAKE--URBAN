import { useState, useEffect } from 'react';
import { WifiOff, Zap, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    // Register Service Worker for offline PWA speed boost
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.log('SW registration skipped:', err);
        });
      });
    }

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => {
      setIsOffline(false);
      setShowRestored(true);
      setTimeout(() => setShowRestored(false), 4000);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed top-0 inset-x-0 z-[9999] bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 px-4 py-2 text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl border-b border-amber-300/40"
        >
          <WifiOff className="w-4 h-4 animate-bounce" />
          <span>⚡ Offline View Active — All Cakes, 3D Models & Cart Saved locally!</span>
          <span className="hidden md:inline-block bg-slate-950/20 px-2 py-0.5 rounded-full text-[10px] font-bold">Fast Cached Mode</span>
        </motion.div>
      )}

      {showRestored && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed top-0 inset-x-0 z-[9999] bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-2 text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl border-b border-emerald-300/40"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Connection Restored — Live Sync Enabled!</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
