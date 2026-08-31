import React, { useState } from 'react';
import { DuelChallenge } from '../../lib/duel/types';
import { encodeDuelUrl, generateFormattedShareText } from '../../lib/duel/duelEngine';
import { GAMES } from '../../engine/game-engine/game-registry';
import { formatTimeMs } from '../../engine/game-engine/timer';
import { soundManager } from '../../lib/sound';
import { X, Copy, Check, Share2, Swords, MessageSquare } from 'lucide-react';

interface DuelShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  duel: DuelChallenge | null;
}

export const DuelShareModal: React.FC<DuelShareModalProps> = ({
  isOpen,
  onClose,
  duel
}) => {
  if (!isOpen || !duel) return null;

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const game = GAMES[duel.gameId];
  const shareUrl = encodeDuelUrl(duel);
  const formattedText = generateFormattedShareText(duel, game?.name || 'Brain Game');

  const handleCopyLink = async () => {
    soundManager.playTap();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }
  };

  const handleCopyFormattedText = async () => {
    soundManager.playTap();
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }
  };

  const handleNativeShare = async () => {
    soundManager.playTap();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `TrainMyBrain Challenge from ${duel.creatorName}!`,
          text: formattedText,
          url: shareUrl
        });
      } catch (e) {
        // Ignored if user dismissed share sheet
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xl max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-11 w-11 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 border border-amber-200/60 dark:border-amber-900/50 flex items-center justify-center shadow-sm">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Challenge a Friend
            </h3>
            <p className="text-xs text-slate-400">
              Share this exact seeded puzzle with your study group.
            </p>
          </div>
        </div>

        {/* Challenge Summary Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{game?.name}</span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono font-bold">
              Level {duel.level}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center mt-3">
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Your Time</span>
              <span className="text-sm font-black font-mono text-slate-900 dark:text-white">
                {formatTimeMs(duel.creatorTimeMs)}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Accuracy</span>
              <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                {duel.creatorAccuracy}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          
          {/* Direct Link Copy Button */}
          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                <span>Challenge Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy 1-Click Challenge Link</span>
              </>
            )}
          </button>

          {/* Copy WhatsApp / Telegram Formatted Message */}
          <button
            onClick={handleCopyFormattedText}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-98 border border-slate-200/60 dark:border-slate-700/60"
          >
            {copiedText ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Message Copied!</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4 text-teal-600" />
                <span>Copy WhatsApp / Study Group Message</span>
              </>
            )}
          </button>

          {/* Native Share sheet (mobile) */}
          {typeof navigator.share === 'function' && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-98 shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Directly</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
