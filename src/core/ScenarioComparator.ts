/**
 * Advanced Scenario Comparison Tools
 * Provides comprehensive tools for comparing financial scenarios with statistical significance testing,
 * risk-adjusted performance metrics, and investment recommendations
 */

import { 
    ScenarioResult, 
    EconomicScenario
} from '../types';

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
        x: number; // Risk (volatility)
        y: number; // Return
        size: number; // Sharpe ratio
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
export class ScenarioComparator {
    private defaultWeights: ComparisonWeights = {
        returnWeight: 0.4,
        riskWeight: 0.3,
        stabilityWeight: 0.2,
        downsideProtectionWeight: 0.1
    };

    /**
     * Perform comprehensive pairwise scenario comparison
     */
    compareScenarios(
        scenarioA: ScenarioResult, 
        scenarioB: ScenarioResult,
        economicScenarioA?: EconomicScenario,
        economicScenarioB?: EconomicScenario,
        weights: ComparisonWeights = this.defaultWeights
    ): ComparisonSummary {
        // Statistical significance testing
        const statisticalTest = this.performStatisticalTest(
            scenarioA.simulationResult.results,
            scenarioB.simulationResult.results
        );

        // Performance attribution analysis
        const performanceAttribution = this.analyzePerformanceAttribution(
            scenarioA, scenarioB, economicScenarioA, economicScenarioB
        );

        // Multi-criteria scoring
        const scoreA = this.calculateCompositeScore(scenarioA, weights);
        const scoreB = this.calculateCompositeScore(scenarioB, weights);
        
        const scoreDifference = Math.abs(scoreA - scoreB);
        const winner = scoreDifference < 0.05 ? 'neutral' : (scoreA > scoreB ? 'A' : 'B');
        const winnerConfidence = Math.min(95, 50 + (scoreDifference * 100));

        // Generate key differences
        const keyDifferences = this.identifyKeyDifferences(scenarioA, scenarioB);

        // Generate recommendation
        const recommendation = this.generateComparisonRecommendation(
            scenarioA, scenarioB, winner, performanceAttribution
        );

        return {
            scenarioA: scenarioA.scenarioId,
            scenarioB: scenarioB.scenarioId,
            winner,
            winnerConfidence,
            keyDifferences,
            recommendation,
            statisticalSignificance: statisticalTest,
            performanceAttribution
        };
    }

    /**
     * Rank multiple scenarios using multi-criteria analysis
     */
    rankScenarios(
        scenarios: ScenarioResult[],
        weights: ComparisonWeights = this.defaultWeights,
        riskTolerance: 'conservative' | 'moderate' | 'aggressive' = 'moderate'
    ): Array<{
        rank: number;
        scenarioId: string;
        score: number;
        riskAdjustedScore: number;
        suitabilityScore: number;
    }> {
        // Calculate scores for each scenario
        const scoredScenarios = scenarios.map(scenario => {
            const baseScore = this.calculateCompositeScore(scenario, weights);
            const riskAdjustedScore = this.calculateRiskAdjustedScore(scenario, riskTolerance);
            const suitabilityScore = this.calculateSuitabilityScore(scenario, riskTolerance);

            return {
                scenarioId: scenario.scenarioId,
                scenario,
                baseScore,
                riskAdjustedScore,
                suitabilityScore,
                // Weighted final score
                finalScore: (baseScore * 0.4) + (riskAdjustedScore * 0.4) + (suitabilityScore * 0.2)
            };
        });

        // Sort by final score (descending)
        scoredScenarios.sort((a, b) => b.finalScore - a.finalScore);

        // Return ranking
        return scoredScenarios.map((item, index) => ({
            rank: index + 1,
            scenarioId: item.scenarioId,
            score: item.baseScore,
            riskAdjustedScore: item.riskAdjustedScore,
            suitabilityScore: item.suitabilityScore
        }));
    }

