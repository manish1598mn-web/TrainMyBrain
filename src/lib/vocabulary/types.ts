export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'conjunction'
  | 'pronoun'
  | 'interjection';

export interface VocabularyWord {
  word: string; // Uppercase normalized
  definition: string;
  partOfSpeech: PartOfSpeech;
  exampleSentence?: string;
  synonyms?: string[];
  antonyms?: string[];
  difficultyTier: 1 | 2 | 3 | 4 | 5;
  discoveredAt: number; // Timestamp
  timesFound: number;
  gameSource: 'boggle' | 'wordspeed' | 'manual';
  favorite?: boolean;
  mastered?: boolean;
}

export interface VocabularyStats {
  totalWords: number;
  uniqueWords: number;
  totalLength: number;
  favoriteCount: number;
  byTier: Record<number, number>;
  bySource: Record<string, number>;
}
