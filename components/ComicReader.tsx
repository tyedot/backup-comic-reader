import React, { useEffect, useState } from "react";
import { ScrollView, Image, View, Dimensions } from "react-native";
import useComicStore from "../app/hooks/useComicStore"; // ✅ Import Zustand store
import localforage from "localforage";
import comics from "../assets/comics";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const ComicReader = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const { isVertical } = useComicStore(); // ✅ Get reading mode

  useEffect(() => {
    localforage.getItem("lastReadPage").then((savedPage) => {
      if (savedPage !== null) setCurrentPage(Number(savedPage));
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isVertical ? (
        <ScrollView pagingEnabled>
          {comics.map((image, index) => (
            <Image key={index} source={image} style={{ width: screenWidth, height: screenHeight, resizeMode: "contain" }} />
          ))}
        </ScrollView> 
      ) : (
        <ScrollView pagingEnabled horizontal>
          {comics.map((image, index) => (
            <Image key={index} source={image} style={{ width: screenWidth, height: screenHeight, resizeMode: "contain" }} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ComicReader;
