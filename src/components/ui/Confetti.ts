import confetti from 'canvas-confetti';

export function fireLevelUpConfetti() {
  try {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EC4899']
    });
    fire(0.2, {
      spread: 60,
      colors: ['#8B5CF6', '#60A5FA', '#34D399', '#FBBF24']
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45
    });
  } catch {
    // Ignore canvas-confetti failure in headless environments
  }
}
