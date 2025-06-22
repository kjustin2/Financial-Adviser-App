/**
 * Form Service
 * Handles form data management, validation, and step navigation
 */

import { FormStep, FormField } from '../interfaces/form-types';
import { UserFinancialData, PersonalInfo, IncomeData, ExpenseData, AssetData, LiabilityData, InsuranceData, FinancialGoals, FinancialBehaviors } from '../interfaces/core-types';
import { DEFAULT_FORM_VALUES } from '../constants/financial-constants';

export class FormService {
    private steps: FormStep[] = [];
    private currentStepIndex: number = 0;
    private formData: Partial<UserFinancialData> = {};

    constructor() {
        this.initializeSteps();
        this.initializeFormData();
    }

    public getSteps(): FormStep[] {
        return this.steps;
    }

    public getCurrentStepIndex(): number {
        return this.currentStepIndex;
    }

    public getCurrentStep(): FormStep {
        return this.steps[this.currentStepIndex];
    }

    public getFormData(): Partial<UserFinancialData> {
        return this.formData;
    }

    public updateFieldValue(fieldId: string, value: any): void {
        const field = this.findFieldById(fieldId);
        if (field) {
            field.value = value;
            this.updateFormDataFromField(fieldId, value);
        }
    }

    public validateCurrentStep(): { isValid: boolean; errors: string[] } {
        const currentStep = this.getCurrentStep();
        const errors: string[] = [];

        for (const field of currentStep.fields) {
            if (field.required && (field.value === null || field.value === undefined || field.value === '')) {
                errors.push(`${field.label} is required.`);
            }

            if (field.validation && field.value !== null && field.value !== undefined) {
                const { min, max } = field.validation;
                const numValue = Number(field.value);

                if (min !== undefined && numValue < min) {
                    errors.push(`${field.label} must be at least ${min}.`);
                }
                if (max !== undefined && numValue > max) {
                    errors.push(`${field.label} must be no more than ${max}.`);
                }
            }
        }

        currentStep.validationErrors = errors;
        currentStep.isComplete = errors.length === 0;

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    public canMoveNext(): boolean {
        return this.currentStepIndex < this.steps.length - 1;
    }

    public canMovePrevious(): boolean {
        return this.currentStepIndex > 0;
    }

    public moveNext(): boolean {
        if (this.canMoveNext()) {
            this.currentStepIndex++;
            return true;
        }
        return false;
    }

    public movePrevious(): boolean {
        if (this.canMovePrevious()) {
            this.currentStepIndex--;
            return true;
        }
        return false;
    }

    public isFormComplete(): boolean {
        return this.steps.every(step => step.isComplete);
    }

    public buildCompleteUserData(): UserFinancialData {
        const personalInfo: PersonalInfo = {
            age: this.getFieldValue('age') || DEFAULT_FORM_VALUES.PERSONAL_INFO.age,
            maritalStatus: this.getFieldValue('maritalStatus') || DEFAULT_FORM_VALUES.PERSONAL_INFO.maritalStatus,
            dependents: this.getFieldValue('dependents') || DEFAULT_FORM_VALUES.PERSONAL_INFO.dependents,
            state: this.getFieldValue('state') || 'CA',
            employmentStatus: this.getFieldValue('employmentStatus') || DEFAULT_FORM_VALUES.PERSONAL_INFO.employmentStatus,
            employmentTenure: this.getFieldValue('employmentTenure') || DEFAULT_FORM_VALUES.PERSONAL_INFO.employmentTenure,
            healthStatus: this.getFieldValue('healthStatus') || 'good',
            healthInsurance: this.getFieldValue('healthInsurance') || true,
            lifeInsurance: this.getFieldValue('lifeInsurance') || false,
            shortTermDisability: this.getFieldValue('shortTermDisability') || false,
            longTermDisability: this.getFieldValue('longTermDisability') || false
        };

        const income: IncomeData = {
            primarySalary: this.getFieldValue('primarySalary') || DEFAULT_FORM_VALUES.INCOME.primarySalary,
            secondaryIncome: this.getFieldValue('secondaryIncome') || DEFAULT_FORM_VALUES.INCOME.secondaryIncome,
            businessIncome: this.getFieldValue('businessIncome') || DEFAULT_FORM_VALUES.INCOME.businessIncome,
            investmentIncome: this.getFieldValue('investmentIncome') || DEFAULT_FORM_VALUES.INCOME.investmentIncome,
            rentalIncome: this.getFieldValue('rentalIncome') || DEFAULT_FORM_VALUES.INCOME.rentalIncome,
            benefitsIncome: this.getFieldValue('benefitsIncome') || DEFAULT_FORM_VALUES.INCOME.benefitsIncome,
            otherIncome: this.getFieldValue('otherIncome') || DEFAULT_FORM_VALUES.INCOME.otherIncome,
            incomeGrowthRate: this.getFieldValue('incomeGrowthRate') || DEFAULT_FORM_VALUES.INCOME.incomeGrowthRate,
            incomeVariability: this.getFieldValue('incomeVariability') || DEFAULT_FORM_VALUES.INCOME.incomeVariability,
            effectiveTaxRate: this.getFieldValue('effectiveTaxRate') || DEFAULT_FORM_VALUES.INCOME.effectiveTaxRate
        };

        const expenses: ExpenseData = {
            housing: this.getFieldValue('housing') || DEFAULT_FORM_VALUES.EXPENSES.housing,
            utilities: this.getFieldValue('utilities') || DEFAULT_FORM_VALUES.EXPENSES.utilities,
            insurance: this.getFieldValue('insurance') || DEFAULT_FORM_VALUES.EXPENSES.insurance,
            loanPayments: this.getFieldValue('loanPayments') || 0,
            childcare: this.getFieldValue('childcare') || 0,
            food: this.getFieldValue('food') || DEFAULT_FORM_VALUES.EXPENSES.food,
            transportation: this.getFieldValue('transportation') || DEFAULT_FORM_VALUES.EXPENSES.transportation,
            healthcare: this.getFieldValue('healthcare') || DEFAULT_FORM_VALUES.EXPENSES.healthcare,
            clothing: this.getFieldValue('clothing') || 100,
            personalCare: this.getFieldValue('personalCare') || 50,
            entertainment: this.getFieldValue('entertainment') || DEFAULT_FORM_VALUES.EXPENSES.entertainment,
            diningOut: this.getFieldValue('diningOut') || 300,
            hobbies: this.getFieldValue('hobbies') || 100,
            subscriptions: this.getFieldValue('subscriptions') || 50,
            shopping: this.getFieldValue('shopping') || DEFAULT_FORM_VALUES.EXPENSES.shopping,
            travel: this.getFieldValue('travel') || 200,
            creditCardPayments: this.getFieldValue('creditCardPayments') || DEFAULT_FORM_VALUES.EXPENSES.creditCardPayments,
            studentLoanPayments: this.getFieldValue('studentLoanPayments') || 0,
            otherDebtPayments: this.getFieldValue('otherDebtPayments') || 0
        };

        const assets: AssetData = {
            checking: this.getFieldValue('checking') || DEFAULT_FORM_VALUES.ASSETS.checking,
            savings: this.getFieldValue('savings') || DEFAULT_FORM_VALUES.ASSETS.savings,
            moneyMarket: this.getFieldValue('moneyMarket') || 0,
            emergencyFund: this.getFieldValue('emergencyFund') || DEFAULT_FORM_VALUES.ASSETS.emergencyFund,
            employer401k: this.getFieldValue('employer401k') || DEFAULT_FORM_VALUES.ASSETS.employer401k,
            traditionalIRA: this.getFieldValue('traditionalIRA') || 0,
            rothIRA: this.getFieldValue('rothIRA') || 0,
            brokerageAccounts: this.getFieldValue('brokerageAccounts') || DEFAULT_FORM_VALUES.ASSETS.brokerageAccounts,
            stocks: this.getFieldValue('stocks') || 0,
            bonds: this.getFieldValue('bonds') || 0,
            mutualFunds: this.getFieldValue('mutualFunds') || 0,
            primaryResidence: this.getFieldValue('primaryResidence') || 250000,
            investmentProperties: this.getFieldValue('investmentProperties') || 0,
            cryptocurrency: this.getFieldValue('cryptocurrency') || 0,
            preciousMetals: this.getFieldValue('preciousMetals') || 0,
            collectibles: this.getFieldValue('collectibles') || 0,
            businessEquity: this.getFieldValue('businessEquity') || 0,
            otherAssets: this.getFieldValue('otherAssets') || 0
        };

        const liabilities: LiabilityData = {
            mortgageBalance: this.getFieldValue('mortgageBalance') || DEFAULT_FORM_VALUES.LIABILITIES.mortgageBalance,
            homeEquityLoan: this.getFieldValue('homeEquityLoan') || 0,
            autoLoans: this.getFieldValue('autoLoans') || DEFAULT_FORM_VALUES.LIABILITIES.autoLoans,
            securedCreditLines: this.getFieldValue('securedCreditLines') || 0,
            creditCardDebt: this.getFieldValue('creditCardDebt') || DEFAULT_FORM_VALUES.LIABILITIES.creditCardDebt,
            personalLoans: this.getFieldValue('personalLoans') || 0,
            studentLoans: this.getFieldValue('studentLoans') || DEFAULT_FORM_VALUES.LIABILITIES.studentLoans,
            medicalDebt: this.getFieldValue('medicalDebt') || 0,
            businessLoans: this.getFieldValue('businessLoans') || 0,
            businessCreditLines: this.getFieldValue('businessCreditLines') || 0,
            taxDebt: this.getFieldValue('taxDebt') || 0,
            legalJudgments: this.getFieldValue('legalJudgments') || 0,
            otherDebt: this.getFieldValue('otherDebt') || 0,
            creditScore: this.getFieldValue('creditScore') || DEFAULT_FORM_VALUES.LIABILITIES.creditScore,
            totalCreditLimit: this.getFieldValue('totalCreditLimit') || DEFAULT_FORM_VALUES.LIABILITIES.totalCreditLimit
        };

        const insurance: InsuranceData = {
            healthInsurance: this.getFieldValue('healthInsurance') || true,
            healthDeductible: this.getFieldValue('healthDeductible') || 2000,
            healthOutOfPocketMax: this.getFieldValue('healthOutOfPocketMax') || 8000,
            lifeInsurance: this.getFieldValue('lifeInsurance') || false,
            lifeCoverageAmount: this.getFieldValue('lifeCoverageAmount') || 0,
            shortTermDisability: this.getFieldValue('shortTermDisability') || false,
            longTermDisability: this.getFieldValue('longTermDisability') || false,
            disabilityCoveragePercent: this.getFieldValue('disabilityCoveragePercent') || 0,
            homeInsurance: this.getFieldValue('homeInsurance') || true,
            autoInsurance: this.getFieldValue('autoInsurance') || true,
            umbrellaPolicy: this.getFieldValue('umbrellaPolicy') || false,
            insuranceConfidence: this.getFieldValue('insuranceConfidence') || 'somewhat-confident'
        };

        const goals: FinancialGoals = {
            emergencyFundTarget: this.getFieldValue('emergencyFundTarget') || 15000,
            debtPayoffGoal: this.getFieldValue('debtPayoffGoal') || true,
            majorPurchaseAmount: this.getFieldValue('majorPurchaseAmount') || 0,
            homeDownPayment: this.getFieldValue('homeDownPayment') || 0,
            educationFunding: this.getFieldValue('educationFunding') || 0,
            careerChangeBuffer: this.getFieldValue('careerChangeBuffer') || 0,
            retirementAge: this.getFieldValue('retirementAge') || 65,
            retirementIncomeNeeded: this.getFieldValue('retirementIncomeNeeded') || 4000,
            legacyGoalAmount: this.getFieldValue('legacyGoalAmount') || 0,
            retirementConfidence: this.getFieldValue('retirementConfidence') || 'somewhat-confident',
            longTermGoalConfidence: this.getFieldValue('longTermGoalConfidence') || 'somewhat-confident',
            riskTolerance: this.getFieldValue('riskTolerance') || 'moderate',
            investmentExperience: this.getFieldValue('investmentExperience') || 'intermediate'
        };

        const behaviors: FinancialBehaviors = {
            billPaymentReliability: this.getFieldValue('billPaymentReliability') || 'usually-on-time',
            budgetingMethod: this.getFieldValue('budgetingMethod') || 'simple-tracking',
            financialPlanningEngagement: this.getFieldValue('financialPlanningEngagement') || 'occasionally-plan',
            automaticSavings: this.getFieldValue('automaticSavings') || false,
            monthlyInvestmentContribution: this.getFieldValue('monthlyInvestmentContribution') || 500,
            emergencyFundPriority: this.getFieldValue('emergencyFundPriority') || 'medium',
            impulseSpendingFrequency: this.getFieldValue('impulseSpendingFrequency') || 'sometimes',
            expenseTrackingMethod: this.getFieldValue('expenseTrackingMethod') || 'casual'
        };

        return {
            personalInfo,
            income,
            expenses,
            assets,
            liabilities,
            insurance,
            goals,
            behaviors
        };
    }

    private findFieldById(fieldId: string): FormField | null {
        for (const step of this.steps) {
            const field = step.fields.find(f => f.id === fieldId);
            if (field) return field;
        }
        return null;
    }

    private getFieldValue(fieldId: string): any {
        const field = this.findFieldById(fieldId);
        return field ? field.value : null;
    }

    private updateFormDataFromField(fieldId: string, value: any): void {
        (this.formData as any)[fieldId] = value;
    }

    private initializeFormData(): void {
        this.formData = {};
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
                        value: DEFAULT_FORM_VALUES.PERSONAL_INFO.age,
                        validation: { min: 18, max: 100 }
                    },
                    {
                        id: 'maritalStatus',
                        type: 'select',
                        label: 'Marital Status',
                        required: true,
                        value: DEFAULT_FORM_VALUES.PERSONAL_INFO.maritalStatus,
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
                        value: DEFAULT_FORM_VALUES.PERSONAL_INFO.dependents,
                        validation: { min: 0, max: 10 }
                    },
                    {
                        id: 'employmentStatus',
                        type: 'select',
                        label: 'Employment Status',
                        required: true,
                        value: DEFAULT_FORM_VALUES.PERSONAL_INFO.employmentStatus,
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
                        value: DEFAULT_FORM_VALUES.PERSONAL_INFO.employmentTenure,
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
                        value: DEFAULT_FORM_VALUES.INCOME.primarySalary,
                        validation: { min: 0, step: 100 }
                    },
                    {
                        id: 'secondaryIncome',
                        type: 'number',
                        label: 'Secondary Income (Monthly)',
                        description: 'Part-time work, freelancing, side hustles',
                        required: false,
                        value: DEFAULT_FORM_VALUES.INCOME.secondaryIncome,
                        validation: { min: 0, step: 50 }
                    }
                ],
                isComplete: false,
                validationErrors: []
            }
        ];
    }
} 