/**
 * MitigationReport.ts
 * 
 * Component for displaying personalized bias mitigation recommendations
 * Shows comprehensive mitigation plan with timelines, strategies, and tracking
 */

import { MitigationPlan, EnhancedMitigationStrategy, CognitiveBiasType } from '../../types';

export class MitigationReport {
    private container: HTMLElement;
    private plan?: MitigationPlan;

    constructor(containerId: string) {
        this.container = document.getElementById(containerId) || document.createElement('div');
        this.setupContainer();
    }

    /**
     * Update the report with a new mitigation plan
     */
    public updatePlan(plan: MitigationPlan): void {
        this.plan = plan;
        this.render();
    }

    /**
     * Set up the container with basic styling
     */
    private setupContainer(): void {
        this.container.style.fontFamily = 'Arial, sans-serif';
        this.container.style.lineHeight = '1.6';
        this.container.style.color = '#333';
    }

    /**
     * Render the complete mitigation report
     */
    private render(): void {
        if (!this.plan) {
            this.container.innerHTML = '<p>No mitigation plan available.</p>';
            return;
        }

        this.container.innerHTML = '';

        // Create main sections
        this.renderHeader();
        this.renderOverviewSection();
        this.renderPriorityBiases();
        this.renderStrategies();
        this.renderTimeline();
        this.renderTracking();
        this.renderExpectedOutcomes();
    }

    /**
     * Render report header
     */
    private renderHeader(): void {
        const header = document.createElement('div');
        header.style.borderBottom = '2px solid #3b82f6';
        header.style.paddingBottom = '20px';
        header.style.marginBottom = '30px';

        const title = document.createElement('h1');
        title.textContent = 'Personalized Bias Mitigation Plan';
        title.style.color = '#3b82f6';
        title.style.margin = '0 0 10px 0';

        const date = document.createElement('p');
        date.textContent = `Generated on ${this.plan!.generatedAt.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}`;
        date.style.color = '#666';
        date.style.margin = '0';

        header.appendChild(title);
        header.appendChild(date);
        this.container.appendChild(header);
    }

    /**
     * Render overview section with risk level
     */
    private renderOverviewSection(): void {
        const section = document.createElement('div');
        section.style.marginBottom = '30px';
        section.style.padding = '20px';
        section.style.backgroundColor = this.getRiskColor(this.plan!.overallRiskLevel, 0.1);
        section.style.borderRadius = '8px';
        section.style.border = `2px solid ${this.getRiskColor(this.plan!.overallRiskLevel, 1)}`;

        const title = document.createElement('h2');
        title.textContent = 'Overall Assessment';
        title.style.color = '#2c3e50';
        title.style.marginBottom = '15px';

        const riskLabel = document.createElement('div');
        riskLabel.style.display = 'inline-block';
        riskLabel.style.padding = '8px 16px';
        riskLabel.style.backgroundColor = this.getRiskColor(this.plan!.overallRiskLevel, 1);
        riskLabel.style.color = 'white';
        riskLabel.style.borderRadius = '20px';
        riskLabel.style.fontWeight = 'bold';
        riskLabel.style.textTransform = 'uppercase';
        riskLabel.textContent = `${this.plan!.overallRiskLevel} Risk Level`;

        const description = document.createElement('p');
        description.style.marginTop = '15px';
        description.innerHTML = this.getRiskDescription(this.plan!.overallRiskLevel);

        section.appendChild(title);
        section.appendChild(riskLabel);
        section.appendChild(description);
        this.container.appendChild(section);
    }

    /**
     * Render priority biases section
     */
    private renderPriorityBiases(): void {
        const section = document.createElement('div');
        section.style.marginBottom = '30px';

        const title = document.createElement('h2');
        title.textContent = 'Priority Biases to Address';
        title.style.color = '#2c3e50';
        title.style.borderBottom = '1px solid #dee2e6';
        title.style.paddingBottom = '10px';
        title.style.marginBottom = '20px';

        const biasGrid = document.createElement('div');
        biasGrid.style.display = 'grid';
        biasGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
        biasGrid.style.gap = '15px';

        this.plan!.priorityBiases.forEach((bias, index) => {
            const biasCard = this.createBiasCard(bias, index + 1);
            biasGrid.appendChild(biasCard);
        });

        section.appendChild(title);
        section.appendChild(biasGrid);
        this.container.appendChild(section);
    }

