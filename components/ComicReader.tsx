import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Dimensions, Image, StyleSheet, Button, Text } from 'react-native';
import { comicPages } from '../app/hooks/storyData'; // Ensure this path is correct
import useComicStore from '../app/hooks/useComicStore'; // Zustand store
import { useAudio } from '../context/AudioContext';
import { useTheme } from '../context/ThemeContext';

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
    console.log('comicPages:', comicPages);
  }, []);

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
  
    // ✅ Prevent re-scrolling if already on the correct page
    if (page === currentPage) {
      console.log('Skipping redundant scroll to page:', page);
      return;
    }
  
    console.log('scrollToPage function called for page:', page);
    const offset = isVertical ? screenHeight * (page - 1) : screenWidth * (page - 1);
  
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: isVertical ? 0 : offset,
        y: isVertical ? offset : 0,
        animated,
      });
    }, 100);
  };
  
  
  

  const handlePageChange = (event: any) => {
    const offset = isVertical
      ? event.nativeEvent.contentOffset.y
      : event.nativeEvent.contentOffset.x;
  
    const pageSize = isVertical ? screenHeight : screenWidth;
    const threshold = pageSize * 0.3; // ✅ Ensures small swipes register page changes
  
    const newPage = Math.round(offset / pageSize) + 1;
  
    // ✅ Ensure the new page is different before updating state
    if (newPage !== currentPage && Math.abs(offset - (currentPage - 1) * pageSize) > threshold) {
      console.log('Page changed to:', newPage);
      setCurrentPage(newPage);
    }
  };
  

  const handleChoice = (
    nextPage: number,
    effect: { morale: number },
    kerukaBondEffect: number = 0,
    kehindeBondEffect: number = 0
  ) => {
    console.log('Handling choice:', nextPage);
    
    setMorale(morale + effect.morale);
    setKerukaBond(kerukaBond + kerukaBondEffect);
    setKehindeBond(kehindeBond + kehindeBondEffect);

    const selectedPage = comicPages.find((page) => page.id === nextPage);

    if (selectedPage?.branch && selectedPage.branch.length > 0) {
      console.log('Branching to:', selectedPage.branch);
      
      selectedPage.branch.forEach((branchPage: number, index: number) => {
        setTimeout(() => setCurrentPage(branchPage), index * 1000);
      });

      // ✅ Ensure `postBranchPage` is always a number (fallback: last branch page or `nextPage`)
      const postBranchPage = selectedPage.postBranch 
        ?? (selectedPage.branch.length > 0 ? selectedPage.branch[selectedPage.branch.length - 1] : nextPage);
      
      setTimeout(() => setCurrentPage(postBranchPage), selectedPage.branch.length * 1000 + 2000);
    } else {
      setCurrentPage(nextPage);
    }
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
      return (
        <View style={styles.choiceContainer}>
          <Image source={currentPageData.content} style={styles.image} />
          {currentPageData.choices?.map((choice, index) => (
            <Button
              key={index}
              title={choice.label}
              onPress={() => handleChoice(choice.nextPage, choice.effect)}
            />
          ))}
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
        onScrollEndDrag={handlePageChange}
        decelerationRate="normal" // ✅ Faster and smoother scrolling
        snapToInterval={isVertical ? screenHeight : screenWidth} // ✅ Ensures proper page snapping
        snapToAlignment="center" // ✅ Centers the page correctly
        keyboardShouldPersistTaps="handled" // ✅ Fixes unresponsive button taps
        //removeClippedSubviews={true} // ✅ Improves performance by unloading off-screen pages
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
