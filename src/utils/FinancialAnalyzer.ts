/**
 * Financial Analysis Module
 * Handles core financial calculations and analysis
 */

import { UserFinancialData } from '../types';
import { calculateFutureValueWithContributions } from './calculations';

export class FinancialAnalyzer {
    private data: UserFinancialData;

    constructor(data: UserFinancialData) {
        this.data = data;
    }

    /**
     * Calculate comprehensive financial health score with detailed breakdown
     */
    public calculateHealthScore(): number {
        const cashFlow = this.data.monthlyIncome - this.data.monthlyExpenses;
        const emergencyFundMonths = this.calculateEmergencyFundMonths(this.data.savings, this.data.monthlyExpenses);
        const debtToIncomeRatio = this.calculateDebtToIncomeRatio(this.data.debt, this.data.monthlyIncome);
        const savingsRate = this.calculateSavingsRate(cashFlow, this.data.monthlyIncome);

        // Weighted scoring based on financial advisor standards
        let score = 0;

        // Cash Flow Management (25 points)
        if (cashFlow > 0) {
            const cashFlowRatio = cashFlow / this.data.monthlyIncome;
            if (cashFlowRatio >= 0.2) score += 25; // 20%+ surplus is excellent
            else if (cashFlowRatio >= 0.1) score += 20; // 10%+ surplus is good
            else if (cashFlowRatio >= 0.05) score += 15; // 5%+ surplus is fair
            else score += 10; // Positive but minimal
        } else {
            score += 0; // Negative cash flow is critical
        }

        // Emergency Fund Assessment (25 points)
        if (emergencyFundMonths >= 6) score += 25;
        else if (emergencyFundMonths >= 3) score += Math.round((emergencyFundMonths / 6) * 25);
        else if (emergencyFundMonths >= 1) score += Math.round((emergencyFundMonths / 3) * 15);
        else score += 0;

        // Debt Management (25 points)
        if (debtToIncomeRatio <= 0.1) score += 25;
        else if (debtToIncomeRatio <= 0.2) score += 20;
        else if (debtToIncomeRatio <= 0.3) score += 15;
        else if (debtToIncomeRatio <= 0.4) score += 10;
        else score += 5;

        // Savings Rate (25 points)
        if (savingsRate >= 20) score += 25;
        else if (savingsRate >= 15) score += 20;
        else if (savingsRate >= 10) score += 15;
        else if (savingsRate >= 5) score += 10;
        else if (savingsRate > 0) score += 5;
        else score += 0;

        return Math.round(Math.max(0, Math.min(100, score)));
    }

    /**
     * Get detailed score breakdown for transparency
     */
    public getScoreBreakdown(): any {
        const cashFlow = this.data.monthlyIncome - this.data.monthlyExpenses;
        const emergencyFundMonths = this.calculateEmergencyFundMonths(this.data.savings, this.data.monthlyExpenses);
        const debtToIncomeRatio = this.calculateDebtToIncomeRatio(this.data.debt, this.data.monthlyIncome);
        const savingsRate = this.calculateSavingsRate(cashFlow, this.data.monthlyIncome);

        // Calculate individual scores
        let cashFlowScore = 0;
        if (cashFlow > 0) {
            const cashFlowRatio = cashFlow / this.data.monthlyIncome;
            if (cashFlowRatio >= 0.2) cashFlowScore = 25;
            else if (cashFlowRatio >= 0.1) cashFlowScore = 20;
            else if (cashFlowRatio >= 0.05) cashFlowScore = 15;
            else cashFlowScore = 10;
        }

        let emergencyScore = 0;
        if (emergencyFundMonths >= 6) emergencyScore = 25;
        else if (emergencyFundMonths >= 3) emergencyScore = Math.round((emergencyFundMonths / 6) * 25);
        else if (emergencyFundMonths >= 1) emergencyScore = Math.round((emergencyFundMonths / 3) * 15);

        let debtScore = 0;
        if (debtToIncomeRatio <= 0.1) debtScore = 25;
        else if (debtToIncomeRatio <= 0.2) debtScore = 20;
        else if (debtToIncomeRatio <= 0.3) debtScore = 15;
        else if (debtToIncomeRatio <= 0.4) debtScore = 10;
        else debtScore = 5;

        let savingsScore = 0;
        if (savingsRate >= 20) savingsScore = 25;
        else if (savingsRate >= 15) savingsScore = 20;
        else if (savingsRate >= 10) savingsScore = 15;
        else if (savingsRate >= 5) savingsScore = 10;
        else if (savingsRate > 0) savingsScore = 5;

        return {
            cashFlow: {
                score: cashFlowScore,
                maxScore: 25,
                value: cashFlow,
                percentage: (cashFlow / this.data.monthlyIncome) * 100,
                benchmark: 'Aim for 10-20% positive cash flow',
                status: this.getScoreStatus(cashFlowScore, 25)
            },
            emergencyFund: {
                score: emergencyScore,
                maxScore: 25,
                value: emergencyFundMonths,
                benchmark: '6 months of expenses recommended',
                status: this.getScoreStatus(emergencyScore, 25)
            },
            debtManagement: {
                score: debtScore,
                maxScore: 25,
                value: debtToIncomeRatio * 100,
                benchmark: 'Keep total debt below 36% of income',
                status: this.getScoreStatus(debtScore, 25)
            },
            savingsRate: {
                score: savingsScore,
                maxScore: 25,
                value: savingsRate,
                benchmark: '20% savings rate for wealth building',
                status: this.getScoreStatus(savingsScore, 25)
            },
            totalScore: cashFlowScore + emergencyScore + debtScore + savingsScore
        };
    }

