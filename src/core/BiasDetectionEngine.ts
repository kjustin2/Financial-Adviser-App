/**
 * Cognitive Bias Detection Engine
 * 
 * Implements state-of-the-art behavioral finance algorithms to detect
 * and quantify cognitive biases in financial decision-making.
 * Based on research from Kahneman, Tversky, Thaler, and others.
 */

import {
    CognitiveBiasType,
    BiasDetectionResult,
    UserFinancialData,
    UserBehaviorData,
    BiasAssessmentResponse,
    BehavioralMetrics,

} from '../types';

export class BiasDetectionEngine {
    private populationBenchmarks: Map<CognitiveBiasType, number>;

    constructor() {
        this.populationBenchmarks = this.initializePopulationBenchmarks();
    }

    /**
     * Comprehensive bias detection using multiple data sources
     */
    public detectBiases(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        assessmentResponses: BiasAssessmentResponse[]
    ): BiasDetectionResult[] {
        const results: BiasDetectionResult[] = [];

        // Detect each type of bias
        results.push(this.detectOverconfidence(financialData, behaviorData, assessmentResponses));
        results.push(this.detectLossAversion(financialData, behaviorData, assessmentResponses));
        results.push(this.detectConfirmationBias(financialData, behaviorData, assessmentResponses));
        results.push(this.detectAnchoring(financialData, behaviorData, assessmentResponses));
        results.push(this.detectAvailabilityHeuristic(financialData, behaviorData, assessmentResponses));
        results.push(this.detectMentalAccounting(financialData, behaviorData, assessmentResponses));
        results.push(this.detectHerdMentality(financialData, behaviorData, assessmentResponses));
        results.push(this.detectRecencyBias(financialData, behaviorData, assessmentResponses));
        results.push(this.detectSunkCostFallacy(financialData, behaviorData, assessmentResponses));
        results.push(this.detectFramingEffect(financialData, behaviorData, assessmentResponses));

        return results.filter(result => result.confidence > 0.3); // Filter low-confidence results
    }

    /**
     * Calculate comprehensive behavioral metrics
     */
    public calculateBehavioralMetrics(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        biasResults: BiasDetectionResult[]
    ): BehavioralMetrics {
        return {
            rationalityIndex: this.calculateRationalityIndex(biasResults),
            biasResistanceScore: this.calculateBiasResistanceScore(biasResults),
            emotionalVolatility: this.calculateEmotionalVolatility(behaviorData),
            decisionConsistency: this.calculateDecisionConsistency(behaviorData),
            riskPerceptionAccuracy: this.calculateRiskPerceptionAccuracy(financialData, behaviorData),
            overconfidenceLevel: this.calculateOverconfidenceLevel(biasResults, behaviorData)
        };
    }

    /**
     * Detect overconfidence bias
     */
    private detectOverconfidence(
        _financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        assessmentResponses: BiasAssessmentResponse[]
    ): BiasDetectionResult {
        const indicators: string[] = [];
        let severity: 'low' | 'moderate' | 'high' | 'severe' = 'low';
        let confidence = 0;

        // Analyze trading patterns for overconfidence
        if (behaviorData.tradingPatterns.frequency === 'daily' || behaviorData.tradingPatterns.frequency === 'weekly') {
            indicators.push('High frequency trading suggesting overconfidence in market timing ability');
            confidence += 0.3;
        }

        if (behaviorData.tradingPatterns.portfolioTurnover > 100) {
            indicators.push('Excessive portfolio turnover indicating overconfidence in stock selection');
            confidence += 0.25;
        }

        if (behaviorData.tradingPatterns.marketTimingAttempts > 5) {
            indicators.push('Frequent market timing attempts showing overconfidence in forecasting ability');
            confidence += 0.2;
        }

        // Check risk tolerance vs actual risk taking
        const riskDiscrepancy = Math.abs(behaviorData.riskBehavior.actualRiskTolerance - behaviorData.riskBehavior.statedRiskTolerance);
        if (riskDiscrepancy > 0.3 && behaviorData.riskBehavior.actualRiskTolerance > behaviorData.riskBehavior.statedRiskTolerance) {
            indicators.push('Taking more risk than stated tolerance suggests overconfidence');
            confidence += 0.15;
        }

        // Analyze assessment responses
        const overconfidenceResponses = assessmentResponses.filter(r => r.questionId.includes('overconfidence'));
        if (overconfidenceResponses.length > 0) {
            const avgConfidence = overconfidenceResponses.reduce((sum, r) => sum + r.confidence, 0) / overconfidenceResponses.length;
            if (avgConfidence > 4) {
                indicators.push('Self-reported high confidence in financial decisions');
                confidence += 0.1;
            }
        }

        // Determine severity based on confidence
        if (confidence > 0.7) severity = 'severe';
        else if (confidence > 0.5) severity = 'high';
        else if (confidence > 0.3) severity = 'moderate';

        return {
            biasType: 'overconfidence',
            severity,
            confidence: Math.min(confidence, 1),
            indicators,
            evidence: {
                behavioral: indicators.filter(i => i.includes('trading') || i.includes('risk')),
                financial: indicators.filter(i => i.includes('portfolio') || i.includes('market')),
                survey: indicators.filter(i => i.includes('Self-reported'))
            },
            description: 'Overconfidence bias leads to excessive trading, poor diversification, and unrealistic expectations about investment performance.',
            prevalence: this.populationBenchmarks.get('overconfidence') || 0.6
        };
    }

