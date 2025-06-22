import { SimulationResult, EconomicScenario, VolatilityMetrics, VolatilityAnalysis } from '../types';

/**
 * Market Volatility Analysis Engine
 * Provides comprehensive volatility analysis across different economic scenarios
 */
export class VolatilityEngine {
    
    /**
     * Calculate comprehensive volatility metrics for a simulation result
     */
    calculateVolatilityMetrics(result: SimulationResult): VolatilityMetrics {
        const returns = this.calculateReturns(result.results);
        
        // Basic volatility metrics
        const historicalVolatility = this.calculateHistoricalVolatility(returns);
        const realizedVolatility = this.calculateRealizedVolatility(returns);
        const impliedVolatility = this.estimateImpliedVolatility(returns);
        
        // Advanced volatility metrics
        const volatilityOfVolatility = this.calculateVolatilityOfVolatility(returns);
        const volatilityClustering = this.detectVolatilityClustering(returns);
        const downSideVolatility = this.calculateDownsideVolatility(returns);
        const upSideVolatility = this.calculateUpsideVolatility(returns);
        
        // Time-based volatility
        const intraday = this.calculateIntradayVolatility(returns);
        const monthly = this.calculateMonthlyVolatility(returns);
        const quarterly = this.calculateQuarterlyVolatility(returns);
        const annual = this.calculateAnnualVolatility(returns);
        
        // Risk metrics
        const volatilitySkew = this.calculateVolatilitySkew(returns);
        const volatilityKurtosis = this.calculateVolatilityKurtosis(returns);
        const correlationBreakdown = this.analyzeCorrelationBreakdown(returns);
        
        return {
            basic: {
                historicalVolatility,
                realizedVolatility,
                impliedVolatility
            },
            advanced: {
                volatilityOfVolatility,
                volatilityClustering,
                downSideVolatility,
                upSideVolatility
            },
            timeBased: {
                intraday,
                monthly,
                quarterly,
                annual
            },
            riskMetrics: {
                volatilitySkew,
                volatilityKurtosis,
                correlationBreakdown
            }
        };
    }

    /**
     * Perform comprehensive volatility analysis across multiple scenarios
     */
    analyzeScenarioVolatility(
        scenarios: EconomicScenario[], 
        results: SimulationResult[]
    ): VolatilityAnalysis {
        if (scenarios.length !== results.length) {
            throw new Error('Scenarios and results arrays must have the same length');
        }

        const scenarioMetrics = results.map((result, index) => ({
            scenarioId: scenarios[index].id,
            scenarioName: scenarios[index].name,
            metrics: this.calculateVolatilityMetrics(result)
        }));

        // Cross-scenario analysis
        const volatilityComparison = this.compareVolatilityAcrossScenarios(scenarioMetrics);
        const regimeAnalysis = this.analyzeVolatilityRegimes(scenarioMetrics);
        const stressTestMetrics = this.calculateStressTestVolatility(scenarioMetrics);
        const marketShockAnalysis = this.analyzeMarketShockVolatility(scenarios, results);

        return {
            scenarios: scenarioMetrics,
            comparison: volatilityComparison,
            regimeAnalysis,
            stressTestMetrics,
            marketShockAnalysis
        };
    }

    /**
     * Calculate simple returns from price series
     */
    private calculateReturns(prices: number[]): number[] {
        const returns: number[] = [];
        for (let i = 1; i < prices.length; i++) {
            returns.push((prices[i] - prices[i-1]) / prices[i-1]);
        }
        return returns;
    }

    /**
     * Calculate historical volatility (standard deviation of returns)
     */
    private calculateHistoricalVolatility(returns: number[]): number {
        const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
        const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / (returns.length - 1);
        return Math.sqrt(variance) * Math.sqrt(252); // Annualized
    }

    /**
     * Calculate realized volatility using high-frequency estimation
     */
    private calculateRealizedVolatility(returns: number[]): number {
        // Simplified realized volatility calculation
        const squaredReturns = returns.map(ret => ret * ret);
        const sumSquaredReturns = squaredReturns.reduce((sum, sq) => sum + sq, 0);
        return Math.sqrt(sumSquaredReturns) * Math.sqrt(252);
    }

