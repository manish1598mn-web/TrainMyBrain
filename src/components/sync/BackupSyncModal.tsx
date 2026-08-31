import React, { useState, useRef } from 'react';
import { X, Download, Upload, Smartphone, Share2, Check, Copy, AlertCircle, ShieldCheck, RefreshCw, FileText, Swords, QrCode } from 'lucide-react';
import { exportProgressToJson, downloadBackupFile, importProgressFromJson, generateDeviceTransferUrl, decodeDeviceTransferPayload, applyDeviceSync } from '../../lib/storage/backupSync';
import { useProgressStore } from '../../store/progress-store';
import { GameId } from '../../engine/game-engine/types';
import { soundManager } from '../../lib/sound';

interface BackupSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDuelModal?: (gameId: GameId) => void;
}

export const BackupSyncModal: React.FC<BackupSyncModalProps> = ({ isOpen, onClose, onOpenDuelModal }) => {
  const [activeTab, setActiveTab] = useState<'backup' | 'transfer' | 'duel'>('backup');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [manualSyncInput, setManualSyncInput] = useState('');
  const [syncStatus, setSyncStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { games } = useProgressStore();

  if (!isOpen) return null;

  const transferUrl = typeof window !== 'undefined' ? generateDeviceTransferUrl() : '';

  const handleCopyTransferUrl = () => {
    soundManager.playTap();
    navigator.clipboard.writeText(transferUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyJson = () => {
    soundManager.playTap();
    navigator.clipboard.writeText(exportProgressToJson());
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importProgressFromJson(content);
      setSyncStatus(res);
      if (res.success) {
        soundManager.playCorrect();
      } else {
        soundManager.playMistake();
      }
    };
    reader.readAsText(file);
  };

  const handleManualSync = () => {
    soundManager.playTap();
    if (!manualSyncInput.trim()) return;

    const res = decodeDeviceTransferPayload(manualSyncInput);
    if (res.success && res.data) {
      applyDeviceSync(res.data);
      setSyncStatus({ success: true, message: `✓ Progress restored! Overall Mind Level: ${res.summary?.overallMindLevel}` });
      soundManager.playCorrect();
      setManualSyncInput('');
    } else {
      setSyncStatus({ success: false, message: res.message || 'Invalid sync link or code.' });
      soundManager.playMistake();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/70">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Local-First Progress & Device Sync
              </h2>
              <p className="text-xs text-slate-400">
                100% private on your device • No sign-up or passwords required
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200/80 dark:border-slate-800 px-6 pt-3 bg-white dark:bg-slate-900 gap-4">
          <button
            onClick={() => {
              soundManager.playTap();
              setActiveTab('backup');
              setSyncStatus(null);
            }}
            className={`pb-2.5 text-xs font-bold font-mono border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'backup'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            1. Backup & Restore (JSON)
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              setActiveTab('transfer');
              setSyncStatus(null);
            }}
            className={`pb-2.5 text-xs font-bold font-mono border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'transfer'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            2. Transfer to Phone / PC
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              setActiveTab('duel');
              setSyncStatus(null);
            }}
            className={`pb-2.5 text-xs font-bold font-mono border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'duel'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            3. Challenge Friends
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Status Message Notification */}
          {syncStatus && (
            <div className={`p-3.5 rounded-2xl border text-xs font-mono font-bold flex items-center gap-2 animate-in fade-in ${
              syncStatus.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
            }`}>
              {syncStatus.success ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{syncStatus.message}</span>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-4">
              
              {/* Feature 1: Download & Upload JSON */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Download Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-sm">
                      <Download className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>Download Progress File</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Save a copy of your levels, streaks, and reaction times to your computer.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.playTap();
                      downloadBackupFile();
                      setSyncStatus({ success: true, message: '✓ Backup file downloaded successfully!' });
                      soundManager.playCorrect();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download JSON Backup
                  </button>
                </div>

                {/* Restore Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-sm">
                      <Upload className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>Restore from Backup</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Upload your previously downloaded backup file to restore all progress.
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <button
                    onClick={() => {
                      soundManager.playTap();
                      fileInputRef.current?.click();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Choose File to Restore
                  </button>
                </div>

              </div>

              {/* Copy Raw JSON Section */}
              <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-850/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-500 font-mono">
                  Prefer text format? Copy the raw backup data directly.
                </div>
                <button
                  onClick={handleCopyJson}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>

            </div>
          )}

          {activeTab === 'transfer' && (
            <div className="space-y-4">
              
              {/* Feature 2: Device Transfer Link */}
              <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/60 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-teal-800 dark:text-teal-200">
                  <Smartphone className="w-4 h-4 text-teal-600" />
                  <span>Transfer Progress to Another Phone / Laptop</span>
                </div>
                <p className="text-xs text-teal-700/80 dark:text-teal-300/80 leading-relaxed">
                  Open this link on your phone or tablet to instantly transfer your levels and streaks without logging in.
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={transferUrl}
                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyTransferUrl}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Paste Incoming Sync Link */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-slate-100">
                  <QrCode className="w-4 h-4 text-sky-600" />
                  <span>Receive Progress from Another Device</span>
                </div>
                <p className="text-xs text-slate-400">
                  Paste the sync link copied from your other device to load its progress onto this browser:
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    placeholder="Paste ?sync=... link or code here"
                    value={manualSyncInput}
                    onChange={e => setManualSyncInput(e.target.value)}
                    className="w-full flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    onClick={handleManualSync}
                    disabled={!manualSyncInput.trim()}
                    className="w-full sm:w-auto px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm active:scale-95 transition-all shrink-0"
                  >
                    Sync Progress
                  </button>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'duel' && (
            <div className="space-y-4">
              
              {/* Feature 3: Challenge Friends (No Account PvP) */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-indigo-900 dark:text-indigo-200">
                  <Swords className="w-4 h-4 text-indigo-600" />
                  <span>Account-Free PvP Duels</span>
                </div>
                <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80 leading-relaxed">
                  Challenge a friend on the exact same randomized seed. They don't need an account or app install — they just click your link and play!
                </p>
              </div>

              {/* Game Challenge List */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-slate-400">Choose Game to Duel:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'wordspeed' as GameId, name: '🔤 Word Speed', level: games.wordspeed.level },
                    { id: 'anzan' as GameId, name: '⚡ Pro Calculations', level: games.anzan.level },
                    { id: 'boggle' as GameId, name: '🎲 Boggle Matrix', level: games.boggle.level },
                    { id: 'sudoku' as GameId, name: '🧩 Sudoku Reflex', level: games.sudoku.level },
                    { id: 'zebra' as GameId, name: '🕵️ Reasoning Puzzles', level: games.zebra.level }
                  ].map(g => (
                    <button
                      key={g.id}
                      onClick={() => {
                        soundManager.playTap();
                        onClose();
                        if (onOpenDuelModal) onOpenDuelModal(g.id);
                      }}
                      className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 text-left transition-all flex items-center justify-between group shadow-sm"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {g.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">Your Level: {g.level}</div>
                      </div>
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        Create Duel →
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/70 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>✓ Local-First Data Engine: 100% Privacy Guaranteed</span>
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
