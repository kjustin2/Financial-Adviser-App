import { EconomicScenario, EconomicParameters, MarketDataPoint } from '../types';
import { ECONOMIC_SCENARIOS, getScenarioById } from '../data/economicScenarios';
import { MersenneTwister } from './MonteCarloEngine';

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
    updateInterval: number; // milliseconds
    volatilityAdjustment: number; // multiplier for volatility
    trendPersistence: number; // 0-1, how much trends persist
    shockProbability: number; // probability of market shock per update
    enableSeasonality: boolean;
    enableRegimeChange: boolean;
}

/**
 * Dynamic Market Data Service
 * Generates realistic, time-based market data using economic scenarios
 */
export class DynamicMarketDataService {
    private rng: MersenneTwister;
    private currentScenario: EconomicScenario;
    private currentMarketData: MarketDataPoint;
    private historicalData: MarketDataPoint[] = [];
    private updateConfig: UpdateConfig;
    private isRunning: boolean = false;
    private updateInterval?: NodeJS.Timeout;
    private subscribers: Array<(data: MarketDataPoint) => void> = [];
    
    // Market state tracking
    private trendDirection: number = 0; // -1 to 1
    private volatilityRegime: 'low' | 'medium' | 'high' = 'medium';

    constructor(
        initialScenario: EconomicScenario = ECONOMIC_SCENARIOS[0],
        config: Partial<UpdateConfig> = {},
        seed?: number
    ) {
        this.rng = new MersenneTwister(seed);
        this.currentScenario = initialScenario;
        
        this.updateConfig = {
            updateInterval: 60000, // 1 minute
            volatilityAdjustment: 1.0,
            trendPersistence: 0.7,
            shockProbability: 0.001,
            enableSeasonality: true,
            enableRegimeChange: true,
            ...config
        };

        // Initialize with first data point
        this.currentMarketData = this.generateInitialDataPoint();
        this.historicalData.push(this.currentMarketData);
    }

    /**
     * Generate initial market data point
     */
    private generateInitialDataPoint(): MarketDataPoint {
        const params = this.currentScenario.parameters;
        const basePrice = 100; // Normalized base price
        
        return {
            timestamp: new Date(),
            marketPrice: basePrice,
            volatility: params.marketReturn.volatility,
            volume: 1000000 * (1 + this.rng.random() * 0.5),
            marketReturn: 0,
            inflationRate: params.inflationRate.mean,
            interestRates: { ...params.interestRates },
            economicIndicators: {
                gdpGrowth: params.gdpGrowth.mean,
                unemployment: params.unemployment.rate,
                currencyVolatility: params.currencyVolatility
            },
            scenarioId: this.currentScenario.id,
            marketCondition: this.determineMarketCondition(params)
        };
    }

    /**
     * Determine market condition based on parameters
     */
    private determineMarketCondition(params: EconomicParameters): 'bull' | 'bear' | 'sideways' | 'volatile' {
        const returnMean = params.marketReturn.mean;
        const volatility = params.marketReturn.volatility;
        
        if (returnMean > 0.06 && volatility < 0.2) return 'bull';
        if (returnMean < -0.02) return 'bear';
        if (volatility > 0.25) return 'volatile';
        return 'sideways';
    }

