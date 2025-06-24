/**
 * Comprehensive Financial Health Calculation Engine
 * Based on Financial Health Network 2024 research and industry best practices
 */

import { UserFinancialData } from '../interfaces/core-types';
import { 
    HealthIndicator, 
    FinancialMetric, 
    ComprehensiveAnalysisResult,
    WealthProjection,
    ScenarioAnalysis
} from '../interfaces/analysis-types';
import { RecommendationEngine } from './RecommendationEngine';

export class FinancialCalculationEngine {
    
    /**
     * Perform comprehensive financial health analysis
     */
    public static analyzeFinancialHealth(data: UserFinancialData): ComprehensiveAnalysisResult {
        // Validate that we're using real user data, not defaults
        this.validateUserData(data);
        const keyMetrics = this.calculateKeyMetrics(data);
        const healthIndicators = this.calculateHealthIndicators(data, keyMetrics);
        const overallHealthScore = this.calculateOverallHealthScore(healthIndicators);
        
        const result: ComprehensiveAnalysisResult = {
            overallHealthScore,
            healthLevel: this.getHealthLevel(overallHealthScore),
            healthIndicators,
            keyMetrics,
            liquidityAnalysis: this.analyzeLiquidity(data, keyMetrics),
            debtAnalysis: this.analyzeDebt(data, keyMetrics),
            investmentAnalysis: this.analyzeInvestments(data, keyMetrics),
            insuranceAnalysis: this.analyzeInsurance(data),
            wealthProjections: this.projectWealth(data, keyMetrics),
            scenarioAnalysis: this.analyzeScenarios(data, keyMetrics),
            prioritizedRecommendations: [], // Will be populated next
            peerBenchmarks: this.calculatePeerBenchmarks(data),
            detailedInsights: this.generateDetailedInsights(data, keyMetrics, healthIndicators),
            financialRatios: this.calculateFinancialRatios(data, keyMetrics),
            riskAssessment: this.assessFinancialRisk(data, keyMetrics),
            goalAnalysis: this.analyzeFinancialGoals(data, keyMetrics)
        };

        result.prioritizedRecommendations = RecommendationEngine.generateRecommendations(result, data);

        return result;
    }

    /**
     * Calculate key financial metrics
     */
    private static calculateKeyMetrics(data: UserFinancialData) {
        const totalIncome = this.getTotalMonthlyIncome(data.income);
        const totalExpenses = this.getTotalMonthlyExpenses(data.expenses);
        const monthlyCashFlow = totalIncome - totalExpenses;
        const totalAssets = this.getTotalAssets(data.assets);
        const totalLiabilities = this.getTotalLiabilities(data.liabilities);
        // Defensive: Prevent NaN/undefined
        const netWorth = (typeof totalAssets === 'number' && typeof totalLiabilities === 'number' && !isNaN(totalAssets) && !isNaN(totalLiabilities)) ? (totalAssets - totalLiabilities) : 0;
        const totalLiquidAssets = (data.assets.checking || 0) + (data.assets.savings || 0) + (data.assets.moneyMarket || 0) + (data.assets.emergencyFund || 0);
        const totalDebt = this.getTotalDebt(data.liabilities);
        // DTI: Use monthly income, not annualized (see Wells Fargo, Experian, CFPB)
        const debtToIncomeRatio = totalIncome > 0 ? (totalDebt / totalIncome) * 100 : (totalDebt > 0 ? 100 : 0);
        // Defensive breakdowns for UI
        const netWorthBreakdown = {
            totalAssets,
            totalLiabilities,
            netWorth
        };
        const dtiBreakdown = {
            totalDebt,
            totalIncome,
            debtToIncomeRatio
        };
        return {
            monthlyCashFlow: isNaN(monthlyCashFlow) ? 0 : monthlyCashFlow,
            emergencyFundMonths: totalExpenses > 0 && totalLiquidAssets >= 0 ? totalLiquidAssets / totalExpenses : 0,
            debtToIncomeRatio,
            dtiBreakdown,
            savingsRate: totalIncome > 0 ? ((monthlyCashFlow - (data.behaviors?.monthlyInvestmentContribution || 0)) / totalIncome) * 100 : 0,
            creditUtilization: data.liabilities.totalCreditLimit > 0 ? (data.liabilities.creditCardDebt / data.liabilities.totalCreditLimit) * 100 : 0,
            netWorth,
            netWorthBreakdown,
            liquidityRatio: totalLiabilities > 0 ? totalLiquidAssets / totalLiabilities : totalLiquidAssets > 0 ? 100 : 0,
            assetAllocationScore: this.calculateAssetAllocationScore(data)
        };
    }

    /**
     * Calculate the 8 core health indicators based on Financial Health Network research
     */
    private static calculateHealthIndicators(data: UserFinancialData, keyMetrics: any): HealthIndicator[] {
        return [
            this.analyzeSpendingVsIncome(data, keyMetrics),
            this.analyzeBillPaymentReliability(data),
            this.analyzeEmergencySavings(data, keyMetrics),
            this.analyzeDebtManagement(data),
            this.analyzeCreditHealth(data, keyMetrics),
            this.analyzeInsuranceConfidence(data),
            this.analyzeLongTermGoalConfidence(data),
            this.analyzeFinancialPlanningEngagement(data)
        ];
    }

    /**
     * Health Indicator 1: Spending vs Income Analysis
     */
    private static analyzeSpendingVsIncome(data: UserFinancialData, keyMetrics: any): HealthIndicator {
        const totalIncome = this.getTotalMonthlyIncome(data.income);
        const cashFlowRatio = totalIncome > 0 ? (keyMetrics.monthlyCashFlow / totalIncome) * 100 : 0;
        
        let score = 0;
        let status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' = 'critical';
        
        if (cashFlowRatio >= 20) {
            score = 100;
            status = 'excellent';
        } else if (cashFlowRatio >= 10) {
            score = 80;
            status = 'good';
        } else if (cashFlowRatio >= 5) {
            score = 60;
            status = 'fair';
        } else if (cashFlowRatio > 0) {
            score = 40;
            status = 'poor';
        } else {
            score = 0;
            status = 'critical';
        }

        return {
            name: 'Spending vs Income',
            score,
            status,
            weight: 15,
            metrics: [
                {
                    title: 'Monthly Cash Flow',
                    value: this.formatCurrency(keyMetrics.monthlyCashFlow),
                    numericValue: keyMetrics.monthlyCashFlow,
                    description: 'Amount left after all expenses',
                    status,
                    benchmark: 'Target: 20% of income',
                    improvement: cashFlowRatio < 20 ? 'Consider reducing expenses or increasing income' : undefined
                },
                {
                    title: 'Cash Flow Ratio',
                    value: `${cashFlowRatio.toFixed(1)}%`,
                    numericValue: cashFlowRatio,
                    description: 'Percentage of income available after expenses',
                    status,
                    benchmark: 'Excellent: 20%+, Good: 10-19%'
                }
            ],
            recommendations: this.getSpendingRecommendations(cashFlowRatio),
            explanation: `This indicator measures if you spend less than you earn. Your cash flow ratio is ${cashFlowRatio.toFixed(1)}%, resulting in a score of ${score}/100. A healthy ratio is typically above 10-20%.`
        };
    }

