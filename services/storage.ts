import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Player, Team } from '../context/NamesContext';

interface StorageData {
  names: Player[][];
  teams: Team[];
  showScores: boolean;
  numTeams: number;
}

class StorageService {
  private static instance: StorageService;
  private isAvailable: boolean = false;

  private constructor() {
    this.checkAvailability();
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private async checkAvailability(): Promise<void> {
    try {
      const testKey = '__storage_test__';
      await AsyncStorage.setItem(testKey, 'test');
      await AsyncStorage.removeItem(testKey);
      this.isAvailable = true;
    } catch (error) {
      this.isAvailable = false;
      console.warn('AsyncStorage is not available:', error);
    }
  }

  async saveData(data: Partial<StorageData>): Promise<boolean> {
    if (!this.isAvailable) return false;

    try {
      const promises = Object.entries(data).map(([key, value]) =>
        AsyncStorage.setItem(key, JSON.stringify(value))
      );
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Storage save error:', error);
      return false;
    }
  }

  async loadData(): Promise<Partial<StorageData>> {
    if (!this.isAvailable) return {};

    try {
      const keys = ['names', 'teams', 'showScores', 'numTeams'];
      const results = await Promise.all(
        keys.map(async (key) => {
          try {
            const value = await AsyncStorage.getItem(key);
            return value ? JSON.parse(value) : null;
          } catch (e) {
            console.error(`Error loading ${key}:`, e);
            return null;
          }
        })
      );

      const [names, teams, showScores, numTeams] = results;
      return {
        names: Array.isArray(names) ? names : undefined,
        teams: Array.isArray(teams) ? teams : undefined,
        showScores: typeof showScores === 'boolean' ? showScores : undefined,
        numTeams: typeof numTeams === 'number' ? numTeams : undefined,
      };
    } catch (error) {
      console.error('Storage load error:', error);
      return {};
    }
  }

  async clearStorage(): Promise<void> {
    if (!this.isAvailable) return;

    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }
}

export const storage = StorageService.getInstance();
