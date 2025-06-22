/**
 * Bias Impact Chart Component
 *
 * Visualizes the impact of cognitive biases on financial decisions and outcomes.
 * Shows potential financial losses/gains from each bias type.
 */
import { BiasDetectionResult, UserFinancialData } from '../../types';
export declare class BiasImpactChart {
    private canvas;
    private ctx;
    private container;
    private data?;
    private colors;
    constructor(containerId: string);
    /**
     * Update chart with bias impact data
     */
    updateData(biasResults: BiasDetectionResult[], financialData: UserFinancialData): void;
    /**
     * Setup canvas and UI elements
     */
    private setupCanvas;
    /**
     * Create legend showing impact interpretation
     */
    private createImpactLegend;
    /**
     * Create individual legend item
     */
    private createLegendItem;
    /**
     * Calculate financial impact for each bias
     */
    private calculateBiasImpacts;
    /**
     * Estimate financial impact of a specific bias
     */
    private estimateBiasImpact;
    /**
     * Render the impact chart
     */
    private render;
    /**
     * Draw total impact summary
     */
    private drawTotalImpactSummary;
    /**
     * Format bias name for display
     */
    private formatBiasName;
    /**
     * Format currency values
     */
    private formatCurrency;
    /**
     * Calculate net worth from financial data
     */
    private calculateNetWorth;
    /**
     * Export chart as image
     */
    exportAsImage(filename?: string): void;
    /**
     * Resize canvas for responsive design
     */
    resize(): void;
}
//# sourceMappingURL=BiasImpactChart.d.ts.map