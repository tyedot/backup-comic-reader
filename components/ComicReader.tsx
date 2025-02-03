import React, { useEffect, useRef } from 'react';
import { ScrollView, View, Dimensions, Image, StyleSheet } from 'react-native';
import useComicStore from '../app/hooks/useComicStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudio } from '../context/AudioContext';
import { useTheme } from '../context/ThemeContext'; // ✅ Import Theme

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const comicPages = [
  require('../assets/comics/page1.jpg'),
  require('../assets/comics/page2.jpg'),
  require('../assets/comics/page3.jpg'),
];

export default function ComicReader() {
  const { isVertical, lastReadPage, setCurrentPage } = useComicStore();
  const scrollViewRef = useRef<ScrollView>(null);
  const { playMusic } = useAudio();
  const { isDark, themeStyles } = useTheme(); // ✅ Use Theme

  useEffect(() => {
    const loadSettingsAndPlayMusic = async () => {
      const savedPage = await AsyncStorage.getItem('currentPage');
      if (savedPage) setCurrentPage(parseInt(savedPage));
      await playMusic();
    };

    loadSettingsAndPlayMusic();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        horizontal={!isVertical}
        scrollEventThrottle={16}
      >
        {comicPages.map((page, index) => (
          <Image
            key={index}
            source={page}
            style={{
              width: screenWidth,
              height: screenHeight,
              resizeMode: 'contain',
            }}
          />
        ))}
      </ScrollView>

      {/* ✅ Apply Dimming Overlay */}
      {isDark && (
        <View
          style={[styles.overlay, { opacity: themeStyles.overlayOpacity }]}
          pointerEvents="none" // ✅ Allow interactions to pass through
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    pointerEvents: 'none', // ✅ Ensure buttons are clickable
  },
});
