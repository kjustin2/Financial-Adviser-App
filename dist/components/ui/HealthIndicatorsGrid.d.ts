/**
 * Health Indicators Grid Component
 * Handles rendering of the 8 health indicators with explanations
 */
import { HealthIndicator } from '../../interfaces/analysis-types';
export declare class HealthIndicatorsGrid {
    private container;
    constructor(containerId: string);
    render(healthIndicators: HealthIndicator[]): void;
    private generateHTML;
    private generateIndicatorCard;
    private generateMetricsHTML;
    private generateRecommendationsHTML;
    private formatStatus;
}
//# sourceMappingURL=HealthIndicatorsGrid.d.ts.map