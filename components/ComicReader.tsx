// /components/ComicReader.tsx
import React, { useEffect, useRef, useState } from "react";
import { Animated, View, Dimensions, Image, StyleSheet, Text } from "react-native";
import comicPages, { ComicPage } from "../app/hooks/storyData";
import useComicStore from "../app/hooks/useComicStore";
import { useAudio } from "../context/AudioContext";
import { useTheme } from "../context/ThemeContext";
import ChoiceButtons from "../components/ChoiceButtons";

const screenWidth: number = Dimensions.get("window").width;
const screenHeight: number = Dimensions.get("window").height;

export default function ComicReader() {
  // Move the useRef call inside the component so it's called at the top level.
  const scrollViewRef = useRef<React.ElementRef<typeof Animated.ScrollView>>(null);

  const {
    isVertical,
    currentPage, // current page id
    setCurrentPage,
    morale,
    setMorale,
    kerukaBond,
    setKerukaBond,
    kehindeBond,
    setKehindeBond,
    loadSavedState,
  } = useComicStore();

  const { playMusic } = useAudio();
  const { themeStyles } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isChoiceMade, setIsChoiceMade] = useState(false);

  // States for branch navigation (if needed)
  const [activeBranch, setActiveBranch] = useState<number[] | null>(null);
  const [activePostBranch, setActivePostBranch] = useState<number | null>(null);

  // Keep track of which pages have been revealed.
  // Initially, only pages 0, 1, 2, and 3 are revealed.
  const [revealedPages, setRevealedPages] = useState<number[]>([0, 1, 2, 3]);

  // Only render pages that have been revealed.
  const pagesToRender: ComicPage[] = comicPages.filter((page) =>
    revealedPages.includes(page.id)
  );

  // Create a lookup map for pagesToRender (page id -> index in rendered list)
  const pagesLookup = React.useMemo(() => {
    return pagesToRender.reduce((lookup, page, index) => {
      lookup[page.id] = index;
      return lookup;
    }, {} as Record<number, number>);
  }, [pagesToRender]);

  useEffect(() => {
    (async () => {
      await loadSavedState();
      // Scroll to the current page (if already revealed)
      scrollToPage(currentPage, false);
      await playMusic();
      setIsLoading(false);
    })();
  }, []);

  // This effect triggers auto-scrolling whenever currentPage or pagesToRender change.
  useEffect(() => {
    if (pagesToRender.some((page) => page.id === currentPage)) {
      requestAnimationFrame(() => {
        scrollToPage(currentPage, true);
      });
    }
  }, [currentPage, pagesToRender]);

  // When reaching the postBranch page, clear branch info so full story resumes.
  useEffect(() => {
    if (
      activeBranch &&
      activePostBranch !== null &&
      currentPage === activePostBranch
    ) {
      setActiveBranch(null);
      setActivePostBranch(null);
    }
  }, [currentPage, activeBranch, activePostBranch]);

  // Given a page id, return its index in pagesToRender.
  const getIndexForPageId = (pageId: number): number => {
    return pagesLookup[pageId] ?? -1;
  };

  // Scroll to the given page id.
  const scrollToPage = (pageId: number, animated: boolean = true) => {
    const targetIndex = getIndexForPageId(pageId);
    if (targetIndex === -1 || !scrollViewRef.current) return;
    console.log("🛠️ Scrolling to page id:", pageId, "at index:", targetIndex);
    const offset = isVertical ? screenHeight * targetIndex : screenWidth * targetIndex;
    requestAnimationFrame(() => {
      // Cast to any so TypeScript recognizes scrollTo.
      (scrollViewRef.current as any).scrollTo({
        x: isVertical ? 0 : offset,
        y: isVertical ? offset : 0,
        animated,
      });
    });
  };

  // When a choice is made, update state and reveal the next pages.
  const handleChoice = (
    nextPage: number,
    effect: { morale: number },
    kerukaBondEffect: number = 0,
    kehindeBondEffect: number = 0,
    branch?: number[],
    postBranch?: number
  ) => {
    console.log(`✅ Choice Selected: Going to Page ${nextPage}`);
    setMorale(morale + effect.morale);
    setKerukaBond(kerukaBond + kerukaBondEffect);
    setKehindeBond(kehindeBond + kehindeBondEffect);

    if (branch && branch.length > 0) {
      setRevealedPages((prev) => {
        const newPages = branch.filter((id) => !prev.includes(id));
        return [...prev, ...newPages];
      });
    } else {
      setRevealedPages((prev) =>
        prev.includes(nextPage) ? prev : [...prev, nextPage]
      );
    }
    if ((!branch || branch.length === 0) && postBranch !== undefined) {
      setRevealedPages((prev) =>
        prev.includes(postBranch) ? prev : [...prev, postBranch]
      );
    }
    if (branch) {
      setActiveBranch(branch);
    }
    if (postBranch !== undefined) {
      setActivePostBranch(postBranch);
    }
    setTimeout(() => {
      setCurrentPage(nextPage);
      setIsChoiceMade(true);
      console.log(`🛠️ Navigated to page ${nextPage}`);
    }, 300);
  };

  // When scrolling ends, update the currentPage based on the rendered index.
  const handleMomentumScrollEnd = (event: any) => {
    const offset = isVertical
      ? event.nativeEvent.contentOffset.y
      : event.nativeEvent.contentOffset.x;
    const dimension = isVertical ? screenHeight : screenWidth;
    const index = Math.round(offset / dimension);
    if (index >= 0 && index < pagesToRender.length) {
      const newPageId = pagesToRender[index].id;
      // Only update if the new page differs from currentPage.
      if (newPageId !== currentPage) {
        setCurrentPage(newPageId);
        console.log(`Updated currentPage to id: ${newPageId} (index ${index})`);
      }
    }
  };

  const renderPage = (page: ComicPage) => {
    if (page.type === "image") {
      return <Image source={page.content} style={styles.image} />;
    }
    if (page.type === "choice") {
      return (
        <>
          <Image source={page.content} style={styles.image} />
          <ChoiceButtons
            choices={page.choices || []}
            handleChoice={(
              nextPage: number,
              effect: { morale: number },
              kerukaBondEffect?: number,
              kehindeBondEffect?: number
            ) => {
              const chosen = page.choices?.find((choice) => choice.nextPage === nextPage);
              handleChoice(
                nextPage,
                effect,
                kerukaBondEffect,
                kehindeBondEffect,
                chosen?.branch,
                chosen?.postBranch
              );
            }}
          />
        </>
      );
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
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: screenWidth,
      height: screenHeight,
      resizeMode: "contain",
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <Animated.ScrollView
        ref={scrollViewRef}
        pagingEnabled
        horizontal={!isVertical}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        decelerationRate="normal"
        snapToInterval={isVertical ? screenHeight : screenWidth}
        snapToAlignment="center"
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
      >
        {pagesToRender.map((page) => (
          <View key={page.id} style={styles.page}>
            {renderPage(page)}
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}
