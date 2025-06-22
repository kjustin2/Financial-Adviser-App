/**
 * Health Indicators Grid Component
 * Handles rendering of the 8 health indicators with explanations
 */

import { HealthIndicator } from '../../interfaces/analysis-types';
import { STATUS_COLORS } from '../../constants/financial-constants';

export class HealthIndicatorsGrid {
    private container: HTMLElement;

    constructor(containerId: string) {
        const element = document.getElementById(containerId);
        if (!element) {
            throw new Error(`Element with ID ${containerId} not found`);
        }
        this.container = element;
    }

    public render(healthIndicators: HealthIndicator[]): void {
        this.container.innerHTML = this.generateHTML(healthIndicators);
    }

    private generateHTML(healthIndicators: HealthIndicator[]): string {
        const indicatorCards = healthIndicators.map(indicator => this.generateIndicatorCard(indicator)).join('');
        
        return `
            <div class="health-indicators-grid">
                ${indicatorCards}
            </div>
        `;
    }

    private generateIndicatorCard(indicator: HealthIndicator): string {
        const statusColor = STATUS_COLORS[indicator.status];
        const progressPercentage = Math.round(indicator.score);
        
        return `
            <div class="health-indicator-card" data-status="${indicator.status}">
                <div class="indicator-header">
                    <h3 class="indicator-name">${indicator.name}</h3>
                    <div class="indicator-score">
                        <span class="score-value">${progressPercentage}</span>
                        <span class="score-max">/100</span>
                    </div>
                </div>
                
                <div class="indicator-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" 
                             style="width: ${progressPercentage}%; background-color: ${statusColor}">
                        </div>
                    </div>
                    <span class="status-label status-${indicator.status}">${this.formatStatus(indicator.status)}</span>
                </div>
                
                <div class="indicator-explanation">
                    <p class="explanation-text">${indicator.explanation}</p>
                </div>
                
                <div class="indicator-metrics">
                    ${this.generateMetricsHTML(indicator)}
                </div>
                
                ${indicator.recommendations.length > 0 ? this.generateRecommendationsHTML(indicator.recommendations) : ''}
            </div>
        `;
    }

    private generateMetricsHTML(indicator: HealthIndicator): string {
        if (indicator.metrics.length === 0) return '';
        
        const metricsHTML = indicator.metrics.map(metric => `
            <div class="metric-item">
                <span class="metric-title">${metric.title}:</span>
                <span class="metric-value status-${metric.status}">${metric.value}</span>
            </div>
        `).join('');
        
        return `
            <div class="metrics-list">
                ${metricsHTML}
            </div>
        `;
    }

    private generateRecommendationsHTML(recommendations: string[]): string {
        const recommendationsHTML = recommendations.slice(0, 2).map(rec => `
            <li class="recommendation-item">${rec}</li>
        `).join('');
        
        return `
            <div class="indicator-recommendations">
                <h4 class="recommendations-title">Key Recommendations:</h4>
                <ul class="recommendations-list">
                    ${recommendationsHTML}
                </ul>
            </div>
        `;
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
} 