/**
 * Bias Summary Report Component
 *
 * Creates a comprehensive report display of all cognitive bias detection results
 * with severity levels, recommendations, and action items.
 */
import { BiasDetectionResult, MitigationStrategy } from '../../types';
export declare class BiasSummaryReport {
    private container;
    private data?;
    constructor(containerId: string);
    /**
     * Update report with new bias detection results
     */
    updateData(biasResults: BiasDetectionResult[], mitigationStrategies: MitigationStrategy[]): void;
    /**
     * Setup container structure
     */
    private setupContainer;
    /**
     * Calculate overall risk level from individual biases
     */
    private calculateOverallRisk;
    /**
     * Get color for severity level
     */
    private getSeverityColor;
    /**
     * Render the complete bias summary report
     */
    private render;
    /**
     * Render report header
     */
    private renderHeader;
    /**
     * Render executive summary section
     */
    private renderExecutiveSummary;
    /**
     * Render detailed bias breakdown
     */
    private renderBiasBreakdown;
    /**
     * Create individual bias card
     */
    private createBiasCard;
    /**
     * Render mitigation strategies section
     */
    private renderMitigationStrategies;
    /**
     * Render strategy group
     */
    private renderStrategyGroup;
    /**
     * Render action plan section
     */
    private renderActionPlan;
    /**
     * Render footer
     */
    private renderFooter;
    /**
     * Format bias name for display
     */
    private formatBiasName;
    /**
     * Print report - opens a print-friendly version of the report
     */
    printReport(): void;
}
//# sourceMappingURL=BiasSummaryReport.d.ts.map