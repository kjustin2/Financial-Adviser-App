import { UserFinancialData, UserBehaviorData, BiasDetectionResult, MarketDataPoint, EconomicScenario } from '../types';
import { TrendPrediction } from './FinancialTrendEngine';

/**
 * Risk pattern detected by the system
 */
export interface RiskPattern {
    id: string;
    category: 'behavioral' | 'financial' | 'market' | 'systemic';
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number; // 0-1
    description: string;
    indicators: string[];
    potentialImpact: string;
    mitigationSuggestions: string[];
    timeframe: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
    triggerThreshold: number;
    currentScore: number;
    historicalContext?: string;
}

/**
 * Opportunity pattern detected by the system
 */
export interface OpportunityPattern {
    id: string;
    category: 'investment' | 'savings' | 'career' | 'financial-planning';
    type: string;
    potential: 'low' | 'medium' | 'high' | 'exceptional';
    confidence: number; // 0-1
    description: string;
    requirements: string[];
    expectedBenefit: string;
    actionSteps: string[];
    timeframe: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
    currentScore: number;
    marketAlignment?: number; // 0-1, how well aligned with market conditions
}

/**
 * Risk assessment result
 */
export interface RiskAssessment {
    overallRiskScore: number; // 0-100
    riskCategory: 'conservative' | 'moderate' | 'aggressive' | 'speculative';
    patterns: RiskPattern[];
    opportunities: OpportunityPattern[];
    recommendations: string[];
    nextReviewDate: Date;
    emergencyFlags: string[];
}

/**
 * Pattern learning configuration
 */
export interface PatternLearningConfig {
    adaptiveLearning: boolean;
    sensitivityLevel: 'low' | 'medium' | 'high';
    historicalWeight: number; // 0-1, how much to weight historical patterns
    marketSensitivity: number; // 0-1, sensitivity to market conditions
    behaviorWeight: number; // 0-1, weight of behavioral factors
    updateFrequency: 'daily' | 'weekly' | 'monthly';
}

/**
 * Risk Pattern Recognition Engine
 * Advanced system for identifying financial risks and opportunities
 */
export class RiskPatternEngine {
    private config: PatternLearningConfig;
    private _knownPatterns: Map<string, RiskPattern> = new Map();
    private _opportunityPatterns: Map<string, OpportunityPattern> = new Map();
    private patternHistory: Map<string, Array<{ timestamp: Date; score: number }>> = new Map();

    constructor(config: Partial<PatternLearningConfig> = {}) {
        this.config = {
            adaptiveLearning: true,
            sensitivityLevel: 'medium',
            historicalWeight: 0.3,
            marketSensitivity: 0.4,
            behaviorWeight: 0.6,
            updateFrequency: 'weekly',
            ...config
        };

        this.initializeKnownPatterns();
        this.initializeOpportunityPatterns();
    }

    /**
     * Perform comprehensive risk and opportunity analysis
     */
    public analyzeRiskPatterns(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        biasResults: BiasDetectionResult[],
        trendPredictions?: TrendPrediction[],
        marketData?: MarketDataPoint[],
        economicScenarios?: EconomicScenario[]
    ): RiskAssessment {
        // Detect risk patterns
        const behavioralRisks = this.detectBehavioralRisks(financialData, behaviorData, biasResults);
        const financialRisks = this.detectFinancialRisks(financialData, trendPredictions);
        const marketRisks = this.detectMarketRisks(marketData, economicScenarios);
        const systemicRisks = this.detectSystemicRisks(financialData, marketData);

        // Detect opportunities
        const investmentOpportunities = this.detectInvestmentOpportunities(financialData, behaviorData, marketData);
        const savingsOpportunities = this.detectSavingsOpportunities(financialData, behaviorData);
        const careerOpportunities = this.detectCareerOpportunities(financialData, behaviorData);
        const planningOpportunities = this.detectPlanningOpportunities(financialData, behaviorData, biasResults);

        // Combine all patterns
        const allRisks = [...behavioralRisks, ...financialRisks, ...marketRisks, ...systemicRisks];
        const allOpportunities = [...investmentOpportunities, ...savingsOpportunities, ...careerOpportunities, ...planningOpportunities];

        // Calculate overall risk score
        const overallRiskScore = this.calculateOverallRiskScore(allRisks);
        const riskCategory = this.determineRiskCategory(overallRiskScore);

        // Generate recommendations
        const recommendations = this.generateRecommendations(allRisks, allOpportunities, overallRiskScore);

        // Identify emergency flags
        const emergencyFlags = this.identifyEmergencyFlags(allRisks, financialData);

        // Update pattern history for adaptive learning
        if (this.config.adaptiveLearning) {
            this.updatePatternHistory(allRisks, allOpportunities);
        }

        return {
            overallRiskScore,
            riskCategory,
            patterns: allRisks.filter(risk => risk.confidence >= 0.6),
            opportunities: allOpportunities.filter(opp => opp.confidence >= 0.6),
            recommendations,
            nextReviewDate: this.calculateNextReviewDate(overallRiskScore),
            emergencyFlags
        };
    }

