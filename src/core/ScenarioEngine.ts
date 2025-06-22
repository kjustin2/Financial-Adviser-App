import { MonteCarloEngine } from './MonteCarloEngine';
import { 
    EconomicScenario, 
    InvestmentScenario, 
    SimulationConfig, 
    ScenarioResult, 
    ScenarioComparison,
    SimulationResult,
    // New time-based interfaces
    TimeBasedScenarioConfig,
    RegimeChange,
    ScenarioTransition,
    HistoricalParameterSnapshot,
    ScenarioEvolution,
    TimeBasedScenarioResult
} from '../types';
import { ECONOMIC_SCENARIOS, getBaselineScenario } from '../data/economicScenarios';
import { DynamicMarketDataService } from './DynamicMarketDataService';

/**
 * Economic Scenario Testing Engine
 * Integrates economic scenarios with Monte Carlo simulation for comprehensive risk analysis
 */
export class ScenarioEngine {
    private config: SimulationConfig;

    constructor(config: SimulationConfig) {
        this.config = config;
        // RNG available for future enhancements if needed
        // new MersenneTwister(config.seed);
    }

    /**
     * Convert economic scenario to investment scenario for Monte Carlo simulation
     */
    private convertToInvestmentScenario(
        economicScenario: EconomicScenario,
        baseInvestment: Partial<InvestmentScenario>
    ): InvestmentScenario {
        const params = economicScenario.parameters;
        
        return {
            initialValue: baseInvestment.initialValue || 100000,
            expectedReturn: params.marketReturn.mean,
            volatility: params.marketReturn.volatility,
            timeHorizon: baseInvestment.timeHorizon || 30,
            inflationRate: params.inflationRate.mean,
            targetValue: baseInvestment.targetValue || 500000,
            marketShocks: params.marketShocks
        };
    }

    /**
     * Run Monte Carlo simulation for a specific economic scenario
     */
    async runScenarioSimulation(
        economicScenario: EconomicScenario,
        baseInvestment: Partial<InvestmentScenario>
    ): Promise<ScenarioResult> {
        const investmentScenario = this.convertToInvestmentScenario(economicScenario, baseInvestment);
        
        const engine = new MonteCarloEngine(this.config);
        const simulationResult = await engine.runSimulation(investmentScenario);
        
        const riskMetrics = this.calculateRiskMetrics(simulationResult);
        const stressTestResults = this.calculateStressTestResults(simulationResult);
        
        // Calculate comparison to baseline if this isn't the baseline
        const baseline = getBaselineScenario();
        let comparisonToBaseline = {
            returnDifference: 0,
            riskDifference: 0,
            probabilityOutperformance: 0.5
        };
        
        if (economicScenario.id !== baseline.id) {
            const baselineInvestment = this.convertToInvestmentScenario(baseline, baseInvestment);
            const baselineEngine = new MonteCarloEngine(this.config);
            const baselineResult = await baselineEngine.runSimulation(baselineInvestment);
            
            comparisonToBaseline = this.compareToBaseline(simulationResult, baselineResult);
        }

        return {
            scenarioId: economicScenario.id,
            simulationResult,
            riskMetrics,
            stressTestResults,
            comparisonToBaseline
        };
    }

    /**
     * Run comprehensive scenario analysis across multiple scenarios
     */
    async runScenarioAnalysis(
        scenarios: EconomicScenario[],
        baseInvestment: Partial<InvestmentScenario>
    ): Promise<ScenarioComparison> {
        const results: ScenarioResult[] = [];
        
        // Run simulations for each scenario
        for (const scenario of scenarios) {
            const result = await this.runScenarioSimulation(scenario, baseInvestment);
            results.push(result);
            
            // Progress callback if available
            if (this.config.onProgress) {
                this.config.onProgress(results.length / scenarios.length);
            }
        }
        
        // Calculate rankings and comparisons
        const ranking = this.calculateRankings(results);
        const correlationMatrix = this.calculateCorrelationMatrix(results);
        const diversificationBenefit = this.calculateDiversificationBenefit(results);
        const recommendation = this.generateRecommendations(results);
        
        return {
            scenarios: results,
            ranking,
            correlationMatrix,
            diversificationBenefit,
            recommendation
        };
    }

