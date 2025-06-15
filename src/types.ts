/**
 * User input data from the form - Simplified for better UX
 */
export interface UserFinancialData {
  // Basic Financial Information (Required)
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  debt: number;
  
  // Advanced Information (Optional)
  age?: number;
  retirementAge?: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  currentInvestments?: number;
  monthlyInvestmentContribution?: number;
  emergencyFundGoal: number;
}

/**
 * Result of financial analysis
 */
export interface AnalysisResult {
  score: number;
  cashFlow: number;
  recommendation: string;
  emergencyFundMonths: number;
  debtToIncomeRatio: number;
  savingsRate: number;
  
  // Long-term Predictions (only if age provided)
  retirementProjections?: RetirementProjections;
  wealthProjections?: WealthProjections;
  financialMilestones?: FinancialMilestone[];
  riskAssessment: RiskAssessment;
}

/**
 * Retirement planning projections
 */
export interface RetirementProjections {
  yearsToRetirement: number;
  projectedRetirementWealth: number;
  requiredMonthlyContribution: number;
  retirementReadinessScore: number;
  projectedMonthlyRetirementIncome: number;
  socialSecurityEstimate: number;
  shortfallOrSurplus: number;
}

/**
 * Wealth growth projections with historical inflation adjustment
 */
export interface WealthProjections {
  fiveYearProjection: number;
  tenYearProjection: number;
  retirementProjection: number;
  compoundGrowthRate: number;
  totalContributions: number;
  investmentGrowth: number;
  
  // Real purchasing power (adjusted for 3.5% historical inflation)
  fiveYearReal: number;
  tenYearReal: number;
  retirementReal: number;
}

/**
 * Financial milestones and timeline
 */
export interface FinancialMilestone {
  milestone: string;
  targetAmount: number;
  estimatedTimeToReach: number;
  monthlyContributionNeeded: number;
  priority: 'high' | 'medium' | 'low';
  achievable: boolean;
}

/**
 * Risk assessment for financial plan
 */
export interface RiskAssessment {
  overallRiskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
  recommendations: string[];
  emergencyFundAdequacy: boolean;
  diversificationScore: number;
}

/**
 * Chart data for visualizations
 */
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  tension?: number;
}

/**
 * DOM element references
 */
export interface DOMElements {
  form: HTMLFormElement;
  resultsContainer: HTMLElement;
  healthScore: HTMLElement;
  cashFlowValue: HTMLElement;
  emergencyFundValue: HTMLElement;
  debtRatioValue: HTMLElement;
  savingsRateValue: HTMLElement;
  recommendationText: HTMLElement;
  analyzeBtn: HTMLButtonElement;
} 