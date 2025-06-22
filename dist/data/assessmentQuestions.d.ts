/**
 * Behavioral Assessment Question Bank
 * Research-based questions for cognitive bias detection and behavioral pattern analysis
 * Based on Financial Health Network 2024 standards and behavioral economics research
 */
import { BiasAssessmentQuestion, CognitiveBiasType } from '../types';
export declare const ASSESSMENT_QUESTIONS: BiasAssessmentQuestion[];
export declare const BIAS_SCORING_WEIGHTS: Record<CognitiveBiasType, number>;
export declare class AssessmentScoring {
    static scoreScaleQuestion(response: string, biasType: CognitiveBiasType): number;
    static scoreScenarioQuestion(response: string, questionId: string, biasType: CognitiveBiasType): number;
}
export declare function getQuestionsByBias(biasType: CognitiveBiasType): BiasAssessmentQuestion[];
export declare function getAllBiasTypes(): CognitiveBiasType[];
//# sourceMappingURL=assessmentQuestions.d.ts.map