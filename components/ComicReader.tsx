import React, { useEffect, useRef } from 'react';
import { ScrollView, View, Dimensions, Image, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import useComicStore from '../app/hooks/useComicStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudio } from '../context/AudioContext';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const comicPages = [
  require('../assets/comics/page1.jpg'),
  require('../assets/comics/page2.jpg'),
  require('../assets/comics/page3.jpg'),
  // Add more pages as needed
];

export default function ComicReader() {
  const { currentPage, lastReadPage, isVertical, setCurrentPage, setLastReadPage } = useComicStore();
  const scrollViewRef = useRef<ScrollView>(null);
  const { playMusic } = useAudio();

  useEffect(() => {
    const loadSettings = async () => {
      const savedPage = await AsyncStorage.getItem('currentPage');
      if (savedPage) setCurrentPage(parseInt(savedPage));
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: isVertical ? 0 : lastReadPage * screenWidth,
        y: isVertical ? lastReadPage * screenHeight : 0,
        animated: false,
      });
    }
  }, [isVertical, lastReadPage]);

  useEffect(() => {
    playMusic();
  }, [playMusic]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = isVertical
      ? Math.round(event.nativeEvent.contentOffset.y / screenHeight)
      : Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setLastReadPage(page);
    AsyncStorage.setItem('currentPage', page.toString());
  };

  return (
    <View style={{ flex: 1 }}>
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
              resizeMode: 'contain',
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}