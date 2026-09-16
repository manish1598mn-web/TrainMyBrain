import React, { useState, useEffect } from 'react';
import { X, Cpu, CheckCircle2, AlertTriangle, RefreshCw, Layers, Database, Sparkles, Activity, ShieldCheck, Key, Check, Globe } from 'lucide-react';
import { GameId } from '../../engine/game-engine/types';
import { getPoolStats, preGeneratePoolBatch } from '../../services/ai/question-factory';
import { DEFAULT_AI_MODELS } from '../../services/ai/level-spec-engine';
import { getAIConfig, saveAIConfig, testAIConnection, AIProvider } from '../../services/ai/ai-client';
import { soundManager } from '../../lib/sound';

interface AIAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAdminModal: React.FC<AIAdminModalProps> = ({ isOpen, onClose }) => {
  const [activeGame, setActiveGame] = useState<GameId>('wordspeed');
  const [batchLevel, setBatchLevel] = useState<number>(10);
  const [batchSize, setBatchSize] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genMessage, setGenMessage] = useState<string | null>(null);

  // API Config State
  const envOpenAI = import.meta.env.VITE_OPENAI_API_KEY || '';
  const envGemini = import.meta.env.VITE_GEMINI_API_KEY || '';

  const [activeTab, setActiveTab] = useState<'dashboard' | 'connect'>('dashboard');
  const [provider, setProvider] = useState<AIProvider>('offline_algorithm');
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('built-in-deterministic');
  const [testStatus, setTestStatus] = useState<{ testing: boolean; result?: { success: boolean; message: string } }>({ testing: false });

  useEffect(() => {
    const config = getAIConfig();
    setProvider(config.provider);
    if (config.apiKey) setApiKey(config.apiKey);
    if (config.model) setSelectedModel(config.model);
  }, [isOpen]);

  const handleProviderSelect = (newProvider: AIProvider) => {
    soundManager.playTap();
    setProvider(newProvider);
    setTestStatus({ testing: false });
    if (newProvider === 'gemini') {
      setApiKey(envGemini || '');
      setSelectedModel('gemini-2.5-flash');
    } else if (newProvider === 'openai') {
      setApiKey(envOpenAI || '');
      setSelectedModel('gpt-4o-mini');
    } else {
      setApiKey('');
    }
  };

  if (!isOpen) return null;

  const stats = getPoolStats(activeGame);

  const handleTestAndSave = async () => {
    soundManager.playTap();
    setTestStatus({ testing: true });

    const result = await testAIConnection(provider, apiKey, selectedModel);
    setTestStatus({ testing: false, result });

    if (result.success) {
      saveAIConfig({
        provider,
        apiKey: apiKey.trim(),
        model: selectedModel
      });
      soundManager.playCorrect();
    } else {
      soundManager.playMistake();
    }
  };

  const handleRunBatch = () => {
    soundManager.playTap();
    setIsGenerating(true);
    setGenMessage(null);

    setTimeout(() => {
      const accepted = preGeneratePoolBatch(activeGame, batchLevel, batchSize);
      setIsGenerating(false);
      setGenMessage(`✓ Successfully generated & validated ${accepted} of ${batchSize} challenges for Level ${batchLevel}!`);
      soundManager.playCorrect();
    }, 450);
  };

  const gamesList: { id: GameId; label: string }[] = [
    { id: 'wordspeed', label: '🔤Word Speed' },
    { id: 'anzan', label: '⚡Pro Calculations' },
    { id: 'boggle', label: '🎲Boggle' },
    { id: 'sudoku', label: '🧩Sudoku Reflex' },
    { id: 'zebra', label: '🕵️Reasoning Puzzles' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in select-none">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Cpu className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                AI API Connector & Content Factory
              </h2>
              <p className="text-xs text-slate-400">
                Connect OpenAI / Gemini API, pre-generate content pools, and monitor metrics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex border-b border-slate-200/80 dark:border-slate-800 px-6 pt-3 bg-white dark:bg-slate-900 gap-4">
          <button
            onClick={() => setActiveTab('connect')}
            className={`pb-2.5 text-xs font-bold font-mono border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'connect'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            1. Connect API Key
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-2.5 text-xs font-bold font-mono border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            2. Content Pool & Batch Generator
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {activeTab === 'connect' ? (
            /* TAB 1: CONNECT API KEY */
            <div className="space-y-4">
              
              {/* Provider Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-slate-500">
                  Select AI Engine Mode:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => handleProviderSelect('hybrid')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      provider === 'hybrid'
                        ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1">
                      <span>⚡ Hybrid (A + C)</span>
                    </div>
                    <div className="text-[10px] text-indigo-500 dark:text-indigo-400 mt-0.5 font-semibold">Gemini + Offline (Best)</div>
                  </button>

                  <button
                    onClick={() => handleProviderSelect('offline_algorithm')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      provider === 'offline_algorithm'
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs">Offline Only (C)</div>
                    <div className="text-[10px] text-emerald-500 mt-0.5">100% Free & Fast</div>
                  </button>

                  <button
                    onClick={() => handleProviderSelect('openai')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      provider === 'openai'
                        ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs">OpenAI Only</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">GPT-4o Mini / GPT-4o</div>
                  </button>
                </div>
              </div>

              {provider === 'hybrid' && (
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
                  <strong>⭐ Hybrid Architecture Active:</strong> Uses free-tier Google Gemini for creative questions, rich explanations, and coaching, with instant sub-millisecond offline fallback whenever offline or rate-limited.
                </div>
              )}

              {provider !== 'offline_algorithm' ? (
                <>
                  {/* API Key Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-slate-500">
                      <span>{provider === 'openai' ? 'OpenAI Secret API Key' : 'Gemini API Key'}:</span>
                      {apiKey && (apiKey === envGemini || apiKey === envOpenAI) && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold lowercase bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                          ✓ automatically loaded from .env
                        </span>
                      )}
                    </div>
                    <input
                      type="password"
                      placeholder={provider === 'openai' ? 'sk-proj-...' : 'AIzaSy...'}
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  {/* Model Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold uppercase text-slate-500">
                      Model:
                    </label>
                    <select
                      value={selectedModel}
                      onChange={e => setSelectedModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-bold text-slate-800 dark:text-slate-100"
                    >
                      {provider === 'openai' ? (
                        <>
                          <option value="gpt-4o-mini">gpt-4o-mini (Recommended for speed & cost)</option>
                          <option value="gpt-4o">gpt-4o (Maximum reasoning precision)</option>
                          <option value="gpt-5.6-luna">gpt-5.6-luna (High-volume workloads)</option>
                        </>
                      ) : (
                        <>
                          <option value="gemini-2.5-flash">gemini-2.5-flash (Recommended: Ultra fast & cost-efficient)</option>
                          <option value="gemini-2.0-flash">gemini-2.0-flash (High speed)</option>
                          <option value="gemini-1.5-flash">gemini-1.5-flash (Classic Flash)</option>
                        </>
                      )}
                    </select>
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
                  <strong>✓ Offline Mode Active:</strong> TrainMyBrain is generating challenges using its built-in mathematical, linguistic, and logic engines with 0 API cost and instant sub-millisecond response.
                </div>
              )}

              {/* Test Connection Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleTestAndSave}
                  disabled={testStatus.testing}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {testStatus.testing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Testing Connection...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Test & Save Configuration
                    </>
                  )}
                </button>

                {testStatus.result && (
                  <div className={`text-xs font-mono font-bold flex items-center gap-1.5 ${
                    testStatus.result.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {testStatus.result.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    <span>{testStatus.result.message}</span>
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* TAB 2: DASHBOARD & PRE-GENERATION */
            <div className="space-y-5">
              
              {/* Game Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {gamesList.map(g => (
                  <button
                    key={g.id}
                    onClick={() => {
                      soundManager.playTap();
                      setActiveGame(g.id);
                      setGenMessage(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs font-mono transition-all shrink-0 ${
                      activeGame === g.id
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              {/* Metrics Overview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Total Generated</span>
                  <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">{stats.totalGenerated}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60">
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">Validated & Stored</span>
                  <p className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-1">{stats.totalValidated}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-800/60">
                  <span className="text-[10px] font-mono font-bold uppercase text-rose-600 dark:text-rose-400">Rejected / Duplicate</span>
                  <p className="text-xl font-black text-rose-700 dark:text-rose-300 mt-1">{stats.totalRejected}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/70 dark:border-sky-800/60">
                  <span className="text-[10px] font-mono font-bold uppercase text-sky-600 dark:text-sky-400">Avg Health Score</span>
                  <p className="text-xl font-black text-sky-700 dark:text-sky-300 mt-1">{stats.averageHealthScore}/100</p>
                </div>
              </div>

              {/* Trigger Batch Generation Panel */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Pre-Generate Content Batch
                </h4>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 w-full flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 whitespace-nowrap">Level (1–99):</span>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={batchLevel}
                      onChange={e => setBatchLevel(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                      className="w-20 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold font-mono text-center"
                    />
                  </div>

                  <div className="flex-1 w-full flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 whitespace-nowrap">Batch Size:</span>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={batchSize}
                      onChange={e => setBatchSize(Math.max(1, Math.min(50, parseInt(e.target.value) || 5)))}
                      className="w-20 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold font-mono text-center"
                    />
                  </div>

                  <button
                    onClick={handleRunBatch}
                    disabled={isGenerating}
                    className="w-full sm:w-auto px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4" />
                        Pre-Generate Pool
                      </>
                    )}
                  </button>
                </div>

                {genMessage && (
                  <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 animate-in fade-in pt-1">
                    {genMessage}
                  </p>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>✓ Zero-Latency Architecture Enabled</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
