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
/**
 * RecommendationEngine
 * Provides prioritized, actionable recommendations for financial health improvement.
 */
export declare class RecommendationEngine {
    /**
     * Main function to generate all recommendations.
     * @param analysis - The full comprehensive analysis result.
     * @param data - The original user financial data.
     * @returns A sorted and deduplicated array of Recommendation objects.
     */
    static generateRecommendations(analysis: ComprehensiveAnalysisResult, data: UserFinancialData): Recommendation[];
    /**
     * Determines if the data set is from Quick Analysis (minimal fields).
     */
    private static isQuickAnalysis;
    /**
     * Determines if the data set is from Comprehensive Analysis (full fields).
     */
    private static isComprehensiveAnalysis;
}
//# sourceMappingURL=RecommendationEngine.d.ts.map