    /**
     * Detect behavioral risk patterns
     */
    private detectBehavioralRisks(
        _financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        biasResults: BiasDetectionResult[]
    ): RiskPattern[] {
        const risks: RiskPattern[] = [];

        // Emotional trading risk
        if (behaviorData.riskBehavior.panicSellingHistory || behaviorData.riskBehavior.fomoBuyingHistory) {
            risks.push({
                id: 'emotional-trading',
                category: 'behavioral',
                type: 'Emotional Trading Pattern',
                severity: behaviorData.tradingPatterns.frequency === 'daily' ? 'high' : 'medium',
                confidence: 0.85,
                description: 'Tendency to make investment decisions based on emotions rather than rational analysis',
                indicators: ['Panic selling history', 'FOMO buying behavior', 'High trading frequency'],
                potentialImpact: 'Significant portfolio underperformance, increased transaction costs, timing losses',
                mitigationSuggestions: [
                    'Implement automated investment strategy',
                    'Set cooling-off periods before major trades',
                    'Use dollar-cost averaging',
                    'Work with financial advisor for objective perspective'
                ],
                timeframe: 'immediate',
                triggerThreshold: 0.6,
                currentScore: 0.8
            });
        }

        // Overconfidence bias risk
        const overconfidenceBias = biasResults.find(bias => bias.biasType === 'overconfidence');
        if (overconfidenceBias && overconfidenceBias.severity !== 'low') {
            risks.push({
                id: 'overconfidence-risk',
                category: 'behavioral',
                type: 'Overconfidence in Financial Decisions',
                severity: overconfidenceBias.severity === 'high' ? 'high' : 'medium',
                confidence: overconfidenceBias.confidence,
                description: 'Excessive confidence in financial decision-making abilities leading to poor choices',
                indicators: ['High bias detection score', 'Concentrated investments', 'Frequent trading'],
                potentialImpact: 'Poor diversification, excessive risk-taking, ignoring contrary evidence',
                mitigationSuggestions: [
                    'Implement systematic decision-making process',
                    'Seek second opinions on major decisions',
                    'Use checklists for investment decisions',
                    'Regular portfolio review with objective metrics'
                ],
                timeframe: 'short-term',
                triggerThreshold: 0.5,
                currentScore: overconfidenceBias.confidence
            });
        }

        // Impulse spending risk
        if (behaviorData.planningBehavior.impulsiveDecisions > 0.7) {
            risks.push({
                id: 'impulse-spending',
                category: 'behavioral',
                type: 'Impulse Spending Pattern',
                severity: 'medium',
                confidence: 0.75,
                description: 'High tendency for impulsive financial decisions that may derail financial goals',
                indicators: ['High impulsive decision score', 'Low budgeting consistency', 'Irregular spending patterns'],
                potentialImpact: 'Budget overruns, reduced savings rate, goal achievement delays',
                mitigationSuggestions: [
                    'Implement 24-hour waiting period for large purchases',
                    'Use automated savings to protect goals',
                    'Create detailed budget with spending categories',
                    'Use spending tracking apps'
                ],
                timeframe: 'immediate',
                triggerThreshold: 0.6,
                currentScore: behaviorData.planningBehavior.impulsiveDecisions
            });
        }

        // Loss aversion excessive risk
        const lossAversionBias = biasResults.find(bias => bias.biasType === 'loss-aversion');
        if (lossAversionBias && lossAversionBias.severity === 'high') {
            risks.push({
                id: 'excessive-loss-aversion',
                category: 'behavioral',
                type: 'Excessive Loss Aversion',
                severity: 'medium',
                confidence: lossAversionBias.confidence,
                description: 'Extreme aversion to losses may prevent necessary financial risks and growth',
                indicators: ['High loss aversion bias', 'Over-conservative investments', 'Cash hoarding'],
                potentialImpact: 'Inflation erosion, missed growth opportunities, retirement shortfall',
                mitigationSuggestions: [
                    'Gradual exposure to appropriate risk levels',
                    'Education on inflation and opportunity costs',
                    'Systematic investment approach',
                    'Focus on long-term goals rather than short-term volatility'
                ],
                timeframe: 'medium-term',
                triggerThreshold: 0.7,
                currentScore: lossAversionBias.confidence
            });
        }

        return risks;
    }

