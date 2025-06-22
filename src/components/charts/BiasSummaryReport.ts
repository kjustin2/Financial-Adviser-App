/**
 * Bias Summary Report Component
 * 
 * Creates a comprehensive report display of all cognitive bias detection results
 * with severity levels, recommendations, and action items.
 */

import { BiasDetectionResult, MitigationStrategy, CognitiveBiasType } from '../../types';

export class BiasSummaryReport {
    private container: HTMLElement;
    private data?: {
        biasResults: BiasDetectionResult[];
        mitigationStrategies: MitigationStrategy[];
        overallRisk: 'low' | 'moderate' | 'high' | 'severe';
    };

    constructor(containerId: string) {
        this.container = document.getElementById(containerId) || document.createElement('div');
        this.setupContainer();
    }

    /**
     * Update report with new bias detection results
     */
    public updateData(
        biasResults: BiasDetectionResult[], 
        mitigationStrategies: MitigationStrategy[]
    ): void {
        this.data = {
            biasResults,
            mitigationStrategies,
            overallRisk: this.calculateOverallRisk(biasResults)
        };
        this.render();
    }

    /**
     * Setup container structure
     */
    private setupContainer(): void {
        this.container.innerHTML = '';
        this.container.style.fontFamily = 'Arial, sans-serif';
        this.container.style.lineHeight = '1.6';
        this.container.style.color = '#333';
        this.container.style.maxWidth = '800px';
        this.container.style.margin = '0 auto';
    }

    /**
     * Calculate overall risk level from individual biases
     */
    private calculateOverallRisk(biasResults: BiasDetectionResult[]): 'low' | 'moderate' | 'high' | 'severe' {
        if (biasResults.length === 0) return 'low';

        const severityWeights = { 'low': 1, 'moderate': 2, 'high': 3, 'severe': 4 };
        const totalWeight = biasResults.reduce((sum, bias) => {
            return sum + (severityWeights[bias.severity] * bias.confidence);
        }, 0);
        
        const averageWeight = totalWeight / biasResults.length;
        
        if (averageWeight >= 3.5) return 'severe';
        if (averageWeight >= 2.5) return 'high';
        if (averageWeight >= 1.5) return 'moderate';
        return 'low';
    }

    /**
     * Get color for severity level
     */
    private getSeverityColor(severity: 'low' | 'moderate' | 'high' | 'severe'): string {
        const colors = {
            'low': '#28a745',
            'moderate': '#ffc107',
            'high': '#fd7e14',
            'severe': '#dc3545'
        };
        return colors[severity];
    }

    /**
     * Render the complete bias summary report
     */
    private render(): void {
        if (!this.data) return;

        this.container.innerHTML = '';

        // Report header
        this.renderHeader();

        // Executive summary
        this.renderExecutiveSummary();

        // Detailed bias breakdown
        this.renderBiasBreakdown();

        // Mitigation strategies
        this.renderMitigationStrategies();

        // Action plan
        this.renderActionPlan();

        // Footer
        this.renderFooter();
    }

    /**
     * Render report header
     */
    private renderHeader(): void {
        const header = document.createElement('div');
        header.style.textAlign = 'center';
        header.style.marginBottom = '30px';
        header.style.borderBottom = '2px solid #eee';
        header.style.paddingBottom = '20px';

        const title = document.createElement('h1');
        title.textContent = 'Cognitive Bias Assessment Report';
        title.style.color = '#2c3e50';
        title.style.marginBottom = '10px';

        const subtitle = document.createElement('p');
        subtitle.textContent = `Generated on ${new Date().toLocaleDateString()}`;
        subtitle.style.color = '#6c757d';
        subtitle.style.fontSize = '14px';

        header.appendChild(title);
        header.appendChild(subtitle);
        this.container.appendChild(header);
    }

    /**
     * Render executive summary section
     */
    private renderExecutiveSummary(): void {
        const section = document.createElement('div');
        section.style.marginBottom = '30px';

        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Executive Summary';
        sectionTitle.style.color = '#2c3e50';
        sectionTitle.style.borderBottom = '1px solid #dee2e6';
        sectionTitle.style.paddingBottom = '10px';

        const summaryContent = document.createElement('div');
        summaryContent.style.backgroundColor = '#f8f9fa';
        summaryContent.style.padding = '20px';
        summaryContent.style.borderRadius = '8px';
        summaryContent.style.borderLeft = `4px solid ${this.getSeverityColor(this.data!.overallRisk)}`;

        const overallRiskText = document.createElement('p');
        overallRiskText.innerHTML = `<strong>Overall Risk Level:</strong> <span style="color: ${this.getSeverityColor(this.data!.overallRisk)}; text-transform: uppercase; font-weight: bold;">${this.data!.overallRisk}</span>`;

        const biasCount = document.createElement('p');
        biasCount.innerHTML = `<strong>Biases Detected:</strong> ${this.data!.biasResults.length} cognitive biases identified`;

        const highSeverityCount = this.data!.biasResults.filter(b => b.severity === 'high' || b.severity === 'severe').length;
        const priorityText = document.createElement('p');
        priorityText.innerHTML = `<strong>Priority Actions:</strong> ${highSeverityCount} high-priority biases require immediate attention`;

        summaryContent.appendChild(overallRiskText);
        summaryContent.appendChild(biasCount);
        summaryContent.appendChild(priorityText);

        section.appendChild(sectionTitle);
        section.appendChild(summaryContent);
        this.container.appendChild(section);
    }

