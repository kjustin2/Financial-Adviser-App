import { UserFinancialData, UserBehaviorData, MarketDataPoint } from '../types';

/**
 * Represents a financial trend prediction
 */
export interface TrendPrediction {
    metric: string;
    currentValue: number;
    predictedValue: number;
    confidence: number; // 0-1
    timeframe: 'monthly' | 'quarterly' | 'annually';
    trend: 'increasing' | 'decreasing' | 'stable';
    changeRate: number; // Percentage change
    factors: string[]; // Contributing factors
    riskLevel: 'low' | 'medium' | 'high';
}

/**
 * Historical data point for trend analysis
 */
export interface HistoricalDataPoint {
    timestamp: Date;
    value: number;
    context: string;
    metadata: Record<string, any>;
}

/**
 * Trend analysis configuration
 */
export interface TrendAnalysisConfig {
    lookbackPeriods: number; // Number of historical periods to analyze
    confidenceThreshold: number; // Minimum confidence for predictions
    seasonalityEnabled: boolean;
    volatilityAdjustment: boolean;
    behaviorWeighting: number; // 0-1, how much to weight behavior patterns
}

/**
 * Seasonal pattern detection
 */
export interface SeasonalPattern {
    pattern: 'monthly' | 'quarterly' | 'yearly';
    amplitude: number;
    phase: number;
    strength: number; // 0-1
}

/**
 * Financial Trend Prediction Engine
 * Analyzes historical patterns and predicts future financial trends
 */
export class FinancialTrendEngine {
    private config: TrendAnalysisConfig;
    private historicalData: Map<string, HistoricalDataPoint[]> = new Map();

    constructor(config: Partial<TrendAnalysisConfig> = {}) {
        this.config = {
            lookbackPeriods: 12,
            confidenceThreshold: 0.6,
            seasonalityEnabled: true,
            volatilityAdjustment: true,
            behaviorWeighting: 0.3,
            ...config
        };
    }

    /**
     * Predict comprehensive financial trends for a user
     */
    public predictFinancialTrends(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        historicalFinancialData?: HistoricalDataPoint[],
        marketData?: MarketDataPoint[]
    ): TrendPrediction[] {
        const predictions: TrendPrediction[] = [];

        // Income trend prediction
        predictions.push(this.predictIncomeTrend(financialData, behaviorData, historicalFinancialData));

        // Spending trend prediction
        predictions.push(this.predictSpendingTrend(financialData, behaviorData, historicalFinancialData));

        // Savings trend prediction
        predictions.push(this.predictSavingsTrend(financialData, behaviorData, historicalFinancialData));

        // Investment performance prediction
        predictions.push(this.predictInvestmentTrend(financialData, behaviorData, marketData));

        // Debt reduction trend
        predictions.push(this.predictDebtTrend(financialData, behaviorData, historicalFinancialData));

        // Net worth growth prediction
        predictions.push(this.predictNetWorthTrend(financialData, behaviorData, historicalFinancialData));

        return predictions.filter(p => p.confidence >= this.config.confidenceThreshold);
    }

    /**
     * Add historical data for trend analysis
     */
    public addHistoricalData(metric: string, dataPoints: HistoricalDataPoint[]): void {
        this.historicalData.set(metric, dataPoints);
    }

    /**
     * Predict income trend based on employment stability and growth patterns
     */
    private predictIncomeTrend(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        _historicalData?: HistoricalDataPoint[]
    ): TrendPrediction {
        const currentIncome = this.calculateTotalMonthlyIncome(financialData);
        const employmentFactor = this.getEmploymentStabilityFactor(financialData);
        const experienceFactor = this.getExperienceGrowthFactor(financialData);
        const marketFactor = this.getMarketConditionFactor();
        
        let baseGrowthRate = financialData.income.incomeGrowthRate / 100;
        
        // Adjust for employment stability
        baseGrowthRate *= employmentFactor;
        
        // Adjust for experience and age
        baseGrowthRate *= experienceFactor;
        
        // Adjust for market conditions
        baseGrowthRate *= marketFactor;

        // Apply behavioral adjustments
        if (behaviorData.planningBehavior.goalSettingClarity > 0.7) {
            baseGrowthRate *= 1.1; // Better planning leads to better income growth
        }

        const predictedIncome = currentIncome * (1 + baseGrowthRate);
        const confidence = this.calculateIncomeConfidence(financialData, baseGrowthRate);

        return {
            metric: 'Monthly Income',
            currentValue: currentIncome,
            predictedValue: predictedIncome,
            confidence,
            timeframe: 'annually',
            trend: baseGrowthRate > 0.01 ? 'increasing' : baseGrowthRate < -0.01 ? 'decreasing' : 'stable',
            changeRate: baseGrowthRate * 100,
            factors: this.getIncomeFactors(financialData, behaviorData),
            riskLevel: this.assessIncomeRiskLevel(financialData)
        };
    }

