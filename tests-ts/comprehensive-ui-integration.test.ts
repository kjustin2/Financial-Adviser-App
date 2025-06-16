/**
 * Comprehensive UI Integration Tests
 * Tests specific UI functionality that was reported as not working
 */

import { JSDOM } from 'jsdom';

describe('Comprehensive UI Integration Tests', () => {
    let dom: JSDOM;
    let document: Document;
    let window: Window;

    beforeEach(() => {
        // Setup DOM environment with complete HTML structure
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Financial Health Analyzer</title>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <style>
                    .info-icon { cursor: pointer; position: relative; }
                    .tooltip { 
                        position: fixed; 
                        opacity: 0; 
                        visibility: hidden; 
                        transition: all 0.3s ease;
                        background: #1f2937;
                        color: white;
                        padding: 12px 16px;
                        border-radius: 8px;
                        z-index: 999999;
                    }
                    .info-icon.active .tooltip,
                    .info-icon:hover .tooltip { 
                        opacity: 1; 
                        visibility: visible; 
                    }
                    .section-content.collapsed { display: none; }
                    .chart-wrapper { position: relative; height: 300px; }
                    canvas { width: 100%; height: 100%; }
                </style>
            </head>
            <body>
                <div class="container">
                    <form id="financialForm">
                        <!-- Basic Information -->
                        <div class="input-group">
                            <label for="monthlyIncome">
                                Monthly Income
                                <div class="info-icon">i
                                    <div class="tooltip">Your total monthly take-home income after taxes</div>
                                </div>
                            </label>
                            <input type="number" id="monthlyIncome" min="0" step="100" required>
                        </div>

                        <div class="input-group">
                            <label for="monthlyExpenses">
                                Monthly Expenses
                                <div class="info-icon">i
                                    <div class="tooltip">Your total monthly essential expenses</div>
                                </div>
                            </label>
                            <input type="number" id="monthlyExpenses" min="0" step="100" required>
                        </div>

                        <div class="input-group">
                            <label for="savings">
                                Current Savings
                                <div class="info-icon">i
                                    <div class="tooltip">Total amount in savings and checking accounts</div>
                                </div>
                            </label>
                            <input type="number" id="savings" min="0" step="500">
                        </div>

                        <div class="input-group">
                            <label for="debt">
                                Total Debt
                                <div class="info-icon">i
                                    <div class="tooltip">Combined total of all debt excluding mortgage</div>
                                </div>
                            </label>
                            <input type="number" id="debt" min="0" step="500">
                        </div>

                        <!-- Advanced Section -->
                        <div class="form-section">
                            <div class="section-header" onclick="toggleSection('advanced')">
                                <h3>Advanced Details</h3>
                                <span class="expand-icon" id="advanced-icon">▼</span>
                            </div>
                            <div class="section-content collapsed" id="advanced-content">
                                <div class="input-group">
                                    <label for="age">Age</label>
                                    <input type="number" id="age" min="18" max="100">
                                </div>
                                <div class="input-group">
                                    <label for="retirementAge">Retirement Age</label>
                                    <input type="number" id="retirementAge" min="50" max="80">
                                </div>
                                <div class="input-group">
                                    <label for="riskTolerance">Risk Tolerance</label>
                                    <select id="riskTolerance">
                                        <option value="conservative">Conservative</option>
                                        <option value="moderate" selected>Moderate</option>
                                        <option value="aggressive">Aggressive</option>
                                    </select>
                                </div>
                                <div class="input-group">
                                    <label for="currentInvestments">Current Investments</label>
                                    <input type="number" id="currentInvestments" min="0" step="1000">
                                </div>
                                <div class="input-group">
                                    <label for="monthlyInvestmentContribution">Monthly Investment Contribution</label>
                                    <input type="number" id="monthlyInvestmentContribution" min="0" step="50">
                                </div>
                            </div>
                        </div>

                        <button type="button" id="analyzeBtn">Analyze</button>
                    </form>

                    <!-- Results Section -->
                    <div id="results" class="results-container">
                        <div id="healthScore">--</div>
                        <div id="cashFlowValue">$--</div>
                        <div id="emergencyFundValue">-- months</div>
                        <div id="debtRatioValue">--%</div>
                        <div id="savingsRateValue">--%</div>
                        <div id="recommendationText">Complete analysis to get recommendations</div>
                        
                        <!-- Score Breakdown -->
                        <div id="scoreBreakdown"></div>
                        
                        <!-- Advanced Analytics -->
                        <div class="detailed-results">
                            <div class="section-header" onclick="toggleSection('advanced-analytics')">
                                <h3>Advanced Financial Analytics</h3>
                                <span class="expand-icon" id="advanced-analytics-icon">▼</span>
                            </div>
                            <div class="section-content collapsed" id="advanced-analytics-content">
                                <div id="advancedMetrics"></div>
                                <div id="scenarioAnalysis"></div>
                            </div>
                        </div>
                        
                        <!-- Charts Section -->
                        <div class="detailed-results">
                            <div class="section-header" onclick="toggleSection('charts')">
                                <h3>Charts</h3>
                                <span class="expand-icon" id="charts-icon">▼</span>
                            </div>
                            <div class="section-content collapsed" id="charts-content">
                                <div class="chart-container">
                                    <div class="chart-title">Wealth Growth Projection</div>
                                    <div class="chart-wrapper">
                                        <canvas id="wealthChart"></canvas>
                                    </div>
                                </div>
                                <div class="chart-container">
                                    <div class="chart-title">Financial Health Trend</div>
                                    <div class="chart-wrapper">
                                        <canvas id="healthChart"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <script>
                    function toggleSection(sectionId) {
                        const content = document.getElementById(sectionId + '-content');
                        const icon = document.getElementById(sectionId + '-icon');
                        
                        if (content.classList.contains('collapsed')) {
                            content.classList.remove('collapsed');
                            icon.textContent = '▲';
                        } else {
                            content.classList.add('collapsed');
                            icon.textContent = '▼';
                        }
                    }
                </script>
            </body>
            </html>
        `, {
            url: 'http://localhost:3000',
            pretendToBeVisual: true,
            resources: 'usable'
        });

        // Setup global environment
        document = dom.window.document;
        window = dom.window as any;
        (global as any).window = window;
        (global as any).document = document;
        (global as any).HTMLElement = dom.window.HTMLElement;
        (global as any).HTMLCanvasElement = dom.window.HTMLCanvasElement;
        (global as any).CanvasRenderingContext2D = dom.window.CanvasRenderingContext2D;

        // Mock Chart.js
        const mockChart = {
            destroy: jest.fn(),
            update: jest.fn(),
            resize: jest.fn()
        };

        const mockContext = {
            clearRect: jest.fn(),
            fillRect: jest.fn(),
            strokeRect: jest.fn(),
            getImageData: jest.fn(),
            putImageData: jest.fn(),
            canvas: { width: 400, height: 300 }
        };

        (global as any).Chart = jest.fn().mockImplementation(() => mockChart);
        (global as any).Chart.register = jest.fn();
        (global as any).Chart.defaults = { responsive: true, maintainAspectRatio: false };
        (global as any).Chart.instances = {};

        // Mock canvas getContext
        HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(mockContext);
        HTMLCanvasElement.prototype.removeAttribute = jest.fn();
        Object.defineProperty(HTMLCanvasElement.prototype, 'width', { value: 400, writable: true });
        Object.defineProperty(HTMLCanvasElement.prototype, 'height', { value: 300, writable: true });
    });

    afterEach(() => {
        dom.window.close();
    });

    describe('Info Box Functionality', () => {
        test('should initialize InfoBoxManager and handle click events', async () => {
            // Import and initialize InfoBoxManager
            const { InfoBoxManager } = await import('../src/ui/InfoBoxManager');
            
            const infoBoxManager = new InfoBoxManager();
            expect(infoBoxManager).toBeDefined();

            // Get info icons
            const infoIcons = document.querySelectorAll('.info-icon');
            expect(infoIcons.length).toBeGreaterThan(0);

            // Test click functionality
            const firstIcon = infoIcons[0] as HTMLElement;
            expect(firstIcon).toBeDefined();

            // Simulate click event
            const clickEvent = new dom.window.Event('click', { bubbles: true });
            firstIcon.dispatchEvent(clickEvent);

            // Check if active class is added
            expect(firstIcon.classList.contains('active')).toBe(true);

            // Check if tooltip exists
            const tooltip = firstIcon.querySelector('.tooltip');
            expect(tooltip).toBeTruthy();
            expect(tooltip?.textContent).toContain('income');
        });

        test('should handle hover events on desktop', async () => {
            // Set desktop viewport
            Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });

            const { InfoBoxManager } = await import('../src/ui/InfoBoxManager');
            new InfoBoxManager();

            const infoIcons = document.querySelectorAll('.info-icon');
            const firstIcon = infoIcons[0] as HTMLElement;

            // Simulate mouseenter
            const mouseEnterEvent = new dom.window.Event('mouseenter', { bubbles: true });
            firstIcon.dispatchEvent(mouseEnterEvent);

            expect(firstIcon.classList.contains('active')).toBe(true);
        });

        test('should close tooltips when clicking elsewhere', async () => {
            const { InfoBoxManager } = await import('../src/ui/InfoBoxManager');
            new InfoBoxManager();

            const infoIcons = document.querySelectorAll('.info-icon');
            const firstIcon = infoIcons[0] as HTMLElement;

            // Open tooltip
            const clickEvent = new dom.window.Event('click', { bubbles: true });
            firstIcon.dispatchEvent(clickEvent);
            expect(firstIcon.classList.contains('active')).toBe(true);

            // Click elsewhere
            const documentClickEvent = new dom.window.Event('click', { bubbles: true });
            document.dispatchEvent(documentClickEvent);

            expect(firstIcon.classList.contains('active')).toBe(false);
        });

        test('should position tooltips correctly', async () => {
            const { InfoBoxManager } = await import('../src/ui/InfoBoxManager');
            
            // Mock getBoundingClientRect
            HTMLElement.prototype.getBoundingClientRect = jest.fn().mockReturnValue({
                top: 100,
                left: 200,
                bottom: 120,
                right: 220,
                width: 20,
                height: 20
            });

            new InfoBoxManager();

            const infoIcons = document.querySelectorAll('.info-icon');
            const firstIcon = infoIcons[0] as HTMLElement;
            const tooltip = firstIcon.querySelector('.tooltip') as HTMLElement;

            // Simulate click to trigger positioning
            const clickEvent = new dom.window.Event('click', { bubbles: true });
            firstIcon.dispatchEvent(clickEvent);

            // Check if tooltip has positioning styles
            expect(tooltip.style.position).toBe('fixed');
            expect(tooltip.style.visibility).toBe('visible');
        });
    });

    describe('Chart Functionality', () => {
        test('should create ChartManager and handle chart creation', async () => {
            const { ChartManager } = await import('../src/ui/ChartManager');
            
            const chartManager = new ChartManager();
            expect(chartManager).toBeDefined();

            // Test wealth chart creation
            const wealthData = {
                years: ['Age 30', 'Age 35', 'Age 40', 'Age 65'],
                values: [50000, 100000, 200000, 800000],
                realValues: [50000, 90000, 170000, 600000]
            };

            expect(() => chartManager.createWealthChart(wealthData)).not.toThrow();

            // Verify Chart.js was called
            expect((global as any).Chart).toHaveBeenCalled();

            // Check canvas exists
            const wealthCanvas = document.getElementById('wealthChart');
            expect(wealthCanvas).toBeTruthy();
        });

        test('should create health trend chart', async () => {
            const { ChartManager } = await import('../src/ui/ChartManager');
            
            const chartManager = new ChartManager();

            const healthData = {
                months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                scores: [65, 68, 70, 72, 75, 78]
            };

            expect(() => chartManager.createHealthChart(healthData)).not.toThrow();

            // Verify Chart.js was called again
            expect((global as any).Chart).toHaveBeenCalledTimes(2);

            // Check canvas exists
            const healthCanvas = document.getElementById('healthChart');
            expect(healthCanvas).toBeTruthy();
        });

        test('should handle chart destruction properly', async () => {
            const { ChartManager } = await import('../src/ui/ChartManager');
            
            const chartManager = new ChartManager();

            // Create charts first
            chartManager.createWealthChart({
                years: ['2024', '2025'],
                values: [1000, 2000]
            });

            chartManager.createHealthChart({
                months: ['Jan', 'Feb'],
                scores: [70, 75]
            });

            // Test destruction
            expect(() => chartManager.destroyExistingCharts()).not.toThrow();

            // Verify canvas context was cleared
            const wealthCanvas = document.getElementById('wealthChart') as HTMLCanvasElement;
            const healthCanvas = document.getElementById('healthChart') as HTMLCanvasElement;
            
            expect(wealthCanvas.getContext('2d')?.clearRect).toHaveBeenCalled();
            expect(healthCanvas.getContext('2d')?.clearRect).toHaveBeenCalled();
        });

        test('should handle missing canvas elements gracefully', async () => {
            const { ChartManager } = await import('../src/ui/ChartManager');
            
            // Remove canvas elements
            const wealthCanvas = document.getElementById('wealthChart');
            const healthCanvas = document.getElementById('healthChart');
            wealthCanvas?.remove();
            healthCanvas?.remove();

            const chartManager = new ChartManager();

            // Should not throw errors when canvas is missing
            expect(() => chartManager.createWealthChart({
                years: ['2024'],
                values: [1000]
            })).not.toThrow();

            expect(() => chartManager.createHealthChart({
                months: ['Jan'],
                scores: [70]
            })).not.toThrow();
        });
    });

    describe('Advanced Analytics Display', () => {
        test('should display advanced metrics correctly', async () => {
            // Import the main app to test advanced analytics
            const { FinancialAnalyzer } = await import('../src/utils/FinancialAnalyzer');

            const userData = {
                monthlyIncome: 8000,
                monthlyExpenses: 5000,
                savings: 50000,
                debt: 15000,
                age: 35,
                retirementAge: 65,
                riskTolerance: 'moderate' as const,
                currentInvestments: 75000,
                monthlyInvestmentContribution: 1000,
                emergencyFundGoal: 6
            };

            const analyzer = new FinancialAnalyzer(userData);
            const advancedMetrics = analyzer.calculateAdvancedMetrics();

            expect(advancedMetrics).toBeDefined();
            expect(typeof advancedMetrics.cashFlowCoverageRatio).toBe('number');
            expect(typeof advancedMetrics.debtServiceCoverage).toBe('number');
            expect(typeof advancedMetrics.liquidityRatio).toBe('number');
            expect(typeof advancedMetrics.savingsEfficiency).toBe('number');
            expect(typeof advancedMetrics.financialStressScore).toBe('number');
            expect(typeof advancedMetrics.wealthBuildingVelocity).toBe('number');

            // Verify metrics are not default/fake values
            expect(advancedMetrics.cashFlowCoverageRatio).toBeGreaterThan(0);
            expect(advancedMetrics.liquidityRatio).toBeGreaterThan(0);
            expect(advancedMetrics.savingsEfficiency).toBeGreaterThan(0);
            expect(advancedMetrics.wealthBuildingVelocity).toBeGreaterThan(0);
        });

        test('should generate real recommendations not defaults', async () => {
            const { FinancialAnalyzer } = await import('../src/utils/FinancialAnalyzer');

            // Test with poor financial situation
            const poorUserData = {
                monthlyIncome: 3000,
                monthlyExpenses: 2900,
                savings: 500,
                debt: 15000,
                riskTolerance: 'conservative' as const,
                emergencyFundGoal: 6
            };

            const analyzer = new FinancialAnalyzer(poorUserData);
            const recommendations = analyzer.generateRecommendations();

            expect(recommendations).toBeDefined();
            expect(Array.isArray(recommendations)).toBe(true);
            expect(recommendations.length).toBeGreaterThan(0);
            
            // Should contain specific actionable advice, not generic defaults
            const recommendationText = recommendations.join(' ').toLowerCase();
            expect(recommendationText).toMatch(/(emergency|debt|cash flow|budget|reduce|increase)/);
            
            // Should not be default fallback text
            expect(recommendationText).not.toContain('complete your financial information');
            expect(recommendationText).not.toContain('default recommendation');
        });

        test('should calculate real financial health score not defaults', async () => {
            const { FinancialAnalyzer } = await import('../src/utils/FinancialAnalyzer');

            const userData = {
                monthlyIncome: 6000,
                monthlyExpenses: 4000,
                savings: 30000,
                debt: 8000,
                riskTolerance: 'moderate' as const,
                emergencyFundGoal: 6
            };

            const analyzer = new FinancialAnalyzer(userData);
            const healthScore = analyzer.calculateHealthScore();
            const scoreBreakdown = analyzer.getScoreBreakdown();

            expect(healthScore).toBeGreaterThan(0);
            expect(healthScore).toBeLessThanOrEqual(100);
            expect(healthScore).not.toBe(50); // Should not be a default middle value

            expect(scoreBreakdown).toBeDefined();
            expect(scoreBreakdown.cashFlow).toBeDefined();
            expect(scoreBreakdown.emergencyFund).toBeDefined();
            expect(scoreBreakdown.debtManagement).toBeDefined();
            expect(scoreBreakdown.savingsRate).toBeDefined();

            // Verify breakdown components have real values
            expect(scoreBreakdown.cashFlow.score).toBeGreaterThan(0);
            expect(scoreBreakdown.emergencyFund.score).toBeGreaterThan(0);
            expect(scoreBreakdown.debtManagement.score).toBeGreaterThan(0);
            expect(scoreBreakdown.savingsRate.score).toBeGreaterThan(0);
            
            // Verify breakdown has proper structure and values
            expect(scoreBreakdown.cashFlow.value).toBeDefined();
            expect(scoreBreakdown.cashFlow.status).toBeDefined();
            expect(scoreBreakdown.cashFlow.benchmark).toBeDefined();
        });

        test('should handle section toggling for advanced analytics', () => {
            // Test the toggleSection function
            const advancedContent = document.getElementById('advanced-analytics-content');
            const advancedIcon = document.getElementById('advanced-analytics-icon');

            expect(advancedContent?.classList.contains('collapsed')).toBe(true);
            expect(advancedIcon?.textContent).toBe('▼');

            // Simulate toggle
            (window as any).toggleSection('advanced-analytics');

            expect(advancedContent?.classList.contains('collapsed')).toBe(false);
            expect(advancedIcon?.textContent).toBe('▲');

            // Toggle back
            (window as any).toggleSection('advanced-analytics');

            expect(advancedContent?.classList.contains('collapsed')).toBe(true);
            expect(advancedIcon?.textContent).toBe('▼');
        });
    });

    describe('Full Integration Workflow', () => {
        test('should complete full analysis workflow with real data', async () => {
            // Import all necessary modules
            const { FinancialAnalyzer } = await import('../src/utils/FinancialAnalyzer');
            const { ChartManager } = await import('../src/ui/ChartManager');
            const { InfoBoxManager } = await import('../src/ui/InfoBoxManager');

            // Initialize all managers
            const infoBoxManager = new InfoBoxManager();
            const chartManager = new ChartManager();

            // Fill form with realistic data
            const monthlyIncomeInput = document.getElementById('monthlyIncome') as HTMLInputElement;
            const monthlyExpensesInput = document.getElementById('monthlyExpenses') as HTMLInputElement;
            const savingsInput = document.getElementById('savings') as HTMLInputElement;
            const debtInput = document.getElementById('debt') as HTMLInputElement;
            const ageInput = document.getElementById('age') as HTMLInputElement;
            const retirementAgeInput = document.getElementById('retirementAge') as HTMLInputElement;

            monthlyIncomeInput.value = '7000';
            monthlyExpensesInput.value = '4500';
            savingsInput.value = '25000';
            debtInput.value = '12000';
            ageInput.value = '32';
            retirementAgeInput.value = '67';

            // Create user data object
            const userData = {
                monthlyIncome: 7000,
                monthlyExpenses: 4500,
                savings: 25000,
                debt: 12000,
                age: 32,
                retirementAge: 67,
                riskTolerance: 'moderate' as const,
                currentInvestments: 45000,
                monthlyInvestmentContribution: 800,
                emergencyFundGoal: 6
            };

            // Perform analysis
            const analyzer = new FinancialAnalyzer(userData);
            const healthScore = analyzer.calculateHealthScore();
            const basicMetrics = analyzer.calculateBasicMetrics();
            const advancedMetrics = analyzer.calculateAdvancedMetrics();
            const recommendations = analyzer.generateRecommendations();
            const scoreBreakdown = analyzer.getScoreBreakdown();

            // Verify all components return real data
            expect(healthScore).toBeGreaterThan(0);
            expect(healthScore).toBeLessThanOrEqual(100);
            
            // Verify score breakdown is properly structured
            expect(scoreBreakdown).toBeDefined();
            expect(scoreBreakdown.cashFlow).toBeDefined();
            expect(scoreBreakdown.emergencyFund).toBeDefined();
            expect(scoreBreakdown.debtManagement).toBeDefined();
            expect(scoreBreakdown.savingsRate).toBeDefined();
            
            expect(basicMetrics.cashFlow).toBe(2500); // 7000 - 4500
            expect(basicMetrics.emergencyFundMonths).toBeCloseTo(5.56, 1); // 25000 / 4500
            expect(basicMetrics.debtToIncomeRatio).toBeGreaterThan(0);
            expect(basicMetrics.savingsRate).toBeGreaterThan(0);

            expect(advancedMetrics.cashFlowCoverageRatio).toBeGreaterThan(0);
            expect(advancedMetrics.liquidityRatio).toBeGreaterThan(0);

            expect(recommendations.length).toBeGreaterThan(0);
            expect(recommendations[0]).not.toContain('default');

            // Test chart creation with real data
            const wealthProjections = analyzer.calculateWealthProjections();
            expect(wealthProjections.fiveYearProjection).toBeGreaterThan(0);
            expect(wealthProjections.tenYearProjection).toBeGreaterThan(wealthProjections.fiveYearProjection);

            const chartData = {
                years: ['Age 32', 'Age 37', 'Age 42', 'Age 67'],
                values: [
                    userData.savings + (userData.currentInvestments || 0),
                    wealthProjections.fiveYearProjection,
                    wealthProjections.tenYearProjection,
                    wealthProjections.retirementProjection
                ],
                realValues: [
                    userData.savings + (userData.currentInvestments || 0),
                    wealthProjections.fiveYearReal,
                    wealthProjections.tenYearReal,
                    wealthProjections.retirementReal
                ]
            };

            expect(() => chartManager.createWealthChart(chartData)).not.toThrow();

            // Test health chart
            const healthData = {
                months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                scores: [healthScore, healthScore + 2, healthScore + 4, healthScore + 6, healthScore + 8, healthScore + 10]
            };

            expect(() => chartManager.createHealthChart(healthData)).not.toThrow();

            // Verify UI components are working
            expect(infoBoxManager).toBeDefined();
            expect(chartManager).toBeDefined();

            // Test info box interaction
            const infoIcons = document.querySelectorAll('.info-icon');
            expect(infoIcons.length).toBeGreaterThan(0);

            const firstIcon = infoIcons[0] as HTMLElement;
            const clickEvent = new dom.window.Event('click', { bubbles: true });
            firstIcon.dispatchEvent(clickEvent);
            expect(firstIcon.classList.contains('active')).toBe(true);
        });

        test('should handle edge cases without returning defaults', async () => {
            const { FinancialAnalyzer } = await import('../src/utils/FinancialAnalyzer');

            // Test with extreme values
            const extremeUserData = {
                monthlyIncome: 1000000, // Very high income
                monthlyExpenses: 50000,
                savings: 5000000,
                debt: 0,
                age: 25,
                retirementAge: 50,
                riskTolerance: 'aggressive' as const,
                currentInvestments: 2000000,
                monthlyInvestmentContribution: 100000,
                emergencyFundGoal: 12
            };

            const analyzer = new FinancialAnalyzer(extremeUserData);
            const healthScore = analyzer.calculateHealthScore();
            const recommendations = analyzer.generateRecommendations();

            expect(healthScore).toBeGreaterThan(80); // Should be excellent
            expect(recommendations.length).toBeGreaterThan(0);
            
            // Should provide high-earner specific advice, not defaults
            const recommendationText = recommendations.join(' ').toLowerCase();
            expect(recommendationText).toMatch(/(excellent|optimization|tax|advanced|diversif)/);
        });
    });
}); 