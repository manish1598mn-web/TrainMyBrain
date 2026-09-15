import React, { useState, useEffect } from 'react';
import { GameId, GameResult } from './engine/game-engine/types';
import { useProgressStore } from './store/progress-store';
import { usePlayerStore } from './store/player-store';
import { useSettingsStore } from './store/settings-store';
import { soundManager } from './lib/sound';

// Components
import { Navbar } from './components/navigation/Navbar';
import { BottomNav } from './components/navigation/BottomNav';
import { Hero } from './components/home/Hero';
import { GameCardsSection } from './components/home/GameCardsSection';
import { ContinueTraining } from './components/home/ContinueTraining';
import { ProgressPreview } from './components/home/ProgressPreview';
import { RecommendedCard } from './components/home/RecommendedCard';
import { StreakWeeklyCard } from './components/home/StreakWeeklyCard';
import { WhyTrainMyBrain } from './components/home/WhyTrainMyBrain';
import { ProgressDashboard } from './components/progress/ProgressDashboard';
import { DailyChallengeView } from './components/challenges/DailyChallengeView';
import { ProfileModal } from './components/profile/ProfileModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { ResultModal } from './components/results/ResultModal';
import { DiagnosticsModal } from './components/diagnostics/DiagnosticsModal';
import { AIAdminModal } from './components/admin/AIAdminModal';
import { BackupSyncModal } from './components/sync/BackupSyncModal';
import { IncomingSyncModal } from './components/sync/IncomingSyncModal';
import { KeyboardShortcutsModal } from './components/ui/KeyboardShortcutsModal';
import { decodeDeviceTransferPayload, TransferSummary } from './lib/storage/backupSync';
import { ProgressData } from './lib/storage/progressStorage';

// Duel & Ghost Components
import { DuelInviteModal } from './components/duel/DuelInviteModal';
import { DuelShareModal } from './components/duel/DuelShareModal';
import { decodeDuelUrl, compareDuelResults } from './lib/duel/duelEngine';
import { DuelChallenge, DuelComparison } from './lib/duel/types';

// Game Views
import { GameShell } from './components/games/GameShell';
import { WordSpeedView } from './games/wordspeed/WordSpeedView';
import { BoggleView } from './games/boggle/BoggleView';
import { AnzanView } from './games/anzan/AnzanView';
import { SudokuView } from './games/sudoku/SudokuView';
import { ZebraView } from './games/zebra/ZebraView';
import { MindMixView } from './games/mindmix/MindMixView';
import { TrainingView } from './components/training/TrainingView';