    /**
     * Generate risk-return profiles for visualization
     */
    generateRiskReturnProfiles(scenarios: ScenarioResult[]): RiskReturnProfile[] {
        return scenarios.map(scenario => {
            const stats = scenario.simulationResult.statistics;
            const initialValue = scenario.simulationResult.scenario.initialValue;
            
            const expectedReturn = (stats.mean - initialValue) / initialValue;
            const volatility = stats.standardDeviation / initialValue;
            const riskAdjustedScore = this.calculateCompositeScore(scenario, this.defaultWeights);

            return {
                scenario: scenario.scenarioId,
                expectedReturn,
                volatility,
                sharpeRatio: scenario.riskMetrics.sharpeRatio,
                maxDrawdown: scenario.riskMetrics.maxDrawdown,
                probabilityOfLoss: scenario.stressTestResults.probabilityOfLoss,
                valueAtRisk: scenario.riskMetrics.valueAtRisk,
                riskAdjustedScore
            };
        });
    }

    /**
     * Prepare data for visualization components
     */
    prepareVisualizationData(
        scenarios: ScenarioResult[],
        economicScenarios?: EconomicScenario[]
    ): VisualizationData {
        const profiles = this.generateRiskReturnProfiles(scenarios);
        
        // Risk-Return Scatter Plot
        const riskReturnScatterPlot = profiles.map((profile, _index) => ({
            scenario: profile.scenario,
            x: profile.volatility * 100, // Convert to percentage
            y: profile.expectedReturn * 100, // Convert to percentage
            size: Math.max(0.1, profile.sharpeRatio * 10), // Scale Sharpe ratio for visualization
            color: this.getScenarioColor(profile.scenario, economicScenarios)
        }));

        // Performance Distribution (percentiles)
        const performanceDistribution: VisualizationData['performanceDistribution'] = [];
        const percentiles = [5, 10, 25, 50, 75, 90, 95];
        
        scenarios.forEach(scenario => {
            percentiles.forEach(percentile => {
                const value = scenario.simulationResult.statistics.percentiles[`p${percentile}` as keyof typeof scenario.simulationResult.statistics.percentiles];
                if (value !== undefined) {
                    performanceDistribution.push({
                        scenario: scenario.scenarioId,
                        percentile,
                        value
                    });
                }
            });
        });

        // Correlation Heatmap Data
        const correlationHeatmap: VisualizationData['correlationHeatmap'] = [];
        for (let i = 0; i < scenarios.length; i++) {
            for (let j = i + 1; j < scenarios.length; j++) {
                const correlation = this.calculateCorrelation(
                    scenarios[i].simulationResult.results,
                    scenarios[j].simulationResult.results
                );
                
                correlationHeatmap.push({
                    scenarioA: scenarios[i].scenarioId,
                    scenarioB: scenarios[j].scenarioId,
                    correlation
                });
            }
        }

        // Probability Cones (simplified - would need time-series data for full implementation)
        const probabilityCones = scenarios.map(scenario => {
            const stats = scenario.simulationResult.statistics;
            const timeHorizon = Array.from({length: 30}, (_, i) => i + 1); // 30 years
            
            return {
                scenario: scenario.scenarioId,
                timeHorizon,
                upperBound: timeHorizon.map(year => stats.percentiles.p95 * Math.pow(1.02, year)),
                lowerBound: timeHorizon.map(year => stats.percentiles.p5 * Math.pow(1.02, year)),
                median: timeHorizon.map(year => stats.median * Math.pow(1.02, year))
            };
        });

        return {
            riskReturnScatterPlot,
            performanceDistribution,
            correlationHeatmap,
            probabilityCones
        };
    }

    /**
     * Generate scenario sensitivity analysis
     */
    analyzeSensitivity(
        baseScenario: ScenarioResult,
        variations: ScenarioResult[]
    ): Array<{
        parameter: string;
        impact: number;
        significance: 'high' | 'medium' | 'low';
    }> {
        const baseReturn = baseScenario.simulationResult.statistics.mean;
        
        return variations.map(variation => {
            const returnDifference = Math.abs(variation.simulationResult.statistics.mean - baseReturn);
            const relativeImpact = returnDifference / baseReturn;
            
            let significance: 'high' | 'medium' | 'low';
            if (relativeImpact > 0.1) significance = 'high';
            else if (relativeImpact > 0.05) significance = 'medium';
            else significance = 'low';

            return {
                parameter: variation.scenarioId,
                impact: relativeImpact,
                significance
            };
        });
    }

