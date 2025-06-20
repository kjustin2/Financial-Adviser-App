/**
 * Core financial data types for the simplified Financial Health Analyzer
 */

export interface UserFinancialData {
    // Required Financial Information
    monthlyIncome: number;
    monthlyExpenses: number;
    savings: number;
    debt: number;
    age: number;
    currentInvestments: number;
    monthlyInvestmentContribution: number;
    retirementAge: number;
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

export interface FinancialMetric {
    title: string;
    value: string;
    description: string;
    status: 'excellent' | 'good' | 'fair' | 'poor';
    number?: number; // Raw numeric value for calculations
}

export interface Recommendation {
    priority: 'high' | 'medium' | 'low';
    text: string;
    icon: string;
}

export interface FinancialAnalysisResult {
    // Core Health Score
    healthScore: number;
    healthLevel: string;
    
    // Quick Metrics
    monthlyCashFlow: number;
    emergencyFundMonths: number;
    debtToIncomeRatio: number;
    savingsRate: number;
    
    // Analysis Sections
    coreMetrics: FinancialMetric[];
    liquidityAnalysis: FinancialMetric[];
    debtAnalysis: FinancialMetric[];
    investmentAnalysis: FinancialMetric[];
    wealthProjections: FinancialMetric[];
    riskAssessment: FinancialMetric[];
    
    // Recommendations
    recommendations: Recommendation[];
}

export interface DOMElements {
    form: HTMLFormElement;
    resultsContainer: HTMLElement;
    healthScoreSummary: HTMLElement;
    healthScore: HTMLElement;
    errorMessage: HTMLElement;
    
    // Quick Metrics
    cashFlowValue: HTMLElement;
    emergencyFundValue: HTMLElement;
    debtRatioValue: HTMLElement;
    savingsRateValue: HTMLElement;
    
    // Analysis Content Areas
    coreMetrics: HTMLElement;
    liquidityAnalysis: HTMLElement;
    debtAnalysis: HTMLElement;
    investmentAnalysis: HTMLElement;
    wealthProjections: HTMLElement;
    riskAssessment: HTMLElement;
    recommendationsList: HTMLElement;
} 