    /**
     * Detect loss aversion bias
     */
    private detectLossAversion(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        assessmentResponses: BiasAssessmentResponse[]
    ): BiasDetectionResult {
        const indicators: string[] = [];
        let severity: 'low' | 'moderate' | 'high' | 'severe' = 'low';
        let confidence = 0;

        // Check for panic selling history
        if (behaviorData.riskBehavior.panicSellingHistory) {
            indicators.push('History of panic selling during market downturns');
            confidence += 0.3;
        }

        // Analyze cash holdings vs recommended emergency fund
        const cashPercentage = (financialData.assets.checking + financialData.assets.savings + financialData.assets.emergencyFund) / 
                              (this.calculateNetWorth(financialData));
        if (cashPercentage > 0.3) {
            indicators.push('Excessive cash holdings suggesting fear of losses');
            confidence += 0.2;
        }

        // Check diversification level
        if (behaviorData.tradingPatterns.diversificationLevel < 0.5) {
            indicators.push('Poor diversification may indicate loss aversion affecting portfolio construction');
            confidence += 0.15;
        }

        // Analyze risk tolerance vs age-appropriate allocation
        const ageBasedRiskTolerance = Math.max(0.2, (100 - financialData.personalInfo.age) / 100);
        const actualRiskTolerance = behaviorData.riskBehavior.actualRiskTolerance;
        if (actualRiskTolerance < ageBasedRiskTolerance - 0.2) {
            indicators.push('Risk tolerance significantly below age-appropriate level');
            confidence += 0.2;
        }

        // Assessment responses analysis
        const lossAversionResponses = assessmentResponses.filter(r => r.questionId.includes('loss-aversion'));
        if (lossAversionResponses.length > 0) {
            const avgResponse = lossAversionResponses.reduce((sum, r) => sum + (r.response as number), 0) / lossAversionResponses.length;
            if (avgResponse > 3) {
                indicators.push('Strong negative reaction to potential losses in assessment');
                confidence += 0.15;
            }
        }

        // Determine severity
        if (confidence > 0.7) severity = 'severe';
        else if (confidence > 0.5) severity = 'high';
        else if (confidence > 0.3) severity = 'moderate';

        return {
            biasType: 'loss-aversion',
            severity,
            confidence: Math.min(confidence, 1),
            indicators,
            evidence: {
                behavioral: indicators.filter(i => i.includes('panic') || i.includes('risk')),
                financial: indicators.filter(i => i.includes('cash') || i.includes('diversification')),
                survey: indicators.filter(i => i.includes('assessment') || i.includes('reaction'))
            },
            description: 'Loss aversion causes disproportionate fear of losses relative to equivalent gains, leading to overly conservative investing.',
            prevalence: this.populationBenchmarks.get('loss-aversion') || 0.8
        };
    }

