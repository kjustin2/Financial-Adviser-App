import { 
    UserFinancialData, 
    AnalysisResult, 
    DOMElements, 
    RetirementProjections,
    WealthProjections,
    FinancialMilestone,
    RiskAssessment,
    PlannedPurchase,
    InflationAdjustedProjections
} from './types';

/**
 * Advanced Financial Health Analyzer
 * Comprehensive financial planning with inflation-adjusted projections and large purchase planning
 */
class FinancialAnalyzer {
    private elements!: DOMElements;

    constructor() {
        console.log('🚀 Starting Advanced Financial Analyzer with Inflation & Purchase Planning...');
        this.initializeDOM();
        this.attachEventListeners();
        console.log('✅ Initialization complete');
    }

    /**
     * Initialize DOM elements with comprehensive error checking
     */
    private initializeDOM(): void {
        const form = document.getElementById('financialForm') as HTMLFormElement;
        const resultsDiv = document.getElementById('results') as HTMLElement;
        const scoreElement = document.getElementById('score') as HTMLElement;
        const cashFlowElement = document.getElementById('cashFlow') as HTMLElement;
        const recommendationElement = document.getElementById('recommendation') as HTMLElement;
        const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;

        if (!form || !resultsDiv || !scoreElement || !cashFlowElement || !recommendationElement || !analyzeBtn) {
            throw new Error('Required DOM elements not found');
        }

        this.elements = {
            form,
            resultsDiv,
            scoreElement,
            cashFlowElement,
            recommendationElement,
            analyzeBtn
        };
    }

