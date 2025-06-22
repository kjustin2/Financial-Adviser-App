/**
 * Psychology-Based Analysis Engine
 * 
 * Implements advanced behavioral economics principles including prospect theory,
 * psychological profiling, and decision pattern analysis for financial behavior.
 * Based on research from Kahneman, Tversky, Ariely, and Thaler.
 */

import {
    CognitiveBiasType,
    BiasDetectionResult,
    PsychologyProfile,
    BehaviorPattern,
    UserFinancialData,
    UserBehaviorData,
    BiasAssessmentResponse,
    ProspectTheoryParams,

} from '../types';

export class PsychologyAnalysisEngine {
    private prospectTheoryParams: ProspectTheoryParams;

    constructor() {
        this.prospectTheoryParams = this.initializeProspectTheory();
    }

    /**
     * Generate comprehensive psychology profile
     */
    public generatePsychologyProfile(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        biasResults: BiasDetectionResult[]
    ): PsychologyProfile {
        const dominantBiases = this.identifyDominantBiases(biasResults);
        const riskTolerance = this.assessRiskTolerance(financialData, behaviorData);
        const decisionMakingStyle = this.analyzeDecisionMakingStyle(behaviorData, biasResults);
        const emotionalMoney = this.categorizeEmotionalMoneyType(financialData, behaviorData);
        const timeOrientation = this.assessTimeOrientation(behaviorData, financialData);
        const financialPersonality = this.generateFinancialPersonality(dominantBiases, riskTolerance, emotionalMoney);

        return {
            dominantBiases,
            riskTolerance,
            decisionMakingStyle,
            emotionalMoney,
            timeOrientation,
            financialPersonality
        };
    }

    /**
     * Analyze behavioral patterns using psychological frameworks
     */
    public analyzeBehaviorPatterns(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        biasResults: BiasDetectionResult[]
    ): BehaviorPattern[] {
        const patterns: BehaviorPattern[] = [];

        // Trading behavior patterns
        patterns.push(...this.analyzeTradingPatterns(behaviorData, biasResults));
        
        // Risk-taking patterns
        patterns.push(...this.analyzeRiskPatterns(financialData, behaviorData, biasResults));
        
        // Planning and goal-setting patterns
        patterns.push(...this.analyzePlanningPatterns(behaviorData, biasResults));
        
        // Information processing patterns
        patterns.push(...this.analyzeInformationPatterns(behaviorData, biasResults));
        
        // Spending and saving patterns
        patterns.push(...this.analyzeSpendingSavingPatterns(financialData, behaviorData, biasResults));

        return patterns.filter(pattern => pattern.intensity > 3); // Filter low-intensity patterns
    }

    /**
     * Conduct prospect theory analysis on financial decisions
     */
    public conductProspectTheoryAnalysis(
        decisions: Array<{
            scenario: string;
            options: Array<{ description: string; expectedValue: number; probability: number }>;
            userChoice: number;
        }>
    ): Array<{
        scenario: string;
        prospectValues: number[];
        optimalChoice: number;
        userChoice: number;
        rationalityScore: number;
        biasInfluence: string[];
    }> {
        return decisions.map(decision => {
            const prospectValues = decision.options.map(option => 
                this.calculateProspectValue(option.expectedValue, option.probability)
            );
            
            const optimalChoice = prospectValues.indexOf(Math.max(...prospectValues));
            const rationalityScore = this.calculateRationalityScore(decision.userChoice, optimalChoice, prospectValues);
            const biasInfluence = this.identifyBiasInfluence(decision, prospectValues);

            return {
                scenario: decision.scenario,
                prospectValues,
                optimalChoice,
                userChoice: decision.userChoice,
                rationalityScore,
                biasInfluence
            };
        });
    }

