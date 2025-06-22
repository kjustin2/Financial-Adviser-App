import { Recommendation } from '../../types';
/**
 * A component to render actionable recommendations in the report.
 */
export declare class ActionableRecommendations {
    private container;
    constructor(containerId: string);
    /**
     * Renders the list of recommendations.
     * @param recommendations - An array of Recommendation objects.
     */
    render(recommendations: Recommendation[]): void;
    private createRecommendationHTML;
}
//# sourceMappingURL=ActionableRecommendations.d.ts.map