    /**
     * Attach event listeners
     */
    private attachEventListeners(): void {
        this.elements.analyzeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.performAnalysis();
        });

        this.elements.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.performAnalysis();
        });
    }

    /**
     * Get comprehensive user input data including planned purchases
     */
    private getUserData(): UserFinancialData {
        const plannedPurchases = this.getPlannedPurchases();
        
        return {
            // Basic Financial Information
            monthlyIncome: this.getNumericValue('monthlyIncome'),
            monthlyExpenses: this.getNumericValue('monthlyExpenses'),
            savings: this.getNumericValue('savings'),
            debt: this.getNumericValue('debt'),
            
            // Personal Information
            age: this.getNumericValue('age'),
            retirementAge: this.getNumericValue('retirementAge') || 65,
            
            // Investment & Risk Information
            riskTolerance: this.getSelectValue('riskTolerance') as 'conservative' | 'moderate' | 'aggressive',
            currentInvestments: this.getNumericValue('currentInvestments'),
            monthlyInvestmentContribution: this.getNumericValue('monthlyInvestmentContribution'),
            
            // Goals & Planning
            emergencyFundGoal: this.getNumericValue('emergencyFundGoal') || 6,
            retirementIncomeGoal: this.getNumericValue('retirementIncomeGoal'),
            bonusIncome: this.getNumericValue('bonusIncome'),
            passiveIncome: this.getNumericValue('passiveIncome'),
            
            // Inflation & Large Purchases
            expectedInflationRate: this.getNumericValue('expectedInflationRate') / 100 || 0.035, // Convert to decimal
            plannedPurchases
        };
    }

    /**
     * Extract planned purchases from checkboxes and form inputs
     */
    private getPlannedPurchases(): PlannedPurchase[] {
        const purchases: PlannedPurchase[] = [];
        
        const purchaseTypes = [
            { 
                id: 'House', 
                name: '🏠 House Purchase',
                costId: 'houseCost',
                timeframeId: 'houseTimeframe',
                downPaymentId: 'houseDownPayment'
            },
            { 
                id: 'Car', 
                name: '🚗 Vehicle Purchase',
                costId: 'carCost',
                timeframeId: 'carTimeframe',
                downPaymentId: 'carDownPayment'
            },
            { 
                id: 'Education', 
                name: '🎓 Education/Training',
                costId: 'educationCost',
                timeframeId: 'educationTimeframe',
                downPaymentId: 'educationDownPayment'
            },
            { 
                id: 'Wedding', 
                name: '💍 Wedding',
                costId: 'weddingCost',
                timeframeId: 'weddingTimeframe',
                downPaymentId: 'weddingDownPayment'
            }
        ];

        purchaseTypes.forEach(type => {
            const checkbox = document.getElementById(`purchase${type.id}`) as HTMLInputElement;
            if (checkbox && checkbox.checked) {
                const cost = this.getNumericValue(type.costId);
                const timeframe = this.getNumericValue(type.timeframeId);
                const downPaymentPercent = this.getNumericValue(type.downPaymentId) || 100;
                
                if (cost > 0 && timeframe > 0) {
                    purchases.push({
                        name: type.name,
                        cost: cost,
                        timeframeYears: timeframe,
                        priority: timeframe <= 2 ? 'high' : timeframe <= 5 ? 'medium' : 'low',
                        financed: downPaymentPercent < 100,
                        downPaymentPercent: downPaymentPercent
                    });
                }
            }
        });

        return purchases;
    }

    /**
     * Get numeric value from input element
     */
    private getNumericValue(id: string): number {
        const element = document.getElementById(id) as HTMLInputElement;
        return element ? (parseFloat(element.value) || 0) : 0;
    }

    /**
     * Get select value from select element
     */
    private getSelectValue(id: string): string {
        const element = document.getElementById(id) as HTMLSelectElement;
        return element ? element.value : 'moderate';
    }

    /**
     * Perform comprehensive financial analysis with inflation and purchase planning
     */
    private performAnalysis(): void {
        try {
            const userData = this.getUserData();
            
            const validation = this.validateUserData(userData);
            if (!validation.isValid) {
                this.showError(validation.error!);
                return;
            }

            const analysis = this.calculateComprehensiveAnalysis(userData);
            this.displayResults(analysis);
            
        } catch (error) {
            console.error('Analysis failed:', error);
            this.showError('Analysis failed. Please check your input data.');
        }
    }

    /**
     * Validate user input data
     */
    private validateUserData(data: UserFinancialData): { isValid: boolean; error?: string } {
        if (data.monthlyIncome <= 0) {
            return { isValid: false, error: 'Monthly income must be greater than 0' };
        }

        if (data.age < 18 || data.age > 80) {
            return { isValid: false, error: 'Age must be between 18 and 80' };
        }

        if (data.retirementAge <= data.age) {
            return { isValid: false, error: 'Retirement age must be greater than current age' };
        }

        if (data.expectedInflationRate < 0 || data.expectedInflationRate > 0.15) {
            return { isValid: false, error: 'Inflation rate should be between 0% and 15%' };
        }

        return { isValid: true };
    }

    /**
     * Calculate comprehensive financial analysis with inflation and purchase impact
     */
    private calculateComprehensiveAnalysis(data: UserFinancialData): AnalysisResult {
        // Basic calculations
        const totalMonthlyIncome = data.monthlyIncome + data.passiveIncome;
        const cashFlow = totalMonthlyIncome - data.monthlyExpenses;
        const emergencyFundMonths = data.monthlyExpenses > 0 ? data.savings / data.monthlyExpenses : 0;
        const debtToIncomeRatio = data.debt / (totalMonthlyIncome * 12);
        const investmentRate = totalMonthlyIncome > 0 ? (data.monthlyInvestmentContribution / totalMonthlyIncome) * 100 : 0;

        // Calculate financial health score
        const score = this.calculateHealthScore(data, cashFlow, emergencyFundMonths, debtToIncomeRatio, investmentRate);

        // Long-term projections with inflation
        const retirementProjections = this.calculateRetirementProjections(data);
        const wealthProjections = this.calculateWealthProjections(data);
        const inflationAdjustedProjections = this.calculateInflationAdjustedProjections(data, wealthProjections);
        const financialMilestones = this.calculateFinancialMilestones(data);
        const riskAssessment = this.calculateRiskAssessment(data);

        const recommendation = this.generateRecommendation(data, cashFlow, emergencyFundMonths, debtToIncomeRatio, score);

        return {
            score,
            cashFlow,
            recommendation,
            emergencyFundMonths,
            debtToIncomeRatio,
            retirementProjections,
            wealthProjections,
            financialMilestones,
            riskAssessment,
            inflationAdjustedProjections
        };
    }

    /**
     * Calculate wealth projections including impact of large purchases
     */
    private calculateWealthProjections(data: UserFinancialData): WealthProjections {
        const expectedReturn = this.getExpectedReturn(data.riskTolerance);
        const currentWealth = data.savings + data.currentInvestments;
        const monthlyContribution = data.monthlyInvestmentContribution;
        const monthlyReturn = expectedReturn / 12;
        
        // Calculate standard projections
        const fiveYearMonths = 60;
        const fiveYearFutureValue = currentWealth * Math.pow(1 + expectedReturn, 5) +
            monthlyContribution * ((Math.pow(1 + monthlyReturn, fiveYearMonths) - 1) / monthlyReturn);
        
        const tenYearMonths = 120;
        const tenYearFutureValue = currentWealth * Math.pow(1 + expectedReturn, 10) +
            monthlyContribution * ((Math.pow(1 + monthlyReturn, tenYearMonths) - 1) / monthlyReturn);
        
        const yearsToRetirement = data.retirementAge - data.age;
        const retirementMonths = yearsToRetirement * 12;
        const retirementFutureValue = currentWealth * Math.pow(1 + expectedReturn, yearsToRetirement) +
            monthlyContribution * ((Math.pow(1 + monthlyReturn, retirementMonths) - 1) / monthlyReturn);
        
        // Calculate impact of planned purchases
        const { totalPlannedPurchases, fiveYearPurchases, tenYearPurchases, retirementPurchases } = 
            this.calculatePurchaseImpact(data.plannedPurchases, data.expectedInflationRate);
        
        const totalContributions = monthlyContribution * retirementMonths;
        const investmentGrowth = retirementFutureValue - currentWealth - totalContributions;
        
        return {
            fiveYearProjection: fiveYearFutureValue,
            tenYearProjection: tenYearFutureValue,
            retirementProjection: retirementFutureValue,
            compoundGrowthRate: expectedReturn,
            totalContributions,
            investmentGrowth,
            
            // After large purchases
            fiveYearAfterPurchases: Math.max(0, fiveYearFutureValue - fiveYearPurchases),
            tenYearAfterPurchases: Math.max(0, tenYearFutureValue - tenYearPurchases),
            retirementAfterPurchases: Math.max(0, retirementFutureValue - retirementPurchases),
            totalPlannedPurchases
        };
    }

    /**
     * Calculate inflation-adjusted projections showing real purchasing power
     */
    private calculateInflationAdjustedProjections(data: UserFinancialData, wealthProjections: WealthProjections): InflationAdjustedProjections {
        const inflationRate = data.expectedInflationRate;
        const yearsToRetirement = data.retirementAge - data.age;
        
        // Calculate real values (inflation-adjusted)
        const fiveYearReal = wealthProjections.fiveYearProjection / Math.pow(1 + inflationRate, 5);
        const tenYearReal = wealthProjections.tenYearProjection / Math.pow(1 + inflationRate, 10);
        const retirementReal = wealthProjections.retirementProjection / Math.pow(1 + inflationRate, yearsToRetirement);
        
        // Real values after purchases
        const fiveYearRealAfterPurchases = wealthProjections.fiveYearAfterPurchases / Math.pow(1 + inflationRate, 5);
        const tenYearRealAfterPurchases = wealthProjections.tenYearAfterPurchases / Math.pow(1 + inflationRate, 10);
        const retirementRealAfterPurchases = wealthProjections.retirementAfterPurchases / Math.pow(1 + inflationRate, yearsToRetirement);
        
        // Calculate inflation impact metrics
        const fiveYearInflationImpact = Math.pow(1 + inflationRate, 5);
        const tenYearInflationImpact = Math.pow(1 + inflationRate, 10);
        const retirementInflationImpact = Math.pow(1 + inflationRate, yearsToRetirement);
        
        return {
            fiveYearReal,
            tenYearReal,
            retirementReal,
            fiveYearRealAfterPurchases,
            tenYearRealAfterPurchases,
            retirementRealAfterPurchases,
            
            inflationRate,
            fiveYearInflationImpact,
            tenYearInflationImpact,
            retirementInflationImpact,
            
            todaysPurchasingPower: {
                fiveYear: fiveYearReal,
                tenYear: tenYearReal,
                retirement: retirementReal
            }
        };
    }

    /**
     * Calculate the financial impact of planned large purchases
     */
    private calculatePurchaseImpact(purchases: PlannedPurchase[], inflationRate: number): {
        totalPlannedPurchases: number;
        fiveYearPurchases: number;
        tenYearPurchases: number;
        retirementPurchases: number;
    } {
        let fiveYearPurchases = 0;
        let tenYearPurchases = 0;
        let retirementPurchases = 0;
        
        purchases.forEach(purchase => {
            // Adjust cost for inflation
            const inflationAdjustedCost = purchase.cost * Math.pow(1 + inflationRate, purchase.timeframeYears);
            
            // Calculate actual cash needed (down payment for financed purchases)
            const cashNeeded = purchase.financed 
                ? inflationAdjustedCost * (purchase.downPaymentPercent! / 100)
                : inflationAdjustedCost;
            
            // Add to appropriate time period
            if (purchase.timeframeYears <= 5) {
                fiveYearPurchases += cashNeeded;
            }
            if (purchase.timeframeYears <= 10) {
                tenYearPurchases += cashNeeded;
            }
            retirementPurchases += cashNeeded;
        });
        
        const totalPlannedPurchases = purchases.reduce((sum, p) => sum + p.cost, 0);
        
        return {
            totalPlannedPurchases,
            fiveYearPurchases,
            tenYearPurchases,
            retirementPurchases
        };
    }

    /**
     * Calculate enhanced retirement projections with inflation impact
     */
    private calculateRetirementProjections(data: UserFinancialData): RetirementProjections {
        const yearsToRetirement = data.retirementAge - data.age;
        const expectedReturn = this.getExpectedReturn(data.riskTolerance);
        
        // Current retirement wealth
        const currentRetirementWealth = data.currentInvestments;
        
        // Future value of current investments
        const futureValueCurrent = currentRetirementWealth * Math.pow(1 + expectedReturn, yearsToRetirement);
        
        // Future value of monthly contributions
        const monthlyReturn = expectedReturn / 12;
        const totalMonths = yearsToRetirement * 12;
        const futureValueContributions = data.monthlyInvestmentContribution * 
            ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);
        
        const projectedRetirementWealth = futureValueCurrent + futureValueContributions;
        
        // Calculate required wealth with inflation consideration
        const realRetirementIncomeGoal = data.retirementIncomeGoal > 0 
            ? data.retirementIncomeGoal * Math.pow(1 + data.expectedInflationRate, yearsToRetirement)
            : data.monthlyIncome * Math.pow(1 + data.expectedInflationRate, yearsToRetirement);
        
        const requiredWealth = realRetirementIncomeGoal * 12 / 0.04; // 4% withdrawal rule
        
        const shortfall = Math.max(0, requiredWealth - futureValueCurrent);
        const requiredMonthlyContribution = shortfall > 0 ? 
            shortfall * monthlyReturn / (Math.pow(1 + monthlyReturn, totalMonths) - 1) : 0;
        
        // Projected retirement income (4% withdrawal rule)
        const projectedMonthlyRetirementIncome = (projectedRetirementWealth * 0.04) / 12;
        
        // Social Security estimate (rough approximation)
        const socialSecurityEstimate = Math.min(data.monthlyIncome * 0.75, 3000);
        
        const retirementReadinessScore = Math.min(100, (projectedRetirementWealth / requiredWealth) * 100);
        
        // Inflation-adjusted retirement values
        const realRetirementWealth = projectedRetirementWealth / Math.pow(1 + data.expectedInflationRate, yearsToRetirement);
        const realRetirementIncome = projectedMonthlyRetirementIncome / Math.pow(1 + data.expectedInflationRate, yearsToRetirement);
        const inflationImpact = Math.pow(1 + data.expectedInflationRate, yearsToRetirement);
        
        return {
            yearsToRetirement,
            projectedRetirementWealth,
            requiredMonthlyContribution: Math.max(0, requiredMonthlyContribution),
            retirementReadinessScore,
            projectedMonthlyRetirementIncome,
            socialSecurityEstimate,
            shortfallOrSurplus: projectedRetirementWealth - requiredWealth,
            
            // Inflation-adjusted values
            realRetirementWealth,
            realRetirementIncome,
            inflationImpact
        };
    }

    /**
     * Calculate financial milestones with inflation consideration
     */
    private calculateFinancialMilestones(data: UserFinancialData): FinancialMilestone[] {
        const milestones: FinancialMilestone[] = [];
        const monthlySavings = Math.max(0, data.monthlyIncome + data.passiveIncome - data.monthlyExpenses);
        
        // Emergency fund milestone
        const emergencyFundTarget = data.monthlyExpenses * data.emergencyFundGoal;
        const emergencyFundNeeded = Math.max(0, emergencyFundTarget - data.savings);
        const emergencyFundTime = monthlySavings > 0 ? emergencyFundNeeded / monthlySavings : 999;
        
        milestones.push({
            milestone: `Emergency Fund (${data.emergencyFundGoal} months)`,
            targetAmount: emergencyFundTarget,
            estimatedTimeToReach: emergencyFundTime,
            monthlyContributionNeeded: emergencyFundTime < 999 ? emergencyFundNeeded / emergencyFundTime : emergencyFundNeeded,
            priority: 'high',
            achievable: emergencyFundTime < 60,
            realTargetAmount: emergencyFundTarget, // Emergency fund doesn't need inflation adjustment (short-term)
            inflationAdjustedContribution: emergencyFundTime < 999 ? emergencyFundNeeded / emergencyFundTime : emergencyFundNeeded
        });
        
        // Debt freedom milestone
        if (data.debt > 0) {
            const debtPayoffTime = monthlySavings > 0 ? data.debt / monthlySavings : 999;
            milestones.push({
                milestone: 'Debt Freedom',
                targetAmount: 0,
                estimatedTimeToReach: debtPayoffTime,
                monthlyContributionNeeded: debtPayoffTime < 999 ? data.debt / debtPayoffTime : data.debt,
                priority: 'high',
                achievable: debtPayoffTime < 60
            });
        }
        
        // Add planned purchase milestones
        data.plannedPurchases.forEach(purchase => {
            const inflationAdjustedCost = purchase.cost * Math.pow(1 + data.expectedInflationRate, purchase.timeframeYears);
            const cashNeeded = purchase.financed 
                ? inflationAdjustedCost * (purchase.downPaymentPercent! / 100)
                : inflationAdjustedCost;
            
            milestones.push({
                milestone: purchase.name,
                targetAmount: purchase.cost,
                estimatedTimeToReach: purchase.timeframeYears * 12, // Convert to months
                monthlyContributionNeeded: cashNeeded / (purchase.timeframeYears * 12),
                priority: purchase.priority,
                achievable: true,
                realTargetAmount: inflationAdjustedCost,
                inflationAdjustedContribution: cashNeeded / (purchase.timeframeYears * 12)
            });
        });
        
        return milestones.sort((a, b) => a.estimatedTimeToReach - b.estimatedTimeToReach);
    }

    /**
     * Calculate enhanced risk assessment including purchase and inflation risks
     */
    private calculateRiskAssessment(data: UserFinancialData): RiskAssessment {
        const riskFactors: string[] = [];
        let riskScore = 0;
        
        // Emergency fund risk
        const emergencyMonths = data.monthlyExpenses > 0 ? data.savings / data.monthlyExpenses : 0;
        if (emergencyMonths < 3) {
            riskFactors.push('Insufficient emergency fund');
            riskScore += 30;
        }
        
        // Debt risk
        const debtRatio = data.debt / (data.monthlyIncome * 12);
        if (debtRatio > 0.3) {
            riskFactors.push('High debt-to-income ratio');
            riskScore += 25;
        }
        
        // Inflation risk assessment
        let inflationRisk: 'low' | 'medium' | 'high' = 'low';
        if (data.expectedInflationRate > 0.05) {
            riskFactors.push('High expected inflation rate');
            riskScore += 15;
            inflationRisk = 'high';
        } else if (data.expectedInflationRate > 0.03) {
            inflationRisk = 'medium';
        }
        
        // Large purchase affordability
        const { totalPlannedPurchases } = this.calculatePurchaseImpact(data.plannedPurchases, data.expectedInflationRate);
        const totalWealth = data.savings + data.currentInvestments;
        
        let purchaseAffordability: 'excellent' | 'good' | 'concerning' | 'unaffordable' = 'excellent';
        if (totalPlannedPurchases > totalWealth * 2) {
            riskFactors.push('Planned purchases exceed available resources');
            riskScore += 20;
            purchaseAffordability = 'unaffordable';
        } else if (totalPlannedPurchases > totalWealth) {
            riskFactors.push('Planned purchases strain financial resources');
            riskScore += 10;
            purchaseAffordability = 'concerning';
        } else if (totalPlannedPurchases > totalWealth * 0.5) {
            purchaseAffordability = 'good';
        }
        
        // Liquidity risk
        const liquidityRisk = data.plannedPurchases.some(p => p.timeframeYears < 2) && data.savings < data.monthlyExpenses * 6;
        if (liquidityRisk) {
            riskFactors.push('Large purchases planned with insufficient liquid savings');
            riskScore += 15;
        }
        
        const overallRiskLevel: 'low' | 'medium' | 'high' = 
            riskScore < 20 ? 'low' : riskScore < 50 ? 'medium' : 'high';
        
        const recommendations = this.generateRiskRecommendations(riskFactors, data);
        
        return {
            overallRiskLevel,
            riskFactors,
            recommendations,
            emergencyFundAdequacy: emergencyMonths >= data.emergencyFundGoal,
            diversificationScore: Math.max(0, 100 - riskScore),
            purchaseAffordability,
            liquidityRisk,
            inflationRisk
        };
    }

    /**
     * Generate enhanced risk-based recommendations
     */
    private generateRiskRecommendations(riskFactors: string[], data: UserFinancialData): string[] {
        const recommendations: string[] = [];
        
        if (riskFactors.includes('Insufficient emergency fund')) {
            recommendations.push('Build emergency fund to 3-6 months of expenses');
        }
        
        if (riskFactors.includes('High debt-to-income ratio')) {
            recommendations.push('Focus on debt reduction using avalanche or snowball method');
        }
        
        if (riskFactors.includes('High expected inflation rate')) {
            recommendations.push('Consider inflation-protected investments (TIPS, real estate, stocks)');
        }
        
        if (riskFactors.includes('Planned purchases exceed available resources')) {
            recommendations.push('Delay non-essential purchases or increase saving rate');
        }
        
        if (riskFactors.includes('Large purchases planned with insufficient liquid savings')) {
            recommendations.push('Build larger emergency fund before major purchases');
        }
        
        // Add inflation-specific recommendations
        if (data.expectedInflationRate > 0.04) {
            recommendations.push(`With ${(data.expectedInflationRate * 100).toFixed(1)}% inflation, prioritize growth investments over cash`);
        }
        
        return recommendations;
    }

    /**
     * Calculate financial health score (0-100)
     */
    private calculateHealthScore(
        data: UserFinancialData,
        cashFlow: number,
        emergencyMonths: number,
        debtRatio: number,
        investmentRate: number
    ): number {
        let score = 0;

        // Cash flow (25 points)
        if (cashFlow > 0) {
            const flowRatio = cashFlow / data.monthlyIncome;
            score += Math.min(25, flowRatio * 100);
        }

        // Emergency fund (25 points)
        const emergencyScore = Math.min(25, (emergencyMonths / data.emergencyFundGoal) * 25);
        score += emergencyScore;

        // Debt management (25 points)
        if (debtRatio < 0.1) score += 25;
        else if (debtRatio < 0.2) score += 20;
        else if (debtRatio < 0.3) score += 15;
        else if (debtRatio < 0.4) score += 10;
        else score += 5;

        // Investment rate (25 points)
        if (investmentRate >= 20) score += 25;
        else if (investmentRate >= 15) score += 20;
        else if (investmentRate >= 10) score += 15;
        else if (investmentRate >= 5) score += 10;
        else score += 5;

        // Deduct points for inflation risk
        if (data.expectedInflationRate > 0.05) score -= 5;
        
        // Deduct points for large purchase strain
        const totalWealth = data.savings + data.currentInvestments;
        const { totalPlannedPurchases } = this.calculatePurchaseImpact(data.plannedPurchases, data.expectedInflationRate);
        if (totalPlannedPurchases > totalWealth) score -= 10;

        return Math.round(Math.max(0, Math.min(100, score)));
    }

    /**
     * Get expected return based on risk tolerance
     */
    private getExpectedReturn(riskTolerance: string): number {
        const returns = {
            conservative: 0.05,  // 5%
            moderate: 0.07,      // 7%
            aggressive: 0.09     // 9%
        };
        return returns[riskTolerance as keyof typeof returns] || 0.07;
    }

    /**
     * Generate comprehensive recommendation considering inflation and purchases
     */
    private generateRecommendation(
        data: UserFinancialData,
        cashFlow: number,
        emergencyMonths: number,
        debtRatio: number,
        score: number
    ): string {
        const inflationRate = (data.expectedInflationRate * 100).toFixed(1);
        const { totalPlannedPurchases } = this.calculatePurchaseImpact(data.plannedPurchases, data.expectedInflationRate);
        
        if (cashFlow <= 0) {
            return `🚨 Critical: You're spending $${Math.abs(cashFlow).toFixed(0)} more than you earn monthly. With ${inflationRate}% inflation, costs will rise faster than income. Immediately reduce expenses or increase income.`;
        }

        if (emergencyMonths < 1) {
            return `🏦 Priority: Build emergency fund immediately. With ${inflationRate}% inflation, expenses will grow to ${this.formatCurrency(data.monthlyExpenses * Math.pow(1 + data.expectedInflationRate, 5))} in 5 years. Save ${this.formatCurrency(Math.min(cashFlow, data.monthlyExpenses))}/month.`;
        }

        if (debtRatio > 0.3) {
            return `💳 Debt Focus: Your debt-to-income ratio is ${(debtRatio * 100).toFixed(1)}%. With ${inflationRate}% inflation, carrying high-interest debt becomes more expensive. Use your $${cashFlow.toFixed(0)} monthly surplus to aggressively pay down debt.`;
        }

        if (totalPlannedPurchases > (data.savings + data.currentInvestments)) {
            return `💰 Purchase Planning: Your planned purchases (${this.formatCurrency(totalPlannedPurchases)}) exceed current wealth. Consider delaying non-essential purchases or increasing savings rate to ${this.formatCurrency((totalPlannedPurchases / 60))}/month.`;
        }

        if (data.expectedInflationRate > 0.04) {
            return `📈 Inflation Alert: With ${inflationRate}% inflation, your retirement needs will be ${this.formatCurrency(data.monthlyIncome * Math.pow(1 + data.expectedInflationRate, data.retirementAge - data.age))}/month in today's dollars. Prioritize growth investments over cash savings.`;
        }

        if (score >= 80) {
            return `🌟 Excellent! Your financial plan accounts for ${inflationRate}% inflation. Your real retirement wealth will be ${this.formatCurrency(data.currentInvestments * Math.pow(1.07, data.retirementAge - data.age) / Math.pow(1 + data.expectedInflationRate, data.retirementAge - data.age))} in today's purchasing power.`;
        }

        if (score >= 60) {
            return `📈 Good progress! Focus on increasing investment rate to combat ${inflationRate}% inflation. Consider I Bonds, TIPS, or growth stocks to maintain purchasing power over time.`;
        }

        return `⚡ Improvement needed: With ${inflationRate}% inflation, cash loses value. Use your $${cashFlow.toFixed(0)} surplus for growth investments after building emergency fund. Small improvements compound significantly.`;
    }

    /**
     * Display comprehensive results with inflation-adjusted values
     */
    private displayResults(analysis: AnalysisResult): void {
        // Update score
        this.elements.scoreElement.textContent = `Score: ${analysis.score}/100`;

        // Update basic metrics
        this.updateElement('cashFlow', this.formatCurrency(analysis.cashFlow));
        this.updateElement('emergencyFund', `${analysis.emergencyFundMonths.toFixed(1)} months`);
        this.updateElement('debtRatio', `${(analysis.debtToIncomeRatio * 100).toFixed(1)}%`);
        
        // Calculate investment rate as percentage of income
        const investmentRate = analysis.retirementProjections.yearsToRetirement > 0 
            ? ((analysis.wealthProjections.totalContributions / 12) / (analysis.retirementProjections.yearsToRetirement * 12) * 100)
            : 0;
        this.updateElement('investmentRate', `${investmentRate.toFixed(1)}%`);

        // Update nominal projections
        this.updateElement('fiveYearProjection', this.formatCurrency(analysis.wealthProjections.fiveYearProjection));
        this.updateElement('tenYearProjection', this.formatCurrency(analysis.wealthProjections.tenYearProjection));
        this.updateElement('retirementProjection', this.formatCurrency(analysis.wealthProjections.retirementProjection));

        // Update real (inflation-adjusted) projections
        this.updateElement('fiveYearReal', this.formatCurrency(analysis.inflationAdjustedProjections.fiveYearReal) + ' in today\'s purchasing power');
        this.updateElement('tenYearReal', this.formatCurrency(analysis.inflationAdjustedProjections.tenYearReal) + ' in today\'s purchasing power');
        this.updateElement('retirementReal', this.formatCurrency(analysis.inflationAdjustedProjections.retirementReal) + ' in today\'s purchasing power');

        // Update after-purchase projections
        this.updateElement('fiveYearAfterPurchases', this.formatCurrency(analysis.wealthProjections.fiveYearAfterPurchases));
        this.updateElement('tenYearAfterPurchases', this.formatCurrency(analysis.wealthProjections.tenYearAfterPurchases));
        this.updateElement('retirementAfterPurchases', this.formatCurrency(analysis.wealthProjections.retirementAfterPurchases));

        // Update real after-purchase projections
        this.updateElement('fiveYearRealAfterPurchases', this.formatCurrency(analysis.inflationAdjustedProjections.fiveYearRealAfterPurchases) + ' in today\'s purchasing power');
        this.updateElement('tenYearRealAfterPurchases', this.formatCurrency(analysis.inflationAdjustedProjections.tenYearRealAfterPurchases) + ' in today\'s purchasing power');
        this.updateElement('retirementRealAfterPurchases', this.formatCurrency(analysis.inflationAdjustedProjections.retirementRealAfterPurchases) + ' in today\'s purchasing power');

        // Update inflation impact
        this.displayInflationImpact(analysis.inflationAdjustedProjections);

        // Update retirement income (nominal and real)
        this.updateElement('retirementIncome', this.formatCurrency(analysis.retirementProjections.projectedMonthlyRetirementIncome) + '/mo');
        this.updateElement('realRetirementIncome', this.formatCurrency(analysis.retirementProjections.realRetirementIncome) + '/mo');

        // Update milestones
        this.displayMilestones(analysis.financialMilestones);

        // Update recommendation
        this.elements.recommendationElement.textContent = analysis.recommendation;

        // Update risk assessment
        this.displayRiskAssessment(analysis.riskAssessment);

        // Show results
        this.elements.resultsDiv.classList.remove('hidden');
        this.elements.resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Display inflation impact information
     */
    private displayInflationImpact(inflationProjections: InflationAdjustedProjections): void {
        this.updateElement('inflationRate', `${(inflationProjections.inflationRate * 100).toFixed(1)}%`);
        
        // Show what $1,000 today will cost in the future
        this.updateElement('fiveYearInflationImpact', this.formatCurrency(1000 * inflationProjections.fiveYearInflationImpact));
        this.updateElement('tenYearInflationImpact', this.formatCurrency(1000 * inflationProjections.tenYearInflationImpact));
        this.updateElement('retirementInflationImpact', this.formatCurrency(1000 * inflationProjections.retirementInflationImpact));
    }

    /**
     * Display financial milestones with inflation-adjusted values
     */
    private displayMilestones(milestones: FinancialMilestone[]): void {
        const container = document.getElementById('milestones');
        if (!container) return;

        container.innerHTML = milestones.map(milestone => `
            <div class="milestone-item">
                <div class="milestone-header">
                    <span class="milestone-title">${milestone.milestone}</span>
                    <span class="milestone-time">${milestone.estimatedTimeToReach < 999 ? `${milestone.estimatedTimeToReach.toFixed(0)} months` : 'Not achievable with current plan'}</span>
                </div>
                <p style="margin: 5px 0; color: #6b7280;">
                    Target: ${milestone.targetAmount > 0 ? this.formatCurrency(milestone.targetAmount) : 'Debt elimination'}
                    ${milestone.realTargetAmount && milestone.realTargetAmount !== milestone.targetAmount 
                        ? ` (${this.formatCurrency(milestone.realTargetAmount)} inflation-adjusted)` 
                        : ''}
                </p>
                <p style="margin: 0; color: #6b7280; font-size: 0.9rem;">Monthly needed: ${this.formatCurrency(milestone.monthlyContributionNeeded)}</p>
            </div>
        `).join('');
    }

    /**
     * Display enhanced risk assessment
     */
    private displayRiskAssessment(risk: RiskAssessment): void {
        const riskSection = document.getElementById('riskSection');
        const riskLevelElement = document.getElementById('riskLevel');
        const riskFactorsElement = document.getElementById('riskFactors');

        // Update risk section styling
        if (riskSection) {
            riskSection.className = `risk-section risk-${risk.overallRiskLevel}`;
        }

        if (riskLevelElement) {
            riskLevelElement.textContent = `${risk.overallRiskLevel.toUpperCase()} RISK`;
        }

        if (riskFactorsElement) {
            if (risk.riskFactors.length === 0) {
                riskFactorsElement.innerHTML = '<p>No significant risk factors identified. Your financial plan appears well-balanced for current inflation expectations.</p>';
            } else {
                riskFactorsElement.innerHTML = `
                    <div style="margin-bottom: 15px;">
                        <strong>Risk Factors:</strong><br>
                        ${risk.riskFactors.map(factor => `• ${factor}`).join('<br>')}
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Purchase Affordability:</strong> ${risk.purchaseAffordability.toUpperCase()}<br>
                        <strong>Inflation Risk:</strong> ${risk.inflationRisk.toUpperCase()}
                        ${risk.liquidityRisk ? '<br><strong>Liquidity Risk:</strong> HIGH' : ''}
                    </div>
                    <div>
                        <strong>Recommendations:</strong><br>
                        ${risk.recommendations.map(rec => `• ${rec}`).join('<br>')}
                    </div>
                `;
            }
        }
    }

    /**
     * Update element text content safely
     */
    private updateElement(id: string, value: string): void {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    /**
     * Format currency
     */
    private formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Show error message
     */
    private showError(message: string): void {
        alert(`Error: ${message}`);
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FinancialAnalyzer();
});

// Fallback for different loading scenarios
if (document.readyState === 'loading') {
    // Wait for DOMContentLoaded
} else {
    try {
        new FinancialAnalyzer();
    } catch (error) {
        console.error('Critical Error: Failed to start application:', error);
    }
} 