import React, { useState, useEffect, useRef } from "react";
import { View, Image, Button, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const comicPages: { [key: number]: any } = {
  1: require("../assets/comics/page1.jpg"),
  2: require("../assets/comics/page2.jpg"),
  3: require("../assets/comics/page3.jpg"),
  // ✅ Add more pages...
};

export default function ComicReader() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isVertical, setIsVertical] = useState<boolean>(true); // ✅ Track reading mode
  const scrollViewRef = useRef<ScrollView>(null);

  // ✅ Load last read page & orientation
  useEffect(() => {
    const loadSettings = async () => {
      const savedPage = await AsyncStorage.getItem("lastReadPage");
      const savedOrientation = await AsyncStorage.getItem("readingMode");

      if (savedPage) setCurrentPage(parseInt(savedPage));
      if (savedOrientation) setIsVertical(savedOrientation === "vertical");
    };
    loadSettings();
  }, []);

  // ✅ Save current page & orientation when changed
  useEffect(() => {
    AsyncStorage.setItem("lastReadPage", currentPage.toString());
    AsyncStorage.setItem("readingMode", isVertical ? "vertical" : "horizontal");
  }, [currentPage, isVertical]);

  // ✅ Toggle Reading Mode (Preserve Page)
  const toggleReadingMode = () => {
    setIsVertical((prev) => !prev);
  };

  // ✅ Reset to First Page (Real Reset)
  const resetToFirstPage = async () => {
    await AsyncStorage.removeItem("lastReadPage");
    setCurrentPage(1); // ✅ Reset page state

    scrollViewRef.current?.scrollTo({ x: 0, animated: true }); // ✅ Ensure it scrolls back
    console.log("Reset to first page!");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal={!isVertical}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {Object.keys(comicPages).map((key) => (
          <Image key={key} source={comicPages[parseInt(key)]} style={styles.image} />
        ))}
      </ScrollView>

      <View style={styles.buttons}>
        <Button title={isVertical ? "Switch to Horizontal" : "Switch to Vertical"} onPress={toggleReadingMode} />
        <Button title="Reset to First Page" onPress={resetToFirstPage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: { width: 300, height: 400, resizeMode: "contain", marginHorizontal: 10 },
  buttons: { marginTop: 20, alignItems: "center" },
});
