import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the ComicStore interface
interface ComicStore {
  currentPage: number;
  lastReadPage: number;
  isVertical: boolean;
  morale: number;
  kerukaBond: number;
  kehindeBond: number;
  setCurrentPage: (page: number) => void;
  setLastReadPage: (page: number) => void;
  setIsVertical: (isVertical: boolean) => void;
  setMorale: (morale: number) => void;
  setKerukaBond: (kerukaBond: number) => void;
  setKehindeBond: (kehindeBond: number) => void;
  loadSavedState: () => Promise<void>;
}

const useComicStore = create<ComicStore>((set) => ({
  currentPage: 1,
  lastReadPage: 1,
  isVertical: true,
  morale: 50,
  kerukaBond: 50,
  kehindeBond: 50,

  // Persist current page in AsyncStorage
  setCurrentPage: async (page: number) => {
    try {
      await AsyncStorage.setItem('currentPage', page.toString());
      set({ currentPage: page });
    } catch (error) {
      console.error('Error saving currentPage:', error);
    }
  },

  setLastReadPage: (page: number) => set({ lastReadPage: page }),
  setIsVertical: (isVertical: boolean) => set({ isVertical }),
  setMorale: (morale: number) => set({ morale }),
  setKerukaBond: (kerukaBond: number) => set({ kerukaBond }),
  setKehindeBond: (kehindeBond: number) => set({ kehindeBond }),

  // Load saved page from AsyncStorage on app start
  loadSavedState: async () => {
    try {
      const savedPage = await AsyncStorage.getItem('currentPage');
      if (savedPage) {
        set({ currentPage: parseInt(savedPage, 10) });
      }
    } catch (error) {
      console.error('Error loading saved page:', error);
    }
  },
}));

export default useComicStore;
