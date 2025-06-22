import { EconomicScenario, MarketDataPoint } from '../types';
/**
 * Time Series Data Interface
 */
export interface TimeSeriesData {
    data: MarketDataPoint[];
    startDate: Date;
    endDate: Date;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    scenario: EconomicScenario;
    metadata: {
        totalPoints: number;
        averageReturn: number;
        averageVolatility: number;
        maxDrawdown: number;
        sharpeRatio: number;
    };
}
/**
 * Real-time Update Configuration
 */
export interface UpdateConfig {
    updateInterval: number;
    volatilityAdjustment: number;
    trendPersistence: number;
    shockProbability: number;
    enableSeasonality: boolean;
    enableRegimeChange: boolean;
}
interface EconomicIndicator {
    name: string;
    value: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
    lastUpdated: string;
}
/**
 * Dynamic Market Data Service
 * Generates realistic, time-based market data using economic scenarios
 */
export declare class DynamicMarketDataService {
    private rng;
    private currentScenario;
    private currentMarketData;
    private historicalData;
    private updateConfig;
    private isRunning;
    private updateInterval?;
    private subscribers;
    private trendDirection;
    private volatilityRegime;
    constructor(initialScenario?: EconomicScenario, config?: Partial<UpdateConfig>, seed?: number);
    /**
     * Generate initial market data point
     */
    private generateInitialDataPoint;
    /**
     * Determine market condition based on parameters
     */
    private determineMarketCondition;
    /**
     * Generate comprehensive time series data
     */
    generateTimeSeries(startDate: Date, endDate: Date, frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly'): TimeSeriesData;
    /**
     * Generate next data point with sophisticated modeling
     */
    private generateNextDataPoint;
    /**
     * Calculate seasonal effects
     */
    private calculateSeasonality;
    /**
     * Get volatility multiplier based on regime
     */
    private getVolatilityMultiplier;
    /**
     * Apply market shock events
     */
    private applyMarketShocks;
    /**
     * Update trend direction with momentum
     */
    private updateTrendDirection;
    /**
     * Update volatility regime based on recent activity
     */
    private updateVolatilityRegime;
    /**
     * Update economic indicators with realistic persistence
     */
    private updateEconomicIndicators;
    /**
     * Determine current market condition
     */
    private determineCurrentMarketCondition;
    /**
     * Get day of year for seasonality calculations
     */
    private getDayOfYear;
    /**
     * Switch to a different economic scenario
     */
    switchScenario(scenarioId: string): void;
    /**
     * Start real-time updates
     */
    startRealTimeUpdates(): void;
    /**
     * Stop real-time updates
     */
    stopRealTimeUpdates(): void;
    /**
     * Generate real-time update
     */
    private generateRealTimeUpdate;
    /**
     * Subscribe to real-time updates
     */
    subscribe(callback: (data: MarketDataPoint) => void): () => void;
    /**
     * Notify all subscribers of new data
     */
    private notifySubscribers;
    /**
     * Get current market data
     */
    getCurrentData(): MarketDataPoint;
    /**
     * Get historical data
     */
    getHistoricalData(limit?: number): MarketDataPoint[];
    /**
     * Get market statistics for current session
     */
    getMarketStatistics(): {
        totalDataPoints: number;
        averageReturn: number;
        volatility: number;
        maxDrawdown: number;
        currentTrend: number;
        volatilityRegime: string;
        totalReturnPercent: number;
    };
    /**
     * Export data for analysis
     */
    exportData(): {
        scenario: EconomicScenario;
        data: MarketDataPoint[];
        statistics: {
            totalDataPoints: number;
            averageReturn: number;
            volatility: number;
            maxDrawdown: number;
            currentTrend: number;
            volatilityRegime: string;
            totalReturnPercent: number;
        };
        config: {
            updateInterval: number;
            volatilityAdjustment: number;
            trendPersistence: number;
            shockProbability: number;
            enableSeasonality: boolean;
            enableRegimeChange: boolean;
        };
    };
    generateMockMarketData(): Promise<MarketDataPoint[]>;
    generateMockEconomicData(): Promise<EconomicIndicator[]>;
}
export {};
//# sourceMappingURL=DynamicMarketDataService.d.ts.map