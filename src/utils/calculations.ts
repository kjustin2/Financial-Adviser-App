/**
 * Advanced Financial Calculations
 * Research-based metrics and industry-standard formulas
 */

import { FINANCIAL_BENCHMARKS, getExpectedReturn } from '../data/historicalRates';

export interface AdvancedMetrics {
    cashFlowCoverageRatio: number;
    debtServiceCoverage: number;
    liquidityRatio: number;
    savingsEfficiency: number;
    financialStressScore: number;
    wealthBuildingVelocity: number;
    riskToleranceAlignment: number;
}

/**
 * Calculate Cash Flow Coverage Ratio
 * Measures ability to cover fixed expenses with positive cash flow
 */
export function calculateCashFlowCoverageRatio(
    monthlyIncome: number,
    monthlyExpenses: number,
    fixedExpenses: number = monthlyExpenses * 0.7 // Assume 70% are fixed
): number {
    const cashFlow = monthlyIncome - monthlyExpenses;
    return fixedExpenses > 0 ? cashFlow / fixedExpenses : 0;
}

/**
 * Calculate Debt Service Coverage Ratio
 * Measures ability to service debt payments from net income
 */
export function calculateDebtServiceCoverage(
    monthlyIncome: number,
    monthlyDebtPayments: number
): number {
    return monthlyDebtPayments > 0 ? monthlyIncome / monthlyDebtPayments : Infinity;
}

/**
 * Calculate Liquidity Ratio
 * Measures months of expenses covered by liquid assets
 */
export function calculateLiquidityRatio(
    liquidAssets: number,
    monthlyExpenses: number
): number {
    return monthlyExpenses > 0 ? liquidAssets / monthlyExpenses : 0;
}

/**
 * Calculate Savings Efficiency Score (0-100)
 * Compares actual savings rate to optimal benchmarks
 */
export function calculateSavingsEfficiency(
    actualSavingsRate: number
): number {
    const optimal = FINANCIAL_BENCHMARKS.savingsRate.optimal;
    const efficiency = Math.min(actualSavingsRate / optimal, 1.0);
    return Math.round(efficiency * 100);
}

/**
 * Calculate Financial Stress Score (0-100, lower is better)
 * Combines debt burden and emergency fund adequacy
 */
export function calculateFinancialStressScore(
    debtToIncomeRatio: number,
    emergencyFundMonths: number,
    targetEmergencyMonths: number = 6
): number {
    // Debt stress component (0-50 points)
    let debtStress = 0;
    if (debtToIncomeRatio > FINANCIAL_BENCHMARKS.debtToIncome.critical) {
        debtStress = 50;
    } else if (debtToIncomeRatio > FINANCIAL_BENCHMARKS.debtToIncome.concerning) {
        debtStress = 40;
    } else if (debtToIncomeRatio > FINANCIAL_BENCHMARKS.debtToIncome.fair) {
        debtStress = 25;
    } else if (debtToIncomeRatio > FINANCIAL_BENCHMARKS.debtToIncome.good) {
        debtStress = 10;
    }

    // Emergency fund stress component (0-50 points)
    const emergencyRatio = emergencyFundMonths / targetEmergencyMonths;
    let emergencyStress = 0;
    if (emergencyRatio < 0.25) {
        emergencyStress = 50;
    } else if (emergencyRatio < 0.5) {
        emergencyStress = 35;
    } else if (emergencyRatio < 0.75) {
        emergencyStress = 20;
    } else if (emergencyRatio < 1.0) {
        emergencyStress = 10;
    }

    return Math.round(debtStress + emergencyStress);
}

/**
 * Calculate Wealth Building Velocity Score (0-100)
 * Measures effectiveness of wealth accumulation strategy
 */
export function calculateWealthBuildingVelocity(
    savingsRate: number,
    investmentReturn: number,
    age: number
): number {
    // Base score from savings rate
    const savingsScore = Math.min(savingsRate / FINANCIAL_BENCHMARKS.savingsRate.optimal, 1.0) * 50;
    
    // Investment efficiency score
    const expectedReturn = getExpectedReturn('moderate', 65 - age);
    const investmentScore = Math.min(investmentReturn / expectedReturn, 1.0) * 30;
    
    // Age factor (younger = more time for compounding)
    const ageFactor = age < 30 ? 20 : age < 40 ? 15 : age < 50 ? 10 : 5;
    
    return Math.round(savingsScore + investmentScore + ageFactor);
}

/**
 * Calculate Risk Tolerance Alignment Score (0-100)
 * Measures how well investment allocation matches age and risk tolerance
 */
export function calculateRiskToleranceAlignment(
    age: number,
    riskTolerance: 'conservative' | 'moderate' | 'aggressive',
    stockAllocation: number
): number {
    // Calculate ideal stock allocation based on age and risk tolerance
    let idealStockAllocation: number;
    const baseAllocation = Math.max(20, 110 - age); // Rule of 110
    
    switch (riskTolerance) {
        case 'conservative':
            idealStockAllocation = Math.max(20, baseAllocation - 20);
            break;
        case 'moderate':
            idealStockAllocation = baseAllocation;
            break;
        case 'aggressive':
            idealStockAllocation = Math.min(90, baseAllocation + 10);
            break;
        default:
            idealStockAllocation = baseAllocation;
    }
    
    // Calculate alignment score
    const deviation = Math.abs(stockAllocation - idealStockAllocation);
    const maxDeviation = 50; // Maximum reasonable deviation
    const alignmentScore = Math.max(0, 100 - (deviation / maxDeviation) * 100);
    
    return Math.round(alignmentScore);
}

