/**
 * Utility functions for formatting data for display.
 */

/**
 * Formats a number as a US currency string.
 * @param amount The number to format.
 * @returns A string formatted as currency (e.g., "$1,234.56").
 */
export function formatCurrency(amount: number): string {
    if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
    if (amount === 0) return '$0';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Math.round(amount));
} 