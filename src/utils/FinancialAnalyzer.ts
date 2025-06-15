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
     * Calculate comprehensive financial health score
     */
    public calculateHealthScore(): number {
        const cashFlow = this.data.monthlyIncome - this.data.monthlyExpenses;
        const emergencyFundMonths = this.calculateEmergencyFundMonths(this.data.savings, this.data.monthlyExpenses);
        const debtToIncomeRatio = this.calculateDebtToIncomeRatio(this.data.debt, this.data.monthlyIncome);
        
        let score = 0;
        
        // Cash flow component (40% of score)
        if (cashFlow > 0) {
            const cashFlowRatio = cashFlow / this.data.monthlyIncome;
            if (cashFlowRatio >= 0.3) score += 40;
            else if (cashFlowRatio >= 0.2) score += 30;
            else if (cashFlowRatio >= 0.1) score += 20;
            else score += 10;
        }
        
        // Emergency fund component (30% of score)
        if (emergencyFundMonths >= 6) score += 30;
        else if (emergencyFundMonths >= 3) score += 20;
        else if (emergencyFundMonths >= 1) score += 10;
        
        // Debt management component (30% of score)
        if (debtToIncomeRatio <= 0.1) score += 30;
        else if (debtToIncomeRatio <= 0.2) score += 20;
        else if (debtToIncomeRatio <= 0.3) score += 10;
        
        return Math.min(100, Math.max(0, score));
    }

    /**
     * Generate personalized recommendations
     */
    public generateRecommendations(): string {
        const cashFlow = this.data.monthlyIncome - this.data.monthlyExpenses;
        const emergencyFundMonths = this.calculateEmergencyFundMonths(this.data.savings, this.data.monthlyExpenses);
        const debtToIncomeRatio = this.calculateDebtToIncomeRatio(this.data.debt, this.data.monthlyIncome);
        const healthScore = this.calculateHealthScore();

        if (healthScore >= 80) {
            return "Excellent financial health! Consider maximizing investment contributions and exploring advanced wealth-building strategies.";
        } else if (healthScore >= 60) {
            return "Good financial foundation. Focus on optimizing your investment portfolio and consider increasing your emergency fund.";
        } else if (healthScore >= 40) {
            return "Moderate financial health. Priority should be building emergency fund and reducing debt burden.";
        } else if (cashFlow < 0) {
            return "URGENT: Negative cash flow detected. Immediately review and reduce expenses or increase income.";
        } else if (debtToIncomeRatio > 0.4) {
            return "High debt burden detected. Focus on aggressive debt reduction before other financial goals.";
        } else if (emergencyFundMonths < 1) {
            return "Critical: Build emergency fund immediately. Aim for at least 3-6 months of expenses.";
        } else {
            return "Focus on improving cash flow and building emergency fund. Consider budgeting tools and expense tracking.";
        }
    }

    /**
     * Calculate basic financial metrics
     */
    public calculateBasicMetrics() {
        const cashFlow = this.data.monthlyIncome - this.data.monthlyExpenses;
        const emergencyFundMonths = this.calculateEmergencyFundMonths(this.data.savings, this.data.monthlyExpenses);
        const debtToIncomeRatio = this.calculateDebtToIncomeRatio(this.data.debt, this.data.monthlyIncome);
        const savingsRate = cashFlow > 0 ? (cashFlow / this.data.monthlyIncome) * 100 : 0;

        return {
            cashFlow,
            emergencyFundMonths,
            debtToIncomeRatio,
            savingsRate,
            healthScore: this.calculateHealthScore()
        };
    }

    /**
     * Generate wealth projection data for charts
     */
    public generateWealthProjection(): { years: string[], values: number[] } {
        if (!this.data.age) {
            return { years: [], values: [] };
        }

        const years: string[] = [];
        const values: number[] = [];
        const currentAge = this.data.age;
        const retirementAge = this.data.retirementAge || 67;
        const yearsToRetirement = retirementAge - currentAge;
        
        // Calculate monthly investment amount
        const monthlyInvestment = (this.data.monthlyInvestmentContribution || 0) + 
                                 Math.max(0, this.data.monthlyIncome - this.data.monthlyExpenses) * 0.5;
        
        // Use risk-adjusted return rate
        let annualReturn = 0.07; // Default 7%
        if (this.data.riskTolerance === 'conservative') annualReturn = 0.05;
        else if (this.data.riskTolerance === 'aggressive') annualReturn = 0.09;

        let currentWealth = (this.data.currentInvestments || 0) + this.data.savings;

        for (let year = 0; year <= Math.min(yearsToRetirement, 30); year += 5) {
            years.push(`Year ${year}`);
            
            if (year === 0) {
                values.push(currentWealth);
            } else {
                // Calculate compound growth with monthly contributions
                const futureValue = this.calculateCompoundGrowth(
                    currentWealth,
                    monthlyInvestment,
                    annualReturn,
                    year
                );
                values.push(futureValue);
            }
        }

        return { years, values };
    }

    /**
     * Generate health trend data for charts
     */
    public generateHealthTrend(): { months: string[], scores: number[] } {
        const months: string[] = [];
        const scores: number[] = [];
        const currentScore = this.calculateHealthScore();
        
        // Project health score improvement over 12 months
        for (let month = 0; month <= 12; month++) {
            months.push(`Month ${month}`);
            
            if (month === 0) {
                scores.push(currentScore);
            } else {
                // Simulate gradual improvement based on positive cash flow
                const cashFlow = this.data.monthlyIncome - this.data.monthlyExpenses;
                const improvementRate = cashFlow > 0 ? 2 : -1; // 2 points per month if positive cash flow
                const projectedScore = Math.min(100, Math.max(0, currentScore + (month * improvementRate)));
                scores.push(projectedScore);
            }
        }

        return { months, scores };
    }

    /**
     * Calculate retirement readiness
     */
    public calculateRetirementReadiness(): { ready: boolean, shortfall: number, recommendation: string } {
        if (!this.data.age) {
            return { ready: false, shortfall: 0, recommendation: "Age required for retirement analysis" };
        }

        const currentAge = this.data.age;
        const retirementAge = this.data.retirementAge || 67;
        const yearsToRetirement = retirementAge - currentAge;
        
        if (yearsToRetirement <= 0) {
            return { ready: true, shortfall: 0, recommendation: "You have reached retirement age" };
        }

        // Estimate retirement needs (80% of current income for 25 years)
        const annualRetirementNeeds = this.data.monthlyIncome * 12 * 0.8;
        const totalRetirementNeeds = annualRetirementNeeds * 25; // 25 years of retirement
        
        // Calculate projected wealth at retirement
        const monthlyInvestment = (this.data.monthlyInvestmentContribution || 0) + 
                                 Math.max(0, this.data.monthlyIncome - this.data.monthlyExpenses) * 0.5;
        
        let annualReturn = 0.07;
        if (this.data.riskTolerance === 'conservative') annualReturn = 0.05;
        else if (this.data.riskTolerance === 'aggressive') annualReturn = 0.09;

        const currentWealth = (this.data.currentInvestments || 0) + this.data.savings;
        const projectedWealth = this.calculateCompoundGrowth(currentWealth, monthlyInvestment, annualReturn, yearsToRetirement);
        
        const shortfall = Math.max(0, totalRetirementNeeds - projectedWealth);
        const ready = shortfall === 0;
        
        let recommendation = "";
        if (ready) {
            recommendation = "You're on track for retirement! Consider optimizing your portfolio allocation.";
        } else {
            const additionalMonthlyNeeded = shortfall / (yearsToRetirement * 12);
            recommendation = `You need an additional $${additionalMonthlyNeeded.toLocaleString()} per month to meet retirement goals.`;
        }

        return { ready, shortfall, recommendation };
    }

    // Helper methods
    private calculateEmergencyFundMonths(savings: number, monthlyExpenses: number): number {
        return monthlyExpenses > 0 ? savings / monthlyExpenses : 0;
    }

    private calculateDebtToIncomeRatio(debt: number, monthlyIncome: number): number {
        return debt / (monthlyIncome * 12);
    }

    private calculateCompoundGrowth(
        presentValue: number,
        monthlyContribution: number,
        annualRate: number,
        years: number
    ): number {
        return calculateFutureValueWithContributions(presentValue, monthlyContribution, annualRate, years);
    }
} 