    /**
     * Detect confirmation bias
     */
    private detectConfirmationBias(
        _financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        assessmentResponses: BiasAssessmentResponse[]
    ): BiasDetectionResult {
        const indicators: string[] = [];
        let severity: 'low' | 'moderate' | 'high' | 'severe' = 'low';
        let confidence = 0;

        // Analyze information seeking behavior
        if (behaviorData.informationSeeking.sourcesUsed.length <= 2) {
            indicators.push('Limited information sources suggesting confirmation bias');
            confidence += 0.25;
        }

        if (behaviorData.informationSeeking.expertAdviceReliance < 0.3) {
            indicators.push('Low reliance on expert advice may indicate preference for confirming sources');
            confidence += 0.2;
        }

        // Check investment diversification (confirmation bias can lead to home bias)
        if (behaviorData.tradingPatterns.diversificationLevel < 0.6) {
            indicators.push('Poor diversification may reflect confirmation bias in investment selection');
            confidence += 0.15;
        }

        // Analyze planning behavior
        if (behaviorData.planningBehavior.goalSettingClarity < 0.5) {
            indicators.push('Unclear goal setting may indicate avoiding contradictory information');
            confidence += 0.1;
        }

        // Assessment responses
        const confirmationResponses = assessmentResponses.filter(r => r.questionId.includes('confirmation'));
        if (confirmationResponses.length > 0) {
            const avgResponse = confirmationResponses.reduce((sum, r) => sum + (r.response as number), 0) / confirmationResponses.length;
            if (avgResponse > 3.5) {
                indicators.push('Assessment responses indicate tendency to seek confirming information');
                confidence += 0.2;
            }
        }

        // Determine severity
        if (confidence > 0.6) severity = 'severe';
        else if (confidence > 0.45) severity = 'high';
        else if (confidence > 0.3) severity = 'moderate';

        return {
            biasType: 'confirmation-bias',
            severity,
            confidence: Math.min(confidence, 1),
            indicators,
            evidence: {
                behavioral: indicators.filter(i => i.includes('sources') || i.includes('advice')),
                financial: indicators.filter(i => i.includes('diversification') || i.includes('investment')),
                survey: indicators.filter(i => i.includes('Assessment'))
            },
            description: 'Confirmation bias leads to seeking information that confirms existing beliefs while ignoring contradictory evidence.',
            prevalence: this.populationBenchmarks.get('confirmation-bias') || 0.7
        };
    }

    /**
     * Detect anchoring bias
     */
    private detectAnchoring(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        assessmentResponses: BiasAssessmentResponse[]
    ): BiasDetectionResult {
        const indicators: string[] = [];
        let severity: 'low' | 'moderate' | 'high' | 'severe' = 'low';
        let confidence = 0;

        // Check if goals are round numbers (common anchoring pattern)
        const retirementGoal = financialData.goals.retirementIncomeNeeded;
        if (retirementGoal % 1000 === 0 || retirementGoal % 500 === 0) {
            indicators.push('Round number retirement goal suggests anchoring to conventional figures');
            confidence += 0.15;
        }

        // Analyze emergency fund target
        const emergencyFundMonths = financialData.goals.emergencyFundTarget / (this.calculateMonthlyExpenses(financialData));
        if (emergencyFundMonths === 3 || emergencyFundMonths === 6) {
            indicators.push('Standard emergency fund target (3 or 6 months) may indicate anchoring to common advice');
            confidence += 0.1;
        }

        // Check decision consistency (anchoring reduces flexibility)
        if (behaviorData.planningBehavior.goalSettingClarity > 0.8 && behaviorData.planningBehavior.longTermThinking < 0.6) {
            indicators.push('High goal clarity with low long-term thinking suggests anchoring to specific targets');
            confidence += 0.2;
        }

        // Assessment responses
        const anchoringResponses = assessmentResponses.filter(r => r.questionId.includes('anchoring'));
        if (anchoringResponses.length > 0) {
            const responseVariability = this.calculateResponseVariability(anchoringResponses);
            if (responseVariability < 0.3) {
                indicators.push('Low variability in responses suggests anchoring to initial estimates');
                confidence += 0.25;
            }
        }

        // News reaction time (anchoring can cause delayed adjustments)
        if (behaviorData.informationSeeking.newsReactionTime > 7) {
            indicators.push('Slow reaction to new information may indicate anchoring to previous beliefs');
            confidence += 0.2;
        }

        // Determine severity
        if (confidence > 0.6) severity = 'severe';
        else if (confidence > 0.45) severity = 'high';
        else if (confidence > 0.3) severity = 'moderate';

        return {
            biasType: 'anchoring',
            severity,
            confidence: Math.min(confidence, 1),
            indicators,
            evidence: {
                behavioral: indicators.filter(i => i.includes('reaction') || i.includes('thinking')),
                financial: indicators.filter(i => i.includes('goal') || i.includes('fund')),
                survey: indicators.filter(i => i.includes('responses') || i.includes('estimates'))
            },
            description: 'Anchoring bias causes excessive reliance on the first piece of information encountered when making decisions.',
            prevalence: this.populationBenchmarks.get('anchoring') || 0.75
        };
    }

