/**
 * Cognitive Bias Detection Engine
 *
 * Implements state-of-the-art behavioral finance algorithms to detect
 * and quantify cognitive biases in financial decision-making.
 * Based on research from Kahneman, Tversky, Thaler, and others.
 */
import { BiasDetectionResult, UserFinancialData, UserBehaviorData, BiasAssessmentResponse, BehavioralMetrics } from '../types';
export declare class BiasDetectionEngine {
    private populationBenchmarks;
    constructor();
    /**
     * Comprehensive bias detection using multiple data sources
     */
    detectBiases(financialData: UserFinancialData, behaviorData: UserBehaviorData, assessmentResponses: BiasAssessmentResponse[]): BiasDetectionResult[];
    /**
     * Calculate comprehensive behavioral metrics
     */
    calculateBehavioralMetrics(financialData: UserFinancialData, behaviorData: UserBehaviorData, biasResults: BiasDetectionResult[]): BehavioralMetrics;
    /**
     * Detect overconfidence bias
     */
    private detectOverconfidence;
    /**
     * Detect loss aversion bias
     */
    private detectLossAversion;
    /**
     * Detect confirmation bias
     */
    private detectConfirmationBias;
    /**
     * Detect anchoring bias
     */
    private detectAnchoring;
    /**
     * Detect availability heuristic bias
     */
    private detectAvailabilityHeuristic;
    /**
     * Detect mental accounting bias
     */
    private detectMentalAccounting;
    /**
     * Detect herd mentality bias
     */
    private detectHerdMentality;
    /**
     * Detect recency bias
     */
    private detectRecencyBias;
    /**
     * Detect sunk cost fallacy
     */
    private detectSunkCostFallacy;
    /**
     * Detect framing effect bias
     */
    private detectFramingEffect;
    private initializePopulationBenchmarks;
    private calculateNetWorth;
    private calculateMonthlyExpenses;
    private calculateTotalInvestments;
    private calculateResponseVariability;
    private calculateRationalityIndex;
    private calculateBiasResistanceScore;
    private calculateEmotionalVolatility;
    private calculateDecisionConsistency;
    private calculateRiskPerceptionAccuracy;
    private calculateOverconfidenceLevel;
}
//# sourceMappingURL=BiasDetectionEngine.d.ts.map