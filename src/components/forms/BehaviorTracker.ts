/**
 * Behavioral Pattern Tracker Component
 * Tracks user behavior over time and identifies patterns for analysis
 */

import { 
    UserBehaviorData, 
    BehavioralMetrics, 
    DecisionAnalysis, 
    BehaviorPattern,
    CognitiveBiasType
} from '../../types.js';

export interface BehaviorTrackingSession {
    id: string;
    timestamp: Date;
    behaviorData: UserBehaviorData;
    metrics: BehavioralMetrics;
    decisions: DecisionAnalysis[];
    sessionDuration: number; // minutes
    context: string;
}

export interface BehaviorTrend {
    metric: keyof BehavioralMetrics;
    values: number[];
    dates: Date[];
    trend: 'improving' | 'declining' | 'stable';
    changeRate: number; // % change per month
}

export class BehaviorTracker {
    private trackingHistory: BehaviorTrackingSession[] = [];
    private patterns: BehaviorPattern[] = [];
    private trends: Map<keyof BehavioralMetrics, BehaviorTrend> = new Map();
    private sessionStartTime: Date | null = null;
    private currentSession: Partial<BehaviorTrackingSession> = {};

    constructor() {
        this.loadTrackingHistory();
        this.initializeTracking();
    }

    /**
     * Start a new behavior tracking session
     */
    public startSession(context: string = 'general'): string {
        const sessionId = this.generateSessionId();
        this.sessionStartTime = new Date();
        
        this.currentSession = {
            id: sessionId,
            timestamp: this.sessionStartTime,
            context,
            decisions: [],
            sessionDuration: 0
        };

        return sessionId;
    }

    /**
     * End the current tracking session and save data
     */
    public endSession(): BehaviorTrackingSession | null {
        if (!this.sessionStartTime || !this.currentSession.id) {
            console.warn('No active session to end');
            return null;
        }

        const endTime = new Date();
        const duration = Math.round((endTime.getTime() - this.sessionStartTime.getTime()) / (1000 * 60));

        const session: BehaviorTrackingSession = {
            id: this.currentSession.id,
            timestamp: this.sessionStartTime,
            behaviorData: this.getCurrentBehaviorData(),
            metrics: this.calculateCurrentMetrics(),
            decisions: this.currentSession.decisions || [],
            sessionDuration: duration,
            context: this.currentSession.context || 'general'
        };

        this.trackingHistory.push(session);
        this.updateTrends();
        this.identifyPatterns();
        this.saveTrackingHistory();

        // Reset session
        this.sessionStartTime = null;
        this.currentSession = {};

        return session;
    }

    /**
     * Log a financial decision for analysis
     */
    public logDecision(
        scenario: string,
        userChoice: string,
        optimalChoice: string,
        biasInfluences: Array<{
            biasType: CognitiveBiasType;
            impact: number;
            explanation: string;
        }> = []
    ): void {
        if (!this.currentSession.id) {
            console.warn('No active session. Starting new session...');
            this.startSession();
        }

        const rationalityScore = this.calculateRationalityScore(userChoice, optimalChoice, biasInfluences);
        
        const decision: DecisionAnalysis = {
            scenario,
            userChoice,
            optimalChoice,
            biasInfluence: biasInfluences,
            rationalityScore,
            improvementSuggestions: this.generateImprovementSuggestions(biasInfluences, rationalityScore)
        };

        if (!this.currentSession.decisions) {
            this.currentSession.decisions = [];
        }
        this.currentSession.decisions.push(decision);
    }

    /**
     * Track a specific behavioral action
     */
    public trackAction(
        actionType: 'research' | 'impulsive-purchase' | 'budget-check' | 'risk-assessment' | 'goal-review',
        details: Record<string, any> = {}
    ): void {
        const timestamp = new Date();
        
        // Store action for pattern recognition
        const actionData = {
            type: actionType,
            timestamp,
            details,
            sessionId: this.currentSession.id
        };

        // Analyze action for immediate patterns
        this.analyzeActionForPatterns(actionData);
    }

    /**
     * Get current behavioral metrics
     */
    public getCurrentMetrics(): BehavioralMetrics {
        return this.calculateCurrentMetrics();
    }

    /**
     * Get behavioral trends over time
     */
    public getBehaviorTrends(): BehaviorTrend[] {
        return Array.from(this.trends.values());
    }

    /**
     * Get identified behavioral patterns
     */
    public getBehaviorPatterns(): BehaviorPattern[] {
        return this.patterns;
    }

