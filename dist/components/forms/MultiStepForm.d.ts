/**
 * Multi-Step Financial Data Collection Form
 * Comprehensive form based on 8 financial health indicators research
 */
import { UserFinancialData } from '../../types';
export declare class MultiStepForm {
    private container;
    private currentStepIndex;
    private formData;
    private steps;
    private onDataChange?;
    private onComplete?;
    constructor(container: HTMLElement, callbacks?: {
        onDataChange?: (data: Partial<UserFinancialData>) => void;
        onComplete?: (data: UserFinancialData) => void;
    });
    private initializeSteps;
    private initializeFormData;
    private render;
    private renderCurrentStep;
    private renderField;
    private getFieldValue;
    private attachEventListeners;
    private handleFieldChange;
    private updateFormData;
    private validateCurrentStep;
    private previousStep;
    private nextStep;
    private showValidationErrors;
    private completeForm;
    private buildCompleteUserData;
    getCurrentData(): Partial<UserFinancialData>;
}
//# sourceMappingURL=MultiStepForm.d.ts.map