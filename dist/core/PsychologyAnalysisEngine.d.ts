/**
 * Psychology-Based Analysis Engine
 *
 * Implements advanced behavioral economics principles including prospect theory,
 * psychological profiling, and decision pattern analysis for financial behavior.
 * Based on research from Kahneman, Tversky, Ariely, and Thaler.
 */
import { CognitiveBiasType, BiasDetectionResult, PsychologyProfile, BehaviorPattern, UserFinancialData, UserBehaviorData, BiasAssessmentResponse } from '../types';
export declare class PsychologyAnalysisEngine {
    private prospectTheoryParams;
    constructor();
    /**
     * Generate comprehensive psychology profile
     */
    generatePsychologyProfile(financialData: UserFinancialData, behaviorData: UserBehaviorData, biasResults: BiasDetectionResult[]): PsychologyProfile;
    /**
     * Analyze behavioral patterns using psychological frameworks
     */
    analyzeBehaviorPatterns(financialData: UserFinancialData, behaviorData: UserBehaviorData, biasResults: BiasDetectionResult[]): BehaviorPattern[];
    /**
     * Conduct prospect theory analysis on financial decisions
     */
    conductProspectTheoryAnalysis(decisions: Array<{
        scenario: string;
        options: Array<{
            description: string;
            expectedValue: number;
            probability: number;
        }>;
        userChoice: number;
    }>): Array<{
        scenario: string;
        prospectValues: number[];
        optimalChoice: number;
        userChoice: number;
        rationalityScore: number;
        biasInfluence: string[];
    }>;
    /**
     * Analyze decision-making consistency across contexts
     */
    analyzeDecisionConsistency(financialData: UserFinancialData, behaviorData: UserBehaviorData, assessmentResponses: BiasAssessmentResponse[]): {
        consistencyScore: number;
        inconsistencies: string[];
        riskContexts: Array<{
            context: string;
            riskLevel: number;
            consistency: number;
        }>;
        recommendations: string[];
    };
    /**
     * Generate psychological intervention strategies
     */
    generateInterventionStrategies(psychologyProfile: PsychologyProfile, behaviorPatterns: BehaviorPattern[], biasResults: BiasDetectionResult[]): Array<{
        intervention: string;
        targetBiases: CognitiveBiasType[];
        technique: string;
        timing: 'immediate' | 'gradual' | 'situational';
        effectiveness: number;
        personalizedApproach: string;
    }>;
    private identifyDominantBiases;
    private assessRiskTolerance;
    private analyzeDecisionMakingStyle;
    private categorizeEmotionalMoneyType;
    private assessTimeOrientation;
    private generateFinancialPersonality;
    private analyzeTradingPatterns;
    private analyzeRiskPatterns;
    private analyzePlanningPatterns;
    private analyzeInformationPatterns;
    private analyzeSpendingSavingPatterns;
    private calculateProspectValue;
    private calculateRationalityScore;
    private identifyBiasInfluence;
    private analyzeRiskAcrossContexts;
    private detectFramingInconsistencies;
    private detectTimeInconsistencies;
    private calculateOverallConsistency;
    private generateConsistencyRecommendations;
    private generateCognitiveInterventions;
    private generateBehavioralInterventions;
    private generateEnvironmentalInterventions;
    private generateSocialInterventions;
    private initializeProspectTheory;
    private calculateMonthlyExpenses;
    private calculateSavingsRate;
    private calculateCashPercentage;
    private calculateInsuranceRiskLevel;
    private groupFramingResponses;
}
//# sourceMappingURL=PsychologyAnalysisEngine.d.ts.map