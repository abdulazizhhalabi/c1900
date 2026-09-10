const STORAGE_KEY = 'c1900:progress';
const LEGACY_STORAGE_KEY = 'cfa1600:progress';

/** Move progress saved under the site's old name to the current key, once. */
function migrateLegacyProgress(): void {
  try {
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy === null) return;
    if (localStorage.getItem(STORAGE_KEY) === null) {
      localStorage.setItem(STORAGE_KEY, legacy);
    }
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // localStorage unavailable — nothing to migrate
  }
}

export interface TopicProgress {
  lastScore: number | null;
  lastTotal: number | null;
  completed: boolean;
  lastAttempt: string | null; // ISO date string
}

export type ProgressStore = Record<string, TopicProgress>;

export function loadProgress(): ProgressStore {
  if (typeof window === 'undefined') return {};
  migrateLegacyProgress();
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
