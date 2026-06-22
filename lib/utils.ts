import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Serialize Mongoose documents to plain JSON objects (strips ObjectId, Date, etc.)
export const serializeData = <T>(data: T): unknown => JSON.parse(JSON.stringify(data));
// Auto generate slug
export function generateSlug(text: string): string {
    return text
        .replace(/\.[^/.]+$/, '') // Remove file extension (.pdf, .txt, etc.)
        .toLowerCase() // Convert to lowercase
        .trim() // Remove whitespace from both ends
        .replace(/[^\w\s-]/g, '') // Remove special characters (keep letters, numbers, spaces, hyphens)
        .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        || 'untitled'; // Fallback if result is empty
}

// Escape regex special characters to prevent ReDoS attacks
export const escapeRegex = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};