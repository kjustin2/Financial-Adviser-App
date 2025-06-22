import { TimeBasedScenarioConfig, ParameterDrift, RegimeChange } from '../types';
/**
 * Predefined Time-Based Scenario Configurations
 * Examples of common economic evolution patterns
 */
/**
 * Default parameter drift configuration
 * Models gradual economic parameter changes
 */
export declare const DEFAULT_PARAMETER_DRIFTS: ParameterDrift[];
/**
 * Economic cycle regime change rules
 * Models transitions between economic conditions
 */
export declare const ECONOMIC_CYCLE_REGIME_RULES: RegimeChange[];
/**
 * Conservative time-based configuration
 * Lower volatility, slower regime changes
 */
export declare const CONSERVATIVE_TIME_CONFIG: TimeBasedScenarioConfig;
/**
 * Dynamic time-based configuration
 * Full parameter drift and regime changes
 */
export declare const DYNAMIC_TIME_CONFIG: TimeBasedScenarioConfig;
/**
 * Stress testing configuration
 * Higher volatility, more frequent regime changes
 */
export declare const STRESS_TEST_TIME_CONFIG: TimeBasedScenarioConfig;
/**
 * Get configuration by risk profile
 */
export declare function getTimeBasedConfigByProfile(profile: 'conservative' | 'dynamic' | 'stress-test'): TimeBasedScenarioConfig;
//# sourceMappingURL=timeBasedScenarioConfig.d.ts.map