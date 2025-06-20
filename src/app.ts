import { UserFinancialData, FinancialAnalysisResult, FinancialMetric, Recommendation, DOMElements } from './types';

/**
 * Comprehensive Financial Health Analyzer
 * A clean, modern financial analysis application
 */
class FinancialHealthApp {
    private elements!: DOMElements;

    constructor() {
        this.initializeDOM();
        this.attachEventListeners();
    }

    /**
     * Initialize DOM elements
     */
    private initializeDOM(): void {
        this.elements = {
            form: document.getElementById('financialForm') as HTMLFormElement,
            resultsContainer: document.getElementById('results') as HTMLElement,
            healthScoreSummary: document.getElementById('healthScoreSummary') as HTMLElement,
            healthScore: document.getElementById('healthScore') as HTMLElement,
            errorMessage: document.getElementById('error') as HTMLElement,
            
            // Quick Metrics
            cashFlowValue: document.getElementById('cashFlowValue') as HTMLElement,
            emergencyFundValue: document.getElementById('emergencyFundValue') as HTMLElement,
            debtRatioValue: document.getElementById('debtRatioValue') as HTMLElement,
            savingsRateValue: document.getElementById('savingsRateValue') as HTMLElement,
            
            // Analysis Content Areas
            coreMetrics: document.getElementById('coreMetrics') as HTMLElement,
            liquidityAnalysis: document.getElementById('liquidityAnalysis') as HTMLElement,
            debtAnalysis: document.getElementById('debtAnalysis') as HTMLElement,
            investmentAnalysis: document.getElementById('investmentAnalysis') as HTMLElement,
            wealthProjections: document.getElementById('wealthProjections') as HTMLElement,
            riskAssessment: document.getElementById('riskAssessment') as HTMLElement,
            recommendationsList: document.getElementById('recommendationsList') as HTMLElement
        };
    }