    /**
     * Get tracking history
     */
    public getTrackingHistory(limit?: number): BehaviorTrackingSession[] {
        const history = [...this.trackingHistory].reverse();
        return limit ? history.slice(0, limit) : history;
    }

    /**
     * Get progress tracking data for visualization
     */
    public getProgressData(): {
        dates: string[];
        scores: number[];
        milestones: Array<{ date: string; achievement: string; impact: number }>;
    } {
        const sessions = this.getTrackingHistory();
        const dates = sessions.map(s => s.timestamp.toISOString().split('T')[0]);
        const scores = sessions.map(s => s.metrics.rationalityIndex);
        
        const milestones = this.identifyMilestones(sessions);

        return { dates, scores, milestones };
    }

    /**
     * Generate behavior improvement recommendations
     */
    public generateRecommendations(): {
        immediate: string[];
        shortTerm: string[];
        longTerm: string[];
    } {
        const recentMetrics = this.getCurrentMetrics();
        const trends = this.getBehaviorTrends();
        const patterns = this.getBehaviorPatterns();

        return {
            immediate: this.generateImmediateRecommendations(recentMetrics, patterns),
            shortTerm: this.generateShortTermRecommendations(trends, patterns),
            longTerm: this.generateLongTermRecommendations(trends)
        };
    }

    // Private Methods

    private calculateCurrentMetrics(): BehavioralMetrics {
        const recentSessions = this.getTrackingHistory(5);
        
        if (recentSessions.length === 0) {
            return this.getDefaultMetrics();
        }

        // Calculate averages from recent sessions
        const avgRationality = this.average(recentSessions.map(s => s.metrics?.rationalityIndex || 50));
        const avgBiasResistance = this.average(recentSessions.map(s => s.metrics?.biasResistanceScore || 50));
        const avgEmotionalVolatility = this.average(recentSessions.map(s => s.metrics?.emotionalVolatility || 50));
        const avgDecisionConsistency = this.average(recentSessions.map(s => s.metrics?.decisionConsistency || 50));
        const avgRiskAccuracy = this.average(recentSessions.map(s => s.metrics?.riskPerceptionAccuracy || 50));
        const avgOverconfidence = this.average(recentSessions.map(s => s.metrics?.overconfidenceLevel || 50));

        return {
            rationalityIndex: Math.round(avgRationality),
            biasResistanceScore: Math.round(avgBiasResistance),
            emotionalVolatility: Math.round(avgEmotionalVolatility),
            decisionConsistency: Math.round(avgDecisionConsistency),
            riskPerceptionAccuracy: Math.round(avgRiskAccuracy),
            overconfidenceLevel: Math.round(avgOverconfidence)
        };
    }

    private getCurrentBehaviorData(): UserBehaviorData {
        // This would typically be collected from user interactions
        // For now, return default data structure
        return {
            tradingPatterns: {
                frequency: 'monthly',
                portfolioTurnover: 0.3,
                marketTimingAttempts: 2,
                diversificationLevel: 0.7
            },
            informationSeeking: {
                sourcesUsed: ['financial-news', 'expert-analysis'],
                frequencyOfResearch: 3,
                newsReactionTime: 24,
                expertAdviceReliance: 0.6
            },
            riskBehavior: {
                actualRiskTolerance: 0.6,
                statedRiskTolerance: 0.7,
                riskDiscrepancy: 0.1,
                panicSellingHistory: false,
                fomoBuyingHistory: true
            },
            planningBehavior: {
                budgetingConsistency: 0.8,
                goalSettingClarity: 0.7,
                longTermThinking: 0.6,
                impulsiveDecisions: 0.3
            }
        };
    }

    private calculateRationalityScore(
        userChoice: string,
        optimalChoice: string,
        biasInfluences: Array<{ impact: number }>
    ): number {
        let baseScore = userChoice === optimalChoice ? 100 : 60;
        
        // Reduce score based on bias influences
        const totalBiasImpact = biasInfluences.reduce((sum, bias) => sum + Math.abs(bias.impact), 0);
        const biasDeduction = Math.min(40, totalBiasImpact * 20);
        
        return Math.max(0, Math.round(baseScore - biasDeduction));
    }

