/**
 * Comprehensive Financial Health Analyzer Application
 * Based on Financial Health Network 2024 research and 8 key health indicators
 */

import { UserFinancialData, ComprehensiveAnalysisResult, FormStep, FormField, UserBehaviorData, BiasDetectionResult, BiasAssessmentResponse, MitigationPlan } from './types';
import { FinancialCalculationEngine } from './core/calculations';
import { BehaviorAssessmentForm } from './components/forms/BehaviorAssessmentForm';
import { BiasDetectionEngine } from './core/BiasDetectionEngine';
import { MitigationEngine } from './core/MitigationEngine';
import { MitigationReport } from './components/reports/MitigationReport';

class ComprehensiveFinancialHealthApp {
    private currentStepIndex: number = 0;
    private formData: Partial<UserFinancialData> = {};
    private steps: FormStep[] = [];
    private analysisResult?: ComprehensiveAnalysisResult;
    
    // Behavioral Finance Components
    private biasDetectionEngine: BiasDetectionEngine;
    private mitigationEngine: MitigationEngine;
    private mitigationReport: MitigationReport;
    private biasResults: BiasDetectionResult[] = [];
    private mitigationPlan?: MitigationPlan;

    // DOM Elements
    private elements = {
        formContainer: document.getElementById('formContainer') as HTMLElement,
        multiStepForm: document.getElementById('multiStepForm') as HTMLElement,
        resultsContainer: document.getElementById('resultsContainer') as HTMLElement,
        loadingIndicator: document.getElementById('loadingIndicator') as HTMLElement,
        analysisResults: document.getElementById('analysisResults') as HTMLElement,
        errorMessage: document.getElementById('errorMessage') as HTMLElement,
        healthScoreSummary: document.getElementById('healthScoreSummary') as HTMLElement,
        healthScoreCircle: document.getElementById('healthScoreCircle') as HTMLElement,
        healthScoreValue: document.getElementById('healthScoreValue') as HTMLElement,
        healthLevelText: document.getElementById('healthLevelText') as HTMLElement,
        healthIndicatorsGrid: document.getElementById('healthIndicatorsGrid') as HTMLElement,
        keyMetricsSection: document.getElementById('keyMetricsSection') as HTMLElement
    };

    constructor() {
        // Initialize behavioral finance engines
        this.biasDetectionEngine = new BiasDetectionEngine();
        this.mitigationEngine = new MitigationEngine();
        this.mitigationReport = new MitigationReport('mitigationReport');
        
        this.initializeSteps();
        this.initializeFormData();
        this.render();
    }

