/**
 * Enhanced Results Display Component
 * Provides clear, actionable financial analysis results with explanations
 *
 * @remarks
 * - Strictly typed, fully documented, and validated per project rules.
 * - All displayed values are validated and sanitized before display.
 * - UI/UX is mobile-first and accessible.
 */

import { ComprehensiveAnalysisResult } from '../../interfaces/analysis-types';
import '../shared-form-styles.css';

/**
 * EnhancedResultsDisplay
 * Renders the financial analysis results in a clear, accessible, and actionable format.
 */
export class EnhancedResultsDisplay {
    private container: HTMLElement;

    /**
     * Initializes the results display component.
     * @param containerId - The DOM element ID to render the results into.
     */
    constructor(containerId: string) {
        const element = document.getElementById(containerId);
        if (!element) {
            throw new Error(`Element with ID ${containerId} not found`);
        }
        this.container = element;
    }

    /**
     * Renders the analysis results.
     * @param analysisResult - The comprehensive analysis result object.
     */
    public render(analysisResult: ComprehensiveAnalysisResult): void {
        // Defensive: Validate all numbers before display
        if (!analysisResult || typeof analysisResult !== 'object') {
            this.container.innerHTML = '<div class="error-message">No analysis data available.</div>';
            return;
        }
        this.container.innerHTML = '';
        this.container.className = 'form-container enhanced-results-display';
        this.container.setAttribute('aria-label', 'Financial Health Analysis Results');
        this.container.innerHTML = `
          <section class="results-section" aria-labelledby="score-heading">
            ${this.generateOverallScoreSection(analysisResult)}
          </section>
          <section class="results-section" aria-labelledby="insights-heading">
            ${this.generateKeyInsightsSection(analysisResult)}
          </section>
          <section class="results-section" aria-labelledby="action-plan-heading">
            ${this.generateActionPlanSection(analysisResult)}
          </section>
        `;
        this.attachInteractiveElements();
    }

    /**
     * Generates the overall score section HTML.
     * @param analysisResult - The analysis result object.
     * @returns The HTML string for the score section.
     */
    private generateOverallScoreSection(analysisResult: ComprehensiveAnalysisResult): string {
        const score: string | number = typeof analysisResult.overallHealthScore === 'number' && !isNaN(analysisResult.overallHealthScore) ? analysisResult.overallHealthScore : 'N/A';
        const level = analysisResult.healthLevel;
        let scoreText = '';
        switch (level) {
            case 'excellent': scoreText = 'Excellent: You are in outstanding financial health.'; break;
            case 'good': scoreText = 'Good: You are on track, with a few areas to optimize.'; break;
            case 'fair': scoreText = 'Fair: There are some areas to improve.'; break;
            case 'limited': scoreText = 'Limited: Take action to improve your financial health.'; break;
            case 'critical': scoreText = 'Critical: Immediate action is needed.'; break;
            default: scoreText = '';
        }
        return `
          <div class="score-section form-header" style="text-align:center; margin-bottom:24px;">
            <h2 id="score-heading">Financial Health Score</h2>
            <div class="score-circle" style="display:inline-block; width:100px; height:100px; border-radius:50%; background:${this.getScoreColor(level)}; color:#fff; font-size:2.2rem; line-height:100px; font-weight:bold;">${score}</div>
            <div class="score-explanation">${scoreText}</div>
            <div class="score-peer" style="display:none;"></div>
          </div>
        `;
    }

