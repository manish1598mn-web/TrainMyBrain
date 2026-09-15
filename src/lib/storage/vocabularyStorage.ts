import { safeGetItem, safeSetItem, STORAGE_KEYS } from './baseStorage';
import { VocabularyWord, VocabularyStats } from '../vocabulary/types';
import { resolveWordDefinition } from '../vocabulary/vocabulary-database';

export interface VocabularyData {
  words: Record<string, VocabularyWord>;
  lastUpdated: number;
}

const defaultVocabularyData: VocabularyData = {
  words: {},
  lastUpdated: Date.now()
};

export const vocabularyStorage = {
  getVault(): VocabularyData {
    return safeGetItem<VocabularyData>(STORAGE_KEYS.VOCABULARY, defaultVocabularyData);
  },

  saveVault(data: VocabularyData): void {
    safeSetItem(STORAGE_KEYS.VOCABULARY, {
      ...data,
      lastUpdated: Date.now()
    });
  },

  recordDiscoveredWord(
    rawWord: string,
    gameSource: 'boggle' | 'wordspeed' | 'manual' = 'boggle'
  ): VocabularyWord {
    const word = rawWord.toUpperCase().trim();
    const vault = this.getVault();
    const existing = vault.words[word];

    if (existing) {
      existing.timesFound += 1;
      existing.discoveredAt = Date.now();
      this.saveVault(vault);
      return existing;
    }

    const lexical = resolveWordDefinition(word);
    const newEntry: VocabularyWord = {
      word,
      definition: lexical.definition,
      partOfSpeech: lexical.partOfSpeech,
      exampleSentence: lexical.exampleSentence,
      synonyms: lexical.synonyms || [],
      difficultyTier: lexical.difficultyTier,
      discoveredAt: Date.now(),
      timesFound: 1,
      gameSource,
      favorite: false,
      mastered: false
    };

    vault.words[word] = newEntry;
    this.saveVault(vault);
    return newEntry;
  },

  markMastered(rawWord: string): boolean {
    const word = rawWord.toUpperCase().trim();
    const vault = this.getVault();
    if (vault.words[word]) {
      vault.words[word].mastered = true;
      this.saveVault(vault);
      return true;
    }
    return false;
  },

  toggleFavorite(rawWord: string): boolean {
    const word = rawWord.toUpperCase().trim();
    const vault = this.getVault();
    if (vault.words[word]) {
      vault.words[word].favorite = !vault.words[word].favorite;
      this.saveVault(vault);
      return !!vault.words[word].favorite;
    }
    return false;
  },

  getStats(): VocabularyStats {
    const vault = this.getVault();
    const entries = Object.values(vault.words);
    const byTier: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const bySource: Record<string, number> = { boggle: 0, wordspeed: 0, manual: 0 };
    let totalLength = 0;
    let favoriteCount = 0;

    for (const entry of entries) {
      byTier[entry.difficultyTier] = (byTier[entry.difficultyTier] || 0) + 1;
      bySource[entry.gameSource] = (bySource[entry.gameSource] || 0) + 1;
      totalLength += entry.word.length;
      if (entry.favorite) favoriteCount++;
    }

    return {
      totalWords: entries.reduce((acc, e) => acc + e.timesFound, 0),
      uniqueWords: entries.length,
      totalLength,
      favoriteCount,
      byTier,
      bySource
    };
  }
};