    private initializeSteps(): void {
        this.steps = [
            {
                id: 'personal-info',
                title: 'Personal Information',
                description: 'Tell us about yourself to personalize your analysis',
                fields: [
                    {
                        id: 'age',
                        type: 'number',
                        label: 'Age',
                        description: 'Your current age',
                        required: true,
                        value: 30,
                        validation: { min: 18, max: 100 }
                    },
                    {
                        id: 'maritalStatus',
                        type: 'select',
                        label: 'Marital Status',
                        required: true,
                        value: 'single',
                        options: [
                            { value: 'single', label: 'Single' },
                            { value: 'married', label: 'Married' },
                            { value: 'divorced', label: 'Divorced' },
                            { value: 'widowed', label: 'Widowed' }
                        ]
                    },
                    {
                        id: 'dependents',
                        type: 'number',
                        label: 'Number of Dependents',
                        description: 'Children or others who depend on you financially',
                        required: true,
                        value: 0,
                        validation: { min: 0, max: 10 }
                    },
                    {
                        id: 'employmentStatus',
                        type: 'select',
                        label: 'Employment Status',
                        required: true,
                        value: 'employed',
                        options: [
                            { value: 'employed', label: 'Employed' },
                            { value: 'self-employed', label: 'Self-Employed' },
                            { value: 'unemployed', label: 'Unemployed' },
                            { value: 'retired', label: 'Retired' },
                            { value: 'student', label: 'Student' }
                        ]
                    },
                    {
                        id: 'employmentTenure',
                        type: 'number',
                        label: 'Years at Current Job',
                        description: 'How long have you been in your current position?',
                        required: true,
                        value: 3,
                        validation: { min: 0, max: 50 }
                    }
                ],
                isComplete: false,
                validationErrors: []
            },
            {
                id: 'income',
                title: 'Income Sources',
                description: 'All sources of monthly income (after taxes)',
                fields: [
                    {
                        id: 'primarySalary',
                        type: 'number',
                        label: 'Primary Salary (Monthly)',
                        description: 'Your main job salary after taxes',
                        required: true,
                        value: 5000,
                        validation: { min: 0, step: 100 }
                    },
                    {
                        id: 'secondaryIncome',
                        type: 'number',
                        label: 'Secondary Income (Monthly)',
                        description: 'Part-time work, freelancing, side hustles',
                        required: false,
                        value: 0,
                        validation: { min: 0, step: 50 }
                    },
                    {
                        id: 'businessIncome',
                        type: 'number',
                        label: 'Business Income (Monthly)',
                        description: 'Net income from business ownership',
                        required: false,
                        value: 0,
                        validation: { min: 0, step: 100 }
                    },
                    {
                        id: 'investmentIncome',
                        type: 'number',
                        label: 'Investment Income (Monthly)',
                        description: 'Dividends, interest, capital gains',
                        required: false,
                        value: 0,
                        validation: { min: 0, step: 25 }
                    },
                    {
                        id: 'rentalIncome',
                        type: 'number',
                        label: 'Rental Income (Monthly)',
                        description: 'Net rental income from properties',
                        required: false,
                        value: 0,
                        validation: { min: 0, step: 100 }
                    },
                    {
                        id: 'benefitsIncome',
                        type: 'number',
                        label: 'Benefits Income (Monthly)',
                        description: 'Social Security, disability, unemployment',
                        required: false,
                        value: 0,
                        validation: { min: 0, step: 50 }
                    }
                ],
                isComplete: false,
                validationErrors: []
            },
            {
                id: 'expenses',
                title: 'Monthly Expenses',
                description: 'Break down your monthly spending',
                fields: [
                    {
                        id: 'housing',
                        type: 'number',
                        label: 'Housing (Rent/Mortgage)',
                        description: 'Monthly housing payment',
                        required: true,
                        value: 1500,
                        validation: { min: 0, step: 50 }
                    },
                    {
                        id: 'utilities',
                        type: 'number',
                        label: 'Utilities',
                        description: 'Electric, gas, water, internet, phone',
                        required: true,
                        value: 200,
                        validation: { min: 0, step: 25 }
                    },
                    {
                        id: 'food',
                        type: 'number',
                        label: 'Food & Groceries',
                        description: 'Monthly food spending',
                        required: true,
                        value: 400,
                        validation: { min: 0, step: 25 }
                    },
                    {
                        id: 'transportation',
                        type: 'number',
                        label: 'Transportation',
                        description: 'Car payment, gas, insurance, public transit',
                        required: true,
                        value: 300,
                        validation: { min: 0, step: 25 }
                    },
                    {
                        id: 'healthcare',
                        type: 'number',
                        label: 'Healthcare',
                        description: 'Insurance premiums, copays, medications',
                        required: true,
                        value: 150,
                        validation: { min: 0, step: 25 }
                    },
                    {
                        id: 'creditCardPayments',
                        type: 'number',
                        label: 'Credit Card Payments',
                        description: 'Monthly credit card payments',
                        required: true,
                        value: 100,
                        validation: { min: 0, step: 25 }
                    },
                    {
                        id: 'studentLoanPayments',
                        type: 'number',
                        label: 'Student Loan Payments',
                        description: 'Monthly student loan payments',
                        required: false,
                        value: 200,
                        validation: { min: 0, step: 25 }
                    },
                    {
                        id: 'entertainment',
                        type: 'number',
                        label: 'Entertainment',
                        description: 'Movies, subscriptions, hobbies',
                        required: false,
                        value: 100,
                        validation: { min: 0, step: 25 }
                    },
                    {
                        id: 'diningOut',
                        type: 'number',
                        label: 'Dining Out',
                        description: 'Restaurants, takeout, coffee',
                        required: false,
                        value: 150,
                        validation: { min: 0, step: 25 }
                    }
                ],
                isComplete: false,
                validationErrors: []
            },
            {
                id: 'assets',
                title: 'Assets & Savings',
                description: 'Your current assets and investments',
                fields: [
                    {
                        id: 'checking',
                        type: 'number',
                        label: 'Checking Account',
                        description: 'Current balance in checking',
                        required: true,
                        value: 2000,
                        validation: { min: 0, step: 100 }
                    },
                    {
                        id: 'savings',
                        type: 'number',
                        label: 'Savings Account',
                        description: 'Current savings balance',
                        required: true,
                        value: 5000,
                        validation: { min: 0, step: 100 }
                    },
                    {
                        id: 'emergencyFund',
                        type: 'number',
                        label: 'Emergency Fund',
                        description: 'Funds specifically for emergencies',
                        required: true,
                        value: 3000,
                        validation: { min: 0, step: 100 }
                    },
                    {
                        id: 'employer401k',
                        type: 'number',
                        label: '401(k) Balance',
                        description: 'Current 401k balance',
                        required: false,
                        value: 25000,
                        validation: { min: 0, step: 1000 }
                    },
                    {
                        id: 'traditionalIRA',
                        type: 'number',
                        label: 'Traditional IRA',
                        description: 'Traditional IRA balance',
                        required: false,
                        value: 0,
                        validation: { min: 0, step: 1000 }
                    },
                    {
                        id: 'rothIRA',
                        type: 'number',
                        label: 'Roth IRA',
                        description: 'Roth IRA balance',
                        required: false,
                        value: 0,
                        validation: { min: 0, step: 1000 }
                    },
                    {
                        id: 'brokerageAccounts',
                        type: 'number',
                        label: 'Brokerage Accounts',
                        description: 'Taxable investment accounts',
                        required: false,
                        value: 0,
                        validation: { min: 0, step: 1000 }
                    }
                ],
                isComplete: false,
                validationErrors: []
            },
            {
                id: 'liabilities',
                title: 'Debts & Liabilities',
                description: 'Your current debts and obligations',
                fields: [
                    {
                        id: 'creditCardDebt',
                        type: 'number',
                        label: 'Credit Card Debt',
                        description: 'Total credit card balances',
                        required: true,
                        value: 2000,
                        validation: { min: 0, step: 100 }
                    },
                    {
                        id: 'studentLoans',
                        type: 'number',
                        label: 'Student Loans',
                        description: 'Total student loan debt',
                        required: false,
                        value: 15000,
                        validation: { min: 0, step: 1000 }
                    },
                    {
                        id: 'autoLoans',
                        type: 'number',
                        label: 'Auto Loans',
                        description: 'Car loan balances',
                        required: false,
                        value: 8000,
                        validation: { min: 0, step: 500 }
                    },
                    {
                        id: 'mortgageBalance',
                        type: 'number',
                        label: 'Mortgage Balance',
                        description: 'Remaining mortgage debt',
                        required: false,
                        value: 0,
                        validation: { min: 0, step: 1000 }
                    },
                    {
                        id: 'personalLoans',
                        type: 'number',
                        label: 'Personal Loans',
                        description: 'Other personal debt',
                        required: false,
                        value: 0,
                        validation: { min: 0, step: 500 }
                    },
                    {
                        id: 'creditScore',
                        type: 'number',
                        label: 'Credit Score',
                        description: 'Your current credit score',
                        required: true,
                        value: 720,
                        validation: { min: 300, max: 850 }
                    },
                    {
                        id: 'totalCreditLimit',
                        type: 'number',
                        label: 'Total Credit Limit',
                        description: 'Combined credit card limits',
                        required: true,
                        value: 10000,
                        validation: { min: 0, step: 500 }
                    }
                ],
                isComplete: false,
                validationErrors: []
            },
            {
                id: 'goals-behavior',
                title: 'Goals & Behavior',
                description: 'Your financial goals and habits',
                fields: [
                    {
                        id: 'retirementAge',
                        type: 'number',
                        label: 'Target Retirement Age',
                        description: 'When do you want to retire?',
                        required: true,
                        value: 65,
                        validation: { min: 50, max: 80 }
                    },
                    {
                        id: 'retirementIncomeNeeded',
                        type: 'number',
                        label: 'Monthly Retirement Income Goal',
                        description: 'How much monthly income do you want in retirement?',
                        required: true,
                        value: 4000,
                        validation: { min: 1000, step: 500 }
                    },
                    {
                        id: 'emergencyFundTarget',
                        type: 'number',
                        label: 'Emergency Fund Target',
                        description: 'Your target emergency fund amount',
                        required: true,
                        value: 10000,
                        validation: { min: 1000, step: 1000 }
                    },
                    {
                        id: 'monthlyInvestmentContribution',
                        type: 'number',
                        label: 'Monthly Investment Contribution',
                        description: 'How much do you invest monthly?',
                        required: true,
                        value: 300,
                        validation: { min: 0, step: 50 }
                    },
                    {
                        id: 'riskTolerance',
                        type: 'select',
                        label: 'Risk Tolerance',
                        required: true,
                        value: 'moderate',
                        options: [
                            { value: 'conservative', label: 'Conservative - Prefer stability' },
                            { value: 'moderate', label: 'Moderate - Balanced approach' },
                            { value: 'aggressive', label: 'Aggressive - Higher risk for growth' }
                        ]
                    },
                    {
                        id: 'billPaymentReliability',
                        type: 'select',
                        label: 'Bill Payment History',
                        required: true,
                        value: 'usually-on-time',
                        options: [
                            { value: 'always-on-time', label: 'Always pay on time' },
                            { value: 'usually-on-time', label: 'Usually pay on time' },
                            { value: 'sometimes-late', label: 'Sometimes pay late' },
                            { value: 'often-late', label: 'Often pay late' }
                        ]
                    },
                    {
                        id: 'budgetingMethod',
                        type: 'select',
                        label: 'Budgeting Method',
                        required: true,
                        value: 'simple-tracking',
                        options: [
                            { value: 'detailed-budget', label: 'Detailed budget tracking' },
                            { value: 'simple-tracking', label: 'Simple expense tracking' },
                            { value: 'mental-budget', label: 'Mental budget only' },
                            { value: 'no-budget', label: 'No budgeting' }
                        ]
                    }
                ],
                isComplete: false,
                validationErrors: []
            }
        ];
    }

