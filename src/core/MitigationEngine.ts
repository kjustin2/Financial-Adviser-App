/**
 * MitigationEngine.ts
 * 
 * Comprehensive bias mitigation and strategy recommendation engine
 * Provides personalized advice for overcoming cognitive biases in financial decision-making
 * 
 * Built on research from:
 * - Kahneman & Tversky (Prospect Theory)
 * - Richard Thaler (Behavioral Economics)
 * - Ariely (Predictably Irrational)
 * - Heath & Heath (Made to Stick)
 */

import { 
    UserFinancialData, 
    UserBehaviorData, 
    BiasDetectionResult, 
    CognitiveBiasType,
    PsychologyProfile,
    BehaviorPattern,
    BiasAssessmentResponse,
    EnhancedMitigationStrategy,
    MitigationPlan 
} from '../types';
import { PsychologyAnalysisEngine } from './PsychologyAnalysisEngine';

export class MitigationEngine {
    private psychologyEngine: PsychologyAnalysisEngine;
    private strategyDatabase: Map<string, EnhancedMitigationStrategy>;

    constructor() {
        this.psychologyEngine = new PsychologyAnalysisEngine();
        this.strategyDatabase = new Map();
        this.initializeStrategyDatabase();
    }

    /**
     * Generate a comprehensive mitigation plan for identified biases
     */
    public generateMitigationPlan(
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData,
        biasResults: BiasDetectionResult[],
        _assessmentResponses: BiasAssessmentResponse[]
    ): MitigationPlan {
        // Generate psychology profile and behavior patterns
        const psychologyProfile = this.psychologyEngine.generatePsychologyProfile(
            financialData, 
            behaviorData, 
            biasResults
        );
        
        const behaviorPatterns = this.psychologyEngine.analyzeBehaviorPatterns(
            financialData, 
            behaviorData, 
            biasResults
        );

        // Get intervention strategies from psychology engine
        const interventionStrategies = this.psychologyEngine.generateInterventionStrategies(
            psychologyProfile,
            behaviorPatterns,
            biasResults
        );

        // Assess overall risk level
        const overallRiskLevel = this.assessOverallRiskLevel(biasResults, behaviorPatterns);
        
        // Identify priority biases
        const priorityBiases = this.identifyPriorityBiases(biasResults, behaviorPatterns);
        
        // Generate personalized strategies
        const strategies = this.generatePersonalizedStrategies(
            priorityBiases,
            psychologyProfile,
            behaviorPatterns,
            interventionStrategies,
            financialData,
            behaviorData
        );

        // Create implementation timeline
        const timeline = this.createImplementationTimeline(strategies, overallRiskLevel);

        // Generate tracking recommendations
        const trackingRecommendations = this.generateTrackingRecommendations(
            priorityBiases, 
            strategies
        );

        // Define expected outcomes
        const expectedOutcomes = this.defineExpectedOutcomes(
            priorityBiases, 
            strategies, 
            psychologyProfile
        );

        return {
            generatedAt: new Date(),
            overallRiskLevel,
            priorityBiases,
            strategies,
            timeline,
            trackingRecommendations,
            expectedOutcomes
        };
    }

    /**
     * Generate quick mitigation advice for a specific bias
     */
    public getQuickMitigationAdvice(biasType: CognitiveBiasType): EnhancedMitigationStrategy | null {
        const strategies = Array.from(this.strategyDatabase.values())
            .filter(strategy => strategy.targetBiases.includes(biasType))
            .sort((a, b) => b.effectiveness - a.effectiveness);
        
        return strategies[0] || null;
    }

    /**
     * Update mitigation plan based on progress and new data
     */
    public updateMitigationProgress(
        currentPlan: MitigationPlan,
        progressData: {
            completedStrategies: string[];
            biasReassessment: BiasDetectionResult[];
            behaviorChanges: Partial<UserBehaviorData>;
        }
    ): MitigationPlan {
        // Reassess bias levels
        const improvementAreas = this.identifyImprovementAreas(
            currentPlan.priorityBiases,
            progressData.biasReassessment
        );

        // Update strategy effectiveness based on progress
        const updatedStrategies = this.updateStrategyEffectiveness(
            currentPlan.strategies,
            progressData.completedStrategies,
            improvementAreas
        );

        // Adjust timeline if needed
        const adjustedTimeline = this.adjustTimeline(
            currentPlan.timeline,
            progressData.completedStrategies,
            improvementAreas
        );

        return {
            ...currentPlan,
            strategies: updatedStrategies,
            timeline: adjustedTimeline,
            generatedAt: new Date()
        };
    }

