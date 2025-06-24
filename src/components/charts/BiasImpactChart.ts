/**
 * Bias Impact Chart Component
 * 
 * Visualizes the impact of cognitive biases on financial decisions and outcomes.
 * Shows potential financial losses/gains from each bias type.
 */

import { BiasDetectionResult, BehavioralVisualization, UserFinancialData } from '../../types';

export class BiasImpactChart {
    private canvas!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;
    private container: HTMLElement;
    private data?: BehavioralVisualization['biasImpactAnalysis'];
    private colors = {
        negative: '#ff4757',
        positive: '#2ed573',
        neutral: '#57606f',
        background: '#ffffff',
        grid: '#e9ecef',
        text: '#495057'
    };

    constructor(containerId: string) {
        this.container = document.getElementById(containerId) || document.createElement('div');
        this.setupCanvas();
    }

    /**
     * Update chart with bias impact data
     */
    public updateData(
        biasResults: BiasDetectionResult[], 
        financialData: UserFinancialData
    ): void {
        this.data = this.calculateBiasImpacts(biasResults, financialData);
        this.render();
    }

    /**
     * Setup canvas and UI elements
     */
    private setupCanvas(): void {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 500;
        this.canvas.height = 300;
        this.canvas.style.maxWidth = '100%';
        this.canvas.style.height = 'auto';
        
        this.ctx = this.canvas.getContext('2d')!;
        this.container.appendChild(this.canvas);

        // Add chart title
        const title = document.createElement('h3');
        title.textContent = 'Estimated Financial Impact of Cognitive Biases';
        title.style.textAlign = 'center';
        title.style.margin = '0 0 20px 0';
        title.style.color = this.colors.text;
        this.container.insertBefore(title, this.canvas);

        // Add impact legend
        this.createImpactLegend();
    }

    /**
     * Create legend showing impact interpretation
     */
    private createImpactLegend(): void {
        const legend = document.createElement('div');
        legend.style.display = 'flex';
        legend.style.justifyContent = 'center';
        legend.style.gap = '20px';
        legend.style.marginTop = '10px';

        const negativeItem = this.createLegendItem('Potential Loss', this.colors.negative);
        const positiveItem = this.createLegendItem('Potential Gain', this.colors.positive);
        const neutralItem = this.createLegendItem('Minimal Impact', this.colors.neutral);

        legend.appendChild(negativeItem);
        legend.appendChild(neutralItem);
        legend.appendChild(positiveItem);
        this.container.appendChild(legend);
    }

    /**
     * Create individual legend item
     */
    private createLegendItem(label: string, color: string): HTMLElement {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.gap = '8px';

        const colorBox = document.createElement('div');
        colorBox.style.width = '16px';
        colorBox.style.height = '16px';
        colorBox.style.backgroundColor = color;
        colorBox.style.borderRadius = '3px';

        const text = document.createElement('span');
        text.textContent = label;
        text.style.fontSize = '14px';
        text.style.color = this.colors.text;

        item.appendChild(colorBox);
        item.appendChild(text);

        return item;
    }

    /**
     * Calculate financial impact for each bias
     */
    private calculateBiasImpacts(
        biasResults: BiasDetectionResult[], 
        financialData: UserFinancialData
    ): BehavioralVisualization['biasImpactAnalysis'] {
        const netWorth = this.calculateNetWorth(financialData);
        const annualIncome = financialData.income.primarySalary * 12 + 
                            financialData.income.secondaryIncome * 12 + 
                            financialData.income.businessIncome * 12 + 
                            financialData.income.investmentIncome * 12 + 
                            financialData.income.rentalIncome * 12 + 
                            financialData.income.benefitsIncome * 12 + 
                            financialData.income.otherIncome * 12;
        
        const impacts = biasResults.map(bias => {
            const impact = this.estimateBiasImpact(bias, netWorth, annualIncome);
            return {
                biasType: bias.biasType,
                estimatedImpact: impact,
                severity: bias.severity,
                confidence: bias.confidence
            };
        });

        // Sort by absolute impact (highest impact first)
        impacts.sort((a, b) => Math.abs(b.estimatedImpact) - Math.abs(a.estimatedImpact));

        return {
            impacts,
            totalImpact: impacts.reduce((sum, impact) => sum + impact.estimatedImpact, 0),
            netWorth,
            impactAsPercentage: impacts.reduce((sum, impact) => sum + impact.estimatedImpact, 0) / netWorth * 100
        };
    }

    /**
     * Estimate financial impact of a specific bias
     */
    private estimateBiasImpact(
        bias: BiasDetectionResult, 
        netWorth: number, 
        annualIncome: number
    ): number {
        // Impact multipliers based on research and severity
        const severityMultipliers = {
            'low': 0.01,
            'moderate': 0.03,
            'high': 0.05,
            'severe': 0.08
        };

        // Base impact percentages by bias type (annual)
        const biasImpacts = {
            'overconfidence': -0.025,        // 2.5% annual loss from overtrading
            'loss-aversion': -0.015,         // 1.5% opportunity cost from being too conservative
            'confirmation-bias': -0.02,      // 2% loss from poor investment choices
            'anchoring': -0.01,              // 1% loss from anchoring to irrelevant prices
            'availability-heuristic': -0.008, // 0.8% loss from recent event bias
            'mental-accounting': -0.012,     // 1.2% inefficiency from poor money management
            'herd-mentality': -0.018,        // 1.8% loss from following crowds
            'recency-bias': -0.015,          // 1.5% loss from overweighting recent events
            'sunk-cost-fallacy': -0.01,      // 1% loss from holding losing investments
            'framing-effect': -0.006         // 0.6% loss from decision framing issues
        };

        const baseImpact = biasImpacts[bias.biasType] || 0;
        const severityMultiplier = severityMultipliers[bias.severity];
        const confidenceWeight = bias.confidence;

        // Apply impact to relevant financial base (net worth or income)
        const financialBase = bias.biasType === 'loss-aversion' || bias.biasType === 'mental-accounting' 
            ? annualIncome 
            : netWorth;

        return baseImpact * severityMultiplier * confidenceWeight * financialBase;
    }

