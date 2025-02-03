import React, { createContext, useState, useContext, useEffect } from 'react';
import { Audio } from 'expo-av';

interface AudioContextProps {
  isPlaying: boolean;
  playMusic: () => Promise<void>;
  pauseMusic: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

interface AudioProviderProps {
  children: React.ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const configureAndLoadAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeIOS: 1, // DO_NOT_MIX equivalent
          interruptionModeAndroid: 1, // DO_NOT_MIX equivalent,
        });
        console.log('✅ Audio mode configured');

        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../assets/audio/background.mp3'),
          { isLooping: true }
        );

        setSound(newSound);
        setIsLoaded(true);
        console.log('✅ Sound loaded successfully');

        await newSound.playAsync();
        setIsPlaying(true);
        console.log('▶️ Auto-play started');
      } catch (error) {
        console.error('❌ Error loading/playing sound:', error);
      }
    };

    configureAndLoadAudio();

    return () => {
      if (sound) {
        sound.unloadAsync().catch(console.error);
      }
    };
  }, []);

  const playMusic = async () => {
    if (sound && isLoaded) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded && !status.isPlaying) {
          await sound.playAsync();
          setIsPlaying(true);
          console.log('▶️ Music is playing');
        }
      } catch (error) {
        console.error('❌ Error playing sound:', error);
      }
    } else {
      console.log('⚠️ Sound is not loaded yet');
    }
  };

  const pauseMusic = async () => {
    if (sound && isLoaded && isPlaying) {
      try {
        await sound.pauseAsync();
        setIsPlaying(false);
        console.log('⏸️ Music paused');
      } catch (error) {
        console.error('❌ Error pausing sound:', error);
      }
    }
  };

  const setVolume = async (volume: number) => {
    if (sound && isLoaded) {
      try {
        await sound.setVolumeAsync(volume);
        console.log(`🔊 Volume set to ${volume}`);
      } catch (error) {
        console.error('❌ Error setting volume:', error);
      }
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, playMusic, pauseMusic, setVolume }}>
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