    private initializeFormData(): void {
        // Initialize with default values from form fields
        this.formData = {
            personalInfo: {
                age: 30,
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
                primarySalary: 5000,
                secondaryIncome: 0,
                businessIncome: 0,
                investmentIncome: 0,
                rentalIncome: 0,
                benefitsIncome: 0,
                otherIncome: 0,
                incomeGrowthRate: 3,
                incomeVariability: 'stable',
                effectiveTaxRate: 22
            },
            expenses: {
                housing: 1500,
                utilities: 200,
                insurance: 150,
                loanPayments: 400,
                childcare: 0,
                food: 400,
                transportation: 300,
                healthcare: 150,
                clothing: 100,
                personalCare: 50,
                entertainment: 100,
                diningOut: 150,
                hobbies: 50,
                subscriptions: 50,
                shopping: 100,
                travel: 200,
                creditCardPayments: 100,
                studentLoanPayments: 200,
                otherDebtPayments: 100
            },
            assets: {
                checking: 2000,
                savings: 5000,
                moneyMarket: 0,
                emergencyFund: 3000,
                employer401k: 25000,
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
                autoLoans: 8000,
                securedCreditLines: 0,
                creditCardDebt: 2000,
                personalLoans: 0,
                studentLoans: 15000,
                medicalDebt: 0,
                businessLoans: 0,
                businessCreditLines: 0,
                taxDebt: 0,
                legalJudgments: 0,
                otherDebt: 0,
                creditScore: 720,
                totalCreditLimit: 10000
            },
            insurance: {
                healthInsurance: true,
                healthDeductible: 2000,
                healthOutOfPocketMax: 6000,
                lifeInsurance: false,
                lifeCoverageAmount: 0,
                shortTermDisability: false,
                longTermDisability: false,
                disabilityCoveragePercent: 0,
                homeInsurance: false,
                autoInsurance: true,
                umbrellaPolicy: false,
                insuranceConfidence: 'somewhat-confident'
            },
            goals: {
                emergencyFundTarget: 10000,
                debtPayoffGoal: true,
                majorPurchaseAmount: 5000,
                homeDownPayment: 0,
                educationFunding: 0,
                careerChangeBuffer: 0,
                retirementAge: 65,
                retirementIncomeNeeded: 4000,
                legacyGoalAmount: 0,
                retirementConfidence: 'somewhat-confident',
                longTermGoalConfidence: 'somewhat-confident',
                riskTolerance: 'moderate',
                investmentExperience: 'intermediate'
            },
            behaviors: {
                billPaymentReliability: 'usually-on-time',
                budgetingMethod: 'simple-tracking',
                financialPlanningEngagement: 'occasionally-plan',
                automaticSavings: true,
                monthlyInvestmentContribution: 300,
                emergencyFundPriority: 'high',
                impulseSpendingFrequency: 'sometimes',
                expenseTrackingMethod: 'casual'
            }
        };
    }

