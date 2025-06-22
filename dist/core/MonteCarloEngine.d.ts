import { SimulationConfig, SimulationResult, InvestmentScenario } from '../types';
/**
 * High-quality Mersenne Twister-based Pseudo-Random Number Generator
 * Used for Monte Carlo simulations requiring statistical quality
 */
export declare class MersenneTwister {
    private mt;
    private index;
    constructor(seed?: number);
    private seed;
    private generate;
    /**
     * Generate a random number between 0 and 1
     */
    random(): number;
    /**
     * Generate normal distribution using Box-Muller transform
     */
    normalRandom(mean?: number, stdDev?: number): number;
}
/**
 * Monte Carlo Simulation Engine for Financial Analytics
 * Implements advanced financial modeling with 10,000+ iteration capability
 */
export declare class MonteCarloEngine {
    private rng;
    private config;
    constructor(config: SimulationConfig);
    /**
     * Run Monte Carlo simulation for investment scenarios
     */
    runSimulation(scenario: InvestmentScenario): Promise<SimulationResult>;
    /**
     * Simulate a single investment return based on scenario parameters
     */
    private simulateInvestmentReturn;
    /**
     * Calculate comprehensive statistical analysis
     */
    private calculateStatistics;
    /**
     * Calculate goal success probability
     */
    private calculateGoalSuccessProbability;
    /**
     * Calculate confidence intervals
     */
    private calculateConfidenceIntervals;
    /**
     * Calculate skewness (asymmetry measure)
     */
    private calculateSkewness;
    /**
     * Calculate kurtosis (tail heaviness measure)
     */
    private calculateKurtosis;
    /**
     * Validate random number generator quality
     */
    validateRandomGenerator(sampleSize?: number): {
        chiSquare: number;
        pValue: number;
        isValid: boolean;
    };
    private calculateChiSquarePValue;
}
//# sourceMappingURL=MonteCarloEngine.d.ts.map