    /**
     * Detect availability heuristic bias
     */
    private detectAvailabilityHeuristic(
        _financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        assessmentResponses: BiasAssessmentResponse[]
    ): BiasDetectionResult {
        const indicators: string[] = [];
        let severity: 'low' | 'moderate' | 'high' | 'severe' = 'low';
        let confidence = 0;

        // Fast news reaction time suggests availability heuristic
        if (behaviorData.informationSeeking.newsReactionTime < 2) {
            indicators.push('Very fast reaction to news suggests decisions based on easily recalled information');
            confidence += 0.3;
        }

        // High frequency research but low expert advice reliance
        if (behaviorData.informationSeeking.frequencyOfResearch > 0.7 && 
            behaviorData.informationSeeking.expertAdviceReliance < 0.4) {
            indicators.push('High information consumption with low expert reliance suggests availability bias');
            confidence += 0.2;
        }

        // Recent market events affecting decisions (panic selling/FOMO buying)
        if (behaviorData.riskBehavior.panicSellingHistory || behaviorData.riskBehavior.fomoBuyingHistory) {
            indicators.push('History of emotional trading suggests decisions influenced by easily recalled market events');
            confidence += 0.25;
        }

        // Short-term oriented behavior
        if (behaviorData.planningBehavior.longTermThinking < 0.5) {
            indicators.push('Limited long-term thinking may indicate focus on easily recalled recent events');
            confidence += 0.15;
        }

        // Assessment responses showing recency effects
        const availabilityResponses = assessmentResponses.filter(r => r.questionId.includes('availability'));
        if (availabilityResponses.length > 0) {
            const quickResponses = availabilityResponses.filter(r => r.timeSpent < 10).length;
            if (quickResponses / availabilityResponses.length > 0.6) {
                indicators.push('Quick responses to scenario questions suggest reliance on easily recalled examples');
                confidence += 0.1;
            }
        }

        // Determine severity
        if (confidence > 0.6) severity = 'severe';
        else if (confidence > 0.45) severity = 'high';
        else if (confidence > 0.3) severity = 'moderate';

        return {
            biasType: 'availability-heuristic',
            severity,
            confidence: Math.min(confidence, 1),
            indicators,
            evidence: {
                behavioral: indicators.filter(i => i.includes('reaction') || i.includes('trading')),
                financial: indicators.filter(i => i.includes('market') || i.includes('selling')),
                survey: indicators.filter(i => i.includes('responses') || i.includes('scenario'))
            },
            description: 'Availability heuristic causes overweighting of easily recalled information, often recent or dramatic events.',
            prevalence: this.populationBenchmarks.get('availability-heuristic') || 0.65
        };
    }

