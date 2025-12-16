// File: src/lib/utils.ts
import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const uid = (prefix = '') => `${prefix}${Date.now().toString(36)}-${Math.floor(Math.random()*10000).toString(36)}`
