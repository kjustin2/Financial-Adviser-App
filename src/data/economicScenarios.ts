import { EconomicScenario } from '../types';

/**
 * Predefined Economic Scenarios for Monte Carlo Testing
 * Based on historical events and economic research
 */
export const ECONOMIC_SCENARIOS: EconomicScenario[] = [
    {
        id: 'normal-growth',
        name: 'Normal Economic Growth',
        description: 'Typical economic conditions with moderate growth and inflation',
        category: 'normal',
        probability: 0.60, // 60% of the time
        duration: { min: 2, max: 8 },
        parameters: {
            marketReturn: {
                mean: 0.08, // 8% average market return
                volatility: 0.16 // 16% volatility
            },
            inflationRate: {
                mean: 0.025, // 2.5% inflation
                volatility: 0.008,
                min: 0.01,
                max: 0.04
            },
            interestRates: {
                shortTerm: 0.025,
                longTerm: 0.045,
                federalFunds: 0.02
            },
            gdpGrowth: {
                mean: 0.025,
                volatility: 0.01
            },
            unemployment: {
                rate: 0.045, // 4.5%
                trend: 'stable'
            },
            marketShocks: [
                {
                    probability: 0.05, // 5% chance per year
                    impact: -0.10, // -10% market shock
                    duration: 3, // 3 months
                }
            ],
            currencyVolatility: 0.08,
            internationalExposure: 0.15
        },
        historicalPrecedent: '1995-2000, 2003-2007, 2012-2019',
        tags: ['baseline', 'normal', 'moderate-growth']
    },
    
    {
        id: 'recession-mild',
        name: 'Mild Recession',
        description: 'Moderate economic downturn with negative growth for 2-3 quarters',
        category: 'recession',
        probability: 0.15, // 15% probability
        duration: { min: 0.5, max: 2 },
        parameters: {
            marketReturn: {
                mean: -0.05, // -5% average return
                volatility: 0.28 // High volatility
            },
            inflationRate: {
                mean: 0.015, // Lower inflation
                volatility: 0.012,
                min: -0.01, // Possible deflation
                max: 0.03
            },
            interestRates: {
                shortTerm: 0.01,
                longTerm: 0.025,
                federalFunds: 0.005
            },
            gdpGrowth: {
                mean: -0.02,
                volatility: 0.015
            },
            unemployment: {
                rate: 0.07, // 7%
                trend: 'rising'
            },
            marketShocks: [
                {
                    probability: 0.15, // Higher chance of shocks
                    impact: -0.15,
                    duration: 6,
                }
            ],
            currencyVolatility: 0.12,
            internationalExposure: 0.20
        },
        historicalPrecedent: '1990-1991, 2001, early COVID-19',
        tags: ['recession', 'downturn', 'defensive']
    },
    
    {
        id: 'recession-severe',
        name: 'Severe Recession',
        description: 'Deep economic contraction similar to 2008 Financial Crisis',
        category: 'recession',
        probability: 0.05, // 5% probability
        duration: { min: 1, max: 3 },
        parameters: {
            marketReturn: {
                mean: -0.20, // -20% average return
                volatility: 0.35 // Very high volatility
            },
            inflationRate: {
                mean: 0.005, // Very low inflation
                volatility: 0.015,
                min: -0.02, // Deflation possible
                max: 0.02
            },
            interestRates: {
                shortTerm: 0.001, // Near zero
                longTerm: 0.015,
                federalFunds: 0.001
            },
            gdpGrowth: {
                mean: -0.06,
                volatility: 0.02
            },
            unemployment: {
                rate: 0.10, // 10%
                trend: 'rising'
            },
            marketShocks: [
                {
                    probability: 0.25,
                    impact: -0.30, // Severe market crashes
                    duration: 12,
                },
                {
                    probability: 0.10,
                    impact: -0.50, // Black swan events
                    duration: 6,
                    sector: 'financial'
                }
            ],
            currencyVolatility: 0.18,
            internationalExposure: 0.25
        },
        historicalPrecedent: '2008-2009 Financial Crisis, 1929 Great Depression',
        tags: ['severe-recession', 'financial-crisis', 'high-risk']
    },
    
    {
        id: 'high-inflation',
        name: 'High Inflation Period',
        description: 'Persistent high inflation similar to 1970s stagflation',
        category: 'inflation',
        probability: 0.08, // 8% probability
        duration: { min: 2, max: 5 },
        parameters: {
            marketReturn: {
                mean: 0.03, // Low real returns
                volatility: 0.22
            },
            inflationRate: {
                mean: 0.065, // 6.5% inflation
                volatility: 0.02,
                min: 0.04,
                max: 0.12
            },
            interestRates: {
                shortTerm: 0.055,
                longTerm: 0.075,
                federalFunds: 0.05
            },
            gdpGrowth: {
                mean: 0.01, // Stagflation
                volatility: 0.015
            },
            unemployment: {
                rate: 0.065, // 6.5%
                trend: 'stable'
            },
            marketShocks: [
                {
                    probability: 0.08,
                    impact: -0.12,
                    duration: 4,
                }
            ],
            currencyVolatility: 0.15,
            internationalExposure: 0.20
        },
        historicalPrecedent: '1970s Oil Crisis, early 1980s',
        tags: ['inflation', 'stagflation', 'commodities']
    },
    
    {
        id: 'bull-market',
        name: 'Bull Market Expansion',
        description: 'Strong economic growth with rising asset prices',
        category: 'bull-market',
        probability: 0.08, // 8% probability
        duration: { min: 3, max: 10 },
        parameters: {
            marketReturn: {
                mean: 0.15, // 15% returns
                volatility: 0.18
            },
            inflationRate: {
                mean: 0.02, // Controlled inflation
                volatility: 0.006,
                min: 0.015,
                max: 0.035
            },
            interestRates: {
                shortTerm: 0.02,
                longTerm: 0.04,
                federalFunds: 0.015
            },
            gdpGrowth: {
                mean: 0.04, // Strong growth
                volatility: 0.008
            },
            unemployment: {
                rate: 0.035, // 3.5%
                trend: 'falling'
            },
            marketShocks: [
                {
                    probability: 0.03, // Low probability of shocks
                    impact: -0.08,
                    duration: 2,
                }
            ],
            currencyVolatility: 0.06,
            internationalExposure: 0.12
        },
        historicalPrecedent: '1990s Tech Boom, 1950s-1960s',
        tags: ['bull-market', 'growth', 'expansion']
    },
    
    {
        id: 'market-crash',
        name: 'Market Crash',
        description: 'Sudden severe market decline followed by recovery',
        category: 'market-crash',
        probability: 0.03, // 3% probability
        duration: { min: 0.25, max: 1 }, // 3 months to 1 year
        parameters: {
            marketReturn: {
                mean: -0.35, // -35% crash
                volatility: 0.45 // Extreme volatility
            },
            inflationRate: {
                mean: 0.02,
                volatility: 0.01,
                min: 0.01,
                max: 0.04
            },
            interestRates: {
                shortTerm: 0.01,
                longTerm: 0.025,
                federalFunds: 0.005
            },
            gdpGrowth: {
                mean: -0.01,
                volatility: 0.02
            },
            unemployment: {
                rate: 0.055, // 5.5%
                trend: 'rising'
            },
            marketShocks: [
                {
                    probability: 0.80, // Very high probability during crash
                    impact: -0.20,
                    duration: 1,
                }
            ],
            currencyVolatility: 0.20,
            internationalExposure: 0.30
        },
        historicalPrecedent: 'Black Monday 1987, Dot-com crash 2000, COVID-19 March 2020',
        tags: ['crash', 'volatility', 'short-term']
    }
];

/**
 * Get scenario by ID
 */
export function getScenarioById(id: string): EconomicScenario | undefined {
    return ECONOMIC_SCENARIOS.find(scenario => scenario.id === id);
}

/**
 * Get scenarios by category
 */
export function getScenariosByCategory(category: EconomicScenario['category']): EconomicScenario[] {
    return ECONOMIC_SCENARIOS.filter(scenario => scenario.category === category);
}

/**
 * Get baseline scenario (normal growth)
 */
export function getBaselineScenario(): EconomicScenario {
    return getScenarioById('normal-growth')!;
}

/**
 * Get scenarios for stress testing (worst-case scenarios)
 */
export function getStressTestScenarios(): EconomicScenario[] {
    return ECONOMIC_SCENARIOS.filter(scenario => 
        ['recession', 'market-crash', 'inflation'].includes(scenario.category)
    );
} 