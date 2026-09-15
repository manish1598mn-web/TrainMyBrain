export const STORAGE_KEYS = {
  PLAYER: 'trainmybrain_player',
  PROGRESS: 'trainmybrain_progress',
  SETTINGS: 'trainmybrain_settings',
  HISTORY: 'trainmybrain_history',
  VOCABULARY: 'trainmybrain_vocabulary'
} as const;

export function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`[Storage] Failed to read key "${key}", using fallback.`, error);
    return fallback;
  }
}

export function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[Storage] Failed to save key "${key}".`, error);
  }
}

export function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[Storage] Failed to remove key "${key}".`, error);
  }
}
