import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn() merges Tailwind classes conditionally,
 * removing duplicates and resolving conflicts.
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
