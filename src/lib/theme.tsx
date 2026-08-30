import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { toast } from 'sonner';

export interface ThemePreset {
  id: string;
  name: string;
  icon: string;
  bgToTr: string;
  bg: string;
  bgVia: string;
  bgTo: string;
  text: string;
  textMuted: string;
  accent: string;
  accentLight: string;
  accentHover: string;
  card: string;
  cardHover: string;
  border: string;
  contrast: string;
  contrastHover?: string;
  glass: string;
  isDark: boolean;
  description: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'midnight-champagne',
    name: 'Midnight Champagne',
    icon: '✨',
    bgToTr: 'Midnight Champagne Luxury',
    bg: '#0D0D0D',
    bgVia: '#171717',
    bgTo: '#080808',
    text: '#F5EFE0',
    textMuted: 'rgba(245, 239, 224, 0.68)',
    accent: '#C9A24B',
    accentLight: 'rgba(201, 162, 75, 0.15)',
    accentHover: '#E5C578',
    card: '#161616',
    cardHover: '#222222',
    border: 'rgba(201, 162, 75, 0.28)',
    contrast: '#0D0D0D',
    glass: 'rgba(13, 13, 13, 0.88)',
    isDark: true,
    description: 'Deep charcoal near-black background, warm champagne gold accents and highlights, subtle cream text. Elegant gold detailing, high-end patisserie feel.'
  },
  {
    id: 'dark-emerald-luxe',
    name: 'Dark Emerald Luxe',
    icon: '👑',
    bgToTr: 'Royal Emerald Luxury',
    bg: '#0B3D2E',
    bgVia: '#082E23',
    bgTo: '#052018',
    text: '#F8F4E9',
    textMuted: 'rgba(248, 244, 233, 0.68)',
    accent: '#D4AF37',
    accentLight: 'rgba(212, 175, 55, 0.16)',
    accentHover: '#F3D268',
    card: '#0E4A38',
    cardHover: '#135E47',
    border: 'rgba(212, 175, 55, 0.28)',
    contrast: '#0B3D2E',
    glass: 'rgba(11, 61, 46, 0.88)',
    isDark: true,
    description: 'Rich deep emerald green background, elegant gold accents, soft ivory text. Sophisticated royal luxury feel.'
  },
  {
    id: 'wine-rose-gold',
    name: 'Wine & Rose Gold',
    icon: '🍷',
    bgToTr: 'Oxblood Wine & Rose Gold',
    bg: '#3A0D1C',
    bgVia: '#2C0915',
    bgTo: '#1E050E',
    text: '#F3E7E4',
    textMuted: 'rgba(243, 231, 228, 0.68)',
    accent: '#B76E79',
    accentLight: 'rgba(183, 110, 121, 0.16)',
    accentHover: '#D58E98',
    card: '#4D1427',
    cardHover: '#601B33',
    border: 'rgba(183, 110, 121, 0.28)',
    contrast: '#3A0D1C',
    glass: 'rgba(58, 13, 28, 0.88)',
    isDark: true,
    description: 'Deep oxblood wine background, rose gold accents and highlights, blush ivory text. Refined romantic luxury aesthetic.'
  },
  {
    id: 'midnight-navy-gold',
    name: 'Midnight Navy & Gold',
    icon: '⚓',
    bgToTr: 'Midnight Navy & Metallic Gold',
    bg: '#0A1128',
    bgVia: '#070D20',
    bgTo: '#040713',
    text: '#EDEDE6',
    textMuted: 'rgba(237, 237, 230, 0.68)',
    accent: '#C6A15B',
    accentLight: 'rgba(198, 161, 91, 0.16)',
    accentHover: '#E2C284',
    card: '#121E42',
    cardHover: '#1B2C5E',
    border: 'rgba(198, 161, 91, 0.28)',
    contrast: '#0A1128',
    glass: 'rgba(10, 17, 40, 0.88)',
    isDark: true,
    description: 'Deep midnight navy background, metallic gold accents, off-white text. Sleek modern luxury with subtle glints.'
  },
  {
    id: 'espresso-cream',
    name: 'Espresso Cream',
    icon: '☕',
    bgToTr: 'Dark Espresso & Caramel',
    bg: '#2B1A12',
    bgVia: '#20120B',
    bgTo: '#140A06',
    text: '#F5EBDD',
    textMuted: 'rgba(245, 235, 221, 0.68)',
    accent: '#C9995A',
    accentLight: 'rgba(201, 153, 90, 0.16)',
    accentHover: '#E0B57C',
    card: '#3B2419',
    cardHover: '#4D3022',
    border: 'rgba(201, 153, 90, 0.28)',
    contrast: '#2B1A12',
    glass: 'rgba(43, 26, 18, 0.88)',
    isDark: true,
    description: 'Dark espresso brown background, soft caramel gold accents, warm cream text. Cozy premium bakery feel.'
  }
];

