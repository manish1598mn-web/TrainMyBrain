import { SeededRandom, createSeededRandom } from '../../lib/seeded-random';
import { getAnzanRecipe, AnzanDifficultyRecipe } from '../../engine/level-engine/difficulty-recipes';
import { hashChallengeContent, isChallengeUnique, recordChallengeHash } from '../../engine/level-engine/challenge-cache';
import { getCuratedMilestone } from '../../engine/level-engine/curated-pool';

export type AnzanOperator = '+' | '-' | '*' | '/' | '%';

export interface AnzanStep {
  value: number;
  operator: AnzanOperator;
  displayString: string;
  stepDescription?: string;
}

export interface AnzanRound {
  id: string;
  steps: AnzanStep[];
  expectedTotal: number;
  flashDurationMs: number;
  pauseBetweenMs: number;
  digitCount: number;
  hasAdvancedOperators: boolean;
}

export interface AnzanChallenge {
  rounds: AnzanRound[];
  totalRounds: number;
  recipe: AnzanDifficultyRecipe;
  challengeHash: string;
  isMilestone?: boolean;
}

/**
 * Difficulty Evaluator & Validator for Flash Anzan with Multi-Operators (+, -, *, /, %)
 */
function validateAnzanRound(round: AnzanRound): boolean {
  if (round.steps.length === 0) return false;
  let total = 0;

  for (let i = 0; i < round.steps.length; i++) {
    const step = round.steps[i];
    if (i === 0) {
      total = step.value;
    } else {
      switch (step.operator) {
        case '+':
          total += step.value;
          break;
        case '-':
          total -= step.value;
          break;
        case '*':
          total *= step.value;
          break;
        case '/':
          if (step.value === 0 || total % step.value !== 0) return false;
          total = Math.floor(total / step.value);
          break;
        case '%':
          if (step.stepDescription === 'percent_50') {
            total = Math.floor(total * 0.5);
          } else if (step.stepDescription === 'percent_10') {
            total = Math.floor(total * 0.1);
          } else if (step.stepDescription === 'percent_25') {
            total = Math.floor(total * 0.25);
          } else {
            // Modulo remainder
            if (step.value === 0) return false;
            total = total % step.value;
          }
          break;
      }
    }

    // Intermediate result must always be a non-negative whole integer
    if (total < 0 || !Number.isInteger(total)) return false;
  }

  return total === round.expectedTotal;
}

