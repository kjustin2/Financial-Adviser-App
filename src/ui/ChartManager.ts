/**
 * Chart Management Module
 * Handles Chart.js instance creation and destruction
 */

declare const Chart: any;

export class ChartManager {
    private wealthChart: any = null;
    private healthChart: any = null;

    /**
     * Safely destroy existing charts
     */
    public destroyExistingCharts(): void {
        try {
            // Get canvases first
            const wealthCanvas = document.getElementById('wealthChart') as HTMLCanvasElement;
            const healthCanvas = document.getElementById('healthChart') as HTMLCanvasElement;
            
            // Destroy Chart.js instances if they exist
            if (this.wealthChart) {
                try {
                    this.wealthChart.destroy();
                } catch (error) {
                    console.warn('Error destroying wealth chart:', error);
                }
                this.wealthChart = null;
            }
            
            if (this.healthChart) {
                try {
                    this.healthChart.destroy();
                } catch (error) {
                    console.warn('Error destroying health chart:', error);
                }
                this.healthChart = null;
            }

            // Clear canvas contexts to prevent reuse errors
            if (wealthCanvas) {
                const ctx = wealthCanvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, wealthCanvas.width, wealthCanvas.height);
                }
                // Remove any existing Chart.js data
                wealthCanvas.removeAttribute('data-chartjs-id');
            }
            
            if (healthCanvas) {
                const ctx = healthCanvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, healthCanvas.width, healthCanvas.height);
                }
                // Remove any existing Chart.js data
                healthCanvas.removeAttribute('data-chartjs-id');
            }

            // Force garbage collection of Chart.js instances
            if ((window as any).Chart && (window as any).Chart.instances) {
                Object.keys((window as any).Chart.instances).forEach(key => {
                    const instance = (window as any).Chart.instances[key];
                    if (instance && (instance.canvas === wealthCanvas || instance.canvas === healthCanvas)) {
                        try {
                            instance.destroy();
                            delete (window as any).Chart.instances[key];
                        } catch (error) {
                            console.warn('Error cleaning up chart instance:', error);
                        }
                    }
                });
            }
        } catch (error) {
            console.warn('Error in chart cleanup:', error);
        }
    }

    /**
     * Create wealth projection chart with nominal and real values
     */
    public createWealthChart(data: { years: string[], values: number[], realValues?: number[] }): void {
        const canvas = document.getElementById('wealthChart') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const datasets = [
            {
                label: 'Projected Wealth',
                data: data.values,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: false
            }
        ];

        // Add real purchasing power dataset if available
        if (data.realValues) {
            datasets.push({
                label: 'Real Purchasing Power',
                data: data.realValues,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.4,
                fill: false
            } as any);
        }

        this.wealthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.years,
                datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context: any) {
                                return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Timeline'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Amount ($)'
                        },
                        beginAtZero: true,
                        ticks: {
                            callback: function(value: any) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    /**
     * Create health trend chart with dynamic colors
     */
    public createHealthChart(data: { months: string[], scores: number[] }): void {
        const canvas = document.getElementById('healthChart') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Create dynamic colors based on score levels
        const colors = data.scores.map(score => {
            if (score >= 80) return '#10b981'; // Excellent - Green
            if (score >= 60) return '#3b82f6'; // Good - Blue
            if (score >= 40) return '#f59e0b'; // Fair - Orange
            if (score >= 20) return '#f97316'; // Limited - Orange-Red
            return '#ef4444'; // Critical - Red
        });

        const currentScore = data.scores[0] || 0;

        this.healthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.months,
                datasets: [{
                    label: 'Financial Health Score',
                    data: data.scores,
                    borderColor: (context: any) => {
                        const score = context.dataset.data[context.dataIndex];
                        if (score >= 80) return '#10b981';
                        if (score >= 60) return '#3b82f6';
                        if (score >= 40) return '#f59e0b';
                        if (score >= 20) return '#f97316';
                        return '#ef4444';
                    },
                    backgroundColor: currentScore >= 80 ? 'rgba(16, 185, 129, 0.1)' : 
                                   currentScore >= 60 ? 'rgba(59, 130, 246, 0.1)' :
                                   currentScore >= 40 ? 'rgba(245, 158, 11, 0.1)' :
                                   currentScore >= 20 ? 'rgba(249, 115, 22, 0.1)' :
                                   'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: colors,
                    pointBorderColor: colors,
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context: any) {
                                return `Health Score: ${context.parsed.y}/100`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Months'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Health Score'
                        },
                        min: 0,
                        max: 100,
                        ticks: {
                            callback: function(value: any) {
                                return value + '/100';
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    /**
     * Get chart instances for external access
     */
    public getCharts() {
        return {
            wealthChart: this.wealthChart,
            healthChart: this.healthChart
        };
    }
} 