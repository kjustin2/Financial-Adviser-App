import { 
    UserFinancialData, 
    AnalysisResult, 
    DOMElements, 
    RetirementProjections,
    WealthProjections,
    FinancialMilestone,
    RiskAssessment
} from './types';

/**
 * Modern Financial Health Analyzer
 * Clean, user-friendly analysis with conditional advanced features
 */
class FinancialAnalyzer {
    private elements!: DOMElements;
    private wealthChart: any = null;
    private healthChart: any = null;
    private readonly HISTORICAL_INFLATION_RATE = 0.035; // 3.5% historical average

    constructor() {
        console.log('🚀 Starting Financial Health Analyzer...');
        this.initializeDOM();
        this.attachEventListeners();
        console.log('✅ Initialization complete');
    }

    /**
     * Initialize DOM elements
     */
    private initializeDOM(): void {
        const form = document.getElementById('financialForm') as HTMLFormElement;
        const resultsContainer = document.getElementById('results') as HTMLElement;
        const healthScore = document.getElementById('healthScore') as HTMLElement;
        const cashFlowValue = document.getElementById('cashFlowValue') as HTMLElement;
        const emergencyFundValue = document.getElementById('emergencyFundValue') as HTMLElement;
        const debtRatioValue = document.getElementById('debtRatioValue') as HTMLElement;
        const savingsRateValue = document.getElementById('savingsRateValue') as HTMLElement;
        const recommendationText = document.getElementById('recommendationText') as HTMLElement;
        const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;

        if (!form || !resultsContainer || !healthScore || !cashFlowValue || 
            !emergencyFundValue || !debtRatioValue || !savingsRateValue || 
            !recommendationText || !analyzeBtn) {
            throw new Error('Required DOM elements not found');
        }

        this.elements = {
            form,
            resultsContainer,
            healthScore,
            cashFlowValue,
            emergencyFundValue,
            debtRatioValue,
            savingsRateValue,
            recommendationText,
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

        // Add info icon click handlers
        this.initializeInfoBoxes();
    }

    /**
     * Initialize info box functionality
     */
    private initializeInfoBoxes(): void {
        const infoIcons = document.querySelectorAll('.info-icon');
        infoIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const tooltip = icon.querySelector('.tooltip') as HTMLElement;
                if (tooltip) {
                    // Toggle tooltip visibility on click for mobile
                    tooltip.style.opacity = tooltip.style.opacity === '1' ? '0' : '1';
                    tooltip.style.visibility = tooltip.style.visibility === 'visible' ? 'hidden' : 'visible';
                }
            });
        });

        // Close tooltips when clicking elsewhere
        document.addEventListener('click', () => {
            const tooltips = document.querySelectorAll('.tooltip') as NodeListOf<HTMLElement>;
            tooltips.forEach(tooltip => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            });
        });
    }

    /**
     * Get user input data
     */
    private getUserData(): UserFinancialData {
        return {
            // Required basic information
            monthlyIncome: this.getNumericValue('monthlyIncome'),
            monthlyExpenses: this.getNumericValue('monthlyExpenses'),
            savings: this.getNumericValue('savings'),
            debt: this.getNumericValue('debt'),
            
            // Optional advanced information
            age: this.getNumericValue('age') || undefined,
            retirementAge: this.getNumericValue('retirementAge') || undefined,
            riskTolerance: this.getSelectValue('riskTolerance') as 'conservative' | 'moderate' | 'aggressive',
            currentInvestments: this.getNumericValue('currentInvestments') || undefined,
            monthlyInvestmentContribution: this.getNumericValue('monthlyInvestmentContribution') || undefined,
            emergencyFundGoal: this.getNumericValue('emergencyFundGoal') || 6
        };
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
     * Perform comprehensive financial analysis
     */
    private performAnalysis(): void {
        try {
            const userData = this.getUserData();
            
            const validation = this.validateUserData(userData);
            if (!validation.isValid) {
                this.showError(validation.error!);
                return;
            }

            const analysis = this.calculateAnalysis(userData);
            this.displayResults(analysis, userData);
            
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

        if (data.monthlyExpenses < 0) {
            return { isValid: false, error: 'Monthly expenses cannot be negative' };
        }

        if (data.age && (data.age < 18 || data.age > 100)) {
            return { isValid: false, error: 'Age must be between 18 and 100' };
        }

        if (data.age && data.retirementAge && data.retirementAge <= data.age) {
            return { isValid: false, error: 'Retirement age must be greater than current age' };
        }

        return { isValid: true };
    }

    /**
     * Calculate comprehensive financial analysis
     */
    private calculateAnalysis(data: UserFinancialData): AnalysisResult {
        // Basic calculations
        const cashFlow = data.monthlyIncome - data.monthlyExpenses;
        const emergencyFundMonths = data.monthlyExpenses > 0 ? data.savings / data.monthlyExpenses : 0;
        const debtToIncomeRatio = data.debt / (data.monthlyIncome * 12);
        const savingsRate = data.monthlyIncome > 0 ? (cashFlow / data.monthlyIncome) * 100 : 0;

        // Calculate financial health score
        const score = this.calculateHealthScore(data, cashFlow, emergencyFundMonths, debtToIncomeRatio, savingsRate);

        // Calculate risk assessment
        const riskAssessment = this.calculateRiskAssessment(data, cashFlow, emergencyFundMonths, debtToIncomeRatio);

        // Generate recommendation
        const recommendation = this.generateRecommendation(data, cashFlow, emergencyFundMonths, debtToIncomeRatio, score);

        const analysis: AnalysisResult = {
            score,
            cashFlow,
            recommendation,
            emergencyFundMonths,
            debtToIncomeRatio,
            savingsRate,
            riskAssessment
        };

        // Add advanced features only if age is provided
        if (data.age) {
            analysis.retirementProjections = this.calculateRetirementProjections(data);
            analysis.wealthProjections = this.calculateWealthProjections(data);
            analysis.financialMilestones = this.calculateFinancialMilestones(data, cashFlow);
        }

        return analysis;
    }

    /**
     * Calculate financial health score (0-100)
     */
    private calculateHealthScore(
        data: UserFinancialData,
        cashFlow: number,
        emergencyMonths: number,
        debtRatio: number,
        savingsRate: number
    ): number {
        let score = 0;

        // Cash flow (25 points)
        if (cashFlow > 0) {
            const flowRatio = Math.min(cashFlow / data.monthlyIncome, 0.5); // Cap at 50%
            score += flowRatio * 50; // Up to 25 points
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

        // Savings rate (25 points)
        if (savingsRate >= 20) score += 25;
        else if (savingsRate >= 15) score += 20;
        else if (savingsRate >= 10) score += 15;
        else if (savingsRate >= 5) score += 10;
        else if (savingsRate > 0) score += 5;

        return Math.round(Math.max(0, Math.min(100, score)));
    }

    /**
     * Calculate retirement projections (only if age provided)
     */
    private calculateRetirementProjections(data: UserFinancialData): RetirementProjections | undefined {
        if (!data.age) return undefined;

        const retirementAge = data.retirementAge || 67;
        const yearsToRetirement = retirementAge - data.age;
        const expectedReturn = this.getExpectedReturn(data.riskTolerance);
        
        // Current retirement wealth
        const currentRetirementWealth = data.currentInvestments || 0;
        const monthlyContribution = data.monthlyInvestmentContribution || 0;
        
        // Future value calculations
        const futureValueCurrent = currentRetirementWealth * Math.pow(1 + expectedReturn, yearsToRetirement);
        
        const monthlyReturn = expectedReturn / 12;
        const totalMonths = yearsToRetirement * 12;
        const futureValueContributions = monthlyContribution > 0 ? 
            monthlyContribution * ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn) : 0;
        
        const projectedRetirementWealth = futureValueCurrent + futureValueContributions;
        
        // Calculate required wealth for income replacement
        const targetIncomeReplacement = data.monthlyIncome * 0.8; // 80% income replacement
        const requiredWealth = targetIncomeReplacement * 12 / 0.04; // 4% withdrawal rule
        
        const shortfall = Math.max(0, requiredWealth - projectedRetirementWealth);
        const requiredMonthlyContribution = shortfall > 0 && totalMonths > 0 ? 
            shortfall * monthlyReturn / (Math.pow(1 + monthlyReturn, totalMonths) - 1) : 0;
        
        // Projected retirement income (4% withdrawal rule)
        const projectedMonthlyRetirementIncome = (projectedRetirementWealth * 0.04) / 12;
        
        // Social Security estimate (rough approximation)
        const socialSecurityEstimate = Math.min(data.monthlyIncome * 0.4, 3000);
        
        const retirementReadinessScore = Math.min(100, (projectedRetirementWealth / requiredWealth) * 100);
        
        return {
            yearsToRetirement,
            projectedRetirementWealth,
            requiredMonthlyContribution: Math.max(0, requiredMonthlyContribution),
            retirementReadinessScore,
            projectedMonthlyRetirementIncome,
            socialSecurityEstimate,
            shortfallOrSurplus: projectedRetirementWealth - requiredWealth
        };
    }

    /**
     * Calculate wealth projections with inflation adjustment
     */
    private calculateWealthProjections(data: UserFinancialData): WealthProjections | undefined {
        if (!data.age) return undefined;

        const expectedReturn = this.getExpectedReturn(data.riskTolerance);
        const currentWealth = (data.savings || 0) + (data.currentInvestments || 0);
        const monthlyContribution = data.monthlyInvestmentContribution || 0;
        const monthlyReturn = expectedReturn / 12;
        
        // Calculate projections
        const fiveYearMonths = 60;
        const fiveYearFutureValue = currentWealth * Math.pow(1 + expectedReturn, 5) +
            (monthlyContribution > 0 ? monthlyContribution * ((Math.pow(1 + monthlyReturn, fiveYearMonths) - 1) / monthlyReturn) : 0);
        
        const tenYearMonths = 120;
        const tenYearFutureValue = currentWealth * Math.pow(1 + expectedReturn, 10) +
            (monthlyContribution > 0 ? monthlyContribution * ((Math.pow(1 + monthlyReturn, tenYearMonths) - 1) / monthlyReturn) : 0);
        
        const retirementAge = data.retirementAge || 67;
        const yearsToRetirement = retirementAge - data.age;
        const retirementMonths = yearsToRetirement * 12;
        const retirementFutureValue = currentWealth * Math.pow(1 + expectedReturn, yearsToRetirement) +
            (monthlyContribution > 0 ? monthlyContribution * ((Math.pow(1 + monthlyReturn, retirementMonths) - 1) / monthlyReturn) : 0);
        
        const totalContributions = monthlyContribution * retirementMonths;
        const investmentGrowth = retirementFutureValue - currentWealth - totalContributions;
        
        // Adjust for inflation (3.5% historical average)
        const fiveYearReal = fiveYearFutureValue / Math.pow(1 + this.HISTORICAL_INFLATION_RATE, 5);
        const tenYearReal = tenYearFutureValue / Math.pow(1 + this.HISTORICAL_INFLATION_RATE, 10);
        const retirementReal = retirementFutureValue / Math.pow(1 + this.HISTORICAL_INFLATION_RATE, yearsToRetirement);
        
        return {
            fiveYearProjection: fiveYearFutureValue,
            tenYearProjection: tenYearFutureValue,
            retirementProjection: retirementFutureValue,
            compoundGrowthRate: expectedReturn,
            totalContributions,
            investmentGrowth,
            fiveYearReal,
            tenYearReal,
            retirementReal
        };
    }

    /**
     * Calculate financial milestones
     */
    private calculateFinancialMilestones(data: UserFinancialData, cashFlow: number): FinancialMilestone[] {
        const milestones: FinancialMilestone[] = [];
        const monthlySavings = Math.max(0, cashFlow);
        
        // Emergency fund milestone
        const emergencyFundTarget = data.monthlyExpenses * data.emergencyFundGoal;
        const emergencyFundNeeded = Math.max(0, emergencyFundTarget - data.savings);
        const emergencyFundTime = monthlySavings > 0 ? emergencyFundNeeded / monthlySavings : 999;
        
        if (emergencyFundNeeded > 0) {
            milestones.push({
                milestone: `Emergency Fund (${data.emergencyFundGoal} months)`,
                targetAmount: emergencyFundTarget,
                estimatedTimeToReach: emergencyFundTime,
                monthlyContributionNeeded: emergencyFundTime < 999 ? emergencyFundNeeded / emergencyFundTime : emergencyFundNeeded,
                priority: 'high',
                achievable: emergencyFundTime < 60
            });
        }
        
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
        
        return milestones.sort((a, b) => a.estimatedTimeToReach - b.estimatedTimeToReach);
    }

    /**
     * Calculate risk assessment
     */
    private calculateRiskAssessment(
        data: UserFinancialData,
        cashFlow: number,
        emergencyMonths: number,
        debtRatio: number
    ): RiskAssessment {
        const riskFactors: string[] = [];
        let riskScore = 0;
        
        // Emergency fund risk
        if (emergencyMonths < 1) {
            riskFactors.push('No emergency fund');
            riskScore += 30;
        } else if (emergencyMonths < 3) {
            riskFactors.push('Insufficient emergency fund (less than 3 months)');
            riskScore += 20;
        }
        
        // Cash flow risk
        if (cashFlow <= 0) {
            riskFactors.push('Negative or zero cash flow');
            riskScore += 40;
        }
        
        // Debt risk
        if (debtRatio > 0.4) {
            riskFactors.push('Very high debt-to-income ratio (over 40%)');
            riskScore += 25;
        } else if (debtRatio > 0.3) {
            riskFactors.push('High debt-to-income ratio (over 30%)');
            riskScore += 15;
        }
        
        // Investment risk
        if (data.age && data.age > 30 && (!data.currentInvestments || data.currentInvestments === 0)) {
            riskFactors.push('No retirement investments at age 30+');
            riskScore += 20;
        }
        
        const overallRiskLevel: 'low' | 'medium' | 'high' = 
            riskScore < 20 ? 'low' : riskScore < 50 ? 'medium' : 'high';
        
        const recommendations = this.generateRiskRecommendations(riskFactors);
        
        return {
            overallRiskLevel,
            riskFactors,
            recommendations,
            emergencyFundAdequacy: emergencyMonths >= data.emergencyFundGoal,
            diversificationScore: Math.max(0, 100 - riskScore)
        };
    }

    /**
     * Generate risk-based recommendations
     */
    private generateRiskRecommendations(riskFactors: string[]): string[] {
        const recommendations: string[] = [];
        
        if (riskFactors.some(f => f.includes('emergency fund'))) {
            recommendations.push('Build emergency fund to 3-6 months of expenses');
        }
        
        if (riskFactors.some(f => f.includes('cash flow'))) {
            recommendations.push('Reduce expenses or increase income to improve cash flow');
        }
        
        if (riskFactors.some(f => f.includes('debt'))) {
            recommendations.push('Focus on debt reduction using avalanche or snowball method');
        }
        
        if (riskFactors.some(f => f.includes('retirement'))) {
            recommendations.push('Start investing for retirement with 401(k) or IRA');
        }
        
        return recommendations;
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
     * Generate comprehensive recommendation
     */
    private generateRecommendation(
        data: UserFinancialData,
        cashFlow: number,
        emergencyMonths: number,
        debtRatio: number,
        score: number
    ): string {
        if (cashFlow <= 0) {
            return `🚨 Priority: You're spending ${this.formatCurrency(Math.abs(cashFlow))} more than you earn monthly. Create a budget to reduce expenses or increase income immediately.`;
        }

        if (emergencyMonths < 1) {
            return `🏦 Emergency Fund: Start building an emergency fund with your ${this.formatCurrency(cashFlow)} monthly surplus. Aim for ${this.formatCurrency(data.monthlyExpenses * 3)} (3 months of expenses) as your first milestone.`;
        }

        if (debtRatio > 0.3) {
            return `💳 Debt Reduction: Your debt-to-income ratio is ${(debtRatio * 100).toFixed(1)}%. Use your ${this.formatCurrency(cashFlow)} monthly surplus to aggressively pay down high-interest debt first.`;
        }

        if (emergencyMonths < data.emergencyFundGoal) {
            return `💰 Emergency Fund: You have ${emergencyMonths.toFixed(1)} months of expenses saved. Continue building to ${data.emergencyFundGoal} months (${this.formatCurrency(data.monthlyExpenses * data.emergencyFundGoal)}).`;
        }

        if (score >= 80) {
            return `🌟 Excellent! Your financial health is strong. Consider maximizing retirement contributions and exploring additional investment opportunities with your ${this.formatCurrency(cashFlow)} monthly surplus.`;
        }

        if (score >= 60) {
            return `📈 Good progress! Focus on increasing your investment contributions and continue building wealth. Consider automating investments to maintain momentum.`;
        }

        return `⚡ Improvement needed: Focus on increasing your savings rate and building emergency reserves. Every dollar saved today helps secure your financial future.`;
    }

    /**
     * Display comprehensive results
     */
    private displayResults(analysis: AnalysisResult, userData: UserFinancialData): void {
        // Update basic metrics
        this.elements.healthScore.textContent = analysis.score.toString();
        this.elements.cashFlowValue.textContent = this.formatCurrency(analysis.cashFlow);
        this.elements.emergencyFundValue.textContent = `${analysis.emergencyFundMonths.toFixed(1)} months`;
        this.elements.debtRatioValue.textContent = `${(analysis.debtToIncomeRatio * 100).toFixed(1)}%`;
        this.elements.savingsRateValue.textContent = `${Math.max(0, analysis.savingsRate).toFixed(1)}%`;
        this.elements.recommendationText.textContent = analysis.recommendation;

        // Create charts if advanced data is available
        if (analysis.wealthProjections && userData.age) {
            this.createCharts(analysis, userData);
        }

        // Show results with animation
        this.elements.resultsContainer.classList.add('visible');
        this.elements.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Create wealth and health trend charts
     */
    private createCharts(analysis: AnalysisResult, userData: UserFinancialData): void {
        // Destroy existing charts
        if (this.wealthChart) {
            this.wealthChart.destroy();
        }
        if (this.healthChart) {
            this.healthChart.destroy();
        }

        // Create wealth projection chart
        this.createWealthChart(analysis.wealthProjections!, userData);
        
        // Create health trend chart
        this.createHealthTrendChart(analysis, userData);
    }

    /**
     * Create wealth projection chart
     */
    private createWealthChart(projections: WealthProjections, userData: UserFinancialData): void {
        const canvas = document.getElementById('wealthChart') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d')!;
        
        const currentWealth = (userData.savings || 0) + (userData.currentInvestments || 0);
        const years = userData.age ? [
            userData.age,
            userData.age + 5,
            userData.age + 10,
            userData.retirementAge || 67
        ] : [0, 5, 10, 30];
        
        const nominalData = [
            currentWealth,
            projections.fiveYearProjection,
            projections.tenYearProjection,
            projections.retirementProjection
        ];
        
        const realData = [
            currentWealth,
            projections.fiveYearReal,
            projections.tenYearReal,
            projections.retirementReal
        ];

        this.wealthChart = new (window as any).Chart(ctx, {
            type: 'line',
            data: {
                labels: years.map(year => `Age ${year}`),
                datasets: [
                    {
                        label: 'Projected Wealth',
                        data: nominalData,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Real Purchasing Power',
                        data: realData,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context: any) => {
                                return `${context.dataset.label}: ${this.formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value: any) => this.formatCurrency(value as number)
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    /**
     * Create financial health trend chart
     */
    private createHealthTrendChart(analysis: AnalysisResult, _userData: UserFinancialData): void {
        const canvas = document.getElementById('healthChart') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d')!;
        
        // Simulate monthly health score progression (this could be enhanced with real historical data)
        const months = [];
        const healthScores = [];
        const currentScore = analysis.score;
        
        // Generate 12 months of projected improvement
        for (let i = 0; i < 12; i++) {
            months.push(new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                month: 'short', 
                year: '2-digit' 
            }));
            
            // Simulate gradual improvement based on current cash flow
            const improvementRate = analysis.cashFlow > 0 ? 2 : -1;
            const projectedScore = Math.min(100, Math.max(0, currentScore + (i * improvementRate)));
            healthScores.push(projectedScore);
        }

        this.healthChart = new (window as any).Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Financial Health Score',
                    data: healthScores,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context: any) => {
                                return `Health Score: ${context.parsed.y}/100`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: (value: any) => `${value}/100`
                        }
                    }
                }
            }
        });
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