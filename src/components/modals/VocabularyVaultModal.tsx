import React, { useState, useMemo } from 'react';
import { useVocabularyStore } from '../../store/vocabulary-store';
import { VocabularyWord } from '../../lib/vocabulary/types';
import { 
  BookOpen, Search, Star, X, RotateCcw, 
  CheckCircle2, Brain
} from 'lucide-react';

interface VocabularyVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VocabularyVaultModal: React.FC<VocabularyVaultModalProps> = ({
  isOpen,
  onClose
}) => {
  const { words, stats, toggleFavorite, markMastered } = useVocabularyStore();
  const [activeTab, setActiveTab] = useState<'bank' | 'flashcards'>('bank');
  const [searchQuery, setSearchQuery] = useState('');
  const [lengthFilter, setLengthFilter] = useState<'all' | '3-4' | '5-6' | '7-8' | '9+'>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionReviewed, setSessionReviewed] = useState(0);

  const wordsList: VocabularyWord[] = useMemo(() => Object.values(words), [words]);

  // Filtered word list
  const filteredWords = useMemo(() => {
    return wordsList.filter((w: VocabularyWord) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesWord = w.word.toLowerCase().includes(q);
        const matchesDef = w.definition.toLowerCase().includes(q);
        if (!matchesWord && !matchesDef) return false;
      }

      // Favorite filter
      if (onlyFavorites && !w.favorite) return false;

      // Length filter
      const len = w.word.length;
      if (lengthFilter === '3-4' && (len < 3 || len > 4)) return false;
      if (lengthFilter === '5-6' && (len < 5 || len > 6)) return false;
      if (lengthFilter === '7-8' && (len < 7 || len > 8)) return false;
      if (lengthFilter === '9+' && len < 9) return false;

      return true;
    });
  }, [wordsList, searchQuery, lengthFilter, onlyFavorites]);

  if (!isOpen) return null;

  // Flashcard words pool (from filtered or all words)
  const flashcardPool: VocabularyWord[] = filteredWords.length > 0 ? filteredWords : wordsList;
  const currentCard: VocabularyWord | undefined = flashcardPool[cardIndex % Math.max(1, flashcardPool.length)];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCardIndex(prev => (prev + 1) % Math.max(1, flashcardPool.length));
    setSessionReviewed(prev => prev + 1);
  };

  const handleMasterCard = () => {
    if (currentCard) {
      markMastered(currentCard.word);
    }
    handleNextCard();
  };

  // Tier color mapper
  const getTierBadge = (tier: number) => {
    switch (tier) {
      case 1:
        return { label: 'Essential', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };
      case 2:
        return { label: 'Core', color: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30' };
      case 3:
        return { label: 'Academic', color: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30' };
      case 4:
        return { label: 'Advanced', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30' };
      case 5:
      default:
        return { label: 'Master', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in select-none">
      <div className="glass-panel-elevated relative w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200/80 dark:border-slate-800">
        
        {/* 1. Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Vocabulary Vault
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-mono font-bold">
                  {stats.uniqueWords} Words
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Created & Discovered in Boggle and Word Speed
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Stat Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-5 py-3 bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Found</span>
            <span className="text-lg font-black font-mono text-slate-900 dark:text-white">{stats.totalWords}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mastered</span>
            <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
              {wordsList.filter((w: VocabularyWord) => w.mastered).length}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Longest Word</span>
            <span className="text-sm font-bold font-mono text-rose-600 dark:text-rose-400 truncate">
              {wordsList.reduce((max: string, w: VocabularyWord) => w.word.length > max.length ? w.word : max, '') || '—'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Favorites</span>
            <span className="text-lg font-black font-mono text-amber-500">
              {stats.favoriteCount}
            </span>
          </div>
        </div>

        {/* 3. Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('bank')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'bank'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Word Bank</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('flashcards');
              setIsFlipped(false);
            }}
            disabled={wordsList.length === 0}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'flashcards'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-40'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Flashcard Practice</span>
            {wordsList.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/10 text-rose-600 font-mono">
                {flashcardPool.length}
              </span>
            )}
          </button>
        </div>

        {/* 4. Tab Content */}
        {activeTab === 'bank' ? (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search discovered words or definitions..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              {/* Length Filter Chips */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {(['all', '3-4', '5-6', '7-8', '9+'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setLengthFilter(l)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all shrink-0 ${
                      lengthFilter === l
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {l === 'all' ? 'All Letters' : `${l} Letters`}
                  </button>
                ))}

                {/* Favorites Toggle */}
                <button
                  onClick={() => setOnlyFavorites(!onlyFavorites)}
                  className={`p-1.5 rounded-lg border transition-all shrink-0 ${
                    onlyFavorites
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-500'
                      : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500'
                  }`}
                  title="Show starred favorites only"
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>

            {/* Word List Grid */}
            {filteredWords.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {wordsList.length === 0 ? 'No words discovered yet' : 'No words match this filter'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  {wordsList.length === 0 
                    ? 'Play Boggle or Word Speed! Every meaningful word you create will automatically save to your personal dictionary.'
                    : 'Try changing your search term or adjusting the length filter.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredWords.map((w: VocabularyWord) => {
                  const tier = getTierBadge(w.difficultyTier);
                  return (
                    <div
                      key={w.word}
                      className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-rose-500/40 transition-all flex flex-col justify-between group shadow-xs"
                    >
                      <div>
                        {/* Word Header */}
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-black font-mono tracking-wide text-slate-900 dark:text-white">
                              {w.word}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {w.word.length}L
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${tier.color}`}>
                              {tier.label}
                            </span>
                          </div>

                          <button
                            onClick={() => toggleFavorite(w.word)}
                            className={`p-1 rounded-lg transition-colors ${
                              w.favorite
                                ? 'text-amber-400 hover:text-amber-500'
                                : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${w.favorite ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        {/* Part of Speech & Definition */}
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                          <span className="italic text-slate-500 dark:text-slate-400 mr-1 font-serif">
                            ({w.partOfSpeech})
                          </span>
                          {w.definition}
                        </p>

                        {/* Example sentence */}
                        {w.exampleSentence && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic border-l-2 border-rose-500/40 pl-2 mb-2">
                            "{w.exampleSentence}"
                          </p>
                        )}
                      </div>

                      {/* Card Footer: Source & Times Found */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[10px] font-mono text-slate-400">
                        <span className="capitalize">Source: {w.gameSource}</span>
                        <span>Found {w.timesFound}x</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Flashcards Practice View */
          <div className="flex-1 overflow-y-auto p-5 flex flex-col items-center justify-center">
            {currentCard ? (
              <div className="w-full max-w-md flex flex-col items-center">
                <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-3 px-1">
                  <span>Card {cardIndex + 1} of {flashcardPool.length}</span>
                  <span>Reviewed: {sessionReviewed}</span>
                </div>

                {/* Flip Card Container */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full min-h-[16rem] rounded-3xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700/80 p-6 flex flex-col items-center justify-center text-center cursor-pointer shadow-lg hover:shadow-xl hover:border-rose-500/50 transition-all select-none relative"
                >
                  <span className="absolute top-4 right-4 text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Tap to flip
                  </span>

                  {!isFlipped ? (
                    /* Front: The Word */
                    <div className="flex flex-col items-center animate-in zoom-in-95">
                      <span className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-slate-900 dark:text-white mb-3">
                        {currentCard.word}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-serif italic text-slate-500">
                          ({currentCard.partOfSpeech})
                        </span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                          {currentCard.word.length} Letters
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 mt-6 italic">
                        Do you know the definition? Tap to check!
                      </span>
                    </div>
                  ) : (
                    /* Back: Definition & Sentence */
                    <div className="flex flex-col items-center animate-in zoom-in-95">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-500 mb-2">
                        Definition
                      </span>
                      <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100 leading-relaxed mb-4">
                        {currentCard.definition}
                      </p>
                      {currentCard.exampleSentence && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic border-l-2 border-rose-500/40 pl-3">
                          "{currentCard.exampleSentence}"
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Practice Controls */}
                <div className="flex items-center justify-center gap-3 mt-5 w-full">
                  <button
                    onClick={handleNextCard}
                    className="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Review Later</span>
                  </button>

                  <button
                    onClick={handleMasterCard}
                    className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>I Know This!</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
};
