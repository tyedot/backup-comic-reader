import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Dimensions, Image, StyleSheet, Text } from 'react-native';
import { comicPages } from '../app/hooks/storyData';
import useComicStore from '../app/hooks/useComicStore';
import { useAudio } from '../context/AudioContext';
import { useTheme } from '../context/ThemeContext';
import ChoiceButtons from '../components/ChoiceButtons'; // Import the choice button component

const screenWidth: number = Dimensions.get('window').width;
const screenHeight: number = Dimensions.get('window').height;

export default function ComicReader() {
  const {
    isVertical,
    currentPage,
    setCurrentPage,
    morale,
    setMorale,
    kerukaBond,
    setKerukaBond,
    kehindeBond,
    setKehindeBond,
    loadSavedState,
  } = useComicStore();

  const scrollViewRef = useRef<ScrollView>(null);
  const { playMusic } = useAudio();
  const { isDark, themeStyles } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      await loadSavedState();
      if (scrollViewRef.current) {
        scrollToPage(currentPage, false);
      }
      await playMusic();
      setIsLoading(false);
    };
    initialize();
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollToPage(currentPage, true);
    }
  }, [currentPage]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  const scrollToPage = (page: number, animated: boolean = true) => {
    if (!scrollViewRef.current || page < 1 || page > comicPages.length) return;
  
    if (page === currentPage) {
      console.log('Skipping redundant scroll to page:', page);
      return;
    }
  
    console.log('Scrolling to page:', page);
    const offset = isVertical ? screenHeight * (page - 1) : screenWidth * (page - 1);
  
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: isVertical ? 0 : offset,
        y: isVertical ? offset : 0,
        animated,
      });
    }, 100);
  };

  const handleChoice = (
    nextPage: number,
    effect: { morale: number },
    kerukaBondEffect: number = 0,
    kehindeBondEffect: number = 0
  ) => {
    console.log(`Choice selected: Going to page ${nextPage}`);
    console.log('Morale change:', effect.morale);
    console.log('Keruka Bond effect:', kerukaBondEffect);
    console.log('Kehinde Bond effect:', kehindeBondEffect);

    setMorale(morale + effect.morale);
    setKerukaBond(kerukaBond + kerukaBondEffect);
    setKehindeBond(kehindeBond + kehindeBondEffect);
    setCurrentPage(nextPage);
  };

  const renderPage = (pageId: number) => {
    console.log('Rendering page:', pageId);
    const currentPageData = comicPages.find((page) => page.id === pageId);

    if (!currentPageData) {
      console.error("Page not found:", pageId);
      return <Text>No content found for this page</Text>;
    }

    if (currentPageData?.type === 'image') {
      return <Image source={currentPageData.content} style={styles.image} />;
    }

    if (currentPageData?.type === 'choice') {
      console.log('Choice page detected:', currentPageData);
      console.log('Choices:', currentPageData.choices);

      if (!currentPageData.choices || currentPageData.choices.length === 0) {
        console.warn('No choices available for this page:', currentPageData.id);
        return <Text>No choices available</Text>;
      }

      return (
        <View style={styles.choiceContainer}>
          <Image source={currentPageData.content} style={styles.image} />
          <ChoiceButtons choices={currentPageData.choices ?? []} handleChoice={handleChoice} />
        </View>
      );
    }

    return <Text>Invalid page type</Text>;
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        horizontal={!isVertical}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={isVertical ? screenHeight : screenWidth}
        snapToAlignment="center"
        keyboardShouldPersistTaps="handled" // ✅ Ensures buttons are clickable
        removeClippedSubviews={true}
      >
        {comicPages.map((page) => (
          <View key={page.id} style={styles.page}>
            {renderPage(page.id)}
          </View>
        ))}
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
  image: {
    width: screenWidth,
    height: screenHeight,
    resizeMode: 'contain',
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
  choiceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
