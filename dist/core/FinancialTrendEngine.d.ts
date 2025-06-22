import { UserFinancialData, UserBehaviorData, MarketDataPoint } from '../types';
/**
 * Represents a financial trend prediction
 */
export interface TrendPrediction {
    metric: string;
    currentValue: number;
    predictedValue: number;
    confidence: number;
    timeframe: 'monthly' | 'quarterly' | 'annually';
    trend: 'increasing' | 'decreasing' | 'stable';
    changeRate: number;
    factors: string[];
    riskLevel: 'low' | 'medium' | 'high';
}
/**
 * Historical data point for trend analysis
 */
export interface HistoricalDataPoint {
    timestamp: Date;
    value: number;
    context: string;
    metadata: Record<string, any>;
}
/**
 * Trend analysis configuration
 */
export interface TrendAnalysisConfig {
    lookbackPeriods: number;
    confidenceThreshold: number;
    seasonalityEnabled: boolean;
    volatilityAdjustment: boolean;
    behaviorWeighting: number;
}
/**
 * Seasonal pattern detection
 */
export interface SeasonalPattern {
    pattern: 'monthly' | 'quarterly' | 'yearly';
    amplitude: number;
    phase: number;
    strength: number;
}
/**
 * Financial Trend Prediction Engine
 * Analyzes historical patterns and predicts future financial trends
 */
export declare class FinancialTrendEngine {
    private config;
    private historicalData;
    constructor(config?: Partial<TrendAnalysisConfig>);
    /**
     * Predict comprehensive financial trends for a user
     */
    predictFinancialTrends(financialData: UserFinancialData, behaviorData: UserBehaviorData, historicalFinancialData?: HistoricalDataPoint[], marketData?: MarketDataPoint[]): TrendPrediction[];
    /**
     * Add historical data for trend analysis
     */
    addHistoricalData(metric: string, dataPoints: HistoricalDataPoint[]): void;
    /**
     * Predict income trend based on employment stability and growth patterns
     */
    private predictIncomeTrend;
    /**
     * Predict spending trends based on historical patterns and behavioral factors
     */
    private predictSpendingTrend;
    /**
     * Predict savings trends based on income vs spending patterns
     */
    private predictSavingsTrend;
    /**
     * Predict investment performance trends
     */
    private predictInvestmentTrend;
    /**
     * Predict debt reduction trends
     */
    private predictDebtTrend;
    /**
     * Predict net worth growth trends
     */
    private predictNetWorthTrend;
    private calculateTotalMonthlyIncome;
    private calculateTotalMonthlyExpenses;
    private calculateSavingsRate;
    private calculateTotalInvestments;
    private calculateTotalDebt;
    private calculateNetWorth;
    private getEmploymentStabilityFactor;
    private getExperienceGrowthFactor;
    private getMarketConditionFactor;
    private calculateIncomeConfidence;
    private calculateSpendingConfidence;
    private calculateSavingsConfidence;
    private calculateInvestmentConfidence;
    private calculateDebtConfidence;
    private calculateNetWorthConfidence;
    private getIncomeFactors;
    private getSpendingFactors;
    private getSavingsFactors;
    private getInvestmentFactors;
    private getDebtFactors;
    private getNetWorthFactors;
    private assessIncomeRiskLevel;
    private assessSpendingRiskLevel;
    private assessSavingsRiskLevel;
    private assessInvestmentRiskLevel;
    private assessDebtRiskLevel;
    private assessNetWorthRiskLevel;
}
/**
 * Utility functions for trend analysis
 */
export declare class TrendAnalysisUtils {
    /**
     * Calculate linear regression trend
     */
    static calculateLinearTrend(dataPoints: number[]): {
        slope: number;
        intercept: number;
        r2: number;
    };
    /**
     * Detect seasonal patterns in data
     */
    static detectSeasonality(dataPoints: HistoricalDataPoint[], period?: number): SeasonalPattern | null;
    /**
     * Calculate confidence intervals for predictions
     */
    static calculateConfidenceInterval(prediction: number, historicalData: number[], confidenceLevel?: number): {
        lower: number;
        upper: number;
    };
}
//# sourceMappingURL=FinancialTrendEngine.d.ts.map