    /**
     * Create a bias card
     */
    private createBiasCard(bias: CognitiveBiasType, priority: number): HTMLElement {
        const card = document.createElement('div');
        card.style.padding = '15px';
        card.style.backgroundColor = '#f8f9fa';
        card.style.borderRadius = '8px';
        card.style.borderLeft = `4px solid ${this.getPriorityColor(priority)}`;

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '10px';

        const biasName = document.createElement('h3');
        biasName.textContent = this.formatBiasName(bias);
        biasName.style.margin = '0';
        biasName.style.color = '#495057';

        const priorityBadge = document.createElement('span');
        priorityBadge.textContent = `#${priority}`;
        priorityBadge.style.backgroundColor = this.getPriorityColor(priority);
        priorityBadge.style.color = 'white';
        priorityBadge.style.padding = '4px 8px';
        priorityBadge.style.borderRadius = '12px';
        priorityBadge.style.fontSize = '12px';
        priorityBadge.style.fontWeight = 'bold';

        const description = document.createElement('p');
        description.textContent = this.getBiasDescription(bias);
        description.style.margin = '0';
        description.style.fontSize = '14px';
        description.style.color = '#6c757d';

        header.appendChild(biasName);
        header.appendChild(priorityBadge);
        card.appendChild(header);
        card.appendChild(description);

        return card;
    }

    /**
     * Render strategies section
     */
    private renderStrategies(): void {
        const section = document.createElement('div');
        section.style.marginBottom = '30px';

        const title = document.createElement('h2');
        title.textContent = 'Recommended Strategies';
        title.style.color = '#2c3e50';
        title.style.borderBottom = '1px solid #dee2e6';
        title.style.paddingBottom = '10px';
        title.style.marginBottom = '20px';

        const strategiesContainer = document.createElement('div');
        
        this.plan!.strategies.forEach((strategy, index) => {
            const strategyCard = this.createStrategyCard(strategy, index);
            strategiesContainer.appendChild(strategyCard);
        });

        section.appendChild(title);
        section.appendChild(strategiesContainer);
        this.container.appendChild(section);
    }

    /**
     * Create a strategy card
     */
    private createStrategyCard(strategy: EnhancedMitigationStrategy, _index: number): HTMLElement {
        const card = document.createElement('div');
        card.style.padding = '20px';
        card.style.backgroundColor = '#ffffff';
        card.style.border = '1px solid #dee2e6';
        card.style.borderRadius = '8px';
        card.style.marginBottom = '20px';
        card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

        // Header
        const header = document.createElement('div');
        header.style.marginBottom = '15px';

        const title = document.createElement('h3');
        title.textContent = strategy.title;
        title.style.margin = '0 0 8px 0';
        title.style.color = '#2c3e50';

        const badges = document.createElement('div');
        badges.style.display = 'flex';
        badges.style.gap = '8px';
        badges.style.flexWrap = 'wrap';

        // Effectiveness badge
        const effectivenessBadge = document.createElement('span');
        effectivenessBadge.textContent = `${strategy.effectiveness}/10 Effectiveness`;
        effectivenessBadge.style.backgroundColor = this.getEffectivenessColor(strategy.effectiveness);
        effectivenessBadge.style.color = 'white';
        effectivenessBadge.style.padding = '4px 8px';
        effectivenessBadge.style.borderRadius = '12px';
        effectivenessBadge.style.fontSize = '12px';

        // Difficulty badge
        const difficultyBadge = document.createElement('span');
        difficultyBadge.textContent = strategy.difficulty;
        difficultyBadge.style.backgroundColor = this.getDifficultyColor(strategy.difficulty);
        difficultyBadge.style.color = 'white';
        difficultyBadge.style.padding = '4px 8px';
        difficultyBadge.style.borderRadius = '12px';
        difficultyBadge.style.fontSize = '12px';
        difficultyBadge.style.textTransform = 'capitalize';

        badges.appendChild(effectivenessBadge);
        badges.appendChild(difficultyBadge);

        header.appendChild(title);
        header.appendChild(badges);

        // Description
        const description = document.createElement('p');
        description.textContent = strategy.description;
        description.style.color = '#6c757d';
        description.style.marginBottom = '15px';

        // Implementation details
        const implementation = document.createElement('div');
        implementation.style.backgroundColor = '#f8f9fa';
        implementation.style.padding = '15px';
        implementation.style.borderRadius = '6px';
        implementation.style.marginBottom = '15px';

        const implementationTitle = document.createElement('h4');
        implementationTitle.textContent = 'Implementation Steps';
        implementationTitle.style.margin = '0 0 10px 0';
        implementationTitle.style.color = '#495057';

        const immediateActions = document.createElement('div');
        immediateActions.innerHTML = `
            <strong>Immediate Actions:</strong>
            <ul style="margin: 5px 0 10px 20px;">
                ${strategy.implementation.immediateActions.map(action => `<li>${action}</li>`).join('')}
            </ul>
        `;

        const gradualChanges = document.createElement('div');
        gradualChanges.innerHTML = `
            <strong>Gradual Changes:</strong>
            <ul style="margin: 5px 0 10px 20px;">
                ${strategy.implementation.gradualChanges.map(change => `<li>${change}</li>`).join('')}
            </ul>
        `;

        implementation.appendChild(implementationTitle);
        implementation.appendChild(immediateActions);
        implementation.appendChild(gradualChanges);

        // Personalized approach
        const personalized = document.createElement('div');
        personalized.style.backgroundColor = '#e7f3ff';
        personalized.style.padding = '12px';
        personalized.style.borderRadius = '6px';
        personalized.style.borderLeft = '4px solid #007bff';

        const personalizedTitle = document.createElement('strong');
        personalizedTitle.textContent = 'Personalized for You: ';
        personalizedTitle.style.color = '#007bff';

        const personalizedText = document.createElement('span');
        personalizedText.textContent = strategy.personalizedApproach;

        personalized.appendChild(personalizedTitle);
        personalized.appendChild(personalizedText);

        card.appendChild(header);
        card.appendChild(description);
        card.appendChild(implementation);
        card.appendChild(personalized);

        return card;
    }

