import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ComicStore {
  currentPage: number;
  lastReadPage: number;
  isVertical: boolean;
  setCurrentPage: (page: number) => void;
  setLastReadPage: (page: number) => void;
  setIsVertical: (isVertical: boolean) => void;
}

const useComicStore = create<ComicStore>((set) => ({
  currentPage: 1,
  lastReadPage: 1,
  isVertical: true,
  setCurrentPage: (page: number) => set({ currentPage: page }),
  setLastReadPage: (page: number) => set  ({ lastReadPage: page }),
  setIsVertical: (isVertical: boolean) => set({ isVertical }),
}));

export default useComicStore;