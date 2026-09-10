const STORAGE_KEY = 'cfa1600:progress';

export interface TopicProgress {
  lastScore: number | null;
  lastTotal: number | null;
  completed: boolean;
  lastAttempt: string | null; // ISO date string
}

export type ProgressStore = Record<string, TopicProgress>;

export function loadProgress(): ProgressStore {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressStore;
  } catch {
    return {};
  }
}

export function saveTopicResult(topicSlug: string, score: number, total: number): void {
  if (typeof window === 'undefined') return;
  try {
    const store = loadProgress();
    store[topicSlug] = {
      lastScore: score,
      lastTotal: total,
      completed: true,
      lastAttempt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // localStorage unavailable — degrade silently
  }
}

export function clearProgress(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}