    /**
     * Generate comprehensive time series data
     */
    public generateTimeSeries(
        startDate: Date,
        endDate: Date,
        frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' = 'daily'
    ): TimeSeriesData {
        const data: MarketDataPoint[] = [];
        const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
        
        let frequencyDays: number;
        switch (frequency) {
            case 'daily': frequencyDays = 1; break;
            case 'weekly': frequencyDays = 7; break;
            case 'monthly': frequencyDays = 30; break;
            case 'quarterly': frequencyDays = 90; break;
        }
        
        const points = Math.floor(totalDays / frequencyDays);
        let currentPrice = 100;
        let currentDate = new Date(startDate);
        
        // Initialize tracking variables
        let cumulativeReturn = 1;
        let returns: number[] = [];
        let maxPrice = currentPrice;
        let maxDrawdown = 0;
        
        for (let i = 0; i < points; i++) {
            const dayOfYear = this.getDayOfYear(currentDate);
            const marketData = this.generateNextDataPoint(currentPrice, currentDate, dayOfYear, i);
            
            data.push(marketData);
            
            // Update tracking variables
            const periodReturn = marketData.marketReturn;
            returns.push(periodReturn);
            cumulativeReturn *= (1 + periodReturn);
            currentPrice = marketData.marketPrice;
            
            if (currentPrice > maxPrice) {
                maxPrice = currentPrice;
            } else {
                const drawdown = (maxPrice - currentPrice) / maxPrice;
                maxDrawdown = Math.max(maxDrawdown, drawdown);
            }
            
            // Advance date
            currentDate = new Date(currentDate.getTime() + frequencyDays * 24 * 60 * 60 * 1000);
        }
        
        // Calculate metadata
        const averageReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
        const returnStd = Math.sqrt(
            returns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / returns.length
        );
        const averageVolatility = data.reduce((sum, point) => sum + point.volatility, 0) / data.length;
        const sharpeRatio = returnStd > 0 ? averageReturn / returnStd : 0;
        
        return {
            data,
            startDate,
            endDate,
            frequency,
            scenario: this.currentScenario,
            metadata: {
                totalPoints: data.length,
                averageReturn: averageReturn * 252, // Annualized
                averageVolatility,
                maxDrawdown,
                sharpeRatio
            }
        };
    }

    /**
     * Generate next data point with sophisticated modeling
     */
    private generateNextDataPoint(
        previousPrice: number,
        currentDate: Date,
        dayOfYear: number,
        _timeIndex: number
    ): MarketDataPoint {
        const params = this.currentScenario.parameters;
        
        // Base return with mean reversion
        let baseReturn = params.marketReturn.mean / 252; // Daily return
        
        // Apply seasonality if enabled
        if (this.updateConfig.enableSeasonality) {
            baseReturn *= this.calculateSeasonality(dayOfYear);
        }
        
        // Apply trend persistence
        baseReturn += this.trendDirection * this.updateConfig.trendPersistence * 0.001;
        
        // Generate random component with current volatility
        const volatilityMultiplier = this.getVolatilityMultiplier();
        const dailyVol = params.marketReturn.volatility / Math.sqrt(252) * volatilityMultiplier;
        const randomComponent = (this.rng.random() - 0.5) * 2 * dailyVol;
        
        // Apply market shocks
        const shockComponent = this.applyMarketShocks(params);
        
        // Final return calculation
        let returnValue = baseReturn + randomComponent + shockComponent;
        
        // Update market dynamics
        this.updateTrendDirection(returnValue);
        this.updateVolatilityRegime(Math.abs(returnValue));
        
        // Calculate new price
        const newPrice = previousPrice * (1 + returnValue);
        
        // Update economic indicators with some persistence
        const updatedIndicators = this.updateEconomicIndicators(params);
        
        return {
            timestamp: new Date(currentDate),
            marketPrice: newPrice,
            volatility: dailyVol * Math.sqrt(252), // Annualized
            volume: 1000000 * (1 + this.rng.random() * 0.5), // Random volume
            marketReturn: returnValue,
            inflationRate: updatedIndicators.inflationRate,
            interestRates: updatedIndicators.interestRates,
            economicIndicators: updatedIndicators.economicIndicators,
            scenarioId: this.currentScenario.id,
            marketCondition: this.determineCurrentMarketCondition(returnValue, dailyVol)
        };
    }

    /**
     * Calculate seasonal effects
     */
    private calculateSeasonality(dayOfYear: number): number {
        // Simple seasonality model: January effect + year-end rally
        const janEffect = dayOfYear <= 31 ? 1.05 : 1.0;
        const yearEndEffect = dayOfYear >= 330 ? 1.03 : 1.0;
        return janEffect * yearEndEffect;
    }

    /**
     * Get volatility multiplier based on regime
     */
    private getVolatilityMultiplier(): number {
        switch (this.volatilityRegime) {
            case 'low': return 0.7;
            case 'medium': return 1.0;
            case 'high': return 1.5;
            default: return 1.0;
        }
    }