    /**
     * Render timeline section
     */
    private renderTimeline(): void {
        const section = document.createElement('div');
        section.style.marginBottom = '30px';

        const title = document.createElement('h2');
        title.textContent = 'Implementation Timeline';
        title.style.color = '#2c3e50';
        title.style.borderBottom = '1px solid #dee2e6';
        title.style.paddingBottom = '10px';
        title.style.marginBottom = '20px';

        const timeline = document.createElement('div');
        timeline.style.display = 'grid';
        timeline.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
        timeline.style.gap = '20px';

        // Phase 1
        const phase1 = this.createPhaseCard(
            'Phase 1', 
            this.plan!.timeline.phase1.weeks, 
            this.plan!.timeline.phase1.focus,
            this.plan!.timeline.phase1.strategies,
            '#28a745'
        );

        // Phase 2
        const phase2 = this.createPhaseCard(
            'Phase 2', 
            this.plan!.timeline.phase2.weeks, 
            this.plan!.timeline.phase2.focus,
            this.plan!.timeline.phase2.strategies,
            '#fd7e14'
        );

        // Phase 3
        const phase3 = this.createPhaseCard(
            'Phase 3', 
            this.plan!.timeline.phase3.weeks, 
            this.plan!.timeline.phase3.focus,
            this.plan!.timeline.phase3.strategies,
            '#6f42c1'
        );

        timeline.appendChild(phase1);
        timeline.appendChild(phase2);
        timeline.appendChild(phase3);

        section.appendChild(title);
        section.appendChild(timeline);
        this.container.appendChild(section);
    }

