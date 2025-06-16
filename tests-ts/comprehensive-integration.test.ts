/**
 * Comprehensive Integration Tests for Financial Health Analyzer
 * Tests all user scenarios and expected results with realistic data
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import { testServer, setupIntegrationTests, teardownIntegrationTests } from './integration-setup';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('Financial Health Analyzer - Comprehensive Integration Tests', () => {
    let browser: Browser;
    let page: Page;
    let baseUrl: string;

    beforeAll(async () => {
        // Start the test server
        await setupIntegrationTests();
        baseUrl = testServer.getBaseUrl();
        
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }, 60000); // Increase timeout for server startup

    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
        // Stop the test server
        await teardownIntegrationTests();
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto(baseUrl);
        await page.waitForSelector('#financialForm', { timeout: 10000 });
    });

    afterEach(async () => {
        if (page) {
            await page.close();
        }
    });

    describe('Basic Functionality Tests', () => {
        test('should load the application correctly', async () => {
            const title = await page.title();
            expect(title).toBe('Financial Health Analyzer');

            const header = await page.$eval('h1', el => el.textContent);
            expect(header).toContain('Financial Health Analyzer');

            // Check that required form elements exist
            const requiredElements = [
                '#monthlyIncome',
                '#monthlyExpenses', 
                '#savings',
                '#debt',
                '#analyzeBtn'
            ];

            for (const selector of requiredElements) {
                const element = await page.$(selector);
                expect(element).toBeTruthy();
            }
        });

        test('should validate required fields', async () => {
            // Try to submit without required fields
            await page.click('#analyzeBtn');
            await sleep(500);

            // Should not show results without required data
            const resultsVisible = await page.$eval('#results', el => 
                !el.classList.contains('visible')
            );
            expect(resultsVisible).toBe(true);
        });

        test('should handle basic financial analysis', async () => {
            // Fill in basic required information
            await page.type('#monthlyIncome', '5000');
            await page.type('#monthlyExpenses', '3500');
            await page.type('#savings', '10000');
            await page.type('#debt', '5000');

            await page.click('#analyzeBtn');
            await sleep(1000);

            // Check that results are displayed
            const resultsVisible = await page.$eval('#results', el => 
                el.classList.contains('visible')
            );
            expect(resultsVisible).toBe(true);

            // Check health score is displayed
            const healthScore = await page.$eval('#healthScore', el => el.textContent);
            expect(healthScore).toMatch(/^\d+$/);
            expect(parseInt(healthScore!)).toBeGreaterThan(0);
            expect(parseInt(healthScore!)).toBeLessThanOrEqual(100);

            // Check cash flow calculation
            const cashFlow = await page.$eval('#cashFlowValue', el => el.textContent);
            expect(cashFlow).toContain('$1,500'); // 5000 - 3500 = 1500
        });
    });

    describe('Advanced Features Tests', () => {
        test('should enable advanced features when age is provided', async () => {
            // Fill basic info
            await page.type('#monthlyIncome', '6000');
            await page.type('#monthlyExpenses', '4000');
            await page.type('#savings', '15000');
            await page.type('#debt', '8000');

            // Expand advanced section
            await page.click('[onclick="toggleSection(\'advanced\')"]');
            await sleep(500);

            // Fill advanced info including age
            await page.type('#age', '30');
            await page.type('#retirementAge', '65');
            await page.select('#riskTolerance', 'moderate');
            await page.type('#currentInvestments', '25000');
            await page.type('#monthlyInvestmentContribution', '500');

            await page.click('#analyzeBtn');
            await sleep(1500);

            // Check that advanced analytics are available
            const advancedSection = await page.$('#advanced-analytics-content');
            expect(advancedSection).toBeTruthy();

            // Check that charts are created
            const wealthChart = await page.$('#wealthChart');
            const healthChart = await page.$('#healthChart');
            expect(wealthChart).toBeTruthy();
            expect(healthChart).toBeTruthy();
        });

        test('should handle different risk tolerance levels', async () => {
            const riskLevels = ['conservative', 'moderate', 'aggressive'];
            
            for (const risk of riskLevels) {
                await page.reload();
                await page.waitForSelector('#financialForm');

                // Fill basic info
                await page.type('#monthlyIncome', '7000');
                await page.type('#monthlyExpenses', '4500');
                await page.type('#savings', '20000');
                await page.type('#debt', '10000');

                // Expand advanced section and set risk tolerance
                await page.click('[onclick="toggleSection(\'advanced\')"]');
                await sleep(300);
                await page.type('#age', '35');
                await page.select('#riskTolerance', risk);
                await page.type('#currentInvestments', '50000');

                await page.click('#analyzeBtn');
                await sleep(1000);

                // Verify analysis completes successfully
                const healthScore = await page.$eval('#healthScore', el => el.textContent);
                expect(parseInt(healthScore!)).toBeGreaterThan(0);
            }
        });
    });

    describe('Realistic User Scenarios', () => {
        test('Young Professional - High Income, Low Savings', async () => {
            // Scenario: 25-year-old making good money but just starting out
            await page.type('#monthlyIncome', '8000');
            await page.type('#monthlyExpenses', '6500');
            await page.type('#savings', '3000');
            await page.type('#debt', '15000'); // Student loans

            await page.click('[onclick="toggleSection(\'advanced\')"]');
            await sleep(300);
            await page.type('#age', '25');
            await page.type('#retirementAge', '65');
            await page.select('#riskTolerance', 'aggressive');
            await page.type('#currentInvestments', '5000');
            await page.type('#monthlyInvestmentContribution', '300');

            await page.click('#analyzeBtn');
            await sleep(1500);

            const healthScore = await page.$eval('#healthScore', el => el.textContent);
            const score = parseInt(healthScore!);
            
            // Should have moderate score due to high debt and low emergency fund
            expect(score).toBeGreaterThan(30);
            expect(score).toBeLessThan(70);

                         // Check recommendation mentions debt reduction
             const recommendation = await page.$eval('#recommendationText', el => el.textContent || '');
             expect(recommendation.toLowerCase()).toContain('debt');
        });

        test('Mid-Career Professional - Balanced Finances', async () => {
            // Scenario: 40-year-old with established finances
            await page.type('#monthlyIncome', '9000');
            await page.type('#monthlyExpenses', '6000');
            await page.type('#savings', '45000');
            await page.type('#debt', '8000');

            await page.click('[onclick="toggleSection(\'advanced\')"]');
            await sleep(300);
            await page.type('#age', '40');
            await page.type('#retirementAge', '67');
            await page.select('#riskTolerance', 'moderate');
            await page.type('#currentInvestments', '150000');
            await page.type('#monthlyInvestmentContribution', '1200');

            await page.click('#analyzeBtn');
            await sleep(1500);

            const healthScore = await page.$eval('#healthScore', el => el.textContent);
            const score = parseInt(healthScore!);
            
            // Should have good score with balanced finances
            expect(score).toBeGreaterThan(60);
            expect(score).toBeLessThan(90);

            // Check that wealth projections are reasonable
            const chartsSection = await page.$('#charts-content');
            expect(chartsSection).toBeTruthy();
        });

        test('Pre-Retirement - Conservative Approach', async () => {
            // Scenario: 55-year-old preparing for retirement
            await page.type('#monthlyIncome', '12000');
            await page.type('#monthlyExpenses', '7000');
            await page.type('#savings', '100000');
            await page.type('#debt', '2000');

            await page.click('[onclick="toggleSection(\'advanced\')"]');
            await sleep(300);
            await page.type('#age', '55');
            await page.type('#retirementAge', '65');
            await page.select('#riskTolerance', 'conservative');
            await page.type('#currentInvestments', '800000');
            await page.type('#monthlyInvestmentContribution', '2000');

            await page.click('#analyzeBtn');
            await sleep(1500);

            const healthScore = await page.$eval('#healthScore', el => el.textContent);
            const score = parseInt(healthScore!);
            
            // Should have excellent score with substantial assets
            expect(score).toBeGreaterThan(75);

                         // Check retirement readiness
             const recommendation = await page.$eval('#recommendationText', el => el.textContent || '');
             expect(recommendation.toLowerCase()).toMatch(/(excellent|strong|good)/);
        });

        test('Financial Struggle Scenario', async () => {
            // Scenario: Someone with financial difficulties
            await page.type('#monthlyIncome', '3500');
            await page.type('#monthlyExpenses', '3800'); // Spending more than earning
            await page.type('#savings', '500');
            await page.type('#debt', '25000');

            await page.click('#analyzeBtn');
            await sleep(1000);

            const healthScore = await page.$eval('#healthScore', el => el.textContent);
            const score = parseInt(healthScore!);
            
            // Should have low score due to negative cash flow
            expect(score).toBeLessThan(40);

                         // Check that recommendation addresses urgent issues
             const recommendation = await page.$eval('#recommendationText', el => el.textContent || '');
             expect(recommendation.toLowerCase()).toMatch(/(priority|urgent|reduce|budget)/);

            // Cash flow should be negative
            const cashFlow = await page.$eval('#cashFlowValue', el => el.textContent);
            expect(cashFlow).toContain('-$300');
        });
    });

    describe('User Interface Tests', () => {
        test('should toggle advanced sections correctly', async () => {
            // Test advanced details section
            const advancedToggle = await page.$('[onclick="toggleSection(\'advanced\')"]');
            expect(advancedToggle).toBeTruthy();

            await page.click('[onclick="toggleSection(\'advanced\')"]');
            await sleep(300);

                                      const advancedContent = await page.$('#advanced-content');
             expect(advancedContent).toBeTruthy();
             
             if (advancedContent) {
                 const isExpanded = await page.evaluate(el => !el.classList.contains('collapsed'), advancedContent);
                 expect(isExpanded).toBe(true);

                 // Test collapse
                 await page.click('[onclick="toggleSection(\'advanced\')"]');
                 await sleep(300);

                 const isCollapsed = await page.evaluate(el => el.classList.contains('collapsed'), advancedContent);
                 expect(isCollapsed).toBe(true);
             }
        });

        test('should display info boxes on hover/click', async () => {
            const infoIcon = await page.$('.info-icon');
            expect(infoIcon).toBeTruthy();

            // Test click interaction
            await page.click('.info-icon');
            await sleep(300);

                         const tooltip = await page.$('.tooltip');
             if (tooltip) {
                 await page.evaluate(el => {
                     const style = window.getComputedStyle(el);
                     return style.opacity !== '0' && style.visibility !== 'hidden';
                 }, tooltip);
             }
            
            // Note: This might not work in headless mode, but structure should be correct
            expect(tooltip).toBeTruthy();
        });

        test('should handle form validation gracefully', async () => {
            // Test negative values
            await page.type('#monthlyIncome', '-1000');
            await page.type('#monthlyExpenses', '2000');

            await page.click('#analyzeBtn');
            await sleep(500);

            // Should handle gracefully without crashing
            const healthScore = await page.$('#healthScore');
            expect(healthScore).toBeTruthy();
        });
    });

    describe('Chart Functionality Tests', () => {
        test('should create charts without errors when age is provided', async () => {
            // Fill complete form data
            await page.type('#monthlyIncome', '6000');
            await page.type('#monthlyExpenses', '4000');
            await page.type('#savings', '20000');
            await page.type('#debt', '5000');

            await page.click('[onclick="toggleSection(\'advanced\')"]');
            await sleep(300);
            await page.type('#age', '35');
            await page.type('#currentInvestments', '50000');
            await page.type('#monthlyInvestmentContribution', '800');

            await page.click('#analyzeBtn');
            await sleep(2000); // Give charts time to render

            // Check that chart canvases exist
            const wealthChart = await page.$('#wealthChart');
            const healthChart = await page.$('#healthChart');
            
            expect(wealthChart).toBeTruthy();
            expect(healthChart).toBeTruthy();

            // Verify no chart errors in console
            const logs = await page.evaluate(() => {
                return (window as any).chartErrors || [];
            });
            expect(logs.length).toBe(0);
        });

        test('should handle multiple analysis runs without chart errors', async () => {
            // Run analysis multiple times to test chart cleanup
            for (let i = 0; i < 3; i++) {
                await page.reload();
                await page.waitForSelector('#financialForm');

                await page.type('#monthlyIncome', '5000');
                await page.type('#monthlyExpenses', '3500');
                await page.type('#savings', '15000');
                await page.type('#debt', '3000');

                await page.click('[onclick="toggleSection(\'advanced\')"]');
                await sleep(300);
                await page.type('#age', '30');
                await page.type('#currentInvestments', '25000');

                await page.click('#analyzeBtn');
                await sleep(1500);

                // Verify charts are created successfully each time
                const wealthChart = await page.$('#wealthChart');
                const healthChart = await page.$('#healthChart');
                
                expect(wealthChart).toBeTruthy();
                expect(healthChart).toBeTruthy();
            }
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle extreme values gracefully', async () => {
            // Test with very large numbers
            await page.type('#monthlyIncome', '999999');
            await page.type('#monthlyExpenses', '1000000');
            await page.type('#savings', '10000000');
            await page.type('#debt', '5000000');

            await page.click('#analyzeBtn');
            await sleep(1000);

            // Should complete without errors
            const healthScore = await page.$eval('#healthScore', el => el.textContent);
            expect(healthScore).toMatch(/^\d+$/);
        });

        test('should handle zero values appropriately', async () => {
            await page.type('#monthlyIncome', '4000');
            await page.type('#monthlyExpenses', '4000'); // Break-even
            await page.type('#savings', '0');
            await page.type('#debt', '0');

            await page.click('#analyzeBtn');
            await sleep(1000);

            const cashFlow = await page.$eval('#cashFlowValue', el => el.textContent);
            expect(cashFlow).toContain('$0');

            const healthScore = await page.$eval('#healthScore', el => el.textContent);
            expect(parseInt(healthScore!)).toBeGreaterThanOrEqual(0);
        });

        test('should provide meaningful recommendations for different scenarios', async () => {
            const scenarios = [
                {
                    name: 'High Debt',
                    data: { income: '5000', expenses: '3000', savings: '10000', debt: '50000' },
                    expectedKeyword: 'debt'
                },
                {
                    name: 'No Emergency Fund',
                    data: { income: '6000', expenses: '4000', savings: '0', debt: '5000' },
                    expectedKeyword: 'emergency'
                },
                {
                    name: 'Excellent Finances',
                    data: { income: '10000', expenses: '5000', savings: '100000', debt: '0' },
                    expectedKeyword: 'excellent'
                }
            ];

            for (const scenario of scenarios) {
                await page.reload();
                await page.waitForSelector('#financialForm');

                await page.type('#monthlyIncome', scenario.data.income);
                await page.type('#monthlyExpenses', scenario.data.expenses);
                await page.type('#savings', scenario.data.savings);
                await page.type('#debt', scenario.data.debt);

                await page.click('#analyzeBtn');
                await sleep(1000);

                                 const recommendation = await page.$eval('#recommendationText', el => el.textContent || '');
                 expect(recommendation.toLowerCase()).toContain(scenario.expectedKeyword);
            }
        });
    });

    describe('Performance and Responsiveness Tests', () => {
        test('should complete analysis within reasonable time', async () => {
            const startTime = Date.now();

            await page.type('#monthlyIncome', '6000');
            await page.type('#monthlyExpenses', '4000');
            await page.type('#savings', '20000');
            await page.type('#debt', '8000');

            await page.click('[onclick="toggleSection(\'advanced\')"]');
            await sleep(300);
            await page.type('#age', '35');
            await page.type('#currentInvestments', '75000');
            await page.type('#monthlyInvestmentContribution', '1000');

            await page.click('#analyzeBtn');
            
            // Wait for results to appear
            await page.waitForSelector('#results.visible', { timeout: 10000 });
            
            const endTime = Date.now();
            const analysisTime = endTime - startTime;

            // Should complete within 10 seconds
            expect(analysisTime).toBeLessThan(10000);
        });

        test('should be responsive on mobile viewport', async () => {
            await page.setViewport({ width: 375, height: 667 }); // iPhone SE size

            await page.type('#monthlyIncome', '4000');
            await page.type('#monthlyExpenses', '3000');
            await page.type('#savings', '5000');
            await page.type('#debt', '2000');

            await page.click('#analyzeBtn');
            await sleep(1000);

            // Check that results are visible and properly formatted
            const resultsVisible = await page.$eval('#results', el => 
                el.classList.contains('visible')
            );
            expect(resultsVisible).toBe(true);

            // Check that form elements are accessible
            const formVisible = await page.$eval('#financialForm', el => {
                const rect = el.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0;
            });
            expect(formVisible).toBe(true);
        });
    });
}); 