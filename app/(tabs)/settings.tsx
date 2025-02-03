import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAudio } from "../../context/AudioContext";
import useComicStore from "../hooks/useComicStore";
import { useTheme } from "../../context/ThemeContext";

export default function Settings() {
  const [musicVolume, setMusicVolume] = useState(1);
  const { isVertical, setIsVertical } = useComicStore();
  const router = useRouter();
  const { isPlaying, playMusic, pauseMusic, setVolume } = useAudio();
  const { isDark, toggleTheme, themeStyles } = useTheme();

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

  const handleToggleTheme = () => {
    console.log("🖱️ Dark Mode Button Pressed");
    toggleTheme();
  };

  const toggleReadingMode = async () => {
    const currentPage = await AsyncStorage.getItem("currentPage");
    if (currentPage) {
      await AsyncStorage.setItem("lastReadPageBeforeModeChange", currentPage);
    }
    setIsVertical(!isVertical);
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
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>Settings</Text>

      <View style={styles.option}>
        <Text style={{ color: isDark ? "#fff" : "#000" }}>Dark Mode</Text>
        <Button
          title={isDark ? "Enable Light Mode" : "Enable Dark Mode"}
          onPress={handleToggleTheme}
        />
      </View>

      <View style={styles.option}>
        <Text style={{ color: isDark ? "#fff" : "#000" }}>Reading Mode</Text>
        <Button
          title={isVertical ? "Switch to Horizontal" : "Switch to Vertical"}
          onPress={toggleReadingMode}
        />
      </View>

      <View style={styles.option}>
        <Text style={{ color: isDark ? "#fff" : "#000" }}>Music Volume</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          step={0.1}
          value={musicVolume}
          onValueChange={adjustMusicVolume}
          minimumTrackTintColor="#1EB1FC"
          maximumTrackTintColor="#8E8E93"
          thumbTintColor="#007AFF"
        />
      </View>

      <Button title={isPlaying ? "Pause Music" : "Play Music"} onPress={toggleMusicPlayback} />
      <Button title="Go Back" onPress={() => router.back()} />

      {/* ✅ Overlay with pointerEvents to allow button clicks */}
      {isDark && (
        <View
          style={[styles.overlay, { opacity: themeStyles.overlayOpacity }]}
          pointerEvents="none"  // ✅ Allows interactions to pass through
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  slider: { width: 200, height: 40 },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    pointerEvents: "none", // ✅ Ensures buttons are responsive
  },
});
