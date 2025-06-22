/**
 * Comprehensive Local Data Caching and Storage System
 * Provides high-performance caching for financial simulations, scenarios, and analysis results
 */

import {
    CacheManager,
    CacheEntry,
    CacheStats,
    CacheMetrics,
    StorageOptions,
    CacheConfiguration,
    CacheEvent,
    DataTypeConfig,
    SimulationResult,
    MarketDataPoint
} from '../types.js';

/**
 * Utility class for hashing and compression
 */
class CacheUtils {
    static hash(data: any): string {
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    static compress(data: any): string {
        return btoa(JSON.stringify(data));
    }

    static decompress(compressedData: string): any {
        try {
            return JSON.parse(atob(compressedData));
        } catch (error) {
            throw new Error('Failed to decompress data: ' + error);
        }
    }

    static calculateSize(data: any): number {
        return new Blob([JSON.stringify(data)]).size;
    }

    static isExpired(entry: CacheEntry): boolean {
        if (!entry.expirationTime) return false;
        return new Date() > entry.expirationTime;
    }
}

/**
 * Default cache configuration
 */
export const DEFAULT_CACHE_CONFIG: CacheConfiguration = {
    global: {
        maxSize: 100 * 1024 * 1024, // 100MB
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        compression: true,
        encryption: false,
        autoCleanup: true,
        cleanupInterval: 60 * 60 * 1000 // 1 hour
    },
    dataTypes: {
        simulations: {
            maxAge: 4 * 60 * 60 * 1000, // 4 hours
            maxEntries: 100,
            priority: 'high',
            compressionLevel: 7,
            autoRefresh: false,
            refreshThreshold: 2 * 60 * 60 * 1000 // 2 hours
        },
        scenarios: {
            maxAge: 8 * 60 * 60 * 1000, // 8 hours
            maxEntries: 50,
            priority: 'high',
            compressionLevel: 6,
            autoRefresh: false,
            refreshThreshold: 4 * 60 * 60 * 1000 // 4 hours
        },
        marketData: {
            maxAge: 15 * 60 * 1000, // 15 minutes
            maxEntries: 200,
            priority: 'critical',
            compressionLevel: 5,
            autoRefresh: true,
            refreshThreshold: 5 * 60 * 1000 // 5 minutes
        },
        userAnalysis: {
            maxAge: 2 * 60 * 60 * 1000, // 2 hours
            maxEntries: 30,
            priority: 'medium',
            compressionLevel: 6,
            autoRefresh: false,
            refreshThreshold: 60 * 60 * 1000 // 1 hour
        },
        behaviorAnalysis: {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            maxEntries: 20,
            priority: 'medium',
            compressionLevel: 6,
            autoRefresh: false,
            refreshThreshold: 12 * 60 * 60 * 1000 // 12 hours
        },
        temporaryResults: {
            maxAge: 30 * 60 * 1000, // 30 minutes
            maxEntries: 50,
            priority: 'low',
            compressionLevel: 3,
            autoRefresh: false,
            refreshThreshold: 15 * 60 * 1000 // 15 minutes
        }
    }
};

/**
 * Enhanced Local Storage Cache Manager
 */
export class LocalStorageCacheManager implements CacheManager {
    private config: CacheConfiguration;
    private storagePrefix: string = 'financial_analyzer_cache_';
    private metricsKey: string = 'cache_metrics';
    private eventListeners: ((event: CacheEvent) => void)[] = [];
    private cleanupInterval: NodeJS.Timeout | null = null;
    private metrics: CacheMetrics;

    constructor(config: Partial<CacheConfiguration> = {}) {
        this.config = this.mergeConfig(config);
        this.metrics = this.initializeMetrics();
        this.initializeCleanup();
    }

    private mergeConfig(userConfig: Partial<CacheConfiguration>): CacheConfiguration {
        return {
            global: { ...DEFAULT_CACHE_CONFIG.global, ...userConfig.global },
            dataTypes: { 
                ...DEFAULT_CACHE_CONFIG.dataTypes, 
                ...userConfig.dataTypes 
            }
        };
    }

