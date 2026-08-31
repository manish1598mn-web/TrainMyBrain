/**
 * Seeded Pseudo-Random Number Generator using Mulberry32
 * Ensures deterministic and reproducible challenges (e.g., for Daily Challenges)
 */

export class SeededRandom {
  private state: number;

  constructor(seed: number | string) {
    if (typeof seed === 'string') {
      let h = 2166136261 >>> 0;
      for (let i = 0; i < seed.length; i++) {
        h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
      }
      this.state = h >>> 0;
    } else {
      this.state = seed >>> 0;
    }
  }

  // Returns pseudo-random float [0, 1)
  public next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Returns integer in range [min, max] inclusive
  public nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Shuffles an array in place using Fisher-Yates with seeded random
  public shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Pick random element
  public pick<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }

  // Sample N distinct elements
  public sample<T>(array: T[], count: number): T[] {
    const shuffled = this.shuffle(array);
    return shuffled.slice(0, Math.min(count, array.length));
  }
}

export function createSeededRandom(seed?: number | string): SeededRandom {
  return new SeededRandom(seed ?? Math.floor(Math.random() * 100000000));
}

// Generate date seed YYYYMMDD
export function getDailyChallengeSeed(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `DAILY-${y}${m}${d}`;
}