    /**
     * Detect financial risk patterns
     */
    private detectFinancialRisks(
        financialData: UserFinancialData,
        trendPredictions?: TrendPrediction[]
    ): RiskPattern[] {
        const risks: RiskPattern[] = [];

        // High debt-to-income ratio
        const monthlyIncome = this.calculateMonthlyIncome(financialData);
        const monthlyDebtPayments = financialData.expenses.creditCardPayments + 
                                    financialData.expenses.studentLoanPayments + 
                                    financialData.expenses.otherDebtPayments;
        const debtToIncomeRatio = monthlyIncome > 0 ? monthlyDebtPayments / monthlyIncome : 0;

        if (debtToIncomeRatio > 0.36) {
            risks.push({
                id: 'high-debt-ratio',
                category: 'financial',
                type: 'High Debt-to-Income Ratio',
                severity: debtToIncomeRatio > 0.5 ? 'critical' : 'high',
                confidence: 0.95,
                description: `Debt payments consume ${(debtToIncomeRatio * 100).toFixed(1)}% of monthly income`,
                indicators: ['Debt-to-income ratio above 36%', 'Limited financial flexibility', 'High monthly obligations'],
                potentialImpact: 'Financial stress, limited emergency capacity, difficulty qualifying for future credit',
                mitigationSuggestions: [
                    'Develop aggressive debt repayment plan',
                    'Consider debt consolidation options',
                    'Increase income through side work or advancement',
                    'Reduce discretionary spending temporarily'
                ],
                timeframe: 'immediate',
                triggerThreshold: 0.36,
                currentScore: debtToIncomeRatio
            });
        }

        // Insufficient emergency fund
        const monthlyExpenses = this.calculateMonthlyExpenses(financialData);
        const emergencyFundMonths = monthlyExpenses > 0 ? 
            financialData.assets.emergencyFund / monthlyExpenses : 0;

        if (emergencyFundMonths < 3) {
            risks.push({
                id: 'insufficient-emergency-fund',
                category: 'financial',
                type: 'Insufficient Emergency Savings',
                severity: emergencyFundMonths < 1 ? 'critical' : 'high',
                confidence: 0.9,
                description: `Emergency fund covers only ${emergencyFundMonths.toFixed(1)} months of expenses`,
                indicators: ['Emergency fund below 3 months expenses', 'Vulnerability to income disruption'],
                potentialImpact: 'Forced debt accumulation during emergencies, financial instability',
                mitigationSuggestions: [
                    'Set up automatic emergency fund contributions',
                    'Start with $1000 minimum emergency fund',
                    'Reduce expenses to accelerate emergency fund building',
                    'Use windfalls to boost emergency savings'
                ],
                timeframe: 'immediate',
                triggerThreshold: 3,
                currentScore: emergencyFundMonths
            });
        }

        // Negative cash flow trend
        if (trendPredictions) {
            const incomeTrend = trendPredictions.find(t => t.metric === 'Monthly Income');
            const expenseTrend = trendPredictions.find(t => t.metric === 'Monthly Expenses');
            
            if (incomeTrend && expenseTrend) {
                const futureIncome = incomeTrend.predictedValue;
                const futureExpenses = expenseTrend.predictedValue;
                const futureCashFlow = futureIncome - futureExpenses;
                
                if (futureCashFlow < 0 || (futureCashFlow / futureIncome) < 0.1) {
                    risks.push({
                        id: 'negative-cash-flow-trend',
                        category: 'financial',
                        type: 'Deteriorating Cash Flow',
                        severity: futureCashFlow < 0 ? 'high' : 'medium',
                        confidence: Math.min(incomeTrend.confidence, expenseTrend.confidence),
                        description: 'Projected cash flow indicates financial stress ahead',
                        indicators: ['Expenses growing faster than income', 'Declining savings rate'],
                        potentialImpact: 'Future inability to save, potential debt accumulation',
                        mitigationSuggestions: [
                            'Review and reduce discretionary spending',
                            'Seek income enhancement opportunities',
                            'Reevaluate recurring expenses',
                            'Consider lifestyle adjustments'
                        ],
                        timeframe: 'short-term',
                        triggerThreshold: 0.1,
                        currentScore: Math.max(0, -futureCashFlow / futureIncome)
                    });
                }
            }
        }

        // Concentration risk in investments
        const totalInvestments = this.calculateTotalInvestments(financialData);
        if (totalInvestments > 0) {
            const largestPosition = Math.max(
                financialData.assets.stocks,
                financialData.assets.cryptocurrency,
                financialData.assets.employer401k
            );
            const concentrationRatio = largestPosition / totalInvestments;

            if (concentrationRatio > 0.6) {
                risks.push({
                    id: 'investment-concentration',
                    category: 'financial',
                    type: 'Investment Concentration Risk',
                    severity: concentrationRatio > 0.8 ? 'high' : 'medium',
                    confidence: 0.8,
                    description: `${(concentrationRatio * 100).toFixed(1)}% of investments in single asset type`,
                    indicators: ['Lack of diversification', 'High exposure to single asset class'],
                    potentialImpact: 'Amplified volatility, potential for significant losses',
                    mitigationSuggestions: [
                        'Diversify across asset classes',
                        'Consider low-cost index funds',
                        'Rebalance portfolio quarterly',
                        'Gradual diversification to avoid tax consequences'
                    ],
                    timeframe: 'medium-term',
                    triggerThreshold: 0.6,
                    currentScore: concentrationRatio
                });
            }
        }

        return risks;
    }

