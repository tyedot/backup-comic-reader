import React, { useRef, useEffect } from 'react';
import { ScrollView, View, Dimensions, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface ComicScrollProps {
  isVertical: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void; // Add setCurrentPage
  scrollToPage: (page: number, animated?: boolean) => void;
  handlePageChange: (event: any) => void;
  children: React.ReactNode;
}

const ComicScroll: React.FC<ComicScrollProps> = ({
  isVertical,
  currentPage,
  setCurrentPage,
  scrollToPage,
  children,
  handlePageChange,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: isVertical ? 0 : currentPage * screenWidth,
        y: isVertical ? currentPage * screenHeight : 0,
        animated: true,
      });
    }
  }, [currentPage]);

  return (
    <ScrollView
      ref={scrollViewRef}
      pagingEnabled
      horizontal={!isVertical}
      scrollEventThrottle={16}
      onMomentumScrollEnd={handlePageChange}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Ensures scrolling works
  },
});

export default ComicScroll;