    /**
     * Create a phase card for timeline
     */
    private createPhaseCard(
        phase: string, 
        weeks: number, 
        focus: string, 
        strategies: string[],
        color: string
    ): HTMLElement {
        const card = document.createElement('div');
        card.style.padding = '20px';
        card.style.backgroundColor = '#ffffff';
        card.style.border = `2px solid ${color}`;
        card.style.borderRadius = '8px';

        const header = document.createElement('div');
        header.style.marginBottom = '15px';

        const phaseTitle = document.createElement('h3');
        phaseTitle.textContent = phase;
        phaseTitle.style.margin = '0 0 5px 0';
        phaseTitle.style.color = color;

        const duration = document.createElement('p');
        duration.textContent = `${weeks} weeks`;
        duration.style.margin = '0';
        duration.style.color = '#6c757d';
        duration.style.fontWeight = 'bold';

        const focusText = document.createElement('p');
        focusText.textContent = focus;
        focusText.style.margin = '15px 0';
        focusText.style.fontStyle = 'italic';

        const strategiesList = document.createElement('div');
        strategiesList.innerHTML = `
            <strong>Strategies:</strong>
            <ul style="margin: 5px 0 0 20px;">
                ${strategies.map(strategyId => {
                    const strategy = this.plan!.strategies.find(s => s.id === strategyId);
                    return `<li>${strategy ? strategy.title : strategyId}</li>`;
                }).join('')}
            </ul>
        `;

        header.appendChild(phaseTitle);
        header.appendChild(duration);
        card.appendChild(header);
        card.appendChild(focusText);
        card.appendChild(strategiesList);

        return card;
    }

    /**
     * Render tracking section
     */
    private renderTracking(): void {
        const section = document.createElement('div');
        section.style.marginBottom = '30px';

        const title = document.createElement('h2');
        title.textContent = 'Progress Tracking';
        title.style.color = '#2c3e50';
        title.style.borderBottom = '1px solid #dee2e6';
        title.style.paddingBottom = '10px';
        title.style.marginBottom = '20px';

        const trackingGrid = document.createElement('div');
        trackingGrid.style.display = 'grid';
        trackingGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
        trackingGrid.style.gap = '20px';

        // Metrics card
        const metricsCard = document.createElement('div');
        metricsCard.style.padding = '20px';
        metricsCard.style.backgroundColor = '#f8f9fa';
        metricsCard.style.borderRadius = '8px';

        const metricsTitle = document.createElement('h3');
        metricsTitle.textContent = 'Key Metrics to Track';
        metricsTitle.style.margin = '0 0 15px 0';
        metricsTitle.style.color = '#495057';

        const metricsList = document.createElement('ul');
        metricsList.style.marginLeft = '20px';
        this.plan!.trackingRecommendations.metrics.forEach(metric => {
            const li = document.createElement('li');
            li.textContent = metric;
            li.style.marginBottom = '8px';
            metricsList.appendChild(li);
        });

        metricsCard.appendChild(metricsTitle);
        metricsCard.appendChild(metricsList);

        // Methods card
        const methodsCard = document.createElement('div');
        methodsCard.style.padding = '20px';
        methodsCard.style.backgroundColor = '#f8f9fa';
        methodsCard.style.borderRadius = '8px';

        const methodsTitle = document.createElement('h3');
        methodsTitle.textContent = 'Tracking Methods';
        methodsTitle.style.margin = '0 0 15px 0';
        methodsTitle.style.color = '#495057';

        const methodsList = document.createElement('ul');
        methodsList.style.marginLeft = '20px';
        this.plan!.trackingRecommendations.methods.forEach(method => {
            const li = document.createElement('li');
            li.textContent = method;
            li.style.marginBottom = '8px';
            methodsList.appendChild(li);
        });

        const frequency = document.createElement('p');
        frequency.innerHTML = `<strong>Frequency:</strong> ${this.plan!.trackingRecommendations.frequency}`;
        frequency.style.marginTop = '15px';
        frequency.style.color = '#6c757d';

        methodsCard.appendChild(methodsTitle);
        methodsCard.appendChild(methodsList);
        methodsCard.appendChild(frequency);

        trackingGrid.appendChild(metricsCard);
        trackingGrid.appendChild(methodsCard);

        section.appendChild(title);
        section.appendChild(trackingGrid);
        this.container.appendChild(section);
    }

    /**
     * Render expected outcomes section
     */
    private renderExpectedOutcomes(): void {
        const section = document.createElement('div');
        section.style.marginBottom = '30px';

        const title = document.createElement('h2');
        title.textContent = 'Expected Outcomes';
        title.style.color = '#2c3e50';
        title.style.borderBottom = '1px solid #dee2e6';
        title.style.paddingBottom = '10px';
        title.style.marginBottom = '20px';

        const outcomesGrid = document.createElement('div');
        outcomesGrid.style.display = 'grid';
        outcomesGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
        outcomesGrid.style.gap = '20px';

        // Short-term outcomes
        const shortTerm = this.createOutcomeCard(
            'Short-term (1-3 months)',
            this.plan!.expectedOutcomes.shortTerm,
            '#28a745'
        );

        // Medium-term outcomes
        const mediumTerm = this.createOutcomeCard(
            'Medium-term (3-12 months)',
            this.plan!.expectedOutcomes.mediumTerm,
            '#fd7e14'
        );

        // Long-term outcomes
        const longTerm = this.createOutcomeCard(
            'Long-term (1+ years)',
            this.plan!.expectedOutcomes.longTerm,
            '#6f42c1'
        );

        outcomesGrid.appendChild(shortTerm);
        outcomesGrid.appendChild(mediumTerm);
        outcomesGrid.appendChild(longTerm);

        section.appendChild(title);
        section.appendChild(outcomesGrid);
        this.container.appendChild(section);
    }