    /**
     * Predict spending trends based on historical patterns and behavioral factors
     */
    private predictSpendingTrend(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        _historicalData?: HistoricalDataPoint[]
    ): TrendPrediction {
        const currentSpending = this.calculateTotalMonthlyExpenses(financialData);
        let spendingGrowthRate = 0.03; // Base inflation adjustment
        
        // Behavioral adjustments
        if (behaviorData.planningBehavior.impulsiveDecisions > 0.6) {
            spendingGrowthRate += 0.02; // Higher spending growth for impulsive behavior
        }

        if (behaviorData.planningBehavior.budgetingConsistency > 0.7) {
            spendingGrowthRate -= 0.01; // Better budgeting controls spending growth
        }

        // Life stage adjustments
        const age = financialData.personalInfo.age;
        if (age < 35) {
            spendingGrowthRate += 0.015; // Young adults tend to increase spending
        } else if (age > 55) {
            spendingGrowthRate -= 0.01; // Pre-retirees often reduce spending
        }

        // Family size impact
        const dependents = financialData.personalInfo.dependents;
        spendingGrowthRate += dependents * 0.005; // Each dependent adds spending pressure

        const predictedSpending = currentSpending * (1 + spendingGrowthRate);
        const confidence = this.calculateSpendingConfidence(financialData, behaviorData);

        return {
            metric: 'Monthly Expenses',
            currentValue: currentSpending,
            predictedValue: predictedSpending,
            confidence,
            timeframe: 'annually',
            trend: spendingGrowthRate > 0.005 ? 'increasing' : spendingGrowthRate < -0.005 ? 'decreasing' : 'stable',
            changeRate: spendingGrowthRate * 100,
            factors: this.getSpendingFactors(financialData, behaviorData),
            riskLevel: this.assessSpendingRiskLevel(financialData, behaviorData)
        };
    }

    /**
     * Predict savings trends based on income vs spending patterns
     */
    private predictSavingsTrend(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        _historicalData?: HistoricalDataPoint[]
    ): TrendPrediction {
        const currentSavingsRate = this.calculateSavingsRate(financialData);
        let savingsGrowthRate = 0;

        // Behavioral factors
        if (behaviorData.planningBehavior.goalSettingClarity > 0.7) {
            savingsGrowthRate += 0.02; // Good planning improves savings
        }

        if (behaviorData.planningBehavior.longTermThinking > 0.6) {
            savingsGrowthRate += 0.015; // Long-term thinking improves savings
        }

        // Age-based savings behavior
        const age = financialData.personalInfo.age;
        if (age >= 45 && age <= 65) {
            savingsGrowthRate += 0.01; // Peak earning and saving years
        }

        // Automatic savings boost
        if (financialData.behaviors.automaticSavings) {
            savingsGrowthRate += 0.01;
        }

        const currentSavings = currentSavingsRate * this.calculateTotalMonthlyIncome(financialData);
        const predictedSavings = currentSavings * (1 + savingsGrowthRate);
        const confidence = this.calculateSavingsConfidence(financialData, behaviorData);

        return {
            metric: 'Monthly Savings',
            currentValue: currentSavings,
            predictedValue: predictedSavings,
            confidence,
            timeframe: 'annually',
            trend: savingsGrowthRate > 0.005 ? 'increasing' : savingsGrowthRate < -0.005 ? 'decreasing' : 'stable',
            changeRate: savingsGrowthRate * 100,
            factors: this.getSavingsFactors(financialData, behaviorData),
            riskLevel: this.assessSavingsRiskLevel(financialData, behaviorData)
        };
    }