export interface ThemeContextType {
  activeTheme: ThemePreset;
  setTheme: (id: string) => void;
  setGlobalTheme: (id: string) => Promise<void>;
  loadingTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const injectThemeCSS = (theme: ThemePreset) => {
  let styleEl = document.getElementById('cakehouse-theme-overrides');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'cakehouse-theme-overrides';
    document.head.appendChild(styleEl);
  }

  // Set individual CSS Custom variables on root
  const root = document.documentElement;
  root.style.setProperty('--theme-bg', theme.bg);
  root.style.setProperty('--theme-bg-via', theme.bgVia);
  root.style.setProperty('--theme-bg-to', theme.bgTo);
  root.style.setProperty('--theme-text', theme.text);
  root.style.setProperty('--theme-text-muted', theme.textMuted);
  root.style.setProperty('--theme-accent', theme.accent);
  root.style.setProperty('--theme-accent-light', theme.accentLight);
  root.style.setProperty('--theme-accent-hover', theme.accentHover);
  root.style.setProperty('--theme-card', theme.card);
  root.style.setProperty('--theme-card-hover', theme.cardHover);
  root.style.setProperty('--theme-border', theme.border);
  root.style.setProperty('--theme-contrast', theme.contrast);
  root.style.setProperty('--theme-contrast-hover', theme.contrastHover || theme.contrast);
  root.style.setProperty('--theme-bg-glass', theme.glass);

  // Set selection colors
  root.style.setProperty('--selection-bg', theme.accentLight);
  root.style.setProperty('--selection-text', theme.accent);

