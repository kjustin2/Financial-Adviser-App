/**
 * Behavioral Pattern Tracker Component
 * Tracks user behavior over time and identifies patterns for analysis
 */
import { UserBehaviorData, BehavioralMetrics, DecisionAnalysis, BehaviorPattern, CognitiveBiasType } from '../../types.js';
export interface BehaviorTrackingSession {
    id: string;
    timestamp: Date;
    behaviorData: UserBehaviorData;
    metrics: BehavioralMetrics;
    decisions: DecisionAnalysis[];
    sessionDuration: number;
    context: string;
}
export interface BehaviorTrend {
    metric: keyof BehavioralMetrics;
    values: number[];
    dates: Date[];
    trend: 'improving' | 'declining' | 'stable';
    changeRate: number;
}
export declare class BehaviorTracker {
    private trackingHistory;
    private patterns;
    private trends;
    private sessionStartTime;
    private currentSession;
    constructor();
    /**
     * Start a new behavior tracking session
     */
    startSession(context?: string): string;
    /**
     * End the current tracking session and save data
     */
    endSession(): BehaviorTrackingSession | null;
    /**
     * Log a financial decision for analysis
     */
    logDecision(scenario: string, userChoice: string, optimalChoice: string, biasInfluences?: Array<{
        biasType: CognitiveBiasType;
        impact: number;
        explanation: string;
    }>): void;
    /**
     * Track a specific behavioral action
     */
    trackAction(actionType: 'research' | 'impulsive-purchase' | 'budget-check' | 'risk-assessment' | 'goal-review', details?: Record<string, any>): void;
    /**
     * Get current behavioral metrics
     */
    getCurrentMetrics(): BehavioralMetrics;
    /**
     * Get behavioral trends over time
     */
    getBehaviorTrends(): BehaviorTrend[];
    /**
     * Get identified behavioral patterns
     */
    getBehaviorPatterns(): BehaviorPattern[];
    /**
     * Get tracking history
     */
    getTrackingHistory(limit?: number): BehaviorTrackingSession[];
    /**
     * Get progress tracking data for visualization
     */
    getProgressData(): {
        dates: string[];
        scores: number[];
        milestones: Array<{
            date: string;
            achievement: string;
            impact: number;
        }>;
    };
    /**
     * Generate behavior improvement recommendations
     */
    generateRecommendations(): {
        immediate: string[];
        shortTerm: string[];
        longTerm: string[];
    };
    private calculateCurrentMetrics;
    private getCurrentBehaviorData;
    private calculateRationalityScore;
    private generateImprovementSuggestions;
    private updateTrends;
    private calculateTrend;
    private calculateChangeRate;
    private identifyPatterns;
    private hasConsistentImprovement;
    private hasHighDecisionVolatility;
    private identifyMilestones;
    private generateImmediateRecommendations;
    private generateShortTermRecommendations;
    private generateLongTermRecommendations;
    private analyzeActionForPatterns;
    private generateSessionId;
    private getDefaultMetrics;
    private average;
    private calculateStandardDeviation;
    private initializeTracking;
    private setupPeriodicMetricsCollection;
    private loadTrackingHistory;
    private saveTrackingHistory;
}
//# sourceMappingURL=BehaviorTracker.d.ts.map