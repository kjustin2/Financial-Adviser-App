import { VolatilityEngine, runVolatilityAnalysis } from '../core/VolatilityEngine';
import { MonteCarloEngine } from '../core/MonteCarloEngine';
import { getBaselineScenario, getStressTestScenarios } from '../data/economicScenarios';
import { SimulationResult, EconomicScenario, InvestmentScenario, SimulationConfig } from '../types';

/**
 * Test suite for VolatilityEngine functionality
 */

// Helper function to create test simulation data
async function createTestSimulationResults(): Promise<{ scenarios: EconomicScenario[], results: SimulationResult[] }> {
    const scenarios = [
        getBaselineScenario(),
        ...getStressTestScenarios().slice(0, 2) // Get first 2 stress test scenarios
    ];
    
    const baseInvestment: InvestmentScenario = {
        initialValue: 100000,
        expectedReturn: 0.08,
        volatility: 0.16,
        timeHorizon: 30,
        inflationRate: 0.025,
        targetValue: 500000
    };
    
    const config: SimulationConfig = {
        iterations: 1000,
        seed: 12345
    };
    
    const results: SimulationResult[] = [];
    
    for (const scenario of scenarios) {
        // Convert economic scenario to investment scenario
        const investmentScenario: InvestmentScenario = {
            ...baseInvestment,
            expectedReturn: scenario.parameters.marketReturn.mean,
            volatility: scenario.parameters.marketReturn.volatility,
            inflationRate: scenario.parameters.inflationRate.mean,
            marketShocks: scenario.parameters.marketShocks
        };
        
        const engine = new MonteCarloEngine(config);
        const result = await engine.runSimulation(investmentScenario);
        results.push(result);
    }
    
    return { scenarios, results };
}

// Test basic volatility metrics calculation
async function testVolatilityMetricsCalculation(): Promise<boolean> {
    console.log('Testing volatility metrics calculation...');
    
    try {
        const { results } = await createTestSimulationResults();
        const volatilityEngine = new VolatilityEngine();
        
        // Test metrics calculation for baseline scenario
        const baselineResult = results[0];
        const metrics = volatilityEngine.calculateVolatilityMetrics(baselineResult);
        
        // Validate metrics structure
        const hasBasicMetrics = metrics.basic && 
            typeof metrics.basic.historicalVolatility === 'number' &&
            typeof metrics.basic.realizedVolatility === 'number' &&
            typeof metrics.basic.impliedVolatility === 'number';
        
        const hasAdvancedMetrics = metrics.advanced &&
            typeof metrics.advanced.volatilityOfVolatility === 'number' &&
            typeof metrics.advanced.volatilityClustering === 'number' &&
            typeof metrics.advanced.downSideVolatility === 'number' &&
            typeof metrics.advanced.upSideVolatility === 'number';
        
        const hasTimeBasedMetrics = metrics.timeBased &&
            typeof metrics.timeBased.intraday === 'number' &&
            typeof metrics.timeBased.monthly === 'number' &&
            typeof metrics.timeBased.quarterly === 'number' &&
            typeof metrics.timeBased.annual === 'number';
        
        const hasRiskMetrics = metrics.riskMetrics &&
            typeof metrics.riskMetrics.volatilitySkew === 'number' &&
            typeof metrics.riskMetrics.volatilityKurtosis === 'number' &&
            typeof metrics.riskMetrics.correlationBreakdown === 'number';
        
        const testPassed = hasBasicMetrics && hasAdvancedMetrics && hasTimeBasedMetrics && hasRiskMetrics;
        
        console.log(`✓ Volatility metrics calculation: ${testPassed ? 'PASSED' : 'FAILED'}`);
        console.log(`  - Historical Volatility: ${metrics.basic.historicalVolatility.toFixed(4)}`);
        console.log(`  - Realized Volatility: ${metrics.basic.realizedVolatility.toFixed(4)}`);
        console.log(`  - Volatility of Volatility: ${metrics.advanced.volatilityOfVolatility.toFixed(4)}`);
        console.log(`  - Volatility Clustering: ${metrics.advanced.volatilityClustering.toFixed(4)}`);
        
        return testPassed;
    } catch (error) {
        console.error('✗ Volatility metrics calculation: FAILED', error);
        return false;
    }
}

