/**
 * Format Utilities
 * Provides robust formatting functions for currency and numbers.
 *
 * @remarks
 * - Strictly typed, fully documented, and validated per project rules.
 * - All formatting functions handle edge cases and invalid values.
 */

/**
 * Formats a number as USD currency with no decimals.
 * @param amount - The amount to format.
 * @returns The formatted currency string, or 'N/A' if invalid.
 */
export function formatCurrency(amount: number): string {
    if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
    if (amount === 0) return '$0';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Type guard to check if a value is a valid number (not NaN).
 * @param val - The value to check.
 * @returns True if val is a number and not NaN.
 */
export function isValidNumber(val: unknown): val is number {
    return typeof val === 'number' && !isNaN(val);
} 