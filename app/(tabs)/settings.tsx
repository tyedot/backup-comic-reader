import React, { useState, useEffect } from "react";
import { View, Text, Switch, Button, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAudio } from "../../context/AudioContext";
import useComicStore from "../hooks/useComicStore";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [musicVolume, setMusicVolume] = useState(1);
  const { isVertical, setIsVertical } = useComicStore();
  const router = useRouter();
  const { isPlaying, playMusic, pauseMusic, setVolume } = useAudio();

  useEffect(() => {
    const loadSettings = async () => {
      const savedVolume = await AsyncStorage.getItem("musicVolume");
      if (savedVolume) setMusicVolume(parseFloat(savedVolume));
    };
    loadSettings();
  }, []);

  useEffect(() => {
    setVolume(musicVolume);
  }, [musicVolume, setVolume]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const toggleReadingMode = async () => {
    try {
      // Get the current page from AsyncStorage
      const currentPage = await AsyncStorage.getItem("currentPage");
      if (currentPage) {
        await AsyncStorage.setItem("lastReadPageBeforeModeChange", currentPage);
      }

      // Toggle the reading mode (explicit boolean)
      setIsVertical(!isVertical);  // FIXED: Direct boolean instead of function

      // Restore the page after the mode switches
      const savedPage = await AsyncStorage.getItem("lastReadPageBeforeModeChange");
      if (savedPage) {
        await AsyncStorage.setItem("currentPage", savedPage);
      }
    } catch (error) {
      console.error("Error toggling reading mode:", error);
    }
  };

  const adjustMusicVolume = async (value: number) => {
    setMusicVolume(value);
    await AsyncStorage.setItem("musicVolume", value.toString());
    setVolume(value);
  };

  const toggleMusicPlayback = async () => {
    if (isPlaying) {
      await pauseMusic();
    } else {
      await playMusic();
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

      <Button title={isPlaying ? "Pause Music" : "Play Music"} onPress={toggleMusicPlayback} />
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