    private render(): void {
        this.elements.multiStepForm.innerHTML = this.getFormHTML();
        this.attachEventListeners();
    }

    private getFormHTML(): string {
        return `
            <div class="multi-step-form">
                <div class="form-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((this.currentStepIndex + 1) / this.steps.length) * 100}%"></div>
                    </div>
                    <div class="progress-text">Step ${this.currentStepIndex + 1} of ${this.steps.length}</div>
                </div>
                
                <div class="form-step-content">
                    ${this.renderCurrentStep()}
                </div>
                
                <div class="form-navigation">
                    <button class="btn-secondary" id="prevBtn" ${this.currentStepIndex === 0 ? 'disabled' : ''}>
                        Previous
                    </button>
                    <button class="btn-primary" id="nextBtn">
                        ${this.currentStepIndex === this.steps.length - 1 ? 'Complete Analysis' : 'Next'}
                    </button>
                </div>
            </div>
        `;
    }

    private renderCurrentStep(): string {
        const step = this.steps[this.currentStepIndex];
        
        return `
            <div class="step-header">
                <h2>${step.title}</h2>
                <p>${step.description}</p>
            </div>
            
            <div class="step-fields">
                ${step.fields.map(field => this.renderField(field)).join('')}
            </div>
        `;
    }

    private renderField(field: FormField): string {
        const value = this.getFieldValue(field.id);
        
        switch (field.type) {
            case 'number':
                return `
                    <div class="form-field">
                        <label for="${field.id}">
                            ${field.label}
                            ${field.required ? '<span class="required">*</span>' : ''}
                        </label>
                        ${field.description ? `<p class="field-description">${field.description}</p>` : ''}
                        <input 
                            type="number" 
                            id="${field.id}" 
                            name="${field.id}"
                            value="${value}"
                            ${field.required ? 'required' : ''}
                            ${field.validation?.min !== undefined ? `min="${field.validation.min}"` : ''}
                            ${field.validation?.max !== undefined ? `max="${field.validation.max}"` : ''}
                            ${field.validation?.step !== undefined ? `step="${field.validation.step}"` : ''}
                        />
                    </div>
                `;
            
            case 'select':
                return `
                    <div class="form-field">
                        <label for="${field.id}">
                            ${field.label}
                            ${field.required ? '<span class="required">*</span>' : ''}
                        </label>
                        ${field.description ? `<p class="field-description">${field.description}</p>` : ''}
                        <select id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>
                            ${field.options?.map(option => 
                                `<option value="${option.value}" ${value === option.value ? 'selected' : ''}>${option.label}</option>`
                            ).join('')}
                        </select>
                    </div>
                `;
            
            default:
                return '';
        }
    }

