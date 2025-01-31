import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ComicStore {
  lastReadPage: number;
  setLastReadPage: (page: number) => void; // ✅ Add setter function
  isVertical: boolean;
  setIsVertical: (value: boolean) => void;
}

const useComicStore = create<ComicStore>((set) => ({
  lastReadPage: 1, // ✅ Default to first page
  setLastReadPage: async (page) => {
    await AsyncStorage.setItem("lastReadPage", page.toString()); // ✅ Save to AsyncStorage
    set({ lastReadPage: page });
  },
  isVertical: true,
  setIsVertical: (value) => set({ isVertical: value }),
}));

export default useComicStore;
