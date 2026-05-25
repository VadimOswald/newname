const memory = new Map<string, number>();
const WINDOW_MS = 1500;

export function assertRateLimit(key: string) {
  const now = Date.now();
  const prev = memory.get(key) ?? 0;
  if (now - prev < WINDOW_MS) throw new Error('RATE_LIMITED');
  memory.set(key, now);
}
