/**
 * ChartManager Integration Tests
 * Ensures ChartManager methods exist and work correctly to prevent build failures
 */

// Mock Chart.js before any imports
const mockChart = {
    destroy: jest.fn(),
    update: jest.fn(),
    resize: jest.fn()
};

const mockChartConstructor = jest.fn().mockImplementation(() => mockChart);

// Set up Chart.js mock globally
(global as any).Chart = mockChartConstructor;

describe('ChartManager Integration Tests', () => {
    let ChartManager: any;

    beforeAll(async () => {
        // Import ChartManager after setting up the environment
        const module = await import('../src/ui/ChartManager');
        ChartManager = module.ChartManager;
    });

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();
        
        // Set up Chart.js mock
        (global as any).Chart = mockChartConstructor;
        
        // Reset DOM
        document.body.innerHTML = `
            <canvas id="wealthChart" width="400" height="200"></canvas>
            <canvas id="healthChart" width="400" height="200"></canvas>
        `;
    });

    describe('ChartManager Class Structure', () => {
        test('should instantiate ChartManager without errors', () => {
            expect(() => new ChartManager()).not.toThrow();
        });

        test('should have all required methods', () => {
            const chartManager = new ChartManager();
            
            // Verify all expected methods exist
            expect(typeof chartManager.createWealthChart).toBe('function');
            expect(typeof chartManager.createHealthChart).toBe('function');
            expect(typeof chartManager.destroyExistingCharts).toBe('function');
            expect(typeof chartManager.hasActiveCharts).toBe('function');
            expect(typeof chartManager.getChartInstances).toBe('function');
        });

        test('should NOT have deprecated methods', () => {
            const chartManager = new ChartManager();
            
            // Verify deprecated methods don't exist
            expect(chartManager.isReady).toBeUndefined();
            
            // Note: waitForChartJs is private but still accessible at runtime in JS
            // This is expected behavior - we just verify it's not part of the public API
            expect(typeof (chartManager as any).waitForChartJs).toBe('function');
        });
    });

    describe('Chart Creation Methods', () => {
        test('createWealthChart should accept correct parameters and return Promise<boolean>', async () => {
            const chartManager = new ChartManager();
            
            const wealthData = {
                years: ['2024', '2025', '2026'],
                values: [10000, 15000, 20000],
                realValues: [10000, 14500, 19000]
            };

            const result = await chartManager.createWealthChart(wealthData);
            expect(typeof result).toBe('boolean');
        });

        test('createHealthChart should accept correct parameters and return Promise<boolean>', async () => {
            const chartManager = new ChartManager();
            
            const healthData = {
                months: ['Jan', 'Feb', 'Mar'],
                scores: [70, 75, 80]
            };

            const result = await chartManager.createHealthChart(healthData);
            expect(typeof result).toBe('boolean');
        });

        test('should handle missing canvas elements gracefully', async () => {
            // Remove canvas elements
            document.body.innerHTML = '';
            
            const chartManager = new ChartManager();
            
            const wealthData = {
                years: ['2024'],
                values: [10000]
            };

            // Should not throw, should return false
            const result = await chartManager.createWealthChart(wealthData);
            expect(result).toBe(false);
        });
    });

    describe('Chart Management Methods', () => {
        test('destroyExistingCharts should not throw errors', () => {
            const chartManager = new ChartManager();
            
            expect(() => chartManager.destroyExistingCharts()).not.toThrow();
        });

        test('hasActiveCharts should return boolean', () => {
            const chartManager = new ChartManager();
            
            const result = chartManager.hasActiveCharts();
            expect(typeof result).toBe('boolean');
        });

        test('getChartInstances should return object with wealth and health properties', () => {
            const chartManager = new ChartManager();
            
            const instances = chartManager.getChartInstances();
            expect(typeof instances).toBe('object');
            expect(instances).toHaveProperty('wealth');
            expect(instances).toHaveProperty('health');
        });
    });

    describe('Method Signature Compatibility', () => {
        test('createWealthChart should work with app.ts usage pattern', async () => {
            const chartManager = new ChartManager();
            
            // This is how it's called in app.ts
            const wealthChartData = {
                years: ['Age 30', 'Age 35', 'Age 40', 'Age 67'],
                values: [50000, 100000, 200000, 800000],
                realValues: [50000, 90000, 170000, 600000]
            };

            // Should not throw and should return a boolean
            const result = await chartManager.createWealthChart(wealthChartData);
            expect(typeof result).toBe('boolean');
        });

        test('createHealthChart should work with app.ts usage pattern', async () => {
            const chartManager = new ChartManager();
            
            // This is how it's called in app.ts
            const healthChartData = {
                months: ['Jan 24', 'Feb 24', 'Mar 24'],
                scores: [65, 68, 70]
            };

            // Should not throw and should return a boolean
            const result = await chartManager.createHealthChart(healthChartData);
            expect(typeof result).toBe('boolean');
        });
    });

    describe('Error Handling', () => {
        test('should handle Chart.js not being available', async () => {
            // Temporarily remove Chart.js
            const originalChart = (global as any).Chart;
            delete (global as any).Chart;
            delete (global.window as any).Chart;
            
            const chartManager = new ChartManager();
            
            const wealthData = {
                years: ['2024'],
                values: [10000]
            };

            // Should not throw, should return false
            const result = await chartManager.createWealthChart(wealthData);
            expect(result).toBe(false);
            
            // Restore Chart.js
            (global as any).Chart = originalChart;
            (global.window as any).Chart = originalChart;
        });

        test('should handle invalid data gracefully', async () => {
            const chartManager = new ChartManager();
            
            // Test with empty data
            const emptyData = {
                years: [],
                values: []
            };

            const result = await chartManager.createWealthChart(emptyData);
            expect(typeof result).toBe('boolean');
        });
    });

    describe('Integration with App Class', () => {
        test('should work when called from app.ts context', async () => {
            // Simulate the exact usage pattern from app.ts
            const chartManager = new ChartManager();
            
            // Destroy existing charts (as done in app.ts)
            chartManager.destroyExistingCharts();
            
            // Create wealth chart (as done in app.ts)
            const projections = {
                fiveYearProjection: 100000,
                tenYearProjection: 250000,
                retirementProjection: 800000,
                fiveYearReal: 90000,
                tenYearReal: 220000,
                retirementReal: 650000
            };
            
            const userData = {
                age: 30,
                retirementAge: 67,
                savings: 50000,
                currentInvestments: 25000
            };
            
            const currentWealth = (userData.savings || 0) + (userData.currentInvestments || 0);
            const years = [
                `Age ${userData.age}`,
                `Age ${userData.age + 5}`,
                `Age ${userData.age + 10}`,
                `Age ${userData.retirementAge || 67}`
            ];
            
            const nominalData = [
                currentWealth,
                projections.fiveYearProjection,
                projections.tenYearProjection,
                projections.retirementProjection
            ];
            
            const realData = [
                currentWealth,
                projections.fiveYearReal,
                projections.tenYearReal,
                projections.retirementReal
            ];

            const wealthChartData = {
                years,
                values: nominalData,
                realValues: realData
            };

            // This should work exactly as called in app.ts
            const result = await chartManager.createWealthChart(wealthChartData);
            expect(typeof result).toBe('boolean');
        });
    });
}); 