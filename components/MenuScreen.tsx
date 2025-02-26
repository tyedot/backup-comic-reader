// components/MenuScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';

export default function MenuScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Video background */}
      <Video
        source={require('../assets/comics/background.mp4')} // Adjust path as needed
        style={styles.backgroundVideo}
        isMuted={true}
        isLooping={true}
        shouldPlay={true}
        resizeMode={ResizeMode.COVER}
        rate={1.0}
      />
      {/* Overlay with menu buttons */}
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push("/(tabs)/comicmain")}>
         <Text style={styles.menuButtonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/about')}>
          <Text style={styles.menuButtonText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/achievements')}>
          <Text style={styles.menuButtonText}>Achievements</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/shop')}>
          <Text style={styles.menuButtonText}>Shop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    borderRadius: 8,
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
