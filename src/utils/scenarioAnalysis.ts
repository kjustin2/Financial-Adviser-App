/**
 * Scenario Analysis and What-If Calculations
 * Advanced financial planning tools for stress testing and projections
 */

import { getExpectedReturn } from '../data/historicalRates';
import { calculateFutureValueWithContributions } from './calculations';

export interface ScenarioResult {
    scenario: string;
    finalWealth: number;
    monthlyIncome: number;
    probability: number;
    description: string;
}

export interface MonteCarloResult {
    scenarios: ScenarioResult[];
    percentiles: {
        p10: number;
        p25: number;
        p50: number;
        p75: number;
        p90: number;
    };
    successProbability: number;
    averageOutcome: number;
}

export interface StressTestResult {
    baseCase: number;
    recession: number;
    inflation: number;
    marketCrash: number;
    jobLoss: number;
    worstCase: number;
}

/**
 * Run Monte Carlo simulation for retirement planning
 */
export function runMonteCarloSimulation(
    currentAge: number,
    retirementAge: number,
    currentWealth: number,
    monthlyContribution: number,
    riskTolerance: 'conservative' | 'moderate' | 'aggressive',
    targetWealth: number,
    iterations: number = 1000
): MonteCarloResult {
    const years = retirementAge - currentAge;
    const scenarios: ScenarioResult[] = [];
    
    for (let i = 0; i < iterations; i++) {
        // Generate random market returns based on historical volatility
        const baseReturn = getExpectedReturn(riskTolerance, years);
        const volatility = getVolatility(riskTolerance);
        
        // Simulate annual returns with random variation
        let wealth = currentWealth;
        let totalContributions = 0;
        
        for (let year = 0; year < years; year++) {
            // Random return using normal distribution approximation
            const randomReturn = generateRandomReturn(baseReturn, volatility);
            
            // Apply return to current wealth
            wealth *= (1 + randomReturn);
            
            // Add annual contributions
            const annualContribution = monthlyContribution * 12;
            wealth += annualContribution;
            totalContributions += annualContribution;
        }
        
        // Calculate retirement income (4% withdrawal rule)
        const monthlyIncome = (wealth * 0.04) / 12;
        
        scenarios.push({
            scenario: `Simulation ${i + 1}`,
            finalWealth: wealth,
            monthlyIncome,
            probability: 1 / iterations,
            description: `Random market scenario with ${(baseReturn * 100).toFixed(1)}% average return`
        });
    }
    
    // Sort scenarios by final wealth
    scenarios.sort((a, b) => a.finalWealth - b.finalWealth);
    
    // Calculate percentiles
    const percentiles = {
        p10: scenarios[Math.floor(iterations * 0.1)].finalWealth,
        p25: scenarios[Math.floor(iterations * 0.25)].finalWealth,
        p50: scenarios[Math.floor(iterations * 0.5)].finalWealth,
        p75: scenarios[Math.floor(iterations * 0.75)].finalWealth,
        p90: scenarios[Math.floor(iterations * 0.9)].finalWealth
    };
    
    // Calculate success probability (meeting target)
    const successfulScenarios = scenarios.filter(s => s.finalWealth >= targetWealth).length;
    const successProbability = successfulScenarios / iterations;
    
    // Calculate average outcome
    const averageOutcome = scenarios.reduce((sum, s) => sum + s.finalWealth, 0) / iterations;
    
    return {
        scenarios: scenarios.slice(0, 10), // Return top 10 scenarios for display
        percentiles,
        successProbability,
        averageOutcome
    };
}

/**
 * Perform stress testing on financial plan
 */
export function performStressTest(
    currentAge: number,
    retirementAge: number,
    currentWealth: number,
    monthlyContribution: number,
    riskTolerance: 'conservative' | 'moderate' | 'aggressive'
): StressTestResult {
    const years = retirementAge - currentAge;
    const baseReturn = getExpectedReturn(riskTolerance, years);
    
    // Base case scenario
    const baseCase = calculateFutureValueWithContributions(
        currentWealth,
        monthlyContribution,
        baseReturn,
        years
    );
    
    // Recession scenario (2 years of -20% returns, then recovery)
    let recessionWealth = currentWealth;
    for (let year = 0; year < years; year++) {
        const returnRate = year < 2 ? -0.20 : baseReturn * 1.1; // Recovery boost
        recessionWealth *= (1 + returnRate);
        recessionWealth += monthlyContribution * 12;
    }
    
    // High inflation scenario (returns reduced by 2%)
    const inflationWealth = calculateFutureValueWithContributions(
        currentWealth,
        monthlyContribution,
        baseReturn - 0.02,
        years
    );
    
    // Market crash scenario (50% loss in year 5, then normal returns)
    let crashWealth = currentWealth;
    for (let year = 0; year < years; year++) {
        const returnRate = year === 4 ? -0.50 : baseReturn;
        crashWealth *= (1 + returnRate);
        crashWealth += monthlyContribution * 12;
    }
    
    // Job loss scenario (no contributions for 2 years)
    let jobLossWealth = currentWealth;
    for (let year = 0; year < years; year++) {
        jobLossWealth *= (1 + baseReturn);
        if (year >= 2) { // Resume contributions after 2 years
            jobLossWealth += monthlyContribution * 12;
        }
    }
    
    // Worst case scenario (combination of factors)
    let worstCaseWealth = currentWealth;
    for (let year = 0; year < years; year++) {
        let returnRate = baseReturn - 0.03; // Reduced returns
        if (year < 2) returnRate = -0.15; // Early recession
        if (year === 5) returnRate = -0.30; // Market crash
        
        worstCaseWealth *= (1 + returnRate);
        
        // Reduced contributions due to job instability
        const contributionFactor = year < 3 ? 0.5 : 0.8;
        worstCaseWealth += monthlyContribution * 12 * contributionFactor;
    }
    
    return {
        baseCase,
        recession: recessionWealth,
        inflation: inflationWealth,
        marketCrash: crashWealth,
        jobLoss: jobLossWealth,
        worstCase: worstCaseWealth
    };
}