    /**
     * Calculate comprehensive risk metrics for simulation results
     */
    private calculateRiskMetrics(result: SimulationResult): ScenarioResult['riskMetrics'] {
        const returns = result.results.map(value => 
            (value - result.scenario.initialValue) / result.scenario.initialValue
        );
        const sortedReturns = [...returns].sort((a, b) => a - b);
        
        // Value at Risk (VaR) at 95% confidence level
        const varIndex = Math.floor(0.05 * returns.length);
        const valueAtRisk = sortedReturns[varIndex];
        
        // Conditional VaR (Expected Shortfall)
        const conditionalVaR = sortedReturns.slice(0, varIndex + 1)
            .reduce((sum, ret) => sum + ret, 0) / (varIndex + 1);
        
        // Maximum Drawdown
        let maxDrawdown = 0;
        let peak = result.results[0];
        for (const value of result.results) {
            if (value > peak) peak = value;
            const drawdown = (peak - value) / peak;
            maxDrawdown = Math.max(maxDrawdown, drawdown);
        }
        
        // Risk-adjusted returns
        const meanReturn = result.statistics.mean / result.scenario.initialValue - 1;
        const volatility = result.statistics.standardDeviation / result.scenario.initialValue;
        const sharpeRatio = meanReturn / volatility; // Simplified, assuming risk-free rate = 0
        
        // Sortino Ratio (downside deviation)
        const downsideReturns = returns.filter(ret => ret < 0);
        const downsideDeviation = downsideReturns.length > 0 ? 
            Math.sqrt(downsideReturns.reduce((sum, ret) => sum + ret * ret, 0) / downsideReturns.length) : 0;
        const sortinoRatio = downsideDeviation > 0 ? meanReturn / downsideDeviation : Infinity;
        
        return {
            valueAtRisk,
            conditionalVaR,
            maxDrawdown,
            sharpeRatio,
            sortinoRatio,
            volatility
        };
    }

    /**
     * Calculate stress test results
     */
    private calculateStressTestResults(result: SimulationResult): ScenarioResult['stressTestResults'] {
        const sortedResults = [...result.results].sort((a, b) => a - b);
        
        return {
            worstCase: sortedResults[0],
            bestCase: sortedResults[sortedResults.length - 1],
            medianCase: result.statistics.median,
            probabilityOfLoss: result.results.filter(value => value < result.scenario.initialValue).length / result.results.length
        };
    }

    /**
     * Compare scenario results to baseline
     */
    private compareToBaseline(
        scenarioResult: SimulationResult, 
        baselineResult: SimulationResult
    ): ScenarioResult['comparisonToBaseline'] {
        const scenarioMean = scenarioResult.statistics.mean;
        const baselineMean = baselineResult.statistics.mean;
        const scenarioVol = scenarioResult.statistics.standardDeviation;
        const baselineVol = baselineResult.statistics.standardDeviation;
        
        // Count how many scenario outcomes beat baseline outcomes
        let outperformanceCount = 0;
        for (let i = 0; i < scenarioResult.results.length; i++) {
            if (scenarioResult.results[i] > baselineResult.results[i]) {
                outperformanceCount++;
            }
        }
        
        return {
            returnDifference: (scenarioMean - baselineMean) / baselineMean,
            riskDifference: (scenarioVol - baselineVol) / baselineVol,
            probabilityOutperformance: outperformanceCount / scenarioResult.results.length
        };
    }

    /**
     * Calculate scenario rankings by different metrics
     */
    private calculateRankings(results: ScenarioResult[]): ScenarioComparison['ranking'] {
        const byReturn = [...results]
            .sort((a, b) => b.simulationResult.statistics.mean - a.simulationResult.statistics.mean)
            .map(r => r.scenarioId);
        
        const byRisk = [...results]
            .sort((a, b) => a.riskMetrics.volatility - b.riskMetrics.volatility)
            .map(r => r.scenarioId);
        
        const byRiskAdjustedReturn = [...results]
            .sort((a, b) => b.riskMetrics.sharpeRatio - a.riskMetrics.sharpeRatio)
            .map(r => r.scenarioId);
        
        return {
            byReturn,
            byRisk,
            byRiskAdjustedReturn
        };
    }

