/**
 * SimplifiedForm Component
 * Renders a single-step form for a "Quick Analysis" of financial health.
 */

import { FormField } from '../../types';

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
        // TODO: Call analysis engine with userData and get analysisResult
        // const analysisResult = FinancialCalculationEngine.analyzeFinancialHealth(userData);
        // if (analysisResult) {
        //     const display = new EnhancedResultsDisplay(resultsDiv); // Pass HTMLElement if that's the constructor
        //     display.render(analysisResult);
        // }
    }
} 