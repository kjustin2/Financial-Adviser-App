import { MonteCarloEngine } from './MonteCarloEngine.js';
import { SimulationConfig, InvestmentScenario } from '../types.js';

/**
 * Simple test to validate Monte Carlo Engine functionality
 */
async function testMonteCarloEngine() {
    console.log('🧪 Testing Monte Carlo Engine...\n');

    // Test configuration
    const config: SimulationConfig = {
        iterations: 5000,
        seed: 12345,
        onProgress: (progress: number) => {
            if (progress % 0.2 === 0) { // Log every 20%
                console.log(`Progress: ${Math.round(progress * 100)}%`);
            }
        }
    };

    // Test investment scenario
    const scenario: InvestmentScenario = {
        initialValue: 100000, // $100k initial investment
        expectedReturn: 0.07, // 7% expected annual return
        volatility: 0.15, // 15% volatility
        timeHorizon: 30, // 30 years
        inflationRate: 0.025, // 2.5% inflation
        targetValue: 500000, // Target $500k
        marketShocks: [
            {
                probability: 0.05, // 5% chance per year
                impact: -0.30 // 30% market crash
            }
        ]
    };

    try {
        const engine = new MonteCarloEngine(config);
        
        // Test random number generator validation
        console.log('🎲 Testing Random Number Generator...');
        const rngTest = engine.validateRandomGenerator(1000);
        console.log(`Chi-square test: ${rngTest.chiSquare.toFixed(4)}`);
        console.log(`P-value: ${rngTest.pValue.toFixed(4)}`);
        console.log(`RNG Valid: ${rngTest.isValid ? '✅' : '❌'}\n`);

        // Run simulation
        console.log('⚡ Running Monte Carlo Simulation...');
        const startTime = Date.now();
        const result = await engine.runSimulation(scenario);
        const endTime = Date.now();

        // Display results
        console.log('\n📊 Simulation Results:');
        console.log(`Iterations: ${result.iterations.toLocaleString()}`);
        console.log(`Execution Time: ${result.executionTime.toFixed(2)}ms`);
        console.log(`Real Time: ${endTime - startTime}ms\n`);

        console.log('📈 Statistical Analysis:');
        console.log(`Mean Final Value: $${result.statistics.mean.toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
        console.log(`Median Final Value: $${result.statistics.median.toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
        console.log(`Standard Deviation: $${result.statistics.standardDeviation.toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
        console.log(`Minimum: $${result.statistics.minimum.toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
        console.log(`Maximum: $${result.statistics.maximum.toLocaleString('en-US', { maximumFractionDigits: 0 })}\n`);

        console.log('🎯 Goal Success Analysis:');
        console.log(`Target Value: $${scenario.targetValue.toLocaleString('en-US')}`);
        console.log(`Success Probability: ${(result.goalSuccessProbability * 100).toFixed(1)}%\n`);

        console.log('📊 Percentile Analysis:');
        console.log(`5th Percentile: $${result.statistics.percentiles.p5.toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
        console.log(`25th Percentile: $${result.statistics.percentiles.p25.toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
        console.log(`75th Percentile: $${result.statistics.percentiles.p75.toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
        console.log(`95th Percentile: $${result.statistics.percentiles.p95.toLocaleString('en-US', { maximumFractionDigits: 0 })}\n`);

        console.log('✅ Monte Carlo Engine Test Completed Successfully!');
        
        return result;

    } catch (error) {
        console.error('❌ Monte Carlo Engine Test Failed:', error);
        throw error;
    }
}

// Run test if this file is executed directly
if (typeof window === 'undefined') {
    testMonteCarloEngine().catch(console.error);
}

export { testMonteCarloEngine }; 