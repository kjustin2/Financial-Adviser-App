/**
 * Quick Analysis Form Component
 * Simplified form requiring only essential financial inputs
 */
import { UserFinancialData } from '../../interfaces/core-types';
export declare class QuickAnalysisForm {
    private container;
    private onSubmit;
    constructor(containerId: string, onSubmit: (data: UserFinancialData) => void);
    render(): void;
    private generateHTML;
    private attachEventListeners;
    private handleInputChange;
    private formatCurrencyInput;
    private updateRealTimeCalculations;
    private getNumericValue;
    private updateProgress;
    private updateSubmitButton;
    private validateField;
    private attachTooltips;
    private showTooltip;
    private hideTooltip;
    private handleSubmit;
    private resetSubmitButton;
    private buildUserDataFromForm;
    private showValidationErrors;
}
//# sourceMappingURL=QuickAnalysisForm.d.ts.map