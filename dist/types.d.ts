/**
 * Comprehensive Financial Health Analyzer - Type Definitions
 * Based on Financial Health Network 2024 research and OCC Vital Signs framework
 */
export interface PersonalInfo {
    age: number;
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
    dependents: number;
    state: string;
    employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'retired' | 'student';
    employmentTenure: number;
    healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
    healthInsurance: boolean;
    lifeInsurance: boolean;
    shortTermDisability: boolean;
    longTermDisability: boolean;
}
export interface IncomeData {
    primarySalary: number;
    secondaryIncome: number;
    businessIncome: number;
    investmentIncome: number;
    rentalIncome: number;
    benefitsIncome: number;
    otherIncome: number;
    incomeGrowthRate: number;
    incomeVariability: 'stable' | 'somewhat-variable' | 'highly-variable';
    effectiveTaxRate: number;
}
export interface ExpenseData {
    housing: number;
    utilities: number;
    insurance: number;
    loanPayments: number;
    childcare: number;
    food: number;
    transportation: number;
    healthcare: number;
    clothing: number;
    personalCare: number;
    entertainment: number;
    diningOut: number;
    hobbies: number;
    subscriptions: number;
    shopping: number;
    travel: number;
    creditCardPayments: number;
    studentLoanPayments: number;
    otherDebtPayments: number;
}
export interface AssetData {
    checking: number;
    savings: number;
    moneyMarket: number;
    emergencyFund: number;
    employer401k: number;
    traditionalIRA: number;
    rothIRA: number;
    brokerageAccounts: number;
    stocks: number;
    bonds: number;
    mutualFunds: number;
    primaryResidence: number;
    investmentProperties: number;
    cryptocurrency: number;
    preciousMetals: number;
    collectibles: number;
    businessEquity: number;
    otherAssets: number;
}
export interface LiabilityData {
    mortgageBalance: number;
    homeEquityLoan: number;
    autoLoans: number;
    securedCreditLines: number;
    creditCardDebt: number;
    personalLoans: number;
    studentLoans: number;
    medicalDebt: number;
    businessLoans: number;
    businessCreditLines: number;
    taxDebt: number;
    legalJudgments: number;
    otherDebt: number;
    creditScore: number;
    totalCreditLimit: number;
}
export interface InsuranceData {
    healthInsurance: boolean;
    healthDeductible: number;
    healthOutOfPocketMax: number;
    lifeInsurance: boolean;
    lifeCoverageAmount: number;
    shortTermDisability: boolean;
    longTermDisability: boolean;
    disabilityCoveragePercent: number;
    homeInsurance: boolean;
    autoInsurance: boolean;
    umbrellaPolicy: boolean;
    insuranceConfidence: 'very-confident' | 'somewhat-confident' | 'not-confident';
}
export interface FinancialGoals {
    emergencyFundTarget: number;
    debtPayoffGoal: boolean;
    majorPurchaseAmount: number;
    homeDownPayment: number;
    educationFunding: number;
    careerChangeBuffer: number;
    retirementAge: number;
    retirementIncomeNeeded: number;
    legacyGoalAmount: number;
    retirementConfidence: 'very-confident' | 'somewhat-confident' | 'not-confident';
    longTermGoalConfidence: 'very-confident' | 'somewhat-confident' | 'not-confident';
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    investmentExperience: 'beginner' | 'intermediate' | 'advanced';
}
export interface FinancialBehaviors {
    billPaymentReliability: 'always-on-time' | 'usually-on-time' | 'sometimes-late' | 'often-late';
    budgetingMethod: 'detailed-budget' | 'simple-tracking' | 'mental-budget' | 'no-budget';
    financialPlanningEngagement: 'actively-plan' | 'occasionally-plan' | 'rarely-plan' | 'never-plan';
    automaticSavings: boolean;
    monthlyInvestmentContribution: number;
    emergencyFundPriority: 'high' | 'medium' | 'low';
    impulseSpendingFrequency: 'never' | 'rarely' | 'sometimes' | 'often';
    expenseTrackingMethod: 'detailed' | 'casual' | 'none';
}
export interface UserFinancialData {
    personalInfo: PersonalInfo;
    income: IncomeData;
    expenses: ExpenseData;
    assets: AssetData;
    liabilities: LiabilityData;
    insurance: InsuranceData;
    goals: FinancialGoals;
    behaviors: FinancialBehaviors;
}
export interface FinancialMetric {
    title: string;
    value: string;
    numericValue?: number;
    description: string;
    status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    benchmark?: string;
    improvement?: string;
}
export interface HealthIndicator {
    name: string;
    score: number;
    status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    weight: number;
    metrics: FinancialMetric[];
    recommendations: string[];
    explanation: string;
}
export interface ScenarioAnalysis {
    scenario: string;
    probability: string;
    impact: 'High' | 'Medium' | 'Low';
    description: string;
    timeToRecover: string;
    recommendations: string[];
}
export interface WealthProjection {
    scenario: string;
    timeframe: string;
    projectedValue: number;
    monthlyContribution: number;
    assumptions: string;
}
export interface Recommendation {
    id: string;
    category: 'emergency' | 'debt' | 'savings' | 'investment' | 'insurance' | 'planning';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    actionSteps: string[];
    timeframe: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
    impactLevel: 'high' | 'medium' | 'low';
    estimatedCost?: number;
    potentialSavings?: number;
}
export interface ComprehensiveAnalysisResult {
    overallHealthScore: number;
    healthLevel: 'excellent' | 'good' | 'fair' | 'limited' | 'critical';
    healthIndicators: HealthIndicator[];
    keyMetrics: {
        monthlyCashFlow: number;
        emergencyFundMonths: number;
        debtToIncomeRatio: number;
        savingsRate: number;
        creditUtilization: number;
        netWorth: number;
        liquidityRatio: number;
        assetAllocationScore: number;
    };
    liquidityAnalysis: FinancialMetric[];
    debtAnalysis: FinancialMetric[];
    investmentAnalysis: FinancialMetric[];
    insuranceAnalysis: FinancialMetric[];
    wealthProjections: WealthProjection[];
    scenarioAnalysis: ScenarioAnalysis[];
    prioritizedRecommendations: Recommendation[];
    peerBenchmarks: {
        ageGroup: string;
        incomeGroup: string;
        netWorthPercentile: number;
        savingsRatePercentile: number;
        debtRatioPercentile: number;
    };
    detailedInsights: any;
    financialRatios: any;
    riskAssessment: any;
    goalAnalysis: any;
}
export interface FormStep {
    id: string;
    title: string;
    description: string;
    fields: FormField[];
    isComplete: boolean;
    validationErrors: string[];
}
export interface FormField {
    id: string;
    type: 'number' | 'select' | 'boolean' | 'text';
    label: string;
    description?: string;
    required: boolean;
    value: any;
    options?: {
        value: string;
        label: string;
    }[];
    validation?: {
        min?: number;
        max?: number;
        step?: number;
    };
}
export interface ChartData {
    type: 'bar' | 'line' | 'pie' | 'radar' | 'scatter';
    title: string;
    data: any[];
    options?: any;
}
export interface DOMElements {
    app: HTMLElement;
    formContainer: HTMLElement;
    resultsContainer: HTMLElement;
    loadingIndicator: HTMLElement;
    errorMessage: HTMLElement;
    formSteps: HTMLElement;
    progressBar: HTMLElement;
    currentStep: HTMLElement;
    navigationButtons: HTMLElement;
    healthScoreSummary: HTMLElement;
    indicatorsGrid: HTMLElement;
    metricsSection: HTMLElement;
    chartsSection: HTMLElement;
    recommendationsSection: HTMLElement;
    peerComparison: HTMLElement;
    scenarioInputs: HTMLElement;
    exportButton: HTMLElement;
    saveButton: HTMLElement;
}
export interface BenchmarkData {
    ageGroups: {
        [key: string]: any;
    };
    incomeGroups: {
        [key: string]: any;
    };
    industryAverages: {
        [key: string]: number;
    };
    targetRatios: {
        [key: string]: number;
    };
}
export interface EducationalContent {
    topic: string;
    title: string;
    content: string;
    links: {
        text: string;
        url: string;
    }[];
    applicableScenarios: string[];
}
export interface SavedSession {
    id: string;
    timestamp: Date;
    userData: Partial<UserFinancialData>;
    analysisResult?: ComprehensiveAnalysisResult;
    version: string;
}
export interface SimulationConfig {
    iterations: number;
    seed?: number;
    onProgress?: (progress: number) => void;
}
export interface InvestmentScenario {
    initialValue: number;
    expectedReturn: number;
    volatility: number;
    timeHorizon: number;
    inflationRate?: number;
    targetValue: number;
    marketShocks?: Array<{
        probability: number;
        impact: number;
    }>;
}
export interface SimulationStats {
    mean: number;
    median: number;
    standardDeviation: number;
    variance: number;
    minimum: number;
    maximum: number;
    skewness: number;
    kurtosis: number;
    percentiles: {
        p5: number;
        p10: number;
        p25: number;
        p75: number;
        p90: number;
        p95: number;
    };
}
export interface SimulationResult {
    scenario: InvestmentScenario;
    iterations: number;
    executionTime: number;
    results: number[];
    statistics: SimulationStats;
    goalSuccessProbability: number;
    confidenceIntervals: Array<{
        level: number;
        lower: number;
        upper: number;
    }>;
    metadata: {
        seed?: number;
        timestamp: string;
        engineVersion: string;
    };
}
export interface EconomicScenario {
    id: string;
    name: string;
    description: string;
    category: 'recession' | 'inflation' | 'market-crash' | 'bull-market' | 'stagflation' | 'recovery' | 'normal';
    probability: number;
    duration: {
        min: number;
        max: number;
    };
    parameters: EconomicParameters;
    historicalPrecedent?: string;
    tags: string[];
}
export interface EconomicParameters {
    marketReturn: {
        mean: number;
        volatility: number;
        skew?: number;
    };
    inflationRate: {
        mean: number;
        volatility: number;
        min: number;
        max: number;
    };
    interestRates: {
        shortTerm: number;
        longTerm: number;
        federalFunds: number;
    };
    gdpGrowth: {
        mean: number;
        volatility: number;
    };
    unemployment: {
        rate: number;
        trend: 'rising' | 'falling' | 'stable';
    };
    marketShocks?: Array<{
        probability: number;
        impact: number;
        duration: number;
        sector?: string;
    }>;
    currencyVolatility: number;
    internationalExposure: number;
}
export interface ScenarioTesting {
    scenarios: EconomicScenario[];
    baselineScenario: string;
    monteCarlo: {
        iterations: number;
        timeHorizon: number;
        confidenceLevel: number;
    };
}
export interface ScenarioResult {
    scenarioId: string;
    simulationResult: SimulationResult;
    riskMetrics: {
        valueAtRisk: number;
        conditionalVaR: number;
        maxDrawdown: number;
        sharpeRatio: number;
        sortinoRatio: number;
        volatility: number;
    };
    stressTestResults: {
        worstCase: number;
        bestCase: number;
        medianCase: number;
        probabilityOfLoss: number;
    };
    comparisonToBaseline: {
        returnDifference: number;
        riskDifference: number;
        probabilityOutperformance: number;
    };
}
export interface ScenarioComparison {
    scenarios: ScenarioResult[];
    ranking: {
        byReturn: string[];
        byRisk: string[];
        byRiskAdjustedReturn: string[];
    };
    correlationMatrix: number[][];
    diversificationBenefit: number;
    recommendation: {
        conservative: string;
        moderate: string;
        aggressive: string;
    };
}
export interface ParameterDrift {
    parameter: string;
    driftRate: number;
    volatility: number;
    bounds: {
        min: number;
        max: number;
    };
    meanReversion: {
        enabled: boolean;
        rate: number;
        target: number;
    };
}
export interface RegimeChange {
    fromScenario: string;
    toScenario: string;
    transitionProbability: number;
    triggers: {
        timeThreshold?: number;
        parameterThresholds?: Array<{
            parameter: string;
            threshold: number;
            comparison: 'greater' | 'less' | 'equal';
        }>;
        marketConditions?: Array<'bull' | 'bear' | 'volatile' | 'sideways'>;
    };
    transitionSpeed: 'immediate' | 'gradual' | 'smooth';
    transitionDuration?: number;
}
export interface ScenarioTransition {
    id: string;
    timestamp: Date;
    fromScenario: string;
    toScenario: string;
    reason: string;
    transitionMethod: 'immediate' | 'gradual' | 'smooth';
    completionProgress: number;
    parametersSnapshot: EconomicParameters;
}
export interface TimeBasedScenarioConfig {
    enableParameterDrift: boolean;
    enableRegimeChanges: boolean;
    updateFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    parameterDrifts: ParameterDrift[];
    regimeRules: RegimeChange[];
    historicalContextWindow: number;
    smoothingWindow: number;
}
export interface HistoricalParameterSnapshot {
    timestamp: Date;
    scenarioId: string;
    parameters: EconomicParameters;
    marketCondition: 'bull' | 'bear' | 'sideways' | 'volatile';
    regimeAge: number;
}
export interface ScenarioEvolution {
    currentScenario: EconomicScenario;
    currentParameters: EconomicParameters;
    lastUpdate: Date;
    regimeAge: number;
    historicalSnapshots: HistoricalParameterSnapshot[];
    activeTransition: ScenarioTransition | null;
    parameterTrends: Array<{
        parameter: string;
        trend: 'increasing' | 'decreasing' | 'stable';
        rate: number;
        confidence: number;
    }>;
}
export interface TimeBasedScenarioResult extends ScenarioResult {
    timeBasedMetrics: {
        parameterStability: number;
        regimeChangeCount: number;
        averageRegimeDuration: number;
        parameterDriftImpact: number;
        adaptabilityScore: number;
    };
    evolutionHistory: HistoricalParameterSnapshot[];
    transitionHistory: ScenarioTransition[];
}
export interface VolatilityMetrics {
    basic: {
        historicalVolatility: number;
        realizedVolatility: number;
        impliedVolatility: number;
    };
    advanced: {
        volatilityOfVolatility: number;
        volatilityClustering: number;
        downSideVolatility: number;
        upSideVolatility: number;
    };
    timeBased: {
        intraday: number;
        monthly: number;
        quarterly: number;
        annual: number;
    };
    riskMetrics: {
        volatilitySkew: number;
        volatilityKurtosis: number;
        correlationBreakdown: number;
    };
}
export interface VolatilityAnalysis {
    scenarios: Array<{
        scenarioId: string;
        scenarioName: string;
        metrics: VolatilityMetrics;
    }>;
    comparison: {
        scenarios: string[];
        historicalVolatilityRange: {
            min: number;
            max: number;
            mean: number;
        };
        realizedVolatilityRange: {
            min: number;
            max: number;
            mean: number;
        };
        highestVolatilityScenario: string;
        lowestVolatilityScenario: string;
    };
    regimeAnalysis: {
        lowVolatility: {
            threshold: number;
            scenarios: string[];
        };
        mediumVolatility: {
            range: number[];
            scenarios: string[];
        };
        highVolatility: {
            threshold: number;
            scenarios: string[];
        };
    };
    stressTestMetrics: {
        stressVolatilityMean: number;
        normalVolatilityMean: number;
        volatilityMultiplier: number;
    } | null;
    marketShockAnalysis: {
        scenarios: Array<{
            scenarioId: string;
            shockCount: number;
            totalShockImpact: number;
            preShockVolatility: number;
            postShockVolatility: number;
            volatilityIncrease: number;
        }>;
        averageVolatilityIncrease: number;
    };
}
export type CognitiveBiasType = 'overconfidence' | 'loss-aversion' | 'confirmation-bias' | 'anchoring' | 'availability-heuristic' | 'mental-accounting' | 'herd-mentality' | 'recency-bias' | 'sunk-cost-fallacy' | 'framing-effect';
export interface BiasDetectionResult {
    biasType: CognitiveBiasType;
    severity: 'low' | 'moderate' | 'high' | 'severe';
    confidence: number;
    indicators: string[];
    evidence: {
        behavioral: string[];
        financial: string[];
        survey: string[];
    };
    description: string;
    prevalence: number;
}
export interface PsychologyProfile {
    dominantBiases: CognitiveBiasType[];
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    decisionMakingStyle: 'rational' | 'intuitive' | 'mixed';
    emotionalMoney: 'security-seeker' | 'status-spender' | 'saver' | 'avoider';
    timeOrientation: 'present-focused' | 'future-focused' | 'balanced';
    financialPersonality: string;
}
export interface BehaviorPattern {
    pattern: string;
    frequency: 'rare' | 'occasional' | 'frequent' | 'habitual';
    intensity: number;
    triggers: string[];
    outcomes: string[];
    relatedBiases: CognitiveBiasType[];
}
export interface BiasAssessmentQuestion {
    id: string;
    category: CognitiveBiasType;
    question: string;
    type: 'multiple-choice' | 'scale' | 'scenario' | 'ranking';
    options?: string[];
    scenario?: string;
    weight: number;
}
export interface BiasAssessmentResponse {
    questionId: string;
    response: string | number | string[];
    timeSpent: number;
    confidence: number;
}
export interface BiasAssessmentResult {
    overallScore: number;
    biasProfile: BiasDetectionResult[];
    psychologyProfile: PsychologyProfile;
    behaviorPatterns: BehaviorPattern[];
    riskFactors: string[];
    strengths: string[];
}
export interface MitigationStrategy {
    biasType: CognitiveBiasType;
    strategy: string;
    techniques: string[];
    tools: string[];
    timeframe: 'immediate' | 'short-term' | 'long-term';
    difficulty: 'easy' | 'moderate' | 'challenging';
    effectiveness: number;
    personalizedTips: string[];
}
export interface EnhancedMitigationStrategy {
    id: string;
    title: string;
    description: string;
    targetBiases: CognitiveBiasType[];
    category: 'cognitive' | 'behavioral' | 'environmental' | 'social' | 'technological';
    technique: string;
    implementation: {
        immediateActions: string[];
        gradualChanges: string[];
        toolsRequired: string[];
        timeframe: string;
    };
    effectiveness: number;
    difficulty: 'low' | 'medium' | 'high';
    personalizedApproach: string;
    evidenceBase: string;
    successMetrics: string[];
    relatedStrategies: string[];
}
export interface MitigationPlan {
    userId?: string;
    generatedAt: Date;
    overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
    priorityBiases: CognitiveBiasType[];
    strategies: EnhancedMitigationStrategy[];
    timeline: {
        phase1: {
            weeks: number;
            focus: string;
            strategies: string[];
        };
        phase2: {
            weeks: number;
            focus: string;
            strategies: string[];
        };
        phase3: {
            weeks: number;
            focus: string;
            strategies: string[];
        };
    };
    trackingRecommendations: {
        metrics: string[];
        frequency: string;
        methods: string[];
    };
    expectedOutcomes: {
        shortTerm: string[];
        mediumTerm: string[];
        longTerm: string[];
    };
}
export interface DecisionAnalysis {
    scenario: string;
    optimalChoice: string;
    userChoice: string;
    biasInfluence: {
        biasType: CognitiveBiasType;
        impact: number;
        explanation: string;
    }[];
    rationalityScore: number;
    improvementSuggestions: string[];
}
export interface BehavioralFinanceAnalysis {
    assessmentResult: BiasAssessmentResult;
    mitigationStrategies: MitigationStrategy[];
    decisionAnalyses: DecisionAnalysis[];
    progressTracking: {
        initialScore: number;
        currentScore: number;
        improvement: number;
        milestones: Array<{
            date: string;
            achievement: string;
            impact: number;
        }>;
    };
    recommendations: {
        immediate: string[];
        shortTerm: string[];
        longTerm: string[];
    };
}
export interface ProspectTheoryParams {
    lossAversion: number;
    probabilityWeighting: {
        gains: (p: number) => number;
        losses: (p: number) => number;
    };
    valueFunction: {
        gains: (x: number) => number;
        losses: (x: number) => number;
    };
}
export interface BehavioralMetrics {
    rationalityIndex: number;
    biasResistanceScore: number;
    emotionalVolatility: number;
    decisionConsistency: number;
    riskPerceptionAccuracy: number;
    overconfidenceLevel: number;
}
export interface UserBehaviorData {
    tradingPatterns: {
        frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
        portfolioTurnover: number;
        marketTimingAttempts: number;
        diversificationLevel: number;
    };
    informationSeeking: {
        sourcesUsed: string[];
        frequencyOfResearch: number;
        newsReactionTime: number;
        expertAdviceReliance: number;
    };
    riskBehavior: {
        actualRiskTolerance: number;
        statedRiskTolerance: number;
        riskDiscrepancy: number;
        panicSellingHistory: boolean;
        fomoBuyingHistory: boolean;
    };
    planningBehavior: {
        budgetingConsistency: number;
        goalSettingClarity: number;
        longTermThinking: number;
        impulsiveDecisions: number;
    };
}
export interface BehavioralVisualization {
    biasRadarChart: {
        biases: CognitiveBiasType[];
        scores: number[];
        benchmarks: number[];
    };
    biasImpactAnalysis: {
        impacts: Array<{
            biasType: CognitiveBiasType;
            estimatedImpact: number;
            severity: 'low' | 'moderate' | 'high' | 'severe';
            confidence: number;
        }>;
        totalImpact: number;
        netWorth: number;
        impactAsPercentage: number;
    };
    decisionHeatmap: {
        scenarios: string[];
        rationalityScores: number[];
        biasInfluences: number[][];
    };
    progressTimeline: {
        dates: string[];
        scores: number[];
        milestones: string[];
    };
    riskPerceptionChart: {
        perceivedRisk: number[];
        actualRisk: number[];
        scenarios: string[];
    };
}
export interface BehavioralFinanceConfig {
    assessmentSettings: {
        questionCount: number;
        timeLimit: number;
        adaptiveQuestioning: boolean;
        includeScenarios: boolean;
    };
    analysisSettings: {
        biasThresholds: {
            [key in CognitiveBiasType]: number;
        };
        confidenceThreshold: number;
        enableProspectTheory: boolean;
        enablePersonalization: boolean;
    };
    interventionSettings: {
        nudgeFrequency: 'never' | 'low' | 'medium' | 'high';
        interventionTiming: 'immediate' | 'delayed' | 'scheduled';
        gamificationEnabled: boolean;
        progressTracking: boolean;
    };
}
/**
 * Market Data Point Interface
 */