    /**
     * Predict investment performance trends
     */
    private predictInvestmentTrend(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        _marketData?: MarketDataPoint[]
    ): TrendPrediction {
        const currentInvestments = this.calculateTotalInvestments(financialData);
        let expectedReturn = 0.07; // Base market return assumption

        // Risk tolerance adjustments
        switch (financialData.goals.riskTolerance) {
            case 'conservative':
                expectedReturn = 0.05;
                break;
            case 'moderate':
                expectedReturn = 0.07;
                break;
            case 'aggressive':
                expectedReturn = 0.09;
                break;
        }

        // Behavioral adjustments
        if (behaviorData.tradingPatterns.frequency === 'daily' || behaviorData.tradingPatterns.frequency === 'weekly') {
            expectedReturn -= 0.015; // Frequent trading typically reduces returns
        }

        if (behaviorData.tradingPatterns.diversificationLevel > 0.7) {
            expectedReturn += 0.005; // Good diversification improves risk-adjusted returns
        }

        // Experience factor
        if (financialData.goals.investmentExperience === 'advanced') {
            expectedReturn += 0.005;
        } else if (financialData.goals.investmentExperience === 'beginner') {
            expectedReturn -= 0.01;
        }

        const predictedValue = currentInvestments * (1 + expectedReturn);
        const confidence = this.calculateInvestmentConfidence(financialData, behaviorData);

        return {
            metric: 'Investment Portfolio Value',
            currentValue: currentInvestments,
            predictedValue: predictedValue,
            confidence,
            timeframe: 'annually',
            trend: expectedReturn > 0.03 ? 'increasing' : expectedReturn < -0.01 ? 'decreasing' : 'stable',
            changeRate: expectedReturn * 100,
            factors: this.getInvestmentFactors(financialData, behaviorData),
            riskLevel: this.assessInvestmentRiskLevel(financialData, behaviorData)
        };
    }

    /**
     * Predict debt reduction trends
     */
    private predictDebtTrend(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        _historicalData?: HistoricalDataPoint[]
    ): TrendPrediction {
        const currentDebt = this.calculateTotalDebt(financialData);
        const monthlyPayments = financialData.expenses.creditCardPayments + 
                              financialData.expenses.studentLoanPayments + 
                              financialData.expenses.otherDebtPayments;

        if (currentDebt === 0) {
            return {
                metric: 'Total Debt',
                currentValue: 0,
                predictedValue: 0,
                confidence: 1.0,
                timeframe: 'annually',
                trend: 'stable',
                changeRate: 0,
                factors: ['No existing debt'],
                riskLevel: 'low'
            };
        }

        // Estimate debt reduction rate based on payment patterns
        let monthlyReduction = monthlyPayments * 0.8; // Assuming 80% goes to principal
        
        // Behavioral adjustments
        if (behaviorData.planningBehavior.goalSettingClarity > 0.7) {
            monthlyReduction *= 1.2; // Better planning leads to more aggressive debt payment
        }

        if (behaviorData.planningBehavior.impulsiveDecisions > 0.6) {
            monthlyReduction *= 0.9; // Impulsive behavior may interfere with debt reduction
        }

        const annualReduction = monthlyReduction * 12;
        const predictedDebt = Math.max(0, currentDebt - annualReduction);
        const reductionRate = currentDebt > 0 ? (annualReduction / currentDebt) * 100 : 0;

        return {
            metric: 'Total Debt',
            currentValue: currentDebt,
            predictedValue: predictedDebt,
            confidence: this.calculateDebtConfidence(financialData, behaviorData),
            timeframe: 'annually',
            trend: predictedDebt < currentDebt ? 'decreasing' : 'stable',
            changeRate: -reductionRate,
            factors: this.getDebtFactors(financialData, behaviorData),
            riskLevel: this.assessDebtRiskLevel(financialData)
        };
    }

