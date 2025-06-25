/**
 * Common Recommendations Module
 * Contains logic for recommendations that can be generated from both Quick and Comprehensive data.
 *
 * @remarks
 * - Strictly typed, fully documented, and validated per project rules.
 * - Exports named functions for each recommendation type.
 * - No default export; use named exports for clarity and tree-shaking.
 */

import { Recommendation } from '../../interfaces/analysis-types';
import { formatCurrency } from '../../utils/format-utils';

/**
 * Generates emergency fund recommendations based on available data.
 * @param totalLiquidAssets - User's liquid savings (checking + savings + emergency fund)
 * @param totalMonthlyExpenses - User's total monthly expenses
 * @returns Array of Recommendation objects
 */
export function getEmergencyFundRecommendations(totalLiquidAssets: number, totalMonthlyExpenses: number): Recommendation[] {
    if (typeof totalLiquidAssets !== 'number' || isNaN(totalLiquidAssets) || typeof totalMonthlyExpenses !== 'number' || isNaN(totalMonthlyExpenses) || totalMonthlyExpenses <= 0) return [];
    const months = totalLiquidAssets / totalMonthlyExpenses;
    if (months >= 3) return [];
    const needed = Math.max(0, (3 - months) * totalMonthlyExpenses);
    return [{
        id: 'emergency-fund-quick',
        category: 'savings',
        priority: 'high',
        title: 'Build Your Emergency Fund',
        description: `You have ${months.toFixed(1)} months of expenses saved. Aim for at least 3 months for a basic safety net. You need to save about ${formatCurrency(needed)} more.`,
        actionSteps: [
            'Set up an automatic transfer to savings each payday.',
            'Pause non-essential spending until you reach your goal.'
        ],
        timeframe: '1-3-months',
        impactLevel: 'high'
    }];
}

/**
 * Generates debt-to-income recommendations based on available data.
 * @param debtToIncomeRatio - User's DTI as a percentage
 * @returns Array of Recommendation objects
 */
export function getDebtToIncomeRecommendations(debtToIncomeRatio: number): Recommendation[] {
    if (typeof debtToIncomeRatio !== 'number' || isNaN(debtToIncomeRatio) || debtToIncomeRatio < 36) return [];
    return [{
        id: 'dti-quick',
        category: 'debt',
        priority: 'high',
        title: 'Reduce Your Debt-to-Income Ratio',
        description: `Your debt-to-income ratio is ${debtToIncomeRatio.toFixed(1)}%. Aim to keep this below 36% for financial stability.`,
        actionSteps: [
            'Prioritize paying down high-interest debt.',
            'Avoid taking on new debt until your ratio is below 36%.'
        ],
        timeframe: 'next-3-months',
        impactLevel: 'high'
    }];
}

/**
 * Generates savings rate recommendations based on available data.
 * @param savingsRate - User's savings rate as a percentage
 * @returns Array of Recommendation objects
 */
export function getSavingsRateRecommendations(savingsRate: number): Recommendation[] {
    if (typeof savingsRate !== 'number' || isNaN(savingsRate) || savingsRate >= 10) return [];
    return [{
        id: 'savings-rate-quick',
        category: 'savings',
        priority: 'medium',
        title: 'Increase Your Savings Rate',
        description: `Your savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 10% of your income to build long-term security.`,
        actionSteps: [
            'Increase your savings by 1% each month.',
            'Direct any windfalls or bonuses to savings.'
        ],
        timeframe: 'ongoing',
        impactLevel: 'medium'
    }];
}

/**
 * Generates negative cash flow recommendations based on available data.
 * @param monthlyCashFlow - User's monthly cash flow (income - expenses)
 * @returns Array of Recommendation objects
 */
export function getNegativeCashFlowRecommendations(monthlyCashFlow: number): Recommendation[] {
    if (typeof monthlyCashFlow !== 'number' || isNaN(monthlyCashFlow) || monthlyCashFlow >= 0) return [];
    return [{
        id: 'negative-cash-flow-quick',
        category: 'spending',
        priority: 'high',
        title: 'Address Negative Cash Flow',
        description: `You are spending more than you earn each month. Immediate action is needed to avoid debt and financial stress.`,
        actionSteps: [
            'Track all spending for 30 days to identify areas to cut.',
            'Create a strict budget and stick to it.'
        ],
        timeframe: 'next-30-days',
        impactLevel: 'high'
    }];
}

/**
 * Generates credit score recommendations based on available data.
 * @param creditScore - User's credit score
 * @returns Array of Recommendation objects
 */
export function getCreditScoreRecommendations(creditScore: number): Recommendation[] {
    if (typeof creditScore !== 'number' || isNaN(creditScore) || creditScore >= 670) return [];
    return [{
        id: 'credit-score-quick',
        category: 'credit',
        priority: 'medium',
        title: 'Improve Your Credit Score',
        description: `Your credit score is ${creditScore}. Focus on on-time payments and reducing credit card balances to improve your score.`,
        actionSteps: [
            'Pay all bills on time every month.',
            'Pay down credit card balances below 30% of your limit.'
        ],
        timeframe: 'next-3-months',
        impactLevel: 'medium'
    }];
} 