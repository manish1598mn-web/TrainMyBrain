export type AnalyticsEvent = 
  | 'game_started'
  | 'game_completed'
  | 'game_abandoned'
  | 'level_up'
  | 'personal_record'
  | 'workout_started'
  | 'workout_completed'
  | 'challenge_started'
  | 'challenge_completed';

interface EventRecord {
  event: AnalyticsEvent;
  payload: Record<string, unknown>;
  timestamp: number;
}

const localEvents: EventRecord[] = [];

export const analytics = {
  track(event: AnalyticsEvent, payload: Record<string, unknown> = {}) {
    const record: EventRecord = {
      event,
      payload,
      timestamp: Date.now()
    };
    localEvents.push(record);
    if (localEvents.length > 500) {
      localEvents.shift();
    }
    // Ready for future integration with PostHog / telemetry
  },

  getRecentEvents(): EventRecord[] {
    return [...localEvents];
  }
};
