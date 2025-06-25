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
export declare const HEALTH_SCORE_THRESHOLDS: Readonly<{
    EXCELLENT: number;
    GOOD: number;
    FAIR: number;
    LIMITED: number;
    CRITICAL: number;
}>;
/**
 * Financial Ratio Benchmarks
 * Emergency fund, DTI, savings rate, and credit utilization targets from CFPB, Experian, NerdWallet.
 * @see https://www.consumerfinance.gov/, https://www.experian.com/, https://www.nerdwallet.com/
 */
export declare const FINANCIAL_BENCHMARKS: Readonly<{
    EMERGENCY_FUND_MONTHS: Record<string, number>;
    DEBT_TO_INCOME: Record<string, number>;
    SAVINGS_RATE: Record<string, number>;
    CREDIT_UTILIZATION: Record<string, number>;
}>;
/**
 * Default Form Values
 * Used for initializing forms. Not shown to users unless validated and confirmed.
 * @see https://www.finhealthnetwork.org/
 */
export declare const DEFAULT_FORM_VALUES: {
    readonly PERSONAL_INFO: {
        readonly age: 30;
        readonly maritalStatus: "single";
        readonly dependents: 0;
        readonly employmentStatus: "employed";
        readonly employmentTenure: 3;
    };
    readonly INCOME: {
        readonly primarySalary: 5000;
        readonly secondaryIncome: 0;
        readonly businessIncome: 0;
        readonly investmentIncome: 0;
        readonly rentalIncome: 0;
        readonly benefitsIncome: 0;
        readonly otherIncome: 0;
        readonly incomeGrowthRate: 0.03;
        readonly incomeVariability: "stable";
        readonly effectiveTaxRate: 0.22;
    };
    readonly EXPENSES: {
        readonly housing: 1500;
        readonly utilities: 200;
        readonly food: 600;
        readonly transportation: 400;
        readonly healthcare: 200;
        readonly insurance: 300;
        readonly entertainment: 200;
        readonly shopping: 150;
        readonly creditCardPayments: 200;
    };
    readonly ASSETS: {
        readonly checking: 2000;
        readonly savings: 5000;
        readonly emergencyFund: 10000;
        readonly employer401k: 25000;
        readonly brokerageAccounts: 15000;
    };
    readonly LIABILITIES: {
        readonly creditCardDebt: 5000;
        readonly studentLoans: 20000;
        readonly autoLoans: 15000;
        readonly mortgageBalance: 200000;
        readonly creditScore: 720;
        readonly totalCreditLimit: 25000;
    };
};
/**
 * Health Indicator Weights (sum to 1.0)
 * Used to weight each indicator in the overall health score. Based on research and expert consensus.
 * @see https://www.finhealthnetwork.org/
 */
export declare const INDICATOR_WEIGHTS: Readonly<{
    SPENDING_VS_INCOME: number;
    BILL_PAYMENT: number;
    EMERGENCY_SAVINGS: number;
    DEBT_MANAGEMENT: number;
    CREDIT_HEALTH: number;
    INSURANCE_COVERAGE: number;
    RETIREMENT_PLANNING: number;
    FINANCIAL_PLANNING: number;
}>;
/**
 * Status Color Mappings
 * Used for UI color coding of health statuses. Colors meet accessibility contrast standards.
 */
export declare const STATUS_COLORS: Readonly<{
    excellent: string;
    good: string;
    fair: string;
    poor: string;
    critical: string;
}>;
/**
 * Currency Formatting Options
 * Used with Intl.NumberFormat for all currency display. USD, no decimals for clarity.
 */
export declare const CURRENCY_FORMAT_OPTIONS: Readonly<Intl.NumberFormatOptions>;
//# sourceMappingURL=financial-constants.d.ts.map