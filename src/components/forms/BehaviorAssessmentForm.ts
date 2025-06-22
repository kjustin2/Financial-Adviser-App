/**
 * Behavioral Assessment Form Component
 * Multi-step questionnaire for collecting user behavioral data and cognitive bias assessment
 * Integrates with BiasDetectionEngine and PsychologyAnalysisEngine
 */

import { 
    BiasAssessmentQuestion, 
    BiasAssessmentResponse, 
    BiasAssessmentResult,
    CognitiveBiasType,
    BehaviorPattern
} from '../../types';
import { 
    ASSESSMENT_QUESTIONS, 
    AssessmentScoring,
    getQuestionsByBias,
    getAllBiasTypes 
} from '../../data/assessmentQuestions';
import { PsychologyAnalysisEngine } from '../../core/PsychologyAnalysisEngine';

export class BehaviorAssessmentForm {
    private currentQuestionIndex: number = 0;
    private responses: BiasAssessmentResponse[] = [];
    private questionStartTime: number = Date.now();
    
    private psychologyAnalysis: PsychologyAnalysisEngine;
    
    private onProgress?: (progress: number) => void;
    private onComplete?: (result: BiasAssessmentResult) => void;

    constructor(
        private container: HTMLElement,
        callbacks?: {
            onProgress?: (progress: number) => void;
            onComplete?: (result: BiasAssessmentResult) => void;
        }
    ) {
        this.onProgress = callbacks?.onProgress;
        this.onComplete = callbacks?.onComplete;
        
        this.psychologyAnalysis = new PsychologyAnalysisEngine();
        
        this.render();
        this.startAssessment();
    }

