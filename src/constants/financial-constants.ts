/**
 * Financial Constants and Thresholds
 * Based on Financial Health Network 2024 research standards
 *
 * @remarks
 * - All constants are strictly typed and documented.
 * - Values are research-based and reference authoritative sources.
 * - No sensitive data is included.
 */

/**
 * Health Score Thresholds
 * Used to categorize overall financial health.
 * @see https://www.finhealthnetwork.org/
 */
export const HEALTH_SCORE_THRESHOLDS: Readonly<{
    EXCELLENT: number;
    GOOD: number;
    FAIR: number;
    LIMITED: number;
    CRITICAL: number;
}> = {
    EXCELLENT: 80,
    GOOD: 65,
    FAIR: 50,
    LIMITED: 35,
    CRITICAL: 0
} as const;

/**
 * Financial Ratio Benchmarks
 * Emergency fund, DTI, savings rate, and credit utilization targets from CFPB, Experian, NerdWallet.
 * @see https://www.consumerfinance.gov/, https://www.experian.com/, https://www.nerdwallet.com/
 */
export const FINANCIAL_BENCHMARKS: Readonly<{
    EMERGENCY_FUND_MONTHS: Record<string, number>;
    DEBT_TO_INCOME: Record<string, number>;
    SAVINGS_RATE: Record<string, number>;
    CREDIT_UTILIZATION: Record<string, number>;
}> = {
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

/**
 * Default Form Values
 * Used for initializing forms. Not shown to users unless validated and confirmed.
 * @see https://www.finhealthnetwork.org/
 */
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

/**
 * Health Indicator Weights (sum to 1.0)
 * Used to weight each indicator in the overall health score. Based on research and expert consensus.
 * @see https://www.finhealthnetwork.org/
 */
export const INDICATOR_WEIGHTS: Readonly<{
    SPENDING_VS_INCOME: number;
    BILL_PAYMENT: number;
    EMERGENCY_SAVINGS: number;
    DEBT_MANAGEMENT: number;
    CREDIT_HEALTH: number;
    INSURANCE_COVERAGE: number;
    RETIREMENT_PLANNING: number;
    FINANCIAL_PLANNING: number;
}> = {
    SPENDING_VS_INCOME: 0.15,
    BILL_PAYMENT: 0.12,
    EMERGENCY_SAVINGS: 0.15,
    DEBT_MANAGEMENT: 0.15,
    CREDIT_HEALTH: 0.13,
    INSURANCE_COVERAGE: 0.10,
    RETIREMENT_PLANNING: 0.12,
    FINANCIAL_PLANNING: 0.08
} as const;

/**
 * Status Color Mappings
 * Used for UI color coding of health statuses. Colors meet accessibility contrast standards.
 */
export const STATUS_COLORS: Readonly<{
    excellent: string;
    good: string;
    fair: string;
    poor: string;
    critical: string;
}> = {
    excellent: '#10b981',
    good: '#3b82f6',
    fair: '#f59e0b',
    poor: '#ef4444',
    critical: '#dc2626'
} as const;

/**
 * Currency Formatting Options
 * Used with Intl.NumberFormat for all currency display. USD, no decimals for clarity.
 */
export const CURRENCY_FORMAT_OPTIONS: Readonly<Intl.NumberFormatOptions> = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
} as const; 