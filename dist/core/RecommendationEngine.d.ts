import { ComprehensiveAnalysisResult, Recommendation } from '../interfaces/analysis-types';
import { UserFinancialData } from '../interfaces/core-types';
/**
 * Generates actionable, prioritized recommendations based on the financial analysis.
 */
export declare class RecommendationEngine {
    /**
     * Main function to generate all recommendations.
     * @param analysis - The full comprehensive analysis result.
     * @param data - The original user financial data.
     * @returns A sorted and deduplicated array of Recommendation objects.
     */
    static generateRecommendations(analysis: ComprehensiveAnalysisResult, data: UserFinancialData): Recommendation[];
    private static getEmergencyFundRecommendations;
    private static getHighDebtRecommendations;
    private static getNegativeCashFlowRecommendations;
    private static getSavingsRateRecommendations;
    private static getInsuranceRecommendations;
    private static getCreditScoreOptimizationRecommendations;
    private static getInvestmentRecommendations;
    private static getBudgetingRecommendations;
    private static getAutomatedSavingsRecommendations;
    private static getGenericIndicatorRecommendations;
}
//# sourceMappingURL=RecommendationEngine.d.ts.map