/**
 * Analysis Results and Metrics Types
 * Interfaces for financial analysis results and recommendations
 */

export interface FinancialMetric {
    title: string;
    value: string;
    numericValue?: number;
    description: string;
    status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    benchmark?: string;
    improvement?: string;
}

export interface HealthIndicator {
    name: string;
    score: number; // 0-100
    status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    weight: number; // weighting in overall score
    metrics: FinancialMetric[];
    recommendations: string[];
    explanation: string;
}

export interface ScenarioAnalysis {
    scenario: string;
    probability: string;
    impact: 'High' | 'Medium' | 'Low';
    description: string;
    timeToRecover: string;
    recommendations: string[];
}

export interface WealthProjection {
    scenario: string;
    timeframe: string;
    projectedValue: number;
    monthlyContribution: number;
    assumptions: string;
}

export interface Recommendation {
    id: string;
    category: 'savings' | 'debt' | 'spending' | 'investment' | 'credit' | 'risk' | 'planning';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    actionSteps: string[];
    timeframe: 'immediate' | 'next-paycheck' | 'next-30-days' | '1-3-months' | '3-6-months' | 'next-3-months' | 'next-month' | 'ongoing' | 'long-term';
    impactLevel: 'high' | 'medium' | 'low';
    estimatedCost?: number;
    potentialSavings?: number;
}

export interface ComprehensiveAnalysisResult {
    // Overall Health Score
    overallHealthScore: number;
    healthLevel: 'excellent' | 'good' | 'fair' | 'limited' | 'critical';
    
    // 8 Core Health Indicators
    healthIndicators: HealthIndicator[];
    
    // Financial Ratios & Metrics
    keyMetrics: {
        monthlyCashFlow: number;
        emergencyFundMonths: number;
        debtToIncomeRatio: number;
        savingsRate: number | string;
        creditUtilization: number;
        netWorth: number;
        liquidityRatio: number;
        assetAllocationScore: number;
        dtiBreakdown?: {
            totalDebt: number;
            totalIncome: number;
            debtToIncomeRatio: number;
        };
        netWorthBreakdown?: {
            totalAssets: number;
            totalLiabilities: number;
            netWorth: number;
        };
        savingsRateBreakdown?: {
            savings: number;
            totalIncome: number;
            formula: string;
            savingsRate: number;
        };
    };
    
    // Detailed Analysis Sections
    liquidityAnalysis: FinancialMetric[];
    debtAnalysis: FinancialMetric[];
    investmentAnalysis: FinancialMetric[];
    insuranceAnalysis: FinancialMetric[];
    wealthProjections: WealthProjection[];
    scenarioAnalysis: ScenarioAnalysis[];
    
    // Recommendations
    prioritizedRecommendations: Recommendation[];
    
    // Peer Comparisons
    peerBenchmarks: {
        ageGroup: string;
        incomeGroup: string;
        netWorthPercentile: number;
        savingsRatePercentile: number;
        debtRatioPercentile: number;
    };
    
    // Enhanced Analysis
    detailedInsights: any;
    financialRatios: any;
    riskAssessment: any;
    goalAnalysis: any;
} 