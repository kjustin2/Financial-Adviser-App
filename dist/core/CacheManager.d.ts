/**
 * Comprehensive Local Data Caching and Storage System
 * Provides high-performance caching for financial simulations, scenarios, and analysis results
 */
import { CacheManager, CacheStats, CacheMetrics, StorageOptions, CacheConfiguration, CacheEvent, DataTypeConfig, SimulationResult, MarketDataPoint } from '../types.js';
/**
 * Default cache configuration
 */
export declare const DEFAULT_CACHE_CONFIG: CacheConfiguration;
/**
 * Enhanced Local Storage Cache Manager
 */
export declare class LocalStorageCacheManager implements CacheManager {
    private config;
    private storagePrefix;
    private metricsKey;
    private eventListeners;
    private cleanupInterval;
    private metrics;
    constructor(config?: Partial<CacheConfiguration>);
    private mergeConfig;
    private initializeMetrics;
    private saveMetrics;
    private initializeCleanup;
    private emit;
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, data: T, options?: Partial<StorageOptions>): Promise<void>;
    delete(key: string): Promise<boolean>;
    clear(): Promise<void>;
    has(key: string): Promise<boolean>;
    getStats(): Promise<CacheStats>;
    cleanup(): Promise<number>;
    getMetrics(): CacheMetrics;
    addEventListener(listener: (event: CacheEvent) => void): void;
    removeEventListener(listener: (event: CacheEvent) => void): void;
    destroy(): void;
}
/**
 * Specialized cache managers for different data types
 */
export declare class SimulationCacheManager {
    private cache;
    private config;
    constructor(cache: CacheManager, config?: Partial<DataTypeConfig>);
    getSimulation(scenarioId: string, investmentParams: any, configParams: any): Promise<SimulationResult | null>;
    saveSimulation(scenarioId: string, investmentParams: any, configParams: any, result: SimulationResult): Promise<void>;
    private generateSimulationKey;
}
export declare class MarketDataCacheManager {
    private cache;
    private config;
    constructor(cache: CacheManager, config?: Partial<DataTypeConfig>);
    getMarketData(scenarioId: string, dateRange: {
        start: Date;
        end: Date;
    }): Promise<MarketDataPoint[] | null>;
    saveMarketData(scenarioId: string, dateRange: {
        start: Date;
        end: Date;
    }, data: MarketDataPoint[]): Promise<void>;
    private generateMarketDataKey;
}
/**
 * Factory for creating cache managers
 */
export declare class CacheManagerFactory {
    static createLocalStorageManager(config?: Partial<CacheConfiguration>): LocalStorageCacheManager;
    static createSimulationManager(cache: CacheManager, config?: Partial<DataTypeConfig>): SimulationCacheManager;
    static createMarketDataManager(cache: CacheManager, config?: Partial<DataTypeConfig>): MarketDataCacheManager;
}
export declare const globalCacheManager: LocalStorageCacheManager;
export declare const simulationCache: SimulationCacheManager;
export declare const marketDataCache: MarketDataCacheManager;
//# sourceMappingURL=CacheManager.d.ts.map