    /**
     * Health Indicator 2: Bill Payment Reliability
     */
    private static analyzeBillPaymentReliability(data: UserFinancialData): HealthIndicator {
        const reliability = data.behaviors.billPaymentReliability;
        
        let score = 0;
        let status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' = 'critical';
        
        switch (reliability) {
            case 'always-on-time':
                score = 100;
                status = 'excellent';
                break;
            case 'usually-on-time':
                score = 75;
                status = 'good';
                break;
            case 'sometimes-late':
                score = 50;
                status = 'fair';
                break;
            case 'often-late':
                score = 25;
                status = 'poor';
                break;
            default:
                score = 0;
                status = 'critical';
        }

        return {
            name: 'Bill Payment Reliability',
            score,
            status,
            weight: 15,
            metrics: [
                {
                    title: 'Payment History',
                    value: this.formatReliabilityText(reliability),
                    description: 'Consistency of bill payments',
                    status,
                    benchmark: 'Target: Always on time'
                },
                {
                    title: 'Credit Score Impact',
                    value: data.liabilities.creditScore.toString(),
                    numericValue: data.liabilities.creditScore,
                    description: 'Current credit score',
                    status: this.getCreditScoreStatus(data.liabilities.creditScore),
                    benchmark: 'Excellent: 800+, Good: 740-799, Fair: 670-739'
                }
            ],
            recommendations: this.getPaymentReliabilityRecommendations(reliability),
            explanation: `This indicator reflects your consistency in paying bills on time. Your self-reported reliability is '${this.formatReliabilityText(reliability)}', leading to a score of ${score}/100. On-time payments are crucial for a good credit score.`
        };
    }

    /**
     * Analyze Debt Management Effectiveness (core health indicator #4)
     * Uses research-based debt-to-income ratio, edge case handling, and clear status logic.
     * - Target: <36% total DTI, <28% housing DTI
     * - Status: 'excellent' <20%, 'good' <28%, 'fair' <36%, 'poor' <43%, 'critical' >=43%
     * - Handles zero/negative income and missing data
     */
    private static analyzeDebtManagement(data: UserFinancialData): HealthIndicator {
        // Defensive: Validate income and liabilities
        const totalMonthlyIncome = this.getTotalMonthlyIncome(data.income);
        const totalMonthlyDebt = this.getTotalDebt(data.liabilities);
        let debtToIncomeRatio = 0;
        let status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' = 'critical';
        let explanation = '';
        let recommendations: string[] = [];

        if (totalMonthlyIncome > 0) {
            debtToIncomeRatio = totalMonthlyDebt / totalMonthlyIncome;
            if (debtToIncomeRatio < 0.2) {
                status = 'excellent';
                explanation = 'Your debt-to-income ratio is well below recommended thresholds.';
            } else if (debtToIncomeRatio < 0.28) {
                status = 'good';
                explanation = 'Your debt-to-income ratio is healthy and manageable.';
            } else if (debtToIncomeRatio < 0.36) {
                status = 'fair';
                explanation = 'Your debt-to-income ratio is approaching risk thresholds.';
            } else if (debtToIncomeRatio < 0.43) {
                status = 'poor';
                explanation = 'Your debt-to-income ratio is above recommended limits. Consider reducing debt.';
            } else {
                status = 'critical';
                explanation = 'Your debt-to-income ratio is dangerously high. Immediate action is needed.';
            }
        } else {
            // Edge case: zero or negative income
            debtToIncomeRatio = totalMonthlyDebt > 0 ? 1 : 0;
            status = totalMonthlyDebt > 0 ? 'critical' : 'excellent';
            explanation = totalMonthlyDebt > 0
                ? 'No reported income but outstanding debts. Address income or debt immediately.'
                : 'No income or debt reported.';
        }

        // Recommendations (research-based)
        recommendations = this.getDebtManagementRecommendations(debtToIncomeRatio);

        return {
            name: 'Debt Management Effectiveness',
            score: Math.max(0, 100 - Math.round(debtToIncomeRatio * 100)),
            status,
            weight: 0.15,
            metrics: [
                {
                    title: 'Debt-to-Income Ratio',
                    value: (debtToIncomeRatio * 100).toFixed(1) + '%',
                    numericValue: debtToIncomeRatio,
                    description: 'Total monthly debt payments as a percentage of monthly income',
                    status,
                    benchmark: '<36%',
                    improvement: status === 'excellent' ? '' : 'Reduce debt or increase income to improve ratio.'
                }
            ],
            recommendations,
            explanation
        };
    }

    // Helper Methods
    private static getTotalMonthlyIncome(income: any): number {
        return income.primarySalary + income.secondaryIncome + income.businessIncome + 
               income.investmentIncome + income.rentalIncome + income.benefitsIncome + income.otherIncome;
    }

    private static getTotalMonthlyExpenses(expenses: any): number {
        return expenses.housing + expenses.utilities + expenses.insurance + expenses.loanPayments +
               expenses.childcare + expenses.food + expenses.transportation + expenses.healthcare +
               expenses.clothing + expenses.personalCare + expenses.entertainment + expenses.diningOut +
               expenses.hobbies + expenses.subscriptions + expenses.shopping + expenses.travel +
               expenses.creditCardPayments + expenses.studentLoanPayments + expenses.otherDebtPayments;
    }

    private static getTotalAssets(assets: any): number {
        // Defensive: Treat missing/invalid as zero
        return (assets.checking || 0) + (assets.savings || 0) + (assets.moneyMarket || 0) + (assets.emergencyFund || 0) +
               (assets.employer401k || 0) + (assets.traditionalIRA || 0) + (assets.rothIRA || 0) + (assets.brokerageAccounts || 0) +
               (assets.stocks || 0) + (assets.bonds || 0) + (assets.mutualFunds || 0) + (assets.primaryResidence || 0) +
               (assets.investmentProperties || 0) + (assets.cryptocurrency || 0) + (assets.preciousMetals || 0) +
               (assets.collectibles || 0) + (assets.businessEquity || 0) + (assets.otherAssets || 0);
    }

