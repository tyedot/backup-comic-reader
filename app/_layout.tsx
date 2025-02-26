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
    return null;
  }

  return (
    <AudioProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack
            screenOptions={{
              // Make the header transparent so the background shows through
              headerTransparent: true,
              // Hide the title so the banner appears empty
              headerTitle: '',
              // Hide any back title text so only the back arrow is visible
              headerBackTitleVisible: false,
              // Set the back arrow color (and other elements) to white
              headerTintColor: '#fff',
            }}
          >
            {/* Your Tabs navigator with its header hidden */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* Standalone screens – they will use the default header options above */}
            <Stack.Screen name="about" />
            <Stack.Screen name="achievements" />
            <Stack.Screen name="shop" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </NavigationContainer>
      </ThemeProvider>
    </AudioProvider>
  );
}
