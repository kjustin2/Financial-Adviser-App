/**
 * Enhanced Results Display Component
 * Provides clear, actionable financial analysis results with explanations
 */
import { ComprehensiveAnalysisResult } from '../../interfaces/analysis-types';
export declare class EnhancedResultsDisplay {
    private container;
    constructor(containerId: string);
    render(analysisResult: ComprehensiveAnalysisResult): void;
    private generateOverallScoreSection;
    private generateKeyInsightsSection;
    private generateActionPlanSection;
    private attachInteractiveElements;
    private formatTimeframe;
    private formatImpact;
    private getScoreColor;
}
//# sourceMappingURL=EnhancedResultsDisplay.d.ts.map