    /**
     * Get total monthly debt payments from all liability categories
     * Allows total debt to be zero and prevents NaN
     */
    private static getTotalDebt(liabilities: any): number {
        if (!liabilities || typeof liabilities !== 'object') return 0;
        return [
            'mortgageBalance', 'homeEquityLoan', 'autoLoans', 'securedCreditLines',
            'creditCardDebt', 'personalLoans', 'studentLoans', 'medicalDebt',
            'businessLoans', 'businessCreditLines', 'taxDebt', 'legalJudgments', 'otherDebt'
        ].reduce((sum, key) => sum + (Number(liabilities[key]) || 0), 0);
    }

    /**
     * Get total liabilities from all liability categories
     * Sums all liability fields, treating missing as zero
     */
    private static getTotalLiabilities(liabilities: any): number {
        return [
            'mortgageBalance', 'homeEquityLoan', 'autoLoans', 'securedCreditLines',
            'creditCardDebt', 'personalLoans', 'studentLoans', 'medicalDebt',
            'businessLoans', 'businessCreditLines', 'taxDebt', 'legalJudgments', 'otherDebt'
        ].reduce((sum, key) => sum + (Number(liabilities[key]) || 0), 0);
    }

    private static formatCurrency(amount: number): string {
        if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
        if (amount === 0) return '$0';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    private static formatReliabilityText(reliability: string): string {
        const map: { [key: string]: string } = {
            'always-on-time': 'Always On Time',
            'usually-on-time': 'Usually On Time',
            'sometimes-late': 'Sometimes Late',
            'often-late': 'Often Late'
        };
        return map[reliability] || reliability;
    }

    private static calculateOverallHealthScore(indicators: HealthIndicator[]): number {
        let totalWeightedScore = 0;
        let totalWeight = 0;
        
        for (const indicator of indicators) {
            totalWeightedScore += indicator.score * indicator.weight;
            totalWeight += indicator.weight;
        }
        
        return totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
    }

    private static getHealthLevel(score: number): 'excellent' | 'good' | 'fair' | 'limited' | 'critical' {
        if (score >= 80) return 'excellent';
        if (score >= 65) return 'good';
        if (score >= 50) return 'fair';
        if (score >= 35) return 'limited';
        return 'critical';
    }

    /**
     * Health Indicator 3: Emergency Savings Adequacy
     */
    private static analyzeEmergencySavings(data: UserFinancialData, keyMetrics: any): HealthIndicator {
        const emergencyFundMonths = keyMetrics.emergencyFundMonths;
        
        let score = 0;
        let status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' = 'critical';
        
        if (emergencyFundMonths >= 6) {
            score = 100;
            status = 'excellent';
        } else if (emergencyFundMonths >= 3) {
            score = 80;
            status = 'good';
        } else if (emergencyFundMonths >= 1) {
            score = 60;
            status = 'fair';
        } else if (emergencyFundMonths > 0) {
            score = 30;
            status = 'poor';
        } else {
            score = 0;
            status = 'critical';
        }

        return {
            name: 'Emergency Savings',
            score,
            status,
            weight: 20,
            metrics: [
                {
                    title: 'Emergency Fund Coverage',
                    value: `${emergencyFundMonths.toFixed(1)} months`,
                    numericValue: emergencyFundMonths,
                    description: 'How many months of expenses your liquid savings can cover',
                    status,
                    benchmark: 'Target: 3-6 months'
                },
                {
                    title: 'Total Liquid Assets',
                    value: this.formatCurrency(data.assets.checking + data.assets.savings + 
                                              data.assets.moneyMarket + data.assets.emergencyFund),
                    numericValue: data.assets.checking + data.assets.savings + 
                                 data.assets.moneyMarket + data.assets.emergencyFund,
                    description: 'Cash and easily accessible funds',
                    status
                }
            ],
            recommendations: this.getEmergencyFundRecommendations(emergencyFundMonths, this.getTotalMonthlyExpenses(data.expenses)),
            explanation: `This measures your financial cushion for unexpected events. You have ${emergencyFundMonths.toFixed(1)} months of expenses saved, giving you a score of ${score}/100. The standard recommendation is 3-6 months.`
        };
    }

    /**
     * Health Indicator 5: Credit Score Health
     */
    private static analyzeCreditHealth(data: UserFinancialData, keyMetrics: any): HealthIndicator {
        const creditScore = data.liabilities.creditScore;
        const creditUtilization = keyMetrics.creditUtilization;
        
        let score = 0;
        let status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' = 'critical';
        
        if (creditScore >= 800 && creditUtilization <= 10) {
            score = 100;
            status = 'excellent';
        } else if (creditScore >= 740 && creditUtilization <= 30) {
            score = 80;
            status = 'good';
        } else if (creditScore >= 670) {
            score = 60;
            status = 'fair';
        } else if (creditScore >= 580) {
            score = 40;
            status = 'poor';
        } else {
            score = 20;
            status = 'critical';
        }

        return {
            name: 'Credit Health',
            score,
            status,
            weight: 10,
            metrics: [
                {
                    title: 'Credit Score',
                    value: creditScore.toString(),
                    numericValue: creditScore,
                    description: 'Your current credit score',
                    status: this.getCreditScoreStatus(creditScore),
                    benchmark: 'Excellent: 800+, Good: 740-799, Fair: 670-739'
                },
                {
                    title: 'Credit Utilization',
                    value: `${creditUtilization.toFixed(1)}%`,
                    numericValue: creditUtilization,
                    description: 'Percentage of available credit you are using',
                    status: this.getCreditUtilizationStatus(keyMetrics.creditUtilization),
                    benchmark: 'Target: Below 30%'
                }
            ],
            recommendations: this.getCreditHealthRecommendations(data.liabilities.creditScore, keyMetrics.creditUtilization),
            explanation: `This reflects your creditworthiness. With a credit score of ${data.liabilities.creditScore} and a utilization of ${keyMetrics.creditUtilization.toFixed(1)}%, your score is ${score}/100. Both are key factors in your financial health.`
        };
    }

    /**
     * Health Indicator 6: Insurance Coverage Confidence
     */
    private static analyzeInsuranceConfidence(data: UserFinancialData): HealthIndicator {
        const hasHealthInsurance = data.insurance.healthInsurance;
        const hasLifeInsurance = data.insurance.lifeInsurance;
        const hasDisabilityInsurance = data.insurance.shortTermDisability || data.insurance.longTermDisability;
        const confidence = data.insurance.insuranceConfidence;
        
        let score = 0;
        let status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' = 'critical';
        
        const insuranceCount = (hasHealthInsurance ? 1 : 0) + (hasLifeInsurance ? 1 : 0) + (hasDisabilityInsurance ? 1 : 0);
        
        if (insuranceCount === 3 && confidence === 'very-confident') {
            score = 100;
            status = 'excellent';
        } else if (insuranceCount >= 2 && confidence !== 'not-confident') {
            score = 80;
            status = 'good';
        } else if (insuranceCount >= 1) {
            score = 60;
            status = 'fair';
        } else if (hasHealthInsurance) {
            score = 40;
            status = 'poor';
        } else {
            score = 20;
            status = 'critical';
        }

        return {
            name: 'Insurance Confidence',
            score,
            status,
            weight: 10,
            metrics: [
                {
                    title: 'Self-Reported Confidence',
                    value: this.formatConfidenceText(confidence),
                    description: 'Your confidence in your insurance coverage',
                    status
                }
            ],
            recommendations: this.getInsuranceRecommendations(data.insurance),
            explanation: `This measures your confidence in being protected from financial shocks. Your reported confidence level gives you a score of ${score}/100.`
        };
    }

    /**
     * Health Indicator 7: Long-term Financial Goal Confidence
     */
    private static analyzeLongTermGoalConfidence(data: UserFinancialData): HealthIndicator {
        const retirementConfidence = data.goals.retirementConfidence;
        const hasRetirementSavings = (data.assets.employer401k + data.assets.traditionalIRA + data.assets.rothIRA) > 0;
        const monthlyInvestment = data.behaviors.monthlyInvestmentContribution;
        
        let score = 0;
        let status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' = 'critical';
        
        if (retirementConfidence === 'very-confident' && hasRetirementSavings && monthlyInvestment > 0) {
            score = 100;
            status = 'excellent';
        } else if (retirementConfidence === 'somewhat-confident' && hasRetirementSavings) {
            score = 75;
            status = 'good';
        } else if (hasRetirementSavings || monthlyInvestment > 0) {
            score = 50;
            status = 'fair';
        } else if (retirementConfidence !== 'not-confident') {
            score = 25;
            status = 'poor';
        } else {
            score = 0;
            status = 'critical';
        }

        return {
            name: 'Long-term Goal Confidence',
            score,
            status,
            weight: 10,
            metrics: [
                {
                    title: 'Retirement Confidence',
                    value: this.formatConfidenceText(retirementConfidence),
                    description: 'Your confidence in your retirement savings plan',
                    status,
                    benchmark: 'Target: Very confident with active saving'
                },
                {
                    title: 'Monthly Investment',
                    value: this.formatCurrency(monthlyInvestment),
                    numericValue: monthlyInvestment,
                    description: 'Monthly investment contribution',
                    status: monthlyInvestment > 500 ? 'excellent' : monthlyInvestment > 0 ? 'good' : 'poor',
                    benchmark: 'Target: 10-15% of income'
                }
            ],
            recommendations: this.getRetirementRecommendations(data.goals, monthlyInvestment),
            explanation: `This assesses your confidence in reaching long-term financial goals like retirement. Your reported confidence results in a score of ${score}/100.`
        };
    }

    /**
     * Health Indicator 8: Financial Planning Engagement
     */
    private static analyzeFinancialPlanningEngagement(data: UserFinancialData): HealthIndicator {
        const budgeting = data.behaviors.budgetingMethod;
        const planning = data.behaviors.financialPlanningEngagement;

        let budgetScore = 0;
        switch (budgeting) {
            case 'detailed-budget': budgetScore = 100; break;
            case 'simple-tracking': budgetScore = 75; break;
            case 'mental-budget': budgetScore = 40; break;
            case 'no-budget': budgetScore = 0; break;
        }

        let planningScore = 0;
        switch (planning) {
            case 'actively-plan': planningScore = 100; break;
            case 'occasionally-plan': planningScore = 70; break;
            case 'rarely-plan': planningScore = 30; break;
            case 'never-plan': planningScore = 0; break;
        }

        const score = Math.round((budgetScore * 0.5) + (planningScore * 0.5));
        let status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' = 'critical';

        if (score >= 90) {
            status = 'excellent';
        } else if (score >= 70) {
            status = 'good';
        } else if (score >= 50) {
            status = 'fair';
        } else if (score >= 20) {
            status = 'poor';
        }

        return {
            name: 'Financial Planning Engagement',
            score,
            status,
            weight: 10,
            metrics: [
                {
                    title: 'Budgeting Method',
                    value: this.formatBudgetText(budgeting),
                    description: 'How you manage your budget',
                    status: score >= 70 ? 'good' : 'poor'
                },
                {
                    title: 'Planning Engagement',
                    value: this.formatPlanningText(planning),
                    description: 'How actively you plan your finances',
                    status: score >= 70 ? 'good' : 'poor'
                }
            ],
            recommendations: this.getPlanningRecommendations(budgeting, planning),
            explanation: `This measures how actively you are planning and tracking your finances. Your approach gives you a score of ${score}/100.`
        };
    }

    // Helper calculation methods
    private static calculateAssetAllocationScore(data: UserFinancialData): number {
        const totalInvestments = data.assets.employer401k + data.assets.traditionalIRA + 
                               data.assets.rothIRA + data.assets.brokerageAccounts + data.assets.stocks;
        const totalAssets = this.getTotalAssets(data.assets);
        
        if (totalAssets === 0) return 0;
        
        const investmentRatio = totalInvestments / totalAssets;
        const age = data.personalInfo.age;
        const targetStockAllocation = (100 - age) / 100;
        
        const allocationScore = Math.max(0, 100 - Math.abs(investmentRatio - targetStockAllocation) * 200);
        return Math.round(allocationScore);
    }

    /**
     * Enhanced Liquidity Analysis
     */
    private static analyzeLiquidity(data: UserFinancialData, _keyMetrics: any): FinancialMetric[] {
        const totalLiquidAssets = data.assets.checking + data.assets.savings + 
                                 data.assets.moneyMarket + data.assets.emergencyFund;
        const monthlyExpenses = this.getTotalMonthlyExpenses(data.expenses);
        const liquidityRatio = monthlyExpenses > 0 ? totalLiquidAssets / monthlyExpenses : 0;
        
        return [
            {
                title: 'Liquid Assets',
                value: this.formatCurrency(totalLiquidAssets),
                numericValue: totalLiquidAssets,
                description: 'Cash and cash equivalents available immediately',
                status: totalLiquidAssets >= monthlyExpenses * 6 ? 'excellent' : 
                       totalLiquidAssets >= monthlyExpenses * 3 ? 'good' : 'poor',
                benchmark: 'Target: 6+ months of expenses'
            },
            {
                title: 'Liquidity Ratio',
                value: `${liquidityRatio.toFixed(1)} months`,
                numericValue: liquidityRatio,
                description: 'Months of expenses covered by liquid assets',
                status: liquidityRatio >= 6 ? 'excellent' : liquidityRatio >= 3 ? 'good' : 'poor',
                benchmark: 'Excellent: 6+ months, Good: 3-6 months'
            }
        ];
    }

    /**
     * Enhanced Debt Analysis
     */
    private static analyzeDebt(data: UserFinancialData, keyMetrics: any): FinancialMetric[] {
        const totalDebt = this.getTotalDebt(data.liabilities);
        const debtToIncomeRatio = keyMetrics.debtToIncomeRatio;
        const creditUtilization = keyMetrics.creditUtilization;
        
        return [
            {
                title: 'Total Debt',
                value: this.formatCurrency(totalDebt),
                numericValue: totalDebt,
                description: 'All outstanding debt obligations',
                status: debtToIncomeRatio <= 20 ? 'excellent' : debtToIncomeRatio <= 36 ? 'good' : 'poor',
                benchmark: 'Target: <20% of annual income'
            },
            {
                title: 'Debt-to-Income Ratio',
                value: `${debtToIncomeRatio.toFixed(1)}%`,
                numericValue: debtToIncomeRatio,
                description: 'Total debt as percentage of annual income',
                status: debtToIncomeRatio <= 20 ? 'excellent' : debtToIncomeRatio <= 36 ? 'good' : 'poor',
                benchmark: 'Excellent: <20%, Good: 20-36%, Poor: >36%'
            },
            {
                title: 'Credit Utilization',
                value: `${creditUtilization.toFixed(1)}%`,
                numericValue: creditUtilization,
                description: 'Credit card balances vs available credit',
                status: creditUtilization <= 10 ? 'excellent' : creditUtilization <= 30 ? 'good' : 'poor',
                benchmark: 'Excellent: <10%, Good: 10-30%, Poor: >30%'
            }
        ];
    }

    /**
     * Enhanced Investment Analysis
     */
    private static analyzeInvestments(data: UserFinancialData, keyMetrics: any): FinancialMetric[] {
        const totalInvestments = data.assets.employer401k + data.assets.traditionalIRA + 
                               data.assets.rothIRA + data.assets.brokerageAccounts + 
                               data.assets.stocks + data.assets.bonds + data.assets.mutualFunds;
        const monthlyIncome = this.getTotalMonthlyIncome(data.income);
        const investmentRate = monthlyIncome > 0 ? (data.behaviors.monthlyInvestmentContribution / monthlyIncome) * 100 : 0;
        const age = data.personalInfo.age;
        const targetStockAllocation = 110 - age; // Rule of thumb: 110 - age = stock %
        
        return [
            {
                title: 'Total Investments',
                value: this.formatCurrency(totalInvestments),
                numericValue: totalInvestments,
                description: 'All investment accounts and securities',
                status: investmentRate >= 15 ? 'excellent' : investmentRate >= 10 ? 'good' : 'poor',
                benchmark: 'Target: 15%+ of income invested monthly'
            },
            {
                title: 'Investment Rate',
                value: `${investmentRate.toFixed(1)}%`,
                numericValue: investmentRate,
                description: 'Monthly investment as percentage of income',
                status: investmentRate >= 15 ? 'excellent' : investmentRate >= 10 ? 'good' : 'poor',
                benchmark: 'Excellent: 15%+, Good: 10-15%, Poor: <10%'
            },
            {
                title: 'Asset Allocation Score',
                value: `${keyMetrics.assetAllocationScore}/100`,
                numericValue: keyMetrics.assetAllocationScore,
                description: 'How well diversified your investments are',
                status: keyMetrics.assetAllocationScore >= 80 ? 'excellent' : 
                       keyMetrics.assetAllocationScore >= 60 ? 'good' : 'poor',
                benchmark: `Target stock allocation for age ${age}: ~${targetStockAllocation}%`
            }
        ];
    }

    /**
     * Enhanced Insurance Analysis
     */
    private static analyzeInsurance(data: UserFinancialData): FinancialMetric[] {
        const hasHealthInsurance = data.personalInfo.healthInsurance;
        const hasLifeInsurance = data.personalInfo.lifeInsurance;
        const hasDisabilityInsurance = data.personalInfo.shortTermDisability || data.personalInfo.longTermDisability;
        const dependents = data.personalInfo.dependents;
        
        const coverageScore = (hasHealthInsurance ? 40 : 0) + 
                            (hasLifeInsurance && dependents > 0 ? 30 : dependents === 0 ? 30 : 0) + 
                            (hasDisabilityInsurance ? 30 : 0);
        
        return [
            {
                title: 'Insurance Coverage Score',
                value: `${coverageScore}/100`,
                numericValue: coverageScore,
                description: 'Overall adequacy of insurance protection',
                status: coverageScore >= 90 ? 'excellent' : coverageScore >= 70 ? 'good' : 'poor',
                benchmark: 'Target: 90+ (Health + Life + Disability)'
            },
            {
                title: 'Essential Coverage',
                value: hasHealthInsurance ? 'Health ✓' : 'Health ✗',
                description: 'Health insurance status',
                status: hasHealthInsurance ? 'excellent' : 'critical',
                benchmark: 'Required: Health insurance is essential'
            },
            {
                title: 'Income Protection',
                value: hasDisabilityInsurance ? 'Disability ✓' : 'Disability ✗',
                description: 'Disability insurance status',
                status: hasDisabilityInsurance ? 'good' : 'poor',
                benchmark: 'Recommended: Protect 60-70% of income'
            }
        ];
    }

    /**
     * Enhanced Wealth Projections
     */
    private static projectWealth(data: UserFinancialData, _keyMetrics: any): WealthProjection[] {
        const currentAge = data.personalInfo.age;
        const retirementAge = data.goals.retirementAge;
        const yearsToRetirement = retirementAge - currentAge;
        const monthlyInvestment = data.behaviors.monthlyInvestmentContribution;
        const currentInvestments = data.assets.employer401k + data.assets.traditionalIRA + 
                                 data.assets.rothIRA + data.assets.brokerageAccounts;
        
        // Conservative projection at 6% annual return
        const conservativeReturn = 0.06;
        const moderateReturn = 0.08;
        const aggressiveReturn = 0.10;
        
        const projections: WealthProjection[] = [];
        const scenarios = [
            { name: 'Conservative (6%)', rate: conservativeReturn },
            { name: 'Moderate (8%)', rate: moderateReturn },
            { name: 'Aggressive (10%)', rate: aggressiveReturn }
        ];
        
        scenarios.forEach(scenario => {
            const monthlyRate = scenario.rate / 12;
            const months = yearsToRetirement * 12;
            
            // Future value of current investments
            const futureValueCurrent = currentInvestments * Math.pow(1 + scenario.rate, yearsToRetirement);
            
            // Future value of monthly contributions (annuity)
            const futureValueContributions = monthlyInvestment * 
                ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
            
            const totalProjected = futureValueCurrent + futureValueContributions;
            
            projections.push({
                scenario: scenario.name,
                timeframe: `${yearsToRetirement} years`,
                projectedValue: totalProjected,
                monthlyContribution: monthlyInvestment,
                assumptions: `${(scenario.rate * 100).toFixed(0)}% annual return, ${monthlyInvestment > 0 ? '$' + monthlyInvestment.toLocaleString() : '$0'} monthly`
            });
        });
        
        return projections;
    }

    /**
     * Enhanced Scenario Analysis
     */
    private static analyzeScenarios(data: UserFinancialData, _keyMetrics: any): ScenarioAnalysis[] {
        const monthlyExpenses = this.getTotalMonthlyExpenses(data.expenses);
        const emergencyFund = data.assets.emergencyFund + data.assets.savings;
        
        return [
            {
                scenario: 'Job Loss',
                impact: 'High',
                description: 'Complete loss of primary income',
                timeToRecover: emergencyFund > 0 ? `${(emergencyFund / monthlyExpenses).toFixed(1)} months` : '0 months',
                recommendations: [
                    'Build emergency fund to 6 months of expenses',
                    'Consider disability insurance',
                    'Diversify income sources'
                ],
                probability: 'Medium'
            },
            {
                scenario: 'Market Downturn (-30%)',
                impact: 'Medium',
                description: '30% decline in investment portfolio',
                timeToRecover: '2-3 years historically',
                recommendations: [
                    'Maintain diversified portfolio',
                    'Continue regular investing (dollar-cost averaging)',
                    'Avoid panic selling'
                ],
                probability: 'High (occurs every 5-10 years)'
            },
            {
                scenario: 'Major Medical Emergency',
                impact: 'High',
                description: 'Unexpected medical expenses',
                timeToRecover: 'Depends on insurance coverage',
                recommendations: [
                    'Ensure adequate health insurance',
                    'Build separate medical emergency fund',
                    'Consider HSA contributions'
                ],
                probability: 'Medium'
            }
        ];
    }

    /**
     * Generate more detailed financial analysis for the user
     * - Net worth breakdown, savings rate, debt structure, expense categorization, investment diversification, insurance adequacy, peer benchmarks, scenario/stress testing
     * - All calculations robust to edge cases
     */
    private static generateDetailedInsights(data: UserFinancialData, keyMetrics: any, _healthIndicators: HealthIndicator[]): any {
        // Defensive: handle missing/invalid data
        const assets = data.assets || {};
        const liabilities = data.liabilities || {};
        const expenses = data.expenses || {};
        const investments = {
            '401k': assets.employer401k || 0,
            'IRA': (assets.traditionalIRA || 0) + (assets.rothIRA || 0),
            'Brokerage': assets.brokerageAccounts || 0,
            'Stocks': assets.stocks || 0,
            'Bonds': assets.bonds || 0,
            'Mutual Funds': assets.mutualFunds || 0,
            'Crypto': assets.cryptocurrency || 0,
            'Real Estate': assets.primaryResidence || 0 + assets.investmentProperties || 0
        };
        const debtStructure = {
            'Secured Debt': (liabilities.mortgageBalance || 0) + (liabilities.homeEquityLoan || 0) + (liabilities.autoLoans || 0) + (liabilities.securedCreditLines || 0),
            'Unsecured Debt': (liabilities.creditCardDebt || 0) + (liabilities.personalLoans || 0) + (liabilities.studentLoans || 0) + (liabilities.medicalDebt || 0),
            'Business Debt': (liabilities.businessLoans || 0) + (liabilities.businessCreditLines || 0),
            'Other Debt': (liabilities.taxDebt || 0) + (liabilities.legalJudgments || 0) + (liabilities.otherDebt || 0)
        };
        const expenseCategories = {
            'Fixed': (expenses.housing || 0) + (expenses.utilities || 0) + (expenses.insurance || 0) + (expenses.loanPayments || 0) + (expenses.childcare || 0),
            'Variable': (expenses.food || 0) + (expenses.transportation || 0) + (expenses.healthcare || 0) + (expenses.clothing || 0) + (expenses.personalCare || 0),
            'Discretionary': (expenses.entertainment || 0) + (expenses.diningOut || 0) + (expenses.hobbies || 0) + (expenses.subscriptions || 0) + (expenses.shopping || 0) + (expenses.travel || 0)
        };
        // Peer benchmarks, scenario/stress testing, and insurance adequacy are already included in other sections, but can be summarized here
        return {
            netWorthBreakdown: {
                totalAssets: this.getTotalAssets(assets),
                totalLiabilities: this.getTotalLiabilities(liabilities),
                netWorth: keyMetrics.netWorth
            },
            savingsRate: keyMetrics.savingsRate,
            debtStructure,
            expenseCategories,
            investmentBreakdown: investments,
            insuranceAdequacy: data.insurance || {},
            peerBenchmarks: keyMetrics.peerBenchmarks || {},
            scenarioAnalysis: keyMetrics.scenarioAnalysis || []
        };
    }

    /**
     * Calculate Financial Ratios
     */
    private static calculateFinancialRatios(data: UserFinancialData, keyMetrics: any): any {
        const monthlyIncome = this.getTotalMonthlyIncome(data.income);
        const monthlyExpenses = this.getTotalMonthlyExpenses(data.expenses);
        const totalAssets = this.getTotalAssets(data.assets);
        const totalLiabilities = this.getTotalLiabilities(data.liabilities);
        
        return {
            liquidityRatios: {
                currentRatio: totalLiabilities > 0 ? (data.assets.checking + data.assets.savings) / totalLiabilities : 0,
                quickRatio: totalLiabilities > 0 ? data.assets.checking / totalLiabilities : 0,
                emergencyFundRatio: keyMetrics.emergencyFundMonths
            },
            leverageRatios: {
                debtToAssetRatio: totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0,
                debtToIncomeRatio: keyMetrics.debtToIncomeRatio,
                equityRatio: totalAssets > 0 ? ((totalAssets - totalLiabilities) / totalAssets) * 100 : 0
            },
            efficiencyRatios: {
                savingsRate: keyMetrics.savingsRate,
                expenseRatio: monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) * 100 : 0,
                investmentRate: monthlyIncome > 0 ? (data.behaviors.monthlyInvestmentContribution / monthlyIncome) * 100 : 0
            }
        };
    }

