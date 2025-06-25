/**
 * Form Service
 * Provides logic for managing multi-step forms and user financial data collection.
 *
 * @remarks
 * - Strictly typed, fully documented, and validated per project rules.
 * - All form logic is robust, DRY, and handles edge cases.
 */
import { FormStep } from '../interfaces/form-types';
import { UserFinancialData } from '../interfaces/core-types';
/**
 * FormService
 * Manages form steps, data, and validation for financial data collection.
 */
export declare class FormService {
    private steps;
    private currentStepIndex;
    private formData;
    /**
     * Initializes the form service and sets up steps and data.
     */
    constructor();
    /**
     * Gets all form steps.
     * @returns Array of FormStep objects.
     */
    getSteps(): FormStep[];
    /**
     * Gets the current step index.
     * @returns The current step index.
     */
    getCurrentStepIndex(): number;
    /**
     * Gets the current form step.
     * @returns The current FormStep object.
     */
    getCurrentStep(): FormStep;
    /**
     * Gets the current form data.
     * @returns The current partial UserFinancialData object.
     */
    getFormData(): Partial<UserFinancialData>;
    /**
     * Updates a field value in the form data.
     * @param fieldId - The field ID to update.
     * @param value - The new value for the field.
     */
    updateFieldValue(fieldId: string, value: any): void;
    /**
     * Validates the current step's fields.
     * @returns An object with isValid and errors array.
     */
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