    /**
     * Detect market-related risks
     */
    private detectMarketRisks(
        marketData?: MarketDataPoint[],
        _economicScenarios?: EconomicScenario[]
    ): RiskPattern[] {
        const risks: RiskPattern[] = [];

        if (marketData && marketData.length > 0) {
            // Market volatility risk
            const recentData = marketData.slice(-30); // Last 30 data points
            const returns = this.calculateReturns(recentData);
            const volatility = this.calculateVolatility(returns);

            if (volatility > 0.25) { // 25% annual volatility
                risks.push({
                    id: 'high-market-volatility',
                    category: 'market',
                    type: 'High Market Volatility',
                    severity: volatility > 0.4 ? 'high' : 'medium',
                    confidence: 0.7,
                    description: `Current market volatility at ${(volatility * 100).toFixed(1)}% annually`,
                    indicators: ['Elevated market volatility', 'Increased uncertainty'],
                    potentialImpact: 'Portfolio value fluctuations, emotional decision-making pressure',
                    mitigationSuggestions: [
                        'Maintain long-term perspective',
                        'Consider reducing position sizes temporarily',
                        'Increase cash reserves',
                        'Review stop-loss strategies'
                    ],
                    timeframe: 'immediate',
                    triggerThreshold: 0.25,
                    currentScore: volatility
                });
            }

            // Market trend risk
            const trendDirection = this.calculateTrendDirection(returns);
            if (trendDirection < -0.1) { // Significant downtrend
                risks.push({
                    id: 'market-downtrend',
                    category: 'market',
                    type: 'Market Downtrend',
                    severity: trendDirection < -0.2 ? 'high' : 'medium',
                    confidence: 0.6,
                    description: 'Market showing sustained downward trend',
                    indicators: ['Negative price momentum', 'Declining market indicators'],
                    potentialImpact: 'Portfolio value decline, increased pessimism',
                    mitigationSuggestions: [
                        'Consider defensive positioning',
                        'Dollar-cost averaging strategy',
                        'Review portfolio allocation',
                        'Maintain emergency fund'
                    ],
                    timeframe: 'short-term',
                    triggerThreshold: -0.1,
                    currentScore: Math.abs(trendDirection)
                });
            }
        }

        return risks;
    }

    /**
     * Detect systemic risks
     */
    private detectSystemicRisks(
        financialData: UserFinancialData,
        _marketData?: MarketDataPoint[]
    ): RiskPattern[] {
        const risks: RiskPattern[] = [];

        // Inflation risk for cash-heavy portfolios
        const totalAssets = this.calculateTotalAssets(financialData);
        const cashAssets = financialData.assets.checking + financialData.assets.savings + 
                          financialData.assets.moneyMarket + financialData.assets.emergencyFund;
        const cashPercentage = totalAssets > 0 ? cashAssets / totalAssets : 0;

        if (cashPercentage > 0.3 && totalAssets > 50000) { // More than 30% in cash with significant assets
            risks.push({
                id: 'inflation-risk',
                category: 'systemic',
                type: 'Inflation Erosion Risk',
                severity: cashPercentage > 0.5 ? 'medium' : 'low',
                confidence: 0.8,
                description: `${(cashPercentage * 100).toFixed(1)}% of assets vulnerable to inflation`,
                indicators: ['High cash allocation', 'Low real return potential'],
                potentialImpact: 'Purchasing power erosion, real wealth decline over time',
                mitigationSuggestions: [
                    'Consider inflation-protected securities (TIPS)',
                    'Increase allocation to growth assets',
                    'Real estate or REITs for inflation hedge',
                    'Maintain only necessary cash reserves'
                ],
                timeframe: 'long-term',
                triggerThreshold: 0.3,
                currentScore: cashPercentage
            });
        }

        // Single income source risk
        const totalIncome = this.calculateMonthlyIncome(financialData);
        const primaryIncomeRatio = totalIncome > 0 ? financialData.income.primarySalary / totalIncome : 0;

        if (primaryIncomeRatio > 0.9 && financialData.personalInfo.dependents > 0) {
            risks.push({
                id: 'income-source-concentration',
                category: 'systemic',
                type: 'Single Income Source Risk',
                severity: 'medium',
                confidence: 0.85,
                description: 'High dependence on single income source with family obligations',
                indicators: ['Single primary income', 'Family dependents', 'Limited income diversification'],
                potentialImpact: 'Vulnerability to job loss, income disruption',
                mitigationSuggestions: [
                    'Develop additional income streams',
                    'Build larger emergency fund (6+ months)',
                    'Consider disability insurance',
                    'Spouse/partner income development'
                ],
                timeframe: 'medium-term',
                triggerThreshold: 0.9,
                currentScore: primaryIncomeRatio
            });
        }

        return risks;
    }