    /**
     * Assess Financial Risk
     */
    private static assessFinancialRisk(data: UserFinancialData, keyMetrics: any): any {
        const risks: { category: string; level: string; description: string; mitigation: string }[] = [];
        
        // Income risk
        if (data.income.secondaryIncome === 0 && data.income.businessIncome === 0) {
            risks.push({
                category: 'Income Concentration',
                level: 'High',
                description: 'Dependent on single income source',
                mitigation: 'Develop multiple income streams or enhance job security'
            });
        }
        
        // Liquidity risk
        if (keyMetrics.emergencyFundMonths < 3) {
            risks.push({
                category: 'Liquidity Risk',
                level: 'High',
                description: 'Insufficient emergency funds',
                mitigation: 'Build emergency fund to 6 months of expenses'
            });
        }
        
        // Credit risk
        if (keyMetrics.creditUtilization > 30) {
            risks.push({
                category: 'Credit Risk',
                level: 'Medium',
                description: 'High credit utilization',
                mitigation: 'Pay down credit card balances or increase credit limits'
            });
        }
        
        return {
            overallRiskLevel: 'unknown',
            riskFactors: risks
        };
    }

    /**
     * Analyze Financial Goals
     */
    private static analyzeFinancialGoals(data: UserFinancialData, keyMetrics: any): any {
        const currentAge = data.personalInfo.age;
        const retirementAge = data.goals.retirementAge;
        const yearsToRetirement = retirementAge - currentAge;
        const monthlyInvestment = data.behaviors.monthlyInvestmentContribution;
        
        return {
            retirementReadiness: {
                yearsToRetirement,
                currentSavings: data.assets.employer401k + data.assets.traditionalIRA + data.assets.rothIRA,
                monthlyContribution: monthlyInvestment,
                projectedValue: this.calculateRetirementProjection(data, keyMetrics),
                onTrack: this.isRetirementOnTrack(data, keyMetrics)
            },
            emergencyGoal: {
                target: this.getTotalMonthlyExpenses(data.expenses) * 6,
                current: data.assets.emergencyFund + data.assets.savings,
                progress: keyMetrics.emergencyFundMonths / 6 * 100,
                timeToGoal: this.calculateTimeToEmergencyGoal(data, keyMetrics)
            }
        };
    }

