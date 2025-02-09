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
}

const useComicStore = create<ComicStore>((set) => ({
  currentPage: 1,
  lastReadPage: 1,
  isVertical: true,
  morale: 50,         // Default morale value
  kerukaBond: 50,     // Default Keruka bond
  kehindeBond: 50,    // Default Kehinde bond
  setCurrentPage: (page: number) => set({ currentPage: page }),
  setLastReadPage: (page: number) => set({ lastReadPage: page }),
  setIsVertical: (isVertical: boolean) => set({ isVertical }),
  setMorale: (morale: number) => set({ morale }),
  setKerukaBond: (kerukaBond: number) => set({ kerukaBond }),
  setKehindeBond: (kehindeBond: number) => set({ kehindeBond }),
}));

export default useComicStore;
