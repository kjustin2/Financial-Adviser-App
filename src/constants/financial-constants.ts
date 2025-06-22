/**
 * Financial Constants and Thresholds
 * Based on Financial Health Network 2024 research standards
 */

// Health Score Thresholds
export const HEALTH_SCORE_THRESHOLDS = {
    EXCELLENT: 80,
    GOOD: 65,
    FAIR: 50,
    LIMITED: 35,
    CRITICAL: 0
} as const;

// Financial Ratio Benchmarks
export const FINANCIAL_BENCHMARKS = {
    EMERGENCY_FUND_MONTHS: {
        EXCELLENT: 6,
        GOOD: 4,
        FAIR: 2,
        POOR: 1
    },
    DEBT_TO_INCOME: {
        EXCELLENT: 0.20,
        GOOD: 0.28,
        FAIR: 0.36,
        POOR: 0.50
    },
    SAVINGS_RATE: {
        EXCELLENT: 0.20,
        GOOD: 0.15,
        FAIR: 0.10,
        POOR: 0.05
    },
    CREDIT_UTILIZATION: {
        EXCELLENT: 0.10,
        GOOD: 0.20,
        FAIR: 0.30,
        POOR: 0.50
    }
} as const;

// Default Form Values
export const DEFAULT_FORM_VALUES = {
    PERSONAL_INFO: {
        age: 30,
        maritalStatus: 'single' as const,
        dependents: 0,
        employmentStatus: 'employed' as const,
        employmentTenure: 3
    },
    INCOME: {
        primarySalary: 5000,
        secondaryIncome: 0,
        businessIncome: 0,
        investmentIncome: 0,
        rentalIncome: 0,
        benefitsIncome: 0,
        otherIncome: 0,
        incomeGrowthRate: 0.03,
        incomeVariability: 'stable' as const,
        effectiveTaxRate: 0.22
    },
    EXPENSES: {
        housing: 1500,
        utilities: 200,
        food: 600,
        transportation: 400,
        healthcare: 200,
        insurance: 300,
        entertainment: 200,
        shopping: 150,
        creditCardPayments: 200
    },
    ASSETS: {
        checking: 2000,
        savings: 5000,
        emergencyFund: 10000,
        employer401k: 25000,
        brokerageAccounts: 15000
    },
    LIABILITIES: {
        creditCardDebt: 5000,
        studentLoans: 20000,
        autoLoans: 15000,
        mortgageBalance: 200000,
        creditScore: 720,
        totalCreditLimit: 25000
    }
} as const;

// Health Indicator Weights (sum to 1.0)
export const INDICATOR_WEIGHTS = {
    SPENDING_VS_INCOME: 0.15,
    BILL_PAYMENT: 0.12,
    EMERGENCY_SAVINGS: 0.15,
    DEBT_MANAGEMENT: 0.15,
    CREDIT_HEALTH: 0.13,
    INSURANCE_COVERAGE: 0.10,
    RETIREMENT_PLANNING: 0.12,
    FINANCIAL_PLANNING: 0.08
} as const;

// Status Color Mappings
export const STATUS_COLORS = {
    excellent: '#10b981',
    good: '#3b82f6',
    fair: '#f59e0b',
    poor: '#ef4444',
    critical: '#dc2626'
} as const;

// Currency Formatting Options
export const CURRENCY_FORMAT_OPTIONS = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
} as const; 