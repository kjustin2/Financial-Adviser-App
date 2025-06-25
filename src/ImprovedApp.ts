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

import { UserFinancialData } from './interfaces/core-types';
import { ComprehensiveAnalysisResult } from './interfaces/analysis-types';
import { FinancialCalculationEngine } from './core/calculations';
import { MultiStepForm } from './components/forms/MultiStepForm';
import { QuickAnalysisForm } from './components/forms/QuickAnalysisForm';
import { EnhancedResultsDisplay } from './components/ui/EnhancedResultsDisplay';

/**
 * ImprovedFinancialHealthApp
 * Main application controller for the Financial Health Analyzer.
 */
export class ImprovedFinancialHealthApp {
    private currentAnalysisType: 'quick' | 'comprehensive' | null = null;
    private multiStepForm?: MultiStepForm; // Used for comprehensive analysis
    private quickForm?: QuickAnalysisForm;
    private resultsDisplay?: EnhancedResultsDisplay;

    // DOM Elements
    private analysisChoiceContainer?: HTMLElement;
    private formContainer?: HTMLElement;
    private resultsContainer?: HTMLElement;

    /**
     * Initializes the application and attaches event listeners.
     */
    constructor() {
        this.initializeDOMElements();
        this.attachEventListeners();
        this.showAnalysisChoice();
    }

    /**
     * Initializes required DOM elements for the app.
     */
    private initializeDOMElements(): void {
        this.analysisChoiceContainer = document.getElementById('analysisChoiceContainer') || undefined;
        this.formContainer = document.getElementById('formContainer') || undefined;
        this.resultsContainer = document.getElementById('resultsContainer') || undefined;

        if (!this.analysisChoiceContainer || !this.formContainer || !this.resultsContainer) {
            throw new Error('Required DOM elements not found');
        }
    }

    /**
     * Attaches event listeners for analysis type selection.
     */
    private attachEventListeners(): void {
        // Analysis type choice buttons
        const quickBtn = document.getElementById('chooseQuickAnalysis');
        const comprehensiveBtn = document.getElementById('chooseComprehensiveAnalysis');

        if (quickBtn) {
            quickBtn.addEventListener('click', () => {
                this.startQuickAnalysis();
            });
        }

        if (comprehensiveBtn) {
            comprehensiveBtn.addEventListener('click', () => {
                this.startComprehensiveAnalysis();
            });
        }
    }

    /**
     * Shows the analysis type choice screen.
     */
    private showAnalysisChoice(): void {
        if (this.analysisChoiceContainer && this.formContainer && this.resultsContainer) {
            this.analysisChoiceContainer.style.display = 'block';
            this.formContainer.style.display = 'none';
            this.resultsContainer.style.display = 'none';
        }
    }

    /**
     * Starts the quick analysis flow and renders the quick form.
     */
    private startQuickAnalysis(): void {
        this.currentAnalysisType = 'quick';
        this.showFormContainer();

        // Initialize Quick Analysis Form
        if (this.formContainer) {
            this.formContainer.innerHTML = '<div id="quickFormContainer"></div>';
            this.quickForm = new QuickAnalysisForm('quickFormContainer', (userData) => {
                this.handleFormSubmission(userData);
            });
            this.quickForm.render();
        }
    }

    /**
     * Starts the comprehensive analysis flow and renders the multi-step form.
     */
    private startComprehensiveAnalysis(): void {
        this.currentAnalysisType = 'comprehensive';
        this.showFormContainer();

        // Initialize Multi-Step Form
        if (this.formContainer) {
            this.formContainer.innerHTML = '<div id="multiStepFormContainer"></div>';
            const container = document.getElementById('multiStepFormContainer');
            if (container) {
                this.multiStepForm = new MultiStepForm(container, {
                    onComplete: (userData: UserFinancialData) => {
                        this.handleFormSubmission(userData);
                    }
                });
            }
        }
    }

    /**
     * Shows the form container and hides other sections.
     */
    private showFormContainer(): void {
        if (this.analysisChoiceContainer && this.formContainer && this.resultsContainer) {
            this.analysisChoiceContainer.style.display = 'none';
            this.formContainer.style.display = 'block';
            this.resultsContainer.style.display = 'none';
        }
    }

    /**
     * Handles form submission, performs analysis, and displays results.
     * @param userData - Validated user financial data from the form
     */
    private async handleFormSubmission(userData: UserFinancialData): Promise<void> {
        try {
            this.showLoadingState();
            // Ensure we're using fresh data directly from the form
            // Input sanitization should be performed in the form component before this point
            // Remove or guard console.log in production
            // console.log('Processing user data:', userData);
            // Perform the financial analysis
            const analysisResult = await this.performAnalysis(userData);
            // Display the results
            this.displayResults(analysisResult);
        } catch (error) {
            // User-facing error message is clear and actionable
            this.showError('Analysis failed. Please try again.');
        }
    }

