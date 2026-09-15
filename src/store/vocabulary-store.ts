import { create } from 'zustand';
import { VocabularyWord, VocabularyStats } from '../lib/vocabulary/types';
import { vocabularyStorage } from '../lib/storage/vocabularyStorage';

interface VocabularyStoreState {
  words: Record<string, VocabularyWord>;
  stats: VocabularyStats;

  // Actions
  recordWord: (word: string, gameSource?: 'boggle' | 'wordspeed' | 'manual') => VocabularyWord;
  toggleFavorite: (word: string) => void;
  markMastered: (word: string) => void;
  getWordsList: (filterTier?: number, filterLen?: number) => VocabularyWord[];
  refreshFromStorage: () => void;
}

export const useVocabularyStore = create<VocabularyStoreState>((set, get) => {
  const initialData = vocabularyStorage.getVault();
  const initialStats = vocabularyStorage.getStats();

  return {
    words: initialData.words,
    stats: initialStats,

    recordWord: (word, gameSource = 'boggle') => {
      const entry = vocabularyStorage.recordDiscoveredWord(word, gameSource);
      const updatedVault = vocabularyStorage.getVault();
      const updatedStats = vocabularyStorage.getStats();
      set({ words: updatedVault.words, stats: updatedStats });
      return entry;
    },

    markMastered: (word) => {
      vocabularyStorage.markMastered(word);
      const updatedVault = vocabularyStorage.getVault();
      const updatedStats = vocabularyStorage.getStats();
      set({ words: updatedVault.words, stats: updatedStats });
    },

    toggleFavorite: (word) => {
      vocabularyStorage.toggleFavorite(word);
      const updatedVault = vocabularyStorage.getVault();
      const updatedStats = vocabularyStorage.getStats();
      set({ words: updatedVault.words, stats: updatedStats });
    },

    getWordsList: (filterTier, filterLen) => {
      const wordsArr = Object.values(get().words);
      return wordsArr.filter(w => {
        if (filterTier !== undefined && w.difficultyTier !== filterTier) return false;
        if (filterLen !== undefined && w.word.length !== filterLen) return false;
        return true;
      }).sort((a, b) => b.discoveredAt - a.discoveredAt);
    },

    refreshFromStorage: () => {
      const vault = vocabularyStorage.getVault();
      const stats = vocabularyStorage.getStats();
      set({ words: vault.words, stats });
    }
  };
});
