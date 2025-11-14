import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'blue' | 'purple' | 'green' | 'orange';

export interface ThemeColors {
  name: string;
  displayName: string;
  icon: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
    sidebarBackground: string;
    sidebarForeground: string;
    sidebarPrimary: string;
    sidebarPrimaryForeground: string;
    sidebarAccent: string;
    sidebarAccentForeground: string;
    sidebarBorder: string;
    sidebarRing: string;
  };
}

export const themes: Record<Theme, ThemeColors> = {
  light: {
    name: 'light',
    displayName: '浅色主题',
    icon: '☀️',
    colors: {
      background: '0 0% 100%',
      foreground: '220 13% 18%',
      card: '0 0% 100%',
      cardForeground: '220 13% 18%',
      popover: '0 0% 100%',
      popoverForeground: '220 13% 18%',
      primary: '217 91% 60%',
      primaryForeground: '0 0% 100%',
      secondary: '262 83% 58%',
      secondaryForeground: '0 0% 100%',
      muted: '220 13% 95%',
      mutedForeground: '220 9% 46%',
      accent: '217 91% 95%',
      accentForeground: '217 91% 60%',
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 100%',
      border: '220 13% 91%',
      input: '220 13% 91%',
      ring: '217 91% 60%',
      sidebarBackground: '0 0% 99%',
      sidebarForeground: '220 13% 18%',
      sidebarPrimary: '217 91% 60%',
      sidebarPrimaryForeground: '0 0% 100%',
      sidebarAccent: '217 91% 95%',
      sidebarAccentForeground: '217 91% 60%',
      sidebarBorder: '220 13% 91%',
      sidebarRing: '217 91% 60%',
    },
  },
  dark: {
    name: 'dark',
    displayName: '深色主题',
    icon: '🌙',
    colors: {
      background: '224 71% 4%',
      foreground: '213 31% 91%',
      card: '224 71% 4%',
      cardForeground: '213 31% 91%',
      popover: '224 71% 4%',
      popoverForeground: '213 31% 91%',
      primary: '217 91% 60%',
      primaryForeground: '224 71% 4%',
      secondary: '262 83% 58%',
      secondaryForeground: '213 31% 91%',
      muted: '223 47% 11%',
      mutedForeground: '215.4 16.3% 56.9%',
      accent: '216 34% 17%',
      accentForeground: '210 40% 98%',
      destructive: '0 63% 31%',
      destructiveForeground: '210 40% 98%',
      border: '216 34% 17%',
      input: '216 34% 17%',
      ring: '217 91% 60%',
      sidebarBackground: '224 71% 4%',
      sidebarForeground: '213 31% 91%',
      sidebarPrimary: '217 91% 60%',
      sidebarPrimaryForeground: '224 71% 4%',
      sidebarAccent: '216 34% 17%',
      sidebarAccentForeground: '210 40% 98%',
      sidebarBorder: '216 34% 17%',
      sidebarRing: '217 91% 60%',
    },
  },
  blue: {
    name: 'blue',
    displayName: '蓝色主题',
    icon: '💙',
    colors: {
      background: '210 100% 98%',
      foreground: '210 100% 15%',
      card: '0 0% 100%',
      cardForeground: '210 100% 15%',
      popover: '0 0% 100%',
      popoverForeground: '210 100% 15%',
      primary: '210 100% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '210 100% 95%',
      secondaryForeground: '210 100% 25%',
      muted: '210 100% 95%',
      mutedForeground: '210 50% 40%',
      accent: '210 100% 92%',
      accentForeground: '210 100% 25%',
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 100%',
      border: '210 100% 90%',
      input: '210 100% 90%',
      ring: '210 100% 50%',
      sidebarBackground: '210 100% 99%',
      sidebarForeground: '210 100% 15%',
      sidebarPrimary: '210 100% 50%',
      sidebarPrimaryForeground: '0 0% 100%',
      sidebarAccent: '210 100% 92%',
      sidebarAccentForeground: '210 100% 25%',
      sidebarBorder: '210 100% 90%',
      sidebarRing: '210 100% 50%',
    },
  },
  purple: {
    name: 'purple',
    displayName: '紫色主题',
    icon: '💜',
    colors: {
      background: '270 100% 98%',
      foreground: '270 100% 15%',
      card: '0 0% 100%',
      cardForeground: '270 100% 15%',
      popover: '0 0% 100%',
      popoverForeground: '270 100% 15%',
      primary: '270 100% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '270 100% 95%',
      secondaryForeground: '270 100% 25%',
      muted: '270 100% 95%',
      mutedForeground: '270 50% 40%',
      accent: '270 100% 92%',
      accentForeground: '270 100% 25%',
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 100%',
      border: '270 100% 90%',
      input: '270 100% 90%',
      ring: '270 100% 50%',
      sidebarBackground: '270 100% 99%',
      sidebarForeground: '270 100% 15%',
      sidebarPrimary: '270 100% 50%',
      sidebarPrimaryForeground: '0 0% 100%',
      sidebarAccent: '270 100% 92%',
      sidebarAccentForeground: '270 100% 25%',
      sidebarBorder: '270 100% 90%',
      sidebarRing: '270 100% 50%',
    },
  },
  green: {
    name: 'green',
    displayName: '绿色主题',
    icon: '💚',
    colors: {
      background: '120 100% 98%',
      foreground: '120 100% 15%',
      card: '0 0% 100%',
      cardForeground: '120 100% 15%',
      popover: '0 0% 100%',
      popoverForeground: '120 100% 15%',
      primary: '120 100% 40%',
      primaryForeground: '0 0% 100%',
      secondary: '120 100% 95%',
      secondaryForeground: '120 100% 25%',
      muted: '120 100% 95%',
      mutedForeground: '120 50% 40%',
      accent: '120 100% 92%',
      accentForeground: '120 100% 25%',
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 100%',
      border: '120 100% 90%',
      input: '120 100% 90%',
      ring: '120 100% 40%',
      sidebarBackground: '120 100% 99%',
      sidebarForeground: '120 100% 15%',
      sidebarPrimary: '120 100% 40%',
      sidebarPrimaryForeground: '0 0% 100%',
      sidebarAccent: '120 100% 92%',
      sidebarAccentForeground: '120 100% 25%',
      sidebarBorder: '120 100% 90%',
      sidebarRing: '120 100% 40%',
    },
  },
  orange: {
    name: 'orange',
    displayName: '橙色主题',
    icon: '🧡',
    colors: {
      background: '30 100% 98%',
      foreground: '30 100% 15%',
      card: '0 0% 100%',
      cardForeground: '30 100% 15%',
      popover: '0 0% 100%',
      popoverForeground: '30 100% 15%',
      primary: '30 100% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '30 100% 95%',
      secondaryForeground: '30 100% 25%',
      muted: '30 100% 95%',
      mutedForeground: '30 50% 40%',
      accent: '30 100% 92%',
      accentForeground: '30 100% 25%',
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 100%',
      border: '30 100% 90%',
      input: '30 100% 90%',
      ring: '30 100% 50%',
      sidebarBackground: '30 100% 99%',
      sidebarForeground: '30 100% 15%',
      sidebarPrimary: '30 100% 50%',
      sidebarPrimaryForeground: '0 0% 100%',
      sidebarAccent: '30 100% 92%',
      sidebarAccentForeground: '30 100% 25%',
      sidebarBorder: '30 100% 90%',
      sidebarRing: '30 100% 50%',
    },
  },
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Record<Theme, ThemeColors>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('easy-tools-theme');
    return (stored as Theme) || defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    const themeColors = themes[theme].colors;

    // Apply theme colors to CSS variables
    Object.entries(themeColors).forEach(([key, value]) => {
      const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssVar}`, value);
    });

    // Save to localStorage
    localStorage.setItem('easy-tools-theme', theme);
  }, [theme]);

  const value = {
    theme,
    setTheme,
    themes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}