    /**
     * Calculate correlation matrix between scenario returns
     */
    private calculateCorrelationMatrix(results: ScenarioResult[]): number[][] {
        const n = results.length;
        const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i === j) {
                    matrix[i][j] = 1.0;
                } else {
                    const correlation = this.calculateCorrelation(
                        results[i].simulationResult.results,
                        results[j].simulationResult.results
                    );
                    matrix[i][j] = correlation;
                }
            }
        }
        
        return matrix;
    }

    /**
     * Calculate correlation between two return series
     */
    private calculateCorrelation(series1: number[], series2: number[]): number {
        const n = series1.length;
        const mean1 = series1.reduce((sum, val) => sum + val, 0) / n;
        const mean2 = series2.reduce((sum, val) => sum + val, 0) / n;
        
        let numerator = 0;
        let sumSq1 = 0;
        let sumSq2 = 0;
        
        for (let i = 0; i < n; i++) {
            const diff1 = series1[i] - mean1;
            const diff2 = series2[i] - mean2;
            
            numerator += diff1 * diff2;
            sumSq1 += diff1 * diff1;
            sumSq2 += diff2 * diff2;
        }
        
        const denominator = Math.sqrt(sumSq1 * sumSq2);
        return denominator === 0 ? 0 : numerator / denominator;
    }

    /**
     * Calculate diversification benefit
     */
    private calculateDiversificationBenefit(results: ScenarioResult[]): number {
        // Simplified calculation: reduction in portfolio volatility vs. average individual volatility
        const individualVolatilities = results.map(r => r.riskMetrics.volatility);
        const avgIndividualVol = individualVolatilities.reduce((sum, vol) => sum + vol, 0) / results.length;
        
        // Assume equal weighting for portfolio volatility calculation
        const weight = 1 / results.length;
        let portfolioVariance = 0;
        
        // Portfolio variance = sum of weighted variances + sum of weighted covariances
        for (let i = 0; i < results.length; i++) {
            portfolioVariance += weight * weight * Math.pow(results[i].riskMetrics.volatility, 2);
            
            for (let j = 0; j < results.length; j++) {
                if (i !== j) {
                    const correlation = this.calculateCorrelation(
                        results[i].simulationResult.results,
                        results[j].simulationResult.results
                    );
                    portfolioVariance += weight * weight * 
                        results[i].riskMetrics.volatility * results[j].riskMetrics.volatility * correlation;
                }
            }
        }
        
        const portfolioVolatility = Math.sqrt(portfolioVariance);
        return (avgIndividualVol - portfolioVolatility) / avgIndividualVol;
    }

    /**
     * Generate investment recommendations based on scenario analysis
     */
    private generateRecommendations(results: ScenarioResult[]): ScenarioComparison['recommendation'] {
        // Conservative: Lowest risk (volatility)
        const conservative = results.reduce((min, current) => 
            current.riskMetrics.volatility < min.riskMetrics.volatility ? current : min
        ).scenarioId;
        
        // Moderate: Best risk-adjusted return (Sharpe ratio)
        const moderate = results.reduce((max, current) => 
            current.riskMetrics.sharpeRatio > max.riskMetrics.sharpeRatio ? current : max
        ).scenarioId;
        
        // Aggressive: Highest return potential
        const aggressive = results.reduce((max, current) => 
            current.simulationResult.statistics.mean > max.simulationResult.statistics.mean ? current : max
        ).scenarioId;
        
        return {
            conservative,
            moderate,
            aggressive
        };
    }
}

/**
 * Utility function to run scenario analysis with predefined scenarios
 */
export async function runPredefinedScenarioAnalysis(
    baseInvestment: Partial<InvestmentScenario>,
    config: SimulationConfig = { iterations: 10000 }
): Promise<ScenarioComparison> {
    const engine = new ScenarioEngine(config);
    return engine.runScenarioAnalysis(ECONOMIC_SCENARIOS, baseInvestment);
}

/**
 * Utility function to run stress test with worst-case scenarios
 */
