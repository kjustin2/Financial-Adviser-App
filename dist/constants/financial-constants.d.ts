/**
 * Financial Constants and Thresholds
 * Based on Financial Health Network 2024 research standards
 */
export declare const HEALTH_SCORE_THRESHOLDS: {
    readonly EXCELLENT: 80;
    readonly GOOD: 65;
    readonly FAIR: 50;
    readonly LIMITED: 35;
    readonly CRITICAL: 0;
};
export declare const FINANCIAL_BENCHMARKS: {
    readonly EMERGENCY_FUND_MONTHS: {
        readonly EXCELLENT: 6;
        readonly GOOD: 4;
        readonly FAIR: 2;
        readonly POOR: 1;
    };
    readonly DEBT_TO_INCOME: {
        readonly EXCELLENT: 0.2;
        readonly GOOD: 0.28;
        readonly FAIR: 0.36;
        readonly POOR: 0.5;
    };
    readonly SAVINGS_RATE: {
        readonly EXCELLENT: 0.2;
        readonly GOOD: 0.15;
        readonly FAIR: 0.1;
        readonly POOR: 0.05;
    };
    readonly CREDIT_UTILIZATION: {
        readonly EXCELLENT: 0.1;
        readonly GOOD: 0.2;
        readonly FAIR: 0.3;
        readonly POOR: 0.5;
    };
};
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
export declare const INDICATOR_WEIGHTS: {
    readonly SPENDING_VS_INCOME: 0.15;
    readonly BILL_PAYMENT: 0.12;
    readonly EMERGENCY_SAVINGS: 0.15;
    readonly DEBT_MANAGEMENT: 0.15;
    readonly CREDIT_HEALTH: 0.13;
    readonly INSURANCE_COVERAGE: 0.1;
    readonly RETIREMENT_PLANNING: 0.12;
    readonly FINANCIAL_PLANNING: 0.08;
};
export declare const STATUS_COLORS: {
    readonly excellent: "#10b981";
    readonly good: "#3b82f6";
    readonly fair: "#f59e0b";
    readonly poor: "#ef4444";
    readonly critical: "#dc2626";
};
export declare const CURRENCY_FORMAT_OPTIONS: {
    readonly style: "currency";
    readonly currency: "USD";
    readonly minimumFractionDigits: 0;
    readonly maximumFractionDigits: 0;
};
//# sourceMappingURL=financial-constants.d.ts.map