    /**
     * Apply market shock events
     */
    private applyMarketShocks(params: EconomicParameters): number {
        if (this.rng.random() < this.updateConfig.shockProbability) {
            // Shock magnitude based on scenario stress level
            const shockMagnitude = params.marketReturn.volatility * (1 + this.rng.random()) * 3;
            return this.rng.random() < 0.5 ? -shockMagnitude : shockMagnitude;
        }
        return 0;
    }

    /**
     * Update trend direction with momentum
     */
    private updateTrendDirection(returnValue: number): void {
        const momentum = 0.1;
        const meanReversion = 0.05;
        
        // Update trend based on recent returns
        this.trendDirection = this.trendDirection * (1 - momentum - meanReversion) +
                            Math.sign(returnValue) * momentum -
                            this.trendDirection * meanReversion;
        
        // Clamp to [-1, 1]
        this.trendDirection = Math.max(-1, Math.min(1, this.trendDirection));
    }

    /**
     * Update volatility regime based on recent activity
     */
    private updateVolatilityRegime(absReturn: number): void {
        const highVolThreshold = 0.02; // 2% daily move
        const lowVolThreshold = 0.005;  // 0.5% daily move
        
        if (absReturn > highVolThreshold) {
            this.volatilityRegime = 'high';
        } else if (absReturn < lowVolThreshold) {
            this.volatilityRegime = 'low';
        } else {
            this.volatilityRegime = 'medium';
        }
    }

    /**
     * Update economic indicators with realistic persistence
     */
    private updateEconomicIndicators(params: EconomicParameters): {
        inflationRate: number;
        interestRates: typeof params.interestRates;
        economicIndicators: {
            gdpGrowth: number;
            unemployment: number;
            currencyVolatility: number;
        };
    } {
        const persistence = 0.95; // High persistence for economic indicators
        const previousData = this.historicalData[this.historicalData.length - 1];
        
        // Inflation rate with mean reversion
        let newInflation = previousData?.inflationRate || params.inflationRate.mean;
        newInflation = newInflation * persistence + 
                      params.inflationRate.mean * (1 - persistence) +
                      (this.rng.random() - 0.5) * params.inflationRate.volatility * 0.1;
        newInflation = Math.max(params.inflationRate.min, 
                               Math.min(params.inflationRate.max, newInflation));
        
        // Interest rates with central bank reaction function
        const inflationGap = newInflation - 0.02; // Target inflation 2%
        const federalFunds = Math.max(0, params.interestRates.federalFunds + inflationGap * 1.5);
        
        return {
            inflationRate: newInflation,
            interestRates: {
                shortTerm: federalFunds + 0.005,
                longTerm: federalFunds + 0.025,
                federalFunds
            },
            economicIndicators: {
                gdpGrowth: params.gdpGrowth.mean + (this.rng.random() - 0.5) * params.gdpGrowth.volatility,
                unemployment: params.unemployment.rate * (1 + (this.rng.random() - 0.5) * 0.1),
                currencyVolatility: params.currencyVolatility * (0.8 + this.rng.random() * 0.4)
            }
        };
    }

    /**
     * Determine current market condition
     */
    private determineCurrentMarketCondition(
        returnValue: number, 
        volatility: number
    ): 'bull' | 'bear' | 'sideways' | 'volatile' {
        const annualizedReturn = returnValue * 252;
        const annualizedVol = volatility * Math.sqrt(252);
        
        if (annualizedVol > 0.3) return 'volatile';
        if (annualizedReturn > 0.1) return 'bull';
        if (annualizedReturn < -0.05) return 'bear';
        return 'sideways';
    }

