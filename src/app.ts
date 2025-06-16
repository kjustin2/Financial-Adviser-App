import { 
    UserFinancialData, 
    AnalysisResult, 
    DOMElements, 
    RetirementProjections,
    WealthProjections,
    FinancialMilestone,
    RiskAssessment
} from './types';

import { calculateAdvancedMetrics } from './utils/calculations';
import { 
    runMonteCarloSimulation, 
    performStressTest, 
    calculateContributionScenarios
} from './utils/scenarioAnalysis';
import { ChartManager } from './ui/ChartManager';
import { InfoBoxManager } from './ui/InfoBoxManager';
import { FinancialAnalyzer } from './utils/FinancialAnalyzer';

/**
 * Modern Financial Health Analyzer
 * Clean, user-friendly analysis with conditional advanced features
 */
class FinancialHealthApp {
    private elements!: DOMElements;
    private chartManager: ChartManager;
    private infoBoxManager: InfoBoxManager;
    private readonly HISTORICAL_INFLATION_RATE = 0.035; // 3.5% historical average

    constructor() {
        console.log('🚀 Starting Financial Health Analyzer...');
        this.initializeDOM();
        this.chartManager = new ChartManager();
        this.infoBoxManager = new InfoBoxManager();
        this.attachEventListeners();
        console.log('✅ Initialization complete');
        
        // Initialize info box manager (prevents unused variable warning)
        if (this.infoBoxManager) {
            console.log('Info box manager initialized');
        }
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
            emergencyFundGoal: this.getNumericValue('emergencyFundGoal') || 6,
            
            // Major purchase planning
            plannedPurchaseType: this.getSelectValue('plannedPurchaseType') || undefined,
            purchaseCost: this.getNumericValue('purchaseCost') || undefined,
            purchaseTimeframe: this.getNumericValue('purchaseTimeframe') || undefined,
            downPaymentPercent: this.getNumericValue('downPaymentPercent') || undefined
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
            // Clear any previous errors
            this.clearError();
            
            // Get and validate user data
            const userData = this.getUserData();
            console.log('User data collected:', userData);
            
            const validation = this.validateUserData(userData);
            if (!validation.isValid) {
                this.showError(validation.error!);
                return;
            }

            // Create financial analyzer instance
            const analyzer = new FinancialAnalyzer(userData);
            
            // Perform calculations using the analyzer
            const analysis = this.calculateAnalysis(userData, analyzer);
            console.log('Analysis completed:', analysis);
            
            // Display results
            this.displayResults(analysis, userData);
            
        } catch (error) {
            console.error('Analysis failed with error:', error);
            this.showError(`Analysis encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Clear any error messages
     */
    private clearError(): void {
        // Implementation can be added if needed for a dedicated error display area
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
     * Calculate comprehensive financial analysis using the analyzer
     */
    private calculateAnalysis(data: UserFinancialData, analyzer: FinancialAnalyzer): AnalysisResult {
        // Get basic metrics from analyzer
        const basicMetrics = analyzer.calculateBasicMetrics();
        
        // Calculate financial health score with breakdown using analyzer
        const score = analyzer.calculateHealthScore();
        const scoreBreakdown = analyzer.getScoreBreakdown();

        // Calculate risk assessment
        const riskAssessment = this.calculateRiskAssessment(data, basicMetrics.cashFlow, basicMetrics.emergencyFundMonths, basicMetrics.debtToIncomeRatio);

        // Generate recommendation using analyzer
        const recommendations = analyzer.generateRecommendations();
        const recommendation = recommendations.join(' ');

        const analysis: AnalysisResult = {
            score,
            scoreBreakdown,
            cashFlow: basicMetrics.cashFlow,
            recommendation,
            emergencyFundMonths: basicMetrics.emergencyFundMonths,
            debtToIncomeRatio: basicMetrics.debtToIncomeRatio,
            savingsRate: basicMetrics.savingsRate,
            riskAssessment
        };

        // Add advanced features only if age is provided
        if (data.age) {
            analysis.retirementProjections = this.calculateRetirementProjections(data);
            analysis.wealthProjections = this.calculateWealthProjections(data);
            analysis.financialMilestones = this.calculateFinancialMilestones(data, basicMetrics.cashFlow);
            
            // Calculate advanced metrics
            analysis.advancedMetrics = calculateAdvancedMetrics(
                data.monthlyIncome,
                data.monthlyExpenses,
                data.savings,
                data.debt,
                data.age,
                data.riskTolerance,
                data.currentInvestments || 0,
                data.monthlyInvestmentContribution || 0
            );
            
            // Perform scenario analysis for comprehensive planning
            if (data.retirementAge && data.currentInvestments !== undefined) {
                const currentWealth = data.savings + (data.currentInvestments || 0);
                const monthlyContribution = data.monthlyInvestmentContribution || 0;
                const targetWealth = data.monthlyIncome * 12 * 10; // 10x annual income target
                
                analysis.scenarioAnalysis = {
                    stressTest: performStressTest(
                        data.age,
                        data.retirementAge,
                        currentWealth,
                        monthlyContribution,
                        data.riskTolerance
                    ),
                    contributionScenarios: calculateContributionScenarios(
                        data.age,
                        data.retirementAge,
                        currentWealth,
                        monthlyContribution,
                        data.riskTolerance
                    )
                };
                
                // Run Monte Carlo simulation for retirement planning (simplified)
                if (data.retirementAge - data.age > 5) {
                    analysis.scenarioAnalysis.monteCarlo = runMonteCarloSimulation(
                        data.age,
                        data.retirementAge,
                        currentWealth,
                        monthlyContribution,
                        data.riskTolerance,
                        targetWealth,
                        100 // Reduced iterations for performance
                    );
                }
            }
        }

        return analysis;
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
     * Display comprehensive results
     */
    private displayResults(analysis: AnalysisResult, userData: UserFinancialData): void {
        // Update basic metrics with color coding
        this.elements.healthScore.textContent = analysis.score.toString();
        this.elements.healthScore.className = `health-score ${this.getScoreClass(analysis.score)}`;
        this.elements.cashFlowValue.textContent = this.formatCurrency(analysis.cashFlow);
        this.elements.emergencyFundValue.textContent = `${analysis.emergencyFundMonths.toFixed(1)} months`;
        this.elements.debtRatioValue.textContent = `${(analysis.debtToIncomeRatio * 100).toFixed(1)}%`;
        this.elements.savingsRateValue.textContent = `${Math.max(0, analysis.savingsRate).toFixed(1)}%`;
        this.elements.recommendationText.textContent = analysis.recommendation;

        // Display score breakdown in main section
        this.displayScoreBreakdown(analysis.scoreBreakdown);

        // Display advanced analytics if available
        if (analysis.advancedMetrics && userData.age) {
            this.displayAdvancedAnalytics(analysis);
            // Show the advanced analytics section
            const advancedSection = document.getElementById('advanced-analytics-content');
            if (advancedSection) {
                advancedSection.classList.remove('collapsed');
                const icon = document.getElementById('advanced-analytics-icon');
                if (icon) icon.textContent = '▲';
            }
        }

        // Create charts if advanced data is available
        if (analysis.wealthProjections && userData.age) {
            this.createCharts(analysis, userData);
            // Show the charts section
            const chartsSection = document.getElementById('charts-content');
            if (chartsSection) {
                chartsSection.classList.remove('collapsed');
                const icon = document.getElementById('charts-icon');
                if (icon) icon.textContent = '▲';
            }
        }

        // Show results with animation
        this.elements.resultsContainer.classList.add('visible');
        this.elements.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Display advanced analytics including metrics and scenario analysis
     */
    private displayAdvancedAnalytics(analysis: AnalysisResult): void {
        this.displayAdvancedMetrics(analysis.advancedMetrics);
        
        if (analysis.scenarioAnalysis) {
            this.displayScenarioAnalysis(analysis.scenarioAnalysis);
        }
    }

    /**
     * Display advanced financial metrics
     */
    private displayAdvancedMetrics(metrics: any): void {
        const advancedMetricsDiv = document.getElementById('advancedMetrics');
        if (!advancedMetricsDiv) return;

        const metricsData = [
            {
                name: 'Cash Flow Coverage',
                value: metrics.cashFlowCoverageRatio.toFixed(2),
                score: this.getMetricScore(metrics.cashFlowCoverageRatio, [0.5, 1.0, 1.5, 2.0]),
                description: 'Ability to cover fixed expenses with positive cash flow'
            },
            {
                name: 'Debt Service Coverage',
                value: metrics.debtServiceCoverage === Infinity ? '∞' : metrics.debtServiceCoverage.toFixed(1),
                score: this.getMetricScore(metrics.debtServiceCoverage === Infinity ? 100 : metrics.debtServiceCoverage, [2, 4, 6, 10]),
                description: 'Income available to service debt payments'
            },
            {
                name: 'Liquidity Ratio',
                value: `${metrics.liquidityRatio.toFixed(1)} months`,
                score: this.getMetricScore(metrics.liquidityRatio, [1, 3, 6, 12]),
                description: 'Months of expenses covered by liquid assets'
            },
            {
                name: 'Savings Efficiency',
                value: `${metrics.savingsEfficiency}%`,
                score: this.getMetricScore(metrics.savingsEfficiency, [25, 50, 75, 90]),
                description: 'How well your savings rate compares to optimal targets'
            },
            {
                name: 'Financial Stress Level',
                value: `${metrics.financialStressScore}/100`,
                score: this.getMetricScore(100 - metrics.financialStressScore, [25, 50, 75, 90]),
                description: 'Combined stress from debt burden and emergency fund adequacy (lower is better)'
            },
            {
                name: 'Wealth Building Velocity',
                value: `${metrics.wealthBuildingVelocity}/100`,
                score: this.getMetricScore(metrics.wealthBuildingVelocity, [25, 50, 75, 90]),
                description: 'Effectiveness of your wealth accumulation strategy'
            }
        ];

        const html = `
            <h4>🔬 Advanced Financial Metrics</h4>
            <p style="color: var(--gray-600); margin-bottom: 20px;">Research-based metrics for comprehensive financial analysis</p>
            <div class="advanced-metrics-grid">
                ${metricsData.map(metric => `
                    <div class="advanced-metric-card">
                        <div class="metric-header">
                            <div class="metric-name">${metric.name}</div>
                            <div class="metric-score ${metric.score}">${metric.score.toUpperCase()}</div>
                        </div>
                        <div class="metric-value">${metric.value}</div>
                        <div class="metric-description">${metric.description}</div>
                    </div>
                `).join('')}
            </div>
        `;

        advancedMetricsDiv.innerHTML = html;
    }

    /**
     * Display scenario analysis results
     */
    private displayScenarioAnalysis(scenarioAnalysis: any): void {
        const scenarioDiv = document.getElementById('scenarioAnalysis');
        if (!scenarioDiv) return;

        let html = '<h4>📊 Scenario Analysis</h4>';

        // Stress Test Results
        if (scenarioAnalysis.stressTest) {
            const stressTest = scenarioAnalysis.stressTest;
            html += `
                <div class="scenario-section">
                    <div class="scenario-title">⚠️ Stress Test Results</div>
                    <p style="color: var(--gray-600); margin-bottom: 16px;">How your financial plan performs under adverse conditions</p>
                    <div class="scenario-grid">
                        <div class="scenario-item stress-test">
                            <div class="scenario-label">Base Case</div>
                            <div class="scenario-value">${this.formatCurrency(stressTest.baseCase)}</div>
                            <div class="scenario-description">Normal market conditions</div>
                        </div>
                        <div class="scenario-item stress-test">
                            <div class="scenario-label">Recession</div>
                            <div class="scenario-value">${this.formatCurrency(stressTest.recession)}</div>
                            <div class="scenario-description">2 years of -20% returns</div>
                        </div>
                        <div class="scenario-item stress-test">
                            <div class="scenario-label">High Inflation</div>
                            <div class="scenario-value">${this.formatCurrency(stressTest.inflation)}</div>
                            <div class="scenario-description">Returns reduced by 2%</div>
                        </div>
                        <div class="scenario-item stress-test">
                            <div class="scenario-label">Market Crash</div>
                            <div class="scenario-value">${this.formatCurrency(stressTest.marketCrash)}</div>
                            <div class="scenario-description">50% loss in year 5</div>
                        </div>
                        <div class="scenario-item stress-test">
                            <div class="scenario-label">Job Loss</div>
                            <div class="scenario-value">${this.formatCurrency(stressTest.jobLoss)}</div>
                            <div class="scenario-description">No contributions for 2 years</div>
                        </div>
                        <div class="scenario-item stress-test">
                            <div class="scenario-label">Worst Case</div>
                            <div class="scenario-value">${this.formatCurrency(stressTest.worstCase)}</div>
                            <div class="scenario-description">Combined adverse factors</div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Contribution Scenarios
        if (scenarioAnalysis.contributionScenarios) {
            html += `
                <div class="scenario-section">
                    <div class="scenario-title">💰 Contribution Impact Analysis</div>
                    <p style="color: var(--gray-600); margin-bottom: 16px;">How different contribution levels affect your retirement wealth</p>
                    <div class="scenario-grid">
                        ${scenarioAnalysis.contributionScenarios.map((scenario: any, index: number) => {
                            const multiplier = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0][index];
                            return `
                                <div class="scenario-item">
                                    <div class="scenario-label">${multiplier}x Contributions</div>
                                    <div class="scenario-value">${this.formatCurrency(scenario.finalWealth)}</div>
                                    <div class="scenario-description">
                                        ${this.formatCurrency(scenario.contribution)}/month → 
                                        ${this.formatCurrency(scenario.monthlyIncome)}/month retirement income
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }

        // Monte Carlo Results
        if (scenarioAnalysis.monteCarlo) {
            const mc = scenarioAnalysis.monteCarlo;
            html += `
                <div class="scenario-section">
                    <div class="scenario-title">🎲 Monte Carlo Simulation</div>
                    <p style="color: var(--gray-600); margin-bottom: 16px;">Probability analysis based on 100 market scenarios</p>
                    <div class="scenario-grid">
                        <div class="scenario-item monte-carlo">
                            <div class="scenario-label">Success Probability</div>
                            <div class="scenario-value">${(mc.successProbability * 100).toFixed(0)}%</div>
                            <div class="probability-bar">
                                <div class="probability-fill" style="width: ${mc.successProbability * 100}%"></div>
                            </div>
                            <div class="scenario-description">Chance of meeting retirement goals</div>
                        </div>
                        <div class="scenario-item monte-carlo">
                            <div class="scenario-label">Average Outcome</div>
                            <div class="scenario-value">${this.formatCurrency(mc.averageOutcome)}</div>
                            <div class="scenario-description">Expected retirement wealth</div>
                        </div>
                        <div class="scenario-item monte-carlo">
                            <div class="scenario-label">10th Percentile</div>
                            <div class="scenario-value">${this.formatCurrency(mc.percentiles.p10)}</div>
                            <div class="scenario-description">Worst 10% of outcomes</div>
                        </div>
                        <div class="scenario-item monte-carlo">
                            <div class="scenario-label">90th Percentile</div>
                            <div class="scenario-value">${this.formatCurrency(mc.percentiles.p90)}</div>
                            <div class="scenario-description">Best 10% of outcomes</div>
                        </div>
                    </div>
                </div>
            `;
        }

        scenarioDiv.innerHTML = html;
    }

    /**
     * Get metric score classification
     */
    private getMetricScore(value: number, thresholds: number[]): string {
        if (value >= thresholds[3]) return 'excellent';
        if (value >= thresholds[2]) return 'good';
        if (value >= thresholds[1]) return 'fair';
        return 'poor';
    }

    /**
     * Display detailed score breakdown with color coding
     */
    private displayScoreBreakdown(breakdown: any): void {
        const scoreBreakdownDiv = document.getElementById('scoreBreakdown');
        if (!scoreBreakdownDiv) return;

        // Core financial health categories based on expert standards
        const categories = [
            { 
                key: 'cashFlow', 
                title: 'Cash Flow Management', 
                score: breakdown.cashFlow?.score || 0,
                maxScore: breakdown.cashFlow?.maxScore || 25,
                value: breakdown.cashFlow?.value || 0,
                status: breakdown.cashFlow?.status || 'Unknown',
                benchmark: breakdown.cashFlow?.benchmark || 'Positive cash flow indicates healthy spending habits',
                icon: '💰'
            },
            { 
                key: 'emergencyFund', 
                title: 'Emergency Fund Adequacy', 
                score: breakdown.emergencyFund?.score || 0,
                maxScore: breakdown.emergencyFund?.maxScore || 25,
                value: breakdown.emergencyFund?.value || 0,
                status: breakdown.emergencyFund?.status || 'Unknown',
                benchmark: breakdown.emergencyFund?.benchmark || '6+ months of expenses recommended by financial advisors',
                icon: '🛡️'
            },
            { 
                key: 'debtManagement', 
                title: 'Debt Management', 
                score: breakdown.debtManagement?.score || 0,
                maxScore: breakdown.debtManagement?.maxScore || 25,
                value: breakdown.debtManagement?.value || 0,
                status: breakdown.debtManagement?.status || 'Unknown',
                benchmark: breakdown.debtManagement?.benchmark || 'Total debt-to-income ratio should be below 36%',
                icon: '📊'
            },
            { 
                key: 'savingsRate', 
                title: 'Savings & Investment Rate', 
                score: breakdown.savingsRate?.score || 0,
                maxScore: breakdown.savingsRate?.maxScore || 25,
                value: breakdown.savingsRate?.value || 0,
                status: breakdown.savingsRate?.status || 'Unknown',
                benchmark: breakdown.savingsRate?.benchmark || '20%+ savings rate enables wealth building (FIRE principles)',
                icon: '📈'
            }
        ];

        // Additional financial health insights
        const additionalMetrics = this.calculateAdditionalMetrics(breakdown);

        const html = `
            <div class="financial-health-overview">
                <h3>📋 Financial Health Assessment</h3>
                <p class="health-summary">Based on industry standards from financial advisors, Federal Reserve data, and wealth-building research.</p>
            </div>
            
            <div class="core-metrics">
                ${categories.map(category => {
                    const scoreClass = this.getScoreClass((category.score / category.maxScore) * 100);
                    const percentage = (category.score / category.maxScore) * 100;
                    
                    // Format value display based on category
                    let valueDisplay = '';
                    if (category.key === 'cashFlow') {
                        valueDisplay = this.formatCurrency(category.value);
                    } else if (category.key === 'emergencyFund') {
                        valueDisplay = `${category.value.toFixed(1)} months`;
                    } else if (category.key === 'debtManagement') {
                        valueDisplay = `${category.value.toFixed(1)}%`;
                    } else if (category.key === 'savingsRate') {
                        valueDisplay = `${category.value.toFixed(1)}%`;
                    }
                    
                    return `
                        <div class="score-item">
                            <div class="score-item-header">
                                <div class="score-item-title">
                                    <span class="metric-icon">${category.icon}</span>
                                    ${category.title}
                                </div>
                                <div class="score-badge ${scoreClass}">${category.score}/${category.maxScore}</div>
                            </div>
                            <div class="score-progress">
                                <div class="score-progress-fill ${scoreClass}" style="width: ${percentage}%"></div>
                            </div>
                            <div class="score-item-details">
                                <div class="current-value"><strong>Current:</strong> ${valueDisplay}</div>
                                <div class="status-badge ${scoreClass.toLowerCase()}">${category.status}</div>
                            </div>
                            <div class="benchmark-info">
                                <small><strong>Industry Benchmark:</strong> ${category.benchmark}</small>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="additional-insights">
                <h4>🔍 Additional Financial Health Insights</h4>
                <div class="insights-grid">
                    ${additionalMetrics.map(metric => `
                        <div class="insight-card ${metric.status}">
                            <div class="insight-header">
                                <span class="insight-icon">${metric.icon}</span>
                                <span class="insight-title">${metric.title}</span>
                            </div>
                            <div class="insight-value">${metric.value}</div>
                            <div class="insight-description">${metric.description}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="financial-wellness-tips">
                <h4>💡 Personalized Improvement Recommendations</h4>
                <div class="tips-list">
                    ${this.generatePersonalizedTips(breakdown).map(tip => `
                        <div class="tip-item">
                            <span class="tip-priority ${tip.priority}">${tip.priority.toUpperCase()}</span>
                            <span class="tip-text">${tip.text}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        scoreBreakdownDiv.innerHTML = html;
    }

    /**
     * Calculate additional financial health metrics based on research
     */
    private calculateAdditionalMetrics(breakdown: any): any[] {
        const metrics = [];

        // Financial Stress Score (based on debt and emergency fund)
        const debtScore = breakdown.debtManagement?.score || 0;
        const emergencyScore = breakdown.emergencyFund?.score || 0;
        const stressScore = Math.max(0, 100 - (debtScore + emergencyScore) / 2);
        metrics.push({
            title: 'Financial Stress Level',
            value: stressScore < 30 ? 'Low' : stressScore < 60 ? 'Moderate' : 'High',
            description: stressScore < 30 ? 'Your debt and emergency fund levels indicate low financial stress' : 
                        stressScore < 60 ? 'Some areas need attention to reduce financial stress' : 
                        'High stress levels - focus on debt reduction and emergency savings',
            icon: stressScore < 30 ? '😌' : stressScore < 60 ? '😐' : '😰',
            status: stressScore < 30 ? 'excellent' : stressScore < 60 ? 'good' : 'critical'
        });

        // Wealth Building Velocity
        const savingsScore = breakdown.savingsRate?.score || 0;
        const cashFlowScore = breakdown.cashFlow?.score || 0;
        const wealthVelocity = (savingsScore + cashFlowScore) / 2;
        metrics.push({
            title: 'Wealth Building Velocity',
            value: wealthVelocity >= 80 ? 'Excellent' : wealthVelocity >= 60 ? 'Good' : wealthVelocity >= 40 ? 'Moderate' : 'Slow',
            description: wealthVelocity >= 80 ? 'You\'re on track for early financial independence' :
                        wealthVelocity >= 60 ? 'Solid wealth building progress' :
                        wealthVelocity >= 40 ? 'Room for improvement in wealth accumulation' :
                        'Focus on increasing savings and cash flow',
            icon: wealthVelocity >= 80 ? '🚀' : wealthVelocity >= 60 ? '📈' : wealthVelocity >= 40 ? '📊' : '🐌',
            status: wealthVelocity >= 80 ? 'excellent' : wealthVelocity >= 60 ? 'good' : wealthVelocity >= 40 ? 'fair' : 'limited'
        });

        // Financial Resilience
        const resilience = (emergencyScore + debtScore) / 2;
        metrics.push({
            title: 'Financial Resilience',
            value: resilience >= 80 ? 'Very Resilient' : resilience >= 60 ? 'Resilient' : resilience >= 40 ? 'Moderate' : 'Vulnerable',
            description: resilience >= 80 ? 'Well-prepared for financial emergencies' :
                        resilience >= 60 ? 'Good preparation for unexpected events' :
                        resilience >= 40 ? 'Some vulnerability to financial shocks' :
                        'High vulnerability - build emergency fund and reduce debt',
            icon: resilience >= 80 ? '🛡️' : resilience >= 60 ? '🏰' : resilience >= 40 ? '⚠️' : '🚨',
            status: resilience >= 80 ? 'excellent' : resilience >= 60 ? 'good' : resilience >= 40 ? 'fair' : 'critical'
        });

        return metrics;
    }

    /**
     * Generate personalized improvement tips based on scores
     */
    private generatePersonalizedTips(breakdown: any): any[] {
        const tips = [];
        
        // Prioritize tips based on lowest scores
        const scores = [
            { key: 'cashFlow', score: breakdown.cashFlow?.score || 0, area: 'Cash Flow' },
            { key: 'emergencyFund', score: breakdown.emergencyFund?.score || 0, area: 'Emergency Fund' },
            { key: 'debtManagement', score: breakdown.debtManagement?.score || 0, area: 'Debt Management' },
            { key: 'savingsRate', score: breakdown.savingsRate?.score || 0, area: 'Savings Rate' }
        ].sort((a, b) => a.score - b.score);

        // High priority tips for lowest scores
        if (scores[0].score < 40) {
            tips.push({
                priority: 'high',
                text: `Focus on improving your ${scores[0].area} - this is your biggest opportunity for financial improvement.`
            });
        }

        // Medium priority tips
        if (scores[1].score < 60) {
            tips.push({
                priority: 'medium',
                text: `Work on your ${scores[1].area} as a secondary priority to strengthen your financial foundation.`
            });
        }

        // Specific actionable tips
        if ((breakdown.emergencyFund?.score || 0) < 15) {
            tips.push({
                priority: 'high',
                text: 'Build your emergency fund to 6 months of expenses - start with $1,000 as an initial goal.'
            });
        }

        if ((breakdown.debtManagement?.score || 0) < 15) {
            tips.push({
                priority: 'high',
                text: 'Focus on debt reduction using the debt avalanche method (highest interest first) or debt snowball (smallest balance first).'
            });
        }

        if ((breakdown.savingsRate?.score || 0) < 15) {
            tips.push({
                priority: 'medium',
                text: 'Increase your savings rate gradually - aim for 20% of income for optimal wealth building.'
            });
        }

        if (breakdown.cashFlowScore < 60) {
            tips.push({
                priority: 'medium',
                text: 'Review your budget to identify areas where you can reduce expenses and increase positive cash flow.'
            });
        }

        // Add general tips if doing well
        if (tips.length === 0) {
            tips.push({
                priority: 'low',
                text: 'Excellent financial health! Consider advanced strategies like tax optimization and investment diversification.'
            });
        }

        return tips.slice(0, 4); // Limit to 4 tips to avoid overwhelming
    }

    /**
     * Get CSS class based on score for color coding (0-100 scale)
     * Based on expert financial advisor standards
     */
    private getScoreClass(score: number): string {
        if (score >= 80) return 'score-bg-excellent';  // Strong financial position
        if (score >= 60) return 'score-bg-good';       // Solid financial health
        if (score >= 40) return 'score-bg-fair';       // Room for improvement
        if (score >= 20) return 'score-bg-limited';    // Needs attention
        return 'score-bg-critical';                     // Immediate action required
    }

    /**
     * Create wealth and health trend charts with comprehensive error handling
     */
    private async createCharts(analysis: AnalysisResult, userData: UserFinancialData): Promise<void> {
        try {
            // Destroy existing charts safely with proper cleanup
            this.chartManager.destroyExistingCharts();

            // Wait for Chart.js to be available
            if (!this.chartManager.isReady()) {
                console.warn('Chart.js not ready, charts will show as tables');
            }

            // Verify canvas elements exist
            const wealthCanvas = document.getElementById('wealthChart') as HTMLCanvasElement;
            const healthCanvas = document.getElementById('healthChart') as HTMLCanvasElement;
            
            if (!wealthCanvas || !healthCanvas) {
                console.error('Chart canvas elements not found');
                return;
            }

            // Enhanced delay to ensure proper cleanup and DOM readiness
            setTimeout(async () => {
                try {
                    // Double-check canvas availability after timeout
                    const wealthCanvasCheck = document.getElementById('wealthChart') as HTMLCanvasElement;
                    const healthCanvasCheck = document.getElementById('healthChart') as HTMLCanvasElement;
                    
                    if (!wealthCanvasCheck || !healthCanvasCheck) {
                        console.error('Canvas elements disappeared during initialization');
                        return;
                    }

                    // Create wealth projection chart
                    if (analysis.wealthProjections && analysis.wealthProjections.fiveYearProjection !== undefined) {
                        await this.createWealthChart(analysis.wealthProjections, userData);
                    } else {
                        console.warn('No valid wealth projection data available');
                    }
                    
                    // Create health trend chart
                    await this.createHealthTrendChart(analysis, userData);
                    
                    console.log('Charts created successfully');
                } catch (error) {
                    console.error('Chart creation failed in timeout:', error);
                }
            }, 150);
        } catch (error) {
            console.error('Chart initialization failed:', error);
        }
    }

    /**
     * Create wealth projection chart using ChartManager
     */
    private async createWealthChart(projections: WealthProjections, userData: UserFinancialData): Promise<void> {
        const currentWealth = (userData.savings || 0) + (userData.currentInvestments || 0);
        const years = userData.age ? [
            `Age ${userData.age}`,
            `Age ${userData.age + 5}`,
            `Age ${userData.age + 10}`,
            `Age ${userData.retirementAge || 67}`
        ] : ['Year 0', 'Year 5', 'Year 10', 'Year 30'];
        
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

        // Prepare data for ChartManager
        const wealthChartData = {
            years,
            values: nominalData,
            realValues: realData
        };

        await this.chartManager.createWealthChart(wealthChartData);
    }

    /**
     * Create financial health trend chart using ChartManager
     */
    private async createHealthTrendChart(analysis: AnalysisResult, _userData: UserFinancialData): Promise<void> {
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

        // Prepare data for ChartManager
        const healthChartData = {
            months,
            scores: healthScores
        };

        await this.chartManager.createHealthChart(healthChartData);
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
    new FinancialHealthApp();
});

// Fallback for different loading scenarios
if (document.readyState === 'loading') {
    // Wait for DOMContentLoaded
} else {
    try {
        new FinancialHealthApp();
    } catch (error) {
        console.error('Critical Error: Failed to start application:', error);
    }
} 