    /**
     * Calculate basic financial metrics
     */
    public calculateBasicMetrics(): any {
        const cashFlow = this.data.monthlyIncome - this.data.monthlyExpenses;
        const emergencyFundMonths = this.calculateEmergencyFundMonths(this.data.savings, this.data.monthlyExpenses);
        const debtToIncomeRatio = this.calculateDebtToIncomeRatio(this.data.debt, this.data.monthlyIncome);
        const savingsRate = this.calculateSavingsRate(cashFlow, this.data.monthlyIncome);

        return {
            cashFlow,
            emergencyFundMonths,
            debtToIncomeRatio,
            savingsRate
        };
    }

    /**
     * Calculate advanced financial metrics based on research
     */
    public calculateAdvancedMetrics(): any {
        const cashFlow = this.data.monthlyIncome - this.data.monthlyExpenses;
        const fixedExpenses = this.data.monthlyExpenses * 0.7; // Estimate 70% are fixed
        const totalDebtPayments = this.data.debt * 0.03; // Estimate 3% monthly payment
        
        return {
            // Cash Flow Coverage Ratio - Ability to cover fixed expenses
            cashFlowCoverageRatio: fixedExpenses > 0 ? cashFlow / fixedExpenses : Infinity,
            
            // Debt Service Coverage - Income available for debt payments
            debtServiceCoverage: totalDebtPayments > 0 ? this.data.monthlyIncome / totalDebtPayments : Infinity,
            
            // Liquidity Ratio - Months of expenses covered by liquid assets
            liquidityRatio: this.calculateEmergencyFundMonths(this.data.savings, this.data.monthlyExpenses),
            
            // Savings Efficiency - Actual vs optimal savings rate
            savingsEfficiency: Math.min(100, (this.calculateSavingsRate(cashFlow, this.data.monthlyIncome) / 20) * 100),
            
            // Financial Stress Score - Combined debt and emergency fund stress
            financialStressScore: this.calculateFinancialStressScore(),
            
            // Wealth Building Velocity - Effectiveness of wealth accumulation
            wealthBuildingVelocity: this.calculateWealthBuildingVelocity(),
            
            // Risk Tolerance Alignment - Investment allocation appropriateness
            riskToleranceAlignment: this.calculateRiskAlignment(),

            // Industry Benchmarks
            benchmarks: this.getIndustryBenchmarks()
        };
    }