    /**
     * Detect mental accounting bias
     */
    private detectMentalAccounting(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        assessmentResponses: BiasAssessmentResponse[]
    ): BiasDetectionResult {
        const indicators: string[] = [];
        let severity: 'low' | 'moderate' | 'high' | 'severe' = 'low';
        let confidence = 0;

        // Check for inefficient cash management
        const totalLiquid = financialData.assets.checking + financialData.assets.savings + 
                           financialData.assets.moneyMarket + financialData.assets.emergencyFund;
        const totalDebt = financialData.liabilities.creditCardDebt + financialData.liabilities.personalLoans;
        
        if (totalLiquid > 10000 && totalDebt > 5000) {
            indicators.push('Maintaining cash while carrying high-interest debt suggests mental accounting');
            confidence += 0.3;
        }

        // Multiple separate accounts for similar purposes
        const separateAccounts = [
            financialData.assets.checking,
            financialData.assets.savings,
            financialData.assets.moneyMarket,
            financialData.assets.emergencyFund
        ].filter(amount => amount > 1000).length;

        if (separateAccounts > 2) {
            indicators.push('Multiple separate liquid accounts may indicate mental accounting behavior');
            confidence += 0.2;
        }

        // Budget categorization without fungibility
        if (financialData.behaviors.budgetingMethod === 'detailed-budget' && 
            behaviorData.planningBehavior.budgetingConsistency > 0.8) {
            indicators.push('Rigid budgeting without flexibility suggests mental accounting');
            confidence += 0.15;
        }

        // Investment account fragmentation
        const investmentAccounts = [
            financialData.assets.employer401k,
            financialData.assets.traditionalIRA,
            financialData.assets.rothIRA,
            financialData.assets.brokerageAccounts
        ].filter(amount => amount > 1000).length;

        if (investmentAccounts > 2 && behaviorData.tradingPatterns.diversificationLevel < 0.6) {
            indicators.push('Multiple investment accounts with poor diversification suggests mental accounting');
            confidence += 0.2;
        }

        // Assessment responses
        const mentalAccountingResponses = assessmentResponses.filter(r => r.questionId.includes('mental-accounting'));
        if (mentalAccountingResponses.length > 0) {
            const avgResponse = mentalAccountingResponses.reduce((sum, r) => sum + (r.response as number), 0) / mentalAccountingResponses.length;
            if (avgResponse > 3.5) {
                indicators.push('Assessment indicates tendency to categorize money inflexibly');
                confidence += 0.15;
            }
        }

        // Determine severity
        if (confidence > 0.6) severity = 'severe';
        else if (confidence > 0.45) severity = 'high';
        else if (confidence > 0.3) severity = 'moderate';

        return {
            biasType: 'mental-accounting',
            severity,
            confidence: Math.min(confidence, 1),
            indicators,
            evidence: {
                behavioral: indicators.filter(i => i.includes('budgeting') || i.includes('accounts')),
                financial: indicators.filter(i => i.includes('cash') || i.includes('debt') || i.includes('investment')),
                survey: indicators.filter(i => i.includes('Assessment') || i.includes('categorize'))
            },
            description: 'Mental accounting leads to treating money differently based on its source or intended use, often resulting in suboptimal decisions.',
            prevalence: this.populationBenchmarks.get('mental-accounting') || 0.7
        };
    }

    /**
     * Detect herd mentality bias
     */
    private detectHerdMentality(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        assessmentResponses: BiasAssessmentResponse[]
    ): BiasDetectionResult {
        const indicators: string[] = [];
        let severity: 'low' | 'moderate' | 'high' | 'severe' = 'low';
        let confidence = 0;

        // FOMO buying behavior
        if (behaviorData.riskBehavior.fomoBuyingHistory) {
            indicators.push('History of FOMO buying suggests susceptibility to herd mentality');
            confidence += 0.3;
        }

        // High expert advice reliance with low independent research
        if (behaviorData.informationSeeking.expertAdviceReliance > 0.7 && 
            behaviorData.informationSeeking.frequencyOfResearch < 0.4) {
            indicators.push('High reliance on others with low independent analysis suggests herd following');
            confidence += 0.25;
        }

        // Popular investment choices (checking for concentration in common assets)
        const stocksPercentage = financialData.assets.stocks / this.calculateTotalInvestments(financialData);
        if (stocksPercentage > 0.6) {
            indicators.push('High concentration in popular stock investments may indicate herd behavior');
            confidence += 0.15;
        }

        // Timing of investment decisions
        if (behaviorData.tradingPatterns.marketTimingAttempts > 3) {
            indicators.push('Frequent market timing attempts may reflect following crowd sentiment');
            confidence += 0.2;
        }

        // Assessment responses
        const herdResponses = assessmentResponses.filter(r => r.questionId.includes('herd') || r.questionId.includes('social'));
        if (herdResponses.length > 0) {
            const avgResponse = herdResponses.reduce((sum, r) => sum + (r.response as number), 0) / herdResponses.length;
            if (avgResponse > 3.5) {
                indicators.push('Assessment indicates high influence of social factors in decisions');
                confidence += 0.1;
            }
        }

        // Determine severity
        if (confidence > 0.6) severity = 'severe';
        else if (confidence > 0.45) severity = 'high';
        else if (confidence > 0.3) severity = 'moderate';

        return {
            biasType: 'herd-mentality',
            severity,
            confidence: Math.min(confidence, 1),
            indicators,
            evidence: {
                behavioral: indicators.filter(i => i.includes('FOMO') || i.includes('timing')),
                financial: indicators.filter(i => i.includes('concentration') || i.includes('investment')),
                survey: indicators.filter(i => i.includes('Assessment') || i.includes('social'))
            },
            description: 'Herd mentality causes following the crowd in investment decisions, often leading to buying high and selling low.',
            prevalence: this.populationBenchmarks.get('herd-mentality') || 0.55
        };
    }

