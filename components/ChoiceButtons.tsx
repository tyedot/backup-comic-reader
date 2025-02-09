import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useStory } from '../context/StoryContext';

// Define types for choices
interface Choice {
  text: string;
  next: string;
}

interface ChoiceButtonsProps {
  choices: Choice[];
}

const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({ choices }) => {
  const { makeChoice } = useStory();

  return (
    <View style={styles.buttonContainer}>
      {choices.map((choice: Choice, index: number) => (
        <Button key={index} title={choice.text} onPress={() => makeChoice(choice)} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute', // ✅ Ensures buttons overlay images
    bottom: 20, // ✅ Keeps buttons at the bottom of the screen
    width: '100%',
    alignItems: 'center',
  },
});

export default ChoiceButtons;