    /**
     * Shows a loading state while analysis is being performed.
     * Updates ARIA attributes for accessibility.
     */
    private showLoadingState(): void {
        if (this.formContainer && this.resultsContainer) {
            this.formContainer.style.display = 'none';
            this.resultsContainer.style.display = 'block';
            // Show loading indicator
            const loadingIndicator = document.getElementById('loadingIndicator');
            const analysisResults = document.getElementById('analysisResults');
            if (loadingIndicator && analysisResults) {
                loadingIndicator.style.display = 'block';
                analysisResults.style.display = 'none';
                // Accessibility: update ARIA attributes
                loadingIndicator.setAttribute('role', 'status');
                loadingIndicator.setAttribute('aria-live', 'polite');
            }
        }
    }

    /**
     * Performs the financial analysis using the calculation engine.
     * @param userData - Validated user financial data
     * @returns ComprehensiveAnalysisResult
     */
    private async performAnalysis(userData: UserFinancialData): Promise<ComprehensiveAnalysisResult> {
        // Simulate processing delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Use the FinancialCalculationEngine to perform the analysis
        return FinancialCalculationEngine.analyzeFinancialHealth(userData);
    }

    /**
     * Displays the analysis results using the enhanced results display component.
     * @param analysisResult - The result of the financial analysis
     */
    private displayResults(analysisResult: ComprehensiveAnalysisResult): void {
        // Hide loading indicator
        const loadingIndicator = document.getElementById('loadingIndicator');
        const analysisResults = document.getElementById('analysisResults');
        if (loadingIndicator && analysisResults) {
            loadingIndicator.style.display = 'none';
            analysisResults.style.display = 'block';
        }
        // Initialize enhanced results display
        if (this.resultsContainer) {
            // Clear existing results and create enhanced display container
            const existingResults = document.getElementById('analysisResults');
            if (existingResults) {
                existingResults.innerHTML = '<div id="enhancedResults"></div>';
                this.resultsDisplay = new EnhancedResultsDisplay('enhancedResults');
                this.resultsDisplay.render(analysisResult);
            }
        }
        // Add navigation options
        this.addResultsNavigation();
    }

    /**
     * Adds navigation options to the results display (e.g., start new analysis).
     * Ensures accessibility for navigation controls.
     */
    private addResultsNavigation(): void {
        const resultsContainer = document.getElementById('enhancedResults');
        if (resultsContainer) {
            const navigationHTML = `
                <div class="results-navigation">
                    <div class="nav-actions">
                        <button class="btn btn-outline" id="startNewAnalysis" aria-label="Start New Analysis">
                            📊 Start New Analysis
                        </button>
                    </div>
                    <div class="analysis-info">
                        <p class="analysis-type">
                            Analysis Type: <strong>${this.currentAnalysisType === 'quick' ? 'Quick Analysis' : 'Comprehensive Analysis'}</strong>
                        </p>
                        <p class="analysis-date">
                            Generated: <strong>${new Date().toLocaleDateString()}</strong>
                        </p>
                    </div>
                </div>
            `;
            resultsContainer.insertAdjacentHTML('beforeend', navigationHTML);
            const startNewBtn = document.getElementById('startNewAnalysis');
            if (startNewBtn) {
                startNewBtn.addEventListener('click', () => {
                    this.resetApplication();
                });
            }
        }
    }

    /**
     * Resets the application to the initial state.
     */
    private resetApplication(): void {
        this.currentAnalysisType = null;
        // Reset form instances
        if (this.multiStepForm) {
            this.multiStepForm = undefined;
        }
        if (this.quickForm) {
            this.quickForm = undefined;
        }
        if (this.resultsDisplay) {
            this.resultsDisplay = undefined;
        }
        this.showAnalysisChoice();
    }

    /**
     * Shows a user-facing error message as a toast notification.
     * @param message - The error message to display
     * Adds role="alert" for accessibility.
     */
    private showError(message: string): void {
        // Show error message to user
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-toast';
        errorContainer.setAttribute('role', 'alert'); // Accessibility
        errorContainer.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">❌</span>
                <span class="toast-message">${message}</span>
            </div>
        `;
        document.body.appendChild(errorContainer);
        // Remove after 5 seconds
        setTimeout(() => {
            if (errorContainer.parentNode) {
                errorContainer.parentNode.removeChild(errorContainer);
            }
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImprovedFinancialHealthApp();
}); 