    /**
     * Predict net worth growth trends
     */
    private predictNetWorthTrend(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        _historicalData?: HistoricalDataPoint[]
    ): TrendPrediction {
        const currentNetWorth = this.calculateNetWorth(financialData);
        
        // Combine all trend predictions
        const incomeTrend = this.predictIncomeTrend(financialData, behaviorData);
        const spendingTrend = this.predictSpendingTrend(financialData, behaviorData);
        const savingsTrend = this.predictSavingsTrend(financialData, behaviorData);
        const investmentTrend = this.predictInvestmentTrend(financialData, behaviorData);
        const debtTrend = this.predictDebtTrend(financialData, behaviorData);

        // Calculate net impact
        const incomeIncrease = incomeTrend.predictedValue - incomeTrend.currentValue;
        const spendingIncrease = spendingTrend.predictedValue - spendingTrend.currentValue;
        const savingsIncrease = savingsTrend.predictedValue - savingsTrend.currentValue;
        const investmentGrowth = investmentTrend.predictedValue - investmentTrend.currentValue;
        const debtReduction = debtTrend.currentValue - debtTrend.predictedValue;

        const netWorthChange = (incomeIncrease - spendingIncrease) * 12 + // Annual cash flow change
                              savingsIncrease * 12 + // Annual savings increase
                              investmentGrowth + // Investment appreciation
                              debtReduction; // Debt reduction

        const predictedNetWorth = currentNetWorth + netWorthChange;
        const growthRate = currentNetWorth > 0 ? (netWorthChange / currentNetWorth) * 100 : 0;

        return {
            metric: 'Net Worth',
            currentValue: currentNetWorth,
            predictedValue: predictedNetWorth,
            confidence: this.calculateNetWorthConfidence([incomeTrend, spendingTrend, investmentTrend]),
            timeframe: 'annually',
            trend: netWorthChange > 1000 ? 'increasing' : netWorthChange < -1000 ? 'decreasing' : 'stable',
            changeRate: growthRate,
            factors: this.getNetWorthFactors(financialData, behaviorData),
            riskLevel: this.assessNetWorthRiskLevel(financialData, behaviorData)
        };
    }

    // Helper methods for calculations
    private calculateTotalMonthlyIncome(data: UserFinancialData): number {
        return data.income.primarySalary + data.income.secondaryIncome + 
               data.income.businessIncome + data.income.investmentIncome + 
               data.income.rentalIncome + data.income.benefitsIncome + 
               data.income.otherIncome;
    }

    private calculateTotalMonthlyExpenses(data: UserFinancialData): number {
        return data.expenses.housing + data.expenses.utilities + data.expenses.insurance +
               data.expenses.loanPayments + data.expenses.childcare + data.expenses.food +
               data.expenses.transportation + data.expenses.healthcare + data.expenses.clothing +
               data.expenses.personalCare + data.expenses.entertainment + data.expenses.diningOut +
               data.expenses.hobbies + data.expenses.subscriptions + data.expenses.shopping +
               data.expenses.travel + data.expenses.creditCardPayments + 
               data.expenses.studentLoanPayments + data.expenses.otherDebtPayments;
    }

    private calculateSavingsRate(data: UserFinancialData): number {
        const income = this.calculateTotalMonthlyIncome(data);
        const expenses = this.calculateTotalMonthlyExpenses(data);
        return income > 0 ? Math.max(0, (income - expenses) / income) : 0;
    }

    private calculateTotalInvestments(data: UserFinancialData): number {
        return data.assets.employer401k + data.assets.traditionalIRA + data.assets.rothIRA +
               data.assets.brokerageAccounts + data.assets.stocks + data.assets.bonds +
               data.assets.mutualFunds + data.assets.cryptocurrency;
    }

    private calculateTotalDebt(data: UserFinancialData): number {
        return data.liabilities.creditCardDebt + data.liabilities.personalLoans +
               data.liabilities.studentLoans + data.liabilities.medicalDebt +
               data.liabilities.businessLoans + data.liabilities.taxDebt +
               data.liabilities.otherDebt;
    }

