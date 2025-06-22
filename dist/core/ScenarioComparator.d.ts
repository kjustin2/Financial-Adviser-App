/**
 * Advanced Scenario Comparison Tools
 * Provides comprehensive tools for comparing financial scenarios with statistical significance testing,
 * risk-adjusted performance metrics, and investment recommendations
 */
import { ScenarioResult, EconomicScenario } from '../types';
export interface ComparisonWeights {
    returnWeight: number;
    riskWeight: number;
    stabilityWeight: number;
    downsideProtectionWeight: number;
}
export interface StatisticalTest {
    testType: 'ttest' | 'kstest' | 'mannwhitney';
    pValue: number;
    statisticValue: number;
    isSignificant: boolean;
    confidence: number;
}
export interface PerformanceAttribution {
    totalReturnDifference: number;
    contributions: {
        marketReturn: number;
        volatility: number;
        inflationImpact: number;
        marketShocks: number;
        correlationEffect: number;
    };
}
export interface ComparisonSummary {
    scenarioA: string;
    scenarioB: string;
    winner: 'A' | 'B' | 'neutral';
    winnerConfidence: number;
    keyDifferences: string[];
    recommendation: string;
    statisticalSignificance: StatisticalTest;
    performanceAttribution: PerformanceAttribution;
}
export interface RiskReturnProfile {
    scenario: string;
    expectedReturn: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
    probabilityOfLoss: number;
    valueAtRisk: number;
    riskAdjustedScore: number;
}
export interface VisualizationData {
    riskReturnScatterPlot: Array<{
        scenario: string;
        x: number;
        y: number;
        size: number;
        color: string;
    }>;
    performanceDistribution: Array<{
        scenario: string;
        percentile: number;
        value: number;
    }>;
    correlationHeatmap: Array<{
        scenarioA: string;
        scenarioB: string;
        correlation: number;
    }>;
    probabilityCones: Array<{
        scenario: string;
        timeHorizon: number[];
        upperBound: number[];
        lowerBound: number[];
        median: number[];
    }>;
}
/**
 * Advanced Scenario Comparison Engine
 */
export declare class ScenarioComparator {
    private defaultWeights;
    /**
     * Perform comprehensive pairwise scenario comparison
     */
    compareScenarios(scenarioA: ScenarioResult, scenarioB: ScenarioResult, economicScenarioA?: EconomicScenario, economicScenarioB?: EconomicScenario, weights?: ComparisonWeights): ComparisonSummary;
    /**
     * Rank multiple scenarios using multi-criteria analysis
     */
    rankScenarios(scenarios: ScenarioResult[], weights?: ComparisonWeights, riskTolerance?: 'conservative' | 'moderate' | 'aggressive'): Array<{
        rank: number;
        scenarioId: string;
        score: number;
        riskAdjustedScore: number;
        suitabilityScore: number;
    }>;
    /**
     * Generate risk-return profiles for visualization
     */
    generateRiskReturnProfiles(scenarios: ScenarioResult[]): RiskReturnProfile[];
    /**
     * Prepare data for visualization components
     */
    prepareVisualizationData(scenarios: ScenarioResult[], economicScenarios?: EconomicScenario[]): VisualizationData;
    /**
     * Generate scenario sensitivity analysis
     */
    analyzeSensitivity(baseScenario: ScenarioResult, variations: ScenarioResult[]): Array<{
        parameter: string;
        impact: number;
        significance: 'high' | 'medium' | 'low';
    }>;
    private performStatisticalTest;
    private normalCDF;
    private erf;
    private analyzePerformanceAttribution;
    private calculateCompositeScore;
    private calculateRiskAdjustedScore;
    private calculateSuitabilityScore;
    private identifyKeyDifferences;
    private generateComparisonRecommendation;
    private calculateCorrelation;
    private getScenarioColor;
}
/**
 * Quick scenario comparison for simple use cases
 */
export declare function quickCompareScenarios(scenarioA: ScenarioResult, scenarioB: ScenarioResult): {
    betterScenario: string;
    confidence: number;
    reason: string;
};
/**
 * Generate comparison summary table data
 */
export declare function generateComparisonTable(scenarios: ScenarioResult[]): Array<{
    scenario: string;
    expectedReturn: string;
    volatility: string;
    sharpeRatio: string;
    maxDrawdown: string;
    probabilityOfLoss: string;
    overallRating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}>;
//# sourceMappingURL=ScenarioComparator.d.ts.map