/**
 * Calculate all advanced metrics
 */
export function calculateAdvancedMetrics(
    monthlyIncome: number,
    monthlyExpenses: number,
    savings: number,
    debt: number,
    age: number,
    riskTolerance: 'conservative' | 'moderate' | 'aggressive',
    currentInvestments: number = 0,
    monthlyInvestmentContribution: number = 0
): AdvancedMetrics {
    const cashFlow = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? (cashFlow / monthlyIncome) : 0;
    const debtToIncomeRatio = debt / (monthlyIncome * 12);
    const emergencyFundMonths = monthlyExpenses > 0 ? savings / monthlyExpenses : 0;
    
    // Estimate monthly debt payments (assuming 5% interest, 5-year term)
    const monthlyDebtPayments = debt > 0 ? debt * 0.0188 : 0; // Approximate payment
    
    // Estimate stock allocation (simplified)
    const totalInvestments = currentInvestments + (monthlyInvestmentContribution * 12);
    const stockAllocation = totalInvestments > 0 ? 70 : 0; // Default moderate allocation
    
    // Calculate investment return (simplified)
    const investmentReturn = getExpectedReturn(riskTolerance, 65 - age);
    
    return {
        cashFlowCoverageRatio: calculateCashFlowCoverageRatio(monthlyIncome, monthlyExpenses),
        debtServiceCoverage: calculateDebtServiceCoverage(monthlyIncome, monthlyDebtPayments),
        liquidityRatio: calculateLiquidityRatio(savings, monthlyExpenses),
        savingsEfficiency: calculateSavingsEfficiency(savingsRate),
        financialStressScore: calculateFinancialStressScore(debtToIncomeRatio, emergencyFundMonths),
        wealthBuildingVelocity: calculateWealthBuildingVelocity(savingsRate, investmentReturn, age),
        riskToleranceAlignment: calculateRiskToleranceAlignment(age, riskTolerance, stockAllocation)
    };
}

/**
 * Calculate compound annual growth rate (CAGR)
 */
export function calculateCAGR(
    beginningValue: number,
    endingValue: number,
    years: number
): number {
    if (beginningValue <= 0 || endingValue <= 0 || years <= 0) return 0;
    return Math.pow(endingValue / beginningValue, 1 / years) - 1;
}

/**
 * Calculate future value with regular contributions
 */
export function calculateFutureValueWithContributions(
    presentValue: number,
    monthlyContribution: number,
    annualRate: number,
    years: number
): number {
    const monthlyRate = annualRate / 12;
    const totalMonths = years * 12;
    
    // Future value of present amount
    const futureValuePresent = presentValue * Math.pow(1 + annualRate, years);
    
    // Future value of monthly contributions (annuity)
    const futureValueContributions = monthlyContribution > 0 ? 
        monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) : 0;
    
    return futureValuePresent + futureValueContributions;
}

/**
 * Calculate required monthly savings to reach a goal
 */
export function calculateRequiredMonthlySavings(
    targetAmount: number,
    currentAmount: number,
    annualRate: number,
    years: number
): number {
    if (years <= 0) return targetAmount - currentAmount;
    
    const futureValueCurrent = currentAmount * Math.pow(1 + annualRate, years);
    const remainingAmount = targetAmount - futureValueCurrent;
    
    if (remainingAmount <= 0) return 0;
    
    const monthlyRate = annualRate / 12;
    const totalMonths = years * 12;
    
    return remainingAmount * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1);
}

/**
 * Calculate retirement income replacement ratio
 */
export function calculateIncomeReplacementRatio(
    retirementWealth: number,
    currentAnnualIncome: number,
    withdrawalRate: number = 0.04
): number {
    const retirementIncome = retirementWealth * withdrawalRate;
    return currentAnnualIncome > 0 ? retirementIncome / currentAnnualIncome : 0;
}

/**
 * Calculate Social Security benefit estimate (simplified)
 */
export function estimateSocialSecurityBenefit(
    currentAnnualIncome: number
): number {
    // Simplified calculation based on current income
    // Actual calculation is much more complex and requires earnings history
    const averageIndexedMonthlyEarnings = currentAnnualIncome / 12;
    
    // Primary Insurance Amount (PIA) formula - simplified
    let monthlyBenefit = 0;
    if (averageIndexedMonthlyEarnings <= 1024) {
        monthlyBenefit = averageIndexedMonthlyEarnings * 0.9;
    } else if (averageIndexedMonthlyEarnings <= 6172) {
        monthlyBenefit = 1024 * 0.9 + (averageIndexedMonthlyEarnings - 1024) * 0.32;
    } else {
        monthlyBenefit = 1024 * 0.9 + (6172 - 1024) * 0.32 + (averageIndexedMonthlyEarnings - 6172) * 0.15;
    }
    
    // Cap at maximum benefit
    return Math.min(monthlyBenefit, 3627); // 2024 maximum benefit
} 