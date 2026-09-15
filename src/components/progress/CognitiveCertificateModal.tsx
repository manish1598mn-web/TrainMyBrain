import React, { useRef, useEffect, useState } from 'react';
import { X, Download, Sparkles, Award, ShieldCheck, CheckCircle2, Share2 } from 'lucide-react';
import { usePlayerStore } from '../../store/player-store';
import { useProgressStore } from '../../store/progress-store';
import { GAMES } from '../../engine/game-engine/game-registry';
import { GameId } from '../../engine/game-engine/types';
import { soundManager } from '../../lib/sound';

interface CognitiveCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CognitiveCertificateModal: React.FC<CognitiveCertificateModalProps> = ({
  isOpen,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  const { 
    displayName, 
    playerId, 
    overallMindLevel, 
    getTrainingTimeBreakdown, 
    totalProblemsSolved 
  } = usePlayerStore();
  const { games } = useProgressStore();
  const { formattedString, shortFormatted } = getTrainingTimeBreakdown();

  // Draw certificate on canvas whenever open
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1200;
      const height = 675;
      canvas.width = width;
      canvas.height = height;

      // 1. Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0B0F17');
      bgGrad.addColorStop(0.5, '#0F172A');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Outer & Inner Gold Borders
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
      ctx.lineWidth = 4;
      ctx.strokeRect(24, 24, width - 48, height - 48);

      ctx.strokeStyle = 'rgba(217, 119, 6, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(36, 36, width - 72, height - 72);

      // Corner Ornaments
      const cornerSize = 20;
      ctx.fillStyle = '#F59E0B';
      // Top-Left
      ctx.fillRect(20, 20, cornerSize, 4);
      ctx.fillRect(20, 20, 4, cornerSize);
      // Top-Right
      ctx.fillRect(width - 20 - cornerSize, 20, cornerSize, 4);
      ctx.fillRect(width - 24, 20, 4, cornerSize);
      // Bottom-Left
      ctx.fillRect(20, height - 24, cornerSize, 4);
      ctx.fillRect(20, height - 20 - cornerSize, 4, cornerSize);
      // Bottom-Right
      ctx.fillRect(width - 20 - cornerSize, height - 24, cornerSize, 4);
      ctx.fillRect(width - 24, height - 20 - cornerSize, 4, cornerSize);

      // 3. Header Wordmark & Verification Subtitle
      ctx.textAlign = 'center';
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillText('TRAINMYBRAIN • OFFICIAL COGNITIVE BENCHMARK', width / 2, 80);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 34px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Certificate of Cognitive Mastery', width / 2, 125);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('This verified credential confirms active mental conditioning and reflex benchmarking across 5 core faculties.', width / 2, 155);

      // 4. Player Name & Mind Level Hero
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(displayName || 'Brain Athlete', width / 2, 220);

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 14px "JetBrains Mono", monospace';
      ctx.fillText(`ID: ${playerId}  •  Overall Mind Level ${overallMindLevel}`, width / 2, 248);

      // 5. 5-Domain Performance Matrix Box
      const matrixX = 70;
      const matrixY = 280;
      const matrixW = width - 140;
      const matrixH = 190;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.fillRect(matrixX, matrixY, matrixW, matrixH);
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
      ctx.lineWidth = 1;
      ctx.strokeRect(matrixX, matrixY, matrixW, matrixH);

      // Domain Columns
      const domains: { label: string; key: GameId; icon: string }[] = [
        { label: 'Pro Calculations', key: 'anzan', icon: '⚡' },
        { label: 'Word Speed', key: 'wordspeed', icon: '🔤' },
        { label: 'Boggle Search', key: 'boggle', icon: '🎲' },
        { label: 'Sudoku Reflex', key: 'sudoku', icon: '🧩' },
        { label: 'Reasoning Puzzles', key: 'zebra', icon: '🧠' }
      ];

      const colW = matrixW / 5;
      domains.forEach((d, i) => {
        const cx = matrixX + colW * i + colW / 2;
        const g = games[d.key];
        const isPlayed = Boolean(g && (g.gamesPlayed > 0 || g.bestScore > 0));

        ctx.fillStyle = '#94A3B8';
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillText(`${d.label.toUpperCase()}`, cx, matrixY + 45);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '800 24px "JetBrains Mono", monospace';
        ctx.fillText(isPlayed && g ? `Lvl ${g.level}` : 'Unranked', cx, matrixY + 85);

        ctx.fillStyle = isPlayed ? '#10B981' : '#64748B';
        ctx.font = '600 12px "JetBrains Mono", monospace';
        ctx.fillText(isPlayed && g ? `Score: ${g.bestScore}` : 'Score: 0', cx, matrixY + 120);

        ctx.fillStyle = '#64748B';
        ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(isPlayed && g && g.averageAccuracy > 0 ? `Acc: ${Math.round(g.averageAccuracy)}%` : 'Acc: Awaiting', cx, matrixY + 145);

        // Divider
        if (i < 4) {
          ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
          ctx.beginPath();
          ctx.moveTo(matrixX + colW * (i + 1), matrixY + 20);
          ctx.lineTo(matrixX + colW * (i + 1), matrixY + matrixH - 20);
          ctx.stroke();
        }
      });

      // 6. Cumulative Focus Streak & Problems Solved Footer Bar
      ctx.textAlign = 'left';
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillText(`🔥 Focus Training Streak: ${formattedString}`, 70, height - 100);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`Total Problems Solved: ${totalProblemsSolved || 0}   •   100% Local-First Client Verified`, 70, height - 78);

      // 7. Security Hash & Timestamp Signature
      ctx.textAlign = 'right';
      const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(`ISSUED: ${issueDate}`, width - 70, height - 100);
      ctx.fillText(`VERIFICATION SIG: TMB-${overallMindLevel}-${Math.floor(Date.now() / 1000).toString(16).toUpperCase()}`, width - 70, height - 78);

    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen, displayName, playerId, overallMindLevel, formattedString, totalProblemsSolved, games]);

  if (!isOpen) return null;

  const handleDownload = () => {
    soundManager.playCorrect();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `TrainMyBrain_Certificate_${displayName.replace(/\s+/g, '_')}_Lvl${overallMindLevel}.png`;
    link.href = dataUrl;
    link.click();

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playTap();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 self-start">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              Cognitive Performance Certificate
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              High-resolution verified performance credential for download and sharing.
            </p>
          </div>
        </div>

        {/* Certificate Canvas Preview */}
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl mb-6 bg-slate-950">
          <canvas 
            ref={canvasRef}
            className="w-full h-auto block"
            style={{ aspectRatio: '1200 / 675' }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-teal-500" />
            <span>Resolution: 1200x675 HD • Lossless PNG</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleDownload}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                downloaded
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95'
              }`}
            >
              {downloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Certificate Downloaded! ✨</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Certificate (.PNG)</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