export function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'games' | 'progress' | 'challenges'>('home');
  const [activeGameId, setActiveGameId] = useState<GameId | 'mindmix' | 'training' | null>(null);
  const [activeGameMode, setActiveGameMode] = useState<string | undefined>(undefined);
  const [activeGameLevel, setActiveGameLevel] = useState<number>(1);
  const [customSeed, setCustomSeed] = useState<string | number | undefined>(undefined);
  const [gameKey, setGameKey] = useState(0);

  const { theme } = useSettingsStore();

  // Duel & Ghost State
  const [duelInvite, setDuelInvite] = useState<DuelChallenge | null>(null);
  const [activeDuel, setActiveDuel] = useState<DuelChallenge | null>(null);
  const [duelComparison, setDuelComparison] = useState<DuelComparison | null>(null);
  const [duelShareData, setDuelShareData] = useState<DuelChallenge | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Check incoming Duel Challenge on URL mount
  useEffect(() => {
    const incoming = decodeDuelUrl();
    if (incoming) {
      setDuelInvite(incoming);
    }

    // Check incoming Device Progress Transfer (?sync=...)
    if (typeof window !== 'undefined' && window.location.search.includes('sync=')) {
      const res = decodeDeviceTransferPayload(window.location.search);
      if (res.success && res.data && res.summary) {
        setIncomingSyncData({ data: res.data, summary: res.summary });
      }
    }
  }, []);

  // Modals & Results State
  const [activeResult, setActiveResult] = useState<{ result: GameResult; leveledUp: boolean } | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [diagnosticsModalOpen, setDiagnosticsModalOpen] = useState(false);
  const [aiAdminModalOpen, setAiAdminModalOpen] = useState(false);
  const [backupSyncModalOpen, setBackupSyncModalOpen] = useState(false);
  const [incomingSyncData, setIncomingSyncData] = useState<{ data: ProgressData; summary: TransferSummary } | null>(null);

  // Global Keyboard Shortcuts Listener (?)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        soundManager.playTap();
        setShortcutsModalOpen(prev => !prev);
      }

      // Developer diagnostics key (Ctrl+Shift+D)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setDiagnosticsModalOpen(prev => !prev);
      }

      // Quick tab navigation when on dashboard screens
      if (!activeGameId && !shortcutsModalOpen) {
        if (e.key === '1') setCurrentTab('home');
        else if (e.key === '2') setCurrentTab('games');
        else if (e.key === '3') setCurrentTab('progress');
        else if (e.key === '4') setCurrentTab('challenges');
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeGameId, shortcutsModalOpen]);

  const { games, recordGameResult } = useProgressStore();

  const handleLaunchGame = (gameId: GameId, customLevel?: number, mode?: string, seed?: string | number) => {
    soundManager.playTap();
    const lvl = customLevel ?? games[gameId].level;
    setActiveGameId(gameId);
    setActiveGameLevel(lvl);
    setActiveGameMode(mode);
    setCustomSeed(seed);
    setGameKey(k => k + 1);
    setActiveResult(null);
    setActiveDuel(null);
    setDuelComparison(null);
  };

  const handleLaunchMindMix = () => {
    soundManager.playTap();
    setActiveGameId('mindmix');
    setActiveGameLevel(20);
    setActiveGameMode('5-Stage Sprint');
    setCustomSeed(undefined);
    setGameKey(k => k + 1);
    setActiveResult(null);
    setActiveDuel(null);
    setDuelComparison(null);
  };

  const handleLaunchTraining = (trainingLevel: number = 1) => {
    soundManager.playTap();
    setActiveGameId('training');
    setActiveGameLevel(trainingLevel);
    setActiveGameMode('Foundational Training');
    setCustomSeed(undefined);
    setGameKey(k => k + 1);
    setActiveResult(null);
    setActiveDuel(null);
    setDuelComparison(null);
  };

  const handleAcceptDuel = (duel: DuelChallenge) => {
    soundManager.playCorrect();
    setDuelInvite(null);
    setActiveDuel(duel);
    setActiveGameId(duel.gameId);
    setActiveGameLevel(duel.level);
    setActiveGameMode(`Duel vs ${duel.creatorName}`);
    setCustomSeed(duel.seed);
    setGameKey(k => k + 1);
    setActiveResult(null);
    setDuelComparison(null);
  };

  const handleGameComplete = (data: {
    accuracy: number;
    timeMs: number;
    score: number;
    mistakes: number;
    mode?: string;
  }) => {
    if (!activeGameId) return;

    if (activeGameId === 'mindmix' || activeGameId === 'training') {
      const fakeResult: GameResult = {
        gameId: 'anzan',
        level: activeGameLevel,
        score: data.score,
        accuracy: data.accuracy,
        timeMs: data.timeMs,
        mistakes: data.mistakes,
        completed: true,
        timestamp: Date.now(),
        performanceScore: Math.round(data.accuracy * 0.9),
        speedScore: 85,
        difficultyScore: 75,
        consistencyScore: 90,
        baselineImprovementPercent: 0,
        speedAccuracySummary: activeGameId === 'training' ? 'Foundational Training Complete' : 'Adaptive Mental Switch Complete',
        mastery: 80,
        previousMastery: 75,
        masteryDelta: 5,
        insight: activeGameId === 'training' ? 'Great foundation built. Continue training toward Main Level 1.' : 'Excellent cognitive flexibility. Keep cycling disciplines to maintain fast mental switching speeds.'
      };
      usePlayerStore.getState().recordTrainingActivity({
        timeMs: data.timeMs,
        problemsCount: activeGameId === 'training' ? 15 : 10,
        isSuccessful: data.accuracy >= 70,
        isLevelUp: false
      });
      setActiveResult({ result: fakeResult, leveledUp: false });
      return;
    }

    const { result, leveledUp } = recordGameResult(
      activeGameId as GameId,
      data.accuracy,
      data.timeMs,
      data.score,
      data.mistakes,
      data.mode || activeGameMode
    );

    // Record cumulative time spent and problems metrics
    usePlayerStore.getState().recordTrainingActivity({
      timeMs: data.timeMs,
      problemsCount: activeGameId === 'wordspeed' ? 15 : activeGameId === 'boggle' ? 6 : activeGameId === 'sudoku' ? 9 : 7,
      isSuccessful: data.accuracy >= 70,
      isLevelUp: leveledUp
    });

    // If this was a duel run, evaluate head-to-head comparison
    if (activeDuel) {
      const comparison = compareDuelResults(
        {
          name: activeDuel.creatorName,
          timeMs: activeDuel.creatorTimeMs,
          accuracy: activeDuel.creatorAccuracy
        },
        {
          timeMs: data.timeMs,
          accuracy: data.accuracy
        }
      );
      setDuelComparison(comparison);
    } else {
      setDuelComparison(null);
    }

    setActiveResult({ result, leveledUp });
  };

  const handleExitGame = () => {
    soundManager.playTap();
    setActiveGameId(null);
    setActiveResult(null);
    setActiveDuel(null);
    setDuelComparison(null);
    setCustomSeed(undefined);
  };

  const handleOpenDuelShare = () => {
    if (!activeResult || !activeGameId || activeGameId === 'mindmix' || activeGameId === 'training') return;
    const userProfile = usePlayerStore.getState();
    const newDuel: DuelChallenge = {
      duelId: `duel-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      gameId: activeGameId as GameId,
      level: activeGameLevel,
      seed: customSeed ? String(customSeed) : `seed-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      creatorName: userProfile.displayName || 'Challenger',
      creatorTimeMs: activeResult.result.timeMs,
      creatorAccuracy: activeResult.result.accuracy,
      creatorScore: activeResult.result.score,
      createdAt: Date.now()
    };
    setDuelShareData(newDuel);
  };

  // Determine Ghost Target Time (Duel Challenger Ghost OR Personal Best)
  const currentBestTime = (activeGameId && activeGameId !== 'mindmix' && activeGameId !== 'training') ? games[activeGameId as GameId]?.bestTimeMs : 0;
  const ghostTargetMs = activeDuel
    ? activeDuel.creatorTimeMs
    : currentBestTime > 0
    ? currentBestTime
    : undefined;
  const ghostLabel = activeDuel ? `${activeDuel.creatorName}'s Ghost` : 'Personal Best';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (activeGameId) handleExitGame();
          setCurrentTab(tab);
        }}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 pb-20 sm:pb-8">
        
        {/* Active Game Shell Screen */}
        {activeGameId ? (
          activeGameId === 'training' ? (
            <TrainingView
              initialLevel={activeGameLevel}
              onExit={handleExitGame}
              onLaunchMainGame={(gId, lvl) => handleLaunchGame(gId as GameId, lvl)}
            />
          ) : activeGameId === 'mindmix' ? (
            <GameShell
              key={gameKey}
              gameId="anzan"
              level={activeGameLevel}
              modeName="Mind Mix Sprint"
              onExit={handleExitGame}
              onRestart={handleLaunchMindMix}
            >
              {({ timer, isPaused, isReady }) => (
                <MindMixView
                  timer={timer}
                  isPaused={isPaused}
                  isReady={isReady}
                  onComplete={handleGameComplete}
                />
              )}
            </GameShell>
          ) : (
            <GameShell
              key={gameKey}
              gameId={activeGameId}
              level={activeGameLevel}
              modeName={activeGameMode}
              ghostTargetMs={ghostTargetMs}
              ghostLabel={ghostLabel}
              onExit={handleExitGame}
              onRestart={() => handleLaunchGame(activeGameId, activeGameLevel, activeGameMode, customSeed)}
            >
              {({ timer, isPaused, isReady }) => (
                <>
                  {activeGameId === 'wordspeed' && (
                    <WordSpeedView
                      level={activeGameLevel}
                      timer={timer}
                      isPaused={isPaused}
                      isReady={isReady}
                      customSeed={customSeed}
                      onComplete={handleGameComplete}
                    />
                  )}

                  {activeGameId === 'boggle' && (
                    <BoggleView
                      level={activeGameLevel}
                      timer={timer}
                      isPaused={isPaused}
                      isReady={isReady}
                      customSeed={customSeed}
                      onComplete={handleGameComplete}
                    />
                  )}

                  {activeGameId === 'anzan' && (
                    <AnzanView
                      level={activeGameLevel}
                      timer={timer}
                      isPaused={isPaused}
                      isReady={isReady}
                      customSeed={customSeed}
                      onComplete={handleGameComplete}
                    />
                  )}

                  {activeGameId === 'sudoku' && (
                    <SudokuView
                      level={activeGameLevel}
                      timer={timer}
                      isPaused={isPaused}
                      isReady={isReady}
                      customSeed={customSeed}
                      onComplete={handleGameComplete}
                    />
                  )}

                  {activeGameId === 'zebra' && (
                    <ZebraView
                      level={activeGameLevel}
                      timer={timer}
                      isPaused={isPaused}
                      isReady={isReady}
                      customSeed={customSeed}
                      onComplete={handleGameComplete}
                    />
                  )}
                </>
              )}
            </GameShell>
          )
        ) : (
          <div>
            {/* 1. Home Tab Layout */}
            {currentTab === 'home' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <Hero 
                  onExploreGames={() => setCurrentTab('games')}
                  onPlayGame={handleLaunchGame}
                  onPlayMindMix={handleLaunchMindMix}
                  onPlayTraining={handleLaunchTraining}
                />

                {/* Primary Game Grid */}
                <GameCardsSection
                  onPlayGame={handleLaunchGame}
                  onPlayMindMix={handleLaunchMindMix}
                  onPlayTraining={handleLaunchTraining}
                />

                {/* Continue Training Strip */}
                <ContinueTraining
                  onPlayGame={handleLaunchGame}
                  onExploreGames={() => setCurrentTab('games')}
                />

                {/* Cognitive Skill Profile & Weakness Recommendation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-10">
                  <ProgressPreview onViewFullProgress={() => setCurrentTab('progress')} />
                  <RecommendedCard onPlayGame={handleLaunchGame} />
                </div>

                {/* Streak & Weekly Consistency Tracker */}
                <div className="my-10">
                  <StreakWeeklyCard />
                </div>

                {/* Why TrainMyBrain? (Responsible Exam Transfer) */}
                <WhyTrainMyBrain />
              </div>
            )}

            {/* 2. Games Tab Layout */}
            {currentTab === 'games' && (
              <div>
                <GameCardsSection
                  onPlayGame={handleLaunchGame}
                  onPlayMindMix={handleLaunchMindMix}
                />
                <div className="my-8 max-w-xl mx-auto">
                  <RecommendedCard onPlayGame={handleLaunchGame} />
                </div>
              </div>
            )}

            {/* 3. Progress Analytics Tab Layout */}
            {currentTab === 'progress' && (
              <ProgressDashboard onPlayGame={handleLaunchGame} />
            )}

            {/* 4. Daily Challenges Tab Layout (Coming Soon) */}
            {currentTab === 'challenges' && (
              <DailyChallengeView />
            )}
          </div>
        )}

      </main>

      {/* Global Minimalist Footer */}
      {!activeGameId && (
        <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-[#0B0F17]/50 py-6 text-center text-xs text-slate-400 select-none">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="font-medium">
              Train<span className="text-teal-600 dark:text-teal-400 font-bold">MyBrain</span> â€¢ Train Your Mind. Solve Faster.
            </p>
            <p className="text-[11px] text-slate-400">
              Anonymous client-side local training â€¢ Shareable challenge links
            </p>
          </div>
        </footer>
      )}

      {/* Result Modal with Duel Comparison & Challenge a Friend Button */}
      {activeResult && (
        <ResultModal
          result={activeResult.result}
          leveledUp={activeResult.leveledUp}
          duelComparison={duelComparison || undefined}
          onChallengeFriend={handleOpenDuelShare}
          onTrainNextLevel={(newLevel) => {
            if (activeGameId === 'mindmix') {
              handleLaunchMindMix();
            } else if (activeGameId === 'training') {
              handleLaunchTraining(newLevel);
            } else if (activeGameId) {
              handleLaunchGame(activeGameId as GameId, newLevel, activeGameMode);
            }
          }}
          onReplayLevel={(levelToReplay) => {
            if (activeGameId === 'mindmix') {
              handleLaunchMindMix();
            } else if (activeGameId === 'training') {
              handleLaunchTraining(levelToReplay);
            } else if (activeGameId) {
              handleLaunchGame(activeGameId as GameId, levelToReplay, activeGameMode, customSeed);
            }
          }}
          onHome={() => {
            setActiveGameId(null);
            setActiveResult(null);
            setActiveDuel(null);
            setDuelComparison(null);
            setCustomSeed(undefined);
          }}
        />
      )}

      {/* Duel Invite Modal (shown when opening a challenge link) */}
      <DuelInviteModal
        isOpen={duelInvite !== null}
        onClose={() => setDuelInvite(null)}
        onAccept={handleAcceptDuel}
        duel={duelInvite}
      />

      {/* Duel Share Modal (shown when clicking "Challenge a Friend") */}
      <DuelShareModal
        isOpen={duelShareData !== null}
        onClose={() => setDuelShareData(null)}
        duel={duelShareData}
      />

      {/* Bottom Navigation for Mobile */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (activeGameId) handleExitGame();
          setCurrentTab(tab);
        }}
      />

      {/* Global Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Global Keyboard Shortcuts Guide Modal (Phase 1) */}
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />

      {/* Global Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        onOpenBackupSync={() => {
          setSettingsModalOpen(false);
          setBackupSyncModalOpen(true);
        }}
      />

      {/* Global Diagnostics & Verification Suite Modal (Phase 6) */}
      <DiagnosticsModal
        isOpen={diagnosticsModalOpen}
        onClose={() => setDiagnosticsModalOpen(false)}
      />

      {/* AI Content Factory & Quality Dashboard Modal */}
      <AIAdminModal
        isOpen={aiAdminModalOpen}
        onClose={() => setAiAdminModalOpen(false)}
      />

      {/* Backup & Device Sync Modal (Local-First, No Accounts) */}
      <BackupSyncModal
        isOpen={backupSyncModalOpen}
        onClose={() => setBackupSyncModalOpen(false)}
        onOpenDuelModal={(gameId) => {
          setBackupSyncModalOpen(false);
          setDuelShareData({
            duelId: `duel-${Date.now()}`,
            gameId,
            level: games[gameId].level,
            seed: String(Date.now()),
            creatorName: 'Player',
            creatorScore: games[gameId].bestScore || 100,
            creatorAccuracy: 95,
            creatorTimeMs: games[gameId].bestTimeMs || 25000,
            createdAt: Date.now()
          });
        }}
      />

      {/* Incoming Progress Transfer Modal */}
      <IncomingSyncModal
        isOpen={Boolean(incomingSyncData)}
        data={incomingSyncData?.data || null}
        summary={incomingSyncData?.summary || null}
        onClose={() => setIncomingSyncData(null)}
      />

    </div>
  );
}

export default App;