    /**
     * Generate bias-specific mitigation techniques
     */
    public generateBiasSpecificTechniques(biasType: CognitiveBiasType): string[] {
        const techniqueMap: { [key in CognitiveBiasType]: string[] } = {
            'overconfidence': [
                'Keep a decision journal to track accuracy',
                'Seek devil\'s advocate perspectives',
                'Use base rates and historical data',
                'Set up systematic review processes',
                'Practice intellectual humility exercises'
            ],
            'loss-aversion': [
                'Frame decisions in terms of opportunity cost',
                'Use dollar-cost averaging strategies',
                'Set automatic investment rules',
                'Focus on long-term gains versus short-term losses',
                'Practice small risk-taking to build tolerance'
            ],
            'confirmation-bias': [
                'Actively seek disconfirming evidence',
                'Use structured decision-making frameworks',
                'Consult diverse information sources',
                'Set up automatic counter-argument research',
                'Practice steel man arguments'
            ],
            'anchoring': [
                'Use multiple reference points',
                'Start analysis from different angles',
                'Research market comparables thoroughly',
                'Set target ranges instead of single points',
                'Use algorithmic decision aids'
            ],
            'availability-heuristic': [
                'Rely on statistical data over memorable examples',
                'Create systematic information gathering processes',
                'Use base rate information consistently',
                'Document and review past decisions',
                'Implement waiting periods for major decisions'
            ],
            'mental-accounting': [
                'Review total portfolio holistically',
                'Use unified budgeting approaches',
                'Track opportunity costs across accounts',
                'Automate rebalancing processes',
                'Focus on net worth rather than individual accounts'
            ],
            'herd-mentality': [
                'Develop independent analysis frameworks',
                'Limit exposure to crowd sentiment indicators',
                'Practice contrarian thinking exercises',
                'Use systematic investment approaches',
                'Document personal investment philosophy'
            ],
            'recency-bias': [
                'Use longer-term historical data',
                'Implement systematic review periods',
                'Weight recent events appropriately',
                'Focus on trend analysis over point-in-time data',
                'Use moving averages and trend indicators'
            ],
            'sunk-cost-fallacy': [
                'Focus on forward-looking analysis',
                'Set clear exit criteria before investing',
                'Regular portfolio review and rebalancing',
                'Practice opportunity cost thinking',
                'Use stop-loss strategies'
            ],
            'framing-effect': [
                'Reframe decisions in multiple ways',
                'Use absolute numbers alongside percentages',
                'Consider both gains and losses perspectives',
                'Standardize decision-making formats',
                'Practice neutral language in analysis'
            ]
        };

        return techniqueMap[biasType] || [];
    }

    // Private helper methods

