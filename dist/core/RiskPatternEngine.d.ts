import { UserFinancialData, UserBehaviorData, BiasDetectionResult, MarketDataPoint, EconomicScenario } from '../types';
import { TrendPrediction } from './FinancialTrendEngine';
/**
 * Risk pattern detected by the system
 */
export interface RiskPattern {
    id: string;
    category: 'behavioral' | 'financial' | 'market' | 'systemic';
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    description: string;
    indicators: string[];
    potentialImpact: string;
    mitigationSuggestions: string[];
    timeframe: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
    triggerThreshold: number;
    currentScore: number;
    historicalContext?: string;
}
/**
 * Opportunity pattern detected by the system
 */
export interface OpportunityPattern {
    id: string;
    category: 'investment' | 'savings' | 'career' | 'financial-planning';
    type: string;
    potential: 'low' | 'medium' | 'high' | 'exceptional';
    confidence: number;
    description: string;
    requirements: string[];
    expectedBenefit: string;
    actionSteps: string[];
    timeframe: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
    currentScore: number;
    marketAlignment?: number;
}
/**
 * Risk assessment result
 */
export interface RiskAssessment {
    overallRiskScore: number;
    riskCategory: 'conservative' | 'moderate' | 'aggressive' | 'speculative';
    patterns: RiskPattern[];
    opportunities: OpportunityPattern[];
    recommendations: string[];
    nextReviewDate: Date;
    emergencyFlags: string[];
}
/**
 * Pattern learning configuration
 */
export interface PatternLearningConfig {
    adaptiveLearning: boolean;
    sensitivityLevel: 'low' | 'medium' | 'high';
    historicalWeight: number;
    marketSensitivity: number;
    behaviorWeight: number;
    updateFrequency: 'daily' | 'weekly' | 'monthly';
}
/**
 * Risk Pattern Recognition Engine
 * Advanced system for identifying financial risks and opportunities
 */
export declare class RiskPatternEngine {
    private config;
    private _knownPatterns;
    private _opportunityPatterns;
    private patternHistory;
    constructor(config?: Partial<PatternLearningConfig>);
    /**
     * Perform comprehensive risk and opportunity analysis
     */
    analyzeRiskPatterns(financialData: UserFinancialData, behaviorData: UserBehaviorData, biasResults: BiasDetectionResult[], trendPredictions?: TrendPrediction[], marketData?: MarketDataPoint[], economicScenarios?: EconomicScenario[]): RiskAssessment;
    /**
     * Detect behavioral risk patterns
     */
    private detectBehavioralRisks;
    /**
     * Detect financial risk patterns
     */
    private detectFinancialRisks;
    /**
     * Detect market-related risks
     */
    private detectMarketRisks;
    /**
     * Detect systemic risks
     */
    private detectSystemicRisks;
    /**
     * Detect investment opportunities
     */
    private detectInvestmentOpportunities;
    /**
     * Detect savings opportunities
     */
    private detectSavingsOpportunities;
    /**
     * Detect career opportunities
     */
    private detectCareerOpportunities;
    /**
     * Detect financial planning opportunities
     */
    private detectPlanningOpportunities;
    private calculateMonthlyIncome;
    private calculateMonthlyExpenses;
    private calculateTotalInvestments;
    private calculateTotalAssets;
    private calculateReturns;
    private calculateVolatility;
    private calculateTrendDirection;
    private calculateOverallRiskScore;
    private determineRiskCategory;
    private generateRecommendations;
    private identifyEmergencyFlags;
    private calculateNextReviewDate;
    private updatePatternHistory;
    private initializeKnownPatterns;
    private initializeOpportunityPatterns;
}
//# sourceMappingURL=RiskPatternEngine.d.ts.map