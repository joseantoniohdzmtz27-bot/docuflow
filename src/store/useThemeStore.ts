import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  toggleTheme: () => {
    set((state) => {
      const next = !state.isDark;
      if (typeof window !== 'undefined') {
        localStorage.setItem('docuflow_theme', next ? 'dark' : 'light');
        if (next) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return { isDark: next };
    });
  },
  setTheme: (isDark) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('docuflow_theme', isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ isDark });
  },
}));