    private initializeStrategyDatabase(): void {
        const strategies: EnhancedMitigationStrategy[] = [
            {
                id: 'systematic-review-process',
                title: 'Systematic Decision Review Process',
                description: 'Implement regular, structured reviews of financial decisions to identify and correct biased thinking patterns.',
                targetBiases: ['overconfidence', 'confirmation-bias', 'anchoring'],
                category: 'cognitive',
                technique: 'Structured Decision Making',
                implementation: {
                    immediateActions: [
                        'Set up monthly portfolio review calendar',
                        'Create decision evaluation template',
                        'Document initial assumptions for major decisions'
                    ],
                    gradualChanges: [
                        'Develop expertise in systematic analysis',
                        'Build habit of seeking contrary opinions',
                        'Refine decision-making framework over time'
                    ],
                    toolsRequired: ['Decision journal', 'Calendar app', 'Excel/spreadsheet'],
                    timeframe: '3-6 months to establish habit'
                },
                effectiveness: 8.5,
                difficulty: 'medium',
                personalizedApproach: 'Adapt review frequency based on portfolio size and complexity',
                evidenceBase: 'Kahneman & Klein research on decision-making accuracy',
                successMetrics: [
                    'Increased decision accuracy over time',
                    'Reduced emotional trading',
                    'Better long-term returns'
                ],
                relatedStrategies: ['decision-journal', 'automated-investing']
            },
            {
                id: 'automated-investing',
                title: 'Automated Investment Strategy',
                description: 'Remove emotional decision-making from investment process through automation and systematic approaches.',
                targetBiases: ['loss-aversion', 'herd-mentality', 'recency-bias', 'overconfidence'],
                category: 'behavioral',
                technique: 'Behavioral Nudging',
                implementation: {
                    immediateActions: [
                        'Set up automatic investment transfers',
                        'Configure portfolio rebalancing',
                        'Establish dollar-cost averaging schedule'
                    ],
                    gradualChanges: [
                        'Gradually increase automation coverage',
                        'Refine asset allocation over time',
                        'Build emergency fund automation'
                    ],
                    toolsRequired: ['Investment platform', 'Bank auto-transfer', 'Rebalancing tools'],
                    timeframe: '1-2 months to fully implement'
                },
                effectiveness: 9.2,
                difficulty: 'low',
                personalizedApproach: 'Customize based on income patterns and risk tolerance',
                evidenceBase: 'Thaler & Benartzi Save More Tomorrow research',
                successMetrics: [
                    'Reduced trading frequency',
                    'Improved portfolio consistency',
                    'Higher savings rate'
                ],
                relatedStrategies: ['portfolio-rebalancing', 'systematic-review-process']
            },
            {
                id: 'diversification-framework',
                title: 'Mental Accounting Correction Framework',
                description: 'Implement holistic portfolio thinking to overcome mental accounting biases and improve overall allocation.',
                targetBiases: ['mental-accounting', 'anchoring', 'framing-effect'],
                category: 'cognitive',
                technique: 'Holistic Analysis',
                implementation: {
                    immediateActions: [
                        'Consolidate account views in single dashboard',
                        'Calculate total portfolio allocation',
                        'Identify account-specific biases'
                    ],
                    gradualChanges: [
                        'Develop net worth thinking habits',
                        'Reduce account-specific decision making',
                        'Focus on total portfolio performance'
                    ],
                    toolsRequired: ['Portfolio aggregation software', 'Spreadsheet tools'],
                    timeframe: '2-4 months to change thinking patterns'
                },
                effectiveness: 7.8,
                difficulty: 'medium',
                personalizedApproach: 'Adapt to number and types of accounts',
                evidenceBase: 'Thaler mental accounting research',
                successMetrics: [
                    'Improved overall asset allocation',
                    'Reduced account-specific biases',
                    'Better risk management'
                ],
                relatedStrategies: ['systematic-review-process', 'automated-investing']
            }
        ];

        strategies.forEach(strategy => {
            this.strategyDatabase.set(strategy.id, strategy);
        });
    }

    private assessOverallRiskLevel(
        biasResults: BiasDetectionResult[], 
        behaviorPatterns: BehaviorPattern[]
    ): 'low' | 'medium' | 'high' | 'critical' {
        const severeBiases = biasResults.filter(bias => bias.severity === 'severe').length;
        const highImpactPatterns = behaviorPatterns.filter(pattern => pattern.intensity >= 8).length;
        
        if (severeBiases >= 3 || highImpactPatterns >= 2) return 'critical';
        if (severeBiases >= 2 || highImpactPatterns >= 1) return 'high';
        if (severeBiases >= 1 || biasResults.some(bias => bias.severity === 'high')) return 'medium';
        return 'low';
    }

    private identifyPriorityBiases(
        biasResults: BiasDetectionResult[], 
        behaviorPatterns: BehaviorPattern[]
    ): CognitiveBiasType[] {
        // Get biases with high severity and confidence
        const highPriorityBiases = biasResults
            .filter(bias => 
                (bias.severity === 'severe' || bias.severity === 'high') && 
                bias.confidence > 0.7
            )
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 5)
            .map(bias => bias.biasType);

