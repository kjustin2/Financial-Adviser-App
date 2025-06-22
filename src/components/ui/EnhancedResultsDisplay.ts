/**
 * Enhanced Results Display Component
 * Provides clear, actionable financial analysis results with explanations
 */

import { ComprehensiveAnalysisResult } from '../../interfaces/analysis-types';
import { STATUS_COLORS } from '../../constants/financial-constants';

export class EnhancedResultsDisplay {
    private container: HTMLElement;

    constructor(containerId: string) {
        const element = document.getElementById(containerId);
        if (!element) {
            throw new Error(`Element with ID ${containerId} not found`);
        }
        this.container = element;
    }

    public render(analysisResult: ComprehensiveAnalysisResult): void {
        this.container.innerHTML = this.generateHTML(analysisResult);
        this.attachInteractiveElements();
    }

    private generateHTML(analysisResult: ComprehensiveAnalysisResult): string {
        return `
            <div class="enhanced-results">
                ${this.generateOverallScoreSection(analysisResult)}
                ${this.generateKeyInsightsSection(analysisResult)}
                ${this.generateHealthIndicatorsSection(analysisResult)}
                ${this.generateActionPlanSection(analysisResult)}
            </div>
        `;
    }

    private generateOverallScoreSection(analysisResult: ComprehensiveAnalysisResult): string {
        const { overallHealthScore, healthLevel } = analysisResult;
        const scoreColor = STATUS_COLORS[healthLevel as keyof typeof STATUS_COLORS] || STATUS_COLORS.fair;
        
        return `
            <div class="overall-score-section">
                <div class="score-container">
                    <div class="score-circle" style="border-color: ${scoreColor}">
                        <div class="score-value">${overallHealthScore}</div>
                        <div class="score-label">Financial Health Score</div>
                    </div>
                    <div class="score-details">
                        <h1 class="health-level" style="color: ${scoreColor}">
                            ${this.getHealthLevelText(healthLevel)}
                        </h1>
                        <p class="score-explanation">
                            ${this.getScoreExplanation(overallHealthScore, healthLevel)}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    private generateKeyInsightsSection(analysisResult: ComprehensiveAnalysisResult): string {
        const insights = this.generateKeyInsights(analysisResult);
        
        return `
            <div class="key-insights-section">
                <h2>🎯 Key Insights About Your Finances</h2>
                <div class="insights-grid">
                    ${insights.map(insight => `
                        <div class="insight-card ${insight.type}">
                            <div class="insight-icon">${insight.icon}</div>
                            <div class="insight-content">
                                <h3>${insight.title}</h3>
                                <p>${insight.description}</p>
                                <div class="insight-metric">
                                    <span class="metric-value">${insight.value}</span>
                                    <span class="metric-label">${insight.label}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    private generateHealthIndicatorsSection(analysisResult: ComprehensiveAnalysisResult): string {
        const { healthIndicators } = analysisResult;
        
        return `
            <div class="health-indicators-section">
                <h2>📊 Your Financial Health Breakdown</h2>
                <p class="section-description">
                    Based on 8 key indicators from financial health research. Click on any indicator to learn more.
                </p>
                <div class="indicators-grid">
                    ${healthIndicators.map((indicator, index) => `
                        <div class="indicator-card expandable" data-indicator="${index}">
                            <div class="indicator-header">
                                <div class="indicator-title">
                                    <h3>${indicator.name}</h3>
                                    <span class="status-badge status-${indicator.status}">${this.formatStatus(indicator.status)}</span>
                                </div>
                                <div class="indicator-score">
                                    <span class="score">${Math.round(indicator.score)}</span>
                                    <span class="max">/100</span>
                                </div>
                            </div>
                            
                            <div class="indicator-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" 
                                         style="width: ${indicator.score}%; background-color: ${STATUS_COLORS[indicator.status as keyof typeof STATUS_COLORS] || STATUS_COLORS.fair}">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="indicator-explanation">
                                <p>${indicator.explanation}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    private generateActionPlanSection(analysisResult: ComprehensiveAnalysisResult): string {
        const { prioritizedRecommendations } = analysisResult;
        const highPriorityRecs = prioritizedRecommendations.filter(rec => rec.priority === 'high').slice(0, 3);
        
        return `
            <div class="action-plan-section">
                <h2>🚀 Your Personalized Action Plan</h2>
                <p class="section-description">
                    Based on your specific financial situation, here are the most impactful steps you can take:
                </p>
                
                <div class="priority-actions">
                    <h3>🔥 High Priority Actions (Start Here)</h3>
                    <div class="actions-list">
                        ${highPriorityRecs.map((rec, index) => `
                            <div class="action-item priority-high">
                                <div class="action-number">${index + 1}</div>
                                <div class="action-content">
                                    <h4>${rec.title}</h4>
                                    <p>${rec.description}</p>
                                    <div class="action-details">
                                        <div class="action-steps">
                                            <strong>Action Steps:</strong>
                                            <ul>
                                                ${rec.actionSteps.map(step => `<li>${step}</li>`).join('')}
                                            </ul>
                                        </div>
                                        <div class="action-meta">
                                            <span class="timeframe">⏱️ ${this.formatTimeframe(rec.timeframe)}</span>
                                            <span class="impact">📈 ${this.formatImpact(rec.impactLevel)} Impact</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    private generateKeyInsights(analysisResult: ComprehensiveAnalysisResult): any[] {
        const { keyMetrics } = analysisResult;
        
        return [
            {
                type: 'cash-flow',
                icon: '💰',
                title: 'Monthly Cash Flow',
                description: keyMetrics.monthlyCashFlow >= 0 ? 'You have positive cash flow' : 'You\'re spending more than you earn',
                value: this.formatCurrency(keyMetrics.monthlyCashFlow),
                label: 'per month'
            },
            {
                type: 'emergency-fund',
                icon: '🛡️',
                title: 'Emergency Preparedness',
                description: keyMetrics.emergencyFundMonths >= 3 ? 'Good emergency coverage' : 'Build your emergency fund',
                value: keyMetrics.emergencyFundMonths.toFixed(1),
                label: 'months covered'
            },
            {
                type: 'debt-ratio',
                icon: '📉',
                title: 'Debt Management',
                description: keyMetrics.debtToIncomeRatio <= 0.36 ? 'Healthy debt levels' : 'Consider debt reduction',
                value: `${(keyMetrics.debtToIncomeRatio * 100).toFixed(1)}%`,
                label: 'of income'
            },
            {
                type: 'savings-rate',
                icon: '📈',
                title: 'Savings Rate',
                description: keyMetrics.savingsRate >= 0.15 ? 'Excellent saving habits' : 'Increase your savings',
                value: `${(keyMetrics.savingsRate * 100).toFixed(1)}%`,
                label: 'of income'
            }
        ];
    }

    private attachInteractiveElements(): void {
        // Add any interactive functionality here
    }

    private getHealthLevelText(healthLevel: string): string {
        const levelMap: { [key: string]: string } = {
            'excellent': 'Excellent Financial Health',
            'good': 'Good Financial Health',
            'fair': 'Fair Financial Health',
            'limited': 'Limited Financial Health',
            'critical': 'Critical Financial Health'
        };
        return levelMap[healthLevel] || 'Unknown Health Level';
    }

    private getScoreExplanation(score: number, _level: string): string {
        if (score >= 80) {
            return 'Outstanding! You have excellent financial habits and are well-positioned for the future.';
        } else if (score >= 65) {
            return 'Good work! You have solid financial fundamentals with room for some improvements.';
        } else if (score >= 50) {
            return 'You\'re on the right track, but there are several areas where focused improvements could make a big difference.';
        } else if (score >= 35) {
            return 'Your financial health needs attention. The good news is that targeted actions can lead to significant improvements.';
        } else {
            return 'Your financial situation requires immediate attention. Focus on the high-priority recommendations to get back on track.';
        }
    }

    private formatStatus(status: string): string {
        const statusMap: { [key: string]: string } = {
            'excellent': 'Excellent',
            'good': 'Good',
            'fair': 'Fair',
            'poor': 'Poor',
            'critical': 'Critical'
        };
        return statusMap[status] || status;
    }

    private formatTimeframe(timeframe: string): string {
        const timeframeMap: { [key: string]: string } = {
            'immediate': 'This Week',
            'short-term': '1-3 Months',
            'medium-term': '3-12 Months',
            'long-term': '1+ Years'
        };
        return timeframeMap[timeframe] || timeframe;
    }

    private formatImpact(impact: string): string {
        const impactMap: { [key: string]: string } = {
            'high': 'High',
            'medium': 'Medium',
            'low': 'Low'
        };
        return impactMap[impact] || impact;
    }

    private formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
} 