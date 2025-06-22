/**
 * Health Score Display Component
 * Handles rendering of health score visualization
 */
import { ComprehensiveAnalysisResult } from '../../interfaces/analysis-types';
export declare class HealthScoreDisplay {
    private container;
    constructor(containerId: string);
    render(analysisResult: ComprehensiveAnalysisResult): void;
    private generateHTML;
    private updateHealthScoreCircle;
    private getHealthLevelText;
}
//# sourceMappingURL=HealthScoreDisplay.d.ts.map