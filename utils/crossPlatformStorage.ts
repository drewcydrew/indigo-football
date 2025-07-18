import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { StorageData } from '../context/NamesContext';

const STORAGE_KEY = '@indigo_football_stored_data';

const isWeb = Platform.OS === 'web';

const webStorage = {
  setItem: (key: string, value: string): Promise<void> => {
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getItem: (key: string): Promise<string | null> => {
    try {
      return Promise.resolve(localStorage.getItem(key));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  removeItem: (key: string): Promise<void> => {
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

const storage = isWeb ? webStorage : AsyncStorage;

export const saveToStorage = async (data: StorageData): Promise<void> => {
  try {
    const serializedData = JSON.stringify({
      ...data,
      timestamp: Date.now(),
      platform: Platform.OS
    });
    console.log('Saving to storage:', data); // Debug log
    await storage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    console.warn('Failed to save data:', error);
  }
};

export const loadFromStorage = async (): Promise<StorageData | null> => {
  try {
    const data = await storage.getItem(STORAGE_KEY);
    if (!data) {
      console.log('No data found in storage');
      return null;
    }

    const parsed = JSON.parse(data);
    console.log('Loaded from storage:', parsed); // Debug log
    
    // Validate the data structure
    const isValid = parsed.names && Array.isArray(parsed.names) && 
      parsed.names.every((team: any) => 
        Array.isArray(team) && team.every((player: any) => 
          typeof player === 'object' &&
          typeof player.name === 'string' &&
          typeof player.score === 'number' &&
          typeof player.included === 'boolean'
        )
      );

    if (!isValid) {
      console.warn('Invalid data structure in storage');
      return null;
    }

    return {
      names: parsed.names,
      showScores: typeof parsed.showScores === 'boolean' ? parsed.showScores : true,
      numTeams: typeof parsed.numTeams === 'number' ? parsed.numTeams : 2,
      teamNames: parsed.teamNames || {},
      teamColors: parsed.teamColors || {},
      repulsors: parsed.repulsors || [],
      algorithm: parsed.algorithm || 'scores',
      currentCollection: parsed.currentCollection || 'Players'
    };
  } catch (error) {
    console.warn('Failed to load data:', error);
    return null;
  }
};

export const clearStorage = async (): Promise<void> => {
  try {
    await storage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear storage:', error);
  }
};