/**
 * Form Service
 * Handles form data management, validation, and step navigation
 */
import { FormStep } from '../interfaces/form-types';
import { UserFinancialData } from '../interfaces/core-types';
export declare class FormService {
    private steps;
    private currentStepIndex;
    private formData;
    constructor();
    getSteps(): FormStep[];
    getCurrentStepIndex(): number;
    getCurrentStep(): FormStep;
    getFormData(): Partial<UserFinancialData>;
    updateFieldValue(fieldId: string, value: any): void;
    validateCurrentStep(): {
        isValid: boolean;
        errors: string[];
    };
    canMoveNext(): boolean;
    canMovePrevious(): boolean;
    moveNext(): boolean;
    movePrevious(): boolean;
    isFormComplete(): boolean;
    buildCompleteUserData(): UserFinancialData;
    private findFieldById;
    private getFieldValue;
    private updateFormDataFromField;
    private initializeFormData;
    private initializeSteps;
}
//# sourceMappingURL=FormService.d.ts.map