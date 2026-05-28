const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s\-+().]{6,20}$/;
const NAME_RE = /^[\p{L}\s\-\'\.]{1,200}$/u;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ACADEMIC_YEAR_RE = /^\d{4}\/\d{4}$/;
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
const ALLOWED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];

export function isValidEmail(email: string): boolean {
    return EMAIL_RE.test(email) && email.length <= 254;
}

export function isValidPhone(phone: string): boolean {
    if (!phone) return true;
    return PHONE_RE.test(phone);
}

export function isValidName(name: string): boolean {
    return NAME_RE.test(name.trim());
}

export function isValidDate(dateStr: string): boolean {
    if (!DATE_RE.test(dateStr)) return false;
    const d = new Date(dateStr + 'T00:00:00');
    return !isNaN(d.getTime());
}

export function isValidAcademicYear(year: string): boolean {
    return ACADEMIC_YEAR_RE.test(year);
}

export function isAllowedImageType(mime: string): boolean {
    return ALLOWED_IMAGE_TYPES.includes(mime);
}

export function isAllowedImageExtension(filename: string): boolean {
    const ext = '.' + filename.split('.').pop()?.toLowerCase();
    return ALLOWED_IMAGE_EXTENSIONS.includes(ext);
}

export function isValidImageFile(file: File): { valid: boolean; reason?: string } {
    if (file.size > 2 * 1024 * 1024) {
        return { valid: false, reason: 'File size exceeds 2 MB limit.' };
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return { valid: false, reason: 'Only PNG, JPEG, WebP, and SVG files are allowed.' };
    }
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
        return { valid: false, reason: 'File extension must be .png, .jpg, .jpeg, .webp, or .svg.' };
    }
    return { valid: true };
}