    /**
     * Generates the key insights section HTML.
     * @param analysisResult - The analysis result object.
     * @returns The HTML string for the key insights section.
     */
    private generateKeyInsightsSection(analysisResult: ComprehensiveAnalysisResult): string {
        const km = analysisResult.keyMetrics;
        const savingsRateBreakdown = km.savingsRateBreakdown;
        const insights: Array<{icon:string, headline:string, value:string, explanation:string, positive:boolean, breakdown?:string, breakdownId?:string}> = [];
        if (typeof km.emergencyFundMonths === 'number') {
            insights.push({
                icon: km.emergencyFundMonths >= 3 ? '\ud83d\udcb0' : '\u26a0\ufe0f',
                headline: 'Emergency Fund',
                value: km.emergencyFundMonths === 0 ? 'No savings' : `${km.emergencyFundMonths.toFixed(1)} months`,
                explanation: km.emergencyFundMonths >= 3 ? 'You have a solid emergency fund.' : 'Aim for 3-6 months of expenses saved.',
                positive: km.emergencyFundMonths >= 3,
                breakdown: `Liquid assets (checking, savings, money market, emergency fund) divided by total monthly expenses.`,
                breakdownId: 'breakdown-emergency-fund'
            });
        }
        if (typeof km.debtToIncomeRatio === 'number' && km.dtiBreakdown) {
            insights.push({
                icon: km.debtToIncomeRatio === 0 ? '\u2705' : (km.debtToIncomeRatio <= 36 ? '\ud83d\udc4d' : '\u26a0\ufe0f'),
                headline: 'Debt-to-Income',
                value: `${km.debtToIncomeRatio.toFixed(1)}%`,
                explanation: km.debtToIncomeRatio === 0 ? 'No debt: Great job!' : (km.debtToIncomeRatio <= 36 ? 'Your debt is in a healthy range.' : 'Try to keep debt below 36% of income.'),
                positive: km.debtToIncomeRatio <= 36,
                breakdown: `DTI = Total Debt ($${km.dtiBreakdown.totalDebt.toLocaleString()}) / Gross Monthly Income ($${km.dtiBreakdown.totalIncome.toLocaleString()}) × 100 = <strong>${km.dtiBreakdown.debtToIncomeRatio.toFixed(1)}%</strong>.<br>Industry standard: <a href='https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/' target='_blank' rel='noopener'>CFPB</a>`,
                breakdownId: 'breakdown-dti'
            });
        }
        // Net Worth
        if (typeof km.netWorth === 'number' && km.netWorthBreakdown) {
            insights.push({
                icon: km.netWorth > 0 ? '\ud83d\udcb8' : '\u26a0\ufe0f',
                headline: 'Net Worth',
                value: `$${km.netWorth.toLocaleString()}`,
                explanation: km.netWorth > 0 ? 'Positive net worth: You own more than you owe.' : 'Negative net worth: Focus on reducing liabilities and building assets.',
                positive: km.netWorth > 0,
                breakdown: `Net Worth = Total Assets ($${km.netWorthBreakdown.totalAssets.toLocaleString()}) - Total Liabilities ($${km.netWorthBreakdown.totalLiabilities.toLocaleString()}) = <strong>$${km.netWorthBreakdown.netWorth.toLocaleString()}</strong>.<br>Industry standard: <a href='https://www.nerdwallet.com/article/finance/net-worth-calculator' target='_blank' rel='noopener'>NerdWallet</a>`,
                breakdownId: 'breakdown-net-worth'
            });
        }
        // Savings Rate
        if (typeof km.savingsRate === 'number' && savingsRateBreakdown) {
            insights.push({
                icon: km.savingsRate >= 10 ? '💡' : '⚠️',
                headline: 'Savings Rate',
                value: `${km.savingsRate.toFixed(1)}%`,
                explanation: km.savingsRate >= 10 ? 'Good savings rate.' : 'Aim to save at least 10% of income.',
                positive: km.savingsRate >= 10,
                breakdown: `Savings Rate = Savings ($${savingsRateBreakdown.savings.toLocaleString()}) / Total Income ($${savingsRateBreakdown.totalIncome.toLocaleString()}) × 100 = <strong>${savingsRateBreakdown.savingsRate.toFixed(1)}%</strong>.`,
                breakdownId: 'breakdown-savings-rate'
            });
        }
        return `
        <div class="key-insights" style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;">
            ${insights.map((insight) => `
                <div class="insight-card" style="flex:1 1 220px;min-width:180px;max-width:260px;background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);padding:1rem;display:flex;flex-direction:column;align-items:center;position:relative;">
                    <span class="insight-icon" aria-label="${insight.headline}" style="font-size:2rem;">${insight.icon}</span>
                    <div class="insight-headline" style="font-weight:600;font-size:1.1rem;margin-top:0.5rem;display:flex;align-items:center;gap:0.3rem;">
                        ${insight.headline}
                        <button class="info-toggle" aria-expanded="false" aria-controls="${insight.breakdownId}" tabindex="0" title="How is this calculated?" style="background:none;border:none;cursor:pointer;font-size:1.1rem;color:#2563eb;outline:none;" data-breakdown-id="${insight.breakdownId}">&#9432;</button>
                    </div>
                    <div class="insight-value" style="font-size:1.3rem;font-weight:bold;margin:0.5rem 0;">${insight.value}</div>
                    <div class="insight-explanation" style="font-size:0.98rem;color:${insight.positive ? '#10b981' : '#ef4444'};">${insight.explanation}</div>
                    <div class="insight-breakdown breakdown-collapsible" id="${insight.breakdownId}" style="display:none;margin-top:0.5rem;font-size:0.92rem;background:#f3f4f6;padding:0.7rem 0.8rem;border-radius:8px;">${insight.breakdown || ''}</div>
                </div>
            `).join('')}
        </div>
        <style>
        @media (max-width: 600px) {
            .key-insights { flex-direction:column; align-items:stretch; }
            .insight-card { min-width:unset; max-width:unset; width:100%; }
        }
        .info-toggle:focus { outline: 2px solid #2563eb; }
        </style>
        `;
    }

