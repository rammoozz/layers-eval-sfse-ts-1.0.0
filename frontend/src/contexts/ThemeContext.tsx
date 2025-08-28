import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type AccentColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const accentColors = {
  blue: { primary: '217 91% 60%', ring: '217 91% 60%' },
  purple: { primary: '262 83% 58%', ring: '262 83% 58%' },
  green: { primary: '142 71% 45%', ring: '142 71% 45%' },
  orange: { primary: '24 95% 53%', ring: '24 95% 53%' },
  pink: { primary: '330 81% 60%', ring: '330 81% 60%' }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || 'system';
  });
  
  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    const stored = localStorage.getItem('accentColor') as AccentColor;
    return stored || 'purple';
  });

  useEffect(() => {
    const root = document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    const root = document.documentElement;
    const colors = accentColors[accentColor];
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--ring', colors.ring);
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}