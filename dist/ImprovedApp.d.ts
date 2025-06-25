/**
 * Improved Financial Health Analyzer Application
 * Addresses customer feedback:
 * 1. Analysis uses data provided correctly
 * 2. Results are clear and actionable
 * 3. Reduced input requirements with Quick Analysis option
 *
 * @remarks
 * - Strictly typed, fully documented, and validated per project rules.
 * - All user input is validated and sanitized before analysis.
 * - UI/UX is mobile-first and accessible.
 */
/**
 * ImprovedFinancialHealthApp
 * Main application controller for the Financial Health Analyzer.
 */
export declare class ImprovedFinancialHealthApp {
    private currentAnalysisType;
    private multiStepForm?;
    private quickForm?;
    private resultsDisplay?;
    private analysisChoiceContainer?;
    private formContainer?;
    private resultsContainer?;
    /**
     * Initializes the application and attaches event listeners.
     */
    constructor();
    /**
     * Initializes required DOM elements for the app.
     */
    private initializeDOMElements;
    /**
     * Attaches event listeners for analysis type selection.
     */
    private attachEventListeners;
    /**
     * Shows the analysis type choice screen.
     */
    private showAnalysisChoice;
    /**
     * Starts the quick analysis flow and renders the quick form.
     */
    private startQuickAnalysis;
    /**
     * Starts the comprehensive analysis flow and renders the multi-step form.
     */
    private startComprehensiveAnalysis;
    /**
     * Shows the form container and hides other sections.
     */
    private showFormContainer;
    /**
     * Handles form submission, performs analysis, and displays results.
     * @param userData - Validated user financial data from the form
     */
    private handleFormSubmission;
    /**
     * Shows a loading state while analysis is being performed.
     * Updates ARIA attributes for accessibility.
     */
    private showLoadingState;
    /**
     * Performs the financial analysis using the calculation engine.
     * @param userData - Validated user financial data
     * @returns ComprehensiveAnalysisResult
     */
    private performAnalysis;
    /**
     * Displays the analysis results using the enhanced results display component.
     * @param analysisResult - The result of the financial analysis
     */
    private displayResults;
    /**
     * Adds navigation options to the results display (e.g., start new analysis).
     * Ensures accessibility for navigation controls.
     */
    private addResultsNavigation;
    /**
     * Resets the application to the initial state.
     */
    private resetApplication;
    /**
     * Shows a user-facing error message as a toast notification.
     * @param message - The error message to display
     * Adds role="alert" for accessibility.
     */
    private showError;
}
//# sourceMappingURL=ImprovedApp.d.ts.map