    /**
     * Render the impact chart
     */
    private render(): void {
        if (!this.data) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const margin = { top: 20, right: 40, bottom: 60, left: 120 };
        const chartWidth = this.canvas.width - margin.left - margin.right;
        const chartHeight = this.canvas.height - margin.top - margin.bottom;

        // Calculate max impact for scaling
        const maxImpact = Math.max(...this.data.impacts.map((i: any) => Math.abs(i.estimatedImpact)));
        const scale = chartWidth / (maxImpact * 2); // *2 for both positive and negative

        // Draw zero line
        const zeroX = margin.left + chartWidth / 2;
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(zeroX, margin.top);
        this.ctx.lineTo(zeroX, margin.top + chartHeight);
        this.ctx.stroke();

        // Draw bars
        const barHeight = (chartHeight - 10) / this.data.impacts.length;
        
        this.data.impacts.forEach((impact: any, index: number) => {
            const y = margin.top + index * barHeight + 5;
            const barWidth = Math.abs(impact.estimatedImpact) * scale;
            const x = impact.estimatedImpact < 0 
                ? zeroX - barWidth 
                : zeroX;

            // Choose color based on impact
            const color = impact.estimatedImpact < -100 
                ? this.colors.negative 
                : impact.estimatedImpact > 100 
                    ? this.colors.positive 
                    : this.colors.neutral;

            // Draw bar
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, barWidth, barHeight - 10);

            // Draw bias label
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'right';
            this.ctx.fillText(
                this.formatBiasName(impact.biasType), 
                margin.left - 10, 
                y + (barHeight - 10) / 2 + 4
            );

            // Draw impact value
            this.ctx.textAlign = 'left';
            const valueX = impact.estimatedImpact < 0 ? x - 5 : x + barWidth + 5;
            if (impact.estimatedImpact < 0) this.ctx.textAlign = 'right';
            
            this.ctx.fillText(
                this.formatCurrency(impact.estimatedImpact), 
                valueX, 
                y + (barHeight - 10) / 2 + 4
            );
        });

        // Draw total impact summary
        this.drawTotalImpactSummary();
    }

    /**
     * Draw total impact summary
     */
    private drawTotalImpactSummary(): void {
        if (!this.data) return;

        const summaryY = this.canvas.height - 30;
        
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        
        const totalText = `Total Estimated Annual Impact: ${this.formatCurrency(this.data.totalImpact)}`;
        const percentText = `(${this.data.impactAsPercentage.toFixed(1)}% of net worth)`;
        
        this.ctx.fillText(totalText, this.canvas.width / 2, summaryY);
        this.ctx.font = '12px Arial';
        this.ctx.fillText(percentText, this.canvas.width / 2, summaryY + 15);
    }

    /**
     * Format bias name for display
     */
    private formatBiasName(biasType: string): string {
        const names: { [key: string]: string } = {
            'overconfidence': 'Overconfidence',
            'loss-aversion': 'Loss Aversion',
            'confirmation-bias': 'Confirmation Bias',
            'anchoring': 'Anchoring',
            'availability-heuristic': 'Availability Heuristic',
            'mental-accounting': 'Mental Accounting',
            'herd-mentality': 'Herd Mentality',
            'recency-bias': 'Recency Bias',
            'sunk-cost-fallacy': 'Sunk Cost Fallacy',
            'framing-effect': 'Framing Effect'
        };
        return names[biasType] || biasType;
    }

    /**
     * Format currency values
     */
    private formatCurrency(amount: number): string {
        if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
        if (amount === 0) return '$0';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Calculate net worth from financial data
     */
    private calculateNetWorth(financialData: UserFinancialData): number {
        const assets = Object.values(financialData.assets).reduce((sum, value) => sum + value, 0);
        const liabilities = Object.values(financialData.liabilities).reduce((sum, value) => sum + value, 0);
        return assets - liabilities;
    }

    /**
     * Export chart as image
     */
    public exportAsImage(filename: string = 'bias-impact-chart.png'): void {
        const link = document.createElement('a');
        link.download = filename;
        link.href = this.canvas.toDataURL();
        link.click();
    }

    /**
     * Resize canvas for responsive design
     */
    public resize(): void {
        const containerWidth = this.container.clientWidth;
        const aspectRatio = this.canvas.height / this.canvas.width;
        
        this.canvas.style.width = `${containerWidth}px`;
        this.canvas.style.height = `${containerWidth * aspectRatio}px`;
        
        this.render();
    }
} 