  styleEl.innerHTML = `
    /* Body & Root Defaults */
    html, body, #root {
      background-color: ${theme.bg} !important;
      color: ${theme.text} !important;
      transition: background-color 0.5s cubic-bezier(0.16, 1, 0.3, 1), color 0.4s ease-in-out !important;
    }

    /* Target Tailwind color stops globally to repaint any background gradients across all pages */
    .from-\\[\\#10141C\\], .from-\\[\\#121722\\], .from-\\[\\#140603\\], .from-\\[\\#1E0D0A\\], .from-\\[\\#1C0A05\\], .from-\\[\\#2D150F\\], .from-emerald-950\\/10 {
      --tw-gradient-from: var(--theme-bg) !important;
      --tw-gradient-to: var(--theme-bg-to) !important;
      --tw-gradient-stops: var(--theme-bg), var(--theme-bg-via), var(--theme-bg-to) !important;
    }

    .via-\\[\\#161C26\\], .via-\\[\\#1A2230\\], .via-\\[\\#18202C\\], .via-\\[\\#2F150F\\], .via-\\[\\#1B0A06\\], .via-\\[\\#2F140A\\] {
      --tw-gradient-to: var(--theme-bg-to) !important;
      --tw-gradient-stops: var(--theme-bg), var(--theme-bg-via), var(--theme-bg-to) !important;
    }

    .to-\\[\\#0D1017\\], .to-\\[\\#0E121A\\], .to-\\[\\#0C0F16\\], .to-\\[\\#210D09\\], .to-\\[\\#120502\\], .to-black, .to-\\[\\#2D150F\\] {
      --tw-gradient-to: var(--theme-bg-to) !important;
    }

    /* Core Tailwinds overrides targeting precise container and card classes */
    .bg-\\[\\#10141C\\],
    .bg-\\[\\#140603\\], 
    .bg-\\[\\#140603\\]\\/80, 
    .bg-\\[\\#140603\\]\\/40, 
    .bg-\\[\\#140603\\]\\/95,
    .bg-black\\/50,
    .bg-black\\/70,
    .bg-\\[\\#140603\\]\\/35 {
      background-color: var(--theme-bg) !important;
    }

    .bg-\\[\\#181F2B\\],
    .bg-\\[\\#141923\\],
    .bg-\\[\\#161C26\\],
    .bg-\\[\\#1C2330\\],
    .bg-\\[\\#18191e\\],
    .bg-\\[\\#26130F\\],
    .bg-\\[\\#210F0C\\],
    .bg-\\[\\#26130F\\]\\/45,
    .bg-\\[\\#26130F\\]\\/90,
    .bg-\\[\\#26130F\\]\\/85,
    .bg-\\[\\#1A0A07\\]\\/80,
    .bg-\\[\\#102619\\] {
      background-color: var(--theme-card) !important;
    }

    /* Global gradients layout background */
    .bg-gradient-to-tr.from-\\[\\#140603\\].via-\\[\\#2F150F\\].to-\\[\\#210D09\\],
    .bg-gradient-to-tr.from-\\[\\#1E0D0A\\].to-\\[\\#2D150F\\],
    .bg-gradient-to-tr.from-emerald-950\\/10.to-black\\/40 {
      background: linear-gradient(135deg, var(--theme-bg), var(--theme-bg-via), var(--theme-bg-to)) !important;
    }

    .bg-gradient-to-br.from-\\[\\#2D150F\\].via-\\[\\#1B0A06\\].to-\\[\\#2D150F\\],
    .bg-gradient-to-b.from-\\[\\#1C0A05\\]\\/90.to-black,
    .bg-gradient-to-b.from-\\[\\#1C0A05\\].via-\\[\\#2F140A\\].to-\\[\\#120502\\] {
      background: linear-gradient(180deg, var(--theme-bg), var(--theme-bg-via), var(--theme-bg-to)) !important;
    }

    /* Transparent navigation bars / filters and headers */
    .bg-\\[\\#10141C\\]\\/95,
    .bg-\\[\\#10141C\\]\\/90,
    .bg-\\[\\#141923\\]\\/98,
    .bg-\\[\\#181F2B\\]\\/90,
    .bg-\\[\\#181F2B\\]\\/80,
    .bg-\\[\\#140603\\]\\/85,
    .bg-\\[\\#140603\\]\\/20,
    .bg-\\[\\#140603\\]\\/30,
    .bg-\\[\\#140603\\]\\/10,
    .bg-black\\/30,
    .bg-stone-950\\/80,
    .bg-\\[\\#2D150F\\]\\/30,
    .bg-\\[\\#26130F\\]\\/80 {
      background-color: var(--theme-bg-glass) !important;
      backdrop-filter: blur(12px) !important;
    }

    /* Accent borders */
    .border-\\[\\#DFB15B\\],
    .border-\\[\\#DFB15B\\]\\/40,
    .border-\\[\\#DFB15B\\]\\/30,
    .border-\\[\\#DFB15B\\]\\/25,
    .border-\\[\\#DFB15B\\]\\/20,
    .border-\\[\\#DFB15B\\]\\/15,
    .border-\\[\\#DFB15B\\]\\/10 {
      border-color: var(--theme-border) !important;
    }

    /* Accent text and fill colors */
    .text-\\[\\#DFB15B\\] {
      color: var(--theme-accent) !important;
    }
    .fill-\\[\\#DFB15B\\] {
      fill: var(--theme-accent) !important;
    }
    .bg-\\[\\#DFB15B\\] {
      background-color: var(--theme-accent) !important;
      color: var(--theme-contrast) !important;
    }
    .bg-\\[\\#DFB15B\\]\\/10,
    .bg-\\[\\#DFB15B\\]\\/15,
    .bg-\\[\\#DFB15B\\]\\/20,
    .bg-\\[\\#DFB15B\\]\\/25,
    .bg-\\[\\#DFB15B\\]\\/30 {
      background-color: var(--theme-accent-light) !important;
    }

    /* Text colors */
    .text-\\[\\#FFFDFB\\],
    .text-\\[\\#F1F5F9\\] {
      color: var(--theme-text) !important;
    }

    /* Custom Selection Styling */
    ::selection {
      background-color: var(--theme-accent-light) !important;
      color: var(--theme-accent) !important;
    }
  `;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTheme, setActiveThemeState] = useState<ThemePreset>(THEME_PRESETS[0]);
  const [loadingTheme, setLoadingTheme] = useState(true);

  // Initialize and subscribe in real time to global Firestore settings
  useEffect(() => {
    // Sync style instantly for the default theme first
    const localThemeId = localStorage.getItem('cakehouse_local_theme');
    if (localThemeId && localThemeId !== 'classic') {
      const match = THEME_PRESETS.find(t => t.id === localThemeId);
      if (match) {
        setActiveThemeState(match);
        injectThemeCSS(match);
      } else {
        setActiveThemeState(THEME_PRESETS[0]);
        injectThemeCSS(THEME_PRESETS[0]);
        localStorage.setItem('cakehouse_local_theme', THEME_PRESETS[0].id);
      }
    } else {
      setActiveThemeState(THEME_PRESETS[0]);
      injectThemeCSS(THEME_PRESETS[0]);
      localStorage.setItem('cakehouse_local_theme', THEME_PRESETS[0].id);
    }

    const unsub = onSnapshot(doc(db, 'settings', 'theme'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.themeId) {
          const match = THEME_PRESETS.find(t => t.id === data.themeId);
          if (match) {
            setActiveThemeState(match);
            injectThemeCSS(match);
            localStorage.setItem('cakehouse_local_theme', match.id);
          }
        }
      }
      setLoadingTheme(false);
    }, (error) => {
      console.warn("Theme live sync error (permissions or offline). Using local storage fallback:", error);
      setLoadingTheme(false);
    });

    return () => unsub();
  }, []);

  // Client-side instant theme picker (or preview helper)
  const setTheme = (id: string) => {
    const match = THEME_PRESETS.find(t => t.id === id);
    if (match) {
      setActiveThemeState(match);
      injectThemeCSS(match);
      localStorage.setItem('cakehouse_local_theme', match.id);
    }
  };

  // Admin-level global setting that updates the Firestore database live!
  const setGlobalTheme = async (id: string) => {
    const match = THEME_PRESETS.find(t => t.id === id);
    if (!match) {
      toast.error("Invalid theme selected");
      return;
    }

    try {
      await setDoc(doc(db, 'settings', 'theme'), {
        themeId: id,
        updatedAt: new Date().toISOString()
      });
      setActiveThemeState(match);
      injectThemeCSS(match);
      localStorage.setItem('cakehouse_local_theme', match.id);
      toast.success(`Theme updated globally to: ${match.name}!`, {
        icon: match.icon
      });
    } catch (err: any) {
      console.error("Failed to commit theme globally:", err);
      // Fallback local change if Firestore transaction is offline or permission-blocked for non-admins
      setTheme(id);
      toast.success(`Theme updated locally (saving change to browser): ${match.name}!`, {
        icon: match.icon
      });
    }
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, setTheme, setGlobalTheme, loadingTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
