/**
 * Bias Radar Chart Component
 *
 * Creates interactive radar chart visualization for cognitive bias detection results.
 * Shows user's bias scores vs population benchmarks.
 */
import { BiasDetectionResult } from '../../types';
export declare class BiasRadarChart {
    private canvas;
    private ctx;
    private container;
    private data?;
    private colors;
    constructor(containerId: string);
    /**
     * Update chart with new bias detection data
     */
    updateData(biasResults: BiasDetectionResult[]): void;
    /**
     * Setup canvas and context
     */
    private setupCanvas;
    /**
     * Create legend for the chart
     */
    private createLegend;
    /**
     * Create individual legend item
     */
    private createLegendItem;
    /**
     * Transform bias detection results into chart data
     */
    private transformBiasData;
    /**
     * Render the radar chart
     */
    private render;
    /**
     * Draw radar chart grid
     */
    private drawGrid;
    /**
     * Draw axis labels for each bias type
     */
    private drawAxisLabels;
    /**
     * Format bias name for display
     */
    private formatBiasName;
    /**
     * Draw data polygon for scores
     */
    private drawDataPolygon;
    /**
     * Setup event listeners for interactivity
     */
    private setupEventListeners;
    /**
     * Handle mouse move for tooltips
     */
    private handleMouseMove;
    /**
     * Handle mouse leave
     */
    private handleMouseLeave;
    /**
     * Show tooltip with bias information
     */
    private showTooltip;
    /**
     * Hide tooltip
     */
    private hideTooltip;
    /**
     * Export chart as image
     */
    exportAsImage(filename?: string): void;
    /**
     * Resize chart to fit container
     */
    resize(): void;
}
//# sourceMappingURL=BiasRadarChart.d.ts.map