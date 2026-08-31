/**
 * Universal AI Integration Schemas & Contracts
 * 
 * Strict architectural separation:
 * - Algorithms control: Levels, Difficulty Budget, Scoring, Timers, Correct Answer Truth.
 * - AI controls: Candidate Generation, Variations, Progressive Hints, Explanations, Performance Insights.
 */

import { GameId } from '../../engine/game-engine/types';

export type AICognitiveLoadLevel = 'low' | 'medium' | 'high';

export interface LevelSpecification {
  gameId: GameId;
  level: number;
  difficultyBudget: number; // 10 - 1000+
  normalizedDifficulty: number; // 0.0 - 1.0
  targetSkill: string;
  constraints: {
    memoryLoad: AICognitiveLoadLevel;
    reasoningLoad: AICognitiveLoadLevel;
    timePressure: AICognitiveLoadLevel;
    distractionLoad: AICognitiveLoadLevel;
    maxElements: number;
    allowedOperators?: string[];
    allowedVocabularyTier?: 'foundational' | 'intermediate' | 'advanced';
    allowedDisciplines?: string[];
  };
  sampleOutputFormat: Record<string, any>;
}

export interface UniversalProblemSchema<TContent = any> {
  id: string;
  gameId: GameId;
  level: number;
  skill: string;
  difficultyScore: number;
  prompt: string;
  subPrompt?: string;
  content: TContent;
  options?: string[] | number[];
  correctAnswer: string | number;
  explanation: string;
  semanticFingerprint: string;
  metadata: {
    generatedAt: number;
    modelUsed: string;
    generationPromptVersion: string;
    validationStatus: 'passed' | 'rejected' | 'pending';
    healthScore: number; // 0 - 100
  };
}

export interface ValidationResult {
  isValid: boolean;
  gameId: GameId;
  rejectionReason?: string;
  semanticDuplicate: boolean;
  mathCorrect: boolean;
  hasSingleDefensibleAnswer: boolean;
  difficultyWithinBounds: boolean;
  healthScore: number; // 0 - 100
}

export interface ProgressiveHints {
  hint1_conceptual: string;
  hint2_relationship: string;
  hint3_nearsolution: string;
}

export interface AIExplanationPayload {
  question: string;
  userAnswer: string | number;
  correctAnswer: string | number;
  gameEngineProof: string;
  explanationText: string;
  learningTip: string;
}

export interface TrainingCoachReport {
  overallAssessment: string;
  strengths: string[];
  weaknesses: string[];
  recommendedFocus: {
    gameId: GameId;
    level: number;
    rationale: string;
  };
  motivationalNote: string;
}

export interface QuestionHealthMetrics {
  totalAttempts: number;
  accuracyRate: number; // 0.0 - 1.0
  averageLatencyMs: number;
  hintUsageRate: number;
  isFlaggedTooEasy: boolean;
  isFlaggedTooHard: boolean;
  isFlaggedAmbiguous: boolean;
  healthScore: number; // 0 - 100
}
