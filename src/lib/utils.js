import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilitário para combinação de classes CSS
 * Combina clsx e tailwind-merge para mesclar classes Tailwind de forma inteligente
 */

/**
 * Função para combinar e mesclar classes CSS
 * @param {...any} inputs - Classes CSS a serem combinadas
 * @returns {string} - String de classes CSS mescladas
 */
export function cn(...inputs) {
	return twMerge(clsx(inputs));
}
