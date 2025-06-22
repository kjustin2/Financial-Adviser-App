/**
 * SimplifiedForm Component
 * Renders a single-step form for a "Quick Analysis" of financial health.
 */
import { FormField, UserFinancialData } from '../../types';

export class SimplifiedForm {
    private container: HTMLElement;
    private formFields: FormField[];

    constructor(containerId: string) {
        this.container = document.getElementById(containerId) as HTMLElement;
        this.formFields = this.getSimplifiedFields();
        this.render();
        this.attachEventListeners();
    }

    private getSimplifiedFields(): FormField[] {
        return [
            { id: 'primarySalary', type: 'number', label: 'Monthly Salary (After Tax)', required: true, value: 5000 },
            { id: 'housing', type: 'number', label: 'Monthly Housing Cost', required: true, value: 1500 },
            { id: 'food', type: 'number', label: 'Monthly Food Costs', required: true, value: 400 },
            { id: 'transportation', type: 'number', label: 'Monthly Transportation Costs', required: true, value: 300 },
            { id: 'savings', type: 'number', label: 'Total Savings', required: true, value: 10000 },
            { id: 'creditCardDebt', type: 'number', label: 'Total Credit Card Debt', required: true, value: 2000 },
        ];
    }

    private render(): void {
        let formHTML = '<form id="simplifiedForm">';
        this.formFields.forEach(field => {
            formHTML += `
                <div class="form-field">
                    <label for="${field.id}">${field.label}</label>
                    <input type="${field.type}" id="${field.id}" name="${field.id}" value="${field.value}" ${field.required ? 'required' : ''}>
                </div>
            `;
        });
        formHTML += '<button type="submit" id="quickAnalyzeBtn">Get Quick Analysis</button>';
        formHTML += '</form>';
        this.container.innerHTML = formHTML;
    }

    private attachEventListeners(): void {
        const form = document.getElementById('simplifiedForm');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    private handleSubmit(): void {
        const fullData: UserFinancialData = this.createFullDataObject();
        
        console.log('Simplified form submitted with full data object:', fullData);

        // Dispatch a custom event with the data
        const event = new CustomEvent('quickAnalysisSubmit', { detail: fullData });
        this.container.dispatchEvent(event);
    }

    private getFieldValue(id: string): number {
        const input = document.getElementById(id) as HTMLInputElement;
        return parseFloat(input.value) || 0;
    }

    private createFullDataObject(): UserFinancialData {
        const simplifiedValues = {
            primarySalary: this.getFieldValue('primarySalary'),
            housing: this.getFieldValue('housing'),
            food: this.getFieldValue('food'),
            transportation: this.getFieldValue('transportation'),
            savings: this.getFieldValue('savings'),
            creditCardDebt: this.getFieldValue('creditCardDebt'),
        };

        return {
            personalInfo: {
                age: 35,
                maritalStatus: 'single',
                dependents: 0,
                state: 'CA',
                employmentStatus: 'employed',
                employmentTenure: 5,
                healthStatus: 'good',
                healthInsurance: true,
                lifeInsurance: false,
                shortTermDisability: false,
                longTermDisability: false,
            },
            income: {
                primarySalary: simplifiedValues.primarySalary,
                secondaryIncome: 0,
                businessIncome: 0,
                investmentIncome: 0,
                rentalIncome: 0,
                benefitsIncome: 0,
                otherIncome: 0,
                incomeGrowthRate: 2,
                incomeVariability: 'stable',
                effectiveTaxRate: 20,
            },
            expenses: {
                housing: simplifiedValues.housing,
                food: simplifiedValues.food,
                transportation: simplifiedValues.transportation,
                utilities: 0,
                insurance: 0,
                loanPayments: 0,
                childcare: 0,
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
                otherDebtPayments: 0,
            },
            assets: {
                checking: 0,
                savings: simplifiedValues.savings,
                moneyMarket: 0,
                emergencyFund: simplifiedValues.savings,
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
                otherAssets: 0,
            },
            liabilities: {
                creditCardDebt: simplifiedValues.creditCardDebt,
                mortgageBalance: 0,
                homeEquityLoan: 0,
                autoLoans: 0,
                securedCreditLines: 0,
                personalLoans: 0,
                studentLoans: 0,
                medicalDebt: 0,
                businessLoans: 0,
                businessCreditLines: 0,
                taxDebt: 0,
                legalJudgments: 0,
                otherDebt: 0,
                creditScore: 720,
                totalCreditLimit: simplifiedValues.creditCardDebt > 0 ? simplifiedValues.creditCardDebt * 2 : 5000,
            },
            insurance: {
                healthInsurance: true,
                healthDeductible: 5000,
                healthOutOfPocketMax: 10000,
                lifeInsurance: false,
                lifeCoverageAmount: 0,
                shortTermDisability: false,
                longTermDisability: false,
                disabilityCoveragePercent: 0,
                homeInsurance: false,
                autoInsurance: false,
                umbrellaPolicy: false,
                insuranceConfidence: 'somewhat-confident',
            },
            goals: {
                retirementAge: 65,
                retirementIncomeNeeded: simplifiedValues.primarySalary * 0.8,
                emergencyFundTarget: (simplifiedValues.housing + simplifiedValues.food + simplifiedValues.transportation) * 3,
                riskTolerance: 'moderate',
                debtPayoffGoal: false,
                majorPurchaseAmount: 0,
                homeDownPayment: 0,
                educationFunding: 0,
                careerChangeBuffer: 0,
                legacyGoalAmount: 0,
                retirementConfidence: 'somewhat-confident',
                longTermGoalConfidence: 'somewhat-confident',
                investmentExperience: 'beginner',
            },
            behaviors: {
                monthlyInvestmentContribution: 0,
                billPaymentReliability: 'usually-on-time',
                budgetingMethod: 'simple-tracking',
                financialPlanningEngagement: 'occasionally-plan',
                automaticSavings: false,
                emergencyFundPriority: 'medium',
                impulseSpendingFrequency: 'sometimes',
                expenseTrackingMethod: 'casual',
            }
        };
    }
} 