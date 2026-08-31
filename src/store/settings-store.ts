import { create } from 'zustand';
import { settingsStorage } from '../lib/storage/settingsStorage';
import { soundManager, SoundPack } from '../lib/sound';

export interface SettingsState {
  soundEnabled: boolean;
  soundPack: SoundPack;
  hapticEnabled: boolean;
  reducedMotion: boolean;
  theme: 'light' | 'dark';

  toggleSound: () => void;
  setSoundPack: (pack: SoundPack) => void;
  toggleHaptic: () => void;
  toggleReducedMotion: () => void;
  toggleTheme: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => {
  const saved = settingsStorage.getSettings();

  soundManager.setEnabled(saved.soundEnabled);
  soundManager.setSoundPack(saved.soundPack || 'zen');

  // Apply dark mode class to html document if saved
  if (typeof document !== 'undefined') {
    if (saved.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  const persist = (next: Partial<SettingsState>) => {
    const updated = { ...get(), ...next };
    settingsStorage.saveSettings({
      soundEnabled: updated.soundEnabled,
      soundPack: updated.soundPack,
      hapticEnabled: updated.hapticEnabled,
      reducedMotion: updated.reducedMotion,
      theme: updated.theme
    });
  };

  return {
    soundEnabled: saved.soundEnabled,
    soundPack: saved.soundPack || 'zen',
    hapticEnabled: saved.hapticEnabled,
    reducedMotion: saved.reducedMotion,
    theme: saved.theme,

    toggleSound: () => {
      const next = !get().soundEnabled;
      soundManager.setEnabled(next);
      set({ soundEnabled: next });
      persist({ soundEnabled: next });
    },

    setSoundPack: (pack: SoundPack) => {
      soundManager.setSoundPack(pack);
      set({ soundPack: pack });
      persist({ soundPack: pack });
    },

    toggleHaptic: () => {
      const next = !get().hapticEnabled;
      set({ hapticEnabled: next });
      persist({ hapticEnabled: next });
    },

    toggleReducedMotion: () => {
      const next = !get().reducedMotion;
      set({ reducedMotion: next });
      persist({ reducedMotion: next });
    },

    toggleTheme: () => {
      const current = get().theme;
      const next = current === 'light' ? 'dark' : 'light';
      if (typeof document !== 'undefined') {
        if (next === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      set({ theme: next });
      persist({ theme: next });
    }
  };
});
