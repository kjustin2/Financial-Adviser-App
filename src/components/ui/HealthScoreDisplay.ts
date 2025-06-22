/**
 * Health Score Display Component
 * Handles rendering of health score visualization
 */

import { ComprehensiveAnalysisResult } from '../../interfaces/analysis-types';

export class HealthScoreDisplay {
    private container: HTMLElement;

    constructor(containerId: string) {
        const element = document.getElementById(containerId);
        if (!element) {
            throw new Error(`Element with ID ${containerId} not found`);
        }
        this.container = element;
    }

    public render(analysisResult: ComprehensiveAnalysisResult): void {
        this.container.innerHTML = this.generateHTML(analysisResult);
        this.updateHealthScoreCircle(analysisResult);
    }

    private generateHTML(analysisResult: ComprehensiveAnalysisResult): string {
        return `
            <div class="health-score-summary">
                <div class="health-score-circle-container">
                    <div id="healthScoreCircle" class="health-score-circle score-${analysisResult.healthLevel}">
                        <div class="health-score-inner">
                            <span id="healthScoreValue" class="health-score-value">${analysisResult.overallHealthScore}</span>
                            <span class="health-score-label">Health Score</span>
                        </div>
                    </div>
                </div>
                <div class="health-score-details">
                    <h2 id="healthLevelText" class="health-level-text">${this.getHealthLevelText(analysisResult.healthLevel)}</h2>
                    <p class="health-score-description">
                        Your financial health score is based on 8 key indicators from the Financial Health Network research.
                    </p>
                </div>
            </div>
        `;
    }

    private updateHealthScoreCircle(analysisResult: ComprehensiveAnalysisResult): void {
        const circle = this.container.querySelector('#healthScoreCircle') as HTMLElement;
        if (circle) {
            circle.className = `health-score-circle score-${analysisResult.healthLevel}`;
            
            // Add CSS custom property for score percentage
            const percentage = (analysisResult.overallHealthScore / 100) * 360;
            circle.style.setProperty('--score-percentage', `${percentage}deg`);
        }
    }

    private getHealthLevelText(healthLevel: string): string {
        const levelMap: { [key: string]: string } = {
            'excellent': 'Excellent Financial Health',
            'good': 'Good Financial Health',
            'fair': 'Fair Financial Health',
            'limited': 'Limited Financial Health',
            'critical': 'Critical Financial Health'
        };
        return levelMap[healthLevel] || 'Unknown Health Level';
    }


} 