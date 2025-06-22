/**
 * Core Financial Data Types
 * Fundamental interfaces for financial data structures
 */

export interface PersonalInfo {
    age: number;
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
    dependents: number;
    state: string;
    employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'retired' | 'student';
    employmentTenure: number; // years
    healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
    
    // Insurance Status
    healthInsurance: boolean;
    lifeInsurance: boolean;
    shortTermDisability: boolean;
    longTermDisability: boolean;
}

export interface IncomeData {
    // Primary Income Sources
    primarySalary: number; // monthly
    secondaryIncome: number; // monthly
    businessIncome: number; // monthly
    investmentIncome: number; // monthly
    rentalIncome: number; // monthly
    benefitsIncome: number; // monthly (Social Security, disability, etc.)
    otherIncome: number; // monthly
    
    // Income Stability
    incomeGrowthRate: number; // annual percentage
    incomeVariability: 'stable' | 'somewhat-variable' | 'highly-variable';
    
    // Tax Information
    effectiveTaxRate: number; // percentage
}

export interface ExpenseData {
    // Fixed Expenses (monthly)
    housing: number; // rent/mortgage payment
    utilities: number;
    insurance: number; // all insurance premiums
    loanPayments: number; // car loans, personal loans, etc.
    childcare: number;
    
    // Variable Necessities (monthly)
    food: number;
    transportation: number;
    healthcare: number;
    clothing: number;
    personalCare: number;
    
    // Discretionary Spending (monthly)
    entertainment: number;
    diningOut: number;
    hobbies: number;
    subscriptions: number;
    shopping: number;
    travel: number;
    
    // Debt Payments (monthly)
    creditCardPayments: number;
    studentLoanPayments: number;
    otherDebtPayments: number;
}

export interface AssetData {
    // Liquid Assets
    checking: number;
    savings: number;
    moneyMarket: number;
    emergencyFund: number;
    
    // Investment Accounts
    employer401k: number;
    traditionalIRA: number;
    rothIRA: number;
    brokerageAccounts: number;
    stocks: number;
    bonds: number;
    mutualFunds: number;
    
    // Real Estate
    primaryResidence: number;
    investmentProperties: number;
    
    // Alternative Assets
    cryptocurrency: number;
    preciousMetals: number;
    collectibles: number;
    businessEquity: number;
    otherAssets: number;
}

export interface LiabilityData {
    // Secured Debt
    mortgageBalance: number;
    homeEquityLoan: number;
    autoLoans: number;
    securedCreditLines: number;
    
    // Unsecured Debt
    creditCardDebt: number;
    personalLoans: number;
    studentLoans: number;
    medicalDebt: number;
    
    // Business Debt
    businessLoans: number;
    businessCreditLines: number;
    
    // Other Obligations
    taxDebt: number;
    legalJudgments: number;
    otherDebt: number;
    
    // Credit Information
    creditScore: number;
    totalCreditLimit: number;
}

export interface InsuranceData {
    // Health Insurance
    healthInsurance: boolean;
    healthDeductible: number;
    healthOutOfPocketMax: number;
    
    // Life Insurance
    lifeInsurance: boolean;
    lifeCoverageAmount: number;
    
    // Disability Insurance
    shortTermDisability: boolean;
    longTermDisability: boolean;
    disabilityCoveragePercent: number;
    
    // Property Insurance
    homeInsurance: boolean;
    autoInsurance: boolean;
    umbrellaPolicy: boolean;
    
    // Insurance Confidence
    insuranceConfidence: 'very-confident' | 'somewhat-confident' | 'not-confident';
}

export interface FinancialGoals {
    // Short-term Goals (1-2 years)
    emergencyFundTarget: number;
    debtPayoffGoal: boolean;
    majorPurchaseAmount: number;
    
    // Medium-term Goals (3-10 years)
    homeDownPayment: number;
    educationFunding: number;
    careerChangeBuffer: number;
    
    // Long-term Goals (10+ years)
    retirementAge: number;
    retirementIncomeNeeded: number; // monthly
    legacyGoalAmount: number;
    
    // Goal Confidence
    retirementConfidence: 'very-confident' | 'somewhat-confident' | 'not-confident';
    longTermGoalConfidence: 'very-confident' | 'somewhat-confident' | 'not-confident';
    
    // Risk Tolerance
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    investmentExperience: 'beginner' | 'intermediate' | 'advanced';
}

export interface FinancialBehaviors {
    // Bill Payment Patterns
    billPaymentReliability: 'always-on-time' | 'usually-on-time' | 'sometimes-late' | 'often-late';
    budgetingMethod: 'detailed-budget' | 'simple-tracking' | 'mental-budget' | 'no-budget';
    financialPlanningEngagement: 'actively-plan' | 'occasionally-plan' | 'rarely-plan' | 'never-plan';
    
    // Savings Behaviors
    automaticSavings: boolean;
    monthlyInvestmentContribution: number;
    emergencyFundPriority: 'high' | 'medium' | 'low';
    
    // Spending Patterns
    impulseSpendingFrequency: 'never' | 'rarely' | 'sometimes' | 'often';
    expenseTrackingMethod: 'detailed' | 'casual' | 'none';
}

export interface UserFinancialData {
    personalInfo: PersonalInfo;
    income: IncomeData;
    expenses: ExpenseData;
    assets: AssetData;
    liabilities: LiabilityData;
    insurance: InsuranceData;
    goals: FinancialGoals;
    behaviors: FinancialBehaviors;
} 