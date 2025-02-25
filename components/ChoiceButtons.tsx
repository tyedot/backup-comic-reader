// /components/ChoiceButtons.tsx
import React, { useState } from 'react';
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
  handleChoice: (
    nextPage: number,
    effect: { morale: number },
    kerukaBondEffect?: number,
    kehindeBondEffect?: number
  ) => void;
}

const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({ choices, handleChoice }) => {
  const [selected, setSelected] = useState<number | null>(null);

  if (!choices || choices.length === 0) {
    console.warn('No choices available to render.');
    return null;
  }

  const onPressChoice = (choice: Choice) => {
    // Only allow a choice if one hasn't been selected yet.
    if (selected === null) {
      setSelected(choice.nextPage);
      handleChoice(
        choice.nextPage,
        choice.effect,
        choice.kerukaBondEffect,
        choice.kehindeBondEffect
      );
    }
  };

  return (
    <View style={styles.choiceContainer}>
      {choices.map((choice, index) => {
        const isSelected = selected === choice.nextPage;
        const disabled = selected !== null && !isSelected;
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.choiceButton,
              isSelected && styles.selectedButton,
              disabled && styles.disabledButton,
            ]}
            onPress={() => onPressChoice(choice)}
            disabled={disabled}
          >
            <Text style={[styles.choiceText, isSelected && styles.selectedText]}>
              {choice.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  choiceContainer: {
    position: 'absolute',
    bottom: 30,
    width: '90%',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  choiceButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Default dark background
    height: 36.5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 3,
    borderRadius: 8,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: 'yellow', // Selected button background
  },
  disabledButton: {
    opacity: 0.5, // Dimmed look for unselected buttons after a choice is made
  },
  choiceText: {
    color: '#fff', // Default text color
    fontSize: 13,
    fontWeight: 'bold',
  },
  selectedText: {
    color: 'black', // Text color when selected (on yellow background)
  },
});

export default ChoiceButtons;
