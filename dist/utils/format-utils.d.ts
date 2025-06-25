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
export declare function formatCurrency(amount: number): string;
/**
 * Type guard to check if a value is a valid number (not NaN).
 * @param val - The value to check.
 * @returns True if val is a number and not NaN.
 */
export declare function isValidNumber(val: unknown): val is number;
//# sourceMappingURL=format-utils.d.ts.map