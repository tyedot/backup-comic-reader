// app/index.tsx
import React from "react";
import { View } from "react-native";
import MenuScreen from "../../components/MenuScreen"; // adjust the path if needed

export default function IndexScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MenuScreen />
    </View>
  );
}