    /**
     * Detect recency bias
     */
    private detectRecencyBias(
        _financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        assessmentResponses: BiasAssessmentResponse[]
    ): BiasDetectionResult {
        const indicators: string[] = [];
        let severity: 'low' | 'moderate' | 'high' | 'severe' = 'low';
        let confidence = 0;

        // Fast reaction to news
        if (behaviorData.informationSeeking.newsReactionTime < 3) {
            indicators.push('Very fast reaction to news suggests overweighting recent information');
            confidence += 0.25;
        }

        // Short-term thinking patterns
        if (behaviorData.planningBehavior.longTermThinking < 0.4) {
            indicators.push('Limited long-term perspective indicates focus on recent events');
            confidence += 0.2;
        }

        // Emotional trading based on recent events
        if (behaviorData.riskBehavior.panicSellingHistory || behaviorData.riskBehavior.fomoBuyingHistory) {
            indicators.push('Emotional trading decisions suggest overreaction to recent market movements');
            confidence += 0.3;
        }

        // High portfolio turnover
        if (behaviorData.tradingPatterns.portfolioTurnover > 75) {
            indicators.push('High portfolio turnover may indicate recency bias in investment selection');
            confidence += 0.15;
        }

        // Assessment responses showing recency effects
        const recencyResponses = assessmentResponses.filter(r => r.questionId.includes('recency') || r.questionId.includes('recent'));
        if (recencyResponses.length > 0) {
            const avgResponse = recencyResponses.reduce((sum, r) => sum + (r.response as number), 0) / recencyResponses.length;
            if (avgResponse > 3.5) {
                indicators.push('Assessment responses show high weight on recent events');
                confidence += 0.1;
            }
        }

        // Determine severity
        if (confidence > 0.6) severity = 'severe';
        else if (confidence > 0.45) severity = 'high';
        else if (confidence > 0.3) severity = 'moderate';

        return {
            biasType: 'recency-bias',
            severity,
            confidence: Math.min(confidence, 1),
            indicators,
            evidence: {
                behavioral: indicators.filter(i => i.includes('reaction') || i.includes('trading')),
                financial: indicators.filter(i => i.includes('turnover') || i.includes('portfolio')),
                survey: indicators.filter(i => i.includes('Assessment') || i.includes('responses'))
            },
            description: 'Recency bias causes overweighting of recent events and underweighting of long-term trends and historical data.',
            prevalence: this.populationBenchmarks.get('recency-bias') || 0.6
        };
    }

    /**
     * Detect sunk cost fallacy
     */
    private detectSunkCostFallacy(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        assessmentResponses: BiasAssessmentResponse[]
    ): BiasDetectionResult {
        const indicators: string[] = [];
        let severity: 'low' | 'moderate' | 'high' | 'severe' = 'low';
        let confidence = 0;

        // Low portfolio turnover despite poor diversification
        if (behaviorData.tradingPatterns.portfolioTurnover < 25 && 
            behaviorData.tradingPatterns.diversificationLevel < 0.5) {
            indicators.push('Low turnover with poor diversification suggests holding onto poor investments');
            confidence += 0.25;
        }

        // Continuing to hold losing investments
        if (behaviorData.riskBehavior.panicSellingHistory === false && 
            behaviorData.tradingPatterns.portfolioTurnover < 30) {
            indicators.push('Never selling during downturns may indicate sunk cost fallacy');
            confidence += 0.2;
        }

        // High debt maintenance despite available assets
        const liquidAssets = financialData.assets.checking + financialData.assets.savings;
        const highInterestDebt = financialData.liabilities.creditCardDebt;
        if (liquidAssets > highInterestDebt * 0.5 && highInterestDebt > 5000) {
            indicators.push('Maintaining debt while holding liquid assets may indicate sunk cost thinking');
            confidence += 0.15;
        }

        // Long-term goal persistence without adjustment
        if (behaviorData.planningBehavior.goalSettingClarity > 0.8 && 
            behaviorData.planningBehavior.longTermThinking > 0.7 &&
            behaviorData.planningBehavior.impulsiveDecisions < 0.3) {
            indicators.push('Rigid goal adherence without flexibility may indicate sunk cost fallacy');
            confidence += 0.2;
        }

        // Assessment responses
        const sunkCostResponses = assessmentResponses.filter(r => r.questionId.includes('sunk-cost'));
        if (sunkCostResponses.length > 0) {
            const avgResponse = sunkCostResponses.reduce((sum, r) => sum + (r.response as number), 0) / sunkCostResponses.length;
            if (avgResponse > 3.5) {
                indicators.push('Assessment shows tendency to continue poor investments due to past commitments');
                confidence += 0.2;
            }
        }

        // Determine severity
        if (confidence > 0.6) severity = 'severe';
        else if (confidence > 0.45) severity = 'high';
        else if (confidence > 0.3) severity = 'moderate';

        return {
            biasType: 'sunk-cost-fallacy',
            severity,
            confidence: Math.min(confidence, 1),
            indicators,
            evidence: {
                behavioral: indicators.filter(i => i.includes('turnover') || i.includes('goal')),
                financial: indicators.filter(i => i.includes('debt') || i.includes('investments')),
                survey: indicators.filter(i => i.includes('Assessment') || i.includes('commitments'))
            },
            description: 'Sunk cost fallacy leads to continuing poor investments or financial decisions due to past commitments rather than future prospects.',
            prevalence: this.populationBenchmarks.get('sunk-cost-fallacy') || 0.5
        };
    }