    private getFieldValue(fieldId: string): any {
        const currentStep = this.steps[this.currentStepIndex];
        const field = currentStep.fields.find(f => f.id === fieldId);
        return field?.value || '';
    }

    private attachEventListeners(): void {
        const prevBtn = document.getElementById('prevBtn') as HTMLButtonElement;
        const nextBtn = document.getElementById('nextBtn') as HTMLButtonElement;

        prevBtn?.addEventListener('click', () => this.previousStep());
        nextBtn?.addEventListener('click', () => this.nextStep());

        // Add input event listeners for real-time validation
        const inputs = document.querySelectorAll('#multiStepForm input, #multiStepForm select');
        inputs.forEach(input => {
            input.addEventListener('change', (e) => this.handleFieldChange(e));
        });
    }

    private handleFieldChange(event: Event): void {
        const input = event.target as HTMLInputElement | HTMLSelectElement;
        const fieldId = input.id;
        const value = input.type === 'number' ? parseFloat(input.value) || 0 : input.value;
        
        // Update the field value in the current step
        const currentStep = this.steps[this.currentStepIndex];
        const field = currentStep.fields.find(f => f.id === fieldId);
        if (field) {
            field.value = value;
        }

        // Update the form data structure
        this.updateFormData(fieldId, value);
    }

