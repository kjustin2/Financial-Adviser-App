/**
 * Historical Financial Data and Rates
 * Based on Federal Reserve, Bureau of Labor Statistics, and S&P 500 data
 */

export interface HistoricalRate {
    year: number;
    inflationRate: number;
    sp500Return: number;
    bondReturn: number;
    unemploymentRate: number;
}

/**
 * Historical inflation rates (CPI-U) from Federal Reserve data
 * Average over past 30 years: ~2.5%, past 100 years: ~3.1%
 */
export const HISTORICAL_INFLATION_RATE = 0.035; // 3.5% conservative estimate

/**
 * Historical market returns (S&P 500) from 1926-2024
 * Source: Morningstar, Federal Reserve Economic Data
 */
export const HISTORICAL_MARKET_RETURNS = {
    conservative: 0.05,  // 5% (bonds, CDs, conservative portfolio)
    moderate: 0.07,      // 7% (balanced portfolio, historical average)
    aggressive: 0.09     // 9% (stock-heavy portfolio, higher risk)
};

/**
 * Industry-standard financial benchmarks
 * Sources: CFPB, Federal Reserve Survey of Consumer Finances
 */
export const FINANCIAL_BENCHMARKS = {
    // Emergency fund recommendations
    emergencyFund: {
        minimum: 3,     // months of expenses
        recommended: 6, // months of expenses
        optimal: 12     // months of expenses for high-risk jobs
    },
    
    // Debt-to-income ratios (industry standards)
    debtToIncome: {
        excellent: 0.10,    // <10% total debt-to-income
        good: 0.20,         // 10-20%
        fair: 0.30,         // 20-30%
        concerning: 0.40,   // 30-40%
        critical: 0.50      // >40%
    },
    
    // Savings rates for wealth building
    savingsRate: {
        minimum: 0.10,      // 10% minimum for retirement
        recommended: 0.15,  // 15% for comfortable retirement
        optimal: 0.20,      // 20%+ for early retirement/FIRE
        fire: 0.50          // 50%+ for aggressive FIRE
    },
    
    // Housing cost ratios
    housing: {
        recommended: 0.28,  // 28% of gross income
        maximum: 0.33       // 33% absolute maximum
    }
};

/**
 * Age-based investment allocation recommendations
 * Based on modern portfolio theory and lifecycle investing
 */
export const AGE_BASED_ALLOCATION = {
    // Conservative rule: Age in bonds (e.g., 30 years old = 30% bonds)
    // Modern rule: Age minus 10 in bonds (e.g., 30 years old = 20% bonds)
    getBondAllocation: (age: number, riskTolerance: 'conservative' | 'moderate' | 'aggressive'): number => {
        const baseAllocation = Math.max(0, Math.min(100, age - 10));
        
        switch (riskTolerance) {
            case 'conservative':
                return Math.min(80, baseAllocation + 20);
            case 'moderate':
                return baseAllocation;
            case 'aggressive':
                return Math.max(10, baseAllocation - 10);
            default:
                return baseAllocation;
        }
    },
    
    getStockAllocation: (age: number, riskTolerance: 'conservative' | 'moderate' | 'aggressive'): number => {
        const bondAllocation = AGE_BASED_ALLOCATION.getBondAllocation(age, riskTolerance);
        return 100 - bondAllocation;
    }
};

/**
 * Regional cost of living adjustments
 * Based on Bureau of Labor Statistics Consumer Price Index by region
 */
export const REGIONAL_ADJUSTMENTS = {
    // Major metropolitan areas cost of living index (US average = 100)
    'New York': 1.68,
    'San Francisco': 1.64,
    'Los Angeles': 1.43,
    'Washington DC': 1.38,
    'Boston': 1.32,
    'Seattle': 1.28,
    'Chicago': 1.08,
    'Denver': 1.05,
    'Atlanta': 0.95,
    'Dallas': 0.93,
    'Phoenix': 0.92,
    'Houston': 0.90,
    'US Average': 1.00
};

/**
 * Salary growth rates by education level and industry
 * Source: Bureau of Labor Statistics Employment Projections
 */
export const SALARY_GROWTH_RATES = {
    byEducation: {
        'High School': 0.025,           // 2.5% annual growth
        'Some College': 0.030,          // 3.0% annual growth
        'Bachelor\'s Degree': 0.035,    // 3.5% annual growth
        'Master\'s Degree': 0.040,      // 4.0% annual growth
        'Professional Degree': 0.045   // 4.5% annual growth
    },
    
    byIndustry: {
        'Technology': 0.055,            // 5.5% annual growth
        'Healthcare': 0.045,            // 4.5% annual growth
        'Finance': 0.040,               // 4.0% annual growth
        'Engineering': 0.038,           // 3.8% annual growth
        'Education': 0.025,             // 2.5% annual growth
        'Retail': 0.020,                // 2.0% annual growth
        'Manufacturing': 0.030,         // 3.0% annual growth
        'Government': 0.025             // 2.5% annual growth
    }
};

/**
 * Calculate real (inflation-adjusted) return
 */
export function calculateRealReturn(nominalReturn: number, inflationRate: number = HISTORICAL_INFLATION_RATE): number {
    return (1 + nominalReturn) / (1 + inflationRate) - 1;
}

/**
 * Calculate future value with inflation adjustment
 */
export function calculateInflationAdjustedValue(
    presentValue: number, 
    years: number, 
    inflationRate: number = HISTORICAL_INFLATION_RATE
): number {
    return presentValue * Math.pow(1 + inflationRate, years);
}

/**
 * Get expected return based on risk tolerance and time horizon
 */
export function getExpectedReturn(
    riskTolerance: 'conservative' | 'moderate' | 'aggressive',
    timeHorizon: number
): number {
    const baseReturn = HISTORICAL_MARKET_RETURNS[riskTolerance];
    
    // Adjust for time horizon (longer horizon allows for more risk)
    if (timeHorizon > 20) {
        return baseReturn + 0.005; // +0.5% for very long horizon
    } else if (timeHorizon < 5) {
        return baseReturn - 0.01;  // -1% for short horizon
    }
    
    return baseReturn;
} 