    private generateImprovementSuggestions(
        biasInfluences: Array<{ biasType: CognitiveBiasType; impact: number }>,
        rationalityScore: number
    ): string[] {
        const suggestions: string[] = [];

        if (rationalityScore < 70) {
            suggestions.push('Take more time to analyze options before making decisions');
            suggestions.push('Consider seeking a second opinion on important financial choices');
        }

        biasInfluences.forEach(bias => {
            if (Math.abs(bias.impact) > 0.3) {
                switch (bias.biasType) {
                    case 'overconfidence':
                        suggestions.push('Practice humility by seeking diverse perspectives');
                        break;
                    case 'loss-aversion':
                        suggestions.push('Focus on long-term gains rather than short-term losses');
                        break;
                    case 'confirmation-bias':
                        suggestions.push('Actively seek information that challenges your assumptions');
                        break;
                    // Add more bias-specific suggestions
                }
            }
        });

        return suggestions;
    }

    private updateTrends(): void {
        const metrics: (keyof BehavioralMetrics)[] = [
            'rationalityIndex',
            'biasResistanceScore',
            'emotionalVolatility',
            'decisionConsistency',
            'riskPerceptionAccuracy',
            'overconfidenceLevel'
        ];

        metrics.forEach(metric => {
            const values = this.trackingHistory.map(session => session.metrics[metric]);
            const dates = this.trackingHistory.map(session => session.timestamp);
            
            if (values.length >= 2) {
                const trend = this.calculateTrend(values);
                const changeRate = this.calculateChangeRate(values);
                
                this.trends.set(metric, {
                    metric,
                    values,
                    dates,
                    trend,
                    changeRate
                });
            }
        });
    }

    private calculateTrend(values: number[]): 'improving' | 'declining' | 'stable' {
        if (values.length < 2) return 'stable';
        
        const recent = values.slice(-3);
        const older = values.slice(-6, -3);
        
        if (older.length === 0) return 'stable';
        
        const recentAvg = this.average(recent);
        const olderAvg = this.average(older);
        const difference = recentAvg - olderAvg;
        
        if (Math.abs(difference) < 2) return 'stable';
        return difference > 0 ? 'improving' : 'declining';
    }

    private calculateChangeRate(values: number[]): number {
        if (values.length < 2) return 0;
        
        const firstValue = values[0];
        const lastValue = values[values.length - 1];
        const monthsElapsed = values.length; // Assuming one data point per month
        
        return ((lastValue - firstValue) / firstValue) * 100 / monthsElapsed;
    }

    private identifyPatterns(): void {
        // Analyze recent sessions for behavioral patterns
        const recentSessions = this.getTrackingHistory(10);
        
        // Reset patterns for fresh analysis
        this.patterns = [];

        // Pattern: Consistent improvement
        if (this.hasConsistentImprovement(recentSessions)) {
            this.patterns.push({
                pattern: 'Consistent Learning',
                frequency: 'frequent',
                intensity: 7,
                triggers: ['education', 'feedback'],
                outcomes: ['improved decisions', 'better metrics'],
                relatedBiases: []
            });
        }

        // Pattern: Decision volatility
        if (this.hasHighDecisionVolatility(recentSessions)) {
            this.patterns.push({
                pattern: 'Inconsistent Decision Making',
                frequency: 'occasional',
                intensity: 6,
                triggers: ['market volatility', 'emotional stress'],
                outcomes: ['poor performance', 'regret'],
                relatedBiases: ['overconfidence', 'recency-bias']
            });
        }

        // Add more pattern detection logic
    }

    private hasConsistentImprovement(sessions: BehaviorTrackingSession[]): boolean {
        if (sessions.length < 3) return false;
        
        const scores = sessions.map(s => s.metrics.rationalityIndex);
        let improvementCount = 0;
        
        for (let i = 1; i < scores.length; i++) {
            if (scores[i] > scores[i - 1]) {
                improvementCount++;
            }
        }
        
        return improvementCount >= Math.floor(scores.length * 0.7);
    }

    private hasHighDecisionVolatility(sessions: BehaviorTrackingSession[]): boolean {
        if (sessions.length < 3) return false;
        
        const scores = sessions.map(s => s.metrics.rationalityIndex);
        const standardDeviation = this.calculateStandardDeviation(scores);
        
        return standardDeviation > 15; // High volatility threshold
    }