    private calculateNetWorth(data: UserFinancialData): number {
        const totalAssets = data.assets.checking + data.assets.savings + data.assets.moneyMarket +
                           data.assets.emergencyFund + this.calculateTotalInvestments(data) +
                           data.assets.primaryResidence + data.assets.investmentProperties +
                           data.assets.preciousMetals + data.assets.collectibles +
                           data.assets.businessEquity + data.assets.otherAssets;
        
        const totalLiabilities = data.liabilities.mortgageBalance + data.liabilities.homeEquityLoan +
                               data.liabilities.autoLoans + data.liabilities.securedCreditLines +
                               this.calculateTotalDebt(data) + data.liabilities.businessCreditLines +
                               data.liabilities.legalJudgments;

        return totalAssets - totalLiabilities;
    }

    // Factor analysis methods
    private getEmploymentStabilityFactor(data: UserFinancialData): number {
        switch (data.personalInfo.employmentStatus) {
            case 'employed': return data.personalInfo.employmentTenure >= 2 ? 1.1 : 1.0;
            case 'self-employed': return 0.9;
            case 'unemployed': return 0.7;
            case 'retired': return 1.0;
            case 'student': return 0.8;
            default: return 1.0;
        }
    }

    private getExperienceGrowthFactor(data: UserFinancialData): number {
        const age = data.personalInfo.age;
        if (age < 30) return 1.2; // High growth potential
        if (age < 40) return 1.1; // Good growth potential
        if (age < 50) return 1.05; // Moderate growth
        if (age < 60) return 1.0; // Stable income
        return 0.95; // Near retirement, potential decline
    }

    private getMarketConditionFactor(): number {
        // This would be enhanced with real market data
        return 1.0; // Neutral market conditions
    }

    // Confidence calculation methods
    private calculateIncomeConfidence(data: UserFinancialData, growthRate: number): number {
        let confidence = 0.7; // Base confidence
        
        if (data.personalInfo.employmentStatus === 'employed' && data.personalInfo.employmentTenure >= 3) {
            confidence += 0.2;
        }
        if (data.income.incomeVariability === 'stable') {
            confidence += 0.1;
        }
        if (Math.abs(growthRate) > 0.1) {
            confidence -= 0.1; // Lower confidence for extreme predictions
        }
        
        return Math.min(1.0, Math.max(0.1, confidence));
    }

    private calculateSpendingConfidence(data: UserFinancialData, behavior: UserBehaviorData): number {
        let confidence = 0.6;
        
        if (behavior.planningBehavior.budgetingConsistency > 0.7) {
            confidence += 0.3;
        }
        if (data.personalInfo.dependents === 0 && data.personalInfo.age > 30) {
            confidence += 0.1; // More stable spending patterns
        }
        
        return Math.min(1.0, Math.max(0.1, confidence));
    }

    private calculateSavingsConfidence(data: UserFinancialData, behavior: UserBehaviorData): number {
        let confidence = 0.5;
        
        if (behavior.planningBehavior.goalSettingClarity > 0.7) {
            confidence += 0.3;
        }
        if (data.behaviors.automaticSavings) {
            confidence += 0.2;
        }
        
        return Math.min(1.0, Math.max(0.1, confidence));
    }

    private calculateInvestmentConfidence(data: UserFinancialData, behavior: UserBehaviorData): number {
        let confidence = 0.4; // Generally lower confidence for investment predictions
        
        if (data.goals.investmentExperience === 'advanced') {
            confidence += 0.3;
        }
        if (behavior.tradingPatterns.diversificationLevel > 0.7) {
            confidence += 0.2;
        }
        if (behavior.planningBehavior.longTermThinking > 0.7) {
            confidence += 0.1;
        }
        
        return Math.min(1.0, Math.max(0.1, confidence));
    }

    private calculateDebtConfidence(data: UserFinancialData, behavior: UserBehaviorData): number {
        let confidence = 0.7;
        
        if (behavior.planningBehavior.goalSettingClarity > 0.7) {
            confidence += 0.2;
        }
        if (data.behaviors.billPaymentReliability === 'always-on-time') {
            confidence += 0.1;
        }
        
        return Math.min(1.0, Math.max(0.1, confidence));
    }

    private calculateNetWorthConfidence(trends: TrendPrediction[]): number {
        const avgConfidence = trends.reduce((sum, trend) => sum + trend.confidence, 0) / trends.length;
        return avgConfidence * 0.9; // Slightly lower confidence for composite metric
    }

