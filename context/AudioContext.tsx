import React, { createContext, useState, useContext, useEffect } from 'react';
import { Audio } from 'expo-av';

interface AudioContextProps {
  sound: Audio.Sound | null;
  isPlaying: boolean;
  playMusic: () => Promise<void>;
  stopMusic: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

interface AudioProviderProps {
  children: React.ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadMusic = async () => {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../assets/audio/background.mp3'),
        { isLooping: true }
      );
      setSound(newSound);
    };

    loadMusic();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playMusic = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const stopMusic = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const setVolume = async (volume: number) => {
    if (sound) {
      await sound.setVolumeAsync(volume);
    }
  };

  return (
    <AudioContext.Provider value={{ sound, isPlaying, playMusic, stopMusic, setVolume }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};