    /**
     * Estimate implied volatility (simplified Black-Scholes approach)
     */
    private estimateImpliedVolatility(returns: number[]): number {
        // Simplified estimation - in practice would use option prices
        const historicalVol = this.calculateHistoricalVolatility(returns);
        const volatilityOfVol = this.calculateVolatilityOfVolatility(returns);
        return historicalVol * (1 + volatilityOfVol * 0.1); // Add premium for uncertainty
    }

    /**
     * Calculate volatility of volatility (second-order volatility)
     */
    private calculateVolatilityOfVolatility(returns: number[]): number {
        const windowSize = Math.min(21, Math.floor(returns.length / 10)); // 21-day rolling window
        const rollingVolatilities: number[] = [];
        
        for (let i = windowSize; i < returns.length; i++) {
            const window = returns.slice(i - windowSize, i);
            const windowVol = this.calculateHistoricalVolatility(window);
            rollingVolatilities.push(windowVol);
        }
        
        if (rollingVolatilities.length < 2) return 0;
        
        const mean = rollingVolatilities.reduce((sum, vol) => sum + vol, 0) / rollingVolatilities.length;
        const variance = rollingVolatilities.reduce((sum, vol) => sum + Math.pow(vol - mean, 2), 0) / (rollingVolatilities.length - 1);
        return Math.sqrt(variance);
    }

    /**
     * Detect volatility clustering using ARCH effects
     */
    private detectVolatilityClustering(returns: number[]): number {
        // Calculate absolute returns as proxy for volatility
        const absReturns = returns.map(ret => Math.abs(ret));
        
        // Simple autocorrelation test for clustering
        let autocorrelation = 0;
        const lag = Math.min(5, Math.floor(returns.length / 20));
        
        if (absReturns.length > lag) {
            const n = absReturns.length - lag;
            let sumXY = 0, sumX = 0, sumY = 0, sumX2 = 0, sumY2 = 0;
            
            for (let i = 0; i < n; i++) {
                const x = absReturns[i];
                const y = absReturns[i + lag];
                
                sumXY += x * y;
                sumX += x;
                sumY += y;
                sumX2 += x * x;
                sumY2 += y * y;
            }
            
            const numerator = n * sumXY - sumX * sumY;
            const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
            
            if (denominator !== 0) {
                autocorrelation = numerator / denominator;
            }
        }
        
        return Math.abs(autocorrelation); // Return absolute value as clustering measure
    }

    /**
     * Calculate downside volatility (volatility of negative returns)
     */
    private calculateDownsideVolatility(returns: number[]): number {
        const downsideReturns = returns.filter(ret => ret < 0);
        if (downsideReturns.length < 2) return 0;
        
        const mean = downsideReturns.reduce((sum, ret) => sum + ret, 0) / downsideReturns.length;
        const variance = downsideReturns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / (downsideReturns.length - 1);
        return Math.sqrt(variance) * Math.sqrt(252);
    }

    /**
     * Calculate upside volatility (volatility of positive returns)
     */
    private calculateUpsideVolatility(returns: number[]): number {
        const upsideReturns = returns.filter(ret => ret > 0);
        if (upsideReturns.length < 2) return 0;
        
        const mean = upsideReturns.reduce((sum, ret) => sum + ret, 0) / upsideReturns.length;
        const variance = upsideReturns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / (upsideReturns.length - 1);
        return Math.sqrt(variance) * Math.sqrt(252);
    }

    /**
     * Calculate intraday volatility (simplified)
     */
    private calculateIntradayVolatility(returns: number[]): number {
        // Simplified: assume first portion of returns represents intraday
        const intradaySize = Math.min(252, Math.floor(returns.length / 4));
        const intradayReturns = returns.slice(0, intradaySize);
        return this.calculateHistoricalVolatility(intradayReturns);
    }

    /**
     * Calculate monthly volatility
     */
    private calculateMonthlyVolatility(returns: number[]): number {
        const monthlySize = Math.min(21, Math.floor(returns.length / 12));
        if (monthlySize < 2) return 0;
        
        const monthlyReturns: number[] = [];
        for (let i = 0; i < returns.length; i += monthlySize) {
            const monthData = returns.slice(i, i + monthlySize);
            if (monthData.length >= monthlySize) {
                const monthReturn = monthData.reduce((sum, ret) => sum + ret, 0);
                monthlyReturns.push(monthReturn);
            }
        }
        
        return this.calculateHistoricalVolatility(monthlyReturns);
    }

