/**
 * Enhanced Results Display Component
 * Provides clear, actionable financial analysis results with explanations
 *
 * @remarks
 * - Strictly typed, fully documented, and validated per project rules.
 * - All displayed values are validated and sanitized before display.
 * - UI/UX is mobile-first and accessible.
 */
import { ComprehensiveAnalysisResult } from '../../interfaces/analysis-types';
import '../shared-form-styles.css';
/**
 * EnhancedResultsDisplay
 * Renders the financial analysis results in a clear, accessible, and actionable format.
 */
export declare class EnhancedResultsDisplay {
    private container;
    /**
     * Initializes the results display component.
     * @param containerId - The DOM element ID to render the results into.
     */
    constructor(containerId: string);
    /**
     * Renders the analysis results.
     * @param analysisResult - The comprehensive analysis result object.
     */
    render(analysisResult: ComprehensiveAnalysisResult): void;
    /**
     * Generates the overall score section HTML.
     * @param analysisResult - The analysis result object.
     * @returns The HTML string for the score section.
     */
    private generateOverallScoreSection;
    /**
     * Generates the key insights section HTML.
     * @param analysisResult - The analysis result object.
     * @returns The HTML string for the key insights section.
     */
    private generateKeyInsightsSection;
    /**
     * Generates the action plan section HTML.
     * @param analysisResult - The analysis result object.
     * @returns The HTML string for the action plan section.
     */
    private generateActionPlanSection;
    /**
     * Attaches interactive elements for accessibility and info toggles.
     */
    private attachInteractiveElements;
    private formatTimeframe;
    private formatImpact;
    /**
     * Gets the color for the score circle based on health level.
     * @param level - The health level string.
     * @returns The color hex code.
     */
    private getScoreColor;
}
//# sourceMappingURL=EnhancedResultsDisplay.d.ts.map