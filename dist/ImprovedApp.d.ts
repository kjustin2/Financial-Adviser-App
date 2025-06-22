/**
 * Improved Financial Health Analyzer Application
 * Addresses customer feedback:
 * 1. Analysis uses data provided correctly
 * 2. Results are clear and actionable
 * 3. Reduced input requirements with Quick Analysis option
 */
export declare class ImprovedFinancialHealthApp {
    private currentAnalysisType;
    private multiStepForm?;
    private quickForm?;
    private resultsDisplay?;
    private analysisResult?;
    private analysisChoiceContainer?;
    private formContainer?;
    private resultsContainer?;
    constructor();
    private initializeDOMElements;
    private attachEventListeners;
    private showAnalysisChoice;
    private startQuickAnalysis;
    private startComprehensiveAnalysis;
    private showFormContainer;
    private handleFormSubmission;
    private showLoadingState;
    private performAnalysis;
    private displayResults;
    private addResultsNavigation;
    private resetApplication;
    private exportResults;
    private saveProgress;
    private showError;
    private showSuccessMessage;
}
//# sourceMappingURL=ImprovedApp.d.ts.map