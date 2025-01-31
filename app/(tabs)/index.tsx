import React from "react";
import { View } from "react-native";
import ComicReader from "../../components/ComicReader"; // Adjust path if needed

export default function IndexScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ComicReader />
    </View>
  );
}