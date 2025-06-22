/**
 * Behavioral Assessment Form Component
 * Multi-step questionnaire for collecting user behavioral data and cognitive bias assessment
 * Integrates with BiasDetectionEngine and PsychologyAnalysisEngine
 */
import { BiasAssessmentResponse, BiasAssessmentResult } from '../../types';
export declare class BehaviorAssessmentForm {
    private container;
    private currentQuestionIndex;
    private responses;
    private questionStartTime;
    private psychologyAnalysis;
    private onProgress?;
    private onComplete?;
    constructor(container: HTMLElement, callbacks?: {
        onProgress?: (progress: number) => void;
        onComplete?: (result: BiasAssessmentResult) => void;
    });
    private render;
    private attachEventListeners;
    private startAssessment;
    private renderCurrentQuestion;
    private renderAnswerOptions;
    private renderScaleOptions;
    private renderMultipleChoiceOptions;
    private renderScenarioOptions;
    private renderRankingOptions;
    private renderScenarioGuidance;
    private attachAnswerListeners;
    private recordResponse;
    private validateRankingResponse;
    private calculateConfidence;
    private restorePreviousAnswer;
    private formatBiasType;
    private previousQuestion;
    private nextQuestion;
    private updateProgress;
    private estimateTimeRemaining;
    private updateNavigationButtons;
    private enableNextButton;
    private disableNextButton;
    private completeAssessment;
    private calculateBiasScores;
    private analyzeBiasResults;
    private createPsychologyProfile;
    private scoresToSeverity;
    private calculateOverallScore;
    private identifyBehaviorPatterns;
    private identifyRiskFactors;
    private identifyStrengths;
    private showLoadingState;
    private showErrorState;
    getProgress(): number;
    getResponses(): BiasAssessmentResponse[];
    pause(): void;
    resume(): void;
}
//# sourceMappingURL=BehaviorAssessmentForm.d.ts.map