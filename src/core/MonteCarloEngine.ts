import { SimulationConfig, SimulationResult, InvestmentScenario, SimulationStats } from '../types';

/**
 * High-quality Mersenne Twister-based Pseudo-Random Number Generator
 * Used for Monte Carlo simulations requiring statistical quality
 */
export class MersenneTwister {
    private mt: number[] = new Array(624);
    private index: number = 0;

    constructor(seed?: number) {
        this.seed(seed || Date.now());
    }

    private seed(seed: number): void {
        this.mt[0] = seed >>> 0;
        for (let i = 1; i < 624; i++) {
            this.mt[i] = (0x6c078965 * (this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)) + i) >>> 0;
        }
        this.index = 0;
    }

    private generate(): void {
        for (let i = 0; i < 624; i++) {
            const y = (this.mt[i] & 0x80000000) + (this.mt[(i + 1) % 624] & 0x7fffffff);
            this.mt[i] = this.mt[(i + 397) % 624] ^ (y >>> 1);
            if (y % 2 !== 0) {
                this.mt[i] = this.mt[i] ^ 0x9908b0df;
            }
        }
        this.index = 0;
    }

    /**
     * Generate a random number between 0 and 1
     */
    random(): number {
        if (this.index >= 624) {
            this.generate();
        }

        let y = this.mt[this.index++];
        y = y ^ (y >>> 11);
        y = y ^ ((y << 7) & 0x9d2c5680);
        y = y ^ ((y << 15) & 0xefc60000);
        y = y ^ (y >>> 18);

        return (y >>> 0) / 0x100000000;
    }

    /**
     * Generate normal distribution using Box-Muller transform
     */
    normalRandom(mean: number = 0, stdDev: number = 1): number {
        // Box-Muller transform
        const u1 = this.random();
        const u2 = this.random();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        return z0 * stdDev + mean;
    }
}

/**
 * Monte Carlo Simulation Engine for Financial Analytics
 * Implements advanced financial modeling with 10,000+ iteration capability
 */
export class MonteCarloEngine {
    private rng: MersenneTwister;
    private config: SimulationConfig;

    constructor(config: SimulationConfig) {
        this.config = config;
        this.rng = new MersenneTwister(config.seed);
    }

