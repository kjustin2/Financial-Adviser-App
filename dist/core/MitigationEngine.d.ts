/**
 * MitigationEngine.ts
 *
 * Comprehensive bias mitigation and strategy recommendation engine
 * Provides personalized advice for overcoming cognitive biases in financial decision-making
 *
 * Built on research from:
 * - Kahneman & Tversky (Prospect Theory)
 * - Richard Thaler (Behavioral Economics)
 * - Ariely (Predictably Irrational)
 * - Heath & Heath (Made to Stick)
 */
import { UserFinancialData, UserBehaviorData, BiasDetectionResult, CognitiveBiasType, BiasAssessmentResponse, EnhancedMitigationStrategy, MitigationPlan } from '../types';
export declare class MitigationEngine {
    private psychologyEngine;
    private strategyDatabase;
    constructor();
    /**
     * Generate a comprehensive mitigation plan for identified biases
     */
    generateMitigationPlan(financialData: UserFinancialData, behaviorData: UserBehaviorData, biasResults: BiasDetectionResult[], _assessmentResponses: BiasAssessmentResponse[]): MitigationPlan;
    /**
     * Generate quick mitigation advice for a specific bias
     */
    getQuickMitigationAdvice(biasType: CognitiveBiasType): EnhancedMitigationStrategy | null;
    /**
     * Update mitigation plan based on progress and new data
     */
    updateMitigationProgress(currentPlan: MitigationPlan, progressData: {
        completedStrategies: string[];
        biasReassessment: BiasDetectionResult[];
        behaviorChanges: Partial<UserBehaviorData>;
    }): MitigationPlan;
    /**
     * Generate bias-specific mitigation techniques
     */
    generateBiasSpecificTechniques(biasType: CognitiveBiasType): string[];
    private initializeStrategyDatabase;
    private assessOverallRiskLevel;
    private identifyPriorityBiases;
    private generatePersonalizedStrategies;
    private personalizeStrategy;
    private createImplementationTimeline;
    private generateTrackingRecommendations;
    private defineExpectedOutcomes;
    private identifyImprovementAreas;
    private updateStrategyEffectiveness;
    private adjustTimeline;
}
//# sourceMappingURL=MitigationEngine.d.ts.map