    private initializeMetrics(): CacheMetrics {
        const stored = localStorage.getItem(this.storagePrefix + this.metricsKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                // Fallback to default
            }
        }

        return {
            operations: {
                gets: 0,
                sets: 0,
                deletes: 0,
                hits: 0,
                misses: 0
            },
            performance: {
                averageGetTime: 0,
                averageSetTime: 0,
                averageDeleteTime: 0
            },
            storage: {
                currentSize: 0,
                maxSize: this.config.global.maxSize,
                utilizationPercent: 0,
                fragmentationPercent: 0
            },
            lifecycle: {
                totalExpiredEntries: 0,
                totalCleanupOperations: 0,
                lastCleanup: new Date()
            }
        };
    }

    private saveMetrics(): void {
        try {
            localStorage.setItem(
                this.storagePrefix + this.metricsKey,
                JSON.stringify(this.metrics)
            );
        } catch (error) {
            console.warn('Failed to save cache metrics:', error);
        }
    }

    private initializeCleanup(): void {
        if (this.config.global.autoCleanup) {
            this.cleanupInterval = setInterval(() => {
                this.cleanup();
            }, this.config.global.cleanupInterval);
        }
    }

    private emit(event: CacheEvent): void {
        this.eventListeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.warn('Cache event listener error:', error);
            }
        });
    }

    async get<T>(key: string): Promise<T | null> {
        const startTime = Date.now();
        
        try {
            const fullKey = this.storagePrefix + key;
            const stored = localStorage.getItem(fullKey);
            
            this.metrics.operations.gets++;
            
            if (!stored) {
                this.metrics.operations.misses++;
                this.emit({ type: 'miss', key, timestamp: new Date() });
                return null;
            }

            const entry: CacheEntry<T> = JSON.parse(stored);
            
            if (CacheUtils.isExpired(entry)) {
                await this.delete(key);
                this.metrics.operations.misses++;
                this.metrics.lifecycle.totalExpiredEntries++;
                this.emit({ type: 'expire', key, timestamp: new Date() });
                return null;
            }

            this.metrics.operations.hits++;
            this.emit({ type: 'hit', key, timestamp: new Date() });
            
            const data = this.config.global.compression ? 
                CacheUtils.decompress(entry.data as any) : entry.data;
            
            return data;
        } catch (error) {
            console.warn('Cache get error:', error);
            this.metrics.operations.misses++;
            return null;
        } finally {
            const time = Date.now() - startTime;
            const ops = this.metrics.operations;
            this.metrics.performance.averageGetTime = ((this.metrics.performance.averageGetTime * (ops.gets - 1)) + time) / ops.gets;
            this.saveMetrics();
        }
    }

    async set<T>(key: string, data: T, options: Partial<StorageOptions> = {}): Promise<void> {
        const startTime = Date.now();
        
        try {
            const opts = { ...this.config.global, ...options };
            const dataSize = CacheUtils.calculateSize(data);
            
            if (dataSize > opts.maxSize) {
                throw new Error('Data size exceeds maximum cache size');
            }

            const entry: CacheEntry<T> = {
                key,
                data: opts.compression ? CacheUtils.compress(data) as any : data,
                timestamp: new Date(),
                expirationTime: opts.maxAge ? new Date(Date.now() + opts.maxAge) : undefined,
                metadata: {
                    version: '1.0.0',
                    dataSize,
                    source: 'cache-manager',
                    tags: []
                }
            };

            const fullKey = this.storagePrefix + key;
            localStorage.setItem(fullKey, JSON.stringify(entry));
            
            this.metrics.operations.sets++;
            this.emit({ type: 'set', key, timestamp: new Date() });
            
        } catch (error) {
            console.error('Cache set error:', error);
            throw error;
        } finally {
            const time = Date.now() - startTime;
            const ops = this.metrics.operations;
            this.metrics.performance.averageSetTime = ((this.metrics.performance.averageSetTime * (ops.sets - 1)) + time) / ops.sets;
            this.saveMetrics();
        }
    }

    async delete(key: string): Promise<boolean> {
        const startTime = Date.now();
        
        try {
            const fullKey = this.storagePrefix + key;
            const existed = localStorage.getItem(fullKey) !== null;
            
            if (existed) {
                localStorage.removeItem(fullKey);
                this.metrics.operations.deletes++;
                this.emit({ type: 'delete', key, timestamp: new Date() });
            }
            
            return existed;
        } catch (error) {
            console.warn('Cache delete error:', error);
            return false;
        } finally {
            const time = Date.now() - startTime;
            const ops = this.metrics.operations;
            this.metrics.performance.averageDeleteTime = ((this.metrics.performance.averageDeleteTime * (ops.deletes - 1)) + time) / ops.deletes;
            this.saveMetrics();
        }
    }

    async clear(): Promise<void> {
        try {
            const keysToRemove: string[] = [];
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.storagePrefix)) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            
            this.metrics.storage.currentSize = 0;
            this.metrics.storage.utilizationPercent = 0;
            this.saveMetrics();
            
        } catch (error) {
            console.error('Cache clear error:', error);
            throw error;
        }
    }

    async has(key: string): Promise<boolean> {
        try {
            const fullKey = this.storagePrefix + key;
            const stored = localStorage.getItem(fullKey);
            
            if (!stored) return false;
            
            const entry: CacheEntry = JSON.parse(stored);
            return !CacheUtils.isExpired(entry);
        } catch (error) {
            return false;
        }
    }

    async getStats(): Promise<CacheStats> {
        try {
            const entries: CacheEntry[] = [];
            let totalSize = 0;
            let expiredCount = 0;
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.storagePrefix) && key !== this.storagePrefix + this.metricsKey) {
                    const stored = localStorage.getItem(key);
                    if (stored) {
                        try {
                            const entry: CacheEntry = JSON.parse(stored);
                            entries.push(entry);
                            totalSize += entry.metadata.dataSize;
                            
                            if (CacheUtils.isExpired(entry)) {
                                expiredCount++;
                            }
                        } catch {
                            // Skip malformed entries
                        }
                    }
                }
            }
            
            const totalOps = this.metrics.operations.hits + this.metrics.operations.misses;
            const hitRate = totalOps > 0 ? this.metrics.operations.hits / totalOps : 0;
            
            return {
                totalEntries: entries.length,
                totalSize,
                hitRate,
                missRate: 1 - hitRate,
                oldestEntry: entries.length > 0 ? 
                    new Date(Math.min(...entries.map(e => e.timestamp.getTime()))) : 
                    new Date(),
                newestEntry: entries.length > 0 ? 
                    new Date(Math.max(...entries.map(e => e.timestamp.getTime()))) : 
                    new Date(),
                expiredEntries: expiredCount
            };
        } catch (error) {
            console.error('Error getting cache stats:', error);
            throw error;
        }
    }

    async cleanup(): Promise<number> {
        try {
            let cleanedCount = 0;
            const keysToRemove: string[] = [];
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.storagePrefix) && key !== this.storagePrefix + this.metricsKey) {
                    const stored = localStorage.getItem(key);
                    if (stored) {
                        try {
                            const entry: CacheEntry = JSON.parse(stored);
                            if (CacheUtils.isExpired(entry)) {
                                keysToRemove.push(key);
                            }
                        } catch {
                            keysToRemove.push(key);
                        }
                    }
                }
            }
            
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
                cleanedCount++;
            });
            
            if (cleanedCount > 0) {
                this.metrics.lifecycle.totalExpiredEntries += cleanedCount;
                this.metrics.lifecycle.totalCleanupOperations++;
                this.metrics.lifecycle.lastCleanup = new Date();
                
                this.emit({ 
                    type: 'cleanup', 
                    key: `cleaned_${cleanedCount}_entries`, 
                    timestamp: new Date()
                });
            }
            
            return cleanedCount;
        } catch (error) {
            console.error('Cache cleanup error:', error);
            return 0;
        }
    }

    getMetrics(): CacheMetrics {
        return { ...this.metrics };
    }

    addEventListener(listener: (event: CacheEvent) => void): void {
        this.eventListeners.push(listener);
    }

    removeEventListener(listener: (event: CacheEvent) => void): void {
        const index = this.eventListeners.indexOf(listener);
        if (index > -1) {
            this.eventListeners.splice(index, 1);
        }
    }

    destroy(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        this.eventListeners = [];
    }
}

