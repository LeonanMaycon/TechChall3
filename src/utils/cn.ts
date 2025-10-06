import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilitário para combinar classes CSS de forma inteligente
 * 
 * Combina clsx para lógica condicional de classes e tailwind-merge
 * para resolver conflitos entre classes do Tailwind CSS
 * 
 * @param inputs - Classes CSS para combinar
 * @returns String com classes combinadas
 * 
 * @example
 * cn('px-2 py-1', 'px-4') // 'py-1 px-4'
 * cn('text-red-500', { 'text-blue-500': isBlue }) // 'text-blue-500' se isBlue for true
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
