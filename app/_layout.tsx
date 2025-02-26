// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
        // Add resource loading here if needed
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
    return null; // Still loading
  }

  console.log("✅ RootLayout Rendered");

  return (
    <AudioProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ title: "Settings" }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </NavigationContainer>
      </ThemeProvider>
    </AudioProvider>
  );
}