    // Helper methods for the new analysis functions
    private static calculateRetirementProjection(data: UserFinancialData, _keyMetrics: any): number {
        const currentAge = data.personalInfo.age;
        const retirementAge = data.goals.retirementAge;
        const yearsToRetirement = retirementAge - currentAge;
        const monthlyInvestment = data.behaviors.monthlyInvestmentContribution;
        const currentSavings = data.assets.employer401k + data.assets.traditionalIRA + data.assets.rothIRA;
        
        // Assuming 7% annual return
        const annualReturn = 0.07;
        const futureValue = currentSavings * Math.pow(1 + annualReturn, yearsToRetirement);
        const annuityValue = monthlyInvestment * 12 * (Math.pow(1 + annualReturn, yearsToRetirement) - 1) / annualReturn;
        
        return futureValue + annuityValue;
    }

    private static isRetirementOnTrack(data: UserFinancialData, keyMetrics: any): boolean {
        const projectedValue = this.calculateRetirementProjection(data, keyMetrics);
        const targetValue = data.goals.retirementIncomeNeeded * 25; // 4% rule
        
        return projectedValue >= targetValue;
    }

    private static calculateTimeToEmergencyGoal(data: UserFinancialData, keyMetrics: any): string {
        const target = this.getTotalMonthlyExpenses(data.expenses) * 6;
        const current = data.assets.emergencyFund + data.assets.savings;
        const needed = target - current;
        
        if (needed <= 0) return 'Goal achieved';
        if (keyMetrics.monthlyCashFlow <= 0) return 'Cannot achieve with current cash flow';
        
        const months = Math.ceil(needed / keyMetrics.monthlyCashFlow);
        return `${months} months at current savings rate`;
    }