    /**
     * Run Monte Carlo simulation for investment scenarios
     */
    async runSimulation(scenario: InvestmentScenario): Promise<SimulationResult> {
        const startTime = performance.now();
        const iterations = this.config.iterations || 10000;
        const results: number[] = [];

        try {
            // Pre-allocate arrays for performance
            results.length = iterations;

            for (let i = 0; i < iterations; i++) {
                const simulatedReturn = this.simulateInvestmentReturn(scenario);
                results[i] = simulatedReturn;

                // Progress callback every 1000 iterations
                if (this.config.onProgress && i % 1000 === 0) {
                    this.config.onProgress(i / iterations);
                }
            }

            const endTime = performance.now();
            const executionTime = endTime - startTime;

            // Calculate comprehensive statistics
            const stats = this.calculateStatistics(results);
            const goalSuccessProbability = this.calculateGoalSuccessProbability(results, scenario.targetValue);

            return {
                scenario,
                iterations,
                executionTime,
                results,
                statistics: stats,
                goalSuccessProbability,
                confidenceIntervals: this.calculateConfidenceIntervals(results),
                metadata: {
                    seed: this.config.seed,
                    timestamp: new Date().toISOString(),
                    engineVersion: "1.0.0"
                }
            };

        } catch (error) {
            throw new Error(`Monte Carlo simulation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Simulate a single investment return based on scenario parameters
     */
    private simulateInvestmentReturn(scenario: InvestmentScenario): number {
        const {
            initialValue,
            expectedReturn,
            volatility,
            timeHorizon,
            inflationRate = 0.025,
            marketShocks = []
        } = scenario;

        let currentValue = initialValue;

        // Simulate year-by-year growth
        for (let year = 0; year < timeHorizon; year++) {
            // Base return with normal distribution
            const randomReturn = this.rng.normalRandom(expectedReturn, volatility);
            
            // Apply inflation adjustment
            const inflationAdjustedReturn = randomReturn - inflationRate;
            
            // Apply market shocks if any occur this year
            let shockMultiplier = 1.0;
            for (const shock of marketShocks) {
                if (this.rng.random() < shock.probability) {
                    shockMultiplier *= (1 + shock.impact);
                }
            }

            // Calculate final return for this period
            const finalReturn = inflationAdjustedReturn * shockMultiplier;
            currentValue *= (1 + finalReturn);
        }

        return currentValue;
    }

    /**
     * Calculate comprehensive statistical analysis
     */
    private calculateStatistics(results: number[]): SimulationStats {
        const sorted = [...results].sort((a, b) => a - b);
        const mean = results.reduce((sum, val) => sum + val, 0) / results.length;
        
        // Calculate variance and standard deviation
        const variance = results.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (results.length - 1);
        const standardDeviation = Math.sqrt(variance);

        // Percentiles
        const getPercentile = (p: number) => {
            const index = Math.ceil((p / 100) * results.length) - 1;
            return sorted[Math.max(0, Math.min(index, results.length - 1))];
        };

        return {
            mean,
            median: getPercentile(50),
            standardDeviation,
            variance,
            minimum: sorted[0],
            maximum: sorted[sorted.length - 1],
            skewness: this.calculateSkewness(results, mean, standardDeviation),
            kurtosis: this.calculateKurtosis(results, mean, standardDeviation),
            percentiles: {
                p5: getPercentile(5),
                p10: getPercentile(10),
                p25: getPercentile(25),
                p75: getPercentile(75),
                p90: getPercentile(90),
                p95: getPercentile(95)
            }
        };
    }

    /**
     * Calculate goal success probability
     */
    private calculateGoalSuccessProbability(results: number[], targetValue: number): number {
        const successfulOutcomes = results.filter(result => result >= targetValue).length;
        return successfulOutcomes / results.length;
    }

    /**
     * Calculate confidence intervals
     */
    private calculateConfidenceIntervals(results: number[]): { level: number; lower: number; upper: number }[] {
        const sorted = [...results].sort((a, b) => a - b);
        const n = results.length;

        const intervals = [90, 95, 99];
        
        return intervals.map(level => {
            const alpha = (100 - level) / 100;
            const lowerIndex = Math.floor((alpha / 2) * n);
            const upperIndex = Math.floor((1 - alpha / 2) * n) - 1;
            
            return {
                level,
                lower: sorted[lowerIndex],
                upper: sorted[upperIndex]
            };
        });
    }

    /**
     * Calculate skewness (asymmetry measure)
     */
    private calculateSkewness(data: number[], mean: number, stdDev: number): number {
        const n = data.length;
        const sum = data.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 3), 0);
        return (n / ((n - 1) * (n - 2))) * sum;
    }

    /**
     * Calculate kurtosis (tail heaviness measure)
     */
    private calculateKurtosis(data: number[], mean: number, stdDev: number): number {
        const n = data.length;
        const sum = data.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 4), 0);
        return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum - 
               (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
    }

    /**
     * Validate random number generator quality
     */
    validateRandomGenerator(sampleSize: number = 10000): { 
        chiSquare: number; 
        pValue: number; 
        isValid: boolean 
    } {
        const samples = Array.from({ length: sampleSize }, () => this.rng.random());
        
        // Chi-square test for uniformity
        const bins = 10;
        const expected = sampleSize / bins;
        const observed = new Array(bins).fill(0);
        
        samples.forEach(sample => {
            const bin = Math.floor(sample * bins);
            observed[Math.min(bin, bins - 1)]++;
        });
        
        const chiSquare = observed.reduce((sum, obs) => 
            sum + Math.pow(obs - expected, 2) / expected, 0
        );
        
        // Approximate p-value for chi-square with 9 degrees of freedom
        const pValue = this.calculateChiSquarePValue(chiSquare, bins - 1);
        
        return {
            chiSquare,
            pValue,
            isValid: pValue > 0.05 // 95% confidence level
        };
    }

    private calculateChiSquarePValue(chiSquare: number, degreesOfFreedom: number): number {
        // Simplified approximation for demonstration
        // In production, use a proper statistical library
        
        // Critical values for different degrees of freedom at α=0.05
        const criticalValues: { [key: number]: number } = {
            9: 16.919,
            8: 15.507,
            10: 18.307
        };
        
        const critical = criticalValues[degreesOfFreedom] || 16.919; // Default to df=9
        return chiSquare < critical ? 0.95 : 0.01;
    }
} 