    /**
     * Attach event listeners
     */
    private attachEventListeners(): void {
        this.elements.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.analyzeFinancialHealth();
        });
    }

    /**
     * Get user input data from form
     */
    private getUserData(): UserFinancialData | null {
        try {
            const monthlyIncome = parseFloat((document.getElementById('monthlyIncome') as HTMLInputElement).value);
            const monthlyExpenses = parseFloat((document.getElementById('monthlyExpenses') as HTMLInputElement).value);
            const savings = parseFloat((document.getElementById('savings') as HTMLInputElement).value);
            const debt = parseFloat((document.getElementById('debt') as HTMLInputElement).value);
            const age = parseInt((document.getElementById('age') as HTMLInputElement).value);
            const currentInvestments = parseFloat((document.getElementById('currentInvestments') as HTMLInputElement).value);
            const monthlyInvestmentContribution = parseFloat((document.getElementById('monthlyInvestmentContribution') as HTMLInputElement).value);
            const retirementAge = parseInt((document.getElementById('retirementAge') as HTMLInputElement).value);
            const riskTolerance = (document.getElementById('riskTolerance') as HTMLSelectElement).value as 'conservative' | 'moderate' | 'aggressive';

            // Validate required fields
            if (isNaN(monthlyIncome) || isNaN(monthlyExpenses) || isNaN(savings) || 
                isNaN(debt) || isNaN(age) || isNaN(currentInvestments) || 
                isNaN(monthlyInvestmentContribution) || isNaN(retirementAge)) {
                throw new Error('Please fill in all required fields with valid numbers.');
            }

            if (monthlyIncome <= 0) {
                throw new Error('Monthly income must be greater than 0.');
            }

            if (age < 18 || age > 100) {
                throw new Error('Age must be between 18 and 100.');
            }

            if (retirementAge <= age) {
                throw new Error('Retirement age must be greater than current age.');
            }

            return {
                monthlyIncome,
                monthlyExpenses,
                savings,
                debt,
                age,
                currentInvestments,
                monthlyInvestmentContribution,
                retirementAge,
                riskTolerance
            };
        } catch (error) {
            this.showError(error instanceof Error ? error.message : 'Invalid input data');
            return null;
        }
    }

    /**
     * Main analysis function
     */
    private analyzeFinancialHealth(): void {
        this.hideError();
        
        const userData = this.getUserData();
        if (!userData) return;

        const analysis = this.performComprehensiveAnalysis(userData);
        this.displayResults(analysis);
    }

    /**
     * Perform comprehensive financial analysis
     */
    private performComprehensiveAnalysis(data: UserFinancialData): FinancialAnalysisResult {
        // Calculate basic metrics
        const monthlyCashFlow = data.monthlyIncome - data.monthlyExpenses;
        const emergencyFundMonths = data.savings / Math.max(data.monthlyExpenses, 1);
        const debtToIncomeRatio = (data.debt / (data.monthlyIncome * 12)) * 100;
        const savingsRate = ((monthlyCashFlow - data.monthlyInvestmentContribution) / data.monthlyIncome) * 100;
        
        // Calculate health score
        const healthScore = this.calculateHealthScore(data, monthlyCashFlow, emergencyFundMonths, debtToIncomeRatio, savingsRate);
        const healthLevel = this.getHealthLevel(healthScore);

        return {
            healthScore,
            healthLevel,
            monthlyCashFlow,
            emergencyFundMonths,
            debtToIncomeRatio,
            savingsRate,
            coreMetrics: this.generateCoreMetrics(data, monthlyCashFlow, emergencyFundMonths, debtToIncomeRatio, savingsRate),
            liquidityAnalysis: this.generateLiquidityAnalysis(data, monthlyCashFlow, emergencyFundMonths),
            debtAnalysis: this.generateDebtAnalysis(data, debtToIncomeRatio),
            investmentAnalysis: this.generateInvestmentAnalysis(data),
            wealthProjections: this.generateWealthProjections(data),
            riskAssessment: this.generateRiskAssessment(data, emergencyFundMonths, debtToIncomeRatio),
            recommendations: this.generateRecommendations(data, monthlyCashFlow, emergencyFundMonths, debtToIncomeRatio, savingsRate)
        };
    }

    /**
     * Calculate overall financial health score
     */
    private calculateHealthScore(data: UserFinancialData, cashFlow: number, emergencyMonths: number, debtRatio: number, _savingsRate: number): number {
        let score = 0;

        // Cash flow score (25 points)
        if (cashFlow >= data.monthlyIncome * 0.3) score += 25;
        else if (cashFlow >= data.monthlyIncome * 0.2) score += 20;
        else if (cashFlow >= data.monthlyIncome * 0.1) score += 15;
        else if (cashFlow > 0) score += 10;

        // Emergency fund score (25 points)
        if (emergencyMonths >= 6) score += 25;
        else if (emergencyMonths >= 3) score += 20;
        else if (emergencyMonths >= 1) score += 15;
        else if (emergencyMonths >= 0.5) score += 10;

        // Debt management score (25 points)
        if (debtRatio <= 10) score += 25;
        else if (debtRatio <= 20) score += 20;
        else if (debtRatio <= 36) score += 15;
        else if (debtRatio <= 50) score += 10;

        // Investment score (25 points)
        const totalWealth = data.savings + data.currentInvestments;
        const wealthToIncomeRatio = totalWealth / (data.monthlyIncome * 12);
        if (wealthToIncomeRatio >= 2) score += 25;
        else if (wealthToIncomeRatio >= 1) score += 20;
        else if (wealthToIncomeRatio >= 0.5) score += 15;
        else if (data.monthlyInvestmentContribution > 0) score += 10;

        return Math.round(score);
    }

    /**
     * Get health level description
     */
    private getHealthLevel(score: number): string {
        if (score >= 80) return 'Excellent';
        if (score >= 65) return 'Good';
        if (score >= 50) return 'Fair';
        if (score >= 35) return 'Limited';
        return 'Critical';
    }

    /**
     * Generate core financial metrics
     */
    private generateCoreMetrics(data: UserFinancialData, cashFlow: number, _emergencyMonths: number, _debtRatio: number, _savingsRate: number): FinancialMetric[] {
        const metrics: FinancialMetric[] = [];

        // Cash Flow Coverage Ratio
        const coverageRatio = (cashFlow / data.monthlyExpenses) * 100;
        metrics.push({
            title: 'Cash Flow Coverage Ratio',
            value: `${coverageRatio.toFixed(1)}%`,
            description: 'Measures how much of your expenses are covered by positive cash flow. Higher is better.',
            status: coverageRatio >= 30 ? 'excellent' : coverageRatio >= 20 ? 'good' : coverageRatio >= 10 ? 'fair' : 'poor',
            number: coverageRatio
        });

        // Financial Flexibility Index
        const flexibilityIndex = ((cashFlow * 12) / (data.monthlyIncome * 12)) * 100;
        metrics.push({
            title: 'Financial Flexibility Index',
            value: `${flexibilityIndex.toFixed(1)}%`,
            description: 'Percentage of income available for discretionary spending and unexpected expenses.',
            status: flexibilityIndex >= 25 ? 'excellent' : flexibilityIndex >= 15 ? 'good' : flexibilityIndex >= 5 ? 'fair' : 'poor',
            number: flexibilityIndex
        });

        // Wealth Accumulation Rate
        const monthlyWealthGrowth = cashFlow + data.monthlyInvestmentContribution;
        const wealthRate = (monthlyWealthGrowth / data.monthlyIncome) * 100;
        metrics.push({
            title: 'Wealth Accumulation Rate',
            value: `${wealthRate.toFixed(1)}%`,
            description: 'Percentage of income that builds wealth through savings and investments.',
            status: wealthRate >= 20 ? 'excellent' : wealthRate >= 15 ? 'good' : wealthRate >= 10 ? 'fair' : 'poor',
            number: wealthRate
        });

        return metrics;
    }

    /**
     * Generate liquidity analysis
     */
    private generateLiquidityAnalysis(data: UserFinancialData, cashFlow: number, emergencyMonths: number): FinancialMetric[] {
        const metrics: FinancialMetric[] = [];

        // Emergency Fund Adequacy
        metrics.push({
            title: 'Emergency Fund Coverage',
            value: `${emergencyMonths.toFixed(1)} months`,
            description: 'How many months of expenses your emergency fund can cover. Recommended: 3-6 months.',
            status: emergencyMonths >= 6 ? 'excellent' : emergencyMonths >= 3 ? 'good' : emergencyMonths >= 1 ? 'fair' : 'poor',
            number: emergencyMonths
        });

        // Liquidity Ratio
        const liquidityRatio = data.savings / data.monthlyIncome;
        metrics.push({
            title: 'Liquidity Ratio',
            value: `${liquidityRatio.toFixed(1)}x`,
            description: 'Ratio of liquid savings to monthly income. Higher values indicate better financial stability.',
            status: liquidityRatio >= 6 ? 'excellent' : liquidityRatio >= 3 ? 'good' : liquidityRatio >= 1 ? 'fair' : 'poor',
            number: liquidityRatio
        });

        // Cash Flow Stability
        const stabilityScore = Math.max(0, Math.min(100, (cashFlow / data.monthlyIncome) * 100));
        metrics.push({
            title: 'Cash Flow Stability',
            value: `${stabilityScore.toFixed(0)}%`,
            description: 'Measures the consistency and adequacy of your monthly cash flow.',
            status: stabilityScore >= 25 ? 'excellent' : stabilityScore >= 15 ? 'good' : stabilityScore >= 5 ? 'fair' : 'poor',
            number: stabilityScore
        });

        return metrics;
    }

    /**
     * Generate debt analysis
     */
    private generateDebtAnalysis(data: UserFinancialData, debtRatio: number): FinancialMetric[] {
        const metrics: FinancialMetric[] = [];

        // Debt-to-Income Ratio
        metrics.push({
            title: 'Debt-to-Income Ratio',
            value: `${debtRatio.toFixed(1)}%`,
            description: 'Percentage of annual income consumed by debt. Lower is better. Recommended: <20%.',
            status: debtRatio <= 10 ? 'excellent' : debtRatio <= 20 ? 'good' : debtRatio <= 36 ? 'fair' : 'poor',
            number: debtRatio
        });

        // Debt Service Coverage
        const monthlyCashFlow = data.monthlyIncome - data.monthlyExpenses;
        const debtServiceRatio = data.debt > 0 ? (monthlyCashFlow * 12) / data.debt : 100;
        metrics.push({
            title: 'Debt Service Coverage',
            value: data.debt > 0 ? `${(debtServiceRatio * 100).toFixed(0)}%` : 'No Debt',
            description: 'Ability to service debt with available cash flow. Higher is better.',
            status: data.debt === 0 ? 'excellent' : debtServiceRatio >= 0.5 ? 'excellent' : debtServiceRatio >= 0.3 ? 'good' : debtServiceRatio >= 0.1 ? 'fair' : 'poor',
            number: debtServiceRatio * 100
        });

        // Debt Payoff Timeline
        const monthsToPayoff = data.debt > 0 && monthlyCashFlow > 0 ? data.debt / monthlyCashFlow : 0;
        metrics.push({
            title: 'Debt Payoff Timeline',
            value: data.debt === 0 ? 'Debt Free' : monthsToPayoff > 0 ? `${(monthsToPayoff / 12).toFixed(1)} years` : 'Not Payable',
            description: 'Time to pay off all debt using current cash flow. Faster is better.',
            status: data.debt === 0 ? 'excellent' : monthsToPayoff <= 24 ? 'good' : monthsToPayoff <= 60 ? 'fair' : 'poor',
            number: monthsToPayoff
        });

        return metrics;
    }

    /**
     * Generate investment analysis
     */
    private generateInvestmentAnalysis(data: UserFinancialData): FinancialMetric[] {
        const metrics: FinancialMetric[] = [];
        const yearsToRetirement = data.retirementAge - data.age;

        // Investment Rate
        const investmentRate = (data.monthlyInvestmentContribution / data.monthlyIncome) * 100;
        metrics.push({
            title: 'Investment Contribution Rate',
            value: `${investmentRate.toFixed(1)}%`,
            description: 'Percentage of income invested monthly. Recommended: 10-15% minimum.',
            status: investmentRate >= 15 ? 'excellent' : investmentRate >= 10 ? 'good' : investmentRate >= 5 ? 'fair' : 'poor',
            number: investmentRate
        });

        // Investment Efficiency
        const totalWealth = data.savings + data.currentInvestments;
        const annualIncome = data.monthlyIncome * 12;
        const wealthMultiplier = totalWealth / annualIncome;
        metrics.push({
            title: 'Wealth-to-Income Multiple',
            value: `${wealthMultiplier.toFixed(1)}x`,
            description: 'Total wealth relative to annual income. Target: 1x by 30, 3x by 40, 5x by 50.',
            status: wealthMultiplier >= 3 ? 'excellent' : wealthMultiplier >= 1.5 ? 'good' : wealthMultiplier >= 0.5 ? 'fair' : 'poor',
            number: wealthMultiplier
        });

        // Retirement Readiness
        const expectedReturn = data.riskTolerance === 'aggressive' ? 0.08 : data.riskTolerance === 'moderate' ? 0.07 : 0.06;
        const futureValue = this.calculateFutureValue(data.currentInvestments, data.monthlyInvestmentContribution, expectedReturn, yearsToRetirement);
        const retirementIncomeNeeded = data.monthlyIncome * 12 * 0.8; // 80% replacement ratio
        const readinessRatio = (futureValue * 0.04) / retirementIncomeNeeded; // 4% withdrawal rule
        
        metrics.push({
            title: 'Retirement Readiness Score',
            value: `${(readinessRatio * 100).toFixed(0)}%`,
            description: 'Projected retirement income as percentage of needed income (80% of current).',
            status: readinessRatio >= 1 ? 'excellent' : readinessRatio >= 0.7 ? 'good' : readinessRatio >= 0.4 ? 'fair' : 'poor',
            number: readinessRatio * 100
        });

        return metrics;
    }

    /**
     * Generate wealth projections
     */
    private generateWealthProjections(data: UserFinancialData): FinancialMetric[] {
        const metrics: FinancialMetric[] = [];
        const expectedReturn = data.riskTolerance === 'aggressive' ? 0.08 : data.riskTolerance === 'moderate' ? 0.07 : 0.06;
        const yearsToRetirement = data.retirementAge - data.age;

        // 5-Year Wealth Projection
        const fiveYearWealth = this.calculateFutureValue(data.currentInvestments, data.monthlyInvestmentContribution, expectedReturn, 5);
        metrics.push({
            title: '5-Year Wealth Projection',
            value: this.formatCurrency(fiveYearWealth),
            description: `Projected total wealth in 5 years with ${(expectedReturn * 100).toFixed(0)}% annual return.`,
            status: fiveYearWealth >= 100000 ? 'excellent' : fiveYearWealth >= 50000 ? 'good' : fiveYearWealth >= 25000 ? 'fair' : 'poor',
            number: fiveYearWealth
        });

        // 10-Year Wealth Projection
        const tenYearWealth = this.calculateFutureValue(data.currentInvestments, data.monthlyInvestmentContribution, expectedReturn, 10);
        metrics.push({
            title: '10-Year Wealth Projection',
            value: this.formatCurrency(tenYearWealth),
            description: `Projected total wealth in 10 years with ${(expectedReturn * 100).toFixed(0)}% annual return.`,
            status: tenYearWealth >= 250000 ? 'excellent' : tenYearWealth >= 150000 ? 'good' : tenYearWealth >= 75000 ? 'fair' : 'poor',
            number: tenYearWealth
        });

        // Retirement Wealth Projection
        const retirementWealth = this.calculateFutureValue(data.currentInvestments, data.monthlyInvestmentContribution, expectedReturn, yearsToRetirement);
        metrics.push({
            title: 'Retirement Wealth Projection',
            value: this.formatCurrency(retirementWealth),
            description: `Projected wealth at age ${data.retirementAge} with current contribution rate.`,
            status: retirementWealth >= 1000000 ? 'excellent' : retirementWealth >= 500000 ? 'good' : retirementWealth >= 250000 ? 'fair' : 'poor',
            number: retirementWealth
        });

        // Required Monthly Contribution
        const targetRetirementWealth = data.monthlyIncome * 12 * 0.8 / 0.04; // 4% rule
        const requiredContribution = this.calculateRequiredContribution(data.currentInvestments, targetRetirementWealth, expectedReturn, yearsToRetirement);
        metrics.push({
            title: 'Required Monthly Investment',
            value: this.formatCurrency(requiredContribution),
            description: 'Monthly investment needed to reach retirement income goal.',
            status: data.monthlyInvestmentContribution >= requiredContribution ? 'excellent' : 
                    data.monthlyInvestmentContribution >= requiredContribution * 0.75 ? 'good' : 
                    data.monthlyInvestmentContribution >= requiredContribution * 0.5 ? 'fair' : 'poor',
            number: requiredContribution
        });

        return metrics;
    }

    /**
     * Generate risk assessment
     */
    private generateRiskAssessment(data: UserFinancialData, emergencyMonths: number, debtRatio: number): FinancialMetric[] {
        const metrics: FinancialMetric[] = [];

        // Income Concentration Risk
        const incomeRisk = 100 - Math.min(90, emergencyMonths * 15); // Single income source assumed
        metrics.push({
            title: 'Income Vulnerability Score',
            value: `${incomeRisk.toFixed(0)}%`,
            description: 'Risk level if primary income is lost. Lower is better.',
            status: incomeRisk <= 25 ? 'excellent' : incomeRisk <= 50 ? 'good' : incomeRisk <= 75 ? 'fair' : 'poor',
            number: incomeRisk
        });

        // Market Risk Exposure
        const investmentRatio = data.currentInvestments / (data.savings + data.currentInvestments + 0.01);
        const marketRisk = investmentRatio * (data.riskTolerance === 'aggressive' ? 30 : data.riskTolerance === 'moderate' ? 20 : 10);
        metrics.push({
            title: 'Market Risk Exposure',
            value: `${marketRisk.toFixed(0)}%`,
            description: 'Potential wealth loss in market downturn. Consider diversification.',
            status: marketRisk <= 15 ? 'excellent' : marketRisk <= 25 ? 'good' : marketRisk <= 35 ? 'fair' : 'poor',
            number: marketRisk
        });

        // Debt Stress Level
        const debtStress = Math.min(100, debtRatio * 2);
        metrics.push({
            title: 'Debt Stress Level',
            value: `${debtStress.toFixed(0)}%`,
            description: 'Financial stress from debt burden. Lower is better.',
            status: debtStress <= 20 ? 'excellent' : debtStress <= 40 ? 'good' : debtStress <= 70 ? 'fair' : 'poor',
            number: debtStress
        });

        // Inflation Risk
        const inflationRisk = Math.max(0, (0.035 / 0.07) * 100);
        metrics.push({
            title: 'Inflation Risk Impact',
            value: `${inflationRisk.toFixed(0)}%`,
            description: 'Potential purchasing power erosion over time at 3.5% inflation.',
            status: inflationRisk <= 30 ? 'excellent' : inflationRisk <= 45 ? 'good' : inflationRisk <= 60 ? 'fair' : 'poor',
            number: inflationRisk
        });

        return metrics;
    }

    /**
     * Generate personalized recommendations
     */
    private generateRecommendations(data: UserFinancialData, cashFlow: number, emergencyMonths: number, debtRatio: number, _savingsRate: number): Recommendation[] {
        const recommendations: Recommendation[] = [];

        // Emergency fund recommendations
        if (emergencyMonths < 3) {
            recommendations.push({
                priority: 'high',
                icon: '🚨',
                text: `Build your emergency fund to at least 3 months of expenses ($${(data.monthlyExpenses * 3).toLocaleString()}). You currently have ${emergencyMonths.toFixed(1)} months covered.`
            });
        } else if (emergencyMonths < 6) {
            recommendations.push({
                priority: 'medium',
                icon: '💰',
                text: `Consider expanding your emergency fund to 6 months of expenses ($${(data.monthlyExpenses * 6).toLocaleString()}) for better financial security.`
            });
        }

        // Debt recommendations
        if (debtRatio > 20) {
            recommendations.push({
                priority: 'high',
                icon: '💳',
                text: `Your debt-to-income ratio of ${debtRatio.toFixed(1)}% is high. Focus on debt reduction by allocating extra cash flow to high-interest debt first.`
            });
        }

        // Investment recommendations
        const investmentRate = (data.monthlyInvestmentContribution / data.monthlyIncome) * 100;
        if (investmentRate < 10) {
            recommendations.push({
                priority: 'high',
                icon: '📈',
                text: `Increase your investment rate to at least 10% of income ($${(data.monthlyIncome * 0.1).toLocaleString()}/month). You're currently investing ${investmentRate.toFixed(1)}%.`
            });
        } else if (investmentRate < 15) {
            recommendations.push({
                priority: 'medium',
                icon: '🎯',
                text: `Consider increasing investments to 15% of income for optimal retirement preparation. Current rate: ${investmentRate.toFixed(1)}%.`
            });
        }

        // Cash flow recommendations
        if (cashFlow < data.monthlyIncome * 0.1) {
            recommendations.push({
                priority: 'high',
                icon: '📊',
                text: `Your cash flow of $${cashFlow.toLocaleString()}/month is tight. Review expenses and look for areas to optimize spending.`
            });
        }

        // Risk tolerance recommendations
        if (data.age < 40 && data.riskTolerance === 'conservative') {
            recommendations.push({
                priority: 'medium',
                icon: '⚖️',
                text: `At age ${data.age}, consider a more aggressive investment approach to maximize long-term growth potential.`
            });
        }

        // Add default recommendation if none generated
        if (recommendations.length === 0) {
            recommendations.push({
                priority: 'low',
                icon: '✅',
                text: 'Your financial health looks strong! Continue monitoring your progress and consider optimizing your investment allocation.'
            });
        }

        return recommendations;
    }

    /**
     * Calculate future value with monthly contributions
     */
    private calculateFutureValue(presentValue: number, monthlyContribution: number, annualRate: number, years: number): number {
        const monthlyRate = annualRate / 12;
        const totalMonths = years * 12;
        
        // Future value of present amount
        const fvPresent = presentValue * Math.pow(1 + monthlyRate, totalMonths);
        
        // Future value of monthly contributions (annuity)
        const fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
        
        return fvPresent + fvContributions;
    }

    /**
     * Calculate required monthly contribution
     */
    private calculateRequiredContribution(presentValue: number, targetValue: number, annualRate: number, years: number): number {
        const monthlyRate = annualRate / 12;
        const totalMonths = years * 12;
        
        const fvPresent = presentValue * Math.pow(1 + monthlyRate, totalMonths);
        const remainingNeeded = targetValue - fvPresent;
        
        if (remainingNeeded <= 0) return 0;
        
        return remainingNeeded / ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    }

    /**
     * Format currency values
     */
    private formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    }

    /**
     * Display analysis results
     */
    private displayResults(analysis: FinancialAnalysisResult): void {
        // Update health score
        this.elements.healthScore.textContent = analysis.healthScore.toString();
        this.elements.healthScoreSummary.className = `results-summary score-bg-${analysis.healthLevel.toLowerCase()}`;

        // Update quick metrics
        this.elements.cashFlowValue.textContent = this.formatCurrency(analysis.monthlyCashFlow);
        this.elements.emergencyFundValue.textContent = `${analysis.emergencyFundMonths.toFixed(1)} months`;
        this.elements.debtRatioValue.textContent = `${analysis.debtToIncomeRatio.toFixed(1)}%`;
        this.elements.savingsRateValue.textContent = `${analysis.savingsRate.toFixed(1)}%`;

        // Populate analysis sections
        this.populateMetricsSection(this.elements.coreMetrics, analysis.coreMetrics);
        this.populateMetricsSection(this.elements.liquidityAnalysis, analysis.liquidityAnalysis);
        this.populateMetricsSection(this.elements.debtAnalysis, analysis.debtAnalysis);
        this.populateMetricsSection(this.elements.investmentAnalysis, analysis.investmentAnalysis);
        this.populateMetricsSection(this.elements.wealthProjections, analysis.wealthProjections);
        this.populateMetricsSection(this.elements.riskAssessment, analysis.riskAssessment);

        // Populate recommendations
        this.populateRecommendations(analysis.recommendations);

        // Show results
        this.elements.resultsContainer.classList.add('visible');
        this.elements.resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Populate metrics section
     */
    private populateMetricsSection(container: HTMLElement, metrics: FinancialMetric[]): void {
        container.innerHTML = `
            <div class="metrics-grid">
                ${metrics.map(metric => `
                    <div class="metric-item ${metric.status}">
                        <div class="metric-title">${metric.title}</div>
                        <div class="metric-number">${metric.value}</div>
                        <div class="metric-description">${metric.description}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Populate recommendations section
     */
    private populateRecommendations(recommendations: Recommendation[]): void {
        this.elements.recommendationsList.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <span style="font-size: 1.2rem;">${rec.icon}</span>
                <div class="recommendation-text">${rec.text}</div>
            </div>
        `).join('');
    }

    /**
     * Show error message
     */
    private showError(message: string): void {
        this.elements.errorMessage.textContent = message;
        this.elements.errorMessage.style.display = 'block';
        this.elements.errorMessage.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Hide error message
     */
    private hideError(): void {
        this.elements.errorMessage.style.display = 'none';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FinancialHealthApp();
}); 