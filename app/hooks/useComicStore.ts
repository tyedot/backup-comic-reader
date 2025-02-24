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
  resetGame: () => void;
}

const useComicStore = create<ComicStore>((set, get) => ({
  // Use zero-based indexing throughout
  currentPage: 0,
  lastReadPage: 0, // Changed from 1 to 0 for consistency
  isVertical: true,
  morale: 50,
  kerukaBond: 50,
  kehindeBond: 50,

  // ✅ Persist current page in AsyncStorage and Zustand state
  setCurrentPage: async (page: number) => {
    try {
      console.log(`🛠️ Attempting to update currentPage from ${get().currentPage} to ${page}`);
      
      await AsyncStorage.setItem('currentPage', page.toString());

      set((state) => {
        console.log(`✅ currentPage successfully updated from ${state.currentPage} to ${page}`);
        return { currentPage: page };
      });

    } catch (error) {
      console.error('❌ Error saving currentPage:', error);
    }
  },

  setLastReadPage: (page: number) => {
    console.log(`🔖 Updating lastReadPage to ${page}`);
    set({ lastReadPage: page });
  },

  setIsVertical: (isVertical: boolean) => {
    console.log(`🔄 Changing reading mode to ${isVertical ? "Vertical" : "Horizontal"}`);
    set({ isVertical });
  },

  setMorale: (morale: number) => {
    console.log(`📈 Updating morale to ${morale}`);
    set({ morale });
  },

  setKerukaBond: (kerukaBond: number) => {
    console.log(`💙 Updating Keruka Bond to ${kerukaBond}`);
    set({ kerukaBond });
  },

  setKehindeBond: (kehindeBond: number) => {
    console.log(`❤️ Updating Kehinde Bond to ${kehindeBond}`);
    set({ kehindeBond });
  },

  // ✅ Load saved page from AsyncStorage on app start
  loadSavedState: async () => {
    try {
      const savedPage = await AsyncStorage.getItem('currentPage');

      if (savedPage) {
        console.log(`📂 Loaded saved page from storage: ${savedPage}`);
        set({ currentPage: parseInt(savedPage, 10) });
      } else {
        console.log("🆕 No saved page found, starting at Page 0");
        set({ currentPage: 0 });
      }
    } catch (error) {
      console.error('❌ Error loading saved page:', error);
    }
  },

  // ✅ Reset the game state
  resetGame: async () => {
    console.log("🔄 Resetting game progress...");

    await AsyncStorage.removeItem('currentPage');
    set({
      currentPage: 0,
      lastReadPage: 0,
      morale: 50,
      kerukaBond: 50,
      kehindeBond: 50,
    });

    console.log("🆕 Game reset complete! Back to Page 0.");
  }
}));

export default useComicStore;
