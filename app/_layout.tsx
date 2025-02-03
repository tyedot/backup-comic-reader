import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AudioProvider } from '../context/AudioContext';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        console.log("🚀 Loading resources...");
        // Add any resource loading if needed here
      } catch (e) {
        console.warn(e);
      } finally {
        setLoaded(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!loaded) {
    return null; // Show splash screen until resources are loaded
  }

  console.log("✅ RootLayout Rendered");

  return (
    <AudioProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ title: "Settings" }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AudioProvider>
  );
}
