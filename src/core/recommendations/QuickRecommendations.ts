/**
 * Quick Recommendations Module
 * Contains logic for recommendations that can be generated from Quick Analysis data only.
 *
 * @remarks
 * - Strictly typed, fully documented, and validated per project rules.
 * - Exports named functions for each recommendation type.
 * - No default export; use named exports for clarity and tree-shaking.
 */

import { Recommendation } from '../../interfaces/analysis-types';

/**
 * Generates housing cost ratio recommendations based on available data.
 * @param housing - User's monthly housing cost
 * @param income - User's monthly take-home income
 * @returns Array of Recommendation objects
 */
export function getHousingCostRatioRecommendations(housing: number, income: number): Recommendation[] {
    if (typeof housing !== 'number' || isNaN(housing) || typeof income !== 'number' || isNaN(income) || income <= 0) return [];
    const ratio = (housing / income) * 100;
    if (ratio <= 30) return [];
    return [{
        id: 'housing-cost-ratio-quick',
        category: 'spending',
        priority: 'medium',
        title: 'Reduce Your Housing Cost Ratio',
        description: `Your housing costs are ${ratio.toFixed(1)}% of your income. Aim to keep this below 30% for long-term affordability.`,
        actionSteps: [
            'Consider refinancing, downsizing, or negotiating rent.',
            'Look for ways to increase income or reduce other expenses.'
        ],
        timeframe: 'next-3-months',
        impactLevel: 'medium'
    }];
}

/**
 * Generates combined insight recommendations by cross-referencing multiple quick analysis fields.
 * @param income - User's monthly income
 * @param expenses - User's other monthly expenses
 * @param savings - User's total savings
 * @returns Array of Recommendation objects
 */
export function getCombinedInsightRecommendations(income: number, expenses: number, savings: number): Recommendation[] {
    if (typeof income !== 'number' || isNaN(income) || income <= 0 || typeof expenses !== 'number' || isNaN(expenses) || expenses < 0 || typeof savings !== 'number' || isNaN(savings) || savings < 0) return [];
    const months = (savings / (income + expenses));
    if (months >= 6) return [];
    if (months < 1) {
        return [{
            id: 'combined-insight-critical',
            category: 'savings',
            priority: 'high',
            title: 'Critical: No Financial Cushion',
            description: `You have less than one month of expenses saved. This puts you at high risk for financial hardship. Build a safety net immediately.`,
            actionSteps: [
                'Pause all non-essential spending.',
                'Set up an emergency fund as your top priority.'
            ],
            timeframe: 'immediate',
            impactLevel: 'high'
        }];
    }
    return [{
        id: 'combined-insight-warning',
        category: 'savings',
        priority: 'medium',
        title: 'Increase Your Financial Cushion',
        description: `You have ${months.toFixed(1)} months of expenses saved. Aim for at least 3-6 months for greater security.`,
        actionSteps: [
            'Increase your monthly savings rate.',
            'Automate transfers to your savings account.'
        ],
        timeframe: 'next-3-months',
        impactLevel: 'medium'
    }];
} 