    // Private helper methods

    private performStatisticalTest(
        dataA: number[], 
        dataB: number[]
    ): StatisticalTest {
        // Simplified t-test implementation
        const meanA = dataA.reduce((sum, val) => sum + val, 0) / dataA.length;
        const meanB = dataB.reduce((sum, val) => sum + val, 0) / dataB.length;
        
        const varA = dataA.reduce((sum, val) => sum + Math.pow(val - meanA, 2), 0) / (dataA.length - 1);
        const varB = dataB.reduce((sum, val) => sum + Math.pow(val - meanB, 2), 0) / (dataB.length - 1);
        
        const pooledStdError = Math.sqrt((varA / dataA.length) + (varB / dataB.length));
        const tStatistic = (meanA - meanB) / pooledStdError;
        
        // Simplified p-value calculation (would use proper distribution in production)
        const pValue = 2 * (1 - this.normalCDF(Math.abs(tStatistic)));
        
        return {
            testType: 'ttest',
            pValue,
            statisticValue: tStatistic,
            isSignificant: pValue < 0.05,
            confidence: (1 - pValue) * 100
        };
    }

    private normalCDF(x: number): number {
        // Approximation of normal CDF
        return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
    }

    private erf(x: number): number {
        // Approximation of error function
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;

        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x);

        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return sign * y;
    }

    private analyzePerformanceAttribution(
        scenarioA: ScenarioResult,
        scenarioB: ScenarioResult,
        economicA?: EconomicScenario,
        economicB?: EconomicScenario
    ): PerformanceAttribution {
        const totalReturnDifference = 
            scenarioA.simulationResult.statistics.mean - scenarioB.simulationResult.statistics.mean;

        // Simplified attribution analysis
        const contributions = {
            marketReturn: economicA && economicB ? 
                (economicA.parameters.marketReturn.mean - economicB.parameters.marketReturn.mean) * 0.3 : 0,
            volatility: (scenarioA.riskMetrics.volatility - scenarioB.riskMetrics.volatility) * -0.2,
            inflationImpact: economicA && economicB ? 
                (economicA.parameters.inflationRate.mean - economicB.parameters.inflationRate.mean) * -0.1 : 0,
            marketShocks: 0, // Would calculate based on shock frequency/severity
            correlationEffect: 0 // Simplified
        };

        return {
            totalReturnDifference,
            contributions
        };
    }

    private calculateCompositeScore(
        scenario: ScenarioResult, 
        weights: ComparisonWeights
    ): number {
        // Normalize metrics to 0-1 scale
        const returnScore = Math.min(1, Math.max(0, 
            (scenario.simulationResult.statistics.mean / scenario.simulationResult.scenario.initialValue - 1) / 0.15
        ));
        
        const riskScore = Math.min(1, Math.max(0, 
            1 - (scenario.riskMetrics.volatility / 0.3)
        ));
        
        const stabilityScore = Math.min(1, Math.max(0, 
            1 - (scenario.riskMetrics.maxDrawdown / 0.5)
        ));
        
        const downsideProtectionScore = Math.min(1, Math.max(0, 
            1 - scenario.stressTestResults.probabilityOfLoss
        ));

        return (
            returnScore * weights.returnWeight +
            riskScore * weights.riskWeight +
            stabilityScore * weights.stabilityWeight +
            downsideProtectionScore * weights.downsideProtectionWeight
        );
    }

    private calculateRiskAdjustedScore(
        scenario: ScenarioResult,
        riskTolerance: 'conservative' | 'moderate' | 'aggressive'
    ): number {
        const sharpe = scenario.riskMetrics.sharpeRatio;
        const sortino = scenario.riskMetrics.sortinoRatio;
        const maxDrawdown = scenario.riskMetrics.maxDrawdown;

        // Adjust scoring based on risk tolerance
        let riskPenalty = 0;
        switch (riskTolerance) {
            case 'conservative':
                riskPenalty = maxDrawdown * 2; // High penalty for drawdowns
                break;
            case 'moderate':
                riskPenalty = maxDrawdown * 1; // Moderate penalty
                break;
            case 'aggressive':
                riskPenalty = maxDrawdown * 0.5; // Low penalty
                break;
        }

        return Math.max(0, (sharpe + sortino) / 2 - riskPenalty);
    }

    private calculateSuitabilityScore(
        scenario: ScenarioResult,
        riskTolerance: 'conservative' | 'moderate' | 'aggressive'
    ): number {
        const volatility = scenario.riskMetrics.volatility;
        const probabilityOfLoss = scenario.stressTestResults.probabilityOfLoss;

        // Define risk tolerance thresholds
        const thresholds = {
            conservative: { maxVol: 0.12, maxLossProb: 0.15 },
            moderate: { maxVol: 0.18, maxLossProb: 0.25 },
            aggressive: { maxVol: 0.30, maxLossProb: 0.40 }
        };

        const threshold = thresholds[riskTolerance];
        
        const volScore = Math.max(0, 1 - (volatility / threshold.maxVol));
        const lossScore = Math.max(0, 1 - (probabilityOfLoss / threshold.maxLossProb));

        return (volScore + lossScore) / 2;
    }

    private identifyKeyDifferences(
        scenarioA: ScenarioResult,
        scenarioB: ScenarioResult
    ): string[] {
        const differences: string[] = [];

        // Return difference
        const returnDiff = ((scenarioA.simulationResult.statistics.mean / scenarioA.simulationResult.scenario.initialValue) - 
                           (scenarioB.simulationResult.statistics.mean / scenarioB.simulationResult.scenario.initialValue)) * 100;
        
        if (Math.abs(returnDiff) > 1) {
            differences.push(`${Math.abs(returnDiff).toFixed(1)}% ${returnDiff > 0 ? 'higher' : 'lower'} expected return`);
        }

        // Risk difference
        const riskDiff = (scenarioA.riskMetrics.volatility - scenarioB.riskMetrics.volatility) * 100;
        if (Math.abs(riskDiff) > 2) {
            differences.push(`${Math.abs(riskDiff).toFixed(1)}% ${riskDiff > 0 ? 'higher' : 'lower'} volatility`);
        }

        // Drawdown difference
        const drawdownDiff = (scenarioA.riskMetrics.maxDrawdown - scenarioB.riskMetrics.maxDrawdown) * 100;
        if (Math.abs(drawdownDiff) > 5) {
            differences.push(`${Math.abs(drawdownDiff).toFixed(1)}% ${drawdownDiff > 0 ? 'higher' : 'lower'} maximum drawdown`);
        }

        // Sharpe ratio difference
        const sharpeDiff = scenarioA.riskMetrics.sharpeRatio - scenarioB.riskMetrics.sharpeRatio;
        if (Math.abs(sharpeDiff) > 0.2) {
            differences.push(`${Math.abs(sharpeDiff).toFixed(2)} ${sharpeDiff > 0 ? 'higher' : 'lower'} Sharpe ratio`);
        }

        return differences;
    }

    private generateComparisonRecommendation(
        _scenarioA: ScenarioResult,
        _scenarioB: ScenarioResult,
        winner: 'A' | 'B' | 'neutral',
        attribution: PerformanceAttribution
    ): string {
        if (winner === 'neutral') {
            return "Both scenarios show similar risk-adjusted performance. Consider diversification or other factors for selection.";
        }

        const winnerName = winner === 'A' ? 'Scenario A' : 'Scenario B';
        
        // Analyze the main drivers
        let mainDriver = '';
        const maxContribution = Math.max(
            Math.abs(attribution.contributions.marketReturn),
            Math.abs(attribution.contributions.volatility),
            Math.abs(attribution.contributions.inflationImpact)
        );

        if (maxContribution === Math.abs(attribution.contributions.marketReturn)) {
            mainDriver = 'market return expectations';
        } else if (maxContribution === Math.abs(attribution.contributions.volatility)) {
            mainDriver = 'volatility management';
        } else {
            mainDriver = 'inflation protection';
        }

        return `${winnerName} outperforms primarily due to ${mainDriver}. ` +
               `Consider this scenario for portfolios emphasizing ${mainDriver}.`;
    }

    private calculateCorrelation(seriesA: number[], seriesB: number[]): number {
        const n = Math.min(seriesA.length, seriesB.length);
        const meanA = seriesA.slice(0, n).reduce((sum, val) => sum + val, 0) / n;
        const meanB = seriesB.slice(0, n).reduce((sum, val) => sum + val, 0) / n;

        let numerator = 0;
        let denominatorA = 0;
        let denominatorB = 0;

        for (let i = 0; i < n; i++) {
            const diffA = seriesA[i] - meanA;
            const diffB = seriesB[i] - meanB;
            
            numerator += diffA * diffB;
            denominatorA += diffA * diffA;
            denominatorB += diffB * diffB;
        }

        return denominatorA === 0 || denominatorB === 0 ? 0 : 
               numerator / Math.sqrt(denominatorA * denominatorB);
    }

    private getScenarioColor(scenarioId: string, economicScenarios?: EconomicScenario[]): string {
        if (!economicScenarios) return '#3b82f6';

        const scenario = economicScenarios.find(s => s.id === scenarioId);
        if (!scenario) return '#3b82f6';

        // Color coding by category
        const colorMap = {
            'normal': '#10b981',        // Green
            'recession': '#ef4444',     // Red
            'inflation': '#f59e0b',     // Orange
            'market-crash': '#7c2d12',  // Dark red
            'bull-market': '#059669',   // Dark green
            'stagflation': '#dc2626',   // Red
            'recovery': '#3b82f6'       // Blue
        };

        return colorMap[scenario.category] || '#6b7280'; // Gray fallback
    }
}

