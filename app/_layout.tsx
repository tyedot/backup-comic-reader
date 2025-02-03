import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AudioProvider } from '../context/AudioContext';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const [loaded, setLoaded] = React.useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Load resources and data here
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
      <ThemeProvider theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
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