    /**
     * Detect framing effect bias
     */
    private detectFramingEffect(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        assessmentResponses: BiasAssessmentResponse[]
    ): BiasDetectionResult {
        const indicators: string[] = [];
        let severity: 'low' | 'moderate' | 'high' | 'severe' = 'low';
        let confidence = 0;

        // Inconsistent risk preferences in different contexts
        const riskDiscrepancy = Math.abs(behaviorData.riskBehavior.actualRiskTolerance - behaviorData.riskBehavior.statedRiskTolerance);
        if (riskDiscrepancy > 0.3) {
            indicators.push('Inconsistency between stated and actual risk tolerance suggests framing effects');
            confidence += 0.25;
        }

        // Response to gains vs losses framing in assessment
        const framingResponses = assessmentResponses.filter(r => r.questionId.includes('framing'));
        if (framingResponses.length >= 2) {
            const responseVariability = this.calculateResponseVariability(framingResponses);
            if (responseVariability > 0.5) {
                indicators.push('High variability in responses to differently framed questions');
                confidence += 0.3;
            }
        }

        // Insurance over-purchasing (loss framing effect)
        if (financialData.insurance.healthInsurance && 
            financialData.insurance.lifeInsurance && 
            financialData.insurance.umbrellaPolicy &&
            financialData.insurance.insuranceConfidence === 'very-confident') {
            indicators.push('Comprehensive insurance coverage may indicate susceptibility to loss framing');
            confidence += 0.15;
        }

        // Emergency fund sizing (safety vs opportunity framing)
        const emergencyFundMonths = financialData.goals.emergencyFundTarget / this.calculateMonthlyExpenses(financialData);
        if (emergencyFundMonths > 9) {
            indicators.push('Excessive emergency fund may indicate framing effect emphasizing security over growth');
            confidence += 0.2;
        }

        // Mixed confidence levels across similar decisions
        if (financialData.goals.retirementConfidence !== financialData.goals.longTermGoalConfidence) {
            indicators.push('Inconsistent confidence in similar long-term goals suggests framing effects');
            confidence += 0.1;
        }

        // Determine severity
        if (confidence > 0.6) severity = 'severe';
        else if (confidence > 0.45) severity = 'high';
        else if (confidence > 0.3) severity = 'moderate';

        return {
            biasType: 'framing-effect',
            severity,
            confidence: Math.min(confidence, 1),
            indicators,
            evidence: {
                behavioral: indicators.filter(i => i.includes('tolerance') || i.includes('confidence')),
                financial: indicators.filter(i => i.includes('insurance') || i.includes('fund')),
                survey: indicators.filter(i => i.includes('responses') || i.includes('framed'))
            },
            description: 'Framing effects cause different decisions based on how options are presented, even when outcomes are equivalent.',
            prevalence: this.populationBenchmarks.get('framing-effect') || 0.8
        };
    }

    // Helper methods