    /**
     * Analyze decision-making consistency across contexts
     */
    public analyzeDecisionConsistency(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        assessmentResponses: BiasAssessmentResponse[]
    ): {
        consistencyScore: number;
        inconsistencies: string[];
        riskContexts: Array<{ context: string; riskLevel: number; consistency: number }>;
        recommendations: string[];
    } {
        const riskContexts = this.analyzeRiskAcrossContexts(financialData, behaviorData);
        const framingInconsistencies = this.detectFramingInconsistencies(assessmentResponses);
        const timeInconsistencies = this.detectTimeInconsistencies(financialData, behaviorData);
        
        const consistencyScore = this.calculateOverallConsistency(riskContexts, framingInconsistencies, timeInconsistencies);
        const inconsistencies = [...framingInconsistencies, ...timeInconsistencies];
        const recommendations = this.generateConsistencyRecommendations(inconsistencies, riskContexts);

        return {
            consistencyScore,
            inconsistencies,
            riskContexts,
            recommendations
        };
    }

    /**
     * Generate psychological intervention strategies
     */
    public generateInterventionStrategies(
        psychologyProfile: PsychologyProfile,
        behaviorPatterns: BehaviorPattern[],
        biasResults: BiasDetectionResult[]
    ): Array<{
        intervention: string;
        targetBiases: CognitiveBiasType[];
        technique: string;
        timing: 'immediate' | 'gradual' | 'situational';
        effectiveness: number;
        personalizedApproach: string;
    }> {
        const strategies: Array<{
            intervention: string;
            targetBiases: CognitiveBiasType[];
            technique: string;
            timing: 'immediate' | 'gradual' | 'situational';
            effectiveness: number;
            personalizedApproach: string;
        }> = [];

        // Cognitive interventions
        strategies.push(...this.generateCognitiveInterventions(psychologyProfile, biasResults));
        
        // Behavioral interventions
        strategies.push(...this.generateBehavioralInterventions(behaviorPatterns, biasResults));
        
        // Environmental interventions
        strategies.push(...this.generateEnvironmentalInterventions(psychologyProfile, behaviorPatterns));
        
        // Social interventions
        strategies.push(...this.generateSocialInterventions(psychologyProfile, biasResults));

        return strategies.sort((a, b) => b.effectiveness - a.effectiveness);
    }

    // Private helper methods