// Export utility functions for standalone use

/**
 * Quick scenario comparison for simple use cases
 */
export function quickCompareScenarios(
    scenarioA: ScenarioResult,
    scenarioB: ScenarioResult
): {
    betterScenario: string;
    confidence: number;
    reason: string;
} {
    const comparator = new ScenarioComparator();
    const comparison = comparator.compareScenarios(scenarioA, scenarioB);
    
    return {
        betterScenario: comparison.winner === 'A' ? scenarioA.scenarioId : 
                       comparison.winner === 'B' ? scenarioB.scenarioId : 'tie',
        confidence: comparison.winnerConfidence,
        reason: comparison.recommendation
    };
}

/**
 * Generate comparison summary table data
 */
export function generateComparisonTable(scenarios: ScenarioResult[]): Array<{
    scenario: string;
    expectedReturn: string;
    volatility: string;
    sharpeRatio: string;
    maxDrawdown: string;
    probabilityOfLoss: string;
    overallRating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}> {
    const comparator = new ScenarioComparator();
    const profiles = comparator.generateRiskReturnProfiles(scenarios);
    
    return profiles.map(profile => {
        // Determine overall rating based on risk-adjusted score
        let overallRating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
        if (profile.riskAdjustedScore > 0.8) overallRating = 'Excellent';
        else if (profile.riskAdjustedScore > 0.6) overallRating = 'Good';
        else if (profile.riskAdjustedScore > 0.4) overallRating = 'Fair';
        else overallRating = 'Poor';

        return {
            scenario: profile.scenario,
            expectedReturn: `${(profile.expectedReturn * 100).toFixed(1)}%`,
            volatility: `${(profile.volatility * 100).toFixed(1)}%`,
            sharpeRatio: profile.sharpeRatio.toFixed(2),
            maxDrawdown: `${(profile.maxDrawdown * 100).toFixed(1)}%`,
            probabilityOfLoss: `${(profile.probabilityOfLoss * 100).toFixed(1)}%`,
            overallRating
        };
    });
} 