    private identifyMilestones(sessions: BehaviorTrackingSession[]): Array<{
        date: string;
        achievement: string;
        impact: number;
    }> {
        const milestones: Array<{ date: string; achievement: string; impact: number }> = [];

        // Milestone: First time reaching high rationality
        const highRationalitySession = sessions.find(s => s.metrics.rationalityIndex >= 80);
        if (highRationalitySession) {
            milestones.push({
                date: highRationalitySession.timestamp.toISOString().split('T')[0],
                achievement: 'High Rationality Achieved',
                impact: 8
            });
        }

        // Milestone: Bias resistance improvement
        const improvementSessions = sessions.filter(s => s.metrics.biasResistanceScore >= 75);
        if (improvementSessions.length >= 3) {
            milestones.push({
                date: improvementSessions[2].timestamp.toISOString().split('T')[0],
                achievement: 'Consistent Bias Resistance',
                impact: 7
            });
        }

        return milestones;
    }

    private generateImmediateRecommendations(
        metrics: BehavioralMetrics,
        patterns: BehaviorPattern[]
    ): string[] {
        const recommendations: string[] = [];

        if (metrics.rationalityIndex < 60) {
            recommendations.push('Pause before making any major financial decisions today');
            recommendations.push('Review your decision-making checklist');
        }

        if (metrics.emotionalVolatility > 70) {
            recommendations.push('Take a break from financial markets or news');
            recommendations.push('Practice mindfulness or relaxation techniques');
        }

        const problematicPatterns = patterns.filter(p => p.intensity >= 6);
        problematicPatterns.forEach(pattern => {
            recommendations.push(`Address your "${pattern.pattern}" pattern with specific interventions`);
        });

        return recommendations;
    }

    private generateShortTermRecommendations(
        trends: BehaviorTrend[],
        patterns: BehaviorPattern[]
    ): string[] {
        const recommendations: string[] = [];

        const decliningTrends = trends.filter(t => t.trend === 'declining');
        decliningTrends.forEach(trend => {
            recommendations.push(`Focus on improving your ${trend.metric} over the next month`);
        });

        const frequentPatterns = patterns.filter(p => p.frequency === 'frequent' || p.frequency === 'habitual');
        frequentPatterns.forEach(pattern => {
            recommendations.push(`Work on breaking the "${pattern.pattern}" habit through consistent practice`);
        });

        return recommendations;
    }

    private generateLongTermRecommendations(trends: BehaviorTrend[]): string[] {
        const recommendations: string[] = [];

        const stableTrends = trends.filter(t => t.trend === 'stable');
        if (stableTrends.length > 0) {
            recommendations.push('Set new behavioral goals to continue improving beyond current plateaus');
        }

        recommendations.push('Develop a personal financial decision-making framework');
        recommendations.push('Consider working with a behavioral finance coach for advanced improvement');

        return recommendations;
    }

    private analyzeActionForPatterns(actionData: any): void {
        // Real-time pattern analysis would go here
        // For now, just log the action
        console.log('Action tracked:', actionData);
    }

    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private getDefaultMetrics(): BehavioralMetrics {
        return {
            rationalityIndex: 50,
            biasResistanceScore: 50,
            emotionalVolatility: 50,
            decisionConsistency: 50,
            riskPerceptionAccuracy: 50,
            overconfidenceLevel: 50
        };
    }

    private average(numbers: number[]): number {
        return numbers.length > 0 ? numbers.reduce((sum, n) => sum + n, 0) / numbers.length : 0;
    }

    private calculateStandardDeviation(numbers: number[]): number {
        const mean = this.average(numbers);
        const squaredDifferences = numbers.map(n => Math.pow(n - mean, 2));
        const avgSquaredDiff = this.average(squaredDifferences);
        return Math.sqrt(avgSquaredDiff);
    }

    private initializeTracking(): void {
        this.setupPeriodicMetricsCollection();
    }

    private setupPeriodicMetricsCollection(): void {
        console.log('Behavior tracking initialized');
    }

    private loadTrackingHistory(): void {
        try {
            const stored = localStorage.getItem('behaviorTrackingHistory');
            if (stored) {
                const parsed = JSON.parse(stored);
                this.trackingHistory = parsed.map((session: any) => ({
                    ...session,
                    timestamp: new Date(session.timestamp)
                }));
            }
        } catch (error) {
            console.warn('Failed to load tracking history:', error);
            this.trackingHistory = [];
        }
    }

    private saveTrackingHistory(): void {
        try {
            localStorage.setItem('behaviorTrackingHistory', JSON.stringify(this.trackingHistory));
        } catch (error) {
            console.warn('Failed to save tracking history:', error);
        }
    }
} 