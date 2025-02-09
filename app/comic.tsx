import React, { useState, useEffect, useRef } from "react";
import { View, Image, StyleSheet, ScrollView, Dimensions, Button, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

// Define comic pages here (if you're not importing them dynamically from a file)
const comicPages = [
  require("../assets/comics/page0.jpg"),
  require("../assets/comics/page1.jpg"),
  require("../assets/comics/page2.jpg"),
  require("../assets/comics/page3.jpg"),
  require("../assets/comics/fight.jpg"),
  require("../assets/comics/run.jpg"),
  require("../assets/comics/scare.jpg"),
  require("../assets/comics/fight1.jpg"),
  require("../assets/comics/fight2.jpg"),
  require("../assets/comics/fight3.jpg"),
  require("../assets/comics/ClimbTree.jpg"),
  require("../assets/comics/HideinTreeHollow.jpg"),
  require("../assets/comics/killwolf.jpg"),
  require("../assets/comics/sparewolf.jpg"),
  require("../assets/comics/Gameover.jpg"),
  require("../assets/comics/strangetracks.jpg"),
  // Add more pages...
];

export default function ComicReader() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isVertical, setIsVertical] = useState<boolean>(true); // Track reading mode
  const scrollViewRef = useRef<ScrollView>(null);

  // Load saved page progress when app starts
  useEffect(() => {
    const loadSettings = async () => {
      const savedPage = await AsyncStorage.getItem("lastReadPage");
      const savedOrientation = await AsyncStorage.getItem("readingMode");
      if (savedPage) setCurrentPage(parseInt(savedPage));
      if (savedOrientation) setIsVertical(savedOrientation === "vertical");
    };
    loadSettings();
  }, []);

  // Scroll to the correct position when the component mounts or settings change
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: isVertical ? 0 : (currentPage - 1) * screenWidth,
        y: isVertical ? (currentPage - 1) * screenHeight : 0,
        animated: false,
      });
    }
  }, [isVertical, currentPage]);

  // Save current page & orientation when changed
  useEffect(() => {
    AsyncStorage.setItem("lastReadPage", currentPage.toString());
    AsyncStorage.setItem("readingMode", isVertical ? "vertical" : "horizontal");
  }, [currentPage, isVertical]);

  // Toggle Reading Mode (Preserve Page)
  const toggleReadingMode = () => {
    setIsVertical((prev) => !prev);
  };

  // Reset to First Page (Real Reset)
  const resetToFirstPage = async () => {
    await AsyncStorage.removeItem("lastReadPage");
    setCurrentPage(1); // Reset page state
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
    }
  };

  const handleScroll = (event: any) => {
    const page = isVertical
      ? Math.round(event.nativeEvent.contentOffset.y / screenHeight) + 1
      : Math.round(event.nativeEvent.contentOffset.x / screenWidth) + 1;
    setCurrentPage(page);
  };

  const renderPage = () => {
    const currentPageData = comicPages[currentPage - 1]; // Access the page by its ID
    if (!currentPageData) {
      console.error("Page not found:", currentPage); // Log the current page ID for debugging
      return <Text>No content found for this page</Text>;
    }

    return (
      <Image
        source={currentPageData}
        style={{ width: screenWidth, height: screenHeight, resizeMode: "contain" }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        horizontal={!isVertical}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.page}>{renderPage()}</View>
      </ScrollView>

      {/* Optional button to toggle reading mode */}
      <View style={styles.buttons}>
        <Button title="Toggle Reading Mode" onPress={toggleReadingMode} />
        <Button title="Reset to First Page" onPress={resetToFirstPage} />
      </View>
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
  buttons: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  }
});
