/**
 * Enhanced Results Display Component
 * Provides clear, actionable financial analysis results with explanations
 */
import { ComprehensiveAnalysisResult } from '../../interfaces/analysis-types';
export declare class EnhancedResultsDisplay {
    private container;
    constructor(containerId: string);
    render(analysisResult: ComprehensiveAnalysisResult): void;
    private generateHTML;
    private generateOverallScoreSection;
    private generateKeyInsightsSection;
    private generateHealthIndicatorsSection;
    private generateActionPlanSection;
    private generateKeyInsights;
    private attachInteractiveElements;
    private getHealthLevelText;
    private getScoreExplanation;
    private formatStatus;
    private formatTimeframe;
    private formatImpact;
    private formatCurrency;
}
//# sourceMappingURL=EnhancedResultsDisplay.d.ts.map