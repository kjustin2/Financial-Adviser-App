/**
 * Multi-Step Financial Data Collection Form
 * Comprehensive form based on 8 financial health indicators research
 *
 * @remarks
 * - Strictly typed, fully documented, and validated per project rules.
 * - All user input is validated and sanitized before use.
 * - UI/UX is mobile-first and accessible.
 */
import { UserFinancialData } from '../../interfaces/core-types';
import '../shared-form-styles.css';
/**
 * MultiStepForm
 * Renders and manages the comprehensive multi-step financial data form.
 */
export declare class MultiStepForm {
    private container;
    private currentStepIndex;
    private formData;
    private steps;
    private onDataChange?;
    private onComplete?;
    /**
     * Initializes the multi-step form.
     * @param container - The DOM element to render the form into.
     * @param callbacks - Optional callbacks for data change and completion.
     */
    constructor(container: HTMLElement, callbacks?: {
        onDataChange?: (data: Partial<UserFinancialData>) => void;
        onComplete?: (data: UserFinancialData) => void;
    });
    /**
     * Initializes the form steps with field definitions.
     */
    private initializeSteps;
    /**
     * Initializes the form data with default values.
     */
    private initializeFormData;
    /**
     * Renders the current step of the form.
     */
    private render;
    /**
     * Renders the fields for the current step.
     * @returns The HTML string for the current step's fields.
     */
    private renderCurrentStep;
    /**
     * Renders a single form field.
     * @param field - The field definition to render.
     * @returns The HTML string for the field.
     */
    private renderField;
    /**
     * Gets the value for a given field ID from form data.
     * @param fieldId - The ID of the field.
     * @returns The value of the field.
     */
    private getFieldValue;
    /**
     * Attaches event listeners for navigation and field changes.
     */
    private attachEventListeners;
    /**
     * Handles changes to form fields and updates form data.
     * @param event - The input or select change event.
     */
    private handleFieldChange;
    /**
     * Updates the form data structure based on field ID and step.
     * @param fieldId - The field ID.
     * @param value - The new value for the field.
     */
    private updateFormData;
    /**
     * Validates the current step's fields.
     * @returns True if valid, false otherwise.
     */
    private validateCurrentStep;
    /**
     * Navigates to the previous step.
     */
    private previousStep;
    /**
     * Navigates to the next step or completes the form if on the last step.
     */
    private nextStep;
    /**
     * Shows validation errors for the current step.
     */
    private showValidationErrors;
    /**
     * Completes the form and triggers the onComplete callback with validated data.
     */
    private completeForm;
    /**
     * Builds a strictly-typed UserFinancialData object from form data.
     * @returns The constructed UserFinancialData object.
     */
    private buildCompleteUserData;
    /**
     * Gets the current form data (partial).
     * @returns The current partial UserFinancialData.
     */
    getCurrentData(): Partial<UserFinancialData>;
}
//# sourceMappingURL=MultiStepForm.d.ts.map