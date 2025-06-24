/**
 * Bias Radar Chart Component
 * 
 * Creates interactive radar chart visualization for cognitive bias detection results.
 * Shows user's bias scores vs population benchmarks.
 */

import { CognitiveBiasType, BiasDetectionResult, BehavioralVisualization } from '../../types';

export class BiasRadarChart {
    private canvas!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;
    private container: HTMLElement;
    private data?: BehavioralVisualization['biasRadarChart'];
    private colors = {
        user: '#ff6b6b',
        benchmark: '#4ecdc4',
        grid: '#e9ecef',
        text: '#495057',
        background: '#ffffff'
    };

    constructor(containerId: string) {
        this.container = document.getElementById(containerId) || document.createElement('div');
        this.setupCanvas();
        this.setupEventListeners();
    }

    /**
     * Update chart with new bias detection data
     */
    public updateData(biasResults: BiasDetectionResult[]): void {
        this.data = this.transformBiasData(biasResults);
        this.render();
    }

    /**
     * Setup canvas and context
     */
    private setupCanvas(): void {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.canvas.style.maxWidth = '100%';
        this.canvas.style.height = 'auto';
        
        this.ctx = this.canvas.getContext('2d')!;
        this.container.appendChild(this.canvas);

        // Add chart title
        const title = document.createElement('h3');
        title.textContent = 'Cognitive Bias Assessment';
        title.style.textAlign = 'center';
        title.style.margin = '0 0 20px 0';
        title.style.color = this.colors.text;
        this.container.insertBefore(title, this.canvas);

        // Add legend
        this.createLegend();
    }

