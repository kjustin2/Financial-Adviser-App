import { EconomicScenario } from '../types';
/**
 * Predefined Economic Scenarios for Monte Carlo Testing
 * Based on historical events and economic research
 */
export declare const ECONOMIC_SCENARIOS: EconomicScenario[];
/**
 * Get scenario by ID
 */
export declare function getScenarioById(id: string): EconomicScenario | undefined;
/**
 * Get scenarios by category
 */
export declare function getScenariosByCategory(category: EconomicScenario['category']): EconomicScenario[];
/**
 * Get baseline scenario (normal growth)
 */
export declare function getBaselineScenario(): EconomicScenario;
/**
 * Get scenarios for stress testing (worst-case scenarios)
 */
export declare function getStressTestScenarios(): EconomicScenario[];
//# sourceMappingURL=economicScenarios.d.ts.map