    private updateFormData(fieldId: string, value: any): void {
        const currentStepId = this.steps[this.currentStepIndex].id;
        
        switch (currentStepId) {
            case 'personal-info':
                if (!this.formData.personalInfo) this.formData.personalInfo = {} as any;
                (this.formData.personalInfo as any)[fieldId] = value;
                break;
            case 'income':
                if (!this.formData.income) this.formData.income = {} as any;
                (this.formData.income as any)[fieldId] = value;
                break;
            case 'expenses':
                if (!this.formData.expenses) this.formData.expenses = {} as any;
                (this.formData.expenses as any)[fieldId] = value;
                break;
            case 'assets':
                if (!this.formData.assets) this.formData.assets = {} as any;
                (this.formData.assets as any)[fieldId] = value;
                break;
            case 'liabilities':
                if (!this.formData.liabilities) this.formData.liabilities = {} as any;
                (this.formData.liabilities as any)[fieldId] = value;
                break;
            case 'goals-behavior':
                if (fieldId === 'retirementAge' || fieldId === 'retirementIncomeNeeded' || fieldId === 'emergencyFundTarget' || fieldId === 'riskTolerance') {
                    if (!this.formData.goals) this.formData.goals = {} as any;
                    (this.formData.goals as any)[fieldId] = value;
                } else if (fieldId === 'monthlyInvestmentContribution' || fieldId === 'billPaymentReliability' || fieldId === 'budgetingMethod') {
                    if (!this.formData.behaviors) this.formData.behaviors = {} as any;
                    (this.formData.behaviors as any)[fieldId] = value;
                }
                break;
        }
    }

