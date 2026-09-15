import { safeGetItem, safeSetItem, safeRemoveItem, STORAGE_KEYS } from './baseStorage';
import { SoundPack } from '../sound';

export interface SettingsData {
  soundEnabled: boolean;
  soundPack: SoundPack;
  hapticEnabled: boolean;
  reducedMotion: boolean;
  theme: 'light' | 'dark';
}

const defaultSettings: SettingsData = {
  soundEnabled: true,
  soundPack: 'zen',
  hapticEnabled: true,
  reducedMotion: false,
  theme: 'dark'
};

export const settingsStorage = {
  getSettings: (): SettingsData => {
    return safeGetItem<SettingsData>(STORAGE_KEYS.SETTINGS, defaultSettings);
  },

  saveSettings: (settings: SettingsData): void => {
    safeSetItem(STORAGE_KEYS.SETTINGS, settings);
  },

  clearSettings: (): void => {
    safeRemoveItem(STORAGE_KEYS.SETTINGS);
  }
};
