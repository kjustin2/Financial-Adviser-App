/**
 * Quick Analysis Form Component
 * Simplified form requiring only essential financial inputs
 */

import { UserFinancialData } from '../../interfaces/core-types';

export class QuickAnalysisForm {
    private container: HTMLElement;
    private onSubmit: (data: UserFinancialData) => void;

    constructor(containerId: string, onSubmit: (data: UserFinancialData) => void) {
        const element = document.getElementById(containerId);
        if (!element) {
            throw new Error(`Element with ID ${containerId} not found`);
        }
        this.container = element;
        this.onSubmit = onSubmit;
    }

    public render(): void {
        this.container.innerHTML = this.generateHTML();
        this.attachEventListeners();
    }

    private generateHTML(): string {
        return `
            <div class="quick-analysis-form">
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

                <form id="quickAnalysisForm" class="quick-form">
                    <div class="form-grid">
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

    private formatCurrencyInput(input: HTMLInputElement): void {
        // First, strip any non-digit characters except for a decimal point
        const value = input.value.replace(/[^0-9.]/g, '');
        const numericValue = parseFloat(value) || 0;

        if (numericValue > 0) {
            // Format to a string with commas, but no fractional digits for simplicity
            input.value = numericValue.toLocaleString('en-US', {
                maximumFractionDigits: 0,
            });
        } else {
            // Clear the input if it's zero or invalid
            input.value = '';
        }
    }

    private updateRealTimeCalculations(): void {
        const income = this.getNumericValue('monthlyIncome');
        const housing = this.getNumericValue('monthlyHousing');
        const expenses = this.getNumericValue('monthlyExpenses');
        const savings = this.getNumericValue('totalSavings');
        const debt = this.getNumericValue('totalDebt');

        // Update emergency fund months
        const totalExpenses = housing + expenses;
        if (totalExpenses > 0 && savings > 0) {
            const emergencyMonths = (savings / totalExpenses).toFixed(1);
            const emergencyGoal = document.getElementById('emergencyGoal');
            if (emergencyGoal) {
                emergencyGoal.textContent = emergencyMonths;
                emergencyGoal.className = parseFloat(emergencyMonths) >= 3 ? 'good' : 'needs-improvement';
            }
        }

        // Update debt-to-income ratio
        if (income > 0 && debt > 0) {
            const annualIncome = income * 12;
            const debtRatio = ((debt / annualIncome) * 100).toFixed(1);
            const debtRatioElement = document.getElementById('debtRatio');
            if (debtRatioElement) {
                debtRatioElement.textContent = `${debtRatio}%`;
                debtRatioElement.className = parseFloat(debtRatio) <= 36 ? 'good' : 'needs-improvement';
            }
        }
    }

    private getNumericValue(fieldName: string): number {
        const input = document.getElementById(fieldName) as HTMLInputElement;
        // Strip commas and currency symbols for accurate parsing
        return input ? parseFloat(input.value.replace(/[^0-9.-]/g, '')) || 0 : 0;
    }

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

    private validateField(input: HTMLInputElement): void {
        const fieldContainer = input.closest('.form-field');
        const feedback = fieldContainer?.querySelector('.input-feedback');
        
        if (!feedback) return;

        let isValid = true;
        let message = '';

        const value = this.getNumericValue(input.name);
        const fieldName = input.name;

        // Basic validation
        if (input.required && !input.value.trim()) {
            isValid = false;
            message = 'This field is required';
        } else if (value < 0) {
            isValid = false;
            message = 'Value cannot be negative';
        } else {
            // Field-specific validation (only for hard rules)
            switch (fieldName) {
                case 'creditScore':
                    if (value < 300 || value > 850) {
                        isValid = false;
                        message = 'Credit score must be between 300 and 850';
                    }
                    break;
                // REMOVED: Subjective validation for income and housing to prevent incorrect limits.
                // The user should be able to input any realistic value without warnings
                // that could be misinterpreted as errors.
            }
        }

        // Update field appearance
        fieldContainer?.classList.toggle('field-valid', isValid);
        fieldContainer?.classList.toggle('field-error', !isValid);
        
        if (feedback) {
            feedback.textContent = message;
            (feedback as HTMLElement).style.display = message ? 'block' : 'none';
        }
    }

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

    private hideTooltip(): void {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

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

        // Build comprehensive data structure using ONLY user inputs with intelligent allocation
        return {
            personalInfo: {
                age: 35, // Reasonable default for calculations
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
                utilities: Math.round(monthlyExpenses * 0.15), // Based on user's total expenses
                insurance: Math.round(monthlyExpenses * 0.10),
                loanPayments: Math.round(totalDebt * 0.02), // Based on user's debt
                childcare: 0,
                food: Math.round(monthlyExpenses * 0.30), // Based on user's total expenses
                transportation: Math.round(monthlyExpenses * 0.25),
                healthcare: Math.round(monthlyExpenses * 0.08),
                clothing: Math.round(monthlyExpenses * 0.05),
                personalCare: Math.round(monthlyExpenses * 0.03),
                entertainment: Math.round(monthlyExpenses * 0.10),
                diningOut: Math.round(monthlyExpenses * 0.08),
                hobbies: Math.round(monthlyExpenses * 0.04),
                subscriptions: Math.round(monthlyExpenses * 0.02),
                shopping: Math.round(monthlyExpenses * 0.06),
                travel: Math.round(monthlyExpenses * 0.08),
                creditCardPayments: Math.round(totalDebt * 0.015), // Based on user's debt
                studentLoanPayments: Math.round(totalDebt * 0.005),
                otherDebtPayments: 0
            },
            assets: {
                checking: Math.round(totalSavings * 0.20), // Based on user's savings
                savings: Math.round(totalSavings * 0.50),
                moneyMarket: 0,
                emergencyFund: Math.round(totalSavings * 0.30),
                employer401k: Math.round(monthlyIncome * 12 * 2), // Based on user's income
                traditionalIRA: 0,
                rothIRA: 0,
                brokerageAccounts: Math.round(totalSavings * 0.10),
                stocks: 0,
                bonds: 0,
                mutualFunds: 0,
                primaryResidence: monthlyHousing * 200, // Based on user's housing cost
                investmentProperties: 0,
                cryptocurrency: 0,
                preciousMetals: 0,
                collectibles: 0,
                businessEquity: 0,
                otherAssets: 0
            },
            liabilities: {
                mortgageBalance: monthlyHousing > 1000 ? monthlyHousing * 150 : 0, // Based on user's housing
                homeEquityLoan: 0,
                autoLoans: Math.round(totalDebt * 0.30), // Based on user's debt
                securedCreditLines: 0,
                creditCardDebt: Math.round(totalDebt * 0.40),
                personalLoans: Math.round(totalDebt * 0.10),
                studentLoans: Math.round(totalDebt * 0.20),
                medicalDebt: 0,
                businessLoans: 0,
                businessCreditLines: 0,
                taxDebt: 0,
                legalJudgments: 0,
                otherDebt: 0,
                creditScore: creditScore, // USER INPUT
                totalCreditLimit: Math.round(totalDebt * 2.5) // Based on user's debt
            },
            insurance: {
                healthInsurance: true,
                healthDeductible: 2000,
                healthOutOfPocketMax: 8000,
                lifeInsurance: false,
                lifeCoverageAmount: 0,
                shortTermDisability: false,
                longTermDisability: false,
                disabilityCoveragePercent: 0,
                homeInsurance: true,
                autoInsurance: true,
                umbrellaPolicy: false,
                insuranceConfidence: 'somewhat-confident'
            },
            goals: {
                emergencyFundTarget: (monthlyHousing + monthlyExpenses) * 6, // Based on user's expenses
                debtPayoffGoal: totalDebt > 0,
                majorPurchaseAmount: 0,
                homeDownPayment: 0,
                educationFunding: 0,
                careerChangeBuffer: 0,
                retirementAge: 65,
                retirementIncomeNeeded: monthlyIncome * 0.80, // Based on user's income
                legacyGoalAmount: 0,
                retirementConfidence: 'somewhat-confident',
                longTermGoalConfidence: 'somewhat-confident',
                riskTolerance: 'moderate',
                investmentExperience: 'intermediate'
            },
            behaviors: {
                billPaymentReliability: creditScore > 750 ? 'always-on-time' : creditScore > 650 ? 'usually-on-time' : 'sometimes-late', // Based on user's credit score
                budgetingMethod: 'simple-tracking',
                financialPlanningEngagement: 'occasionally-plan',
                automaticSavings: totalSavings > monthlyIncome,
                monthlyInvestmentContribution: Math.round(monthlyIncome * 0.10), // Based on user's income
                emergencyFundPriority: totalSavings < (monthlyHousing + monthlyExpenses) * 3 ? 'high' : 'medium', // Based on user's data
                impulseSpendingFrequency: 'sometimes',
                expenseTrackingMethod: 'casual'
            }
        };
    }

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
            (errorContainer as HTMLElement).style.display = 'block';
            errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
} 