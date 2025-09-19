import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility helper used by shadcn components to merge class names.
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
