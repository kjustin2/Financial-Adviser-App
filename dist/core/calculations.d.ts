/**
 * Comprehensive Financial Health Calculation Engine
 * Based on Financial Health Network 2024 research and industry best practices
 *
 * @remarks
 * - Strictly typed, fully documented, and validated per project rules.
 * - All calculations use validated user input and handle edge cases.
 * - No sensitive data is stored or transmitted externally from this module.
 */
import { UserFinancialData } from '../interfaces/core-types';
import { ComprehensiveAnalysisResult } from '../interfaces/analysis-types';
/**
 * FinancialCalculationEngine
 * Provides all core financial health calculations and analysis.
 */
export declare class FinancialCalculationEngine {
    /**
     * Perform comprehensive financial health analysis
     * @param data - Validated user financial data
     * @returns ComprehensiveAnalysisResult with all metrics, indicators, and recommendations
     * @remarks All calculations are based on Financial Health Network, CFPB, Experian, and other industry standards.
     */
    static analyzeFinancialHealth(data: UserFinancialData): ComprehensiveAnalysisResult;
    /**
     * Calculate key financial metrics (net worth, DTI, savings rate, etc)
     * @param data - User financial data
     * @returns Object with all key metrics and breakdowns
     * @remarks See CFPB, Experian, NerdWallet for metric definitions and targets.
     */
    private static calculateKeyMetrics;
    /**
     * Calculate the 8 core health indicators based on Financial Health Network research
     * @param data - User financial data
     * @param keyMetrics - Precomputed key metrics
     * @returns Array of HealthIndicator objects
     */
    private static calculateHealthIndicators;
    /**
     * Health Indicator 1: Spending vs Income Analysis
     * @remarks A healthy cash flow ratio is typically above 10-20% (CFPB, Experian).
     */
    private static analyzeSpendingVsIncome;
    /**
     * Health Indicator 2: Bill Payment Reliability
     */
    private static analyzeBillPaymentReliability;
    /**
     * Analyze Debt Management Effectiveness (core health indicator #4)
     * Uses research-based debt-to-income ratio, edge case handling, and clear status logic.
     * - Target: <36% total DTI, <28% housing DTI
     * - Status: 'excellent' <20%, 'good' <28%, 'fair' <36%, 'poor' <43%, 'critical' >=43%
     * - Handles zero/negative income and missing data
     */
    private static analyzeDebtManagement;
    private static getTotalMonthlyIncome;
    private static getTotalMonthlyExpenses;
    private static getTotalAssets;
    /**
     * Get total monthly debt payments from all liability categories
     * Allows total debt to be zero and prevents NaN
     */
    private static getTotalDebt;
    /**
     * Get total liabilities from all liability categories
     * Sums all liability fields, treating missing as zero
     */
    private static getTotalLiabilities;
    private static formatCurrency;
    private static formatReliabilityText;
    private static calculateOverallHealthScore;
    private static getHealthLevel;
    /**
     * Health Indicator 3: Emergency Savings Adequacy
     */
    private static analyzeEmergencySavings;
    /**
     * Health Indicator 5: Credit Score Health
     */
    private static analyzeCreditHealth;
    /**
     * Health Indicator 6: Insurance Coverage Confidence
     */
    private static analyzeInsuranceConfidence;
    /**
     * Health Indicator 7: Long-term Financial Goal Confidence
     */
    private static analyzeLongTermGoalConfidence;
    /**
     * Health Indicator 8: Financial Planning Engagement
     */
    private static analyzeFinancialPlanningEngagement;
    private static calculateAssetAllocationScore;
    /**
     * Enhanced Liquidity Analysis
     */
    private static analyzeLiquidity;
    /**
     * Enhanced Debt Analysis
     */
    private static analyzeDebt;
    /**
     * Enhanced Investment Analysis
     */
    private static analyzeInvestments;
    /**
     * Enhanced Insurance Analysis
     */
    private static analyzeInsurance;
    /**
     * Enhanced Wealth Projections
     */
    private static projectWealth;
    /**
     * Enhanced Scenario Analysis
     */
    private static analyzeScenarios;
    /**
     * Generate more detailed financial analysis for the user
     * - Net worth breakdown, savings rate, debt structure, expense categorization, investment diversification, insurance adequacy, peer benchmarks, scenario/stress testing
     * - All calculations robust to edge cases
     */
    private static generateDetailedInsights;
    /**
     * Calculate Financial Ratios
     */
    private static calculateFinancialRatios;
    /**
     * Assess Financial Risk
     */
    private static assessFinancialRisk;
    /**
     * Analyze Financial Goals
     */
    private static analyzeFinancialGoals;
    private static calculateRetirementProjection;
    private static isRetirementOnTrack;
    private static calculateTimeToEmergencyGoal;
    private static calculatePeerBenchmarks;
    private static getCreditScoreStatus;
    private static getSpendingRecommendations;
    private static getPaymentReliabilityRecommendations;
    /**
     * Get actionable, research-based recommendations for emergency fund
     * Prevents $NaN by checking for valid numbers and zero expenses
     */
    private static getEmergencyFundRecommendations;
    /**
     * Get actionable, research-based recommendations for debt management
     * - <20%: Maintain current habits
     * - 20-28%: Monitor and avoid new debt
     * - 28-36%: Reduce discretionary spending, pay down high-interest debt
     * - 36-43%: Aggressively pay down debt, consider consolidation
     * - >43%: Seek professional help, create a debt reduction plan
     */
    private static getDebtManagementRecommendations;
    private static getCreditHealthRecommendations;
    private static getInsuranceRecommendations;
    private static getRetirementRecommendations;
    private static getPlanningRecommendations;
    private static getCreditUtilizationStatus;
    private static formatConfidenceText;
    private static formatBudgetText;
    private static formatPlanningText;
    /**
     * Validate that we're using actual user data, not mock/default values
     */
    private static validateUserData;
}
//# sourceMappingURL=calculations.d.ts.map