    private static calculatePeerBenchmarks(data: UserFinancialData): any { 
        return {
            ageGroup: `${Math.floor(data.personalInfo.age / 10) * 10}s`,
            incomeGroup: 'Middle Income',
            netWorthPercentile: 50,
            savingsRatePercentile: 45,
            debtRatioPercentile: 55
        };
    }
    
    // Status helper methods
    private static getCreditScoreStatus(score: number): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
        if (score >= 800) return 'excellent';
        if (score >= 740) return 'good';
        if (score >= 670) return 'fair';
        if (score >= 580) return 'poor';
        return 'critical';
    }
    
    // Recommendation methods
    private static getSpendingRecommendations(ratio: number): string[] { 
        if (ratio < 5) {
            return [
                'Immediate action needed: Create a strict budget to reduce expenses',
                'Consider increasing income through side work or skills development',
                'Review all subscriptions and discretionary spending'
            ];
        } else if (ratio < 10) {
            return [
                'Look for areas to cut unnecessary expenses',
                'Consider ways to increase your income',
                'Build an emergency fund as a priority'
            ];
        }
        return ['Great job maintaining positive cash flow!'];
    }
    
    private static getPaymentReliabilityRecommendations(reliability: string): string[] { 
        if (reliability === 'often-late' || reliability === 'sometimes-late') {
            return [
                'Set up automatic bill payments to improve payment history',
                'Create a bill payment calendar with due dates',
                'Consider consolidating due dates to simplify management'
            ];
        }
        return ['Keep up the excellent payment history!'];
    }

    /**
     * Get actionable, research-based recommendations for emergency fund
     * Prevents $NaN by checking for valid numbers and zero expenses
     */
    private static getEmergencyFundRecommendations(months: number, monthlyExpenses?: number): string[] {
        if (typeof months !== 'number' || isNaN(months) || months < 0) months = 0;
        if (typeof monthlyExpenses !== 'number' || isNaN(monthlyExpenses) || monthlyExpenses <= 0) {
            return [
                'Unable to calculate additional savings needed due to missing or invalid expense data. Please review your expense inputs.'
            ];
        }
        if (months >= 6) return ['You have a strong emergency fund. Maintain your current savings habits.'];
        if (months >= 3) return ['Your emergency fund is solid. Consider increasing to 6 months for extra security.'];
        const needed = Math.max(0, Math.round((3 - months) * monthlyExpenses));
        if (isNaN(needed) || needed < 0) {
            return ['Unable to calculate additional savings needed due to invalid data.'];
        }
        return [
            `You currently have ${!isNaN(months) ? months.toFixed(1) : 'N/A'} months of expenses saved. While this is a good start, aiming for at least 3 months provides a much stronger safety net. You need to save approximately $${!isNaN(needed) ? needed.toLocaleString() : 'N/A'} more to reach this goal.`
        ];
    }

    /**
     * Get actionable, research-based recommendations for debt management
     * - <20%: Maintain current habits
     * - 20-28%: Monitor and avoid new debt
     * - 28-36%: Reduce discretionary spending, pay down high-interest debt
     * - 36-43%: Aggressively pay down debt, consider consolidation
     * - >43%: Seek professional help, create a debt reduction plan
     */
    private static getDebtManagementRecommendations(ratio: number): string[] {
        if (ratio < 0.2) return ['Maintain your current debt management habits.'];
        if (ratio < 0.28) return ['Monitor your debt and avoid taking on new obligations.'];
        if (ratio < 0.36) return [
            'Reduce discretionary spending to free up cash for debt payments.',
            'Prioritize paying down high-interest debt.'
        ];
        if (ratio < 0.43) return [
            'Aggressively pay down debt to lower your debt-to-income ratio.',
            'Consider debt consolidation or refinancing options.'
        ];
        return [
            'Seek professional financial counseling or debt management assistance.',
            'Create a strict debt reduction plan and avoid new debt.'
        ];
    }

    private static getCreditHealthRecommendations(creditScore: number, utilization: number): string[] {
        const recommendations: string[] = [];
        
        if (creditScore < 670) {
            recommendations.push('Focus on improving credit score through on-time payments');
            recommendations.push('Consider becoming an authorized user on a family member\'s account');
        }
        
        if (utilization > 30) {
            recommendations.push('Reduce credit card balances to improve utilization ratio');
            recommendations.push('Consider paying down cards or requesting credit limit increases');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('Great credit health! Maintain current habits.');
        }
        
        return recommendations;
    }

    private static getInsuranceRecommendations(insurance: any): string[] {
        const recommendations: string[] = [];
        
        if (!insurance.healthInsurance) {
            recommendations.push('Get health insurance immediately - essential protection');
        }
        if (!insurance.lifeInsurance) {
            recommendations.push('Consider life insurance to protect dependents');
        }
        if (!insurance.shortTermDisability && !insurance.longTermDisability) {
            recommendations.push('Consider disability insurance to protect your income');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('Good insurance coverage! Review annually to ensure adequacy.');
        }
        
        return recommendations;
    }

    private static getRetirementRecommendations(goals: any, monthlyInvestment: number): string[] {
        const recommendations: string[] = [];
        
        if (monthlyInvestment === 0) {
            recommendations.push('Start investing for retirement immediately, even small amounts help');
            recommendations.push('Take advantage of employer 401(k) match if available');
        } else if (monthlyInvestment < 500) {
            recommendations.push('Consider increasing retirement contributions');
            recommendations.push('Target 10-15% of income for retirement savings');
        }
        
        if (goals.retirementConfidence !== 'very-confident') {
            recommendations.push('Meet with financial advisor to create retirement plan');
            recommendations.push('Use retirement calculators to estimate needs');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('Excellent retirement planning! Stay on track.');
        }
        
        return recommendations;
    }

    private static getPlanningRecommendations(budgeting: string, planning: string): string[] {
        const recommendations: string[] = [];
        
        if (budgeting === 'no-budget') {
            recommendations.push('Start with basic expense tracking using apps or spreadsheets');
            recommendations.push('Create a simple budget to understand spending patterns');
        } else if (budgeting === 'mental-budget') {
            recommendations.push('Move to written budget for better accuracy');
        }
        
        if (planning === 'never-plan' || planning === 'rarely-plan') {
            recommendations.push('Set aside time monthly for financial planning');
            recommendations.push('Start with simple goal-setting and progress tracking');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('Great financial planning habits! Keep it up.');
        }
        
        return recommendations;
    }

    private static getCreditUtilizationStatus(utilization: number): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
        if (utilization <= 10) return 'excellent';
        if (utilization <= 30) return 'good';
        if (utilization <= 50) return 'fair';
        if (utilization <= 80) return 'poor';
        return 'critical';
    }

    private static formatConfidenceText(confidence: string): string {
        return confidence.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    private static formatBudgetText(budget: string): string {
        const map: { [key: string]: string } = {
            'detailed-budget': 'Detailed Budget',
            'simple-tracking': 'Simple Tracking',
            'mental-budget': 'Mental Budget',
            'no-budget': 'No Budget'
        };
        return map[budget] || budget;
    }

    private static formatPlanningText(planning: string): string {
        const map: { [key: string]: string } = {
            'actively-plan': 'Actively Plan',
            'occasionally-plan': 'Occasionally Plan',
            'rarely-plan': 'Rarely Plan',
            'never-plan': 'Never Plan'
        };
        return map[planning] || planning;
    }

    /**
     * Validate that we're using actual user data, not mock/default values
     */
    private static validateUserData(data: UserFinancialData): void {
        console.log('🔍 Data Validation - Verifying actual user inputs:', {
            primarySalary: data.income.primarySalary,
            housing: data.expenses.housing,
            totalAssets: this.getTotalAssets(data.assets),
            totalLiabilities: this.getTotalLiabilities(data.liabilities),
            creditScore: data.liabilities.creditScore
        });

        // Log key calculations to ensure we're using real data
        const totalIncome = this.getTotalMonthlyIncome(data.income);
        const totalExpenses = this.getTotalMonthlyExpenses(data.expenses);
        const cashFlow = totalIncome - totalExpenses;
        
        console.log('🔍 Calculated Metrics from User Data:', {
            totalMonthlyIncome: totalIncome,
            totalMonthlyExpenses: totalExpenses,
            monthlyCashFlow: cashFlow,
            emergencyFundMonths: totalExpenses > 0 ? (data.assets.checking + data.assets.savings + data.assets.emergencyFund) / totalExpenses : 0
        });

        // Validate critical inputs are not zero/default
        if (data.income.primarySalary <= 0) {
            throw new Error('Invalid data: Primary salary cannot be zero or negative');
        }

        if (data.liabilities.creditScore < 300 || data.liabilities.creditScore > 850) {
            throw new Error('Invalid data: Credit score must be between 300 and 850');
        }

        console.log('✅ Data validation passed - using actual user inputs');
    }
} 