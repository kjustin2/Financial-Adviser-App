import { EconomicScenario, InvestmentScenario, SimulationConfig, ScenarioResult, ScenarioComparison, TimeBasedScenarioConfig, ScenarioEvolution, TimeBasedScenarioResult } from '../types';
import { DynamicMarketDataService } from './DynamicMarketDataService';
/**
 * Economic Scenario Testing Engine
 * Integrates economic scenarios with Monte Carlo simulation for comprehensive risk analysis
 */
export declare class ScenarioEngine {
    private config;
    constructor(config: SimulationConfig);
    /**
     * Convert economic scenario to investment scenario for Monte Carlo simulation
     */
    private convertToInvestmentScenario;
    /**
     * Run Monte Carlo simulation for a specific economic scenario
     */
    runScenarioSimulation(economicScenario: EconomicScenario, baseInvestment: Partial<InvestmentScenario>): Promise<ScenarioResult>;
    /**
     * Run comprehensive scenario analysis across multiple scenarios
     */
    runScenarioAnalysis(scenarios: EconomicScenario[], baseInvestment: Partial<InvestmentScenario>): Promise<ScenarioComparison>;
    /**
     * Calculate comprehensive risk metrics for simulation results
     */
    private calculateRiskMetrics;
    /**
     * Calculate stress test results
     */
    private calculateStressTestResults;
    /**
     * Compare scenario results to baseline
     */
    private compareToBaseline;
    /**
     * Calculate scenario rankings by different metrics
     */
    private calculateRankings;
    /**
     * Calculate correlation matrix between scenario returns
     */
    private calculateCorrelationMatrix;
    /**
     * Calculate correlation between two return series
     */
    private calculateCorrelation;
    /**
     * Calculate diversification benefit
     */
    private calculateDiversificationBenefit;
    /**
     * Generate investment recommendations based on scenario analysis
     */
    private generateRecommendations;
}
/**
 * Utility function to run scenario analysis with predefined scenarios
 */
export declare function runPredefinedScenarioAnalysis(baseInvestment: Partial<InvestmentScenario>, config?: SimulationConfig): Promise<ScenarioComparison>;
/**
 * Utility function to run stress test with worst-case scenarios
 */
export declare function runStressTest(baseInvestment: Partial<InvestmentScenario>, config?: SimulationConfig): Promise<ScenarioComparison>;
/**
 * Time-Based Scenario Engine
 * Extends ScenarioEngine with dynamic parameter updates and regime changes
 */
export declare class TimeBasedScenarioEngine extends ScenarioEngine {
    private timeBasedConfig;
    private marketDataService?;
    private scenarioEvolution;
    private updateInterval?;
    private subscribers;
    constructor(config: SimulationConfig, timeBasedConfig: TimeBasedScenarioConfig, initialScenario?: EconomicScenario, marketDataService?: DynamicMarketDataService);
    /**
     * Start time-based parameter updates
     */
    startTimeBasedUpdates(): void;
    /**
     * Stop time-based parameter updates
     */
    stopTimeBasedUpdates(): void;
    /**
     * Perform a single time-based update
     */
    private performTimeBasedUpdate;
    /**
     * Apply parameter drift based on configuration
     */
    private applyParameterDrift;
    /**
     * Check for potential regime changes
     */
    private checkForRegimeChange;
    /**
     * Determine if a regime change should be triggered
     */
    private shouldTriggerRegimeChange;
    /**
     * Initiate a regime change
     */
    private initiateRegimeChange;
    /**
     * Complete a regime change
     */
    private completeRegimeChange;
    /**
     * Update parameter trends analysis
     */
    private updateParameterTrends;
    /**
     * Run enhanced simulation with time-based features
     */
    runTimeBasedScenarioSimulation(baseInvestment: Partial<InvestmentScenario>): Promise<TimeBasedScenarioResult>;
    /**
     * Subscribe to scenario evolution updates
     */
    subscribeToEvolution(callback: (evolution: ScenarioEvolution) => void): () => void;
    /**
     * Get current scenario evolution state
     */
    getScenarioEvolution(): ScenarioEvolution;
    private getUpdateIntervalMs;
    private createHistoricalSnapshot;
    private cleanHistoricalSnapshots;
    private notifySubscribers;
    private getParameterValue;
    private setParameterValue;
    private evaluateThreshold;
    private generateTransitionReason;
    private getParameterFromSnapshot;
    private calculateTrend;
    private calculateTimeBasedMetrics;
    private calculateParameterStability;
    private countRegimeChanges;
    private calculateParameterDriftImpact;
    private calculateAdaptabilityScore;
    private getTransitionHistory;
}
//# sourceMappingURL=ScenarioEngine.d.ts.map