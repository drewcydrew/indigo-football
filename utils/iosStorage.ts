import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Player } from '../context/NamesContext';

const STORAGE_KEY = '@indigo_football_data';

export const saveToStorage = async (names: Player[][]): Promise<void> => {
  if (Platform.OS !== 'ios') return;
  
  try {
    const data = JSON.stringify({ names, timestamp: Date.now() });
    await AsyncStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    console.warn('Failed to save data:', error);
  }
};

export const loadFromStorage = async (): Promise<Player[][] | null> => {
  if (Platform.OS !== 'ios') return null;

  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data);
    if (!parsed.names || !Array.isArray(parsed.names)) return null;

    // Validate the data structure
    const isValid = parsed.names.every((team: any) => 
      Array.isArray(team) && team.every((player: any) => 
        typeof player === 'object' &&
        typeof player.name === 'string' &&
        typeof player.score === 'number' &&
        typeof player.included === 'boolean'
      )
    );

    return isValid ? parsed.names : null;
  } catch (error) {
    console.warn('Failed to load data:', error);
    return null;
  }
};

export const clearStorage = async (): Promise<void> => {
  if (Platform.OS !== 'ios') return;
  
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear storage:', error);
  }
};
