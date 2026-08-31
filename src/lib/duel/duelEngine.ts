import { DuelChallenge, DuelComparison } from './types';
import { GameId } from '../../engine/game-engine/types';

/**
 * Encodes a Duel Challenge into a compact, URL-safe base64 string or query parameter.
 */
export function encodeDuelUrl(duel: DuelChallenge): string {
  const payload = {
    d: duel.duelId,
    g: duel.gameId,
    l: duel.level,
    s: duel.seed,
    u: duel.creatorName,
    t: duel.creatorTimeMs,
    a: duel.creatorAccuracy,
    sc: duel.creatorScore,
    ts: duel.createdAt
  };

  try {
    const jsonStr = JSON.stringify(payload);
    const b64 = btoa(encodeURIComponent(jsonStr));
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?duel=${b64}`;
  } catch (e) {
    // Fallback to simple query params
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      duelId: duel.duelId,
      game: duel.gameId,
      level: duel.level.toString(),
      seed: duel.seed,
      creator: duel.creatorName,
      time: duel.creatorTimeMs.toString(),
      acc: duel.creatorAccuracy.toString(),
      score: duel.creatorScore.toString()
    });
    return `${baseUrl}?${params.toString()}`;
  }
}

/**
 * Decodes a Duel Challenge from current URL query string.
 */
export function decodeDuelUrl(searchStr: string = window.location.search): DuelChallenge | null {
  if (!searchStr) return null;
  const params = new URLSearchParams(searchStr);

  // Check compressed payload
  const duelB64 = params.get('duel');
  if (duelB64) {
    try {
      const jsonStr = decodeURIComponent(atob(duelB64));
      const p = JSON.parse(jsonStr);
      if (p && p.g && p.s) {
        return {
          duelId: p.d || `duel-${Date.now()}`,
          gameId: p.g as GameId,
          level: Number(p.l) || 1,
          seed: p.s,
          creatorName: p.u || 'Challenger',
          creatorTimeMs: Number(p.t) || 30000,
          creatorAccuracy: Number(p.a) || 100,
          creatorScore: Number(p.sc) || 100,
          createdAt: Number(p.ts) || Date.now()
        };
      }
    } catch (e) {
      console.warn('Failed to parse duel base64 payload:', e);
    }
  }

  // Check explicit fallback query params
  const game = params.get('game') as GameId;
  const seed = params.get('seed');
  if (game && seed) {
    return {
      duelId: params.get('duelId') || `duel-${Date.now()}`,
      gameId: game,
      level: Number(params.get('level')) || 1,
      seed,
      creatorName: params.get('creator') || 'Challenger',
      creatorTimeMs: Number(params.get('time')) || 30000,
      creatorAccuracy: Number(params.get('acc')) || 100,
      creatorScore: Number(params.get('score')) || 100,
      createdAt: Date.now()
    };
  }

  return null;
}

/**
 * Generates formatted WhatsApp/Telegram/Discord challenge share text.
 */
export function generateFormattedShareText(duel: DuelChallenge, gameName: string): string {
  const timeSec = (duel.creatorTimeMs / 1000).toFixed(1);
  const shareUrl = encodeDuelUrl(duel);

  return `⚔️ *TrainMyBrain Challenge from ${duel.creatorName}!*

🧠 Game: *${gameName}* (Level ${duel.level})
⏱️ My Time: *${timeSec}s* (${duel.creatorAccuracy}% Accuracy)

Think you can solve it faster? Race against my ghost on the exact same puzzle:
🔗 ${shareUrl}

#TrainMyBrain #CompetitiveExams #BrainTraining`;
}

/**
 * Evaluates head-to-head winner between Creator and Player.
 * Priority: 1. Higher Accuracy -> 2. Faster Time (if accuracy tied)
 */
export function compareDuelResults(
  creator: { name: string; timeMs: number; accuracy: number },
  player: { timeMs: number; accuracy: number }
): DuelComparison {
  const timeDeltaMs = player.timeMs - creator.timeMs;
  const accuracyDelta = player.accuracy - creator.accuracy;

  let verdict: 'VICTORY' | 'DEFEAT' | 'TIED' = 'TIED';

  if (player.accuracy > creator.accuracy) {
    verdict = 'VICTORY';
  } else if (player.accuracy < creator.accuracy) {
    verdict = 'DEFEAT';
  } else {
    // Accuracies are identical -> faster time wins
    if (player.timeMs < creator.timeMs) {
      verdict = 'VICTORY';
    } else if (player.timeMs > creator.timeMs) {
      verdict = 'DEFEAT';
    } else {
      verdict = 'TIED';
    }
  }

  return {
    isDuel: true,
    creatorName: creator.name,
    creatorTimeMs: creator.timeMs,
    creatorAccuracy: creator.accuracy,
    playerTimeMs: player.timeMs,
    playerAccuracy: player.accuracy,
    verdict,
    timeDeltaMs,
    accuracyDelta
  };
}
