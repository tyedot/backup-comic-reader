import React, { useState, useEffect } from "react";
import { View, Text, Switch, Button, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import useComicStore from "../hooks/useComicStore"; // ✅ Zustand store

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [musicVolume, setMusicVolume] = useState(1);
  const { isVertical, setIsVertical, setLastReadPage } = useComicStore(); // ✅ Get Zustand state setter
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // ✅ Load saved settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      const savedVolume = await AsyncStorage.getItem("musicVolume");
      if (savedVolume) setMusicVolume(parseFloat(savedVolume));
    };
    loadSettings();
  }, []);

  // ✅ Play music only after volume is set
  useEffect(() => {
    playBackgroundMusic();
  }, [musicVolume]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // ✅ Toggle Dark Mode
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // ✅ Toggle Reading Mode (Vertical <-> Horizontal)
  const toggleReadingMode = () => setIsVertical(!isVertical);

  // ✅ Reset last read page & navigate to first page
  const resetToFirstPage = async () => {
    try {
      await AsyncStorage.removeItem("lastReadPage"); // ✅ Clear stored page
      setLastReadPage(1); // ✅ Reset Zustand state
      console.log("Reset to first page!");
  
      // ✅ Navigate to the first comic page
      router.back(); // ✅ Go back to comic reader, letting it reset
  } catch (error) {
    console.error("Error resetting last read page:", error);
  }
};

  // ✅ Adjust Music Volume
  const adjustMusicVolume = async (value: number) => {
    setMusicVolume(value);
    await AsyncStorage.setItem("musicVolume", value.toString());

    if (!sound) {
      console.warn("No sound instance found. Initializing music...");
      await playBackgroundMusic();
    } else {
      await sound.setVolumeAsync(value);
    }
  };

  // ✅ Play background music
  const playBackgroundMusic = async () => {
    try {
      if (!sound) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require("../../assets/audio/background.mp3"), // ✅ Ensure correct file path
          { shouldPlay: true, isLooping: true } // ✅ Pass valid options
        );
  
        setSound(newSound);
        await newSound.playAsync(); // ✅ Start playback
      } else {
        await sound.replayAsync(); // ✅ Restart the audio
      }
    } catch (error) {
      console.error("Error playing music:", error);
    }
  };
  

  // ✅ Stop background music (pause instead of unload)
  const stopBackgroundMusic = async () => {
    if (sound) {
      try {
        await sound.stopAsync(); // ✅ Stop the music
        await sound.unloadAsync(); // ✅ Unload to free memory
        setSound(null); // ✅ Clear state
        console.log("Music stopped and unloaded.");
      } catch (error) {
        console.error("Error stopping music:", error);
      }
    } else {
      console.warn("No sound is playing.");
    }
  };
  

  return (
    <View style={[styles.container, darkMode ? styles.dark : { backgroundColor: "#fff" }]}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.option}>
        <Text>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>

      <View style={styles.option}>
        <Text>Reading Mode</Text>
        <Button title={isVertical ? "Switch to Horizontal" : "Switch to Vertical"} onPress={toggleReadingMode} />
      </View>

      <View style={styles.option}>
        <Text>Music Volume</Text>
        <Slider minimumValue={0} maximumValue={1} step={0.1} value={musicVolume} onValueChange={adjustMusicVolume} />
      </View>

      <Button title="Play Music" onPress={playBackgroundMusic} />
      <Button title="Stop Music" onPress={stopBackgroundMusic} />
      <Button title="Reset to First Page" onPress={resetToFirstPage} />
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  dark: { backgroundColor: "#121212" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  option: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
});