export async function runStressTest(
    baseInvestment: Partial<InvestmentScenario>,
    config: SimulationConfig = { iterations: 10000 }
): Promise<ScenarioComparison> {
    const stressScenarios = ECONOMIC_SCENARIOS.filter(scenario => 
        scenario.category === 'recession' || scenario.category === 'market-crash'
    );
    
    const engine = new ScenarioEngine(config);
    return engine.runScenarioAnalysis(stressScenarios, baseInvestment);
}

/**
 * Time-Based Scenario Engine
 * Extends ScenarioEngine with dynamic parameter updates and regime changes
 */
export class TimeBasedScenarioEngine extends ScenarioEngine {
    private timeBasedConfig: TimeBasedScenarioConfig;
    private marketDataService?: DynamicMarketDataService;
    private scenarioEvolution: ScenarioEvolution;
    private updateInterval?: NodeJS.Timeout;
    private subscribers: Array<(evolution: ScenarioEvolution) => void> = [];

    constructor(
        config: SimulationConfig,
        timeBasedConfig: TimeBasedScenarioConfig,
        initialScenario: EconomicScenario = getBaselineScenario(),
        marketDataService?: DynamicMarketDataService
    ) {
        super(config);
        this.timeBasedConfig = timeBasedConfig;
        this.marketDataService = marketDataService;
        
        // Initialize scenario evolution
        this.scenarioEvolution = {
            currentScenario: initialScenario,
            currentParameters: { ...initialScenario.parameters },
            lastUpdate: new Date(),
            regimeAge: 0,
            historicalSnapshots: [],
            activeTransition: null,
            parameterTrends: []
        };

        // Create initial snapshot
        this.createHistoricalSnapshot();
    }

    /**
     * Start time-based parameter updates
     */
    public startTimeBasedUpdates(): void {
        if (this.updateInterval) {
            return; // Already running
        }

        const intervalMs = this.getUpdateIntervalMs();
        this.updateInterval = setInterval(() => {
            this.performTimeBasedUpdate();
        }, intervalMs);
    }

