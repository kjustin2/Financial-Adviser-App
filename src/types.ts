/**
 * User input data from the form - Enhanced for detailed analysis
 */
export interface UserFinancialData {
  // Basic Financial Information
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  debt: number;
  
  // Personal Information
  age: number;
  retirementAge: number;
  
  // Investment & Risk Information
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  currentInvestments: number;
  monthlyInvestmentContribution: number;
  
  // Goals & Planning
  emergencyFundGoal: number;
  retirementIncomeGoal: number;
  
  // Additional Income Sources (optional)
  bonusIncome: number;
  passiveIncome: number;
  
  // Planned Large Purchases
  plannedPurchases: PlannedPurchase[];
  expectedInflationRate: number;
}

/**
 * Planned large purchase details
 */
export interface PlannedPurchase {
  name: string;
  cost: number;
  timeframeYears: number;
  priority: 'high' | 'medium' | 'low';
  financed: boolean; // If true, only down payment affects cash flow
  downPaymentPercent?: number; // For financed purchases
}

/**
 * Result of financial analysis - Enhanced with predictions
 */
export interface AnalysisResult {
  score: number;
  cashFlow: number;
  recommendation: string;
  emergencyFundMonths: number;
  debtToIncomeRatio: number;
  
  // Long-term Predictions
  retirementProjections: RetirementProjections;
  wealthProjections: WealthProjections;
  financialMilestones: FinancialMilestone[];
  riskAssessment: RiskAssessment;
  
  // Inflation-adjusted projections
  inflationAdjustedProjections: InflationAdjustedProjections;
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
  
  // Inflation-adjusted retirement values
  realRetirementWealth: number;
  realRetirementIncome: number;
  inflationImpact: number;
}

/**
 * Wealth growth projections
 */
export interface WealthProjections {
  fiveYearProjection: number;
  tenYearProjection: number;
  retirementProjection: number;
  compoundGrowthRate: number;
  totalContributions: number;
  investmentGrowth: number;
  
  // Large purchase impact
  fiveYearAfterPurchases: number;
  tenYearAfterPurchases: number;
  retirementAfterPurchases: number;
  totalPlannedPurchases: number;
}

/**
 * Inflation-adjusted projections showing real purchasing power
 */
export interface InflationAdjustedProjections {
  fiveYearReal: number;
  tenYearReal: number;
  retirementReal: number;
  
  // After planned purchases (inflation-adjusted)
  fiveYearRealAfterPurchases: number;
  tenYearRealAfterPurchases: number;
  retirementRealAfterPurchases: number;
  
  // Inflation impact metrics
  inflationRate: number;
  fiveYearInflationImpact: number;
  tenYearInflationImpact: number;
  retirementInflationImpact: number;
  
  // Purchasing power comparison
  todaysPurchasingPower: {
    fiveYear: number;
    tenYear: number;
    retirement: number;
  };
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
  
  // Inflation-adjusted values
  realTargetAmount?: number;
  inflationAdjustedContribution?: number;
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
  
  // Large purchase risks
  purchaseAffordability: 'excellent' | 'good' | 'concerning' | 'unaffordable';
  liquidityRisk: boolean;
  inflationRisk: 'low' | 'medium' | 'high';
}

/**
 * DOM element references
 */
export interface DOMElements {
  form: HTMLFormElement;
  resultsDiv: HTMLElement;
  scoreElement: HTMLElement;
  cashFlowElement: HTMLElement;
  recommendationElement: HTMLElement;
  analyzeBtn: HTMLButtonElement;
} 