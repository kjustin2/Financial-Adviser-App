/**
 * Behavioral Insights Dashboard Component
 * Displays comprehensive behavioral analysis and tracking results
 */

import { 
    BehavioralMetrics, 
    BehaviorPattern
} from '../../types.js';
import { BehaviorTracker, BehaviorTrend } from '../forms/BehaviorTracker.js';

export interface DashboardConfig {
    showTrends: boolean;
    showPatterns: boolean;
    showRecommendations: boolean;
    showProgress: boolean;
    timeframe: 'week' | 'month' | 'quarter' | 'year';
}

export class BehaviorDashboard {
    private container: HTMLElement;
    private behaviorTracker: BehaviorTracker;
    private config: DashboardConfig;

    constructor(container: HTMLElement, behaviorTracker: BehaviorTracker, config?: Partial<DashboardConfig>) {
        this.container = container;
        this.behaviorTracker = behaviorTracker;
        this.config = {
            showTrends: true,
            showPatterns: true,
            showRecommendations: true,
            showProgress: true,
            timeframe: 'month',
            ...config
        };

        this.initializeDashboard();
    }

    /**
     * Render the complete behavioral dashboard
     */
    public render(): void {
        this.container.innerHTML = '';
        this.container.className = 'behavior-dashboard';

        // Create dashboard structure
        const dashboardHTML = `
            <div class="dashboard-header">
                <h2>Behavioral Finance Analysis</h2>
                <div class="dashboard-controls">
                    <select id="timeframe-select" class="timeframe-selector">
                        <option value="week">Last Week</option>
                        <option value="month" selected>Last Month</option>
                        <option value="quarter">Last Quarter</option>
                        <option value="year">Last Year</option>
                    </select>
                    <button id="refresh-data" class="refresh-btn">Refresh</button>
                </div>
            </div>

            <div class="dashboard-content">
                <div class="metrics-overview" id="metrics-overview">
                    ${this.renderMetricsOverview()}
                </div>

                ${this.config.showProgress ? `
                    <div class="progress-section" id="progress-section">
                        ${this.renderProgressSection()}
                    </div>
                ` : ''}

                ${this.config.showTrends ? `
                    <div class="trends-section" id="trends-section">
                        ${this.renderTrendsSection()}
                    </div>
                ` : ''}

                ${this.config.showPatterns ? `
                    <div class="patterns-section" id="patterns-section">
                        ${this.renderPatternsSection()}
                    </div>
                ` : ''}

                ${this.config.showRecommendations ? `
                    <div class="recommendations-section" id="recommendations-section">
                        ${this.renderRecommendationsSection()}
                    </div>
                ` : ''}
            </div>
        `;

        this.container.innerHTML = dashboardHTML;
        this.attachEventListeners();
        this.renderCharts();
    }

    /**
     * Update dashboard with new data
     */
    public update(): void {
        this.render();
    }

    /**
     * Export dashboard data
     */
    public exportData(): {
        metrics: BehavioralMetrics;
        trends: BehaviorTrend[];
        patterns: BehaviorPattern[];
        recommendations: any;
        timestamp: string;
    } {
        return {
            metrics: this.behaviorTracker.getCurrentMetrics(),
            trends: this.behaviorTracker.getBehaviorTrends(),
            patterns: this.behaviorTracker.getBehaviorPatterns(),
            recommendations: this.behaviorTracker.generateRecommendations(),
            timestamp: new Date().toISOString()
        };
    }

    // Private Methods

    private initializeDashboard(): void {
        // Add dashboard-specific styles
        this.addDashboardStyles();
    }

    private renderMetricsOverview(): string {
        const metrics = this.behaviorTracker.getCurrentMetrics();
        
        return `
            <h3>Current Behavioral Metrics</h3>
            <div class="metrics-grid">
                ${this.renderMetricCard('Rationality Index', metrics.rationalityIndex, 'Higher scores indicate more rational decision-making')}
                ${this.renderMetricCard('Bias Resistance', metrics.biasResistanceScore, 'Ability to resist cognitive biases')}
                ${this.renderMetricCard('Emotional Stability', 100 - metrics.emotionalVolatility, 'Lower volatility indicates better emotional control')}
                ${this.renderMetricCard('Decision Consistency', metrics.decisionConsistency, 'Consistency in decision-making patterns')}
                ${this.renderMetricCard('Risk Perception', metrics.riskPerceptionAccuracy, 'Accuracy in assessing financial risks')}
                ${this.renderMetricCard('Confidence Level', 100 - metrics.overconfidenceLevel, 'Balanced confidence without overconfidence')}
            </div>
        `;
    }

