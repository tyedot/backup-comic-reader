// LoadingOverlay.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LoadingOverlay = () => {
  return (
    <View style={styles.overlay}>
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default LoadingOverlay;