    /**
     * Detect investment opportunities
     */
    private detectInvestmentOpportunities(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        _marketData?: MarketDataPoint[]
    ): OpportunityPattern[] {
        const opportunities: OpportunityPattern[] = [];

        // Tax-advantaged account underutilization
        const currentRetirementSavings = financialData.assets.employer401k + 
                                        financialData.assets.traditionalIRA + 
                                        financialData.assets.rothIRA;
        const annualIncome = this.calculateMonthlyIncome(financialData) * 12;
        const retirementSavingsRate = annualIncome > 0 ? (currentRetirementSavings / annualIncome) : 0;

        if (retirementSavingsRate < 0.15 && annualIncome > 50000) { // Less than 15% in retirement accounts
            opportunities.push({
                id: 'tax-advantaged-opportunity',
                category: 'investment',
                type: 'Tax-Advantaged Account Optimization',
                potential: 'high',
                confidence: 0.9,
                description: 'Significant opportunity to increase tax-advantaged retirement savings',
                requirements: ['Available income for additional savings', 'Employer 401k availability'],
                expectedBenefit: 'Tax savings and accelerated retirement wealth building',
                actionSteps: [
                    'Maximize employer 401k match',
                    'Increase 401k contribution percentage',
                    'Consider Roth IRA contributions',
                    'Explore backdoor Roth strategies if applicable'
                ],
                timeframe: 'immediate',
                currentScore: 1 - retirementSavingsRate,
                marketAlignment: 0.8
            });
        }

        // Emergency fund optimization
        const emergencyFund = financialData.assets.emergencyFund;
        const monthlyExpenses = this.calculateMonthlyExpenses(financialData);
        const emergencyFundMonths = monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : 0;

        if (emergencyFundMonths > 6 && emergencyFund > 25000) { // Excess emergency fund
            opportunities.push({
                id: 'excess-emergency-fund',
                category: 'investment',
                type: 'Excess Emergency Fund Optimization',
                potential: 'medium',
                confidence: 0.8,
                description: 'Opportunity to invest excess emergency fund for higher returns',
                requirements: ['Stable income', 'Existing adequate emergency coverage'],
                expectedBenefit: 'Higher returns on excess cash while maintaining security',
                actionSteps: [
                    'Keep 3-6 months expenses in high-yield savings',
                    'Invest excess in conservative bond funds',
                    'Consider I-bonds for inflation protection',
                    'Laddered CDs for guaranteed returns'
                ],
                timeframe: 'short-term',
                currentScore: Math.min(1, (emergencyFundMonths - 6) / 6),
                marketAlignment: 0.7
            });
        }

        // Market timing avoidance opportunity
        if (behaviorData.tradingPatterns.marketTimingAttempts > 5) {
            opportunities.push({
                id: 'systematic-investing',
                category: 'investment',
                type: 'Systematic Investment Strategy',
                potential: 'high',
                confidence: 0.85,
                description: 'Opportunity to improve returns through systematic investing approach',
                requirements: ['Discipline to follow systematic approach', 'Regular investment schedule'],
                expectedBenefit: 'Reduced timing risk, improved long-term returns, lower stress',
                actionSteps: [
                    'Set up automatic investment schedule',
                    'Use dollar-cost averaging',
                    'Focus on low-cost index funds',
                    'Quarterly rebalancing only'
                ],
                timeframe: 'immediate',
                currentScore: behaviorData.tradingPatterns.marketTimingAttempts / 20,
                marketAlignment: 0.9
            });
        }

        return opportunities;
    }