    /**
     * Render detailed bias breakdown
     */
    private renderBiasBreakdown(): void {
        const section = document.createElement('div');
        section.style.marginBottom = '30px';

        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Detailed Bias Analysis';
        sectionTitle.style.color = '#2c3e50';
        sectionTitle.style.borderBottom = '1px solid #dee2e6';
        sectionTitle.style.paddingBottom = '10px';

        // Sort biases by severity and confidence
        const sortedBiases = [...this.data!.biasResults].sort((a, b) => {
            const severityOrder = { 'severe': 4, 'high': 3, 'moderate': 2, 'low': 1 };
            if (severityOrder[a.severity] !== severityOrder[b.severity]) {
                return severityOrder[b.severity] - severityOrder[a.severity];
            }
            return b.confidence - a.confidence;
        });

        sortedBiases.forEach((bias, index) => {
            const biasCard = this.createBiasCard(bias, index + 1);
            section.appendChild(biasCard);
        });

        section.appendChild(sectionTitle);
        this.container.appendChild(section);
    }

    /**
     * Create individual bias card
     */
    private createBiasCard(bias: BiasDetectionResult, index: number): HTMLElement {
        const card = document.createElement('div');
        card.style.border = '1px solid #dee2e6';
        card.style.borderRadius = '8px';
        card.style.marginBottom = '20px';
        card.style.overflow = 'hidden';

        // Card header
        const header = document.createElement('div');
        header.style.backgroundColor = this.getSeverityColor(bias.severity);
        header.style.color = 'white';
        header.style.padding = '15px';
        header.style.fontWeight = 'bold';

        const headerText = document.createElement('div');
        headerText.style.display = 'flex';
        headerText.style.justifyContent = 'space-between';
        headerText.style.alignItems = 'center';

        const biasName = document.createElement('span');
        biasName.textContent = `${index}. ${this.formatBiasName(bias.biasType)}`;

        const severityBadge = document.createElement('span');
        severityBadge.textContent = bias.severity.toUpperCase();
        severityBadge.style.fontSize = '12px';
        severityBadge.style.backgroundColor = 'rgba(255,255,255,0.2)';
        severityBadge.style.padding = '4px 8px';
        severityBadge.style.borderRadius = '4px';

        headerText.appendChild(biasName);
        headerText.appendChild(severityBadge);
        header.appendChild(headerText);

        // Card body
        const body = document.createElement('div');
        body.style.padding = '20px';

        // Description
        const description = document.createElement('p');
        description.textContent = bias.description;
        description.style.fontStyle = 'italic';
        description.style.marginBottom = '15px';
        description.style.color = '#6c757d';

        // Confidence score
        const confidence = document.createElement('p');
        confidence.innerHTML = `<strong>Confidence Level:</strong> ${Math.round(bias.confidence * 100)}%`;
        confidence.style.marginBottom = '15px';

        // Evidence section
        const evidenceTitle = document.createElement('h4');
        evidenceTitle.textContent = 'Evidence';
        evidenceTitle.style.color = '#495057';
        evidenceTitle.style.marginBottom = '10px';

        const evidenceList = document.createElement('ul');
        evidenceList.style.marginBottom = '15px';
        
        bias.indicators.forEach(indicator => {
            const li = document.createElement('li');
            li.textContent = indicator;
            li.style.marginBottom = '5px';
            evidenceList.appendChild(li);
        });

        body.appendChild(description);
        body.appendChild(confidence);
        body.appendChild(evidenceTitle);
        body.appendChild(evidenceList);

        card.appendChild(header);
        card.appendChild(body);

        return card;
    }

    /**
     * Render mitigation strategies section
     */
    private renderMitigationStrategies(): void {
        const section = document.createElement('div');
        section.style.marginBottom = '30px';

        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Recommended Mitigation Strategies';
        sectionTitle.style.color = '#2c3e50';
        sectionTitle.style.borderBottom = '1px solid #dee2e6';
        sectionTitle.style.paddingBottom = '10px';

        // Group strategies by timeframe
        const immediateStrategies = this.data!.mitigationStrategies.filter(s => s.timeframe === 'immediate');
        const shortTermStrategies = this.data!.mitigationStrategies.filter(s => s.timeframe === 'short-term');
        const longTermStrategies = this.data!.mitigationStrategies.filter(s => s.timeframe === 'long-term');

        if (immediateStrategies.length > 0) {
            this.renderStrategyGroup('Immediate Actions', immediateStrategies, '#dc3545', section);
        }
        if (shortTermStrategies.length > 0) {
            this.renderStrategyGroup('Short-term Strategies', shortTermStrategies, '#fd7e14', section);
        }
        if (longTermStrategies.length > 0) {
            this.renderStrategyGroup('Long-term Development', longTermStrategies, '#28a745', section);
        }

        section.appendChild(sectionTitle);
        this.container.appendChild(section);
    }

