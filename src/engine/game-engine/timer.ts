/**
 * High-precision Game Timer using performance.now()
 * Guarantees frame-rate independent measurement of reaction times and durations
 */

export class GameTimer {
  private startTime: number = 0;
  private accumulatedMs: number = 0;
  private isRunning: boolean = false;
  private laps: number[] = [];

  public start(): void {
    if (this.isRunning) return;
    this.startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.isRunning = true;
  }

  public pause(): void {
    if (!this.isRunning) return;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.accumulatedMs += (now - this.startTime);
    this.isRunning = false;
  }

  public resume(): void {
    if (this.isRunning) return;
    this.start();
  }

  public reset(): void {
    this.startTime = 0;
    this.accumulatedMs = 0;
    this.isRunning = false;
    this.laps = [];
  }

  public getElapsedMs(): number {
    if (!this.isRunning) {
      return Math.round(this.accumulatedMs);
    }
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    return Math.round(this.accumulatedMs + (now - this.startTime));
  }

  public recordLap(): number {
    const elapsed = this.getElapsedMs();
    this.laps.push(elapsed);
    return elapsed;
  }

  public getLaps(): number[] {
    return [...this.laps];
  }

  public getReactionTimes(): number[] {
    if (this.laps.length <= 1) return [...this.laps];
    const reactions: number[] = [this.laps[0]];
    for (let i = 1; i < this.laps.length; i++) {
      reactions.push(this.laps[i] - this.laps[i - 1]);
    }
    return reactions;
  }
}

export function formatTimeMs(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  const seconds = (ms / 1000).toFixed(1);
  if (ms < 60000) {
    return `${seconds}s`;
  }
  const mins = Math.floor(ms / 60000);
  const remSec = ((ms % 60000) / 1000).toFixed(0).padStart(2, '0');
  return `${mins}:${remSec}`;
}
