/**
 * Quick Analysis Form Component
 * Simplified form requiring only essential financial inputs
 *
 * @remarks
 * - Strictly typed, fully documented, and validated per project rules.
 * - All user input is validated and sanitized before use.
 * - UI/UX is mobile-first and accessible.
 */

import { UserFinancialData } from '../../interfaces/core-types';
// Import shared CSS for unified UX
import '../shared-form-styles.css';

/**
 * QuickAnalysisForm
 * Renders and manages the quick financial health form.
 */
export class QuickAnalysisForm {
    private container: HTMLElement;
    private onSubmit: (data: UserFinancialData) => void;

    /**
     * Initializes the form.
     * @param containerId - The DOM element ID to render the form into.
     * @param onSubmit - Callback when the form is submitted with valid data.
     */
    constructor(containerId: string, onSubmit: (data: UserFinancialData) => void) {
        const element = document.getElementById(containerId);
        if (!element) {
            throw new Error(`Element with ID ${containerId} not found`);
        }
        this.container = element;
        this.onSubmit = onSubmit;
    }

    /**
     * Renders the form UI.
     */
    public render(): void {
        this.container.innerHTML = this.generateHTML();
        this.attachEventListeners();
    }

    /**
     * Generates the HTML for the form.
     * @returns The HTML string for the form.
     */
    private generateHTML(): string {
        return `
            <div class="form-container">
                <div class="form-header">
                    <h2>Quick Financial Health Check</h2>
                    <p class="form-description">
                        Get a comprehensive financial analysis with just 6 essential inputs. 
                        Takes less than 2 minutes to complete.
                    </p>
                    <div class="progress-indicator">
                        <div class="progress-bar">
                            <div class="progress-fill" id="formProgress"></div>
                        </div>
                        <p class="progress-text">Complete all fields to analyze</p>
                    </div>
                </div>

                <button class="btn-secondary return-home-btn" aria-label="Return to Home" tabindex="0" onclick="window.confirm('Are you sure you want to return to the home page? Unsaved data will be lost.') && window.location.reload();">Return to Home</button>

                <form id="quickAnalysisForm" class="quick-form">
                    <div class="form-fields-grid">
                        <div class="form-field" data-field="income">
                            <label for="monthlyIncome" class="field-label">
                                <span class="label-text">Monthly Take-Home Income</span>
                                <span class="required">*</span>
                                <span class="help-icon" data-tooltip="Your salary after taxes and deductions">?</span>
                            </label>
                            <div class="input-wrapper">
                                <span class="currency-symbol">$</span>
                                <input type="text"
                                       inputmode="decimal" 
                                       id="monthlyIncome" 
                                       name="monthlyIncome" 
                                       placeholder="5,000"
                                       min="0" 
                                       required 
                                       class="field-input currency-input"
                                       data-format="currency">
                                <div class="input-feedback"></div>
                            </div>
                            <p class="field-help">Your monthly income after taxes and deductions</p>
                        </div>

                        <div class="form-field" data-field="housing">
                            <label for="monthlyHousing" class="field-label">
                                <span class="label-text">Monthly Housing Cost</span>
                                <span class="required">*</span>
                                <span class="help-icon" data-tooltip="Rent or mortgage payment">?</span>
                            </label>
                            <div class="input-wrapper">
                                <span class="currency-symbol">$</span>
                                <input type="text"
                                       inputmode="decimal"
                                       id="monthlyHousing" 
                                       name="monthlyHousing" 
                                       placeholder="1,500"
                                       min="0" 
                                       required 
                                       class="field-input currency-input"
                                       data-format="currency">
                                <div class="input-feedback"></div>
                            </div>
                            <p class="field-help">Rent or mortgage payment (excluding utilities)</p>
                        </div>

                        <div class="form-field" data-field="expenses">
                            <label for="monthlyExpenses" class="field-label">
                                <span class="label-text">Other Monthly Expenses</span>
                                <span class="required">*</span>
                                <span class="help-icon" data-tooltip="Food, transportation, utilities, entertainment, etc.">?</span>
                            </label>
                            <div class="input-wrapper">
                                <span class="currency-symbol">$</span>
                                <input type="text"
                                       inputmode="decimal"
                                       id="monthlyExpenses" 
                                       name="monthlyExpenses" 
                                       placeholder="2,000"
                                       min="0" 
                                       required 
                                       class="field-input currency-input"
                                       data-format="currency">
                                <div class="input-feedback"></div>
                            </div>
                            <p class="field-help">Food, transportation, utilities, entertainment, etc.</p>
                            <div class="expense-breakdown">
                                <small>Typical breakdown: Food (30%), Transportation (25%), Utilities (15%), Other (30%)</small>
                            </div>
                        </div>

                        <div class="form-field" data-field="savings">
                            <label for="totalSavings" class="field-label">
                                <span class="label-text">Total Savings & Emergency Fund</span>
                                <span class="required">*</span>
                                <span class="help-icon" data-tooltip="All liquid savings including emergency fund">?</span>
                            </label>
                            <div class="input-wrapper">
                                <span class="currency-symbol">$</span>
                                <input type="text"
                                       inputmode="decimal"
                                       id="totalSavings" 
                                       name="totalSavings" 
                                       placeholder="15,000"
                                       min="0" 
                                       required 
                                       class="field-input currency-input"
                                       data-format="currency">
                                <div class="input-feedback"></div>
                            </div>
                            <p class="field-help">Checking, savings, emergency fund (liquid assets)</p>
                            <div class="savings-indicator">
                                <small>Emergency fund goal: <span id="emergencyGoal">--</span> months of expenses</small>
                            </div>
                        </div>

                        <div class="form-field" data-field="debt">
                            <label for="totalDebt" class="field-label">
                                <span class="label-text">Total Debt</span>
                                <span class="required">*</span>
                                <span class="help-icon" data-tooltip="Credit cards, student loans, car loans (excluding mortgage)">?</span>
                            </label>
                            <div class="input-wrapper">
                                <span class="currency-symbol">$</span>
                                <input type="text"
                                       inputmode="decimal"
                                       id="totalDebt" 
                                       name="totalDebt" 
                                       placeholder="25,000"
                                       min="0" 
                                       required 
                                       class="field-input currency-input"
                                       data-format="currency">
                                <div class="input-feedback"></div>
                            </div>
                            <p class="field-help">Credit cards, student loans, car loans (excluding mortgage)</p>
                            <div class="debt-ratio-indicator">
                                <small>Debt-to-income ratio: <span id="debtRatio">--</span></small>
                            </div>
                        </div>

                        <div class="form-field" data-field="credit">
                            <label for="creditScore" class="field-label">
                                <span class="label-text">Credit Score</span>
                                <span class="required">*</span>
                                <span class="help-icon" data-tooltip="Your current credit score (300-850)">?</span>
                            </label>
                            <div class="input-wrapper">
                                <input type="number" 
                                       id="creditScore" 
                                       name="creditScore" 
                                       placeholder="720"
                                       min="300" 
                                       max="850" 
                                       required 
                                       class="field-input">
                                <div class="input-feedback"></div>
                            </div>
                            <p class="field-help">Your current credit score (300-850)</p>
                            <div class="credit-range">
                                <div class="range-indicator">
                                    <span class="range poor">300-579</span>
                                    <span class="range fair">580-669</span>
                                    <span class="range good">670-739</span>
                                    <span class="range excellent">740-850</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary btn-large" id="analyzeButton" disabled>
                            <span class="btn-icon">📊</span>
                            <span class="btn-text">Analyze My Financial Health</span>
                            <div class="btn-loader" style="display: none;">
                                <div class="spinner"></div>
                            </div>
                        </button>
                        <p class="analysis-note">
                            Get instant insights into your financial health with personalized recommendations
                        </p>
                    </div>

                    <div class="validation-errors" id="validationErrors" style="display: none;">
                        <!-- Error messages will be inserted here -->
                    </div>
                </form>

                <div class="form-benefits">
                    <h3>What You'll Get:</h3>
                    <ul class="benefits-list">
                        <li>
                            <span class="benefit-icon">📈</span>
                            <span>Overall Financial Health Score based on your actual data</span>
                        </li>
                        <li>
                            <span class="benefit-icon">💡</span>
                            <span>8 Key Health Indicators with clear explanations</span>
                        </li>
                        <li>
                            <span class="benefit-icon">🎯</span>
                            <span>Prioritized action recommendations</span>
                        </li>
                        <li>
                            <span class="benefit-icon">📊</span>
                            <span>Comparison to people in your age and income group</span>
                        </li>
                        <li>
                            <span class="benefit-icon">🔮</span>
                            <span>Projections for your financial future</span>
                        </li>
                    </ul>
                </div>
            </div>
        `;
    }

