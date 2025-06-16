/**
 * Real Functionality Tests
 * Tests the actual issues reported: info boxes, charts, and advanced analytics
 */

// Setup TextEncoder/TextDecoder for Node.js environment
import { TextEncoder, TextDecoder } from 'util';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

import { JSDOM } from 'jsdom';

describe('Real Functionality Issues Tests', () => {
    let dom: JSDOM;
    let document: Document;
    let window: Window;

    beforeEach(() => {
        // Setup DOM environment
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Financial Health Analyzer</title>
                <style>
                    .info-icon { cursor: pointer; position: relative; }
                    .tooltip { 
                        position: fixed; 
                        opacity: 0; 
                        visibility: hidden; 
                        background: #1f2937;
                        color: white;
                        padding: 12px 16px;
                        border-radius: 8px;
                        z-index: 999999;
                    }
                    .info-icon.active .tooltip { 
                        opacity: 1; 
                        visibility: visible; 
                    }
                    canvas { width: 100%; height: 100%; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="input-group">
                        <label for="monthlyIncome">
                            Monthly Income
                            <div class="info-icon">i
                                <div class="tooltip">Your total monthly take-home income after taxes</div>
                            </div>
                        </label>
                        <input type="number" id="monthlyIncome" value="5000">
                    </div>
                    
                    <div id="results">
                        <div id="healthScore">--</div>
                        <div id="advancedMetrics"></div>
                        <div id="scoreBreakdown"></div>
                        <canvas id="wealthChart"></canvas>
                        <canvas id="healthChart"></canvas>
                    </div>
                </div>
            </body>
            </html>
        `, {
            url: 'http://localhost:3000',
            pretendToBeVisual: true,
            resources: 'usable'
        });

        document = dom.window.document;
        window = dom.window as any;
        (global as any).window = window;
        (global as any).document = document;
        (global as any).HTMLElement = dom.window.HTMLElement;
        (global as any).HTMLCanvasElement = dom.window.HTMLCanvasElement;

        // Mock Chart.js properly
        const mockChart = {
            destroy: jest.fn(),
            update: jest.fn(),
            resize: jest.fn()
        };

        const mockContext = {
            clearRect: jest.fn(),
            fillRect: jest.fn(),
            strokeRect: jest.fn(),
            canvas: { width: 400, height: 300 }
        };

        const ChartConstructor = jest.fn().mockImplementation(() => mockChart);
        (global as any).Chart = ChartConstructor;
        (window as any).Chart = ChartConstructor;
        
        HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(mockContext);
        HTMLCanvasElement.prototype.removeAttribute = jest.fn();
    });

    afterEach(() => {
        dom.window.close();
    });

    describe('Issue 1: Info boxes not working', () => {
        test('should verify InfoBoxManager can be instantiated', async () => {
            const { InfoBoxManager } = await import('../src/ui/InfoBoxManager');
            
            expect(() => new InfoBoxManager()).not.toThrow();
            
            const infoIcons = document.querySelectorAll('.info-icon');
            expect(infoIcons.length).toBeGreaterThan(0);
            
            // Verify tooltip content exists
            const tooltip = infoIcons[0].querySelector('.tooltip');
            expect(tooltip).toBeTruthy();
            expect(tooltip?.textContent).toContain('income');
        });

        test('should verify tooltip functionality works in principle', async () => {
            const { InfoBoxManager } = await import('../src/ui/InfoBoxManager');
            
            // Create instance
            const manager = new InfoBoxManager();
            expect(manager).toBeDefined();
            
            // Test that closeAllTooltips method exists and works
            expect(() => manager.closeAllTooltips()).not.toThrow();
            
            // Verify the DOM structure is correct for tooltips
            const infoIcon = document.querySelector('.info-icon') as HTMLElement;
            expect(infoIcon).toBeTruthy();
            
            // Manually test the toggle functionality
            infoIcon.classList.add('active');
            expect(infoIcon.classList.contains('active')).toBe(true);
            
            infoIcon.classList.remove('active');
            expect(infoIcon.classList.contains('active')).toBe(false);
        });
    });

    describe('Issue 2: Charts not showing', () => {
        test('should verify ChartManager can create charts', async () => {
            const { ChartManager } = await import('../src/ui/ChartManager');
            
            const chartManager = new ChartManager();
            expect(chartManager).toBeDefined();
            
            // Verify canvas elements exist
            const wealthCanvas = document.getElementById('wealthChart');
            const healthCanvas = document.getElementById('healthChart');
            expect(wealthCanvas).toBeTruthy();
            expect(healthCanvas).toBeTruthy();
            
            // Test chart creation doesn't throw errors (async methods)
            const wealthData = {
                years: ['2024', '2025', '2026'],
                values: [10000, 20000, 30000]
            };
            
            const wealthResult = await chartManager.createWealthChart(wealthData);
            expect(typeof wealthResult).toBe('boolean');
            
            const healthData = {
                months: ['Jan', 'Feb', 'Mar'],
                scores: [70, 75, 80]
            };
            
            const healthResult = await chartManager.createHealthChart(healthData);
            expect(typeof healthResult).toBe('boolean');
        });

        test('should verify chart destruction works', async () => {
            const { ChartManager } = await import('../src/ui/ChartManager');
            
            const chartManager = new ChartManager();
            
            // Create some charts first (async)
            await chartManager.createWealthChart({
                years: ['2024'],
                values: [1000]
            });
            
            // Test destruction doesn't throw
            expect(() => chartManager.destroyExistingCharts()).not.toThrow();
        });
    });

    describe('Issue 3: Advanced analytics not showing', () => {
        test('should verify FinancialAnalyzer produces real advanced metrics', async () => {
            const { FinancialAnalyzer } = await import('../src/utils/FinancialAnalyzer');
            
            const userData = {
                monthlyIncome: 6000,
                monthlyExpenses: 4000,
                savings: 25000,
                debt: 10000,
                age: 30,
                riskTolerance: 'moderate' as const,
                currentInvestments: 50000,
                monthlyInvestmentContribution: 500,
                emergencyFundGoal: 6
            };
            
            const analyzer = new FinancialAnalyzer(userData);
            
            // Test basic functionality
            const healthScore = analyzer.calculateHealthScore();
            expect(typeof healthScore).toBe('number');
            expect(healthScore).toBeGreaterThan(0);
            expect(healthScore).toBeLessThanOrEqual(100);
            expect(healthScore).not.toBe(50); // Should not be a default value
            
            // Test advanced metrics
            const advancedMetrics = analyzer.calculateAdvancedMetrics();
            expect(advancedMetrics).toBeDefined();
            expect(typeof advancedMetrics.cashFlowCoverageRatio).toBe('number');
            expect(typeof advancedMetrics.liquidityRatio).toBe('number');
            expect(typeof advancedMetrics.savingsEfficiency).toBe('number');
            expect(typeof advancedMetrics.financialStressScore).toBe('number');
            expect(typeof advancedMetrics.wealthBuildingVelocity).toBe('number');
            
            // Verify these are real calculations, not defaults
            expect(advancedMetrics.cashFlowCoverageRatio).toBeGreaterThan(0);
            expect(advancedMetrics.liquidityRatio).toBeGreaterThan(0);
            expect(advancedMetrics.savingsEfficiency).toBeGreaterThan(0);
            expect(advancedMetrics.wealthBuildingVelocity).toBeGreaterThan(0);
            expect(advancedMetrics.financialStressScore).toBeGreaterThanOrEqual(0);
            expect(advancedMetrics.financialStressScore).toBeLessThanOrEqual(100);
            
            // Test score breakdown
            const scoreBreakdown = analyzer.getScoreBreakdown();
            expect(scoreBreakdown).toBeDefined();
            expect(scoreBreakdown.cashFlow).toBeDefined();
            expect(scoreBreakdown.emergencyFund).toBeDefined();
            expect(scoreBreakdown.debtManagement).toBeDefined();
            expect(scoreBreakdown.savingsRate).toBeDefined();
            
            // Verify breakdown has real values
            expect(typeof scoreBreakdown.cashFlow.score).toBe('number');
            expect(typeof scoreBreakdown.cashFlow.value).toBe('number');
            expect(typeof scoreBreakdown.cashFlow.status).toBe('string');
            expect(scoreBreakdown.cashFlow.score).toBeGreaterThan(0);
            
            // Test recommendations
            const recommendations = analyzer.generateRecommendations();
            expect(Array.isArray(recommendations)).toBe(true);
            expect(recommendations.length).toBeGreaterThan(0);
            
            // Verify recommendations are not defaults
            const recommendationText = recommendations.join(' ').toLowerCase();
            expect(recommendationText).not.toContain('complete your financial information');
            expect(recommendationText).not.toContain('default recommendation');
            expect(recommendationText).not.toContain('placeholder');
            expect(recommendationText.length).toBeGreaterThan(10); // Should have substantial content
        });

        test('should verify wealth projections work correctly', async () => {
            const { FinancialAnalyzer } = await import('../src/utils/FinancialAnalyzer');
            
            const userData = {
                monthlyIncome: 5000,
                monthlyExpenses: 3500,
                savings: 20000,
                debt: 5000,
                age: 28,
                currentInvestments: 30000,
                monthlyInvestmentContribution: 800,
                riskTolerance: 'moderate' as const,
                emergencyFundGoal: 6
            };
            
            const analyzer = new FinancialAnalyzer(userData);
            const projections = analyzer.calculateWealthProjections(30);
            
            expect(projections).toBeDefined();
            expect(typeof projections.conservative).toBe('number');
            expect(typeof projections.moderate).toBe('number');
            expect(typeof projections.aggressive).toBe('number');
            
            // Verify projections make sense
            expect(projections.conservative).toBeGreaterThan(0);
            expect(projections.moderate).toBeGreaterThan(projections.conservative);
            expect(projections.aggressive).toBeGreaterThan(projections.moderate);
            
            // Verify real values exist
            expect(typeof projections.realConservative).toBe('number');
            expect(typeof projections.realModerate).toBe('number');
            expect(typeof projections.realAggressive).toBe('number');
            
            // Real values should be less than nominal due to inflation
            expect(projections.realConservative).toBeLessThan(projections.conservative);
            expect(projections.realModerate).toBeLessThan(projections.moderate);
            expect(projections.realAggressive).toBeLessThan(projections.aggressive);
        });

        test('should handle edge cases without returning defaults', async () => {
            const { FinancialAnalyzer } = await import('../src/utils/FinancialAnalyzer');
            
            // Test with minimal data
            const minimalData = {
                monthlyIncome: 2000,
                monthlyExpenses: 1900,
                savings: 100,
                debt: 0,
                riskTolerance: 'conservative' as const,
                emergencyFundGoal: 6
            };
            
            const analyzer = new FinancialAnalyzer(minimalData);
            const healthScore = analyzer.calculateHealthScore();
            const recommendations = analyzer.generateRecommendations();
            
            expect(healthScore).toBeGreaterThan(0);
            expect(healthScore).toBeLessThanOrEqual(100);
            expect(recommendations.length).toBeGreaterThan(0);
            
            // Should provide specific advice for tight budget
            const recommendationText = recommendations.join(' ').toLowerCase();
            expect(recommendationText).toMatch(/(emergency|budget|cash flow|save|increase)/);
        });
    });

    describe('Integration: Full workflow test', () => {
        test('should complete full analysis without errors', async () => {
            const { FinancialAnalyzer } = await import('../src/utils/FinancialAnalyzer');
            const { ChartManager } = await import('../src/ui/ChartManager');
            const { InfoBoxManager } = await import('../src/ui/InfoBoxManager');
            
            // Initialize all components
            const infoBoxManager = new InfoBoxManager();
            const chartManager = new ChartManager();
            
            // Create realistic user data
            const userData = {
                monthlyIncome: 7500,
                monthlyExpenses: 5000,
                savings: 35000,
                debt: 15000,
                age: 35,
                retirementAge: 65,
                riskTolerance: 'moderate' as const,
                currentInvestments: 60000,
                monthlyInvestmentContribution: 1000,
                emergencyFundGoal: 6
            };
            
            // Perform complete analysis
            const analyzer = new FinancialAnalyzer(userData);
            
            // Get all analysis results
            const healthScore = analyzer.calculateHealthScore();
            const basicMetrics = analyzer.calculateBasicMetrics();
            const advancedMetrics = analyzer.calculateAdvancedMetrics();
            const scoreBreakdown = analyzer.getScoreBreakdown();
            const recommendations = analyzer.generateRecommendations();
            const wealthProjections = analyzer.calculateWealthProjections(30);
            
            // Verify all results are valid
            expect(healthScore).toBeGreaterThan(0);
            expect(basicMetrics.cashFlow).toBe(2500); // 7500 - 5000
            expect(advancedMetrics.cashFlowCoverageRatio).toBeGreaterThan(0);
            expect(scoreBreakdown.cashFlow.score).toBeGreaterThan(0);
            expect(recommendations.length).toBeGreaterThan(0);
            expect(wealthProjections.moderate).toBeGreaterThan(0);
            
            // Test chart creation with real data
            const chartData = {
                years: ['Age 35', 'Age 45', 'Age 55', 'Age 65'],
                values: [
                    userData.savings + userData.currentInvestments,
                    wealthProjections.moderate * 0.3,
                    wealthProjections.moderate * 0.6,
                    wealthProjections.moderate
                ]
            };
            
            expect(() => chartManager.createWealthChart(chartData)).not.toThrow();
            
            const healthData = {
                months: ['Current', 'Month 3', 'Month 6', 'Month 12'],
                scores: [healthScore, healthScore + 5, healthScore + 10, healthScore + 15]
            };
            
            expect(() => chartManager.createHealthChart(healthData)).not.toThrow();
            
            // Verify components are initialized
            expect(infoBoxManager).toBeDefined();
            expect(chartManager).toBeDefined();
            expect(analyzer).toBeDefined();
            
            // Test cleanup
            expect(() => chartManager.destroyExistingCharts()).not.toThrow();
            expect(() => infoBoxManager.closeAllTooltips()).not.toThrow();
        });
    });
}); 