    private initializePopulationBenchmarks(): Map<CognitiveBiasType, number> {
        const benchmarks = new Map<CognitiveBiasType, number>();
        benchmarks.set('overconfidence', 0.6);
        benchmarks.set('loss-aversion', 0.8);
        benchmarks.set('confirmation-bias', 0.7);
        benchmarks.set('anchoring', 0.75);
        benchmarks.set('availability-heuristic', 0.65);
        benchmarks.set('mental-accounting', 0.7);
        benchmarks.set('herd-mentality', 0.55);
        benchmarks.set('recency-bias', 0.6);
        benchmarks.set('sunk-cost-fallacy', 0.5);
        benchmarks.set('framing-effect', 0.8);
        return benchmarks;
    }

    private calculateNetWorth(financialData: UserFinancialData): number {
        const assets = Object.values(financialData.assets).reduce((sum, value) => sum + value, 0);
        const liabilities = Object.values(financialData.liabilities).reduce((sum, value) => sum + value, 0);
        return assets - liabilities;
    }

    private calculateMonthlyExpenses(financialData: UserFinancialData): number {
        return Object.values(financialData.expenses).reduce((sum, value) => sum + value, 0);
    }

    private calculateTotalInvestments(financialData: UserFinancialData): number {
        return financialData.assets.employer401k + financialData.assets.traditionalIRA + 
               financialData.assets.rothIRA + financialData.assets.brokerageAccounts + 
               financialData.assets.stocks + financialData.assets.bonds + financialData.assets.mutualFunds;
    }

    private calculateResponseVariability(responses: BiasAssessmentResponse[]): number {
        if (responses.length < 2) return 0;
        const values = responses.map(r => typeof r.response === 'number' ? r.response : 0);
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        return Math.sqrt(variance) / mean;
    }

    private calculateRationalityIndex(biasResults: BiasDetectionResult[]): number {
        const totalBiasScore = biasResults.reduce((sum, bias) => {
            const severityScore = { low: 1, moderate: 2, high: 3, severe: 4 }[bias.severity];
            return sum + (severityScore * bias.confidence);
        }, 0);
        const maxPossibleScore = biasResults.length * 4;
        return Math.max(0, 100 - (totalBiasScore / maxPossibleScore) * 100);
    }

    private calculateBiasResistanceScore(biasResults: BiasDetectionResult[]): number {
        const severeBiases = biasResults.filter(bias => bias.severity === 'severe' || bias.severity === 'high').length;
        const totalBiases = biasResults.length;
        return Math.max(0, 100 - (severeBiases / totalBiases) * 100);
    }

    private calculateEmotionalVolatility(behaviorData: UserBehaviorData): number {
        let volatility = 0;
        if (behaviorData.riskBehavior.panicSellingHistory) volatility += 30;
        if (behaviorData.riskBehavior.fomoBuyingHistory) volatility += 25;
        if (behaviorData.informationSeeking.newsReactionTime < 2) volatility += 20;
        if (behaviorData.tradingPatterns.frequency === 'daily') volatility += 25;
        return Math.min(100, volatility);
    }

    private calculateDecisionConsistency(behaviorData: UserBehaviorData): number {
        const riskConsistency = 100 - Math.abs(behaviorData.riskBehavior.actualRiskTolerance - behaviorData.riskBehavior.statedRiskTolerance) * 100;
        const planningConsistency = behaviorData.planningBehavior.budgetingConsistency * 100;
        return (riskConsistency + planningConsistency) / 2;
    }

    private calculateRiskPerceptionAccuracy(financialData: UserFinancialData, behaviorData: UserBehaviorData): number {
        // Age-appropriate risk tolerance baseline
        const ageBasedRisk = Math.max(0.2, (100 - financialData.personalInfo.age) / 100);
        const actualRisk = behaviorData.riskBehavior.actualRiskTolerance;
        const accuracy = 100 - Math.abs(ageBasedRisk - actualRisk) * 100;
        return Math.max(0, accuracy);
    }

    private calculateOverconfidenceLevel(biasResults: BiasDetectionResult[], behaviorData: UserBehaviorData): number {
        const overconfidenceBias = biasResults.find(bias => bias.biasType === 'overconfidence');
        if (!overconfidenceBias) return 0;
        
        const baseLevel = ({ low: 25, moderate: 50, high: 75, severe: 100 })[overconfidenceBias.severity];
        const tradingBoost = behaviorData.tradingPatterns.frequency === 'daily' ? 20 : 0;
        const marketTimingBoost = behaviorData.tradingPatterns.marketTimingAttempts > 5 ? 15 : 0;
        
        return Math.min(100, baseLevel + tradingBoost + marketTimingBoost);
    }
} 