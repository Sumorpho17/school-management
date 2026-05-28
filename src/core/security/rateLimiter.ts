const store = new Map<string, { timestamps: number[] }>();

const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;
    for (const [key, entry] of store) {
        if (entry.timestamps.length === 0) store.delete(key);
    }
}

export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
    const now = Date.now();
    cleanup();
    const entry = store.get(key) ?? { timestamps: [] };
    entry.timestamps = entry.timestamps.filter(t => now - t < windowMs);
    if (entry.timestamps.length >= max) return false;
    entry.timestamps.push(now);
    store.set(key, entry);
    return true;
}

export function getRemainingAttempts(key: string, max: number, windowMs: number): number {
    const now = Date.now();
    const entry = store.get(key);
    if (!entry) return max;
    const recent = entry.timestamps.filter(t => now - t < windowMs);
    return Math.max(0, max - recent.length);
}

export function resetRateLimit(key: string): void {
    store.delete(key);
}
