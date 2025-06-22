/**
 * Behavioral Insights Dashboard Component
 * Displays comprehensive behavioral analysis and tracking results
 */
import { BehavioralMetrics, BehaviorPattern } from '../../types.js';
import { BehaviorTracker, BehaviorTrend } from '../forms/BehaviorTracker.js';
export interface DashboardConfig {
    showTrends: boolean;
    showPatterns: boolean;
    showRecommendations: boolean;
    showProgress: boolean;
    timeframe: 'week' | 'month' | 'quarter' | 'year';
}
export declare class BehaviorDashboard {
    private container;
    private behaviorTracker;
    private config;
    constructor(container: HTMLElement, behaviorTracker: BehaviorTracker, config?: Partial<DashboardConfig>);
    /**
     * Render the complete behavioral dashboard
     */
    render(): void;
    /**
     * Update dashboard with new data
     */
    update(): void;
    /**
     * Export dashboard data
     */
    exportData(): {
        metrics: BehavioralMetrics;
        trends: BehaviorTrend[];
        patterns: BehaviorPattern[];
        recommendations: any;
        timestamp: string;
    };
    private initializeDashboard;
    private renderMetricsOverview;
    private renderMetricCard;
    private renderProgressSection;
    private renderTrendsSection;
    private renderPatternsSection;
    private renderRecommendationsSection;
    private renderCharts;
    private renderProgressChart;
    private renderTrendSparklines;
    private attachEventListeners;
    private getScoreStatus;
    private getStatusColor;
    private formatMetricName;
    private addDashboardStyles;
}
//# sourceMappingURL=BehaviorDashboard.d.ts.map