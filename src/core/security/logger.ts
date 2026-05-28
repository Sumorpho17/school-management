import { sanitizeLogInput } from './sanitizer';

const SENSITIVE_FIELDS = [
    'password',
    'token',
    'secret',
    'key',
    'authorization',
    'x-api-key',
    'session',
    'jwt',
];

export function sanitizeForLogging(data: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
        const lowerKey = key.toLowerCase();
        if (SENSITIVE_FIELDS.some(sf => lowerKey.includes(sf))) {
            result[key] = '[REDACTED]';
        } else if (typeof value === 'string') {
            result[key] = sanitizeLogInput(value);
        } else {
            result[key] = value;
        }
    }
    return result;
}

type LogLevel = 'info' | 'warn' | 'error';

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const safeContext = context ? sanitizeForLogging(context) : undefined;
    const meta = safeContext ? ` ${JSON.stringify(safeContext)}` : '';
    const prefix = `[SchoolHub]`;
    const sanitizedMsg = sanitizeLogInput(message, 1000);
    switch (level) {
        case 'info':
            console.info(`${prefix} ${sanitizedMsg}${meta}`);
            break;
        case 'warn':
            console.warn(`${prefix} ${sanitizedMsg}${meta}`);
            break;
        case 'error':
            console.error(`${prefix} ${sanitizedMsg}${meta}`);
            break;
    }
}

export const logger = {
    info: (message: string, context?: Record<string, unknown>) => log('info', message, context),
    warn: (message: string, context?: Record<string, unknown>) => log('warn', message, context),
    error: (message: string, context?: Record<string, unknown>) => log('error', message, context),
};