    private identifyDominantBiases(biasResults: BiasDetectionResult[]): CognitiveBiasType[] {
        return biasResults
            .filter(bias => bias.severity === 'severe' || bias.severity === 'high')
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 3)
            .map(bias => bias.biasType);
    }

    private assessRiskTolerance(financialData: UserFinancialData, behaviorData: UserBehaviorData): 'conservative' | 'moderate' | 'aggressive' {
        const actualRisk = behaviorData.riskBehavior.actualRiskTolerance;
        const ageAdjustment = (100 - financialData.personalInfo.age) / 100;
        const adjustedRisk = actualRisk * (1 + ageAdjustment * 0.2);

        if (adjustedRisk < 0.4) return 'conservative';
        if (adjustedRisk < 0.7) return 'moderate';
        return 'aggressive';
    }

    private analyzeDecisionMakingStyle(behaviorData: UserBehaviorData, biasResults: BiasDetectionResult[]): 'rational' | 'intuitive' | 'mixed' {
        const rationalIndicators = [
            behaviorData.planningBehavior.budgetingConsistency > 0.7,
            behaviorData.planningBehavior.goalSettingClarity > 0.7,
            behaviorData.informationSeeking.frequencyOfResearch > 0.6,
            behaviorData.tradingPatterns.diversificationLevel > 0.7
        ].filter(Boolean).length;

        const intuitiveIndicators = [
            behaviorData.informationSeeking.newsReactionTime < 3,
            behaviorData.planningBehavior.impulsiveDecisions > 0.5,
            biasResults.some(bias => bias.biasType === 'availability-heuristic' && bias.severity !== 'low'),
            behaviorData.riskBehavior.panicSellingHistory || behaviorData.riskBehavior.fomoBuyingHistory
        ].filter(Boolean).length;

        if (rationalIndicators >= 3) return 'rational';
        if (intuitiveIndicators >= 3) return 'intuitive';
        return 'mixed';
    }

    private categorizeEmotionalMoneyType(financialData: UserFinancialData, behaviorData: UserBehaviorData): 'security-seeker' | 'status-spender' | 'saver' | 'avoider' {
        const emergencyFundRatio = financialData.goals.emergencyFundTarget / this.calculateMonthlyExpenses(financialData);
        const savingsRate = this.calculateSavingsRate(financialData);
        const cashPercentage = this.calculateCashPercentage(financialData);

        // Security-seeker: High emergency fund, conservative investments
        if (emergencyFundRatio > 6 && cashPercentage > 0.3 && behaviorData.riskBehavior.actualRiskTolerance < 0.4) {
            return 'security-seeker';
        }

        // Saver: High savings rate, good financial planning
        if (savingsRate > 0.15 && behaviorData.planningBehavior.budgetingConsistency > 0.7) {
            return 'saver';
        }

        // Status-spender: High discretionary spending, lifestyle inflation
        const discretionarySpending = financialData.expenses.entertainment + financialData.expenses.diningOut + 
                                     financialData.expenses.shopping + financialData.expenses.travel;
        const totalExpenses = Object.values(financialData.expenses).reduce((sum, exp) => sum + exp, 0);
        if (discretionarySpending / totalExpenses > 0.3) {
            return 'status-spender';
        }

        // Avoider: Low engagement with financial planning
        if (behaviorData.planningBehavior.budgetingConsistency < 0.4 && 
            behaviorData.planningBehavior.goalSettingClarity < 0.5) {
            return 'avoider';
        }

        return 'saver'; // Default
    }

    private assessTimeOrientation(behaviorData: UserBehaviorData, financialData: UserFinancialData): 'present-focused' | 'future-focused' | 'balanced' {
        const futureIndicators = [
            behaviorData.planningBehavior.longTermThinking > 0.7,
            financialData.goals.retirementConfidence === 'very-confident',
            behaviorData.tradingPatterns.frequency === 'annually' || behaviorData.tradingPatterns.frequency === 'quarterly',
            this.calculateSavingsRate(financialData) > 0.15
        ].filter(Boolean).length;

        const presentIndicators = [
            behaviorData.planningBehavior.impulsiveDecisions > 0.6,
            behaviorData.informationSeeking.newsReactionTime < 2,
            behaviorData.tradingPatterns.frequency === 'daily' || behaviorData.tradingPatterns.frequency === 'weekly',
            this.calculateCashPercentage(financialData) < 0.1
        ].filter(Boolean).length;

        if (futureIndicators >= 3) return 'future-focused';
        if (presentIndicators >= 3) return 'present-focused';
        return 'balanced';
    }

    private generateFinancialPersonality(
        dominantBiases: CognitiveBiasType[],
        riskTolerance: 'conservative' | 'moderate' | 'aggressive',
        emotionalMoney: 'security-seeker' | 'status-spender' | 'saver' | 'avoider'
    ): string {
        const personalityMap: { [key: string]: string } = {
            'conservative-security-seeker': 'The Cautious Guardian: Prioritizes security and protection over growth, tends to be overly conservative but provides excellent financial stability.',
            'conservative-saver': 'The Methodical Accumulator: Systematic approach to saving with conservative investments, excellent long-term financial health but may miss growth opportunities.',
            'conservative-avoider': 'The Anxious Minimalist: Avoids financial complexity due to fear, needs guidance to overcome analysis paralysis and engage with financial planning.',
            'moderate-security-seeker': 'The Balanced Protector: Seeks growth while maintaining adequate safety nets, generally good financial decision-making with room for optimization.',
            'moderate-saver': 'The Strategic Builder: Balanced approach to risk and saving, likely to achieve financial goals with consistent execution.',
            'moderate-status-spender': 'The Lifestyle Optimizer: Balances current enjoyment with future planning, needs to monitor spending inflation and lifestyle creep.',
            'aggressive-status-spender': 'The High-Stakes Player: Takes significant risks for potentially high rewards, may struggle with impulse control and long-term planning.',
            'aggressive-saver': 'The Growth Maximizer: Aggressive investor with strong saving discipline, excellent wealth-building potential but needs downside protection.'
        };

        const key = `${riskTolerance}-${emotionalMoney}`;
        let personality = personalityMap[key] || 'The Unique Individual: Complex financial personality requiring personalized analysis and recommendations.';

        // Add bias-specific modifications
        if (dominantBiases.includes('overconfidence')) {
            personality += ' Shows overconfidence in financial abilities, requiring humility and systematic approaches.';
        }
        if (dominantBiases.includes('loss-aversion')) {
            personality += ' Strong loss aversion may limit growth potential, needs encouragement to take appropriate risks.';
        }
        if (dominantBiases.includes('mental-accounting')) {
            personality += ' Tends to compartmentalize money, would benefit from holistic financial planning approaches.';
        }

        return personality;
    }

    private analyzeTradingPatterns(behaviorData: UserBehaviorData, _biasResults: BiasDetectionResult[]): BehaviorPattern[] {
        const patterns: BehaviorPattern[] = [];

        // Overtrading pattern
        if (behaviorData.tradingPatterns.frequency === 'daily' || behaviorData.tradingPatterns.frequency === 'weekly') {
            patterns.push({
                pattern: 'Frequent trading and portfolio adjustments',
                frequency: behaviorData.tradingPatterns.frequency === 'daily' ? 'habitual' : 'frequent',
                intensity: behaviorData.tradingPatterns.portfolioTurnover > 100 ? 8 : 6,
                triggers: ['Market news', 'Price movements', 'Emotional reactions'],
                outcomes: ['Higher transaction costs', 'Potential tax inefficiency', 'Possible underperformance'],
                relatedBiases: ['overconfidence', 'availability-heuristic', 'recency-bias']
            });
        }

        // Market timing pattern
        if (behaviorData.tradingPatterns.marketTimingAttempts > 3) {
            patterns.push({
                pattern: 'Attempting to time market movements',
                frequency: behaviorData.tradingPatterns.marketTimingAttempts > 10 ? 'habitual' : 'frequent',
                intensity: Math.min(10, Math.floor(behaviorData.tradingPatterns.marketTimingAttempts / 2)),
                triggers: ['Market volatility', 'Economic news', 'Performance anxiety'],
                outcomes: ['Potential missed opportunities', 'Increased stress', 'Suboptimal returns'],
                relatedBiases: ['overconfidence', 'availability-heuristic', 'confirmation-bias']
            });
        }

        return patterns;
    }

    private analyzeRiskPatterns(_financialData: UserFinancialData, behaviorData: UserBehaviorData, _biasResults: BiasDetectionResult[]): BehaviorPattern[] {
        const patterns: BehaviorPattern[] = [];

        // Risk inconsistency pattern
        const riskDiscrepancy = Math.abs(behaviorData.riskBehavior.actualRiskTolerance - behaviorData.riskBehavior.statedRiskTolerance);
        if (riskDiscrepancy > 0.3) {
            patterns.push({
                pattern: 'Inconsistent risk tolerance across contexts',
                frequency: 'frequent',
                intensity: Math.floor(riskDiscrepancy * 10),
                triggers: ['Different decision contexts', 'Emotional states', 'Framing effects'],
                outcomes: ['Suboptimal portfolio allocation', 'Decision regret', 'Stress'],
                relatedBiases: ['framing-effect', 'loss-aversion', 'mental-accounting']
            });
        }

        // Emotional trading pattern
        if (behaviorData.riskBehavior.panicSellingHistory || behaviorData.riskBehavior.fomoBuyingHistory) {
            patterns.push({
                pattern: 'Emotional reactions driving trading decisions',
                frequency: 'occasional',
                intensity: 7,
                triggers: ['Market crashes', 'Bull market euphoria', 'Media coverage'],
                outcomes: ['Buy high, sell low', 'Missed recovery gains', 'Portfolio damage'],
                relatedBiases: ['loss-aversion', 'herd-mentality', 'availability-heuristic']
            });
        }

        return patterns;
    }

    private analyzePlanningPatterns(behaviorData: UserBehaviorData, _biasResults: BiasDetectionResult[]): BehaviorPattern[] {
        const patterns: BehaviorPattern[] = [];

        // Goal-setting pattern
        if (behaviorData.planningBehavior.goalSettingClarity > 0.7) {
            patterns.push({
                pattern: 'Strong goal-setting and planning orientation',
                frequency: 'habitual',
                intensity: Math.floor(behaviorData.planningBehavior.goalSettingClarity * 10),
                triggers: ['Life events', 'Financial milestones', 'Regular reviews'],
                outcomes: ['Clear financial direction', 'Better outcomes', 'Reduced anxiety'],
                relatedBiases: [] // This is generally positive
            });
        }

        // Impulsive decision pattern
        if (behaviorData.planningBehavior.impulsiveDecisions > 0.5) {
            patterns.push({
                pattern: 'Impulsive financial decision-making',
                frequency: behaviorData.planningBehavior.impulsiveDecisions > 0.7 ? 'frequent' : 'occasional',
                intensity: Math.floor(behaviorData.planningBehavior.impulsiveDecisions * 10),
                triggers: ['Emotional states', 'Opportunities', 'Social pressure'],
                outcomes: ['Suboptimal decisions', 'Regret', 'Goal deviation'],
                relatedBiases: ['availability-heuristic', 'framing-effect', 'herd-mentality']
            });
        }

        return patterns;
    }

    private analyzeInformationPatterns(behaviorData: UserBehaviorData, _biasResults: BiasDetectionResult[]): BehaviorPattern[] {
        const patterns: BehaviorPattern[] = [];

        // Information overload pattern
        if (behaviorData.informationSeeking.frequencyOfResearch > 0.8 && behaviorData.informationSeeking.sourcesUsed.length < 3) {
            patterns.push({
                pattern: 'High information consumption from limited sources',
                frequency: 'habitual',
                intensity: 6,
                triggers: ['Market uncertainty', 'Decision anxiety', 'Need for control'],
                outcomes: ['Information overload', 'Analysis paralysis', 'Confirmation bias'],
                relatedBiases: ['confirmation-bias', 'availability-heuristic', 'anchoring']
            });
        }

        // News reaction pattern
        if (behaviorData.informationSeeking.newsReactionTime < 2) {
            patterns.push({
                pattern: 'Rapid reaction to financial news and market events',
                frequency: 'frequent',
                intensity: 7,
                triggers: ['Breaking news', 'Market movements', 'Social media'],
                outcomes: ['Premature decisions', 'Increased volatility', 'Stress'],
                relatedBiases: ['availability-heuristic', 'recency-bias', 'overconfidence']
            });
        }

        return patterns;
    }

    private analyzeSpendingSavingPatterns(financialData: UserFinancialData, _behaviorData: UserBehaviorData, _biasResults: BiasDetectionResult[]): BehaviorPattern[] {
        const patterns: BehaviorPattern[] = [];

        // Mental accounting pattern
        const mentalAccountingBias = _biasResults.find((bias: BiasDetectionResult) => bias.biasType === 'mental-accounting');
        if (mentalAccountingBias && mentalAccountingBias.severity !== 'low') {
            patterns.push({
                pattern: 'Compartmentalizing money based on source or purpose',
                frequency: 'habitual',
                intensity: ({ low: 3, moderate: 5, high: 7, severe: 9 } as const)[mentalAccountingBias.severity],
                triggers: ['Different income sources', 'Budget categories', 'Account types'],
                outcomes: ['Suboptimal allocation', 'Missed opportunities', 'Inefficiency'],
                relatedBiases: ['mental-accounting', 'framing-effect', 'anchoring']
            });
        }

        // Savings automation pattern
        if (financialData.behaviors.automaticSavings) {
            patterns.push({
                pattern: 'Automated savings and investment contributions',
                frequency: 'habitual',
                intensity: 8,
                triggers: ['Payday', 'Automatic transfers', 'System processes'],
                outcomes: ['Consistent saving', 'Reduced temptation', 'Goal achievement'],
                relatedBiases: [] // This is generally positive
            });
        }

        return patterns;
    }

    private calculateProspectValue(expectedValue: number, probability: number): number {
        if (expectedValue >= 0) {
            const weightedProbability = this.prospectTheoryParams.probabilityWeighting.gains(probability);
            return weightedProbability * this.prospectTheoryParams.valueFunction.gains(expectedValue);
        } else {
            const weightedProbability = this.prospectTheoryParams.probabilityWeighting.losses(probability);
            return weightedProbability * this.prospectTheoryParams.valueFunction.losses(expectedValue);
        }
    }

    private calculateRationalityScore(userChoice: number, optimalChoice: number, prospectValues: number[]): number {
        if (userChoice === optimalChoice) return 100;
        
        const userValue = prospectValues[userChoice];
        const optimalValue = prospectValues[optimalChoice];
        const valueDifference = Math.abs(optimalValue - userValue);
        const maxValue = Math.max(...prospectValues);
        const minValue = Math.min(...prospectValues);
        const range = maxValue - minValue;
        
        return Math.max(0, 100 - (valueDifference / range) * 100);
    }

    private identifyBiasInfluence(decision: any, _prospectValues: number[]): string[] {
        const influences: string[] = [];
        
        // Check for loss aversion (overweighting losses)
        const hasLoss = decision.options.some((opt: any) => opt.expectedValue < 0);
        if (hasLoss) {
            influences.push('Loss aversion may be influencing risk avoidance');
        }
        
        // Check for probability weighting
        const hasLowProbability = decision.options.some((opt: any) => opt.probability < 0.1);
        const hasHighProbability = decision.options.some((opt: any) => opt.probability > 0.9);
        if (hasLowProbability) {
            influences.push('Overweighting of low-probability events');
        }
        if (hasHighProbability) {
            influences.push('Underweighting of high-probability events');
        }
        
        return influences;
    }

    private analyzeRiskAcrossContexts(financialData: UserFinancialData, behaviorData: UserBehaviorData): Array<{ context: string; riskLevel: number; consistency: number }> {
        const contexts = [
            {
                context: 'Investment allocation',
                riskLevel: behaviorData.riskBehavior.actualRiskTolerance,
                consistency: 1 - Math.abs(behaviorData.riskBehavior.actualRiskTolerance - behaviorData.riskBehavior.statedRiskTolerance)
            },
            {
                context: 'Emergency fund sizing',
                riskLevel: Math.max(0, 1 - (financialData.goals.emergencyFundTarget / this.calculateMonthlyExpenses(financialData)) / 6),
                consistency: 0.8 // Baseline consistency
            },
            {
                context: 'Insurance coverage',
                riskLevel: this.calculateInsuranceRiskLevel(financialData),
                consistency: 0.9 // Generally consistent
            }
        ];

        return contexts;
    }

    private detectFramingInconsistencies(assessmentResponses: BiasAssessmentResponse[]): string[] {
        const inconsistencies: string[] = [];
        
        // Group responses by framing pairs
        const framingPairs = this.groupFramingResponses(assessmentResponses);
        
        for (const pair of framingPairs) {
            if (pair.length === 2) {
                const [response1, response2] = pair;
                const difference = Math.abs((response1.response as number) - (response2.response as number));
                if (difference > 2) {
                    inconsistencies.push(`Inconsistent responses to gain vs loss framing in ${response1.questionId.split('-')[0]} context`);
                }
            }
        }
        
        return inconsistencies;
    }

    private detectTimeInconsistencies(financialData: UserFinancialData, behaviorData: UserBehaviorData): string[] {
        const inconsistencies: string[] = [];
        
        // Check for time preference inconsistencies
        const hasLongTermGoals = financialData.goals.retirementConfidence === 'very-confident';
        const showsShortTermBehavior = behaviorData.planningBehavior.longTermThinking < 0.5;
        
        if (hasLongTermGoals && showsShortTermBehavior) {
            inconsistencies.push('Long-term goals but short-term decision-making behavior');
        }
        
        const highSavings = this.calculateSavingsRate(financialData) > 0.15;
        const impulsiveSpending = behaviorData.planningBehavior.impulsiveDecisions > 0.6;
        
        if (highSavings && impulsiveSpending) {
            inconsistencies.push('High savings rate but impulsive spending behavior');
        }
        
        return inconsistencies;
    }

    private calculateOverallConsistency(
        riskContexts: Array<{ context: string; riskLevel: number; consistency: number }>,
        framingInconsistencies: string[],
        timeInconsistencies: string[]
    ): number {
        const avgRiskConsistency = riskContexts.reduce((sum, ctx) => sum + ctx.consistency, 0) / riskContexts.length;
        const framingPenalty = framingInconsistencies.length * 10;
        const timePenalty = timeInconsistencies.length * 15;
        
        return Math.max(0, avgRiskConsistency * 100 - framingPenalty - timePenalty);
    }

    private generateConsistencyRecommendations(inconsistencies: string[], riskContexts: any[]): string[] {
        const recommendations: string[] = [];
        
        if (inconsistencies.length > 0) {
            recommendations.push('Consider developing a consistent framework for financial decisions across different contexts');
            recommendations.push('Regular review of financial goals and behaviors to identify and address inconsistencies');
        }
        
        const lowConsistency = riskContexts.filter(ctx => ctx.consistency < 0.7);
        if (lowConsistency.length > 0) {
            recommendations.push('Work on aligning stated preferences with actual financial behaviors');
        }
        
        return recommendations;
    }

    private generateCognitiveInterventions(psychologyProfile: PsychologyProfile, _biasResults: BiasDetectionResult[]): Array<{
        intervention: string;
        targetBiases: CognitiveBiasType[];
        technique: string;
        timing: 'immediate' | 'gradual' | 'situational';
        effectiveness: number;
        personalizedApproach: string;
    }> {
        const interventions = [];
        
        // Overconfidence intervention
        if (psychologyProfile.dominantBiases.includes('overconfidence')) {
            interventions.push({
                intervention: 'Systematic decision framework with external validation',
                targetBiases: ['overconfidence' as CognitiveBiasType],
                technique: 'Pre-mortem analysis and expert consultation requirements',
                timing: 'situational' as const,
                effectiveness: 0.75,
                personalizedApproach: `Given your ${psychologyProfile.decisionMakingStyle} decision style, implement mandatory cooling-off periods for major financial decisions`
            });
        }
        
        // Loss aversion intervention
        if (psychologyProfile.dominantBiases.includes('loss-aversion')) {
            interventions.push({
                intervention: 'Reframe losses as forgone gains and use mental accounting',
                targetBiases: ['loss-aversion' as CognitiveBiasType],
                technique: 'Gain-framing and systematic exposure therapy',
                timing: 'gradual' as const,
                effectiveness: 0.65,
                personalizedApproach: `As a ${psychologyProfile.riskTolerance} investor, gradually increase risk exposure with small, systematic steps`
            });
        }
        
        return interventions;
    }

    private generateBehavioralInterventions(behaviorPatterns: BehaviorPattern[], _biasResults: BiasDetectionResult[]): Array<{
        intervention: string;
        targetBiases: CognitiveBiasType[];
        technique: string;
        timing: 'immediate' | 'gradual' | 'situational';
        effectiveness: number;
        personalizedApproach: string;
    }> {
        const interventions = [];
        
        const overtradingPattern = behaviorPatterns.find(p => p.pattern.includes('Frequent trading'));
        if (overtradingPattern) {
            interventions.push({
                intervention: 'Implement trading restrictions and automatic investing',
                targetBiases: ['overconfidence', 'availability-heuristic'] as CognitiveBiasType[],
                technique: 'Commitment devices and automation',
                timing: 'immediate' as const,
                effectiveness: 0.8,
                personalizedApproach: 'Set up automatic investment transfers and impose waiting periods for trades'
            });
        }
        
        return interventions;
    }

    private generateEnvironmentalInterventions(psychologyProfile: PsychologyProfile, _behaviorPatterns: BehaviorPattern[]): Array<{
        intervention: string;
        targetBiases: CognitiveBiasType[];
        technique: string;
        timing: 'immediate' | 'gradual' | 'situational';
        effectiveness: number;
        personalizedApproach: string;
    }> {
        const interventions = [];
        
        interventions.push({
            intervention: 'Optimize decision environment and remove temptations',
            targetBiases: ['mental-accounting', 'framing-effect'] as CognitiveBiasType[],
            technique: 'Choice architecture and environmental design',
            timing: 'immediate' as const,
            effectiveness: 0.7,
            personalizedApproach: `Design your financial environment to support your ${psychologyProfile.emotionalMoney} tendencies while encouraging optimal decisions`
        });
        
        return interventions;
    }

    private generateSocialInterventions(psychologyProfile: PsychologyProfile, _biasResults: BiasDetectionResult[]): Array<{
        intervention: string;
        targetBiases: CognitiveBiasType[];
        technique: string;
        timing: 'immediate' | 'gradual' | 'situational';
        effectiveness: number;
        personalizedApproach: string;
    }> {
        const interventions = [];
        
        if (psychologyProfile.dominantBiases.includes('herd-mentality')) {
            interventions.push({
                intervention: 'Develop independent decision-making process with accountability partner',
                targetBiases: ['herd-mentality', 'confirmation-bias'] as CognitiveBiasType[],
                technique: 'Social accountability and independent analysis requirements',
                timing: 'gradual' as const,
                effectiveness: 0.6,
                personalizedApproach: 'Find a trusted advisor who will challenge your assumptions and provide contrarian perspectives'
            });
        }
        
        return interventions;
    }

    // Helper methods
    private initializeProspectTheory(): ProspectTheoryParams {
        return {
            lossAversion: 2.25,
            probabilityWeighting: {
                gains: (p: number) => Math.pow(p, 0.88) / Math.pow(Math.pow(p, 0.88) + Math.pow(1 - p, 0.88), 1/0.88),
                losses: (p: number) => Math.pow(p, 0.92) / Math.pow(Math.pow(p, 0.92) + Math.pow(1 - p, 0.92), 1/0.92)
            },
            valueFunction: {
                gains: (x: number) => Math.pow(x, 0.88),
                losses: (x: number) => -2.25 * Math.pow(-x, 0.88)
            }
        };
    }

    private calculateMonthlyExpenses(financialData: UserFinancialData): number {
        return Object.values(financialData.expenses).reduce((sum, expense) => sum + expense, 0);
    }

    private calculateSavingsRate(financialData: UserFinancialData): number {
        const totalIncome = Object.values(financialData.income).reduce((sum, income) => sum + income, 0);
        const totalExpenses = this.calculateMonthlyExpenses(financialData);
        return Math.max(0, (totalIncome - totalExpenses) / totalIncome);
    }

    private calculateCashPercentage(financialData: UserFinancialData): number {
        const totalCash = financialData.assets.checking + financialData.assets.savings + 
                         financialData.assets.moneyMarket + financialData.assets.emergencyFund;
        const totalAssets = Object.values(financialData.assets).reduce((sum, asset) => sum + asset, 0);
        return totalCash / totalAssets;
    }

    private calculateInsuranceRiskLevel(financialData: UserFinancialData): number {
        const coverageTypes = [
            financialData.insurance.healthInsurance,
            financialData.insurance.lifeInsurance,
            financialData.insurance.shortTermDisability,
            financialData.insurance.longTermDisability,
            financialData.insurance.homeInsurance,
            financialData.insurance.autoInsurance
        ];
        
        const coverageRatio = coverageTypes.filter(Boolean).length / coverageTypes.length;
        return 1 - coverageRatio; // Higher coverage = lower risk level
    }

    private groupFramingResponses(assessmentResponses: BiasAssessmentResponse[]): BiasAssessmentResponse[][] {
        const groups: { [key: string]: BiasAssessmentResponse[] } = {};
        
        assessmentResponses.forEach(response => {
            if (response.questionId.includes('framing')) {
                const baseId = response.questionId.split('-framing')[0];
                if (!groups[baseId]) groups[baseId] = [];
                groups[baseId].push(response);
            }
        });
        
        return Object.values(groups);
    }
} 