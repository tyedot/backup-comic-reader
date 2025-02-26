// app/achievements.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';

interface Achievement {
  id: string;
  title: string;
  description: string;
}

const achievements: Achievement[] = [
  { id: '1', title: 'Slayer', description: 'Kill all the wolves that stepped in your path.' },
  { id: '2', title: 'Pathfinder', description: 'Discover the hidden trails throughout the comic world.' },
  { id: '3', title: 'Peacemaker', description: 'Resolve conflicts without resorting to violence.' },
  { id: '4', title: 'Explorer', description: 'Visit every major location featured in the story.' },
  { id: '5', title: 'Collector', description: 'Gather all the hidden artifacts scattered across the pages.' },
  { id: '6', title: 'Master Strategist', description: 'Make all the right choices to achieve the best outcome.' },
  { id: '7', title: 'Survivor', description: 'Overcome all obstacles and emerge unscathed.' },
  { id: '8', title: 'Hero', description: 'Save an entire village with your courageous actions.' },
  { id: '9', title: 'Sage', description: 'Learn all the ancient secrets hidden within the comic lore.' },
  { id: '10', title: 'Legend', description: 'Achieve the ultimate ending and become a comic legend.' },
];

export default function Achievements() {
  return (
    <ImageBackground
      source={require('../assets/comics/achievements-bg.jpg')} // Update path to your background image
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.header}>Achievements</Text>
        <FlatList
          data={achievements}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Optional overlay for better contrast
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  item: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
});