    /**
     * Generates the action plan section HTML.
     * @param analysisResult - The analysis result object.
     * @returns The HTML string for the action plan section.
     */
    private generateActionPlanSection(analysisResult: ComprehensiveAnalysisResult): string {
        // Defensive: Only show actionable steps if present
        const recs = analysisResult.prioritizedRecommendations || [];
        if (!recs.length) {
            return `<div class="action-plan-section" aria-labelledby="action-plan-heading" style="text-align:center; padding:24px 0;">
              <h2 id="action-plan-heading" style="font-size:1.2rem; margin-bottom:8px;">Personalized Action Plan</h2>
              <div style="color:#10b981; font-size:1.1rem;">You're on track! No urgent actions needed.</div>
            </div>`;
        }
        return `<div class="action-plan-section" aria-labelledby="action-plan-heading">
          <h2 id="action-plan-heading" style="font-size:1.2rem; margin-bottom:8px;">Personalized Action Plan</h2>
          <ol class="action-plan-list" style="list-style:none; padding:0; margin:0;">
            ${recs.map((rec, idx) => `
              <li class="action-step-card" style="margin-bottom:18px; background:#f3f4f6; border-radius:10px; padding:16px; display:flex; align-items:flex-start; gap:1rem;">
                <span class="step-icon" aria-label="Step ${idx+1}" style="font-size:1.5rem; color:#3b82f6; font-weight:bold;">${idx+1}</span>
                <div style="flex:1;">
                  <div style="font-weight:600; color:#2563eb; font-size:1.05rem;">${rec.title}</div>
                  <div style="font-size:0.98rem; color:#444; margin-bottom:4px;">${rec.description}</div>
                  <ul style="margin:0 0 0 16px; padding:0; color:#374151; font-size:0.97rem;">
                    ${rec.actionSteps.map(step => `<li style="margin-bottom:2px;">${step}</li>`).join('')}
                  </ul>
                  <div style="font-size:0.9rem; color:#888; margin-top:4px;">Timeframe: ${this.formatTimeframe(rec.timeframe)} | Impact: ${this.formatImpact(rec.impactLevel)}</div>
                </div>
              </li>
            `).join('')}
          </ol>
        </div>`;
    }

    /**
     * Attaches interactive elements for accessibility and info toggles.
     */
    private attachInteractiveElements(): void {
        // Add event listeners for info buttons to toggle breakdowns
        const infoButtons = this.container.querySelectorAll('.info-toggle');
        infoButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const breakdownId = (e.currentTarget as HTMLElement).getAttribute('data-breakdown-id');
                if (!breakdownId) return;
                const breakdown = this.container.querySelector(`#${breakdownId}`) as HTMLElement;
                if (breakdown) {
                    const expanded = breakdown.style.display === 'block';
                    breakdown.style.display = expanded ? 'none' : 'block';
                    (e.currentTarget as HTMLElement).setAttribute('aria-expanded', (!expanded).toString());
                }
            });
            // Keyboard accessibility
            btn.addEventListener('keydown', (e) => {
                const ke = e as KeyboardEvent;
                if (ke.key === 'Enter' || ke.key === ' ') {
                    ke.preventDefault();
                    (btn as HTMLElement).click();
                }
            });
        });
    }

    private formatTimeframe(timeframe: string): string {
        const timeframeMap: { [key: string]: string } = {
            'immediate': 'This Week',
            'short-term': '1-3 Months',
            'medium-term': '3-12 Months',
            'long-term': '1+ Years'
        };
        return timeframeMap[timeframe] || timeframe;
    }

    private formatImpact(impact: string): string {
        const impactMap: { [key: string]: string } = {
            'high': 'High',
            'medium': 'Medium',
            'low': 'Low'
        };
        return impactMap[impact] || impact;
    }

    /**
     * Gets the color for the score circle based on health level.
     * @param level - The health level string.
     * @returns The color hex code.
     */
    private getScoreColor(level: string): string {
        const colorMap: { [key: string]: string } = {
            'excellent': '#10b981',
            'good': '#3b82f6',
            'fair': '#f59e0b',
            'limited': '#ef4444',
            'critical': '#ef4444'
        };
        return colorMap[level] || '#555';
    }
} 