import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Dimensions, Image, StyleSheet, Button, Text } from 'react-native';
import { comicPages } from '../app/hooks/storyData'; // Ensure this path is correct
import useComicStore from '../app/hooks/useComicStore'; // Zustand store
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudio } from '../context/AudioContext';
import { useTheme } from '../context/ThemeContext';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function ComicReader() {
  // Initialize variables
  const { isVertical, currentPage, setCurrentPage, morale, setMorale, kerukaBond, setKerukaBond, kehindeBond, setKehindeBond } = useComicStore();
  const scrollViewRef = useRef<ScrollView>(null);
  const { playMusic } = useAudio();
  const { isDark, themeStyles } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  // Log comicPages when the component is mounted
  useEffect(() => {
    console.log('comicPages:', comicPages);  // Log the comicPages to check if it's being loaded correctly
  }, []);

  // Load saved page progress when app starts
  useEffect(() => {
    const loadProgressAndPlayMusic = async () => {
      try {
        const savedPage = await AsyncStorage.getItem('currentPage');
        const pageToLoad = savedPage ? parseInt(savedPage, 10) : 1;  // Default to page 1, not 0
        console.log('Loading page:', pageToLoad); // Log the page being loaded
        setCurrentPage(pageToLoad);
        if (scrollViewRef.current) {
          scrollToPage(pageToLoad, false);
        }
        await playMusic();
      } catch (error) {
        console.error('Error loading saved page:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProgressAndPlayMusic();
  }, []);

  // Loading state
  if (isLoading) {
    return <Text>Loading...</Text>;  // Show loading message until data is ready
  }

  // Scroll to the specific page
  const scrollToPage = (page: number, animated: boolean = true) => {
    console.log('scrollToPage function called');
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: isVertical ? 0 : (page - 1) * screenWidth, // Adjusted for 0-based indexing
        y: isVertical ? (page - 1) * screenHeight : 0,
        animated,
      });
    }
  };

  // Handle the page change
  const handlePageChange = (event: any) => {
    const offset = isVertical
      ? event.nativeEvent.contentOffset.y
      : event.nativeEvent.contentOffset.x;

    const newPage = Math.floor(offset / (isVertical ? screenHeight : screenWidth)) + 1; // Adjusted for 1-based indexing
    console.log('Page changed to:', newPage);  // Log the new page after the scroll
    setCurrentPage(newPage);
    AsyncStorage.setItem('currentPage', newPage.toString());
  };

  // Handle user choice and update the state
  const handleChoice = (
    nextPage: number,
    effect: { morale: number },
    kerukaBondEffect: number = 0,
    kehindeBondEffect: number = 0
  ) => {
    console.log('Handling choice:', nextPage);  // Log the next page and effect
    console.log('Keruka Bond:', kerukaBond, 'Kehinde Bond:', kehindeBond);  // Log current bond values
    setMorale(morale + effect.morale);
    setKerukaBond(kerukaBond + kerukaBondEffect);
    setKehindeBond(kehindeBond + kehindeBondEffect);
    setCurrentPage(nextPage);
    AsyncStorage.setItem('currentPage', nextPage.toString());
  };

  // Render page logic
  const renderPage = () => {
    console.log('Rendering page:', currentPage); // Debugging the rendering process
    const currentPageData = comicPages.find((page) => page.id === currentPage);

    if (!currentPageData) {
      console.error("Page not found:", currentPage);
      return <Text>No content found for this page</Text>;
    }

    if (currentPageData?.type === 'image') {
      console.log('Rendering image page:', currentPageData.id);
      return <Image source={currentPageData.content} style={{ width: screenWidth, height: screenHeight, resizeMode: 'contain' }} />;
    }

    if (currentPageData?.type === 'choice') {
      console.log('Rendering choice page:', currentPageData.id);
      return (
        <View>
          <Image source={currentPageData.content} style={{ width: screenWidth, height: screenHeight, resizeMode: 'contain' }} />
          {currentPageData.choices?.map((choice, index) => (
            <Button
              key={index}
              title={choice.label}
              onPress={() => handleChoice(choice.nextPage, choice.effect, choice.kerukaBondEffect, choice.kehindeBondEffect)}
            />
          ))}
        </View>
      );
    }
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
        <View style={styles.page}>{renderPage()}</View>
      </ScrollView>

      {isDark && (
        <View style={[styles.overlay, { opacity: themeStyles.overlayOpacity }]} pointerEvents="none" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
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