    /**
     * Generate personalized recommendations based on financial analysis
     */
    public generateRecommendations(): string[] {
        const recommendations: string[] = [];
        const cashFlow = this.data.monthlyIncome - this.data.monthlyExpenses;
        const emergencyMonths = this.calculateEmergencyFundMonths(this.data.savings, this.data.monthlyExpenses);
        const debtRatio = this.calculateDebtToIncomeRatio(this.data.debt, this.data.monthlyIncome);
        const savingsRate = this.calculateSavingsRate(cashFlow, this.data.monthlyIncome);

        // Cash flow recommendations
        if (cashFlow <= 0) {
            recommendations.push("🚨 URGENT: Create a budget to achieve positive cash flow. Consider reducing expenses or increasing income.");
        } else if (cashFlow / this.data.monthlyIncome < 0.1) {
            recommendations.push("💡 Aim to increase your cash flow to at least 10% of income for better financial flexibility.");
        }

        // Emergency fund recommendations
        if (emergencyMonths < 3) {
            recommendations.push("🛡️ PRIORITY: Build your emergency fund to cover 3-6 months of expenses before other investments.");
        } else if (emergencyMonths < 6) {
            recommendations.push("📈 Continue building your emergency fund to reach the 6-month target for optimal security.");
        }

        // Debt management recommendations
        if (debtRatio > 0.36) {
            recommendations.push("📊 HIGH PRIORITY: Reduce debt-to-income ratio below 36% using debt avalanche or snowball method.");
        } else if (debtRatio > 0.2) {
            recommendations.push("💳 Consider accelerating debt payments to improve financial flexibility.");
        }

        // Savings rate recommendations
        if (savingsRate < 10) {
            recommendations.push("💰 Increase savings rate to at least 10% of income for basic retirement planning.");
        } else if (savingsRate < 20) {
            recommendations.push("🎯 Excellent progress! Aim for 20%+ savings rate to enable early retirement options.");
        }

        // Age-specific recommendations
        if (this.data.age) {
            if (this.data.age < 30 && savingsRate < 15) {
                recommendations.push("🚀 Take advantage of compound interest - increase savings rate while young for maximum growth.");
            } else if (this.data.age > 50 && emergencyMonths < 12) {
                recommendations.push("⏰ Consider increasing emergency fund to 12 months as you approach retirement.");
            }
        }

        // Investment recommendations based on risk tolerance
        if (this.data.riskTolerance && this.data.currentInvestments) {
            const investmentRatio = (this.data.currentInvestments || 0) / (this.data.monthlyIncome * 12);
            if (investmentRatio < 1 && this.data.age && this.data.age < 40) {
                recommendations.push("📈 Consider increasing investment allocation for long-term wealth building.");
            }
        }

        // High earner optimization recommendations
        if (recommendations.length === 0 && this.data.monthlyIncome > 8000) {
            recommendations.push("🌟 Excellent financial position! Consider tax optimization strategies and diversified investments.");
            recommendations.push("🎯 Explore advanced wealth-building strategies like real estate or business investments.");
        }

        // Ensure we always have at least one recommendation
        if (recommendations.length === 0) {
            recommendations.push("✅ Your financial health looks good! Continue monitoring and adjusting your strategy.");
        }

        return recommendations.slice(0, 5); // Limit to top 5 recommendations
    }

    /**
     * Calculate retirement readiness score
     */
    public calculateRetirementReadiness(): number {
        if (!this.data.age || !this.data.retirementAge) return 0;
        
        const yearsToRetirement = this.data.retirementAge - this.data.age;
        const currentInvestments = this.data.currentInvestments || 0;
        const monthlyContribution = this.data.monthlyInvestmentContribution || 0;
        const annualIncome = this.data.monthlyIncome * 12;
        
        // Rule of thumb: Need 10-12x annual income for retirement
        const retirementTarget = annualIncome * 11;
        
        // Project future value with 7% annual return
        const projectedValue = calculateFutureValueWithContributions(
            currentInvestments,
            monthlyContribution,
            0.07,
            yearsToRetirement
        );
        
        const readinessPercentage = (projectedValue / retirementTarget) * 100;
        return Math.round(Math.min(100, readinessPercentage));
    }

    /**
     * Calculate wealth projections for different scenarios
     */
    public calculateWealthProjections(years: number = 30): any {
        const currentWealth = (this.data.savings || 0) + (this.data.currentInvestments || 0);
        const monthlyContribution = (this.data.monthlyInvestmentContribution || 0);
        
        // Conservative scenario (4% return)
        const conservative = calculateFutureValueWithContributions(
            currentWealth,
            monthlyContribution,
            0.04,
            years
        );
        
        // Moderate scenario (7% return)
        const moderate = calculateFutureValueWithContributions(
            currentWealth,
            monthlyContribution,
            0.07,
            years
        );
        
        // Aggressive scenario (10% return)
        const aggressive = calculateFutureValueWithContributions(
            currentWealth,
            monthlyContribution,
            0.10,
            years
        );

        // Calculate real (inflation-adjusted) values
        const inflationRate = 0.035; // 3.5% average inflation
        const realConservative = conservative / Math.pow(1 + inflationRate, years);
        const realModerate = moderate / Math.pow(1 + inflationRate, years);
        const realAggressive = aggressive / Math.pow(1 + inflationRate, years);

        return {
            conservative,
            moderate,
            aggressive,
            realConservative,
            realModerate,
            realAggressive,
            inflationImpact: {
                conservative: conservative - realConservative,
                moderate: moderate - realModerate,
                aggressive: aggressive - realAggressive
            }
        };
    }

    // Private helper methods
    private calculateEmergencyFundMonths(savings: number, monthlyExpenses: number): number {
        if (monthlyExpenses <= 0) return 0;
        return savings / monthlyExpenses;
    }

