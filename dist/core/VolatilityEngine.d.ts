import { SimulationResult, EconomicScenario, VolatilityMetrics, VolatilityAnalysis } from '../types';
/**
 * Market Volatility Analysis Engine
 * Provides comprehensive volatility analysis across different economic scenarios
 */
export declare class VolatilityEngine {
    /**
     * Calculate comprehensive volatility metrics for a simulation result
     */
    calculateVolatilityMetrics(result: SimulationResult): VolatilityMetrics;
    /**
     * Perform comprehensive volatility analysis across multiple scenarios
     */
    analyzeScenarioVolatility(scenarios: EconomicScenario[], results: SimulationResult[]): VolatilityAnalysis;
    /**
     * Calculate simple returns from price series
     */
    private calculateReturns;
    /**
     * Calculate historical volatility (standard deviation of returns)
     */
    private calculateHistoricalVolatility;
    /**
     * Calculate realized volatility using high-frequency estimation
     */
    private calculateRealizedVolatility;
    /**
     * Estimate implied volatility (simplified Black-Scholes approach)
     */
    private estimateImpliedVolatility;
    /**
     * Calculate volatility of volatility (second-order volatility)
     */
    private calculateVolatilityOfVolatility;
    /**
     * Detect volatility clustering using ARCH effects
     */
    private detectVolatilityClustering;
    /**
     * Calculate downside volatility (volatility of negative returns)
     */
    private calculateDownsideVolatility;
    /**
     * Calculate upside volatility (volatility of positive returns)
     */
    private calculateUpsideVolatility;
    /**
     * Calculate intraday volatility (simplified)
     */
    private calculateIntradayVolatility;
    /**
     * Calculate monthly volatility
     */
    private calculateMonthlyVolatility;
    /**
     * Calculate quarterly volatility
     */
    private calculateQuarterlyVolatility;
    /**
     * Calculate annual volatility
     */
    private calculateAnnualVolatility;
    /**
     * Calculate volatility skewness
     */
    private calculateVolatilitySkew;
    /**
     * Calculate volatility kurtosis
     */
    private calculateVolatilityKurtosis;
    /**
     * Analyze correlation breakdown during high volatility periods
     */
    private analyzeCorrelationBreakdown;
    /**
     * Compare volatility metrics across scenarios
     */
    private compareVolatilityAcrossScenarios;
    /**
     * Analyze volatility regimes
     */
    private analyzeVolatilityRegimes;
    /**
     * Calculate stress test volatility metrics
     */
    private calculateStressTestVolatility;
    /**
     * Analyze market shock volatility impact
     */
    private analyzeMarketShockVolatility;
    /**
     * Calculate percentile of an array
     */
    private calculatePercentile;
    /**
     * Calculate variance of an array
     */
    private calculateVariance;
}
/**
 * Utility function to run volatility analysis on predefined scenarios
 */
export declare function runVolatilityAnalysis(scenarios: EconomicScenario[], results: SimulationResult[]): Promise<VolatilityAnalysis>;
//# sourceMappingURL=VolatilityEngine.d.ts.map