    // Factor identification methods
    private getIncomeFactors(data: UserFinancialData, behavior: UserBehaviorData): string[] {
        const factors = [];
        
        if (data.personalInfo.employmentStatus === 'employed') {
            factors.push('Stable employment');
        }
        if (data.income.incomeGrowthRate > 0.03) {
            factors.push('Historical income growth');
        }
        if (behavior.planningBehavior.goalSettingClarity > 0.7) {
            factors.push('Strong career planning');
        }
        
        return factors;
    }

    private getSpendingFactors(data: UserFinancialData, behavior: UserBehaviorData): string[] {
        const factors = [];
        
        if (data.personalInfo.dependents > 0) {
            factors.push(`Family expenses (${data.personalInfo.dependents} dependents)`);
        }
        if (behavior.planningBehavior.impulsiveDecisions > 0.6) {
            factors.push('Impulsive spending tendencies');
        }
        if (behavior.planningBehavior.budgetingConsistency > 0.7) {
            factors.push('Strong budgeting discipline');
        }
        
        return factors;
    }

    private getSavingsFactors(data: UserFinancialData, behavior: UserBehaviorData): string[] {
        const factors = [];
        
        if (data.behaviors.automaticSavings) {
            factors.push('Automatic savings program');
        }
        if (behavior.planningBehavior.goalSettingClarity > 0.7) {
            factors.push('Clear financial goals');
        }
        if (data.personalInfo.age >= 45) {
            factors.push('Peak earning years');
        }
        
        return factors;
    }

    private getInvestmentFactors(data: UserFinancialData, behavior: UserBehaviorData): string[] {
        const factors = [];
        
        factors.push(`${data.goals.riskTolerance} risk tolerance`);
        if (behavior.tradingPatterns.diversificationLevel > 0.7) {
            factors.push('Well-diversified portfolio');
        }
        if (data.goals.investmentExperience === 'advanced') {
            factors.push('Advanced investment knowledge');
        }
        
        return factors;
    }

    private getDebtFactors(data: UserFinancialData, behavior: UserBehaviorData): string[] {
        const factors = [];
        
        if (data.behaviors.billPaymentReliability === 'always-on-time') {
            factors.push('Reliable payment history');
        }
        if (behavior.planningBehavior.goalSettingClarity > 0.7) {
            factors.push('Debt reduction planning');
        }
        
        return factors;
    }

    private getNetWorthFactors(data: UserFinancialData, behavior: UserBehaviorData): string[] {
        const factors = [];
        
        if (this.calculateSavingsRate(data) > 0.15) {
            factors.push('High savings rate');
        }
        if (behavior.planningBehavior.longTermThinking > 0.7) {
            factors.push('Long-term wealth building focus');
        }
        if (data.goals.investmentExperience !== 'beginner') {
            factors.push('Investment market participation');
        }
        
        return factors;
    }

    // Risk assessment methods
    private assessIncomeRiskLevel(data: UserFinancialData): 'low' | 'medium' | 'high' {
        if (data.personalInfo.employmentStatus === 'unemployed') return 'high';
        if (data.income.incomeVariability === 'highly-variable') return 'high';
        if (data.personalInfo.employmentStatus === 'self-employed') return 'medium';
        return 'low';
    }

    private assessSpendingRiskLevel(data: UserFinancialData, behavior: UserBehaviorData): 'low' | 'medium' | 'high' {
        if (behavior.planningBehavior.impulsiveDecisions > 0.7) return 'high';
        if (behavior.planningBehavior.budgetingConsistency < 0.3) return 'high';
        if (data.personalInfo.dependents > 3) return 'medium';
        return 'low';
    }

    private assessSavingsRiskLevel(data: UserFinancialData, behavior: UserBehaviorData): 'low' | 'medium' | 'high' {
        if (this.calculateSavingsRate(data) < 0.05) return 'high';
        if (behavior.planningBehavior.goalSettingClarity < 0.3) return 'medium';
        return 'low';
    }

