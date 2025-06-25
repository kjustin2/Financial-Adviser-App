/**
 * Recommendation Engine
 * Orchestrates modular recommendation logic for both Quick and Comprehensive analyses.
 *
 * @remarks
 * - Delegates to Common, Quick, and Comprehensive recommendation modules.
 * - Ensures robust, prioritized recommendations for all users.
 * - Strictly typed, documented, and follows ES module best practices.
 */

import { ComprehensiveAnalysisResult, Recommendation } from '../interfaces/analysis-types';
import { UserFinancialData } from '../interfaces/core-types';
import { getEmergencyFundRecommendations, getDebtToIncomeRecommendations, getSavingsRateRecommendations, getNegativeCashFlowRecommendations, getCreditScoreRecommendations } from './recommendations/CommonRecommendations';
import { getHousingCostRatioRecommendations, getCombinedInsightRecommendations } from './recommendations/QuickRecommendations';
import { getInvestmentDiversificationRecommendations, getInsuranceAdequacyRecommendations } from './recommendations/ComprehensiveRecommendations';

/**
 * RecommendationEngine
 * Provides prioritized, actionable recommendations for financial health improvement.
 */
export class RecommendationEngine {
    /**
     * Main function to generate all recommendations.
     * @param analysis - The full comprehensive analysis result.
     * @param data - The original user financial data.
     * @returns A sorted and deduplicated array of Recommendation objects.
     */
    public static generateRecommendations(
        analysis: ComprehensiveAnalysisResult,
        data: UserFinancialData
    ): Recommendation[] {
        let recommendations: Recommendation[] = [];
        const { keyMetrics } = analysis;
        // --- COMMON RECOMMENDATIONS (always run) ---
        if (typeof data.assets.checking === 'number' && typeof data.assets.savings === 'number' && typeof data.assets.emergencyFund === 'number' && typeof data.expenses.housing === 'number' && typeof data.expenses.food === 'number' && typeof data.expenses.transportation === 'number' && typeof data.expenses.utilities === 'number') {
            recommendations.push(...getEmergencyFundRecommendations(
                (data.assets.checking || 0) + (data.assets.savings || 0) + (data.assets.emergencyFund || 0),
                (data.expenses.housing || 0) + (data.expenses.food || 0) + (data.expenses.transportation || 0) + (data.expenses.utilities || 0)
            ));
        }
        if (typeof keyMetrics.debtToIncomeRatio === 'number' && !isNaN(keyMetrics.debtToIncomeRatio)) {
            recommendations.push(...getDebtToIncomeRecommendations(keyMetrics.debtToIncomeRatio));
        }
        if (typeof keyMetrics.savingsRate === 'number' && !isNaN(keyMetrics.savingsRate)) {
            recommendations.push(...getSavingsRateRecommendations(keyMetrics.savingsRate));
        }
        if (typeof keyMetrics.monthlyCashFlow === 'number' && !isNaN(keyMetrics.monthlyCashFlow)) {
            recommendations.push(...getNegativeCashFlowRecommendations(keyMetrics.monthlyCashFlow));
        }
        if (typeof data.liabilities.creditScore === 'number' && !isNaN(data.liabilities.creditScore)) {
            recommendations.push(...getCreditScoreRecommendations(data.liabilities.creditScore));
        }
        // --- QUICK ANALYSIS RECOMMENDATIONS (if minimal data) ---
        if (this.isQuickAnalysis(data)) {
            if (typeof data.expenses.housing === 'number' && typeof data.income.primarySalary === 'number') {
                recommendations.push(...getHousingCostRatioRecommendations(
                    data.expenses.housing || 0,
                    data.income.primarySalary || 0
                ));
            }
            if (typeof data.income.primarySalary === 'number' && typeof data.expenses.food === 'number' && typeof data.expenses.transportation === 'number' && typeof data.expenses.utilities === 'number' && typeof data.assets.checking === 'number' && typeof data.assets.savings === 'number' && typeof data.assets.emergencyFund === 'number') {
                recommendations.push(...getCombinedInsightRecommendations(
                    data.income.primarySalary || 0,
                    data.expenses.food + data.expenses.transportation + data.expenses.utilities || 0,
                    (data.assets.checking || 0) + (data.assets.savings || 0) + (data.assets.emergencyFund || 0)
                ));
            }
        }
        // --- COMPREHENSIVE ANALYSIS RECOMMENDATIONS (if full data) ---
        if (this.isComprehensiveAnalysis(data)) {
            recommendations.push(...getInvestmentDiversificationRecommendations(data.assets, data.personalInfo.age));
            recommendations.push(...getInsuranceAdequacyRecommendations(data.insurance, data.personalInfo.dependents));
        }
        // Sort and deduplicate
        recommendations.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        const uniqueRecommendations = Array.from(new Map(recommendations.map(r => [r.id, r])).values());
        return uniqueRecommendations.slice(0, 10);
    }

    /**
     * Determines if the data set is from Quick Analysis (minimal fields).
     */
    private static isQuickAnalysis(data: UserFinancialData): boolean {
        // Heuristic: Quick Analysis has only primarySalary, housing, minimal expenses, checking, creditCardDebt, creditScore
        const hasMinimalFields =
            typeof data.income.primarySalary === 'number' &&
            typeof data.expenses.housing === 'number' &&
            typeof data.assets.checking === 'number' &&
            typeof data.liabilities.creditCardDebt === 'number' &&
            typeof data.liabilities.creditScore === 'number';
        const hasComprehensiveFields =
            typeof data.income.secondaryIncome === 'number' &&
            typeof data.assets.employer401k === 'number';
        return hasMinimalFields && !hasComprehensiveFields;
    }

    /**
     * Determines if the data set is from Comprehensive Analysis (full fields).
     */
    private static isComprehensiveAnalysis(data: UserFinancialData): boolean {
        // Heuristic: Comprehensive Analysis has secondaryIncome, employer401k, etc.
        return typeof data.income.secondaryIncome === 'number' && typeof data.assets.employer401k === 'number';
    }
} 