    /**
     * Render strategy group
     */
    private renderStrategyGroup(
        title: string, 
        strategies: MitigationStrategy[], 
        color: string, 
        parent: HTMLElement
    ): void {
        const groupDiv = document.createElement('div');
        groupDiv.style.marginBottom = '25px';

        const groupTitle = document.createElement('h3');
        groupTitle.textContent = title;
        groupTitle.style.color = color;
        groupTitle.style.marginBottom = '15px';

        const strategiesList = document.createElement('div');
        
        strategies.forEach(strategy => {
            const strategyItem = document.createElement('div');
            strategyItem.style.backgroundColor = '#f8f9fa';
            strategyItem.style.padding = '15px';
            strategyItem.style.marginBottom = '10px';
            strategyItem.style.borderRadius = '6px';
            strategyItem.style.borderLeft = `3px solid ${color}`;

            const strategyTitle = document.createElement('h4');
            strategyTitle.textContent = strategy.strategy;
            strategyTitle.style.marginBottom = '10px';
            strategyTitle.style.color = '#495057';

            const techniquesList = document.createElement('ul');
            strategy.techniques.forEach(technique => {
                const li = document.createElement('li');
                li.textContent = technique;
                techniquesList.appendChild(li);
            });

            strategyItem.appendChild(strategyTitle);
            strategyItem.appendChild(techniquesList);
            strategiesList.appendChild(strategyItem);
        });

        groupDiv.appendChild(groupTitle);
        groupDiv.appendChild(strategiesList);
        parent.appendChild(groupDiv);
    }

    /**
     * Render action plan section
     */
    private renderActionPlan(): void {
        const section = document.createElement('div');
        section.style.marginBottom = '30px';

        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Next Steps Action Plan';
        sectionTitle.style.color = '#2c3e50';
        sectionTitle.style.borderBottom = '1px solid #dee2e6';
        sectionTitle.style.paddingBottom = '10px';

        const actionPlan = document.createElement('div');
        actionPlan.style.backgroundColor = '#e7f3ff';
        actionPlan.style.padding = '20px';
        actionPlan.style.borderRadius = '8px';
        actionPlan.style.border = '1px solid #b3d7ff';

        const planText = document.createElement('div');
        planText.innerHTML = `
            <h4 style="margin-bottom: 15px; color: #0056b3;">Recommended Implementation Timeline:</h4>
            <ol style="margin-bottom: 15px;">
                <li><strong>Week 1-2:</strong> Implement immediate mitigation strategies for high-severity biases</li>
                <li><strong>Month 1:</strong> Begin short-term behavioral modifications and tracking</li>
                <li><strong>Month 2-3:</strong> Establish long-term habits and decision-making frameworks</li>
                <li><strong>Month 6:</strong> Reassess cognitive biases to measure improvement</li>
            </ol>
            <p><strong>Key Success Metrics:</strong> Reduction in bias severity scores, improved decision consistency, and increased awareness of cognitive patterns.</p>
        `;

        actionPlan.appendChild(planText);
        section.appendChild(sectionTitle);
        section.appendChild(actionPlan);
        this.container.appendChild(section);
    }

    /**
     * Render footer
     */
    private renderFooter(): void {
        const footer = document.createElement('div');
        footer.style.borderTop = '1px solid #dee2e6';
        footer.style.paddingTop = '20px';
        footer.style.textAlign = 'center';
        footer.style.color = '#6c757d';
        footer.style.fontSize = '12px';

        footer.innerHTML = `
            <p><strong>Disclaimer:</strong> This assessment is for educational purposes and should not replace professional financial advice.</p>
            <p>For questions about this report or personalized guidance, consult with a qualified financial advisor.</p>
        `;

        this.container.appendChild(footer);
    }

    /**
     * Format bias name for display
     */
    private formatBiasName(biasType: CognitiveBiasType): string {
        const names: { [key in CognitiveBiasType]: string } = {
            'overconfidence': 'Overconfidence Bias',
            'loss-aversion': 'Loss Aversion',
            'confirmation-bias': 'Confirmation Bias',
            'anchoring': 'Anchoring Bias',
            'availability-heuristic': 'Availability Heuristic',
            'mental-accounting': 'Mental Accounting',
            'herd-mentality': 'Herd Mentality',
            'recency-bias': 'Recency Bias',
            'sunk-cost-fallacy': 'Sunk Cost Fallacy',
            'framing-effect': 'Framing Effect'
        };
        return names[biasType];
    }

    /**
     * Print report - opens a print-friendly version of the report
     */
    public printReport(): void {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Cognitive Bias Assessment Report</title>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
                            h1, h2, h3, h4 { color: #2c3e50; }
                            .bias-card { margin-bottom: 20px; border: 1px solid #ddd; }
                            .bias-header { padding: 15px; font-weight: bold; color: white; }
                            .bias-body { padding: 20px; }
                            @media print { body { margin: 20px; } }
                        </style>
                    </head>
                    <body>
                        ${this.container.innerHTML}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    }
} 