    private renderMetricCard(title: string, score: number, description: string): string {
        // Defensive: Prevent $NaN or undefined in displayed values
        const displayScore = typeof score === 'number' && !isNaN(score) && score >= 0 ? score : 0;
        const status = this.getScoreStatus(displayScore);
        const color = this.getStatusColor(status);
        
        return `
            <div class="metric-card ${status}">
                <div class="metric-header">
                    <h4>${title}</h4>
                    <span class="metric-score" style="color: ${color}">${displayScore}</span>
                </div>
                <div class="metric-bar">
                    <div class="metric-fill" style="width: ${displayScore}%; background-color: ${color}"></div>
                </div>
                <p class="metric-description">${description || 'No description available.'}</p>
            </div>
        `;
    }

    private renderProgressSection(): string {
        // Defensive: Show 'No data' if progress data is missing
        const progressData = this.behaviorTracker.getProgressData();
        
        return `
            <h3>Progress Over Time</h3>
            <div class="progress-container">
                <div class="progress-chart" id="progress-chart">
                    <canvas id="progress-canvas" width="600" height="300"></canvas>
                </div>
                <div class="milestones">
                    <h4>Recent Achievements</h4>
                    <ul class="milestones-list">
                        ${progressData.milestones.slice(0, 5).map(milestone => `
                            <li class="milestone">
                                <span class="milestone-date">${milestone.date}</span>
                                <span class="milestone-achievement">${milestone.achievement}</span>
                                <span class="milestone-impact impact-${milestone.impact >= 7 ? 'high' : milestone.impact >= 4 ? 'medium' : 'low'}">
                                    Impact: ${milestone.impact}/10
                                </span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    private renderTrendsSection(): string {
        const trends = this.behaviorTracker.getBehaviorTrends();
        
        return `
            <h3>Behavioral Trends</h3>
            <div class="trends-container">
                ${trends.map(trend => `
                    <div class="trend-card">
                        <div class="trend-header">
                            <h4>${this.formatMetricName(trend.metric)}</h4>
                            <span class="trend-indicator ${trend.trend}">
                                ${trend.trend === 'improving' ? '↗' : trend.trend === 'declining' ? '↘' : '→'}
                                ${trend.trend}
                            </span>
                        </div>
                        <div class="trend-details">
                            <span class="change-rate ${trend.changeRate > 0 ? 'positive' : 'negative'}">
                                ${trend.changeRate > 0 ? '+' : ''}${trend.changeRate.toFixed(1)}% per month
                            </span>
                            <canvas class="trend-sparkline" width="100" height="30" data-values="${trend.values.join(',')}"></canvas>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    private renderPatternsSection(): string {
        const patterns = this.behaviorTracker.getBehaviorPatterns();
        
        return `
            <h3>Identified Behavioral Patterns</h3>
            <div class="patterns-container">
                ${patterns.length > 0 ? patterns.map(pattern => `
                    <div class="pattern-card intensity-${pattern.intensity >= 7 ? 'high' : pattern.intensity >= 4 ? 'medium' : 'low'}">
                        <div class="pattern-header">
                            <h4>${pattern.pattern}</h4>
                            <div class="pattern-meta">
                                <span class="frequency">${pattern.frequency}</span>
                                <span class="intensity">Intensity: ${pattern.intensity}/10</span>
                            </div>
                        </div>
                        <div class="pattern-details">
                            <div class="triggers">
                                <strong>Triggers:</strong> ${pattern.triggers.join(', ')}
                            </div>
                            <div class="outcomes">
                                <strong>Outcomes:</strong> ${pattern.outcomes.join(', ')}
                            </div>
                            ${pattern.relatedBiases.length > 0 ? `
                                <div class="related-biases">
                                    <strong>Related Biases:</strong> ${pattern.relatedBiases.join(', ')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('') : '<p class="no-patterns">No significant patterns identified yet. Continue using the system to build pattern recognition.</p>'}
            </div>
        `;
    }

    private renderRecommendationsSection(): string {
        const recommendations = this.behaviorTracker.generateRecommendations();
        
        return `
            <h3>Personalized Recommendations</h3>
            <div class="recommendations-container">
                <div class="recommendation-category">
                    <h4>🚀 Immediate Actions</h4>
                    <ul>
                        ${recommendations.immediate.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
                <div class="recommendation-category">
                    <h4>📈 Short-term Goals (1-3 months)</h4>
                    <ul>
                        ${recommendations.shortTerm.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
                <div class="recommendation-category">
                    <h4>🎯 Long-term Development</h4>
                    <ul>
                        ${recommendations.longTerm.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    private renderCharts(): void {
        this.renderProgressChart();
        this.renderTrendSparklines();
    }

    private renderProgressChart(): void {
        const canvas = this.container.querySelector('#progress-canvas') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const progressData = this.behaviorTracker.getProgressData();
        const { scores } = progressData;

        if (scores.length === 0) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set up chart dimensions
        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // Calculate scales
        const maxScore = Math.max(...scores, 100);
        const minScore = Math.min(...scores, 0);
        const scoreRange = maxScore - minScore;

        // Draw grid lines
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight * i) / 5;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }

        // Draw progress line
        if (scores.length > 1) {
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 3;
            ctx.beginPath();

            scores.forEach((score, index) => {
                const x = padding + (chartWidth * index) / (scores.length - 1);
                const y = padding + chartHeight - ((score - minScore) / scoreRange) * chartHeight;

                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });

            ctx.stroke();

            // Draw data points
            ctx.fillStyle = '#3b82f6';
            scores.forEach((score, index) => {
                const x = padding + (chartWidth * index) / (scores.length - 1);
                const y = padding + chartHeight - ((score - minScore) / scoreRange) * chartHeight;
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fill();
            });
        }

        // Draw axes labels
        ctx.fillStyle = '#666';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        
        // Y-axis labels
        for (let i = 0; i <= 5; i++) {
            const value = minScore + (scoreRange * i) / 5;
            const y = padding + chartHeight - (chartHeight * i) / 5;
            ctx.fillText(Math.round(value).toString(), padding - 20, y + 4);
        }
    }

    private renderTrendSparklines(): void {
        const sparklines = this.container.querySelectorAll('.trend-sparkline') as NodeListOf<HTMLCanvasElement>;
        
        sparklines.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const valuesStr = canvas.getAttribute('data-values');
            if (!valuesStr) return;

            const values = valuesStr.split(',').map(Number);
            if (values.length < 2) return;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Calculate scales
            const maxVal = Math.max(...values);
            const minVal = Math.min(...values);
            const range = maxVal - minVal || 1;

            // Draw sparkline
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.beginPath();

            values.forEach((value, index) => {
                const x = (canvas.width * index) / (values.length - 1);
                const y = canvas.height - ((value - minVal) / range) * canvas.height;

                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });

            ctx.stroke();
        });
    }

    private attachEventListeners(): void {
        // Timeframe selector
        const timeframeSelect = this.container.querySelector('#timeframe-select') as HTMLSelectElement;
        if (timeframeSelect) {
            timeframeSelect.addEventListener('change', (e) => {
                this.config.timeframe = (e.target as HTMLSelectElement).value as any;
                this.update();
            });
        }

        // Refresh button
        const refreshBtn = this.container.querySelector('#refresh-data') as HTMLButtonElement;
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.update();
            });
        }
    }

    private getScoreStatus(score: number): string {
        if (score >= 80) return 'excellent';
        if (score >= 65) return 'good';
        if (score >= 50) return 'fair';
        if (score >= 35) return 'poor';
        return 'critical';
    }

    private getStatusColor(status: string): string {
        const colors: Record<string, string> = {
            'excellent': '#10b981',
            'good': '#3b82f6',
            'fair': '#f59e0b',
            'poor': '#ef4444',
            'critical': '#dc2626'
        };
        return colors[status] || '#6b7280';
    }

    private formatMetricName(metric: string): string {
        return metric
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    private addDashboardStyles(): void {
        if (document.querySelector('#behavior-dashboard-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'behavior-dashboard-styles';
        styles.textContent = `
            .behavior-dashboard {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #e5e7eb;
            }

            .dashboard-header h2 {
                margin: 0;
                color: #1f2937;
                font-size: 2rem;
                font-weight: 700;
            }

            .dashboard-controls {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .timeframe-selector {
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                background: white;
                font-size: 14px;
            }

            .refresh-btn {
                padding: 8px 16px;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s;
            }

            .refresh-btn:hover {
                background: #2563eb;
            }

            .dashboard-content > div {
                margin-bottom: 40px;
                padding: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }

            .metrics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }

            .metric-card {
                padding: 20px;
                border-radius: 8px;
                background: #f9fafb;
                border-left: 4px solid #e5e7eb;
            }

            .metric-card.excellent { border-left-color: #10b981; }
            .metric-card.good { border-left-color: #3b82f6; }
            .metric-card.fair { border-left-color: #f59e0b; }
            .metric-card.poor { border-left-color: #ef4444; }
            .metric-card.critical { border-left-color: #dc2626; }

            .metric-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }

            .metric-header h4 {
                margin: 0;
                font-size: 1.1rem;
                color: #374151;
            }

            .metric-score {
                font-size: 1.5rem;
                font-weight: 700;
            }

            .metric-bar {
                height: 8px;
                background: #e5e7eb;
                border-radius: 4px;
                margin-bottom: 10px;
                overflow: hidden;
            }

            .metric-fill {
                height: 100%;
                transition: width 0.3s ease;
            }

            .metric-description {
                margin: 0;
                font-size: 0.9rem;
                color: #6b7280;
            }

            .progress-container {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 30px;
                margin-top: 20px;
            }

            .progress-chart {
                background: #f9fafb;
                border-radius: 8px;
                padding: 20px;
            }

            .milestones-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .milestone {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid #e5e7eb;
            }

            .milestone:last-child {
                border-bottom: none;
            }

            .milestone-date {
                font-size: 0.9rem;
                color: #6b7280;
            }

            .milestone-achievement {
                flex: 1;
                margin: 0 10px;
                font-weight: 500;
            }

            .milestone-impact {
                font-size: 0.8rem;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 500;
            }

            .milestone-impact.impact-high {
                background: #d1fae5;
                color: #065f46;
            }

            .milestone-impact.impact-medium {
                background: #dbeafe;
                color: #1e40af;
            }

            .milestone-impact.impact-low {
                background: #fef3c7;
                color: #92400e;
            }

            .trends-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }

            .trend-card {
                padding: 16px;
                background: #f9fafb;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
            }

            .trend-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .trend-header h4 {
                margin: 0;
                font-size: 1rem;
                color: #374151;
            }

            .trend-indicator {
                font-size: 0.9rem;
                font-weight: 500;
                padding: 4px 8px;
                border-radius: 4px;
            }

            .trend-indicator.improving {
                background: #d1fae5;
                color: #065f46;
            }

            .trend-indicator.declining {
                background: #fee2e2;
                color: #991b1b;
            }

            .trend-indicator.stable {
                background: #f3f4f6;
                color: #374151;
            }

            .trend-details {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .change-rate {
                font-weight: 500;
            }

            .change-rate.positive {
                color: #059669;
            }

            .change-rate.negative {
                color: #dc2626;
            }

            .patterns-container {
                margin-top: 20px;
            }

            .pattern-card {
                padding: 20px;
                margin-bottom: 16px;
                border-radius: 8px;
                border-left: 4px solid #e5e7eb;
            }

            .pattern-card.intensity-high {
                border-left-color: #dc2626;
                background: #fef2f2;
            }

            .pattern-card.intensity-medium {
                border-left-color: #f59e0b;
                background: #fffbeb;
            }

            .pattern-card.intensity-low {
                border-left-color: #10b981;
                background: #f0fdf4;
            }

            .pattern-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .pattern-header h4 {
                margin: 0;
                color: #374151;
            }

            .pattern-meta {
                display: flex;
                gap: 10px;
            }

            .pattern-meta span {
                font-size: 0.8rem;
                padding: 4px 8px;
                background: white;
                border-radius: 4px;
                color: #6b7280;
            }

            .pattern-details > div {
                margin-bottom: 8px;
                font-size: 0.9rem;
                color: #4b5563;
            }

            .recommendations-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }

            .recommendation-category {
                padding: 20px;
                background: #f9fafb;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
            }

            .recommendation-category h4 {
                margin: 0 0 16px 0;
                color: #374151;
                font-size: 1.1rem;
            }

            .recommendation-category ul {
                margin: 0;
                padding-left: 20px;
            }

            .recommendation-category li {
                margin-bottom: 8px;
                color: #4b5563;
                line-height: 1.5;
            }

            .no-patterns {
                text-align: center;
                color: #6b7280;
                font-style: italic;
                padding: 40px 20px;
            }

            @media (max-width: 768px) {
                .dashboard-header {
                    flex-direction: column;
                    gap: 20px;
                    align-items: stretch;
                }

                .progress-container {
                    grid-template-columns: 1fr;
                }

                .metrics-grid {
                    grid-template-columns: 1fr;
                }

                .trends-container {
                    grid-template-columns: 1fr;
                }

                .recommendations-container {
                    grid-template-columns: 1fr;
                }
            }
        `;

        document.head.appendChild(styles);
    }
} 