/**
 * Specialized cache managers for different data types
 */
export class SimulationCacheManager {
    private cache: CacheManager;
    private config: DataTypeConfig;

    constructor(cache: CacheManager, config?: Partial<DataTypeConfig>) {
        this.cache = cache;
        this.config = { ...DEFAULT_CACHE_CONFIG.dataTypes.simulations, ...config };
    }

    async getSimulation(scenarioId: string, investmentParams: any, configParams: any): Promise<SimulationResult | null> {
        const key = this.generateSimulationKey(scenarioId, investmentParams, configParams);
        return await this.cache.get<SimulationResult>(key);
    }

    async saveSimulation(
        scenarioId: string, 
        investmentParams: any, 
        configParams: any, 
        result: SimulationResult
    ): Promise<void> {
        const key = this.generateSimulationKey(scenarioId, investmentParams, configParams);
        await this.cache.set(key, result, { maxAge: this.config.maxAge });
    }

    private generateSimulationKey(scenarioId: string, investmentParams: any, configParams: any): string {
        const paramsHash = CacheUtils.hash(investmentParams);
        const configHash = CacheUtils.hash(configParams);
        return `simulation_${scenarioId}_${paramsHash}_${configHash}`;
    }
}

export class MarketDataCacheManager {
    private cache: CacheManager;
    private config: DataTypeConfig;

