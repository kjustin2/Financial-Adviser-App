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
    employmentTenure: number;
    healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
    healthInsurance: boolean;
    lifeInsurance: boolean;
    shortTermDisability: boolean;
    longTermDisability: boolean;
}
export interface IncomeData {
    primarySalary: number;
    secondaryIncome: number;
    businessIncome: number;
    investmentIncome: number;
    rentalIncome: number;
    benefitsIncome: number;
    otherIncome: number;
    incomeGrowthRate: number;
    incomeVariability: 'stable' | 'somewhat-variable' | 'highly-variable';
    effectiveTaxRate: number;
}
export interface ExpenseData {
    housing: number;
    utilities: number;
    insurance: number;
    loanPayments: number;
    childcare: number;
    food: number;
    transportation: number;
    healthcare: number;
    clothing: number;
    personalCare: number;
    entertainment: number;
    diningOut: number;
    hobbies: number;
    subscriptions: number;
    shopping: number;
    travel: number;
    creditCardPayments: number;
    studentLoanPayments: number;
    otherDebtPayments: number;
}
export interface AssetData {
    checking: number;
    savings: number;
    moneyMarket: number;
    emergencyFund: number;
    employer401k: number;
    traditionalIRA: number;
    rothIRA: number;
    brokerageAccounts: number;
    stocks: number;
    bonds: number;
    mutualFunds: number;
    primaryResidence: number;
    investmentProperties: number;
    cryptocurrency: number;
    preciousMetals: number;
    collectibles: number;
    businessEquity: number;
    otherAssets: number;
}
export interface LiabilityData {
    mortgageBalance: number;
    homeEquityLoan: number;
    autoLoans: number;
    securedCreditLines: number;
    creditCardDebt: number;
    personalLoans: number;
    studentLoans: number;
    medicalDebt: number;
    businessLoans: number;
    businessCreditLines: number;
    taxDebt: number;
    legalJudgments: number;
    otherDebt: number;
    creditScore: number;
    totalCreditLimit: number;
}
export interface InsuranceData {
    healthInsurance: boolean;
    healthDeductible: number;
    healthOutOfPocketMax: number;
    lifeInsurance: boolean;
    lifeCoverageAmount: number;
    shortTermDisability: boolean;
    longTermDisability: boolean;
    disabilityCoveragePercent: number;
    homeInsurance: boolean;
    autoInsurance: boolean;
    umbrellaPolicy: boolean;
    insuranceConfidence: 'very-confident' | 'somewhat-confident' | 'not-confident';
}
export interface FinancialGoals {
    emergencyFundTarget: number;
    debtPayoffGoal: boolean;
    majorPurchaseAmount: number;
    homeDownPayment: number;
    educationFunding: number;
    careerChangeBuffer: number;
    retirementAge: number;
    retirementIncomeNeeded: number;
    legacyGoalAmount: number;
    retirementConfidence: 'very-confident' | 'somewhat-confident' | 'not-confident';
    longTermGoalConfidence: 'very-confident' | 'somewhat-confident' | 'not-confident';
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    investmentExperience: 'beginner' | 'intermediate' | 'advanced';
}
export interface FinancialBehaviors {
    billPaymentReliability: 'always-on-time' | 'usually-on-time' | 'sometimes-late' | 'often-late';
    budgetingMethod: 'detailed-budget' | 'simple-tracking' | 'mental-budget' | 'no-budget';
    financialPlanningEngagement: 'actively-plan' | 'occasionally-plan' | 'rarely-plan' | 'never-plan';
    automaticSavings: boolean;
    monthlyInvestmentContribution: number;
    emergencyFundPriority: 'high' | 'medium' | 'low';
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
//# sourceMappingURL=core-types.d.ts.map