export interface MarketDataPoint {
    timestamp: Date;
    marketPrice: number;
    volatility: number;
    volume: number;
    marketReturn: number;
    inflationRate: number;
    interestRates: {
        shortTerm: number;
        longTerm: number;
        federalFunds: number;
    };
    economicIndicators: {
        gdpGrowth: number;
        unemployment: number;
        currencyVolatility: number;
    };
    scenarioId: string;
    marketCondition: 'bull' | 'bear' | 'sideways' | 'volatile';
}
export interface CacheEntry<T = any> {
    key: string;
    data: T;
    timestamp: Date;
    expirationTime?: Date;
    metadata: {
        version: string;
        dataSize: number;
        source: string;
        tags: string[];
    };
}
export interface CacheStats {
    totalEntries: number;
    totalSize: number;
    hitRate: number;
    missRate: number;
    oldestEntry: Date;
    newestEntry: Date;
    expiredEntries: number;
}
export interface StorageOptions {
    maxSize: number;
    maxAge: number;
    compression: boolean;
    encryption: boolean;
    autoCleanup: boolean;
    cleanupInterval: number;
}
export interface CacheManager {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, data: T, options?: Partial<StorageOptions>): Promise<void>;
    delete(key: string): Promise<boolean>;
    clear(): Promise<void>;
    has(key: string): Promise<boolean>;
    getStats(): Promise<CacheStats>;
    cleanup(): Promise<number>;
}
export interface SimulationCacheKey {
    scenarioId: string;
    investmentParams: string;
    config: string;
    timestamp?: string;
}
export interface CachedSimulationResult extends CacheEntry<SimulationResult> {
    key: string;
    data: SimulationResult;
    metadata: {
        version: string;
        dataSize: number;
        source: 'monte-carlo' | 'scenario-engine' | 'time-based-engine';
        tags: string[];
        simulationParams: {
            iterations: number;
            timeHorizon: number;
            scenarioId: string;
        };
    };
}
export interface CachedScenarioResult extends CacheEntry<ScenarioResult> {
    key: string;
    data: ScenarioResult;
    metadata: {
        version: string;
        dataSize: number;
        source: 'scenario-analysis';
        tags: string[];
        analysisParams: {
            scenarioId: string;
            baseInvestment: string;
        };
    };
}
export interface CachedMarketData extends CacheEntry<MarketDataPoint[]> {
    key: string;
    data: MarketDataPoint[];
    metadata: {
        version: string;
        dataSize: number;
        source: 'dynamic-market-service';
        tags: string[];
        marketParams: {
            scenarioId: string;
            startDate: string;
            endDate: string;
            frequency: string;
        };
    };
}
export interface CachedUserAnalysis extends CacheEntry<ComprehensiveAnalysisResult> {
    key: string;
    data: ComprehensiveAnalysisResult;
    metadata: {
        version: string;
        dataSize: number;
        source: 'user-analysis';
        tags: string[];
        userParams: {
            userId?: string;
            dataHash: string;
            analysisVersion: string;
        };
    };
}
export interface CachedBehaviorAnalysis extends CacheEntry<BehavioralFinanceAnalysis> {
    key: string;
    data: BehavioralFinanceAnalysis;
    metadata: {
        version: string;
        dataSize: number;
        source: 'behavioral-analysis';
        tags: string[];
        behaviorParams: {
            userId?: string;
            assessmentHash: string;
            analysisTimestamp: string;
        };
    };
}
export interface DataTypeConfig {
    maxAge: number;
    maxEntries: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    compressionLevel: number;
    autoRefresh: boolean;
    refreshThreshold: number;
}
export interface CacheConfiguration {
    global: StorageOptions;
    dataTypes: {
        simulations: DataTypeConfig;
        scenarios: DataTypeConfig;
        marketData: DataTypeConfig;
        userAnalysis: DataTypeConfig;
        behaviorAnalysis: DataTypeConfig;
        temporaryResults: DataTypeConfig;
    };
}
export interface CacheEvent {
    type: 'hit' | 'miss' | 'set' | 'delete' | 'expire' | 'cleanup';
    key: string;
    timestamp: Date;
    metadata?: any;
}
export interface CacheMetrics {
    operations: {
        gets: number;
        sets: number;
        deletes: number;
        hits: number;
        misses: number;
    };
    performance: {
        averageGetTime: number;
        averageSetTime: number;
        averageDeleteTime: number;
    };
    storage: {
        currentSize: number;
        maxSize: number;
        utilizationPercent: number;
        fragmentationPercent: number;
    };
    lifecycle: {
        totalExpiredEntries: number;
        totalCleanupOperations: number;
        lastCleanup: Date;
    };
}
//# sourceMappingURL=types.d.ts.map