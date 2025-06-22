/**
 * Form and UI Types
 * Interfaces for form handling and user interface components
 */
export interface FormStep {
    id: string;
    title: string;
    description: string;
    fields: FormField[];
    isComplete: boolean;
    validationErrors: string[];
}
export interface FormField {
    id: string;
    type: 'number' | 'select' | 'boolean' | 'text';
    label: string;
    description?: string;
    required: boolean;
    value: any;
    options?: {
        value: string;
        label: string;
    }[];
    validation?: {
        min?: number;
        max?: number;
        step?: number;
    };
}
export interface ChartData {
    type: 'bar' | 'line' | 'pie' | 'radar' | 'scatter';
    title: string;
    data: any[];
    options?: any;
}
export interface DOMElements {
    app: HTMLElement;
    formContainer: HTMLElement;
    resultsContainer: HTMLElement;
    loadingIndicator: HTMLElement;
    errorMessage: HTMLElement;
    formSteps: HTMLElement;
    progressBar: HTMLElement;
    currentStep: HTMLElement;
    navigationButtons: HTMLElement;
    healthScoreSummary: HTMLElement;
    indicatorsGrid: HTMLElement;
    metricsSection: HTMLElement;
    chartsSection: HTMLElement;
    recommendationsSection: HTMLElement;
    peerComparison: HTMLElement;
    scenarioInputs: HTMLElement;
    exportButton: HTMLElement;
    saveButton: HTMLElement;
}
//# sourceMappingURL=form-types.d.ts.map