    /**
     * Attaches all event listeners for form interactivity and validation.
     */
    private attachEventListeners(): void {
        const form = this.container.querySelector('#quickAnalysisForm') as HTMLFormElement;
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                this.handleSubmit();
            });

            // Add real-time validation and feedback
            const inputs = form.querySelectorAll('input[required]');
            inputs.forEach(input => {
                input.addEventListener('input', (event) => {
                    this.handleInputChange(event.target as HTMLInputElement);
                });
                
                input.addEventListener('blur', (event) => {
                    const target = event.target as HTMLInputElement;
                    // Format currency on blur
                    if (target.dataset.format === 'currency') {
                        this.formatCurrencyInput(target);
                    }
                    this.validateField(target);
                });
            });

            // Add tooltips
            this.attachTooltips();
        }
    }

    /**
     * Handles input changes for real-time validation and feedback.
     * @param _input - The input element that changed.
     */
    private handleInputChange(_input: HTMLInputElement): void {
        // DO NOT format currency on every input, as it interferes with typing.
        // Formatting is now handled on the 'blur' event.

        // Update real-time calculations
        this.updateRealTimeCalculations();
        
        // Update progress
        this.updateProgress();
        
        // Enable/disable submit button
        this.updateSubmitButton();
    }

    /**
     * Formats a currency input field on blur.
     * @param input - The input element to format.
     */
    private formatCurrencyInput(input: HTMLInputElement): void {
        // First, strip any non-digit characters except for a decimal point
        const value = input.value.replace(/[^0-9.]/g, '');
        const numericValue = parseFloat(value) || 0;
        // Allow zero as a valid value
        input.value = numericValue > 0 ? numericValue.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '0';
    }

    /**
     * Updates real-time calculations (emergency fund months, debt ratio) as the user types.
     */
    private updateRealTimeCalculations(): void {
        const income = this.getNumericValue('monthlyIncome');
        const housing = this.getNumericValue('monthlyHousing');
        const expenses = this.getNumericValue('monthlyExpenses');
        const savings = this.getNumericValue('totalSavings');
        const debt = this.getNumericValue('totalDebt');

        // Update emergency fund months
        const totalExpenses = housing + expenses;
        const emergencyGoal = document.getElementById('emergencyGoal');
        if (emergencyGoal) {
            if (totalExpenses > 0 && savings >= 0) {
                const emergencyMonths = (savings / totalExpenses);
                emergencyGoal.textContent = isNaN(emergencyMonths) ? 'N/A' : emergencyMonths.toFixed(1);
                emergencyGoal.className = !isNaN(emergencyMonths) && emergencyMonths >= 3 ? 'good' : 'needs-improvement';
            } else {
                emergencyGoal.textContent = 'N/A';
                emergencyGoal.className = '';
            }
        }

        // Update debt-to-income ratio
        const debtRatioElement = document.getElementById('debtRatio');
        if (income > 0) {
            const annualIncome = income * 12;
            let debtRatio = 0;
            if (debt > 0) {
                debtRatio = ((debt / annualIncome) * 100);
                if (debtRatioElement) {
                    debtRatioElement.textContent = `${debtRatio.toFixed(1)}%`;
                    debtRatioElement.className = debtRatio <= 36 ? 'good' : 'needs-improvement';
                }
            } else if (debt === 0) {
                if (debtRatioElement) {
                    debtRatioElement.textContent = 'No debt! 🎉';
                    debtRatioElement.className = 'good';
                }
            }
        } else if (debtRatioElement) {
            debtRatioElement.textContent = 'N/A';
            debtRatioElement.className = '';
        }
    }

    /**
     * Gets a numeric value from an input field, ensuring non-negative and valid.
     * @param fieldName - The name attribute of the input field.
     * @returns The numeric value or 0 if invalid.
     */
    private getNumericValue(fieldName: string): number {
        const value = Number((this.container.querySelector(`[name="${fieldName}"]`) as HTMLInputElement)?.value);
        // Allow zero as valid, only block negatives and NaN
        if (typeof value !== 'number' || isNaN(value) || value < 0) return 0;
        return value;
    }

    /**
     * Updates the progress bar and text based on completed fields.
     */
    private updateProgress(): void {
        const form = this.container.querySelector('#quickAnalysisForm') as HTMLFormElement;
        const inputs = form.querySelectorAll('input[required]');
        let completedFields = 0;

        inputs.forEach(input => {
            if ((input as HTMLInputElement).value.trim() !== '') {
                completedFields++;
            }
        });

        const progress = (completedFields / inputs.length) * 100;
        const progressFill = document.getElementById('formProgress');
        const progressText = this.container.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressText) {
            if (progress === 100) {
                progressText.textContent = 'Ready to analyze!';
            } else {
                progressText.textContent = `${completedFields}/${inputs.length} fields completed`;
            }
        }
    }

    /**
     * Enables or disables the submit button based on form validity.
     */
    private updateSubmitButton(): void {
        const form = this.container.querySelector('#quickAnalysisForm') as HTMLFormElement;
        const button = document.getElementById('analyzeButton') as HTMLButtonElement;
        const inputs = form.querySelectorAll('input[required]');
        
        let allValid = true;
        inputs.forEach(input => {
            const htmlInput = input as HTMLInputElement;
            if (!htmlInput.value.trim() || !htmlInput.checkValidity()) {
                allValid = false;
            }
        });

        button.disabled = !allValid;
        button.classList.toggle('ready', allValid);
    }

    /**
     * Validates a single input field and provides feedback.
     * @param input - The input element to validate.
     */
    private validateField(input: HTMLInputElement): void {
        const fieldContainer = input.closest('.form-field');
        const feedback = fieldContainer?.querySelector('.input-feedback');
        if (!feedback) return;
        let isValid = true;
        let message = '';
        const value = this.getNumericValue(input.name);
        const fieldName = input.name;
        // Basic validation
        if (input.required && input.value.trim() === '') {
            isValid = false;
            message = 'This field is required';
        } else if (value < 0) {
            isValid = false;
            message = 'Value cannot be negative';
        } else {
            // Field-specific validation
            switch (fieldName) {
                case 'creditScore':
                    if (value < 300 || value > 850) {
                        isValid = false;
                        message = 'Credit score must be between 300 and 850';
                    }
                    break;
                // $0 is valid for all other fields, including debt
            }
        }
        fieldContainer?.classList.toggle('field-valid', isValid);
        fieldContainer?.classList.toggle('field-error', !isValid);
        if (feedback) {
            feedback.textContent = message;
            (feedback as HTMLElement).style.display = message ? 'block' : 'none';
        }
    }

    /**
     * Attaches tooltips to help icons for accessibility.
     */
    private attachTooltips(): void {
        const helpIcons = this.container.querySelectorAll('.help-icon');
        helpIcons.forEach(icon => {
            icon.addEventListener('mouseenter', (event) => {
                const tooltipText = (event.target as HTMLElement).dataset.tooltip;
                if (tooltipText) {
                    this.showTooltip(event.target as HTMLElement, tooltipText);
                }
            });

            icon.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    /**
     * Shows a tooltip for a help icon.
     * @param element - The help icon element.
     * @param text - The tooltip text.
     */
    private showTooltip(element: HTMLElement, text: string): void {
        // Ensure no old tooltips are lingering
        this.hideTooltip();

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        // Position tooltip relative to the document, not the viewport
        const top = rect.top + window.scrollY - 10;
        const left = rect.left + rect.width / 2;

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.transform = 'translate(-50%, -100%)';
    }

    /**
     * Hides any visible tooltip.
     */
    private hideTooltip(): void {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    /**
     * Handles form submission, validates all fields, and builds user data.
     */
    private handleSubmit(): void {
        const form = this.container.querySelector('#quickAnalysisForm') as HTMLFormElement;
        const formData = new FormData(form);
        
        // Show loading state
        const button = document.getElementById('analyzeButton') as HTMLButtonElement;
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');
        
        if (btnText && btnLoader) {
            (btnText as HTMLElement).style.display = 'none';
            (btnLoader as HTMLElement).style.display = 'block';
        }
        button.disabled = true;
        
        // Validate all fields and collect specific error messages
        const inputs = form.querySelectorAll('input[required]');
        const errors: string[] = [];
        
        inputs.forEach(input => {
            this.validateField(input as HTMLInputElement);
            const fieldContainer = (input as HTMLInputElement).closest('.form-field');
            if (fieldContainer?.classList.contains('field-error')) {
                const feedback = fieldContainer.querySelector('.input-feedback');
                if (feedback && feedback.textContent) {
                    const label = fieldContainer.querySelector('.label-text')?.textContent || 'Field';
                    errors.push(`<strong>${label}:</strong> ${feedback.textContent}`);
                }
            }
        });

        if (errors.length > 0) {
            this.showValidationErrors(errors);
            this.resetSubmitButton();
            return;
        }

        // Hide errors if all are fixed
        const errorContainer = this.container.querySelector('#validationErrors') as HTMLElement;
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }

        // Build UserFinancialData from user inputs (NO DEFAULT VALUES)
        const userData = this.buildUserDataFromForm(formData);
        
        // Log the actual data being used for analysis
        console.log('🔍 Quick Analysis - Using actual user data:', {
            monthlyIncome: userData.income.primarySalary,
            monthlyHousing: userData.expenses.housing,
            monthlyExpenses: userData.expenses.food + userData.expenses.transportation + userData.expenses.utilities,
            totalSavings: userData.assets.checking + userData.assets.savings + userData.assets.emergencyFund,
            totalDebt: userData.liabilities.creditCardDebt + userData.liabilities.autoLoans + userData.liabilities.studentLoans,
            creditScore: userData.liabilities.creditScore
        });
        
        this.onSubmit(userData);
    }

    /**
     * Resets the submit button to its default state after validation errors.
     */
    private resetSubmitButton(): void {
        const button = document.getElementById('analyzeButton') as HTMLButtonElement;
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');
        
        if (btnText && btnLoader) {
            (btnText as HTMLElement).style.display = 'block';
            (btnLoader as HTMLElement).style.display = 'none';
        }
        button.disabled = false;
    }

    /**
     * Builds a strictly-typed UserFinancialData object from form data.
     * @param formData - The FormData object from the form.
     * @returns The constructed UserFinancialData object.
     */
    private buildUserDataFromForm(formData: FormData): UserFinancialData {
        // Get actual user inputs (remove any commas from formatted currency)
        const monthlyIncome = parseFloat((formData.get('monthlyIncome') as string).replace(/[,$]/g, '')) || 0;
        const monthlyHousing = parseFloat((formData.get('monthlyHousing') as string).replace(/[,$]/g, '')) || 0;
        const monthlyExpenses = parseFloat((formData.get('monthlyExpenses') as string).replace(/[,$]/g, '')) || 0;
        const totalSavings = parseFloat((formData.get('totalSavings') as string).replace(/[,$]/g, '')) || 0;
        const totalDebt = parseFloat((formData.get('totalDebt') as string).replace(/[,$]/g, '')) || 0;
        const creditScore = parseFloat((formData.get('creditScore') as string)) || 300; // Minimum valid credit score

        // Validate that we have actual user data
        if (monthlyIncome === 0) {
            throw new Error('Monthly income is required and cannot be zero');
        }

        // Use only user-entered values for all fields
        return {
            personalInfo: {
                age: 35,
                maritalStatus: 'single',
                dependents: 0,
                state: 'CA',
                employmentStatus: 'employed',
                employmentTenure: 3,
                healthStatus: 'good',
                healthInsurance: true,
                lifeInsurance: false,
                shortTermDisability: false,
                longTermDisability: false
            },
            income: {
                primarySalary: monthlyIncome, // USER INPUT
                secondaryIncome: 0,
                businessIncome: 0,
                investmentIncome: 0,
                rentalIncome: 0,
                benefitsIncome: 0,
                otherIncome: 0,
                incomeGrowthRate: 0.03,
                incomeVariability: 'stable',
                effectiveTaxRate: 0.22
            },
            expenses: {
                housing: monthlyHousing, // USER INPUT
                utilities: 0,
                insurance: 0,
                loanPayments: 0,
                childcare: 0,
                food: 0,
                transportation: 0,
                healthcare: 0,
                clothing: 0,
                personalCare: 0,
                entertainment: 0,
                diningOut: 0,
                hobbies: 0,
                subscriptions: 0,
                shopping: 0,
                travel: 0,
                creditCardPayments: 0,
                studentLoanPayments: 0,
                otherDebtPayments: 0
            },
            assets: {
                checking: totalSavings, // USER INPUT
                savings: 0,
                moneyMarket: 0,
                emergencyFund: 0,
                employer401k: 0,
                traditionalIRA: 0,
                rothIRA: 0,
                brokerageAccounts: 0,
                stocks: 0,
                bonds: 0,
                mutualFunds: 0,
                primaryResidence: 0,
                investmentProperties: 0,
                cryptocurrency: 0,
                preciousMetals: 0,
                collectibles: 0,
                businessEquity: 0,
                otherAssets: 0
            },
            liabilities: {
                mortgageBalance: 0,
                homeEquityLoan: 0,
                autoLoans: 0,
                securedCreditLines: 0,
                creditCardDebt: totalDebt, // USER INPUT
                personalLoans: 0,
                studentLoans: 0,
                medicalDebt: 0,
                businessLoans: 0,
                businessCreditLines: 0,
                taxDebt: 0,
                legalJudgments: 0,
                otherDebt: 0,
                creditScore: creditScore, // USER INPUT
                totalCreditLimit: 0
            },
            insurance: {
                healthInsurance: true,
                healthDeductible: 0,
                healthOutOfPocketMax: 0,
                lifeInsurance: false,
                lifeCoverageAmount: 0,
                shortTermDisability: false,
                longTermDisability: false,
                disabilityCoveragePercent: 0,
                homeInsurance: false,
                autoInsurance: false,
                umbrellaPolicy: false,
                insuranceConfidence: 'somewhat-confident'
            },
            goals: {
                emergencyFundTarget: 0,
                debtPayoffGoal: totalDebt > 0,
                majorPurchaseAmount: 0,
                homeDownPayment: 0,
                educationFunding: 0,
                careerChangeBuffer: 0,
                retirementAge: 65,
                retirementIncomeNeeded: 0,
                legacyGoalAmount: 0,
                retirementConfidence: 'somewhat-confident',
                longTermGoalConfidence: 'somewhat-confident',
                riskTolerance: 'moderate',
                investmentExperience: 'intermediate'
            },
            behaviors: {
                billPaymentReliability: creditScore > 750 ? 'always-on-time' : creditScore > 650 ? 'usually-on-time' : 'sometimes-late',
                budgetingMethod: 'simple-tracking',
                financialPlanningEngagement: 'occasionally-plan',
                automaticSavings: totalSavings > monthlyIncome,
                monthlyInvestmentContribution: 0,
                emergencyFundPriority: totalSavings < (monthlyHousing + monthlyExpenses) * 3 ? 'high' : 'medium',
                impulseSpendingFrequency: 'sometimes',
                expenseTrackingMethod: 'casual'
            }
        };
    }

    /**
     * Shows validation errors in the UI.
     * @param errors - Array of error messages to display.
     */
    private showValidationErrors(errors: string[]): void {
        const errorContainer = this.container.querySelector('#validationErrors') as HTMLElement;
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="error-messages">
                    <h4>Please fix the following errors:</h4>
                    <ul>
                        ${errors.map(error => `<li>${error}</li>`).join('')}
                    </ul>
                </div>
            `;
            errorContainer.style.display = 'block';
        }
    }
}