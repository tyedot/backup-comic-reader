import React, { useState, useEffect, useRef } from "react";
import { View, Image, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const comicPages = [
  require("../assets/comics/page1.jpg"),
  require("../assets/comics/page2.jpg"),
  require("../assets/comics/page3.jpg"),
  // Add more pages...
];

export default function ComicReader() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isVertical, setIsVertical] = useState<boolean>(true); // Track reading mode
  const scrollViewRef = useRef<ScrollView>(null);

  // Load last read page & orientation
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

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        horizontal={!isVertical}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {comicPages.map((page, index) => (
          <Image
            key={index}
            source={page}
            style={{
              width: screenWidth,
              height: screenHeight,
              resizeMode: "contain",
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});