    /**
     * Detect savings opportunities
     */
    private detectSavingsOpportunities(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData
    ): OpportunityPattern[] {
        const opportunities: OpportunityPattern[] = [];

        // Automatic savings opportunity
        if (!financialData.behaviors.automaticSavings && behaviorData.planningBehavior.goalSettingClarity > 0.6) {
            opportunities.push({
                id: 'automatic-savings-setup',
                category: 'savings',
                type: 'Automatic Savings Implementation',
                potential: 'high',
                confidence: 0.9,
                description: 'High potential for improved savings through automation',
                requirements: ['Bank account with automatic transfer capability', 'Stable income pattern'],
                expectedBenefit: 'Increased savings rate, reduced decision fatigue, goal achievement',
                actionSteps: [
                    'Set up automatic transfer on payday',
                    'Start with 10% of income',
                    'Increase by 1% every 6 months',
                    'Separate accounts for different goals'
                ],
                timeframe: 'immediate',
                currentScore: behaviorData.planningBehavior.goalSettingClarity
            });
        }

        // High-yield savings opportunity
        const totalCashSavings = financialData.assets.checking + financialData.assets.savings + 
                               financialData.assets.moneyMarket;
        if (totalCashSavings > 10000) { // Significant cash that could earn higher yields
            opportunities.push({
                id: 'high-yield-savings',
                category: 'savings',
                type: 'High-Yield Savings Optimization',
                potential: 'medium',
                confidence: 0.8,
                description: 'Opportunity to earn higher yields on cash savings',
                requirements: ['Willingness to switch banks', 'Minimum balance maintenance'],
                expectedBenefit: 'Increased interest earnings without additional risk',
                actionSteps: [
                    'Research current high-yield savings rates',
                    'Compare fees and requirements',
                    'Transfer funds to higher-yielding accounts',
                    'Set up direct deposit if beneficial'
                ],
                timeframe: 'short-term',
                currentScore: Math.min(1, totalCashSavings / 50000)
            });
        }

        return opportunities;
    }

    /**
     * Detect career opportunities
     */
    private detectCareerOpportunities(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData
    ): OpportunityPattern[] {
        const opportunities: OpportunityPattern[] = [];

        // Income growth opportunity
        const age = financialData.personalInfo.age;
        const currentIncome = this.calculateMonthlyIncome(financialData) * 12;
        
        if (age < 50 && currentIncome > 30000 && behaviorData.planningBehavior.goalSettingClarity > 0.7) {
            opportunities.push({
                id: 'income-growth',
                category: 'career',
                type: 'Income Enhancement Strategy',
                potential: age < 40 ? 'high' : 'medium',
                confidence: 0.7,
                description: 'Strong potential for income growth through career development',
                requirements: ['Time for skill development', 'Willingness to invest in growth'],
                expectedBenefit: 'Significant long-term wealth building acceleration',
                actionSteps: [
                    'Assess current market value of skills',
                    'Identify high-demand skill gaps',
                    'Pursue relevant certifications or education',
                    'Network within industry',
                    'Consider job market opportunities'
                ],
                timeframe: 'medium-term',
                currentScore: behaviorData.planningBehavior.goalSettingClarity * (age < 40 ? 1 : 0.7)
            });
        }

        // Side income opportunity
        if (financialData.income.secondaryIncome === 0 && currentIncome < 100000) {
            opportunities.push({
                id: 'side-income',
                category: 'career',
                type: 'Secondary Income Development',
                potential: 'medium',
                confidence: 0.6,
                description: 'Opportunity to develop additional income streams',
                requirements: ['Available time', 'Marketable skills or interests'],
                expectedBenefit: 'Income diversification and increased financial security',
                actionSteps: [
                    'Identify monetizable skills or hobbies',
                    'Research market demand',
                    'Start small with low commitment',
                    'Scale successful ventures',
                    'Track time and profitability'
                ],
                timeframe: 'short-term',
                currentScore: behaviorData.planningBehavior.goalSettingClarity * 0.8
            });
        }

        return opportunities;
    }

