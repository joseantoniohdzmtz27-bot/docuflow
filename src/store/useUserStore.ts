import { create } from 'zustand';
import { ConversionHistoryItem, UserProfile } from '@/types';

interface UserState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  history: ConversionHistoryItem[];
  favorites: string[];
  totalSavedBytes: number;
  totalConversions: number;

  // Actions
  login: (email: string, name?: string) => void;
  logout: () => void;
  toggleFavorite: (toolId: string) => void;
  addHistoryItem: (item: Omit<ConversionHistoryItem, 'id' | 'date'>) => void;
  clearHistory: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_premium_01',
  name: 'Usuario Pro',
  email: 'usuario@docuflow.pro',
  plan: 'pro',
  favoriteTools: ['merge-pdf', 'compress-pdf', 'pdf-to-word', 'ai-chat', 'image-converter'],
  processedCount: 142,
  savedStorageBytes: 1024 * 1024 * 850, // 850 MB
};

export const useUserStore = create<UserState>((set, get) => ({
  user: typeof window !== 'undefined' && localStorage.getItem('docuflow_user')
    ? JSON.parse(localStorage.getItem('docuflow_user')!)
    : DEFAULT_USER,
  isAuthenticated: true,
  history: typeof window !== 'undefined' && localStorage.getItem('docuflow_history')
    ? JSON.parse(localStorage.getItem('docuflow_history')!)
    : [
        {
          id: 'hist_1',
          toolId: 'merge-pdf',
          toolName: 'Unir PDF',
          date: new Date(Date.now() - 3600000 * 2).toLocaleString(),
          inputFilesCount: 4,
          originalSize: 14500000,
          outputSize: 14100000,
          status: 'completed',
        },
        {
          id: 'hist_2',
          toolId: 'compress-pdf',
          toolName: 'Comprimir PDF',
          date: new Date(Date.now() - 3600000 * 18).toLocaleString(),
          inputFilesCount: 1,
          originalSize: 8200000,
          outputSize: 2100000,
          status: 'completed',
        },
        {
          id: 'hist_3',
          toolId: 'pdf-to-word',
          toolName: 'PDF a Word',
          date: new Date(Date.now() - 3600000 * 42).toLocaleString(),
          inputFilesCount: 1,
          originalSize: 4500000,
          outputSize: 1200000,
          status: 'completed',
        },
      ],
  favorites: ['merge-pdf', 'compress-pdf', 'pdf-to-word', 'ai-chat', 'image-converter'],
  totalSavedBytes: 1024 * 1024 * 850,
  totalConversions: 142,

  login: (email, name = 'Usuario DocuFlow') => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name,
      email,
      plan: 'pro',
      favoriteTools: ['merge-pdf', 'compress-pdf'],
      processedCount: 0,
      savedStorageBytes: 0,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('docuflow_user', JSON.stringify(newUser));
    }
    set({ user: newUser, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('docuflow_user');
    }
    set({ user: null, isAuthenticated: false });
  },

  toggleFavorite: (toolId) => {
    const currentFavs = get().favorites;
    const exists = currentFavs.includes(toolId);
    const updated = exists ? currentFavs.filter((id) => id !== toolId) : [...currentFavs, toolId];

    set({ favorites: updated });
  },

  addHistoryItem: (item) => {
    const newItem: ConversionHistoryItem = {
      ...item,
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      date: new Date().toLocaleString(),
    };

    const updatedHistory = [newItem, ...get().history].slice(0, 50);
    const saved = Math.max(0, item.originalSize - item.outputSize);

    if (typeof window !== 'undefined') {
      localStorage.setItem('docuflow_history', JSON.stringify(updatedHistory));
    }

    set((state) => ({
      history: updatedHistory,
      totalConversions: state.totalConversions + 1,
      totalSavedBytes: state.totalSavedBytes + saved,
    }));
  },

  clearHistory: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('docuflow_history');
    }
    set({ history: [] });
  },
}));
