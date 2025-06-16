/**
 * Chart Management Module
 * Handles Chart.js instance creation and destruction with proper error handling
 */

declare const Chart: any;

export class ChartManager {
    private wealthChart: any = null;
    private healthChart: any = null;
    private isChartJsLoaded: boolean = false;
    private retryAttempts: number = 0;
    private maxRetries: number = 3;

    constructor() {
        // Synchronous check for Chart.js availability
        this.checkChartJsAvailability();
    }

    /**
     * Check if Chart.js is available and loaded (synchronous)
     */
    private checkChartJsAvailability(): void {
        this.isChartJsLoaded = typeof (window as any).Chart !== 'undefined';
        if (!this.isChartJsLoaded) {
            console.warn('Chart.js not loaded. Charts will not be displayed.');
        }
    }

    /**
     * Wait for Chart.js to be available (async method for when needed)
     */
    private async waitForChartJs(): Promise<boolean> {
        // If already loaded, return immediately
        if (this.isChartJsLoaded) {
            return true;
        }

        // In test environment, don't wait - just return false
        if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
            return false;
        }

        // In browser environment, wait for Chart.js to load
        const timeout = 3000; // Reduced timeout for better performance
        const checkInterval = 100;
        const maxChecks = timeout / checkInterval;
        
        for (let i = 0; i < maxChecks; i++) {
            if (typeof (window as any).Chart !== 'undefined') {
                this.isChartJsLoaded = true;
                console.log('Chart.js loaded successfully');
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, checkInterval));
        }
        
        console.warn('Chart.js failed to load within timeout period');
        return false;
    }

    /**
     * Verify Chart.js functionality by creating a test chart
     */
    private async verifyChartJsFunctionality(): Promise<boolean> {
        if (!this.isChartJsLoaded) {
            return false;
        }

        try {
            // Create a temporary canvas for testing
            const testCanvas = document.createElement('canvas');
            testCanvas.width = 100;
            testCanvas.height = 100;
            
            // Try to create a simple test chart
            const testChart = new (window as any).Chart(testCanvas, {
                type: 'line',
                data: {
                    labels: ['Test'],
                    datasets: [{
                        label: 'Test',
                        data: [1]
                    }]
                },
                options: {
                    responsive: false,
                    animation: false
                }
            });
            
            // Clean up test chart
            testChart.destroy();
            return true;
        } catch (error) {
            console.warn('Chart.js functionality test failed:', error);
            return false;
        }
    }

    /**
     * Create wealth projection chart
     */
    public async createWealthChart(data: { years: string[], values: number[], realValues?: number[] }): Promise<boolean> {
        try {
            // Wait for Chart.js to be available
            const chartJsReady = await this.waitForChartJs();
            if (!chartJsReady) {
                console.warn('Chart.js not available, skipping wealth chart creation');
                return false;
            }

            // Verify Chart.js functionality
            const functionalityOk = await this.verifyChartJsFunctionality();
            if (!functionalityOk) {
                console.warn('Chart.js functionality verification failed');
                return false;
            }

            // Destroy existing chart if it exists
            if (this.wealthChart) {
                this.wealthChart.destroy();
                this.wealthChart = null;
            }

            const canvas = document.getElementById('wealthChart') as HTMLCanvasElement;
            if (!canvas) {
                console.error('Wealth chart canvas not found');
                return false;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Could not get 2D context for wealth chart');
                return false;
            }

            // Prepare datasets
            const datasets = [
                {
                    label: 'Projected Wealth (Nominal)',
                    data: data.values,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                }
            ];

            if (data.realValues) {
                datasets.push({
                    label: 'Projected Wealth (Real)',
                    data: data.realValues,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1
                });
            }

            // Create the chart
            this.wealthChart = new (window as any).Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.years,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Wealth Projection Over Time'
                        },
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value: any) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });

            console.log('Wealth chart created successfully');
            return true;

        } catch (error) {
            console.error('Error creating wealth chart:', error);
            this.retryAttempts++;
            
            if (this.retryAttempts < this.maxRetries) {
                console.log(`Retrying wealth chart creation (attempt ${this.retryAttempts + 1}/${this.maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return this.createWealthChart(data);
            }
            
            return false;
        }
    }

    /**
     * Create financial health trend chart
     */
    public async createHealthChart(data: { months: string[], scores: number[] }): Promise<boolean> {
        try {
            // Wait for Chart.js to be available
            const chartJsReady = await this.waitForChartJs();
            if (!chartJsReady) {
                console.warn('Chart.js not available, skipping health chart creation');
                return false;
            }

            // Verify Chart.js functionality
            const functionalityOk = await this.verifyChartJsFunctionality();
            if (!functionalityOk) {
                console.warn('Chart.js functionality verification failed');
                return false;
            }

            // Destroy existing chart if it exists
            if (this.healthChart) {
                this.healthChart.destroy();
                this.healthChart = null;
            }

            const canvas = document.getElementById('healthChart') as HTMLCanvasElement;
            if (!canvas) {
                console.error('Health chart canvas not found');
                return false;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Could not get 2D context for health chart');
                return false;
            }

            // Create the chart
            this.healthChart = new (window as any).Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.months,
                    datasets: [{
                        label: 'Financial Health Score',
                        data: data.scores,
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        tension: 0.1,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Financial Health Trend'
                        },
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value: any) {
                                    return value + '%';
                                }
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });

            console.log('Health chart created successfully');
            return true;

        } catch (error) {
            console.error('Error creating health chart:', error);
            this.retryAttempts++;
            
            if (this.retryAttempts < this.maxRetries) {
                console.log(`Retrying health chart creation (attempt ${this.retryAttempts + 1}/${this.maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return this.createHealthChart(data);
            }
            
            return false;
        }
    }

    /**
     * Destroy all existing charts
     */
    public destroyExistingCharts(): void {
        try {
            if (this.wealthChart) {
                this.wealthChart.destroy();
                this.wealthChart = null;
                console.log('Wealth chart destroyed');
            }

            if (this.healthChart) {
                this.healthChart.destroy();
                this.healthChart = null;
                console.log('Health chart destroyed');
            }
        } catch (error) {
            console.error('Error destroying charts:', error);
        }
    }

    /**
     * Check if charts are currently displayed
     */
    public hasActiveCharts(): boolean {
        return this.wealthChart !== null || this.healthChart !== null;
    }

    /**
     * Get chart instances for external access
     */
    public getChartInstances(): { wealth: any, health: any } {
        return {
            wealth: this.wealthChart,
            health: this.healthChart
        };
    }
} 