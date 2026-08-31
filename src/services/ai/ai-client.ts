/**
 * AI Provider Client & API Connector
 * 
 * Supports:
 * 1. OpenAI API (gpt-4o-mini, gpt-4o, gpt-5.6)
 * 2. Google Gemini API (gemini-1.5-flash, gemini-2.0-flash)
 * 3. Secure Backend Proxy (/api/ai/...)
 * 4. Local Deterministic Algorithmic Fallback (Zero cost, offline-first)
 */

import { GameId } from '../../engine/game-engine/types';
import { LevelSpecification, UniversalProblemSchema } from './types';
import { validateCandidateProblem } from './validator';

export type AIProvider = 'hybrid' | 'gemini' | 'openai' | 'backend_proxy' | 'offline_algorithm';

export interface AIClientConfig {
  provider: AIProvider;
  apiKey?: string;
  backendProxyUrl?: string;
  model: string;
}

const STORAGE_KEY_AI_CONFIG = 'trainmybrain_ai_config';

/**
 * Loads current AI configuration from localStorage or Vite environment variables
 */
export function getAIConfig(): AIClientConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_AI_CONFIG);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // Ignore storage parse errors
  }

  const envGemini = import.meta.env.VITE_GEMINI_API_KEY;
  const envOpenAI = import.meta.env.VITE_OPENAI_API_KEY;

  // Merged Hybrid Default: Use Gemini Free Tier if key present, else Offline Engine
  if (envGemini) {
    return {
      provider: 'hybrid',
      apiKey: envGemini,
      model: 'gemini-2.5-flash'
    };
  }

  if (envOpenAI) {
    return {
      provider: 'openai',
      apiKey: envOpenAI,
      model: 'gpt-4o-mini'
    };
  }

  return {
    provider: 'offline_algorithm',
    model: 'built-in-deterministic'
  };
}

/**
 * Saves AI configuration to localStorage
 */
export function saveAIConfig(config: AIClientConfig): void {
  localStorage.setItem(STORAGE_KEY_AI_CONFIG, JSON.stringify(config));
}

/**
 * Tests the API connection with the provided credentials
 */
export async function testAIConnection(provider: AIProvider, apiKey?: string, model?: string): Promise<{ success: boolean; message: string }> {
  if (provider === 'offline_algorithm') {
    return { success: true, message: '✓ Built-in deterministic generator active (100% offline & free).' };
  }

  if (provider === 'hybrid') {
    if (!apiKey || apiKey.trim().length === 0) {
      return { success: true, message: '✓ Hybrid Mode: Offline engine ready (Gemini key optional).' };
    }
    const targetModel = model || 'gemini-2.5-flash';
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Reply with {"status": "CONNECTED"}' }] }]
        })
      });

      if (!response.ok) {
        return {
          success: true,
          message: '✓ Hybrid Mode: Gemini offline fallback active (100% playable).'
        };
      }

      return { success: true, message: '✓ Hybrid Mode: Google Gemini connected + Offline fallback ready!' };
    } catch (err: any) {
      return { success: true, message: '✓ Hybrid Mode: Offline fallback active.' };
    }
  }

  if (!apiKey || apiKey.trim().length === 0) {
    return { success: false, message: 'Please enter a valid API Key.' };
  }

  try {
    if (provider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: model || 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'Reply with the word "CONNECTED" in JSON: {"status": "CONNECTED"}' }],
          response_format: { type: 'json_object' },
          max_tokens: 20
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: `OpenAI Error (${response.status}): ${errData.error?.message || response.statusText}`
        };
      }

      return { success: true, message: '✓ Successfully connected to OpenAI API!' };
    }

    if (provider === 'gemini') {
      const targetModel = model || 'gemini-2.5-flash';
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Reply with {"status": "CONNECTED"}' }] }]
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: `Gemini Error (${response.status}): ${errData.error?.message || response.statusText}`
        };
      }

      return { success: true, message: '✓ Successfully connected to Google Gemini API!' };
    }

    return { success: true, message: '✓ Connection verified.' };
  } catch (err: any) {
    return { success: false, message: `Network error: ${err.message || 'Failed to reach API endpoint'}` };
  }
}

