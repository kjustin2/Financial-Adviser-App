import { TimeBasedScenarioConfig, ParameterDrift, RegimeChange } from '../types';

/**
 * Predefined Time-Based Scenario Configurations
 * Examples of common economic evolution patterns
 */

/**
 * Default parameter drift configuration
 * Models gradual economic parameter changes
 */
export const DEFAULT_PARAMETER_DRIFTS: ParameterDrift[] = [
    {
        parameter: 'inflationRate.mean',
        driftRate: 0.001, // 0.1% annual drift
        volatility: 0.005, // 0.5% volatility
        bounds: { min: -0.01, max: 0.12 }, // -1% to 12%
        meanReversion: {
            enabled: true,
            rate: 0.2, // 20% annual mean reversion
            target: 0.025 // 2.5% long-term inflation target
        }
    },
    {
        parameter: 'marketReturn.mean',
        driftRate: 0.002, // 0.2% annual drift
        volatility: 0.01, // 1% volatility
        bounds: { min: -0.3, max: 0.2 }, // -30% to 20%
        meanReversion: {
            enabled: true,
            rate: 0.15, // 15% annual mean reversion
            target: 0.08 // 8% long-term market return
        }
    },
    {
        parameter: 'interestRates.federalFunds',
        driftRate: 0.001, // 0.1% annual drift
        volatility: 0.003, // 0.3% volatility
        bounds: { min: 0, max: 0.15 }, // 0% to 15%
        meanReversion: {
            enabled: true,
            rate: 0.25, // 25% annual mean reversion
            target: 0.025 // 2.5% neutral rate
        }
    }
];

/**
 * Economic cycle regime change rules
 * Models transitions between economic conditions
 */
export const ECONOMIC_CYCLE_REGIME_RULES: RegimeChange[] = [
    // Normal growth to recession transitions
    {
        fromScenario: 'normal-growth',
        toScenario: 'recession-mild',
        transitionProbability: 0.15, // 15% annual probability
        triggers: {
            timeThreshold: 2, // Minimum 2 years in normal growth
            parameterThresholds: [
                {
                    parameter: 'inflationRate.mean',
                    threshold: 0.04,
                    comparison: 'greater'
                }
            ],
            marketConditions: ['bear', 'volatile']
        },
        transitionSpeed: 'gradual',
        transitionDuration: 6 // 6 months
    },
    
    // Mild recession to severe recession
    {
        fromScenario: 'recession-mild',
        toScenario: 'recession-severe',
        transitionProbability: 0.25, // 25% annual probability
        triggers: {
            timeThreshold: 0.5, // Minimum 6 months in mild recession
            marketConditions: ['bear']
        },
        transitionSpeed: 'immediate'
    },
    
    // Recession recovery to normal growth
    {
        fromScenario: 'recession-mild',
        toScenario: 'normal-growth',
        transitionProbability: 0.4, // 40% annual probability
        triggers: {
            timeThreshold: 1, // Minimum 1 year in recession
            parameterThresholds: [
                {
                    parameter: 'gdpGrowth.mean',
                    threshold: 0.01,
                    comparison: 'greater'
                }
            ]
        },
        transitionSpeed: 'gradual',
        transitionDuration: 12 // 12 months
    },
    
    // Normal growth to bull market
    {
        fromScenario: 'normal-growth',
        toScenario: 'bull-market',
        transitionProbability: 0.1, // 10% annual probability
        triggers: {
            timeThreshold: 3, // Minimum 3 years in normal growth
            marketConditions: ['bull']
        },
        transitionSpeed: 'smooth'
    },
    
    // Bull market to normal growth (cooling)
    {
        fromScenario: 'bull-market',
        toScenario: 'normal-growth',
        transitionProbability: 0.3, // 30% annual probability
        triggers: {
            timeThreshold: 2, // Minimum 2 years in bull market
            parameterThresholds: [
                {
                    parameter: 'marketReturn.mean',
                    threshold: 0.12,
                    comparison: 'greater'
                }
            ]
        },
        transitionSpeed: 'gradual',
        transitionDuration: 9 // 9 months
    },
    
    // Normal growth to high inflation
    {
        fromScenario: 'normal-growth',
        toScenario: 'high-inflation',
        transitionProbability: 0.08, // 8% annual probability
        triggers: {
            timeThreshold: 1.5, // Minimum 1.5 years in normal growth
            parameterThresholds: [
                {
                    parameter: 'inflationRate.mean',
                    threshold: 0.045,
                    comparison: 'greater'
                }
            ]
        },
        transitionSpeed: 'gradual',
        transitionDuration: 18 // 18 months
    }
];

/**
 * Conservative time-based configuration
 * Lower volatility, slower regime changes
 */
export const CONSERVATIVE_TIME_CONFIG: TimeBasedScenarioConfig = {
    enableParameterDrift: true,
    enableRegimeChanges: false, // No regime changes for conservative
    updateFrequency: 'monthly',
    parameterDrifts: DEFAULT_PARAMETER_DRIFTS.map(drift => ({
        ...drift,
        volatility: drift.volatility * 0.5, // Half the volatility
        meanReversion: {
            ...drift.meanReversion,
            rate: drift.meanReversion.rate * 1.5 // Stronger mean reversion
        }
    })),
    regimeRules: [],
    historicalContextWindow: 10, // 10 years
    smoothingWindow: 12 // 12 periods
};

/**
 * Dynamic time-based configuration
 * Full parameter drift and regime changes
 */
export const DYNAMIC_TIME_CONFIG: TimeBasedScenarioConfig = {
    enableParameterDrift: true,
    enableRegimeChanges: true,
    updateFrequency: 'weekly',
    parameterDrifts: DEFAULT_PARAMETER_DRIFTS,
    regimeRules: ECONOMIC_CYCLE_REGIME_RULES,
    historicalContextWindow: 15, // 15 years
    smoothingWindow: 8 // 8 periods
};

/**
 * Stress testing configuration
 * Higher volatility, more frequent regime changes
 */
export const STRESS_TEST_TIME_CONFIG: TimeBasedScenarioConfig = {
    enableParameterDrift: true,
    enableRegimeChanges: true,
    updateFrequency: 'daily',
    parameterDrifts: DEFAULT_PARAMETER_DRIFTS.map(drift => ({
        ...drift,
        volatility: drift.volatility * 2, // Double the volatility
        driftRate: drift.driftRate * 1.5, // Increase drift rate
        meanReversion: {
            ...drift.meanReversion,
            rate: drift.meanReversion.rate * 0.7 // Weaker mean reversion
        }
    })),
    regimeRules: ECONOMIC_CYCLE_REGIME_RULES.map(rule => ({
        ...rule,
        transitionProbability: rule.transitionProbability * 1.5 // Increase transition probability
    })),
    historicalContextWindow: 5, // 5 years
    smoothingWindow: 4 // 4 periods
};

/**
 * Get configuration by risk profile
 */
export function getTimeBasedConfigByProfile(profile: 'conservative' | 'dynamic' | 'stress-test'): TimeBasedScenarioConfig {
    switch (profile) {
        case 'conservative':
            return CONSERVATIVE_TIME_CONFIG;
        case 'dynamic':
            return DYNAMIC_TIME_CONFIG;
        case 'stress-test':
            return STRESS_TEST_TIME_CONFIG;
        default:
            return DYNAMIC_TIME_CONFIG;
    }
} 