    /**
     * Detect financial planning opportunities
     */
    private detectPlanningOpportunities(
        _financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        biasResults: BiasDetectionResult[]
    ): OpportunityPattern[] {
        const opportunities: OpportunityPattern[] = [];

        // Budget optimization opportunity
        if (behaviorData.planningBehavior.budgetingConsistency < 0.5) {
            opportunities.push({
                id: 'budget-optimization',
                category: 'financial-planning',
                type: 'Budget System Implementation',
                potential: 'high',
                confidence: 0.85,
                description: 'Significant opportunity to optimize spending through better budgeting',
                requirements: ['Time for initial setup', 'Commitment to tracking'],
                expectedBenefit: 'Reduced waste, increased savings rate, better goal achievement',
                actionSteps: [
                    'Track all expenses for one month',
                    'Categorize spending patterns',
                    'Set realistic budget targets',
                    'Use budgeting app or spreadsheet',
                    'Weekly budget reviews'
                ],
                timeframe: 'immediate',
                currentScore: 1 - behaviorData.planningBehavior.budgetingConsistency
            });
        }

        // Goal clarity opportunity
        if (behaviorData.planningBehavior.goalSettingClarity < 0.6) {
            opportunities.push({
                id: 'goal-clarification',
                category: 'financial-planning',
                type: 'Financial Goal Clarification',
                potential: 'high',
                confidence: 0.8,
                description: 'Opportunity to accelerate progress through clearer goal setting',
                requirements: ['Time for reflection and planning', 'Honest self-assessment'],
                expectedBenefit: 'Better decision alignment, increased motivation, faster progress',
                actionSteps: [
                    'Define specific, measurable financial goals',
                    'Set realistic timelines',
                    'Break down large goals into milestones',
                    'Create accountability system',
                    'Regular progress reviews'
                ],
                timeframe: 'immediate',
                currentScore: 1 - behaviorData.planningBehavior.goalSettingClarity
            });
        }

        // Bias mitigation opportunity
        const significantBiases = biasResults.filter(bias => bias.severity === 'high');
        if (significantBiases.length > 0) {
            opportunities.push({
                id: 'bias-mitigation',
                category: 'financial-planning',
                type: 'Cognitive Bias Mitigation',
                potential: 'medium',
                confidence: 0.75,
                description: 'Opportunity to improve decisions by addressing cognitive biases',
                requirements: ['Self-awareness development', 'Systematic approach implementation'],
                expectedBenefit: 'Better financial decisions, reduced emotional stress, improved outcomes',
                actionSteps: [
                    'Learn about identified biases',
                    'Implement decision-making checklists',
                    'Use waiting periods for major decisions',
                    'Seek diverse perspectives',
                    'Regular bias awareness exercises'
                ],
                timeframe: 'medium-term',
                currentScore: significantBiases.length / 10
            });
        }

        return opportunities;
    }

    // Utility methods
    private calculateMonthlyIncome(data: UserFinancialData): number {
        return data.income.primarySalary + data.income.secondaryIncome + 
               data.income.businessIncome + data.income.investmentIncome + 
               data.income.rentalIncome + data.income.benefitsIncome + 
               data.income.otherIncome;
    }

    private calculateMonthlyExpenses(data: UserFinancialData): number {
        return data.expenses.housing + data.expenses.utilities + data.expenses.insurance +
               data.expenses.loanPayments + data.expenses.childcare + data.expenses.food +
               data.expenses.transportation + data.expenses.healthcare + data.expenses.clothing +
               data.expenses.personalCare + data.expenses.entertainment + data.expenses.diningOut +
               data.expenses.hobbies + data.expenses.subscriptions + data.expenses.shopping +
               data.expenses.travel + data.expenses.creditCardPayments + 
               data.expenses.studentLoanPayments + data.expenses.otherDebtPayments;
    }

    private calculateTotalInvestments(data: UserFinancialData): number {
        return data.assets.employer401k + data.assets.traditionalIRA + data.assets.rothIRA +
               data.assets.brokerageAccounts + data.assets.stocks + data.assets.bonds +
               data.assets.mutualFunds + data.assets.cryptocurrency;
    }

    private calculateTotalAssets(data: UserFinancialData): number {
        return data.assets.checking + data.assets.savings + data.assets.moneyMarket +
               data.assets.emergencyFund + this.calculateTotalInvestments(data) +
               data.assets.primaryResidence + data.assets.investmentProperties +
               data.assets.preciousMetals + data.assets.collectibles +
               data.assets.businessEquity + data.assets.otherAssets;
    }

    private calculateReturns(dataPoints: MarketDataPoint[]): number[] {
        const returns: number[] = [];
        for (let i = 1; i < dataPoints.length; i++) {
            const currentPrice = dataPoints[i].marketPrice;
            const previousPrice = dataPoints[i - 1].marketPrice;
            const return_ = (currentPrice - previousPrice) / previousPrice;
            returns.push(return_);
        }
        return returns;
    }

    private calculateVolatility(returns: number[]): number {
        if (returns.length < 2) return 0;
        
        const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
        const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / (returns.length - 1);
        return Math.sqrt(variance * 252); // Annualized volatility
    }

    private calculateTrendDirection(returns: number[]): number {
        if (returns.length < 5) return 0;
        
        // Simple linear regression slope
        const n = returns.length;
        const sumX = (n * (n - 1)) / 2;
        const sumY = returns.reduce((sum, val) => sum + val, 0);
        const sumXY = returns.reduce((sum, val, index) => sum + val * index, 0);
        const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

        return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    }

    private calculateOverallRiskScore(risks: RiskPattern[]): number {
        if (risks.length === 0) return 20; // Low risk baseline

        const weightedScore = risks.reduce((sum, risk) => {
            const severityWeight = {
                'low': 1,
                'medium': 2,
                'high': 3,
                'critical': 4
            }[risk.severity];
            
            return sum + (risk.currentScore * severityWeight * risk.confidence * 25);
        }, 0);

        return Math.min(100, Math.max(0, weightedScore / risks.length));
    }