    private render(): void {
        this.container.innerHTML = `
            <div class="behavior-assessment-container">
                <div class="assessment-header">
                    <h2>Behavioral Finance Assessment</h2>
                    <p>This assessment helps identify cognitive biases that may affect your financial decisions. 
                       There are no right or wrong answers - please respond honestly.</p>
                    <div class="progress-container">
                        <div class="progress-bar" id="assessment-progress">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <span class="progress-text" id="progress-text">Question 1 of ${ASSESSMENT_QUESTIONS.length}</span>
                    </div>
                </div>
                
                <div class="question-container" id="question-container">
                    <!-- Current question will be rendered here -->
                </div>
                
                <div class="navigation-controls">
                    <button type="button" id="prev-btn" class="btn btn-secondary" disabled>Previous</button>
                    <button type="button" id="next-btn" class="btn btn-primary" disabled>Next</button>
                    <button type="button" id="complete-btn" class="btn btn-success" style="display: none;">Complete Assessment</button>
                </div>
                
                <div class="assessment-info">
                    <div class="time-estimate">
                        <span id="time-remaining">Estimated time remaining: ${this.estimateTimeRemaining()} minutes</span>
                    </div>
                    <div class="assessment-tips">
                        <h4>Tips for accurate results:</h4>
                        <ul>
                            <li>Answer based on your typical behavior, not ideal behavior</li>
                            <li>Consider real situations you've experienced</li>
                            <li>Don't overthink - your first instinct is often most accurate</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    private attachEventListeners(): void {
        const prevBtn = this.container.querySelector('#prev-btn') as HTMLButtonElement;
        const nextBtn = this.container.querySelector('#next-btn') as HTMLButtonElement;
        const completeBtn = this.container.querySelector('#complete-btn') as HTMLButtonElement;

        prevBtn?.addEventListener('click', () => this.previousQuestion());
        nextBtn?.addEventListener('click', () => this.nextQuestion());
        completeBtn?.addEventListener('click', () => this.completeAssessment());
    }

    private startAssessment(): void {
        this.currentQuestionIndex = 0;
        this.questionStartTime = Date.now();
        this.renderCurrentQuestion();
        this.updateProgress();
    }

    private renderCurrentQuestion(): void {
        const question = ASSESSMENT_QUESTIONS[this.currentQuestionIndex];
        if (!question) return;

        const questionContainer = this.container.querySelector('#question-container');
        if (!questionContainer) return;

        let questionHTML = `
            <div class="question-card">
                <div class="question-header">
                    <span class="bias-category">${this.formatBiasType(question.category)}</span>
                    <span class="question-number">Question ${this.currentQuestionIndex + 1}</span>
                </div>
                
                <div class="question-content">
                    <h3 class="question-text">${question.question}</h3>
                    ${question.scenario ? `<div class="scenario-box"><strong>Scenario:</strong> ${question.scenario}</div>` : ''}
                </div>
                
                <div class="answer-options" id="answer-options">
                    ${this.renderAnswerOptions(question)}
                </div>
                
                ${question.type === 'scenario' ? this.renderScenarioGuidance() : ''}
            </div>
        `;

        questionContainer.innerHTML = questionHTML;
        this.attachAnswerListeners();
        this.restorePreviousAnswer(question);
    }

    private renderAnswerOptions(question: BiasAssessmentQuestion): string {
        switch (question.type) {
            case 'scale':
                return this.renderScaleOptions(question);
            case 'multiple-choice':
                return this.renderMultipleChoiceOptions(question);
            case 'scenario':
                return this.renderScenarioOptions(question);
            case 'ranking':
                return this.renderRankingOptions(question);
            default:
                return '';
        }
    }

    private renderScaleOptions(question: BiasAssessmentQuestion): string {
        return `
            <div class="scale-options">
                ${question.options?.map((option, index) => `
                    <label class="scale-option">
                        <input type="radio" name="answer" value="${option}" data-index="${index}">
                        <span class="scale-label">${option}</span>
                        <span class="scale-number">${index + 1}</span>
                    </label>
                `).join('') || ''}
            </div>
        `;
    }

    private renderMultipleChoiceOptions(question: BiasAssessmentQuestion): string {
        return `
            <div class="multiple-choice-options">
                ${question.options?.map((option, index) => `
                    <label class="choice-option">
                        <input type="radio" name="answer" value="${option}" data-index="${index}">
                        <span class="choice-text">${option}</span>
                    </label>
                `).join('') || ''}
            </div>
        `;
    }

    private renderScenarioOptions(question: BiasAssessmentQuestion): string {
        return `
            <div class="scenario-options">
                <p class="scenario-prompt">What would you most likely do in this situation?</p>
                ${question.options?.map((option, index) => `
                    <label class="scenario-option">
                        <input type="radio" name="answer" value="${option}" data-index="${index}">
                        <span class="scenario-text">${option}</span>
                    </label>
                `).join('') || ''}
            </div>
        `;
    }

    private renderRankingOptions(question: BiasAssessmentQuestion): string {
        return `
            <div class="ranking-options">
                <p class="ranking-prompt">Rank these options from most important (1) to least important:</p>
                <div class="ranking-list" id="ranking-list">
                    ${question.options?.map((option, _index) => `
                        <div class="ranking-item" data-option="${option}">
                            <select class="ranking-select" data-option="${option}">
                                <option value="">Select rank...</option>
                                ${question.options?.map((_, rankIndex) => 
                                    `<option value="${rankIndex + 1}">${rankIndex + 1}</option>`
                                ).join('') || ''}
                            </select>
                            <span class="ranking-text">${option}</span>
                        </div>
                    `).join('') || ''}
                </div>
            </div>
        `;
    }

    private renderScenarioGuidance(): string {
        return `
            <div class="scenario-guidance">
                <p><strong>💡 Think about:</strong> What would you actually do, not what you think you should do?</p>
            </div>
        `;
    }

    private attachAnswerListeners(): void {
        const answerInputs = this.container.querySelectorAll('input[name="answer"]');
        const rankingSelects = this.container.querySelectorAll('.ranking-select');

        answerInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.recordResponse();
                this.enableNextButton();
            });
        });

        rankingSelects.forEach(select => {
            select.addEventListener('change', () => {
                this.validateRankingResponse();
            });
        });
    }

    private recordResponse(): void {
        const question = ASSESSMENT_QUESTIONS[this.currentQuestionIndex];
        const selectedInput = this.container.querySelector('input[name="answer"]:checked') as HTMLInputElement;
        
        if (!selectedInput || !question) return;

        const responseTime = Date.now() - this.questionStartTime;
        
        // Remove any existing response for this question
        this.responses = this.responses.filter(r => r.questionId !== question.id);
        
        // Add new response
        this.responses.push({
            questionId: question.id,
            response: selectedInput.value,
            timeSpent: responseTime / 1000, // Convert to seconds
            confidence: this.calculateConfidence(responseTime, question.type)
        });
    }

    private validateRankingResponse(): void {
        const question = ASSESSMENT_QUESTIONS[this.currentQuestionIndex];
        const rankingSelects = this.container.querySelectorAll('.ranking-select') as NodeListOf<HTMLSelectElement>;
        
        const selectedRanks = Array.from(rankingSelects).map(select => select.value).filter(val => val);
        const uniqueRanks = new Set(selectedRanks);
        
        // Check if all options are ranked and no duplicates
        if (selectedRanks.length === rankingSelects.length && uniqueRanks.size === selectedRanks.length) {
            const rankingArray = Array.from(rankingSelects).map(select => select.dataset.option + ':' + select.value);
            
            const responseTime = Date.now() - this.questionStartTime;
            
            // Remove any existing response for this question
            this.responses = this.responses.filter(r => r.questionId !== question.id);
            
            // Add new response
            this.responses.push({
                questionId: question.id,
                response: rankingArray,
                timeSpent: responseTime / 1000,
                confidence: this.calculateConfidence(responseTime, question.type)
            });
            
            this.enableNextButton();
        } else {
            this.disableNextButton();
        }
    }

    private calculateConfidence(responseTime: number, questionType: string): number {
        // Confidence based on response time (quicker responses often indicate higher confidence)
        const timeInSeconds = responseTime / 1000;
        
        let baseConfidence: number;
        if (timeInSeconds < 5) baseConfidence = 5; // Very quick = very confident
        else if (timeInSeconds < 15) baseConfidence = 4; // Quick = confident  
        else if (timeInSeconds < 30) baseConfidence = 3; // Moderate = neutral
        else if (timeInSeconds < 60) baseConfidence = 2; // Slow = less confident
        else baseConfidence = 1; // Very slow = uncertain

        // Adjust for question type
        if (questionType === 'scenario') baseConfidence = Math.max(baseConfidence - 0.5, 1);
        if (questionType === 'ranking') baseConfidence = Math.max(baseConfidence - 1, 1);

        return Math.min(baseConfidence, 5);
    }

    private restorePreviousAnswer(question: BiasAssessmentQuestion): void {
        const existingResponse = this.responses.find(r => r.questionId === question.id);
        if (!existingResponse) return;

        if (question.type === 'ranking') {
            // Handle ranking restoration
            const rankings = Array.isArray(existingResponse.response) 
                ? existingResponse.response 
                : (existingResponse.response as string).split(',');
                
            rankings.forEach(ranking => {
                const [option, rank] = ranking.split(':');
                const select = this.container.querySelector(`select[data-option="${option}"]`) as HTMLSelectElement;
                if (select) select.value = rank;
            });
        } else {
            // Handle radio button restoration
            const input = this.container.querySelector(`input[value="${existingResponse.response}"]`) as HTMLInputElement;
            if (input) {
                input.checked = true;
                this.enableNextButton();
            }
        }
    }

    private formatBiasType(biasType: CognitiveBiasType): string {
        return biasType.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    private previousQuestion(): void {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.questionStartTime = Date.now();
            this.renderCurrentQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }

    private nextQuestion(): void {
        if (this.currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
            this.currentQuestionIndex++;
            this.questionStartTime = Date.now();
            this.renderCurrentQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }

    private updateProgress(): void {
        const progress = ((this.currentQuestionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100;
        
        const progressFill = this.container.querySelector('.progress-fill') as HTMLElement;
        const progressText = this.container.querySelector('#progress-text') as HTMLElement;
        const timeRemaining = this.container.querySelector('#time-remaining') as HTMLElement;

        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `Question ${this.currentQuestionIndex + 1} of ${ASSESSMENT_QUESTIONS.length}`;
        if (timeRemaining) timeRemaining.textContent = `Estimated time remaining: ${this.estimateTimeRemaining()} minutes`;

        this.onProgress?.(progress);
    }

    private estimateTimeRemaining(): number {
        const questionsRemaining = ASSESSMENT_QUESTIONS.length - (this.currentQuestionIndex + 1);
        const avgTimePerQuestion = 0.75; // 45 seconds average
        return Math.max(Math.ceil(questionsRemaining * avgTimePerQuestion), 1);
    }

    private updateNavigationButtons(): void {
        const prevBtn = this.container.querySelector('#prev-btn') as HTMLButtonElement;
        const nextBtn = this.container.querySelector('#next-btn') as HTMLButtonElement;
        const completeBtn = this.container.querySelector('#complete-btn') as HTMLButtonElement;

        if (prevBtn) prevBtn.disabled = this.currentQuestionIndex === 0;
        
        if (this.currentQuestionIndex === ASSESSMENT_QUESTIONS.length - 1) {
            if (nextBtn) nextBtn.style.display = 'none';
            if (completeBtn) completeBtn.style.display = 'inline-block';
        } else {
            if (nextBtn) nextBtn.style.display = 'inline-block';
            if (completeBtn) completeBtn.style.display = 'none';
        }
    }

    private enableNextButton(): void {
        const nextBtn = this.container.querySelector('#next-btn') as HTMLButtonElement;
        const completeBtn = this.container.querySelector('#complete-btn') as HTMLButtonElement;
        
        if (nextBtn) nextBtn.disabled = false;
        if (completeBtn) completeBtn.disabled = false;
    }

    private disableNextButton(): void {
        const nextBtn = this.container.querySelector('#next-btn') as HTMLButtonElement;
        const completeBtn = this.container.querySelector('#complete-btn') as HTMLButtonElement;
        
        if (nextBtn) nextBtn.disabled = true;
        if (completeBtn) completeBtn.disabled = true;
    }

    private async completeAssessment(): Promise<void> {
        try {
            // Show loading state
            this.showLoadingState();
            
            // Calculate bias scores using responses
            const biasScores = this.calculateBiasScores();
            
            // Use BiasDetectionEngine to analyze responses
            const biasResults = await this.analyzeBiasResults(biasScores);
            
            // Use PsychologyAnalysisEngine to create behavioral profile
            const psychologyProfile = await this.createPsychologyProfile(biasResults);
            
            // Create comprehensive assessment result
            const assessmentResult: BiasAssessmentResult = {
                overallScore: this.calculateOverallScore(biasScores),
                biasProfile: biasResults,
                psychologyProfile: psychologyProfile,
                behaviorPatterns: this.identifyBehaviorPatterns(biasResults),
                riskFactors: this.identifyRiskFactors(biasResults),
                strengths: this.identifyStrengths(biasResults)
            };

            this.onComplete?.(assessmentResult);
            
        } catch (error) {
            console.error('Error completing assessment:', error);
            this.showErrorState('Failed to complete assessment. Please try again.');
        }
    }

    private calculateBiasScores(): Record<CognitiveBiasType, number> {
        const biasScores: Record<CognitiveBiasType, number> = {} as Record<CognitiveBiasType, number>;
        
        // Initialize all bias types with 0
        getAllBiasTypes().forEach(biasType => {
            biasScores[biasType] = 0;
        });

        // Calculate scores for each bias type
        getAllBiasTypes().forEach(biasType => {
            const biasQuestions = getQuestionsByBias(biasType);
            let totalScore = 0;
            let totalWeight = 0;

            biasQuestions.forEach(question => {
                const response = this.responses.find(r => r.questionId === question.id);
                if (response) {
                    let questionScore = 0;
                    
                    switch (question.type) {
                        case 'scale':
                            questionScore = AssessmentScoring.scoreScaleQuestion(response.response as string, biasType);
                            break;
                        case 'scenario':
                            questionScore = AssessmentScoring.scoreScenarioQuestion(response.response as string, question.id, biasType);
                            break;
                        case 'multiple-choice':
                            // For multiple choice, find the index of the selected option
                            const optionIndex = question.options?.indexOf(response.response as string) || 0;
                            questionScore = (optionIndex / ((question.options?.length || 1) - 1)) * 0.8; // Scaled to 0-0.8
                            break;
                        case 'ranking':
                            questionScore = 0.5; // Ranking questions need special handling
                            break;
                    }
                    
                    totalScore += questionScore * question.weight;
                    totalWeight += question.weight;
                }
            });

            biasScores[biasType] = totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
        });

        return biasScores;
    }

    private async analyzeBiasResults(biasScores: Record<CognitiveBiasType, number>) {
        const biasResults = [];
        
        for (const [biasType, score] of Object.entries(biasScores)) {
            // Simplified bias result since we can't call detectBiases without full data
            const result = {
                biasType: biasType as CognitiveBiasType,
                severity: this.scoresToSeverity(score),
                confidence: score / 100,
                indicators: [`Assessment score: ${score.toFixed(1)}`],
                evidence: { behavioral: [], financial: [], survey: [`Assessment score: ${score.toFixed(1)}`] },
                description: `${biasType} bias detected through assessment`,
                prevalence: 0.5
            };
            
            // Override the score with our calculated score
            biasResults.push({
                ...result,
                severity: this.scoresToSeverity(score)
            });
        }
        
        return biasResults;
    }

    private async createPsychologyProfile(biasResults: any[]) {
        return await this.psychologyAnalysis.generatePsychologyProfile(
            {} as any, // Would pass actual financial data in real implementation
            {} as any, // Would pass actual behavior data in real implementation 
            biasResults
        );
    }

    private scoresToSeverity(score: number): 'low' | 'moderate' | 'high' | 'severe' {
        if (score < 25) return 'low';
        if (score < 50) return 'moderate';  
        if (score < 75) return 'high';
        return 'severe';
    }

    private calculateOverallScore(biasScores: Record<CognitiveBiasType, number>): number {
        const scores = Object.values(biasScores);
        return scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }

    private identifyBehaviorPatterns(biasResults: any[]): BehaviorPattern[] {
        // This would analyze the bias results to identify behavioral patterns
        // For now, return a simplified implementation
        return biasResults.map(bias => ({
            pattern: `${bias.biasType} behavior pattern`,
            frequency: bias.severity === 'severe' ? 'habitual' : bias.severity === 'high' ? 'frequent' : 'occasional',
            intensity: bias.severity === 'severe' ? 9 : bias.severity === 'high' ? 7 : bias.severity === 'moderate' ? 5 : 3,
            triggers: bias.indicators || [],
            outcomes: [`Potential impact on ${bias.biasType} decisions`],
            relatedBiases: [bias.biasType]
        })) as BehaviorPattern[];
    }

    private identifyRiskFactors(biasResults: any[]): string[] {
        return biasResults
            .filter(bias => bias.severity === 'severe' || bias.severity === 'high')
            .map(bias => `High ${bias.biasType} may lead to poor financial decisions`);
    }

    private identifyStrengths(biasResults: any[]): string[] {
        return biasResults
            .filter(bias => bias.severity === 'low')
            .map(bias => `Low ${bias.biasType} indicates rational decision-making in this area`);
    }

    private showLoadingState(): void {
        const questionContainer = this.container.querySelector('#question-container');
        if (questionContainer) {
            questionContainer.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <h3>Analyzing Your Responses...</h3>
                    <p>We're calculating your bias profile and behavioral patterns.</p>
                </div>
            `;
        }
    }

    private showErrorState(message: string): void {
        const questionContainer = this.container.querySelector('#question-container');
        if (questionContainer) {
            questionContainer.innerHTML = `
                <div class="error-state">
                    <h3>Assessment Error</h3>
                    <p>${message}</p>
                    <button type="button" class="btn btn-primary" onclick="location.reload()">Try Again</button>
                </div>
            `;
        }
    }

    // Public methods
    public getProgress(): number {
        return ((this.currentQuestionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100;
    }

    public getResponses(): BiasAssessmentResponse[] {
        return [...this.responses];
    }

    public pause(): void {
        // Implementation for pausing assessment if needed
    }

    public resume(): void {
        // Implementation for resuming assessment if needed
    }
} 