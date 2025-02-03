import React, { useState, useEffect } from "react";
import { View, Text, Switch, Button, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import useComicStore from "../hooks/useComicStore";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [musicVolume, setMusicVolume] = useState(1);
  const { isVertical, setIsVertical } = useComicStore();
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const savedVolume = await AsyncStorage.getItem("musicVolume");
      if (savedVolume) setMusicVolume(parseFloat(savedVolume));
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const playBackgroundMusic = async () => {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require("../../assets/audio/background.mp3"),
          { shouldPlay: true, isLooping: true, volume: musicVolume }
        );
        setSound(newSound);
        setIsPlaying(true);
        await newSound.playAsync();
      } catch (error) {
        console.error("Error playing music:", error);
      }
    };

    playBackgroundMusic();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (sound) {
      sound.setVolumeAsync(musicVolume);
    }
  }, [musicVolume]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const toggleReadingMode = () => setIsVertical(!isVertical);

  const adjustMusicVolume = async (value: number) => {
    setMusicVolume(value);
    await AsyncStorage.setItem("musicVolume", value.toString());

    if (sound) {
      await sound.setVolumeAsync(value);
    }
  };

  const toggleMusicPlayback = async () => {
    if (isPlaying) {
      if (sound) {
        try {
          await sound.stopAsync();
          setIsPlaying(false);
        } catch (error) {
          console.error("Error stopping music:", error);
        }
      }
    } else {
      if (sound) {
        try {
          await sound.playAsync();
          setIsPlaying(true);
        } catch (error) {
          console.error("Error playing music:", error);
        }
      }
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

      <Button title={isPlaying ? "Stop Music" : "Play Music"} onPress={toggleMusicPlayback} />
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