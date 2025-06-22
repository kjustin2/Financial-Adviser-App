/**
 * Improved Financial Health Analyzer Application
 * Addresses customer feedback:
 * 1. Analysis uses data provided correctly
 * 2. Results are clear and actionable
 * 3. Reduced input requirements with Quick Analysis option
 */

import { UserFinancialData } from './interfaces/core-types';
import { ComprehensiveAnalysisResult } from './interfaces/analysis-types';
import { FinancialCalculationEngine } from './core/calculations';
import { MultiStepForm } from './components/forms/MultiStepForm';
import { QuickAnalysisForm } from './components/forms/QuickAnalysisForm';
import { EnhancedResultsDisplay } from './components/ui/EnhancedResultsDisplay';

export class ImprovedFinancialHealthApp {
    private currentAnalysisType: 'quick' | 'comprehensive' | null = null;
    private multiStepForm?: MultiStepForm; // Used for comprehensive analysis
    private quickForm?: QuickAnalysisForm;
    private resultsDisplay?: EnhancedResultsDisplay;
    private analysisResult?: ComprehensiveAnalysisResult;

    // DOM Elements
    private analysisChoiceContainer?: HTMLElement;
    private formContainer?: HTMLElement;
    private resultsContainer?: HTMLElement;

    constructor() {
        this.initializeDOMElements();
        this.attachEventListeners();
        this.showAnalysisChoice();
    }

    private initializeDOMElements(): void {
        this.analysisChoiceContainer = document.getElementById('analysisChoiceContainer') || undefined;
        this.formContainer = document.getElementById('formContainer') || undefined;
        this.resultsContainer = document.getElementById('resultsContainer') || undefined;

        if (!this.analysisChoiceContainer || !this.formContainer || !this.resultsContainer) {
            throw new Error('Required DOM elements not found');
        }
    }

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

    private showAnalysisChoice(): void {
        if (this.analysisChoiceContainer && this.formContainer && this.resultsContainer) {
            this.analysisChoiceContainer.style.display = 'block';
            this.formContainer.style.display = 'none';
            this.resultsContainer.style.display = 'none';
        }
    }

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

    private showFormContainer(): void {
        if (this.analysisChoiceContainer && this.formContainer && this.resultsContainer) {
            this.analysisChoiceContainer.style.display = 'none';
            this.formContainer.style.display = 'block';
            this.resultsContainer.style.display = 'none';
        }
    }

    private async handleFormSubmission(userData: UserFinancialData): Promise<void> {
        try {
            this.showLoadingState();
            
            // Ensure we're using fresh data directly from the form
            console.log('Processing user data:', userData);
            
            // Perform the financial analysis
            const analysisResult = await this.performAnalysis(userData);
            
            // Display the results
            this.displayResults(analysisResult);
            
        } catch (error) {
            console.error('Analysis failed:', error);
            this.showError('Analysis failed. Please try again.');
        }
    }

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
            }
        }
    }

    private async performAnalysis(userData: UserFinancialData): Promise<ComprehensiveAnalysisResult> {
        // Simulate processing delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Use the FinancialCalculationEngine to perform the analysis
        return FinancialCalculationEngine.analyzeFinancialHealth(userData);
    }

    private displayResults(analysisResult: ComprehensiveAnalysisResult): void {
        this.analysisResult = analysisResult;
        
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

    private addResultsNavigation(): void {
        const resultsContainer = document.getElementById('enhancedResults');
        if (resultsContainer) {
            const navigationHTML = `
                <div class="results-navigation">
                    <div class="nav-actions">
                        <button class="btn btn-outline" id="startNewAnalysis">
                            📊 Start New Analysis
                        </button>
                        <button class="btn btn-secondary" id="exportResults">
                            📄 Export Results
                        </button>
                        <button class="btn btn-primary" id="saveProgress">
                            💾 Save Progress
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
            
            // Attach navigation event listeners
            const startNewBtn = document.getElementById('startNewAnalysis');
            const exportBtn = document.getElementById('exportResults');
            const saveBtn = document.getElementById('saveProgress');
            
            if (startNewBtn) {
                startNewBtn.addEventListener('click', () => {
                    this.resetApplication();
                });
            }
            
            if (exportBtn) {
                exportBtn.addEventListener('click', () => {
                    this.exportResults();
                });
            }
            
            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    this.saveProgress();
                });
            }
        }
    }

    private resetApplication(): void {
        this.currentAnalysisType = null;
        this.analysisResult = undefined;
        
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

    private exportResults(): void {
        if (!this.analysisResult) return;
        
        // Create a simplified export of the results
        const exportData = {
            analysisDate: new Date().toISOString(),
            analysisType: this.currentAnalysisType,
            overallScore: this.analysisResult.overallHealthScore,
            healthLevel: this.analysisResult.healthLevel,
            keyMetrics: this.analysisResult.keyMetrics,
            healthIndicators: this.analysisResult.healthIndicators.map(indicator => ({
                name: indicator.name,
                score: indicator.score,
                status: indicator.status,
                explanation: indicator.explanation
            })),
            topRecommendations: this.analysisResult.prioritizedRecommendations
                .filter(rec => rec.priority === 'high')
                .slice(0, 5)
                .map(rec => ({
                    title: rec.title,
                    description: rec.description,
                    actionSteps: rec.actionSteps,
                    timeframe: rec.timeframe
                }))
        };
        
        // Create and download JSON file
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `financial-health-analysis-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        // Show success message
        this.showSuccessMessage('Results exported successfully!');
    }

    private saveProgress(): void {
        if (!this.analysisResult) return;
        
        // Save to localStorage for demonstration
        const saveData = {
            timestamp: new Date().toISOString(),
            analysisType: this.currentAnalysisType,
            results: this.analysisResult
        };
        
        try {
            localStorage.setItem('financialHealthAnalysis', JSON.stringify(saveData));
            this.showSuccessMessage('Progress saved successfully!');
        } catch (error) {
            console.error('Failed to save progress:', error);
            this.showError('Failed to save progress. Please try again.');
        }
    }

    private showError(message: string): void {
        // Show error message to user
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-toast';
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

    private showSuccessMessage(message: string): void {
        // Show success message to user
        const successContainer = document.createElement('div');
        successContainer.className = 'success-toast';
        successContainer.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">✅</span>
                <span class="toast-message">${message}</span>
            </div>
        `;
        
        document.body.appendChild(successContainer);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (successContainer.parentNode) {
                successContainer.parentNode.removeChild(successContainer);
            }
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImprovedFinancialHealthApp();
}); 