/**
 * Generates a challenge from the connected AI API or falls back to local algorithms
 */
export async function generateAIChallenge(spec: LevelSpecification): Promise<UniversalProblemSchema> {
  const config = getAIConfig();
  const prompt = `You are the content generator for TrainMyBrain.
Generate a Level ${spec.level} cognitive problem for game: "${spec.gameId}".
Difficulty budget: ${spec.difficultyBudget}.
Target skill: "${spec.targetSkill}".
Constraints: ${JSON.stringify(spec.constraints)}.

Output strictly valid JSON conforming to this schema:
{
  "prompt": "short clear question instruction",
  "subPrompt": "optional hint or sentence context",
  "options": ["option 1", "option 2", "option 3", "option 4"],
  "correctAnswer": "exact match of correct option",
  "explanation": "concise mathematical/logical step-by-step reasoning"
}`;

  // 1. If using OpenAI API
  if (config.provider === 'openai' && config.apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey.trim()}`
        },
        body: JSON.stringify({
          model: config.model || 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (response.ok) {
        const data = await response.json();
        const parsed = JSON.parse(data.choices[0].message.content);

        const candidate: UniversalProblemSchema = {
          id: `ai-gen-${spec.gameId}-${Date.now()}`,
          gameId: spec.gameId,
          level: spec.level,
          skill: spec.targetSkill,
          difficultyScore: spec.difficultyBudget,
          prompt: parsed.prompt,
          subPrompt: parsed.subPrompt,
          content: parsed.content || {},
          options: parsed.options,
          correctAnswer: parsed.correctAnswer,
          explanation: parsed.explanation,
          semanticFingerprint: '',
          metadata: {
            generatedAt: Date.now(),
            modelUsed: config.model || 'gpt-4o-mini',
            generationPromptVersion: '2.0-live-openai',
            validationStatus: 'pending',
            healthScore: 95
          }
        };

        const validation = validateCandidateProblem(spec.gameId, spec, candidate);
        if (validation.isValid) {
          candidate.metadata.validationStatus = 'passed';
          return candidate;
        }
      }
    } catch (e) {
      console.warn('OpenAI generation fallback to local algorithm:', e);
    }
  }

  // 2. If using Gemini or Hybrid (Option A + Option C merged)
  if ((config.provider === 'gemini' || config.provider === 'hybrid') && config.apiKey) {
    try {
      const targetModel = config.model || 'gemini-2.5-flash';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s fast budget

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${config.apiKey.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${prompt}\nReturn ONLY raw JSON.` }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          const candidate: UniversalProblemSchema = {
            id: `ai-gen-${spec.gameId}-${Date.now()}`,
            gameId: spec.gameId,
            level: spec.level,
            skill: spec.targetSkill,
            difficultyScore: spec.difficultyBudget,
            prompt: parsed.prompt,
            subPrompt: parsed.subPrompt,
            content: parsed.content || {},
            options: parsed.options,
            correctAnswer: parsed.correctAnswer,
            explanation: parsed.explanation,
            semanticFingerprint: '',
            metadata: {
              generatedAt: Date.now(),
              modelUsed: targetModel,
              generationPromptVersion: '2.0-live-gemini-hybrid',
              validationStatus: 'pending',
              healthScore: 95
            }
          };

          const validation = validateCandidateProblem(spec.gameId, spec, candidate);
          if (validation.isValid) {
            candidate.metadata.validationStatus = 'passed';
            return candidate;
          }
        }
      }
    } catch (e) {
      console.warn('Gemini/Hybrid fallback to local algorithm:', e);
    }
  }

  // Option C: Local validated deterministic algorithm (Instant, 0-latency, 100% correct)
  const { generateCandidateForLevel } = await import('./question-factory');
  return generateCandidateForLevel(spec.gameId, spec.level);
}
