/**
 * MitigationReport.ts
 *
 * Component for displaying personalized bias mitigation recommendations
 * Shows comprehensive mitigation plan with timelines, strategies, and tracking
 */
import { MitigationPlan } from '../../types';
export declare class MitigationReport {
    private container;
    private plan?;
    constructor(containerId: string);
    /**
     * Update the report with a new mitigation plan
     */
    updatePlan(plan: MitigationPlan): void;
    /**
     * Set up the container with basic styling
     */
    private setupContainer;
    /**
     * Render the complete mitigation report
     */
    private render;
    /**
     * Render report header
     */
    private renderHeader;
    /**
     * Render overview section with risk level
     */
    private renderOverviewSection;
    /**
     * Render priority biases section
     */
    private renderPriorityBiases;
    /**
     * Create a bias card
     */
    private createBiasCard;
    /**
     * Render strategies section
     */
    private renderStrategies;
    /**
     * Create a strategy card
     */
    private createStrategyCard;
    /**
     * Render timeline section
     */
    private renderTimeline;
    /**
     * Create a phase card for timeline
     */
    private createPhaseCard;
    /**
     * Render tracking section
     */
    private renderTracking;
    /**
     * Render expected outcomes section
     */
    private renderExpectedOutcomes;
    /**
     * Create outcome card
     */
    private createOutcomeCard;
    private getRiskColor;
    private getRiskDescription;
    private getPriorityColor;
    private formatBiasName;
    private getBiasDescription;
    private getEffectivenessColor;
    private getDifficultyColor;
}
//# sourceMappingURL=MitigationReport.d.ts.map