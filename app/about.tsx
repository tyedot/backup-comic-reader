// app/about.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const unstable_settings = {
  headerTransparent: true,
  headerTitle: 'About',
  headerTitleAlign: 'center',
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
};

export default function About() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Absolute container for the background image */}
      <View style={styles.backgroundContainer}>
        <ImageBackground
          source={require('../assets/comics/about-background.jpg')} // adjust path as needed
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      </View>
      {/* Content container with extra top padding to account for header height */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>What is an Interactive Comic?</Text>
        <Text style={styles.body}>
          An interactive comic combines traditional storytelling with branching choices that let you shape the narrative.
          Instead of following a fixed story path, you decide which direction the plot takes—each decision can alter the characters’ fate and overall outcome.
        </Text>
        <Text style={styles.header}>How Your Choices Influence the Story</Text>
        <Text style={styles.body}>
          Throughout the comic, you'll be presented with key moments where you choose from several options.
          Your selections affect character relationships, change events, and even determine the ending.
        </Text>
        <Text style={styles.header}>The Story Plot</Text>
        <Text style={styles.body}>
          [Insert your story plot here: explain the setting, introduce the characters, and describe the central conflict.]
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: 20,
    paddingTop: 80, // Adjust this value based on your header height
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 15,
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    lineHeight: 24,
  },
});