    constructor(cache: CacheManager, config?: Partial<DataTypeConfig>) {
        this.cache = cache;
        this.config = { ...DEFAULT_CACHE_CONFIG.dataTypes.marketData, ...config };
    }

    async getMarketData(scenarioId: string, dateRange: { start: Date; end: Date }): Promise<MarketDataPoint[] | null> {
        const key = this.generateMarketDataKey(scenarioId, dateRange);
        return await this.cache.get<MarketDataPoint[]>(key);
    }

    async saveMarketData(
        scenarioId: string, 
        dateRange: { start: Date; end: Date }, 
        data: MarketDataPoint[]
    ): Promise<void> {
        const key = this.generateMarketDataKey(scenarioId, dateRange);
        await this.cache.set(key, data, { maxAge: this.config.maxAge });
    }

    private generateMarketDataKey(scenarioId: string, dateRange: { start: Date; end: Date }): string {
        const startStr = dateRange.start.toISOString().split('T')[0];
        const endStr = dateRange.end.toISOString().split('T')[0];
        return `market_data_${scenarioId}_${startStr}_${endStr}`;
    }
}

/**
 * Factory for creating cache managers
 */
export class CacheManagerFactory {
    static createLocalStorageManager(config?: Partial<CacheConfiguration>): LocalStorageCacheManager {
        return new LocalStorageCacheManager(config);
    }

    static createSimulationManager(cache: CacheManager, config?: Partial<DataTypeConfig>): SimulationCacheManager {
        return new SimulationCacheManager(cache, config);
    }

    static createMarketDataManager(cache: CacheManager, config?: Partial<DataTypeConfig>): MarketDataCacheManager {
        return new MarketDataCacheManager(cache, config);
    }
}

// Global cache instance
export const globalCacheManager = CacheManagerFactory.createLocalStorageManager();
export const simulationCache = CacheManagerFactory.createSimulationManager(globalCacheManager);
export const marketDataCache = CacheManagerFactory.createMarketDataManager(globalCacheManager); 