    private validateCurrentStep(): boolean {
        const currentStep = this.steps[this.currentStepIndex];
        const errors: string[] = [];

        for (const field of currentStep.fields) {
            // Allow 0 as a valid value for number fields
            if (field.required && (field.value === undefined || field.value === null || 
                (field.value === '' && field.type !== 'number') || 
                (field.type === 'number' && isNaN(Number(field.value))))) {
                errors.push(`${field.label} is required`);
            }
            
            if (field.type === 'number' && field.validation && field.value !== undefined && field.value !== null && field.value !== '') {
                const numValue = parseFloat(field.value);
                if (!isNaN(numValue)) {
                    if (field.validation.min !== undefined && numValue < field.validation.min) {
                        errors.push(`${field.label} must be at least ${field.validation.min}`);
                    }
                    if (field.validation.max !== undefined && numValue > field.validation.max) {
                        errors.push(`${field.label} must be at most ${field.validation.max}`);
                    }
                }
            }
        }

        currentStep.validationErrors = errors;
        currentStep.isComplete = errors.length === 0;
        
        if (errors.length > 0) {
            this.showError('Please fix the following errors:\n' + errors.join('\n'));
        } else {
            this.hideError();
        }
        
        return errors.length === 0;
    }

    private previousStep(): void {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            this.render();
        }
    }

    private nextStep(): void {
        if (this.validateCurrentStep()) {
            if (this.currentStepIndex === this.steps.length - 1) {
                this.completeForm();
            } else {
                this.currentStepIndex++;
                this.render();
            }
        }
    }

    private async completeForm(): Promise<void> {
        try {
            // Show loading state
            this.elements.resultsContainer.classList.remove('results-hidden');
            this.elements.loadingIndicator.style.display = 'block';
            this.elements.analysisResults.style.display = 'none';

            // Add a short delay to show loading state
            await new Promise(resolve => setTimeout(resolve, 1500));

            this.analysisResult = FinancialCalculationEngine.analyzeFinancialHealth(this.formData as UserFinancialData);
            await this.runBehavioralFinanceAnalysis();
            this.displayResults();
        } catch (error) {
            this.showError('Analysis failed. Please check your inputs and try again.');
        } finally {
            this.elements.loadingIndicator.style.display = 'none';
        }
    }

    private async runBehavioralFinanceAnalysis(): Promise<void> {
        try {
            // Create behavior assessment form
            const behaviorAssessmentContainer = document.getElementById('behavior-assessment');
            if (behaviorAssessmentContainer) {
                new BehaviorAssessmentForm(behaviorAssessmentContainer, {
                    onComplete: () => {
                        // Process the results if needed
                    }
                });
            }

            // Simulate user behavior data (in real app, this would come from user interactions)
            const simulatedBehaviorData: UserBehaviorData = {
                tradingPatterns: {
                    frequency: 'monthly',
                    portfolioTurnover: 0.3,
                    marketTimingAttempts: 2,
                    diversificationLevel: 0.7
                },
                informationSeeking: {
                    sourcesUsed: ['financial_news', 'advisor', 'online_research'],
                    frequencyOfResearch: 3,
                    newsReactionTime: 2,
                    expertAdviceReliance: 0.6
                },
                riskBehavior: {
                    actualRiskTolerance: 0.6,
                    statedRiskTolerance: 0.7,
                    riskDiscrepancy: 0.1,
                    panicSellingHistory: false,
                    fomoBuyingHistory: true
                },
                planningBehavior: {
                    budgetingConsistency: 0.8,
                    goalSettingClarity: 0.7,
                    longTermThinking: 0.9,
                    impulsiveDecisions: 0.2
                }
            };

            // Simulate assessment responses (in real app, these would come from user input)
            const simulatedResponses: BiasAssessmentResponse[] = [
                { questionId: 'overconfidence_1', response: 'somewhat_agree', timeSpent: 15, confidence: 4 },
                { questionId: 'loss_aversion_1', response: 'agree', timeSpent: 12, confidence: 5 },
                { questionId: 'anchoring_1', response: 'neutral', timeSpent: 18, confidence: 3 }
            ];

            // Run bias detection
            this.biasResults = this.biasDetectionEngine.detectBiases(
                this.formData as UserFinancialData,
                simulatedBehaviorData,
                simulatedResponses
            );

            // Generate mitigation plan
            this.mitigationPlan = this.mitigationEngine.generateMitigationPlan(
                this.formData as UserFinancialData,
                simulatedBehaviorData,
                this.biasResults,
                simulatedResponses
            );

            // Display mitigation report
            this.displayMitigationReport();

        } catch (error) {
            console.error('Behavioral finance analysis error:', error);
            this.showError('An error occurred during behavioral analysis.');
        }
    }

    private displayMitigationReport(): void {
        if (!this.mitigationPlan) return;

        // Show mitigation report section
        const mitigationSection = document.getElementById('mitigationReportSection');
        if (mitigationSection) {
            mitigationSection.style.display = 'block';
        }

        // Render mitigation report
        this.mitigationReport.updatePlan(this.mitigationPlan);
    }

    private displayResults(): void {
        if (!this.analysisResult) return;

        // Hide loading, show results
        this.elements.loadingIndicator.style.display = 'none';
        this.elements.analysisResults.style.display = 'block';

        // Update health score
        this.elements.healthScoreValue.textContent = this.analysisResult.overallHealthScore.toString();
        this.elements.healthLevelText.textContent = this.getHealthLevelText(this.analysisResult.healthLevel);
        
        // Set health score circle color
        this.elements.healthScoreCircle.className = `health-score-circle score-${this.analysisResult.healthLevel}`;

        // Render health indicators
        this.renderHealthIndicators();
        
        // Render key metrics
        this.renderKeyMetrics();
    }

    private renderHealthIndicators(): void {
        if (!this.analysisResult) return;

        const indicatorsHTML = this.analysisResult.healthIndicators.map(indicator => `
            <div class="indicator-card">
                <div class="indicator-header">
                    <div class="indicator-name">${indicator.name}</div>
                    <div class="indicator-score status-${indicator.status}">${indicator.score}/100</div>
                </div>
                <div class="indicator-metrics">
                    ${indicator.metrics.map(metric => `
                        <div class="metric-row">
                            <div class="metric-label">${metric.title}</div>
                            <div class="metric-value">${metric.value}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        this.elements.healthIndicatorsGrid.innerHTML = indicatorsHTML;
    }

    private renderKeyMetrics(): void {
        if (!this.analysisResult) return;

        const metrics = this.analysisResult.keyMetrics;
        const keyMetricsHTML = `
            <div class="indicator-metrics">
                <div class="metric-row">
                    <div class="metric-label">Monthly Cash Flow</div>
                    <div class="metric-value">${this.formatCurrency(metrics.monthlyCashFlow)}</div>
                </div>
                <div class="metric-row">
                    <div class="metric-label">Emergency Fund Coverage</div>
                    <div class="metric-value">${metrics.emergencyFundMonths.toFixed(1)} months</div>
                </div>
                <div class="metric-row">
                    <div class="metric-label">Debt-to-Income Ratio</div>
                    <div class="metric-value">${metrics.debtToIncomeRatio.toFixed(1)}%</div>
                </div>
                <div class="metric-row">
                    <div class="metric-label">Savings Rate</div>
                    <div class="metric-value">${metrics.savingsRate.toFixed(1)}%</div>
                </div>
                <div class="metric-row">
                    <div class="metric-label">Credit Utilization</div>
                    <div class="metric-value">${metrics.creditUtilization.toFixed(1)}%</div>
                </div>
                <div class="metric-row">
                    <div class="metric-label">Net Worth</div>
                    <div class="metric-value">${this.formatCurrency(metrics.netWorth)}</div>
                </div>
            </div>
        `;

        const keyMetricsGrid = document.getElementById('keyMetricsGrid');
        if (keyMetricsGrid) {
            keyMetricsGrid.innerHTML = keyMetricsHTML;
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
        return levelMap[healthLevel] || 'Financial Health Assessment';
    }

    private formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    private showError(message: string): void {
        this.elements.errorMessage.textContent = message;
        this.elements.errorMessage.classList.add('show');
    }

    private hideError(): void {
        this.elements.errorMessage.classList.remove('show');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ComprehensiveFinancialHealthApp();
});