/**
 * Calculate what-if scenarios for different contribution levels
 */
export function calculateContributionScenarios(
    currentAge: number,
    retirementAge: number,
    currentWealth: number,
    baseMonthlyContribution: number,
    riskTolerance: 'conservative' | 'moderate' | 'aggressive'
): { contribution: number; finalWealth: number; monthlyIncome: number }[] {
    const years = retirementAge - currentAge;
    const baseReturn = getExpectedReturn(riskTolerance, years);
    const scenarios = [];
    
    // Test different contribution levels
    const contributionMultipliers = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    
    for (const multiplier of contributionMultipliers) {
        const contribution = baseMonthlyContribution * multiplier;
        const finalWealth = calculateFutureValueWithContributions(
            currentWealth,
            contribution,
            baseReturn,
            years
        );
        const monthlyIncome = (finalWealth * 0.04) / 12;
        
        scenarios.push({
            contribution,
            finalWealth,
            monthlyIncome
        });
    }
    
    return scenarios;
}

/**
 * Calculate retirement age scenarios
 */
export function calculateRetirementAgeScenarios(
    currentAge: number,
    currentWealth: number,
    monthlyContribution: number,
    riskTolerance: 'conservative' | 'moderate' | 'aggressive',
    targetWealth: number
): { retirementAge: number; finalWealth: number; feasible: boolean }[] {
    const scenarios = [];
    const baseReturn = getExpectedReturn(riskTolerance, 30);
    
    // Test retirement ages from 55 to 70
    for (let retirementAge = 55; retirementAge <= 70; retirementAge += 5) {
        const years = retirementAge - currentAge;
        if (years <= 0) continue;
        
        const finalWealth = calculateFutureValueWithContributions(
            currentWealth,
            monthlyContribution,
            baseReturn,
            years
        );
        
        scenarios.push({
            retirementAge,
            finalWealth,
            feasible: finalWealth >= targetWealth
        });
    }
    
    return scenarios;
}

/**
 * Generate random return using normal distribution approximation
 */
function generateRandomReturn(expectedReturn: number, volatility: number): number {
    // Box-Muller transformation for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    
    return expectedReturn + (z * volatility);
}

/**
 * Get historical volatility based on risk tolerance
 */
function getVolatility(riskTolerance: 'conservative' | 'moderate' | 'aggressive'): number {
    const volatilities = {
        conservative: 0.08,  // 8% standard deviation
        moderate: 0.12,      // 12% standard deviation
        aggressive: 0.18     // 18% standard deviation
    };
    
    return volatilities[riskTolerance];
}

/**
 * Calculate goal achievement probability
 */
export function calculateGoalProbability(
    currentWealth: number,
    monthlyContribution: number,
    targetWealth: number,
    years: number,
    riskTolerance: 'conservative' | 'moderate' | 'aggressive'
): number {
    const expectedReturn = getExpectedReturn(riskTolerance, years);
    const projectedWealth = calculateFutureValueWithContributions(
        currentWealth,
        monthlyContribution,
        expectedReturn,
        years
    );
    
    // Simple probability calculation based on expected vs target
    const ratio = projectedWealth / targetWealth;
    
    if (ratio >= 1.5) return 0.95;      // Very high probability
    if (ratio >= 1.2) return 0.85;      // High probability
    if (ratio >= 1.0) return 0.70;      // Good probability
    if (ratio >= 0.8) return 0.50;      // Moderate probability
    if (ratio >= 0.6) return 0.30;      // Low probability
    return 0.15;                        // Very low probability
}

/**
 * Calculate emergency fund scenarios
 */
export function calculateEmergencyFundScenarios(
    monthlyExpenses: number,
    currentSavings: number,
    monthlySavings: number
): { months: number; timeToReach: number; adequacy: string }[] {
    const scenarios = [];
    const targetMonths = [3, 6, 9, 12];
    
    for (const months of targetMonths) {
        const targetAmount = monthlyExpenses * months;
        const shortfall = Math.max(0, targetAmount - currentSavings);
        const timeToReach = monthlySavings > 0 ? shortfall / monthlySavings : Infinity;
        
        let adequacy: string;
        if (months <= 3) adequacy = 'Minimum';
        else if (months <= 6) adequacy = 'Recommended';
        else if (months <= 9) adequacy = 'Strong';
        else adequacy = 'Excellent';
        
        scenarios.push({
            months,
            timeToReach,
            adequacy
        });
    }
    
    return scenarios;
} 