    /**
     * Create outcome card
     */
    private createOutcomeCard(title: string, outcomes: string[], color: string): HTMLElement {
        const card = document.createElement('div');
        card.style.padding = '20px';
        card.style.backgroundColor = '#ffffff';
        card.style.border = `1px solid ${color}`;
        card.style.borderRadius = '8px';

        const cardTitle = document.createElement('h3');
        cardTitle.textContent = title;
        cardTitle.style.margin = '0 0 15px 0';
        cardTitle.style.color = color;

        const outcomesList = document.createElement('ul');
        outcomesList.style.marginLeft = '20px';
        outcomes.forEach(outcome => {
            const li = document.createElement('li');
            li.textContent = outcome;
            li.style.marginBottom = '8px';
            outcomesList.appendChild(li);
        });

        card.appendChild(cardTitle);
        card.appendChild(outcomesList);

        return card;
    }

    // Helper methods for styling and content

    private getRiskColor(riskLevel: string, opacity: number): string {
        const colors = {
            low: '#28a745',
            medium: '#fd7e14',
            high: '#dc3545',
            critical: '#6f2232'
        };
        
        if (opacity === 1) {
            return colors[riskLevel as keyof typeof colors] || '#6c757d';
        }
        
        const color = colors[riskLevel as keyof typeof colors] || '#6c757d';
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    private getRiskDescription(riskLevel: string): string {
        const descriptions = {
            low: 'Your cognitive biases pose minimal risk to your financial decisions. Focus on maintaining good habits and occasional monitoring.',
            medium: 'Some biases may be affecting your financial choices. Implementing targeted strategies will help improve decision-making.',
            high: 'Multiple significant biases are likely impacting your financial decisions. Immediate attention and structured interventions are recommended.',
            critical: 'Severe bias patterns detected that could seriously harm your financial wellbeing. Urgent intervention required with potential professional guidance.'
        };
        
        return descriptions[riskLevel as keyof typeof descriptions] || 'Assessment completed.';
    }

    private getPriorityColor(priority: number): string {
        if (priority <= 2) return '#dc3545';
        if (priority <= 4) return '#fd7e14';
        return '#28a745';
    }

    private formatBiasName(bias: CognitiveBiasType): string {
        return bias.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    private getBiasDescription(bias: CognitiveBiasType): string {
        const descriptions = {
            'overconfidence': 'Overestimating your knowledge or ability to predict outcomes',
            'loss-aversion': 'Feeling losses more acutely than equivalent gains',
            'confirmation-bias': 'Seeking information that confirms existing beliefs',
            'anchoring': 'Over-relying on the first piece of information encountered',
            'availability-heuristic': 'Overweighting easily recalled examples',
            'mental-accounting': 'Treating money differently based on its source or purpose',
            'herd-mentality': 'Following the crowd without independent analysis',
            'recency-bias': 'Giving greater weight to recent events',
            'sunk-cost-fallacy': 'Continuing investments due to past costs rather than future value',
            'framing-effect': 'Making different decisions based on how information is presented'
        };
        
        return descriptions[bias] || 'A cognitive bias affecting financial decision-making';
    }

    private getEffectivenessColor(effectiveness: number): string {
        if (effectiveness >= 8) return '#28a745';
        if (effectiveness >= 6) return '#fd7e14';
        return '#dc3545';
    }

    private getDifficultyColor(difficulty: string): string {
        const colors = {
            low: '#28a745',
            medium: '#fd7e14',
            high: '#dc3545'
        };
        
        return colors[difficulty as keyof typeof colors] || '#6c757d';
    }
} 