    /**
     * Create legend for the chart
     */
    private createLegend(): void {
        const legend = document.createElement('div');
        legend.style.display = 'flex';
        legend.style.justifyContent = 'center';
        legend.style.gap = '20px';
        legend.style.marginTop = '10px';

        const userLegend = this.createLegendItem('Your Scores', this.colors.user);
        const benchmarkLegend = this.createLegendItem('Population Average', this.colors.benchmark);

        legend.appendChild(userLegend);
        legend.appendChild(benchmarkLegend);
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
     * Transform bias detection results into chart data
     */
    private transformBiasData(biasResults: BiasDetectionResult[]): BehavioralVisualization['biasRadarChart'] {
        const biasTypes: CognitiveBiasType[] = [
            'overconfidence',
            'loss-aversion',
            'confirmation-bias',
            'anchoring',
            'availability-heuristic',
            'mental-accounting',
            'herd-mentality',
            'recency-bias',
            'sunk-cost-fallacy',
            'framing-effect'
        ];

        const scores: number[] = [];
        const benchmarks: number[] = [];

        biasTypes.forEach(biasType => {
            const result = biasResults.find(r => r.biasType === biasType);
            if (result) {
                // Convert confidence (0-1) to percentage (0-100)
                scores.push(result.confidence * 100);
                benchmarks.push(result.prevalence * 100);
            } else {
                scores.push(0);
                benchmarks.push(0);
            }
        });

        return {
            biases: biasTypes,
            scores,
            benchmarks
        };
    }

    /**
     * Render the radar chart
     */
    private render(): void {
        if (!this.data) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 60;

        // Draw grid
        this.drawGrid(centerX, centerY, radius);

        // Draw axis labels
        this.drawAxisLabels(centerX, centerY, radius);

        // Draw benchmark scores
        this.drawDataPolygon(centerX, centerY, radius, this.data.benchmarks, this.colors.benchmark, 0.3);

        // Draw user scores
        this.drawDataPolygon(centerX, centerY, radius, this.data.scores, this.colors.user, 0.7);
    }

    /**
     * Draw radar chart grid
     */
    private drawGrid(centerX: number, centerY: number, radius: number): void {
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 1;

        // Draw concentric circles
        for (let i = 1; i <= 5; i++) {
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
            this.ctx.stroke();
        }

        // Draw axis lines
        const angleStep = (2 * Math.PI) / this.data!.biases.length;
        for (let i = 0; i < this.data!.biases.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }

        // Draw scale labels
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        for (let i = 1; i <= 5; i++) {
            const scale = (i * 20).toString() + '%';
            this.ctx.fillText(scale, centerX + 5, centerY - (radius * i) / 5);
        }
    }

    /**
     * Draw axis labels for each bias type
     */
    private drawAxisLabels(centerX: number, centerY: number, radius: number): void {
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '12px Arial';

        const angleStep = (2 * Math.PI) / this.data!.biases.length;
        const labelRadius = radius + 30;

        for (let i = 0; i < this.data!.biases.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + labelRadius * Math.cos(angle);
            const y = centerY + labelRadius * Math.sin(angle);

            // Format bias name for display
            const label = this.formatBiasName(this.data!.biases[i]);
            
            // Adjust text alignment based on position
            if (x < centerX - 5) {
                this.ctx.textAlign = 'right';
            } else if (x > centerX + 5) {
                this.ctx.textAlign = 'left';
            } else {
                this.ctx.textAlign = 'center';
            }

            this.ctx.fillText(label, x, y);
        }
    }

    /**
     * Format bias name for display
     */
    private formatBiasName(biasType: CognitiveBiasType): string {
        const names: { [key in CognitiveBiasType]: string } = {
            'overconfidence': 'Overconfidence',
            'loss-aversion': 'Loss Aversion',
            'confirmation-bias': 'Confirmation',
            'anchoring': 'Anchoring',
            'availability-heuristic': 'Availability',
            'mental-accounting': 'Mental Accounting',
            'herd-mentality': 'Herd Mentality',
            'recency-bias': 'Recency',
            'sunk-cost-fallacy': 'Sunk Cost',
            'framing-effect': 'Framing'
        };
        return names[biasType] || biasType;
    }

    /**
     * Draw data polygon for scores
     */
    private drawDataPolygon(
        centerX: number, 
        centerY: number, 
        radius: number, 
        scores: number[], 
        color: string, 
        opacity: number
    ): void {
        if (scores.length === 0) return;

        const angleStep = (2 * Math.PI) / scores.length;

        // Fill polygon
        this.ctx.fillStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        this.ctx.beginPath();

        for (let i = 0; i < scores.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const scoreRadius = (radius * scores[i]) / 100;
            const x = centerX + scoreRadius * Math.cos(angle);
            const y = centerY + scoreRadius * Math.sin(angle);

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }

        this.ctx.closePath();
        this.ctx.fill();

        // Draw outline
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw data points
        this.ctx.fillStyle = color;
        for (let i = 0; i < scores.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const scoreRadius = (radius * scores[i]) / 100;
            const x = centerX + scoreRadius * Math.cos(angle);
            const y = centerY + scoreRadius * Math.sin(angle);

            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    /**
     * Setup event listeners for interactivity
     */
    private setupEventListeners(): void {
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }

    /**
     * Handle mouse move for tooltips
     */
    private handleMouseMove(event: MouseEvent): void {
        if (!this.data) return;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 60;

        // Check if mouse is over a data point
        const angleStep = (2 * Math.PI) / this.data.scores.length;
        
        for (let i = 0; i < this.data.scores.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const scoreRadius = (radius * this.data.scores[i]) / 100;
            const pointX = centerX + scoreRadius * Math.cos(angle);
            const pointY = centerY + scoreRadius * Math.sin(angle);

            const distance = Math.sqrt((mouseX - pointX) ** 2 + (mouseY - pointY) ** 2);
            
            if (distance < 10) {
                this.showTooltip(mouseX, mouseY, this.data.biases[i], this.data.scores[i], this.data.benchmarks[i]);
                this.canvas.style.cursor = 'pointer';
                return;
            }
        }

        this.hideTooltip();
        this.canvas.style.cursor = 'default';
    }

    /**
     * Handle mouse leave
     */
    private handleMouseLeave(): void {
        this.hideTooltip();
        this.canvas.style.cursor = 'default';
    }

    /**
     * Show tooltip with bias information
     */
    private showTooltip(x: number, y: number, biasType: CognitiveBiasType, userScore: number, benchmark: number): void {
        let tooltip = document.getElementById('bias-tooltip');
        
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'bias-tooltip';
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '8px 12px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '12px';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.zIndex = '1000';
            tooltip.style.maxWidth = '200px';
            document.body.appendChild(tooltip);
        }

        const biasName = this.formatBiasName(biasType);
        tooltip.innerHTML = `
            <strong>${biasName}</strong><br>
            Your Score: ${this.formatScore(userScore)}%<br>
            Population Avg: ${this.formatScore(benchmark)}%<br>
            ${userScore > benchmark ? 'Above average bias' : 'Below average bias'}
        `;

        const rect = this.canvas.getBoundingClientRect();
        tooltip.style.left = (rect.left + x + 10) + 'px';
        tooltip.style.top = (rect.top + y - 10) + 'px';
        tooltip.style.display = 'block';
    }

    /**
     * Hide tooltip
     */
    private hideTooltip(): void {
        const tooltip = document.getElementById('bias-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    /**
     * Export chart as image
     */
    public exportAsImage(filename: string = 'bias-radar-chart.png'): void {
        const link = document.createElement('a');
        link.download = filename;
        link.href = this.canvas.toDataURL();
        link.click();
    }

    /**
     * Resize chart to fit container
     */
    public resize(): void {
        const containerWidth = this.container.clientWidth;
        const size = Math.min(containerWidth - 40, 400);
        
        this.canvas.width = size;
        this.canvas.height = size;
        
        if (this.data) {
            this.render();
        }
    }

    private formatScore(score: number): string {
        if (typeof score !== 'number' || isNaN(score)) return 'N/A';
        if (score === 0) return '0';
        return score.toFixed(1);
    }
} 