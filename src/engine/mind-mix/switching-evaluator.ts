import { MentalSwitchingMetrics, MindMixRoundResult } from './types';

/**
 * Evaluates Mental Switching Agility & Context Transition Latency
 *
 * Mental Switching measures how rapidly and accurately the brain reconfigures
 * its cognitive strategies when switching from calculation -> focus -> deduction -> visual scan -> multi-variable logic.
 */
export function evaluateMentalSwitching(roundResults: MindMixRoundResult[]): MentalSwitchingMetrics {
  if (!roundResults || roundResults.length === 0) {
    return {
      switchingScore: 75,
      averageTransitionLatencyMs: 1200,
      switchAccuracyDropPercent: 0,
      cognitiveAgilityTier: 'Developing',
      summary: 'Initial calibration for multi-discipline mental switching.'
    };
  }

  const accuracies = roundResults.map(r => r.accuracy);
  const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
  const totalMistakes = roundResults.reduce((sum, r) => sum + r.mistakes, 0);

  // Transition latencies
  const latencies = roundResults
    .map(r => r.transitionLatencyMs || 1000)
    .filter(l => l > 0);
  const avgLatency = latencies.length > 0
    ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
    : 1100;

  // Latency Score: 600ms = 100 pts, 2000ms = 40 pts
  const latencyScore = Math.max(30, Math.min(100, Math.round(100 - (avgLatency - 600) * 0.045)));

  // Switching Score: 50% Accuracy + 30% Latency Score + 20% Low Mistake Penalty
  const mistakePenalty = Math.min(25, totalMistakes * 3);
  const rawSwitchingScore = (avgAccuracy * 0.50) + (latencyScore * 0.30) + (20 - mistakePenalty);
  const switchingScore = Math.max(15, Math.min(100, Math.round(rawSwitchingScore)));

  let cognitiveAgilityTier: 'Master' | 'Skilled' | 'Developing' | 'Calibrating' = 'Developing';
  let summary = '';

  if (switchingScore >= 85) {
    cognitiveAgilityTier = 'Master';
    summary = 'Exceptional neural flexibility! Near-zero latency and high accuracy across rapid context shifts.';
  } else if (switchingScore >= 70) {
    cognitiveAgilityTier = 'Skilled';
    summary = 'Strong mental agility. Fast adaptation between calculation, visual scanning, and logic tasks.';
  } else if (switchingScore >= 50) {
    cognitiveAgilityTier = 'Developing';
    summary = 'Good effort. Practice Mind Mix regularly to reduce transition hesitation when changing question types.';
  } else {
    cognitiveAgilityTier = 'Calibrating';
    summary = 'Take a brief breath between rounds to mentally reset before the next question discipline begins.';
  }

  return {
    switchingScore,
    averageTransitionLatencyMs: avgLatency,
    switchAccuracyDropPercent: Math.max(0, Math.round(100 - avgAccuracy)),
    cognitiveAgilityTier,
    summary
  };
}