        // Add biases from high-intensity behavior patterns
        const patternBiases = behaviorPatterns
            .filter(pattern => pattern.intensity >= 7)
            .flatMap(pattern => pattern.relatedBiases as CognitiveBiasType[])
            .filter(bias => !highPriorityBiases.includes(bias));

        return [...highPriorityBiases, ...patternBiases.slice(0, 3)];
    }

    private generatePersonalizedStrategies(
        priorityBiases: CognitiveBiasType[],
        psychologyProfile: PsychologyProfile,
        _behaviorPatterns: BehaviorPattern[],
        _interventionStrategies: any[],
        financialData: UserFinancialData,
        behaviorData: UserBehaviorData
    ): EnhancedMitigationStrategy[] {
        const strategies: EnhancedMitigationStrategy[] = [];

        // Add strategies for priority biases
        priorityBiases.forEach(bias => {
            const relevantStrategies = Array.from(this.strategyDatabase.values())
                .filter(strategy => strategy.targetBiases.includes(bias));
            
            strategies.push(...relevantStrategies);
        });

        // Personalize based on psychology profile
        const personalizedStrategies = strategies.map(strategy => ({
            ...strategy,
            personalizedApproach: this.personalizeStrategy(
                strategy, 
                psychologyProfile, 
                financialData, 
                behaviorData
            )
        }));

        // Remove duplicates and sort by effectiveness
        const uniqueStrategies = personalizedStrategies
            .filter((strategy, index, array) => 
                array.findIndex(s => s.id === strategy.id) === index
            )
            .sort((a, b) => b.effectiveness - a.effectiveness)
            .slice(0, 8); // Limit to top 8 strategies

        return uniqueStrategies;
    }

    private personalizeStrategy(
        strategy: EnhancedMitigationStrategy,
        psychologyProfile: PsychologyProfile,
        _financialData: UserFinancialData,
        behaviorData: UserBehaviorData
    ): string {
        let personalization = strategy.personalizedApproach;

        // Adjust based on risk tolerance
        if (psychologyProfile.riskTolerance === 'conservative') {
            personalization += ' Start with lower-risk implementations to build confidence.';
        } else if (psychologyProfile.riskTolerance === 'aggressive') {
            personalization += ' Can implement more aggressive changes given comfort with risk.';
        }

        // Adjust based on decision-making style
        if (psychologyProfile.decisionMakingStyle === 'intuitive') {
            personalization += ' Focus on simple, intuitive tools rather than complex analytical frameworks.';
        } else if (psychologyProfile.decisionMakingStyle === 'rational') {
            personalization += ' Can leverage analytical tools and detailed tracking systems.';
        }

        // Adjust based on planning behavior
        if (behaviorData.planningBehavior.budgetingConsistency < 0.5) {
            personalization += ' Start with basic planning tools before advanced strategies.';
        }

        return personalization;
    }

    private createImplementationTimeline(
        strategies: EnhancedMitigationStrategy[], 
        riskLevel: 'low' | 'medium' | 'high' | 'critical'
    ): MitigationPlan['timeline'] {
        const timelineMap = {
            'critical': { phase1: 2, phase2: 4, phase3: 8 },
            'high': { phase1: 4, phase2: 6, phase3: 12 },
            'medium': { phase1: 6, phase2: 8, phase3: 16 },
            'low': { phase1: 8, phase2: 12, phase3: 20 }
        };

        const timeline = timelineMap[riskLevel];
        const immediateStrategies = strategies.filter(s => s.difficulty === 'low').slice(0, 3);
        const mediumStrategies = strategies.filter(s => s.difficulty === 'medium').slice(0, 3);
        const complexStrategies = strategies.filter(s => s.difficulty === 'high').slice(0, 2);

        return {
            phase1: {
                weeks: timeline.phase1,
                focus: 'Quick wins and foundation building',
                strategies: immediateStrategies.map(s => s.id)
            },
            phase2: {
                weeks: timeline.phase2,
                focus: 'Core habit development',
                strategies: mediumStrategies.map(s => s.id)
            },
            phase3: {
                weeks: timeline.phase3,
                focus: 'Advanced optimization',
                strategies: complexStrategies.map(s => s.id)
            }
        };
    }

    private generateTrackingRecommendations(
        _priorityBiases: CognitiveBiasType[], 
        _strategies: EnhancedMitigationStrategy[]
    ): MitigationPlan['trackingRecommendations'] {
        return {
            metrics: [
                'Bias assessment scores (monthly)',
                'Decision accuracy tracking',
                'Portfolio performance vs benchmarks',
                'Emotional trading frequency',
                'Planning behavior consistency'
            ],
            frequency: 'Monthly comprehensive review, weekly habit tracking',
            methods: [
                'Decision journal review',
                'Bias re-assessment questionnaire',
                'Portfolio performance analysis',
                'Habit tracking apps',
                'Peer feedback sessions'
            ]
        };
    }

    private defineExpectedOutcomes(
        _priorityBiases: CognitiveBiasType[], 
        _strategies: EnhancedMitigationStrategy[], 
        _psychologyProfile: PsychologyProfile
    ): MitigationPlan['expectedOutcomes'] {
        return {
            shortTerm: [
                'Increased awareness of bias triggers',
                'Improved decision-making process',
                'Reduced emotional trading'
            ],
            mediumTerm: [
                'Better portfolio performance',
                'More consistent investment behavior',
                'Improved financial planning habits'
            ],
            longTerm: [
                'Significantly reduced bias impact',
                'Optimized financial outcomes',
                'Sustainable behavioral changes'
            ]
        };
    }

    private identifyImprovementAreas(
        originalBiases: CognitiveBiasType[],
        newAssessment: BiasDetectionResult[]
    ): { improved: CognitiveBiasType[]; persistent: CognitiveBiasType[] } {
        const currentSevereBiases = newAssessment
            .filter(bias => bias.severity === 'severe' || bias.severity === 'high')
            .map(bias => bias.biasType);

        const improved = originalBiases.filter(bias => !currentSevereBiases.includes(bias));
        const persistent = originalBiases.filter(bias => currentSevereBiases.includes(bias));

        return { improved, persistent };
    }

    private updateStrategyEffectiveness(
        currentStrategies: EnhancedMitigationStrategy[],
        completedStrategies: string[],
        improvementAreas: { improved: CognitiveBiasType[]; persistent: CognitiveBiasType[] }
    ): EnhancedMitigationStrategy[] {
        return currentStrategies.map(strategy => {
            if (completedStrategies.includes(strategy.id)) {
                const relevantImprovements = strategy.targetBiases.filter(bias => 
                    improvementAreas.improved.includes(bias)
                ).length;
                
                const adjustmentFactor = relevantImprovements / strategy.targetBiases.length;
                const newEffectiveness = Math.min(10, strategy.effectiveness + adjustmentFactor * 2);
                
                return { ...strategy, effectiveness: newEffectiveness };
            }
            return strategy;
        });
    }

    private adjustTimeline(
        currentTimeline: MitigationPlan['timeline'],
        _completedStrategies: string[],
        improvementAreas: { improved: CognitiveBiasType[]; persistent: CognitiveBiasType[] }
    ): MitigationPlan['timeline'] {
        // If good progress, can accelerate timeline
        if (improvementAreas.improved.length > improvementAreas.persistent.length) {
            return {
                phase1: { ...currentTimeline.phase1, weeks: Math.max(1, currentTimeline.phase1.weeks - 1) },
                phase2: { ...currentTimeline.phase2, weeks: Math.max(2, currentTimeline.phase2.weeks - 1) },
                phase3: { ...currentTimeline.phase3, weeks: Math.max(4, currentTimeline.phase3.weeks - 2) }
            };
        }
        
        // If persistent issues, extend timeline
        if (improvementAreas.persistent.length > improvementAreas.improved.length) {
            return {
                phase1: { ...currentTimeline.phase1, weeks: currentTimeline.phase1.weeks + 1 },
                phase2: { ...currentTimeline.phase2, weeks: currentTimeline.phase2.weeks + 2 },
                phase3: { ...currentTimeline.phase3, weeks: currentTimeline.phase3.weeks + 4 }
            };
        }
        
        return currentTimeline;
    }
}