    /**
     * Calculate quarterly volatility
     */
    private calculateQuarterlyVolatility(returns: number[]): number {
        const quarterlySize = Math.min(63, Math.floor(returns.length / 4));
        if (quarterlySize < 2) return 0;
        
        const quarterlyReturns: number[] = [];
        for (let i = 0; i < returns.length; i += quarterlySize) {
            const quarterData = returns.slice(i, i + quarterlySize);
            if (quarterData.length >= quarterlySize) {
                const quarterReturn = quarterData.reduce((sum, ret) => sum + ret, 0);
                quarterlyReturns.push(quarterReturn);
            }
        }
        
        return this.calculateHistoricalVolatility(quarterlyReturns);
    }

    /**
     * Calculate annual volatility
     */
    private calculateAnnualVolatility(returns: number[]): number {
        return this.calculateHistoricalVolatility(returns);
    }

    /**
     * Calculate volatility skewness
     */
    private calculateVolatilitySkew(returns: number[]): number {
        const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
        const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
        const stdDev = Math.sqrt(variance);
        
        if (stdDev === 0) return 0;
        
        const skewness = returns.reduce((sum, ret) => sum + Math.pow((ret - mean) / stdDev, 3), 0) / returns.length;
        return skewness;
    }

    /**
     * Calculate volatility kurtosis
     */
    private calculateVolatilityKurtosis(returns: number[]): number {
        const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
        const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
        const stdDev = Math.sqrt(variance);
        
        if (stdDev === 0) return 0;
        
        const kurtosis = returns.reduce((sum, ret) => sum + Math.pow((ret - mean) / stdDev, 4), 0) / returns.length;
        return kurtosis - 3; // Excess kurtosis
    }

    /**
     * Analyze correlation breakdown during high volatility periods
     */
    private analyzeCorrelationBreakdown(returns: number[]): number {
        // Simplified correlation breakdown analysis
        const absReturns = returns.map(ret => Math.abs(ret));
        const threshold = this.calculatePercentile(absReturns, 0.9); // 90th percentile
        
        const highVolPeriods = returns.filter((_, i) => absReturns[i] > threshold);
        const normalPeriods = returns.filter((_, i) => absReturns[i] <= threshold);
        
        if (highVolPeriods.length < 2 || normalPeriods.length < 2) return 0;
        
        const highVolVar = this.calculateVariance(highVolPeriods);
        const normalVar = this.calculateVariance(normalPeriods);
        
        return normalVar > 0 ? (highVolVar - normalVar) / normalVar : 0;
    }

    /**
     * Compare volatility metrics across scenarios
     */
    private compareVolatilityAcrossScenarios(scenarioMetrics: any[]): any {
        const scenarios = scenarioMetrics.map(s => s.scenarioId);
        const historicalVols = scenarioMetrics.map(s => s.metrics.basic.historicalVolatility);
        const realizedVols = scenarioMetrics.map(s => s.metrics.basic.realizedVolatility);
        
        return {
            scenarios,
            historicalVolatilityRange: {
                min: Math.min(...historicalVols),
                max: Math.max(...historicalVols),
                mean: historicalVols.reduce((sum, vol) => sum + vol, 0) / historicalVols.length
            },
            realizedVolatilityRange: {
                min: Math.min(...realizedVols),
                max: Math.max(...realizedVols),
                mean: realizedVols.reduce((sum, vol) => sum + vol, 0) / realizedVols.length
            },
            highestVolatilityScenario: scenarios[historicalVols.indexOf(Math.max(...historicalVols))],
            lowestVolatilityScenario: scenarios[historicalVols.indexOf(Math.min(...historicalVols))]
        };
    }

