import { Recommendation } from '../../types';

/**
 * A component to render actionable recommendations in the report.
 */
export class ActionableRecommendations {
    private container: HTMLElement;

    constructor(containerId: string) {
        const el = document.getElementById(containerId);
        if (!el) {
            throw new Error(`Container with id "${containerId}" not found.`);
        }
        this.container = el;
    }

    /**
     * Renders the list of recommendations.
     * @param recommendations - An array of Recommendation objects.
     */
    public render(recommendations: Recommendation[]): void {
        if (!recommendations || recommendations.length === 0) {
            this.container.innerHTML = '<p>No specific recommendations at this time. Great job!</p>';
            return;
        }

        this.container.innerHTML = `
            <div class="recommendations-container">
                <h2>Top Recommendations</h2>
                ${recommendations.map(rec => this.createRecommendationHTML(rec)).join('')}
            </div>
        `;
    }

    private createRecommendationHTML(recommendation: Recommendation): string {
        // Defensive: Prevent $NaN or undefined in displayed values
        return `
            <div class="recommendation-card priority-${recommendation.priority}">
                <div class="recommendation-header">
                    <span class="priority-badge">${recommendation.priority}</span>
                    <h3 class="recommendation-title">${recommendation.title}</h3>
                </div>
                <p class="recommendation-description">${recommendation.description}</p>
                <div class="action-steps">
                    <h4>Action Steps:</h4>
                    <ul>
                        ${recommendation.actionSteps.map(step => `<li>${step}</li>`).join('')}
                    </ul>
                </div>
                <div class="recommendation-footer">
                    <span class="footer-item"><strong>Category:</strong> ${recommendation.category}</span>
                    <span class="footer-item"><strong>Impact:</strong> ${recommendation.impactLevel}</span>
                    <span class="footer-item"><strong>Timeframe:</strong> ${recommendation.timeframe}</span>
                </div>
            </div>
        `;
    }
} 