    private determineRiskCategory(riskScore: number): 'conservative' | 'moderate' | 'aggressive' | 'speculative' {
        if (riskScore < 30) return 'conservative';
        if (riskScore < 50) return 'moderate';
        if (riskScore < 75) return 'aggressive';
        return 'speculative';
    }

    private generateRecommendations(
        risks: RiskPattern[],
        opportunities: OpportunityPattern[],
        overallRiskScore: number
    ): string[] {
        const recommendations: string[] = [];

        // Risk-based recommendations
        const criticalRisks = risks.filter(r => r.severity === 'critical');
        const highRisks = risks.filter(r => r.severity === 'high');

        if (criticalRisks.length > 0) {
            recommendations.push('🚨 Address critical financial risks immediately to prevent severe consequences');
        }

        if (highRisks.length > 0) {
            recommendations.push('⚠️ Develop action plans for high-severity risks within the next 30 days');
        }

        // Opportunity-based recommendations
        const highOpportunities = opportunities.filter(o => o.potential === 'high' || o.potential === 'exceptional');
        if (highOpportunities.length > 0) {
            recommendations.push('🎯 Prioritize high-potential opportunities for maximum financial benefit');
        }

        // Overall risk recommendations
        if (overallRiskScore > 70) {
            recommendations.push('📊 Consider working with a financial advisor due to elevated risk profile');
            recommendations.push('🛡️ Focus on risk reduction before pursuing growth opportunities');
        } else if (overallRiskScore < 30) {
            recommendations.push('📈 Your conservative profile suggests room for modest risk increase for growth');
        }

        // Behavioral recommendations
        const behavioralRisks = risks.filter(r => r.category === 'behavioral');
        if (behavioralRisks.length > 0) {
            recommendations.push('🧠 Implement systematic decision-making processes to counter behavioral biases');
        }

        return recommendations;
    }

    private identifyEmergencyFlags(risks: RiskPattern[], financialData: UserFinancialData): string[] {
        const flags: string[] = [];

        // Critical debt situation
        const criticalDebtRisk = risks.find(r => r.id === 'high-debt-ratio' && r.severity === 'critical');
        if (criticalDebtRisk) {
            flags.push('Debt-to-income ratio exceeds 50% - immediate intervention required');
        }

        // No emergency fund with dependents
        const noEmergencyFund = risks.find(r => r.id === 'insufficient-emergency-fund' && r.severity === 'critical');
        if (noEmergencyFund && financialData.personalInfo.dependents > 0) {
            flags.push('No emergency fund with family dependents - high vulnerability');
        }

        // Negative net worth
        const netWorth = this.calculateTotalAssets(financialData) - 
                        (financialData.liabilities.mortgageBalance + financialData.liabilities.homeEquityLoan +
                         financialData.liabilities.autoLoans + financialData.liabilities.securedCreditLines +
                         financialData.liabilities.creditCardDebt + financialData.liabilities.personalLoans +
                         financialData.liabilities.studentLoans + financialData.liabilities.medicalDebt +
                         financialData.liabilities.businessLoans + financialData.liabilities.taxDebt +
                         financialData.liabilities.otherDebt + financialData.liabilities.businessCreditLines +
                         financialData.liabilities.legalJudgments);

        if (netWorth < -50000) {
            flags.push('Significantly negative net worth - comprehensive financial restructuring needed');
        }

        return flags;
    }

    private calculateNextReviewDate(riskScore: number): Date {
        const now = new Date();
        const daysToAdd = riskScore > 70 ? 30 : riskScore > 50 ? 60 : 90;
        return new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    }

    private updatePatternHistory(risks: RiskPattern[], opportunities: OpportunityPattern[]): void {
        const now = new Date();
        
        risks.forEach(risk => {
            const history = this.patternHistory.get(risk.id) || [];
            history.push({ timestamp: now, score: risk.currentScore });
            
            // Keep only last 12 data points
            if (history.length > 12) {
                history.shift();
            }
            
            this.patternHistory.set(risk.id, history);
        });

        opportunities.forEach(opportunity => {
            const history = this.patternHistory.get(opportunity.id) || [];
            history.push({ timestamp: now, score: opportunity.currentScore });
            
            // Keep only last 12 data points
            if (history.length > 12) {
                history.shift();
            }
            
            this.patternHistory.set(opportunity.id, history);
        });
    }

    private initializeKnownPatterns(): void {
        // Initialize with baseline pattern templates
        // This would be expanded with machine learning over time
        this._knownPatterns.clear(); // Ensure map is initialized
    }

    private initializeOpportunityPatterns(): void {
        // Initialize with baseline opportunity templates
        // This would be expanded with market data and user feedback
        this._opportunityPatterns.clear(); // Ensure map is initialized
    }
} 