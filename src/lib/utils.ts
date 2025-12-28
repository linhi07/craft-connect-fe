import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parse a date string from the backend and return a Date object.
 * Handles both ISO strings with timezone (e.g., "2025-12-28T23:08:00Z") 
 * and without timezone (e.g., "2025-12-28T23:08:00").
 * If no timezone is specified, assumes UTC.
 */
export function parseBackendDate(dateString: string): Date {
  if (!dateString) return new Date()
  
  // If the string already has timezone info (ends with Z or has +/- offset), parse directly
  if (dateString.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(dateString)) {
    return new Date(dateString)
  }
  
  // If no timezone info, assume it's UTC and append 'Z'
  return new Date(dateString + 'Z')
}

/**
 * Format a relative time string (e.g., "5 mins", "2 hours", "3 days")
 */
export function formatRelativeTime(dateString?: string): string {
  if (!dateString) return ''
  
  const date = parseBackendDate(dateString)
  
  // Check if date is valid
  if (isNaN(date.getTime())) return ''
  
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'now'
  if (diffMins < 60) return `${diffMins} mins`
  if (diffHours < 24) return `${diffHours} hours`
  if (diffDays < 7) return `${diffDays} days`
  return date.toLocaleDateString()
}