    private calculateDebtToIncomeRatio(debt: number, monthlyIncome: number): number {
        if (monthlyIncome <= 0) return 0;
        // Assume 3% monthly payment on total debt
        const monthlyDebtPayment = debt * 0.03;
        return monthlyDebtPayment / monthlyIncome;
    }

    private calculateSavingsRate(cashFlow: number, monthlyIncome: number): number {
        if (monthlyIncome <= 0) return 0;
        return Math.max(0, (cashFlow / monthlyIncome) * 100);
    }

    private calculateFinancialStressScore(): number {
        const debtRatio = this.calculateDebtToIncomeRatio(this.data.debt, this.data.monthlyIncome);
        const emergencyMonths = this.calculateEmergencyFundMonths(this.data.savings, this.data.monthlyExpenses);
        
        let stressScore = 0;
        
        // Debt stress (0-50 points)
        if (debtRatio > 0.5) stressScore += 50;
        else if (debtRatio > 0.36) stressScore += 35;
        else if (debtRatio > 0.2) stressScore += 20;
        else stressScore += 0;
        
        // Emergency fund stress (0-50 points)
        if (emergencyMonths < 1) stressScore += 50;
        else if (emergencyMonths < 3) stressScore += 30;
        else if (emergencyMonths < 6) stressScore += 15;
        else stressScore += 0;
        
        return Math.min(100, stressScore);
    }

    private calculateWealthBuildingVelocity(): number {
        const annualIncome = this.data.monthlyIncome * 12;
        const currentWealth = (this.data.savings || 0) + (this.data.currentInvestments || 0);
        const monthlyContribution = this.data.monthlyInvestmentContribution || 0;
        const annualContribution = monthlyContribution * 12;
        
        // Wealth-to-income ratio
        const wealthRatio = currentWealth / annualIncome;
        
        // Contribution rate
        const contributionRate = annualContribution / annualIncome;
        
        // Combined velocity score (0-100)
        let velocity = 0;
        
        // Age-adjusted wealth targets
        if (this.data.age) {
            const expectedWealth = annualIncome * (this.data.age - 22) * 0.1; // Rule of thumb
            if (currentWealth >= expectedWealth) velocity += 50;
            else velocity += (currentWealth / expectedWealth) * 50;
        } else {
            velocity += Math.min(50, wealthRatio * 10);
        }
        
        // Contribution velocity
        velocity += Math.min(50, contributionRate * 250); // 20% contribution = 50 points
        
        return Math.round(Math.min(100, velocity));
    }

    private calculateRiskAlignment(): number {
        if (!this.data.riskTolerance || !this.data.age) return 50; // Neutral if no data
        
        const age = this.data.age;
        const riskTolerance = this.data.riskTolerance;
        
        // Age-based risk recommendations
        let recommendedRisk: string;
        if (age < 35) recommendedRisk = 'aggressive';
        else if (age < 50) recommendedRisk = 'moderate';
        else recommendedRisk = 'conservative';
        
        // Alignment score
        if (riskTolerance === recommendedRisk) return 100;
        else if (
            (riskTolerance === 'moderate' && (recommendedRisk === 'aggressive' || recommendedRisk === 'conservative')) ||
            (riskTolerance === 'aggressive' && recommendedRisk === 'moderate') ||
            (riskTolerance === 'conservative' && recommendedRisk === 'moderate')
        ) return 75;
        else return 50;
    }

    private getScoreStatus(score: number, maxScore: number): string {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 90) return 'Excellent';
        else if (percentage >= 75) return 'Good';
        else if (percentage >= 60) return 'Fair';
        else if (percentage >= 40) return 'Needs Improvement';
        else return 'Critical';
    }

    private getIndustryBenchmarks(): any {
        return {
            emergencyFund: {
                minimum: 3, // months
                recommended: 6, // months
                conservative: 12 // months for pre-retirement
            },
            debtToIncome: {
                excellent: 0.1, // 10%
                good: 0.2, // 20%
                acceptable: 0.36, // 36% (industry standard)
                concerning: 0.5 // 50%
            },
            savingsRate: {
                minimum: 0.1, // 10%
                good: 0.15, // 15%
                excellent: 0.2, // 20%
                fireMovement: 0.5 // 50% for FIRE
            },
            wealthToIncomeByAge: {
                25: 0.5,
                30: 1.0,
                35: 2.0,
                40: 3.0,
                45: 4.0,
                50: 5.0,
                55: 7.0,
                60: 10.0,
                65: 12.0
            }
        };
    }
} 