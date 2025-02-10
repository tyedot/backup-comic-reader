import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Choice {
  label: string;
  nextPage: number;
  effect: { morale: number };
  kerukaBondEffect?: number;
  kehindeBondEffect?: number;
}

interface ChoiceButtonsProps {
  choices: Choice[];
  handleChoice: (nextPage: number, effect: { morale: number }, kerukaBondEffect?: number, kehindeBondEffect?: number) => void;
}

const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({ choices, handleChoice }) => {
  console.log('Rendering buttons:', choices);

  if (!choices || choices.length === 0) {
    console.warn('No choices available to render.');
    return null;
  }

  return (
    <View style={styles.choiceContainer}>
      {choices.map((choice, index) => (
        <TouchableOpacity
          key={index}
          style={styles.choiceButton}
          onPress={() => handleChoice(choice.nextPage, choice.effect, choice.kerukaBondEffect, choice.kehindeBondEffect)}
        >
          <Text style={styles.choiceText}>{choice.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  choiceContainer: {
    position: 'absolute',
    bottom: 30, // Ensures it appears above the bottom edge
    width: '90%',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)', // Slightly transparent black
    paddingVertical: 10,
    borderRadius: 10, // Rounded corners for smoother UI
    alignSelf: 'center',
  },
  choiceButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker black, slightly transparent
    height: 36.5, // 🔹 Set button height here (adjust as needed)
    paddingVertical: 10, // Adjust or remove to fit height properly
    paddingHorizontal: 10,
    marginVertical: 3,
    borderRadius: 8,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center', // 🔹 Ensures text is centered vertically
  },
  choiceText: {
    color: '#fff', // White text for contrast
    fontSize: 13,
    fontWeight: 'bold',
  },
});


export default ChoiceButtons;