export function generateAnzanChallenge(level: number, customSeed?: string | number): AnzanChallenge {
  const milestone = getCuratedMilestone('anzan', level);
  const recipe = getAnzanRecipe(level);

  let attempts = 0;
  while (attempts < 12) {
    attempts++;
    const seed = customSeed !== undefined
      ? `${customSeed}-${attempts}`
      : `${Date.now()}-${level}-${Math.random()}-${attempts}`;

    const rng: SeededRandom = createSeededRandom(seed);

    const digitCount = milestone?.payload?.digitCount || recipe.digitCount;
    const stepsCount = milestone?.payload?.steps || recipe.stepsPerRound;
    const flashDurationMs = milestone?.payload?.flashDurationMs || recipe.flashDurationMs;
    const pauseBetweenMs = recipe.pauseBetweenMs;
    const totalRounds = recipe.totalRounds;

    // Operator unlocks by level tier as specified:
    // Level 1 to 10: 2 operators (+, *)
    // Level 10 to 25: 3 operators (+, -, *)
    // Level 25 to 50: 4 operators (+, -, *, /)
    // Level 50 to 99+: 5 operators (+, -, *, /, %)
    const allowMultiplication = true;
    const allowSubtraction = milestone?.payload?.allowSubtraction ?? (level >= 10);
    const allowDivision = level >= 25;
    const allowPercentageOrModulo = level >= 50;

    const minNum = level <= 9 ? 1 : Math.pow(10, digitCount - 1);
    const maxNum = level <= 9 ? 12 : Math.pow(10, digitCount) - 1;

    const rounds: AnzanRound[] = [];
    let allRoundsValid = true;

    for (let r = 0; r < totalRounds; r++) {
      const steps: AnzanStep[] = [];
      // Initial term: single or double digit (1 to 15 for level 1-9)
      let runningTotal = rng.nextInt(minNum, level <= 9 ? 15 : maxNum);

      // First initial term
      steps.push({
        value: runningTotal,
        operator: '+',
        displayString: `${runningTotal}`
      });

      for (let i = 1; i < stepsCount; i++) {
        const roll = rng.next();

        // 1. Try Division (÷) if unlocked (Level 25+)
        const cleanDivisors = [2, 3, 4, 5, 6, 8, 10].filter(d => runningTotal > d && runningTotal % d === 0);
        if (allowDivision && cleanDivisors.length > 0 && roll < 0.25) {
          const divisor = rng.pick(cleanDivisors);
          runningTotal = Math.floor(runningTotal / divisor);
          steps.push({
            value: divisor,
            operator: '/',
            displayString: `÷ ${divisor}`
          });
          continue;
        }

        // 2. Try Multiplication (×) - Active from Level 1 (with controlled bounds for 7+ terms)
        if (allowMultiplication && runningTotal <= (level <= 9 ? 24 : 45) && roll < (level <= 9 ? 0.35 : 0.40)) {
          const multipliers = runningTotal <= 8 ? [2, 3, 4] : [2, 3];
          const mult = rng.pick(multipliers);
          runningTotal *= mult;
          steps.push({
            value: mult,
            operator: '*',
            displayString: `× ${mult}`
          });
          continue;
        }

        // 3. Try Percentage / Modulo (%) if unlocked (Level 50+)
        if (allowPercentageOrModulo && roll < 0.55) {
          if (runningTotal % 2 === 0 && runningTotal >= 10 && rng.next() < 0.5) {
            runningTotal = Math.floor(runningTotal * 0.5);
            steps.push({
              value: 50,
              operator: '%',
              displayString: `50% of`,
              stepDescription: 'percent_50'
            });
            continue;
          } else if (runningTotal % 10 === 0 && runningTotal >= 20 && rng.next() < 0.5) {
            runningTotal = Math.floor(runningTotal * 0.1);
            steps.push({
              value: 10,
              operator: '%',
              displayString: `10% of`,
              stepDescription: 'percent_10'
            });
            continue;
          } else if (runningTotal > 7) {
            const modBase = rng.pick([5, 7, 10]);
            if (runningTotal > modBase) {
              runningTotal = runningTotal % modBase;
              steps.push({
                value: modBase,
                operator: '%',
                displayString: `% ${modBase}`
              });
              continue;
            }
          }
        }

        // 4. Try Subtraction (-) if unlocked (Level 10+)
        let subMax = Math.min(maxNum, runningTotal - 1);
        if (allowSubtraction && runningTotal > 2 && roll < 0.65) {
          let num = rng.nextInt(minNum, Math.max(minNum, subMax));
          if (runningTotal > num) {
            runningTotal -= num;
            steps.push({
              value: num,
              operator: '-',
              displayString: `- ${num}`
            });
            continue;
          }
        }

        // 5. Default Addition (+)
        let addNum = rng.nextInt(minNum, level <= 9 && runningTotal > 40 ? 9 : maxNum);
        runningTotal += addNum;
        steps.push({
          value: addNum,
          operator: '+',
          displayString: `+ ${addNum}`
        });
      }

      const hasAdvanced = steps.some(s => s.operator === '*' || s.operator === '/' || s.operator === '%');

      const round: AnzanRound = {
        id: `anzan-round-${r}-${attempts}-${rng.next()}`,
        steps,
        expectedTotal: runningTotal,
        flashDurationMs: hasAdvanced ? flashDurationMs + 250 : flashDurationMs,
        pauseBetweenMs: hasAdvanced ? pauseBetweenMs + 100 : pauseBetweenMs,
        digitCount,
        hasAdvancedOperators: hasAdvanced
      };

      if (!validateAnzanRound(round)) {
        allRoundsValid = false;
        break;
      }

      rounds.push(round);
    }

    if (allRoundsValid && rounds.length === totalRounds) {
      const rawSignature = `anzan-${level}-${rounds.map(r => `${r.steps.length}_${r.expectedTotal}`).join('|')}`;
      const challengeHash = hashChallengeContent(rawSignature);

      if (isChallengeUnique('anzan', challengeHash) || attempts >= 8) {
        recordChallengeHash('anzan', challengeHash);
      }

      return {
        rounds,
        totalRounds: rounds.length,
        recipe,
        challengeHash,
        isMilestone: milestone !== null
      };
    }
  }

  // Guaranteed fallback round
  const fallbackRound: AnzanRound = {
    id: `anzan-fb-${level}`,
    steps: [
      { value: 12, operator: '+', displayString: '12' },
      { value: 3, operator: '*', displayString: '× 3' },
      { value: 6, operator: '-', displayString: '- 6' },
      { value: 2, operator: '/', displayString: '÷ 2' }
    ],
    expectedTotal: 15,
    flashDurationMs: 1200,
    pauseBetweenMs: 400,
    digitCount: 1,
    hasAdvancedOperators: true
  };

  return {
    rounds: [fallbackRound, fallbackRound, fallbackRound],
    totalRounds: 3,
    recipe,
    challengeHash: hashChallengeContent(`anzan-fb-${level}`),
    isMilestone: false
  };
}