    private assessInvestmentRiskLevel(data: UserFinancialData, behavior: UserBehaviorData): 'low' | 'medium' | 'high' {
        if (data.goals.riskTolerance === 'aggressive' && behavior.tradingPatterns.frequency === 'daily') return 'high';
        if (data.goals.investmentExperience === 'beginner') return 'medium';
        if (behavior.tradingPatterns.diversificationLevel < 0.3) return 'high';
        return 'low';
    }

    private assessDebtRiskLevel(data: UserFinancialData): 'low' | 'medium' | 'high' {
        const debtToIncomeRatio = this.calculateTotalDebt(data) / (this.calculateTotalMonthlyIncome(data) * 12);
        if (debtToIncomeRatio > 0.4) return 'high';
        if (debtToIncomeRatio > 0.2) return 'medium';
        return 'low';
    }

    private assessNetWorthRiskLevel(data: UserFinancialData, behavior: UserBehaviorData): 'low' | 'medium' | 'high' {
        const netWorth = this.calculateNetWorth(data);
        if (netWorth < 0) return 'high';
        if (behavior.planningBehavior.longTermThinking < 0.3) return 'medium';
        return 'low';
    }
}

/**
 * Utility functions for trend analysis
 */
export class TrendAnalysisUtils {
    /**
     * Calculate linear regression trend
     */
    static calculateLinearTrend(dataPoints: number[]): { slope: number; intercept: number; r2: number } {
        const n = dataPoints.length;
        if (n < 2) return { slope: 0, intercept: 0, r2: 0 };

        const sumX = (n * (n - 1)) / 2;
        const sumY = dataPoints.reduce((sum, val) => sum + val, 0);
        const sumXY = dataPoints.reduce((sum, val, index) => sum + val * index, 0);
        const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
        const sumY2 = dataPoints.reduce((sum, val) => sum + val * val, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        const yMean = sumY / n;
        const ssTotal = sumY2 - n * yMean * yMean;
        const ssResidual = dataPoints.reduce((sum, val, index) => {
            const predicted = intercept + slope * index;
            return sum + Math.pow(val - predicted, 2);
        }, 0);
        
        const r2 = ssTotal > 0 ? 1 - (ssResidual / ssTotal) : 0;

        return { slope, intercept, r2 };
    }

    /**
     * Detect seasonal patterns in data
     */
    static detectSeasonality(dataPoints: HistoricalDataPoint[], period: number = 12): SeasonalPattern | null {
        if (dataPoints.length < period * 2) return null;

        const values = dataPoints.map(dp => dp.value);
        const seasonalAverages: number[] = [];
        
        for (let i = 0; i < period; i++) {
            const seasonalValues = [];
            for (let j = i; j < values.length; j += period) {
                seasonalValues.push(values[j]);
            }
            seasonalAverages.push(seasonalValues.reduce((sum, val) => sum + val, 0) / seasonalValues.length);
        }

        const overallMean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const amplitude = Math.max(...seasonalAverages) - Math.min(...seasonalAverages);
        const strength = amplitude / overallMean;

        if (strength < 0.05) return null; // Not significant seasonal pattern

        const maxIndex = seasonalAverages.indexOf(Math.max(...seasonalAverages));
        const phase = (maxIndex / period) * 2 * Math.PI;

        return {
            pattern: period === 12 ? 'monthly' : period === 4 ? 'quarterly' : 'yearly',
            amplitude,
            phase,
            strength: Math.min(1, strength)
        };
    }

    /**
     * Calculate confidence intervals for predictions
     */
    static calculateConfidenceInterval(
        prediction: number,
        historicalData: number[],
        confidenceLevel: number = 0.95
    ): { lower: number; upper: number } {
        if (historicalData.length < 3) {
            return { lower: prediction * 0.9, upper: prediction * 1.1 };
        }

        const mean = historicalData.reduce((sum, val) => sum + val, 0) / historicalData.length;
        const variance = historicalData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (historicalData.length - 1);
        const standardError = Math.sqrt(variance / historicalData.length);

        // Simplified t-distribution critical value (approximation)
        const alpha = 1 - confidenceLevel;
        const tCritical = alpha < 0.1 ? 1.96 : alpha < 0.2 ? 1.645 : 1.28;

        const marginOfError = tCritical * standardError;
        
        return {
            lower: prediction - marginOfError,
            upper: prediction + marginOfError
        };
    }
} 