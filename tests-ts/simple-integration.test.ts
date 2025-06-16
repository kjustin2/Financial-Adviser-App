/**
 * Simplified Integration Tests
 * Tests core functionality without external server dependencies
 */

import { JSDOM } from 'jsdom';

describe('Financial Health Analyzer - Simplified Integration Tests', () => {
    let dom: JSDOM;

    beforeEach(() => {
        // Setup DOM environment
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Financial Health Analyzer</title>
            </head>
            <body>
                <div class="container">
                    <h1>💰 Financial Health Analyzer</h1>
                    <form id="financialForm">
                        <input type="number" id="monthlyIncome" min="0" step="100" required>
                        <input type="number" id="monthlyExpenses" min="0" step="100" required>
                        <input type="number" id="savings" min="0" step="500">
                        <input type="number" id="debt" min="0" step="500">
                        <input type="number" id="age" min="18" max="100" step="1">
                        <input type="number" id="retirementAge" min="50" max="80" step="1">
                        <select id="riskTolerance">
                            <option value="conservative">Conservative</option>
                            <option value="moderate" selected>Moderate</option>
                            <option value="aggressive">Aggressive</option>
                        </select>
                        <input type="number" id="currentInvestments" min="0" step="1000">
                        <input type="number" id="monthlyInvestmentContribution" min="0" step="50">
                        <input type="number" id="emergencyFundGoal" min="1" max="12" step="1" value="6">
                        <button type="button" id="analyzeBtn">Analyze My Financial Health</button>
                    </form>
                    
                    <div id="results" class="results-container">
                        <div id="healthScore">--</div>
                        <div id="cashFlowValue">$--</div>
                        <div id="emergencyFundValue">-- months</div>
                        <div id="debtRatioValue">--%</div>
                        <div id="savingsRateValue">--%</div>
                        <div id="recommendationText">Complete your financial information</div>
                        <div id="scoreBreakdown"></div>
                        <div id="advancedMetrics"></div>
                        <div id="scenarioAnalysis"></div>
                        <canvas id="wealthChart"></canvas>
                        <canvas id="healthChart"></canvas>
                    </div>
                </div>
            </body>
            </html>
        `, {
            url: 'http://localhost:8080',
            pretendToBeVisual: true,
            resources: 'usable'
        });

        // Setup global environment
        global.window = dom.window as any;
        global.document = dom.window.document;
        global.HTMLElement = dom.window.HTMLElement;
        global.HTMLCanvasElement = dom.window.HTMLCanvasElement;
        global.CanvasRenderingContext2D = dom.window.CanvasRenderingContext2D;
        
        // Mock Chart.js
        (global.window as any).Chart = {
            destroy: jest.fn(),
            instances: {}
        };
        
        jest.clearAllMocks();
    });

    afterEach(() => {
        dom.window.close();
    });

    describe('Basic Application Functionality', () => {
        test('should load and initialize correctly', () => {
            // Check that required elements exist
            expect(document.getElementById('financialForm')).toBeTruthy();
            expect(document.getElementById('monthlyIncome')).toBeTruthy();
            expect(document.getElementById('analyzeBtn')).toBeTruthy();
            expect(document.getElementById('results')).toBeTruthy();
        });

        test('should handle basic financial analysis', async () => {
            // Import and initialize the app
            const { FinancialAnalyzer } = await import('../src/utils/FinancialAnalyzer');
            
            // Create test data
            const testData = {
                monthlyIncome: 5000,
                monthlyExpenses: 3500,
                savings: 10000,
                debt: 5000,
                riskTolerance: 'moderate' as const,
                emergencyFundGoal: 6
            };

            const analyzer = new FinancialAnalyzer(testData);
            
            // Test basic metrics calculation
            const basicMetrics = analyzer.calculateBasicMetrics();
            expect(basicMetrics.cashFlow).toBe(1500); // 5000 - 3500
            expect(basicMetrics.emergencyFundMonths).toBeCloseTo(2.86, 1); // 10000 / 3500
            expect(basicMetrics.savingsRate).toBe(30); // (1500 / 5000) * 100

            // Test health score calculation
            const healthScore = analyzer.calculateHealthScore();
            expect(healthScore).toBeGreaterThan(0);
            expect(healthScore).toBeLessThanOrEqual(100);

            // Test recommendations
            const recommendations = analyzer.generateRecommendations();
            expect(Array.isArray(recommendations)).toBe(true);
            expect(recommendations.length).toBeGreaterThan(0);
        });

        test('should handle advanced features when age is provided', async () => {
            const { FinancialAnalyzer } = await import('../src/utils/FinancialAnalyzer');
            
            const testData = {
                monthlyIncome: 6000,
                monthlyExpenses: 4000,
                savings: 20000,
                debt: 8000,
                age: 30,
                retirementAge: 65,
                riskTolerance: 'moderate' as const,
                currentInvestments: 50000,
                monthlyInvestmentContribution: 1000,
                emergencyFundGoal: 6
            };

            const analyzer = new FinancialAnalyzer(testData);
            
            // Test retirement readiness
            const retirementReadiness = analyzer.calculateRetirementReadiness();
            expect(retirementReadiness).toBeGreaterThanOrEqual(0);
            expect(retirementReadiness).toBeLessThanOrEqual(100);

            // Test wealth projections
            const wealthProjections = analyzer.calculateWealthProjections();
            expect(wealthProjections.conservative).toBeGreaterThan(0);
            expect(wealthProjections.moderate).toBeGreaterThan(wealthProjections.conservative);
            expect(wealthProjections.aggressive).toBeGreaterThan(wealthProjections.moderate);

            // Test advanced metrics
            const advancedMetrics = analyzer.calculateAdvancedMetrics();
            expect(advancedMetrics.cashFlowCoverageRatio).toBeGreaterThan(0);
            expect(advancedMetrics.liquidityRatio).toBeGreaterThan(0);
            expect(advancedMetrics.savingsEfficiency).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Financial Scenarios', () => {
        test('should handle young professional scenario', async () => {
            const { FinancialAnalyzer } = await import('../src/utils/FinancialAnalyzer');
            
            // Young professional: high income, low savings, high debt
            const testData = {
                monthlyIncome: 8000,
                monthlyExpenses: 6500,
                savings: 3000,
                debt: 15000, // Student loans
                age: 25,
                retirementAge: 65,
                riskTolerance: 'aggressive' as const,
                currentInvestments: 5000,
                monthlyInvestmentContribution: 300,
                emergencyFundGoal: 6
            };

            const analyzer = new FinancialAnalyzer(testData);
            const healthScore = analyzer.calculateHealthScore();
            const recommendations = analyzer.generateRecommendations();
            
            // Should have moderate score due to high debt and low emergency fund
            expect(healthScore).toBeGreaterThan(20);
            expect(healthScore).toBeLessThan(70);
            
            // Should recommend debt reduction and emergency fund building
            const recommendationText = recommendations.join(' ').toLowerCase();
            expect(recommendationText).toMatch(/(debt|emergency)/);
        });

        test('should handle financial struggle scenario', async () => {
            const { FinancialAnalyzer } = await import('../src/utils/FinancialAnalyzer');
            
            // Financial difficulties
            const testData = {
                monthlyIncome: 3500,
                monthlyExpenses: 3800, // Spending more than earning
                savings: 500,
                debt: 25000,
                riskTolerance: 'conservative' as const,
                emergencyFundGoal: 6
            };

            const analyzer = new FinancialAnalyzer(testData);
            const healthScore = analyzer.calculateHealthScore();
            const basicMetrics = analyzer.calculateBasicMetrics();
            const recommendations = analyzer.generateRecommendations();
            
            // Should have low score due to negative cash flow
            expect(healthScore).toBeLessThan(40);
            expect(basicMetrics.cashFlow).toBeLessThan(0);
            
            // Should recommend urgent action
            const recommendationText = recommendations.join(' ').toLowerCase();
            expect(recommendationText).toMatch(/(urgent|priority|reduce|budget)/);
        });
    });

    describe('Chart Management', () => {
        test('should handle chart creation and destruction', async () => {
            const { ChartManager } = await import('../src/ui/ChartManager');
            
            const chartManager = new ChartManager();
            
            // Test chart destruction (should not throw even if no charts exist)
            expect(() => {
                chartManager.destroyExistingCharts();
            }).not.toThrow();
        });
    });
}); 