    /**
     * Stop time-based parameter updates
     */
    public stopTimeBasedUpdates(): void {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = undefined;
        }
    }

    /**
     * Perform a single time-based update
     */
    private performTimeBasedUpdate(): void {
        const now = new Date();
        const timeDelta = (now.getTime() - this.scenarioEvolution.lastUpdate.getTime()) / 
                         (365.25 * 24 * 60 * 60 * 1000); // Years

        // Update regime age
        this.scenarioEvolution.regimeAge += timeDelta;

        // Apply parameter drift if enabled
        if (this.timeBasedConfig.enableParameterDrift) {
            this.applyParameterDrift(timeDelta);
        }

        // Check for regime changes if enabled
        if (this.timeBasedConfig.enableRegimeChanges) {
            this.checkForRegimeChange();
        }

        // Update parameter trends
        this.updateParameterTrends();

        // Create new historical snapshot
        this.createHistoricalSnapshot();

        // Clean old snapshots based on historical window
        this.cleanHistoricalSnapshots();

        // Update last update time
        this.scenarioEvolution.lastUpdate = now;

        // Notify subscribers
        this.notifySubscribers();
    }

    /**
     * Apply parameter drift based on configuration
     */
    private applyParameterDrift(timeDelta: number): void {
        for (const drift of this.timeBasedConfig.parameterDrifts) {
            const currentValue = this.getParameterValue(drift.parameter);
            if (currentValue === undefined) continue;

            // Calculate drift amount
            const driftAmount = drift.driftRate * timeDelta;
            const volatilityNoise = (Math.random() - 0.5) * 2 * drift.volatility * Math.sqrt(timeDelta);
            
            let newValue = currentValue + driftAmount + volatilityNoise;

            // Apply mean reversion if enabled
            if (drift.meanReversion.enabled) {
                const meanReversionForce = drift.meanReversion.rate * 
                    (drift.meanReversion.target - currentValue) * timeDelta;
                newValue += meanReversionForce;
            }

            // Apply bounds
            newValue = Math.max(drift.bounds.min, Math.min(drift.bounds.max, newValue));

            // Update parameter
            this.setParameterValue(drift.parameter, newValue);
        }
    }

    /**
     * Check for potential regime changes
     */
    private checkForRegimeChange(): void {
        for (const rule of this.timeBasedConfig.regimeRules) {
            if (rule.fromScenario !== this.scenarioEvolution.currentScenario.id) {
                continue; // Rule doesn't apply to current scenario
            }

            if (this.shouldTriggerRegimeChange(rule)) {
                this.initiateRegimeChange(rule);
                break; // Only one regime change per update
            }
        }
    }

    /**
     * Determine if a regime change should be triggered
     */
    private shouldTriggerRegimeChange(rule: RegimeChange): boolean {
        const triggers = rule.triggers;

        // Check time threshold
        if (triggers.timeThreshold && this.scenarioEvolution.regimeAge < triggers.timeThreshold) {
            return false;
        }

        // Check parameter thresholds
        if (triggers.parameterThresholds) {
            for (const threshold of triggers.parameterThresholds) {
                const value = this.getParameterValue(threshold.parameter);
                if (value === undefined) continue;

                const condition = this.evaluateThreshold(value, threshold.threshold, threshold.comparison);
                if (!condition) return false;
            }
        }

        // Check market conditions
        if (triggers.marketConditions && this.marketDataService) {
            const currentData = this.marketDataService.getCurrentData();
            if (!triggers.marketConditions.includes(currentData.marketCondition)) {
                return false;
            }
        }

        // Check transition probability
        return Math.random() < rule.transitionProbability;
    }

    /**
     * Initiate a regime change
     */
    private initiateRegimeChange(rule: RegimeChange): void {
        const targetScenario = ECONOMIC_SCENARIOS.find(s => s.id === rule.toScenario);
        if (!targetScenario) return;

        const transition: ScenarioTransition = {
            id: `transition_${Date.now()}`,
            timestamp: new Date(),
            fromScenario: this.scenarioEvolution.currentScenario.id,
            toScenario: rule.toScenario,
            reason: this.generateTransitionReason(rule),
            transitionMethod: rule.transitionSpeed,
            completionProgress: 0,
            parametersSnapshot: { ...this.scenarioEvolution.currentParameters }
        };

        if (rule.transitionSpeed === 'immediate') {
            this.completeRegimeChange(targetScenario, transition);
        } else {
            this.scenarioEvolution.activeTransition = transition;
            // Gradual transition will be handled in subsequent updates
        }
    }

    /**
     * Complete a regime change
     */
    private completeRegimeChange(targetScenario: EconomicScenario, transition: ScenarioTransition): void {
        this.scenarioEvolution.currentScenario = targetScenario;
        this.scenarioEvolution.currentParameters = { ...targetScenario.parameters };
        this.scenarioEvolution.regimeAge = 0;
        this.scenarioEvolution.activeTransition = null;
        
        transition.completionProgress = 1;

        // Add to historical snapshots if it doesn't exist
        if (!this.scenarioEvolution.historicalSnapshots.some(s => 
            s.timestamp.getTime() === transition.timestamp.getTime())) {
            this.scenarioEvolution.historicalSnapshots.push({
                timestamp: transition.timestamp,
                scenarioId: targetScenario.id,
                parameters: { ...targetScenario.parameters },
                marketCondition: this.marketDataService?.getCurrentData().marketCondition || 'sideways',
                regimeAge: 0
            });
        }
    }

    /**
     * Update parameter trends analysis
     */
    private updateParameterTrends(): void {
        const windowSize = Math.min(this.timeBasedConfig.smoothingWindow, 
                                  this.scenarioEvolution.historicalSnapshots.length);
        
        if (windowSize < 2) return;

        const recentSnapshots = this.scenarioEvolution.historicalSnapshots.slice(-windowSize);
        const parameterNames = ['marketReturn.mean', 'inflationRate.mean', 'interestRates.federalFunds'];

        this.scenarioEvolution.parameterTrends = parameterNames.map(paramName => {
            const values = recentSnapshots.map(snapshot => this.getParameterFromSnapshot(snapshot, paramName));
            const trend = this.calculateTrend(values);
            
            return {
                parameter: paramName,
                trend: trend.direction,
                rate: trend.rate,
                confidence: trend.confidence
            };
        });
    }

    /**
     * Run enhanced simulation with time-based features
     */
    public async runTimeBasedScenarioSimulation(
        baseInvestment: Partial<InvestmentScenario>
    ): Promise<TimeBasedScenarioResult> {
        // Run base scenario simulation
        const baseResult = await this.runScenarioSimulation(
            this.scenarioEvolution.currentScenario, 
            baseInvestment
        );

        // Calculate time-based metrics
        const timeBasedMetrics = this.calculateTimeBasedMetrics();

        return {
            ...baseResult,
            timeBasedMetrics,
            evolutionHistory: [...this.scenarioEvolution.historicalSnapshots],
            transitionHistory: this.getTransitionHistory()
        };
    }

    /**
     * Subscribe to scenario evolution updates
     */
    public subscribeToEvolution(callback: (evolution: ScenarioEvolution) => void): () => void {
        this.subscribers.push(callback);
        return () => {
            const index = this.subscribers.indexOf(callback);
            if (index > -1) {
                this.subscribers.splice(index, 1);
            }
        };
    }

    /**
     * Get current scenario evolution state
     */
    public getScenarioEvolution(): ScenarioEvolution {
        return { ...this.scenarioEvolution };
    }

    // Helper methods

    private getUpdateIntervalMs(): number {
        const frequencies = {
            'daily': 24 * 60 * 60 * 1000,
            'weekly': 7 * 24 * 60 * 60 * 1000,
            'monthly': 30 * 24 * 60 * 60 * 1000,
            'quarterly': 90 * 24 * 60 * 60 * 1000
        };
        return frequencies[this.timeBasedConfig.updateFrequency];
    }

    private createHistoricalSnapshot(): void {
        const snapshot: HistoricalParameterSnapshot = {
            timestamp: new Date(),
            scenarioId: this.scenarioEvolution.currentScenario.id,
            parameters: { ...this.scenarioEvolution.currentParameters },
            marketCondition: this.marketDataService?.getCurrentData().marketCondition || 'sideways',
            regimeAge: this.scenarioEvolution.regimeAge
        };

        this.scenarioEvolution.historicalSnapshots.push(snapshot);
    }

    private cleanHistoricalSnapshots(): void {
        const cutoffDate = new Date();
        cutoffDate.setFullYear(cutoffDate.getFullYear() - this.timeBasedConfig.historicalContextWindow);

        this.scenarioEvolution.historicalSnapshots = this.scenarioEvolution.historicalSnapshots
            .filter(snapshot => snapshot.timestamp >= cutoffDate);
    }

    private notifySubscribers(): void {
        for (const callback of this.subscribers) {
            try {
                callback(this.scenarioEvolution);
            } catch (error) {
                console.error('Error notifying scenario evolution subscriber:', error);
            }
        }
    }

    private getParameterValue(parameterPath: string): number | undefined {
        const parts = parameterPath.split('.');
        let current: any = this.scenarioEvolution.currentParameters;
        
        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                return undefined;
            }
        }
        
        return typeof current === 'number' ? current : undefined;
    }

    private setParameterValue(parameterPath: string, value: number): void {
        const parts = parameterPath.split('.');
        let current: any = this.scenarioEvolution.currentParameters;
        
        for (let i = 0; i < parts.length - 1; i++) {
            if (current && typeof current === 'object' && parts[i] in current) {
                current = current[parts[i]];
            } else {
                return; // Invalid path
            }
        }
        
        const lastPart = parts[parts.length - 1];
        if (current && typeof current === 'object' && lastPart in current) {
            current[lastPart] = value;
        }
    }

    private evaluateThreshold(value: number, threshold: number, comparison: string): boolean {
        switch (comparison) {
            case 'greater': return value > threshold;
            case 'less': return value < threshold;
            case 'equal': return Math.abs(value - threshold) < 0.001;
            default: return false;
        }
    }

    private generateTransitionReason(rule: RegimeChange): string {
        return `Automatic regime change from ${rule.fromScenario} to ${rule.toScenario} triggered by configured rules`;
    }

    private getParameterFromSnapshot(snapshot: HistoricalParameterSnapshot, parameterPath: string): number {
        const parts = parameterPath.split('.');
        let current: any = snapshot.parameters;
        
        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                return 0;
            }
        }
        
        return typeof current === 'number' ? current : 0;
    }

    private calculateTrend(values: number[]): { direction: 'increasing' | 'decreasing' | 'stable', rate: number, confidence: number } {
        if (values.length < 2) {
            return { direction: 'stable', rate: 0, confidence: 0 };
        }

        // Simple linear regression
        const n = values.length;
        const sumX = (n * (n - 1)) / 2;
        const sumY = values.reduce((sum, val) => sum + val, 0);
        const sumXY = values.reduce((sum, val, index) => sum + val * index, 0);
        const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const r2 = Math.abs(slope) / (values[values.length - 1] || 1); // Rough confidence measure

        const direction = Math.abs(slope) < 0.001 ? 'stable' : 
                         slope > 0 ? 'increasing' : 'decreasing';

        return {
            direction,
            rate: Math.abs(slope),
            confidence: Math.min(1, r2)
        };
    }

    private calculateTimeBasedMetrics(): TimeBasedScenarioResult['timeBasedMetrics'] {
        const snapshots = this.scenarioEvolution.historicalSnapshots;
        
        // Calculate parameter stability
        const parameterStability = this.calculateParameterStability(snapshots);
        
        // Count regime changes
        const regimeChangeCount = this.countRegimeChanges(snapshots);
        
        // Calculate average regime duration
        const averageRegimeDuration = snapshots.length > 0 ? 
            this.scenarioEvolution.regimeAge / Math.max(1, regimeChangeCount) : 0;

        return {
            parameterStability,
            regimeChangeCount,
            averageRegimeDuration,
            parameterDriftImpact: this.calculateParameterDriftImpact(),
            adaptabilityScore: this.calculateAdaptabilityScore()
        };
    }

    private calculateParameterStability(snapshots: HistoricalParameterSnapshot[]): number {
        if (snapshots.length < 2) return 1;

        const parameterPaths = ['marketReturn.mean', 'inflationRate.mean'];
        let totalVariability = 0;

        for (const path of parameterPaths) {
            const values = snapshots.map(s => this.getParameterFromSnapshot(s, path));
            const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
            const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
            totalVariability += Math.sqrt(variance) / Math.abs(mean);
        }

        const averageVariability = totalVariability / parameterPaths.length;
        return Math.max(0, 1 - averageVariability);
    }

    private countRegimeChanges(snapshots: HistoricalParameterSnapshot[]): number {
        if (snapshots.length < 2) return 0;

        let changes = 0;
        for (let i = 1; i < snapshots.length; i++) {
            if (snapshots[i].scenarioId !== snapshots[i - 1].scenarioId) {
                changes++;
            }
        }
        return changes;
    }

    private calculateParameterDriftImpact(): number {
        // Simplified calculation - in practice, would run Monte Carlo with and without drift
        return this.scenarioEvolution.parameterTrends.reduce((sum, trend) => {
            return sum + Math.abs(trend.rate) * trend.confidence;
        }, 0) / Math.max(1, this.scenarioEvolution.parameterTrends.length);
    }

    private calculateAdaptabilityScore(): number {
        // Simple heuristic based on parameter trends and regime changes
        const trendScore = this.scenarioEvolution.parameterTrends.reduce((sum, trend) => {
            return sum + trend.confidence;
        }, 0) / Math.max(1, this.scenarioEvolution.parameterTrends.length);

        const regimeScore = this.scenarioEvolution.regimeAge > 0 ? 
            Math.min(1, this.scenarioEvolution.regimeAge / 2) : 0; // 2 years = full adaptability

        return (trendScore + regimeScore) / 2;
    }

    private getTransitionHistory(): ScenarioTransition[] {
        // Extract transitions from historical snapshots
        const transitions: ScenarioTransition[] = [];
        const snapshots = this.scenarioEvolution.historicalSnapshots;
        
        for (let i = 1; i < snapshots.length; i++) {
            if (snapshots[i].scenarioId !== snapshots[i - 1].scenarioId) {
                transitions.push({
                    id: `historical_${i}`,
                    timestamp: snapshots[i].timestamp,
                    fromScenario: snapshots[i - 1].scenarioId,
                    toScenario: snapshots[i].scenarioId,
                    reason: 'Historical regime change',
                    transitionMethod: 'immediate',
                    completionProgress: 1,
                    parametersSnapshot: snapshots[i].parameters
                });
            }
        }
        
        return transitions;
    }
} 