// Test scenario volatility analysis
async function testScenarioVolatilityAnalysis(): Promise<boolean> {
    console.log('Testing scenario volatility analysis...');
    
    try {
        const { scenarios, results } = await createTestSimulationResults();
        const analysis = await runVolatilityAnalysis(scenarios, results);
        
        // Validate analysis structure
        const hasScenarios = Array.isArray(analysis.scenarios) && analysis.scenarios.length === scenarios.length;
        const hasComparison = analysis.comparison && 
            typeof analysis.comparison.highestVolatilityScenario === 'string' &&
            typeof analysis.comparison.lowestVolatilityScenario === 'string';
        const hasRegimeAnalysis = analysis.regimeAnalysis &&
            Array.isArray(analysis.regimeAnalysis.lowVolatility.scenarios) &&
            Array.isArray(analysis.regimeAnalysis.mediumVolatility.scenarios) &&
            Array.isArray(analysis.regimeAnalysis.highVolatility.scenarios);
        const hasMarketShockAnalysis = analysis.marketShockAnalysis &&
            Array.isArray(analysis.marketShockAnalysis.scenarios);
        
        const testPassed = hasScenarios && hasComparison && hasRegimeAnalysis && hasMarketShockAnalysis;
        
        console.log(`✓ Scenario volatility analysis: ${testPassed ? 'PASSED' : 'FAILED'}`);
        console.log(`  - Scenarios analyzed: ${analysis.scenarios.length}`);
        console.log(`  - Highest volatility scenario: ${analysis.comparison.highestVolatilityScenario}`);
        console.log(`  - Lowest volatility scenario: ${analysis.comparison.lowestVolatilityScenario}`);
        console.log(`  - High volatility scenarios: ${analysis.regimeAnalysis.highVolatility.scenarios.length}`);
        
        return testPassed;
    } catch (error) {
        console.error('✗ Scenario volatility analysis: FAILED', error);
        return false;
    }
}

// Test volatility regime classification
async function testVolatilityRegimeClassification(): Promise<boolean> {
    console.log('Testing volatility regime classification...');
    
    try {
        const { scenarios, results } = await createTestSimulationResults();
        const volatilityEngine = new VolatilityEngine();
        const analysis = await volatilityEngine.analyzeScenarioVolatility(scenarios, results);
        
        // Check that scenarios are properly classified into volatility regimes
        const totalScenarios = analysis.scenarios.length;
        const classifiedScenarios = 
            analysis.regimeAnalysis.lowVolatility.scenarios.length +
            analysis.regimeAnalysis.mediumVolatility.scenarios.length +
            analysis.regimeAnalysis.highVolatility.scenarios.length;
        
        const allScenariosClassified = totalScenarios === classifiedScenarios;
        
        // Validate thresholds make sense
        const lowThreshold = analysis.regimeAnalysis.lowVolatility.threshold;
        const highThreshold = analysis.regimeAnalysis.highVolatility.threshold;
        const thresholdsValid = lowThreshold < highThreshold && lowThreshold >= 0 && highThreshold > 0;
        
        const testPassed = allScenariosClassified && thresholdsValid;
        
        console.log(`✓ Volatility regime classification: ${testPassed ? 'PASSED' : 'FAILED'}`);
        console.log(`  - Total scenarios: ${totalScenarios}`);
        console.log(`  - Classified scenarios: ${classifiedScenarios}`);
        console.log(`  - Low volatility threshold: ${lowThreshold.toFixed(4)}`);
        console.log(`  - High volatility threshold: ${highThreshold.toFixed(4)}`);
        
        return testPassed;
    } catch (error) {
        console.error('✗ Volatility regime classification: FAILED', error);
        return false;
    }
}

// Test market shock volatility impact analysis
async function testMarketShockAnalysis(): Promise<boolean> {
    console.log('Testing market shock volatility impact analysis...');
    
    try {
        const { scenarios, results } = await createTestSimulationResults();
        const volatilityEngine = new VolatilityEngine();
        const analysis = await volatilityEngine.analyzeScenarioVolatility(scenarios, results);
        
        // Verify market shock analysis
        const shockAnalysis = analysis.marketShockAnalysis;
        const hasShockScenarios = Array.isArray(shockAnalysis.scenarios);
        const hasAverageIncrease = typeof shockAnalysis.averageVolatilityIncrease === 'number';
        
        // Check that scenarios with market shocks show volatility impact
        let hasValidShockAnalysis = true;
        for (const shockScenario of shockAnalysis.scenarios) {
            if (typeof shockScenario.scenarioId !== 'string' ||
                typeof shockScenario.shockCount !== 'number' ||
                typeof shockScenario.totalShockImpact !== 'number' ||
                typeof shockScenario.volatilityIncrease !== 'number') {
                hasValidShockAnalysis = false;
                break;
            }
        }
        
        const testPassed = hasShockScenarios && hasAverageIncrease && hasValidShockAnalysis;
        
        console.log(`✓ Market shock analysis: ${testPassed ? 'PASSED' : 'FAILED'}`);
        console.log(`  - Scenarios with shocks: ${shockAnalysis.scenarios.length}`);
        console.log(`  - Average volatility increase: ${(shockAnalysis.averageVolatilityIncrease * 100).toFixed(2)}%`);
        
        return testPassed;
    } catch (error) {
        console.error('✗ Market shock analysis: FAILED', error);
        return false;
    }
}

