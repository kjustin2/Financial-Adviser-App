/**
 * Quick Analysis Form Component
 * Simplified form requiring only essential financial inputs
 *
 * @remarks
 * - Strictly typed, fully documented, and validated per project rules.
 * - All user input is validated and sanitized before use.
 * - UI/UX is mobile-first and accessible.
 */
import { UserFinancialData } from '../../interfaces/core-types';
import '../shared-form-styles.css';
/**
 * QuickAnalysisForm
 * Renders and manages the quick financial health form.
 */
export declare class QuickAnalysisForm {
    private container;
    private onSubmit;
    /**
     * Initializes the form.
     * @param containerId - The DOM element ID to render the form into.
     * @param onSubmit - Callback when the form is submitted with valid data.
     */
    constructor(containerId: string, onSubmit: (data: UserFinancialData) => void);
    /**
     * Renders the form UI.
     */
    render(): void;
    /**
     * Generates the HTML for the form.
     * @returns The HTML string for the form.
     */
    private generateHTML;
    /**
     * Attaches all event listeners for form interactivity and validation.
     */
    private attachEventListeners;
    /**
     * Handles input changes for real-time validation and feedback.
     * @param _input - The input element that changed.
     */
    private handleInputChange;
    /**
     * Formats a currency input field on blur.
     * @param input - The input element to format.
     */
    private formatCurrencyInput;
    /**
     * Updates real-time calculations (emergency fund months, debt ratio) as the user types.
     */
    private updateRealTimeCalculations;
    /**
     * Gets a numeric value from an input field, ensuring non-negative and valid.
     * @param fieldName - The name attribute of the input field.
     * @returns The numeric value or 0 if invalid.
     */
    private getNumericValue;
    /**
     * Updates the progress bar and text based on completed fields.
     */
    private updateProgress;
    /**
     * Enables or disables the submit button based on form validity.
     */
    private updateSubmitButton;
    /**
     * Validates a single input field and provides feedback.
     * @param input - The input element to validate.
     */
    private validateField;
    /**
     * Attaches tooltips to help icons for accessibility.
     */
    private attachTooltips;
    /**
     * Shows a tooltip for a help icon.
     * @param element - The help icon element.
     * @param text - The tooltip text.
     */
    private showTooltip;
    /**
     * Hides any visible tooltip.
     */
    private hideTooltip;
    /**
     * Handles form submission, validates all fields, and builds user data.
     */
    private handleSubmit;
    /**
     * Resets the submit button to its default state after validation errors.
     */
    private resetSubmitButton;
    /**
     * Builds a strictly-typed UserFinancialData object from form data.
     * @param formData - The FormData object from the form.
     * @returns The constructed UserFinancialData object.
     */
    private buildUserDataFromForm;
    /**
     * Shows validation errors in the UI.
     * @param errors - Array of error messages to display.
     */
    private showValidationErrors;
}
//# sourceMappingURL=QuickAnalysisForm.d.ts.map