    /**
     * Get day of year for seasonality calculations
     */
    private getDayOfYear(date: Date): number {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date.getTime() - start.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    /**
     * Switch to a different economic scenario
     */
    public switchScenario(scenarioId: string): void {
        const newScenario = getScenarioById(scenarioId);
        if (newScenario) {
            this.currentScenario = newScenario;
            console.log(`Switched to scenario: ${newScenario.name}`);
        }
    }

    /**
     * Start real-time updates
     */
    public startRealTimeUpdates(): void {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.updateInterval = setInterval(() => {
            this.generateRealTimeUpdate();
        }, this.updateConfig.updateInterval);
        
        console.log('Real-time market data updates started');
    }

    /**
     * Stop real-time updates
     */
    public stopRealTimeUpdates(): void {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = undefined;
        }
        this.isRunning = false;
        console.log('Real-time market data updates stopped');
    }

    /**
     * Generate real-time update
     */
    private generateRealTimeUpdate(): void {
        const currentDate = new Date();
        const dayOfYear = this.getDayOfYear(currentDate);
        const timeIndex = this.historicalData.length;
        
        const newData = this.generateNextDataPoint(
            this.currentMarketData.marketPrice,
            currentDate,
            dayOfYear,
            timeIndex
        );
        
        this.currentMarketData = newData;
        this.historicalData.push(newData);
        
        // Limit historical data to prevent memory issues
        if (this.historicalData.length > 10000) {
            this.historicalData = this.historicalData.slice(-5000);
        }
        
        // Notify subscribers
        this.notifySubscribers(newData);
    }

    /**
     * Subscribe to real-time updates
     */
    public subscribe(callback: (data: MarketDataPoint) => void): () => void {
        this.subscribers.push(callback);
        
        // Return unsubscribe function
        return () => {
            const index = this.subscribers.indexOf(callback);
            if (index > -1) {
                this.subscribers.splice(index, 1);
            }
        };
    }

    /**
     * Notify all subscribers of new data
     */
    private notifySubscribers(data: MarketDataPoint): void {
        this.subscribers.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error('Error in market data subscriber:', error);
            }
        });
    }

    /**
     * Get current market data
     */
    public getCurrentData(): MarketDataPoint {
        return { ...this.currentMarketData };
    }

    /**
     * Get historical data
     */
    public getHistoricalData(limit?: number): MarketDataPoint[] {
        if (limit) {
            return this.historicalData.slice(-limit);
        }
        return [...this.historicalData];
    }

    /**
     * Get market statistics for current session
     */
    public getMarketStatistics(): {
        totalDataPoints: number;
        averageReturn: number;
        volatility: number;
        maxDrawdown: number;
        currentTrend: number;
        volatilityRegime: string;
        totalReturnPercent: number;
    } {
        if (this.historicalData.length < 2) {
            return {
                totalDataPoints: this.historicalData.length,
                averageReturn: 0,
                volatility: 0,
                maxDrawdown: 0,
                currentTrend: this.trendDirection,
                volatilityRegime: this.volatilityRegime,
                totalReturnPercent: 0
            };
        }
        
        const returns = this.historicalData.slice(1).map((point) => point.marketReturn);
        const averageReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
        const volatility = Math.sqrt(
            returns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / returns.length
        );
        
        // Calculate max drawdown
        let maxPrice = this.historicalData[0].marketPrice;
        let maxDrawdown = 0;
        
        for (const point of this.historicalData) {
            if (point.marketPrice > maxPrice) {
                maxPrice = point.marketPrice;
            } else {
                const drawdown = (maxPrice - point.marketPrice) / maxPrice;
                maxDrawdown = Math.max(maxDrawdown, drawdown);
            }
        }
        
        const totalReturn = (this.currentMarketData.marketPrice / this.historicalData[0].marketPrice - 1) * 100;
        
        return {
            totalDataPoints: this.historicalData.length,
            averageReturn: averageReturn * 252, // Annualized
            volatility: volatility * Math.sqrt(252), // Annualized
            maxDrawdown,
            currentTrend: this.trendDirection,
            volatilityRegime: this.volatilityRegime,
            totalReturnPercent: totalReturn
        };
    }

    /**
     * Export data for analysis
     */
    public exportData() {
        return {
            scenario: this.currentScenario,
            data: [...this.historicalData],
            statistics: this.getMarketStatistics(),
            config: { ...this.updateConfig }
        };
    }
} 