// Test stress test volatility metrics
async function testStressTestVolatilityMetrics(): Promise<boolean> {
    console.log('Testing stress test volatility metrics...');
    
    try {
        // Include specific stress scenarios for testing
        const stressScenarios = getStressTestScenarios();
        const normalScenario = getBaselineScenario();
        const testScenarios = [normalScenario, ...stressScenarios.slice(0, 2)];
        
        const results: SimulationResult[] = [];
        const config: SimulationConfig = { iterations: 1000, seed: 12345 };
        
        for (const scenario of testScenarios) {
            const investmentScenario: InvestmentScenario = {
                initialValue: 100000,
                expectedReturn: scenario.parameters.marketReturn.mean,
                volatility: scenario.parameters.marketReturn.volatility,
                timeHorizon: 30,
                inflationRate: scenario.parameters.inflationRate.mean,
                targetValue: 500000,
                marketShocks: scenario.parameters.marketShocks
            };
            
            const engine = new MonteCarloEngine(config);
            const result = await engine.runSimulation(investmentScenario);
            results.push(result);
        }
        
        const volatilityEngine = new VolatilityEngine();
        const analysis = await volatilityEngine.analyzeScenarioVolatility(testScenarios, results);
        
        // Validate stress test metrics
        const stressMetrics = analysis.stressTestMetrics;
        const hasValidMetrics = stressMetrics !== null &&
            typeof stressMetrics.stressVolatilityMean === 'number' &&
            typeof stressMetrics.normalVolatilityMean === 'number' &&
            typeof stressMetrics.volatilityMultiplier === 'number';
        
        // Stress scenarios should generally have higher volatility
        const stressHigherVolatility = stressMetrics !== null && 
            stressMetrics.volatilityMultiplier > 1.0;
        
        const testPassed = hasValidMetrics && stressHigherVolatility;
        
        console.log(`✓ Stress test volatility metrics: ${testPassed ? 'PASSED' : 'FAILED'}`);
        if (stressMetrics) {
            console.log(`  - Stress volatility mean: ${stressMetrics.stressVolatilityMean.toFixed(4)}`);
            console.log(`  - Normal volatility mean: ${stressMetrics.normalVolatilityMean.toFixed(4)}`);
            console.log(`  - Volatility multiplier: ${stressMetrics.volatilityMultiplier.toFixed(2)}x`);
        }
        
        return testPassed;
    } catch (error) {
        console.error('✗ Stress test volatility metrics: FAILED', error);
        return false;
    }
}

// Main test runner
export async function runVolatilityEngineTests(): Promise<void> {
    console.log('==========================================');
    console.log('         VOLATILITY ENGINE TESTS         ');
    console.log('==========================================');
    
    const tests = [
        testVolatilityMetricsCalculation,
        testScenarioVolatilityAnalysis,
        testVolatilityRegimeClassification,
        testMarketShockAnalysis,
        testStressTestVolatilityMetrics
    ];
    
    let passedTests = 0;
    const totalTests = tests.length;
    
    for (const test of tests) {
        try {
            const result = await test();
            if (result) passedTests++;
        } catch (error) {
            console.error(`Test failed with error:`, error);
        }
        console.log(''); // Add spacing between tests
    }
    
    console.log('==========================================');
    console.log(`         TEST RESULTS: ${passedTests}/${totalTests} PASSED         `);
    console.log('==========================================');
    
    if (passedTests === totalTests) {
        console.log('🎉 All volatility engine tests passed!');
    } else {
        console.log(`⚠️  ${totalTests - passedTests} test(s) failed. Please review the implementation.`);
    }
}

// Auto-run tests if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
    runVolatilityEngineTests().catch(console.error);
} 