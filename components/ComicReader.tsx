import React, { useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Dimensions,
  Image,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import useComicStore from '../app/hooks/useComicStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudio } from '../context/AudioContext';
import { useTheme } from '../context/ThemeContext';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const comicPages = [
  require('../assets/comics/page1.jpg'),
  require('../assets/comics/page2.jpg'),
  require('../assets/comics/page3.jpg'),
];

export default function ComicReader() {
  const { isVertical, currentPage, setCurrentPage } = useComicStore();
  const scrollViewRef = useRef<ScrollView>(null);
  const { playMusic } = useAudio();
  const { isDark, themeStyles } = useTheme();

  // ✅ Load saved page progress when app starts
  useEffect(() => {
    const loadProgressAndPlayMusic = async () => {
      try {
        const savedPage = await AsyncStorage.getItem('currentPage');
        const pageToLoad = savedPage ? parseInt(savedPage, 10) : 0;
        setCurrentPage(pageToLoad);

        scrollToPage(pageToLoad, false); // ✅ Restore position without animation
        await playMusic();
      } catch (error) {
        console.error('❌ Error loading saved page:', error);
      }
    };

    loadProgressAndPlayMusic();
  }, []);

  // ✅ Handle orientation changes while keeping the current page
  useEffect(() => {
    scrollToPage(currentPage, false);
  }, [isVertical]);

  // ✅ Function to scroll to a specific page
  const scrollToPage = (page: number, animated: boolean = true) => {
    scrollViewRef.current?.scrollTo({
      x: isVertical ? 0 : page * screenWidth,
      y: isVertical ? page * screenHeight : 0,
      animated,
    });
  };

  // ✅ Save current page progress on scroll
  const handlePageChange = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = isVertical
      ? event.nativeEvent.contentOffset.y
      : event.nativeEvent.contentOffset.x;

    const newPage = Math.floor(
      offset / (isVertical ? screenHeight : screenWidth)
    );

    setCurrentPage(newPage);
    AsyncStorage.setItem('currentPage', newPage.toString());
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        horizontal={!isVertical}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handlePageChange}
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

      {isDark && (
        <View
          style={[styles.overlay, { opacity: themeStyles.overlayOpacity }]}
          pointerEvents="none"
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
    pointerEvents: 'none',
  },
});
