/**
 * Safe local storage wrapper with memory fallback
 */

const memoryStore: Record<string, string> = {};

export const safeStorage = {
  getItem<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          return JSON.parse(item) as T;
        }
      }
    } catch {
      // fallback
    }
    if (key in memoryStore) {
      try {
        return JSON.parse(memoryStore[key]) as T;
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  },

  setItem<T>(key: string, value: T): boolean {
    const stringified = JSON.stringify(value);
    memoryStore[key] = stringified;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, stringified);
        return true;
      }
    } catch {
      // Storage quota or disabled
    }
    return false;
  },

  removeItem(key: string): void {
    delete memoryStore[key];
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // ignore
    }
  }
};
