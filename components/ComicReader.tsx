// /components/ComicReader.tsx
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Dimensions, Image, StyleSheet, Text } from 'react-native';
import comicPages from '../app/hooks/storyData';
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
  const [isChoiceMade, setIsChoiceMade] = useState(false); // Prevents forward scrolling before choice is made

  if (!comicPages || comicPages.length === 0) {
    console.error("❌ Error: storyData is not loaded!");
    return <Text>Loading story data...</Text>; // Prevent rendering
  }
  

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
    console.log("📜 Full storyData (Objects):", JSON.stringify(comicPages, null, 2)); // ✅ Log full objects
  
    // Check if storyData is loaded correctly
    if (!comicPages || comicPages.length === 0) {
      console.error("❌ Error: storyData is empty or not loaded!");
      return;
    }
  
    // Find the current page in storyData
    const currentPageData = comicPages.find((page) => page.id === currentPage);
    console.log("🔎 Searching for Page:", currentPage);
  
    console.log(`📄 Current Page ID (from useComicStore): ${currentPage}`);
    console.log(`🗂️ Found Page in storyData:`, currentPageData);
    console.log(`🔍 Page Type: ${currentPageData?.type || 'Unknown'}`);
  
    if (!currentPageData) {
      console.error(`❌ Error: Page ID ${currentPage} not found in storyData!`);
      return;
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
  
    console.log('🛠️ Scrolling to page:', page);
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
    console.log(`✅ Choice Selected: Going to Page ${nextPage}`);
    console.log(`📈 Morale Change: ${effect.morale}`);
    console.log(`❤️ Keruka Bond Change: ${kerukaBondEffect}`);
    console.log(`🖤 Kehinde Bond Change: ${kehindeBondEffect}`);
  
    setMorale(morale + effect.morale);
    setKerukaBond(kerukaBond + kerukaBondEffect);
    setKehindeBond(kehindeBond + kehindeBondEffect);
  
    setTimeout(() => {
      setCurrentPage(nextPage); // Update state
      setIsChoiceMade(true); // Unlock forward scrolling
      console.log(`🛠️ Calling setCurrentPage(${nextPage})`);
      console.log(`🔓 Forward scrolling unlocked. Page should now be: ${nextPage}`);
    }, 500); // Small delay to allow UI updates
  };
  
  

  const handleScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const currentPageData = comicPages.find((page) => page.id === currentPage);
  
    console.log(`📄 Current Page ID: ${currentPage}`);
    console.log(`🔍 Page Type: ${currentPageData?.type || 'Unknown'}`);
    console.log(`🛑 Is Choice Made? ${isChoiceMade}`);
  
    // If this is a choice page and no choice has been made, prevent scrolling forward
    if (currentPageData?.type === 'choice' && !isChoiceMade && offsetY > 0) {
      console.log("⛔ Preventing forward scroll on choice page.");
      scrollViewRef.current?.scrollTo({ y: 0, animated: true }); // Snap back to prevent forward scroll
    }
  };
  

  const renderPage = (pageId: number) => {
    console.log('Rendering page:', pageId);
    const currentPageData = comicPages.find((page) => page.id === pageId);

    if (!currentPageData) {
      console.error("❌ Page not found:", pageId);
      return <Text>No content found for this page</Text>;
    }

    console.log("📸 Image Content:", currentPageData.content);

    if (currentPageData?.type === 'image') {
      if (typeof currentPageData.content !== "object") {
        console.error(`❌ Invalid image source for Page ${pageId}:`, currentPageData.content);
        return <Text>Error: Image source is invalid</Text>;
      }

      return <Image source={currentPageData.content} style={styles.image} />;
    }

    return <Text>Invalid page type</Text>;
};



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
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        horizontal={!isVertical}
        onScrollEndDrag={handleScrollEnd} // Restricts forward scrolling on choice pages
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={isVertical ? screenHeight : screenWidth}
        snapToAlignment="center"
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
      >
        {comicPages.map((page) => (
          <View key={page.id} style={styles.page}>
            {renderPage(page.id)}
          </View>
        ))}
      </ScrollView>
    </View>
  );
  
}
