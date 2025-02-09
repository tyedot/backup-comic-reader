import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define types
interface StoryVariables {
  Morale: number;
  kerukaBond: number;
  kehindeBond: number;
  sharedSecret: string;
  acceptedKehindeHelp: string;
}

interface Choice {
  text: string;
  next: string;
}

interface Passage {
  text?: string;
  images?: string[];
  choices?: Choice[];
  effects?: Partial<StoryVariables>;
}

interface StoryContextType {
  currentPassage: string;
  imageIndex: number;
  setImageIndex: (index: number) => void;
  variables: StoryVariables;
  makeChoice: (choice: Choice) => void;
  storyData: Passage;
}

const storyData: Record<string, Passage> = require("../assets/twine_story.json");

const StoryContext = createContext<StoryContextType | undefined>(undefined);

const initialVariables: StoryVariables = {
  Morale: 0,
  kerukaBond: 0,
  kehindeBond: 0,
  sharedSecret: "null",
  acceptedKehindeHelp: "null",
};

interface StoryProviderProps {
  children: ReactNode;
}

export const StoryProvider: React.FC<StoryProviderProps> = ({ children }) => {
  const [currentPassage, setCurrentPassage] = useState<string>("What should I do here?");
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [variables, setVariables] = useState<StoryVariables>(initialVariables);

  console.log("🟢 Initial Passage:", currentPassage);
  console.log("🟢 Initial Story Data:", storyData[currentPassage] || "No Data Found!");

  // 🔄 Load progress from AsyncStorage when the component mounts
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedPassage = await AsyncStorage.getItem("currentPassage");
        const savedImageIndex = await AsyncStorage.getItem("imageIndex");
        const savedVariables = await AsyncStorage.getItem("storyVariables");

        if (savedPassage && storyData[savedPassage]) {
          setCurrentPassage(savedPassage);
        }
        if (savedImageIndex) {
          setImageIndex(parseInt(savedImageIndex, 10));
        }
        if (savedVariables) {
          const parsedVariables = JSON.parse(savedVariables);
          setVariables((prev) => ({ ...prev, ...parsedVariables }));
        }
      } catch (error) {
        console.error("❌ Failed to load story progress:", error);
      }
    };
    loadProgress();
  }, []);

  // 🔄 Save progress to AsyncStorage whenever relevant state changes
  useEffect(() => {
    const saveProgress = async () => {
      try {
        await AsyncStorage.setItem("currentPassage", currentPassage);
        await AsyncStorage.setItem("imageIndex", imageIndex.toString());
        await AsyncStorage.setItem("storyVariables", JSON.stringify(variables));
      } catch (error) {
        console.error("❌ Failed to save story progress:", error);
      }
    };
    saveProgress();
  }, [currentPassage, imageIndex, variables]);

  const makeChoice = (choice: Choice) => {
    const nextPassage = storyData[choice.next];
    if (!nextPassage) {
      console.warn("⚠️ No passage found for choice:", choice.next);
      return;
    }

    if (nextPassage.effects) {
      setVariables((prev) => ({
        Morale: prev.Morale + (nextPassage.effects?.Morale ?? 0),
        kerukaBond: prev.kerukaBond + (nextPassage.effects?.kerukaBond ?? 0),
        kehindeBond: prev.kehindeBond + (nextPassage.effects?.kehindeBond ?? 0),
        sharedSecret: nextPassage.effects?.sharedSecret ?? prev.sharedSecret,
        acceptedKehindeHelp: nextPassage.effects?.acceptedKehindeHelp ?? prev.acceptedKehindeHelp,
      }));
    }

    setCurrentPassage(choice.next);
    setImageIndex(0);
  };

  return (
    <StoryContext.Provider
      value={{
        currentPassage,
        imageIndex,
        setImageIndex,
        variables,
        makeChoice,
        storyData: storyData[currentPassage] || { text: "", images: [], choices: [], effects: {} },
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = (): StoryContextType => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStory must be used within a StoryProvider");
  }
  return context;
};
