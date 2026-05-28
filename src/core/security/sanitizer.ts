const SCRIPT_RE = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
const ON_EVENT_RE = /\son\w+\s*=\s*['"][^'"]*['"]/gi;
const JS_PROTO_RE = /javascript\s*:/gi;
const DATA_URI_RE = /data\s*:\s*text\/html/gi;
const MAX_INPUT_LENGTH = 5000;

export function sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    if (input.length > MAX_INPUT_LENGTH) input = input.slice(0, MAX_INPUT_LENGTH);
    return input
        .replace(SCRIPT_RE, '')
        .replace(ON_EVENT_RE, '')
        .replace(JS_PROTO_RE, '')
        .replace(DATA_URI_RE, '')
        .trim();
}

export function sanitizeHtml(input: string): string {
    if (typeof input !== 'string') return '';
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

export function sanitizeLogInput(input: string, maxLen = 200): string {
    if (typeof input !== 'string') return '';
    return input
        .replace(/[\n\r]/g, ' ')
        .replace(/\s+/g, ' ')
        .slice(0, maxLen)
        .trim();
}

export function sanitizeFilename(filename: string): string {
    return filename
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/\.{2,}/g, '.')
        .slice(0, 255);
}