    /**
     * Analyze volatility regimes
     */
    private analyzeVolatilityRegimes(scenarioMetrics: any[]): any {
        const allVolatilities = scenarioMetrics.map(s => s.metrics.basic.historicalVolatility);
        const lowThreshold = this.calculatePercentile(allVolatilities, 0.33);
        const highThreshold = this.calculatePercentile(allVolatilities, 0.67);
        
        return {
            lowVolatility: {
                threshold: lowThreshold,
                scenarios: scenarioMetrics
                    .filter(s => s.metrics.basic.historicalVolatility <= lowThreshold)
                    .map(s => s.scenarioId)
            },
            mediumVolatility: {
                range: [lowThreshold, highThreshold],
                scenarios: scenarioMetrics
                    .filter(s => s.metrics.basic.historicalVolatility > lowThreshold && 
                               s.metrics.basic.historicalVolatility <= highThreshold)
                    .map(s => s.scenarioId)
            },
            highVolatility: {
                threshold: highThreshold,
                scenarios: scenarioMetrics
                    .filter(s => s.metrics.basic.historicalVolatility > highThreshold)
                    .map(s => s.scenarioId)
            }
        };
    }

    /**
     * Calculate stress test volatility metrics
     */
    private calculateStressTestVolatility(scenarioMetrics: any[]): any {
        const stressScenarios = scenarioMetrics.filter(s => 
            s.scenarioId.includes('recession') || s.scenarioId.includes('crash')
        );
        
        if (stressScenarios.length === 0) return null;
        
        const stressVolatilities = stressScenarios.map(s => s.metrics.basic.historicalVolatility);
        const normalScenarios = scenarioMetrics.filter(s => !stressScenarios.includes(s));
        const normalVolatilities = normalScenarios.map(s => s.metrics.basic.historicalVolatility);
        
        return {
            stressVolatilityMean: stressVolatilities.reduce((sum, vol) => sum + vol, 0) / stressVolatilities.length,
            normalVolatilityMean: normalVolatilities.length > 0 ? 
                normalVolatilities.reduce((sum, vol) => sum + vol, 0) / normalVolatilities.length : 0,
            volatilityMultiplier: normalVolatilities.length > 0 ? 
                (stressVolatilities.reduce((sum, vol) => sum + vol, 0) / stressVolatilities.length) /
                (normalVolatilities.reduce((sum, vol) => sum + vol, 0) / normalVolatilities.length) : 1
        };
    }

    /**
     * Analyze market shock volatility impact
     */
    private analyzeMarketShockVolatility(scenarios: EconomicScenario[], results: SimulationResult[]): any {
        const shockAnalysis = scenarios.map((scenario, index) => {
            const shocks = scenario.parameters.marketShocks || [];
            const result = results[index];
            const returns = this.calculateReturns(result.results);
            
            if (shocks.length === 0) return null;
            
            // Analyze volatility during shock periods (simplified)
            const preShockVol = this.calculateHistoricalVolatility(returns.slice(0, Math.floor(returns.length * 0.3)));
            const postShockVol = this.calculateHistoricalVolatility(returns.slice(Math.floor(returns.length * 0.7)));
            
            return {
                scenarioId: scenario.id,
                shockCount: shocks.length,
                totalShockImpact: shocks.reduce((sum, shock) => sum + Math.abs(shock.impact), 0),
                preShockVolatility: preShockVol,
                postShockVolatility: postShockVol,
                volatilityIncrease: postShockVol > preShockVol ? (postShockVol - preShockVol) / preShockVol : 0
            };
        }).filter(analysis => analysis !== null);
        
        return {
            scenarios: shockAnalysis,
            averageVolatilityIncrease: shockAnalysis.length > 0 ? 
                shockAnalysis.reduce((sum, s) => sum + s.volatilityIncrease, 0) / shockAnalysis.length : 0
        };
    }

    /**
     * Calculate percentile of an array
     */
    private calculatePercentile(arr: number[], percentile: number): number {
        const sorted = [...arr].sort((a, b) => a - b);
        const index = Math.ceil(percentile * sorted.length) - 1;
        return sorted[Math.max(0, index)];
    }

    /**
     * Calculate variance of an array
     */
    private calculateVariance(arr: number[]): number {
        if (arr.length < 2) return 0;
        const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
        return arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (arr.length - 1);
    }
}

/**
 * Utility function to run volatility analysis on predefined scenarios
 */
export async function runVolatilityAnalysis(
    scenarios: EconomicScenario[],
    results: SimulationResult[]
): Promise<VolatilityAnalysis> {
    const engine = new VolatilityEngine();
    return engine.analyzeScenarioVolatility(scenarios, results);
} 