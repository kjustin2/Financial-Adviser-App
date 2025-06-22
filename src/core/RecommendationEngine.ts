import { ComprehensiveAnalysisResult, HealthIndicator, Recommendation } from '../interfaces/analysis-types';
import { UserFinancialData } from '../interfaces/core-types';
import { formatCurrency } from '../utils/format-utils';

/**
 * Generates actionable, prioritized recommendations based on the financial analysis.
 */
export class RecommendationEngine {

    /**
     * Main function to generate all recommendations.
     * @param analysis - The full comprehensive analysis result.
     * @param data - The original user financial data.
     * @returns A sorted and deduplicated array of Recommendation objects.
     */
    public static generateRecommendations(analysis: ComprehensiveAnalysisResult, data: UserFinancialData): Recommendation[] {
        let recommendations: Recommendation[] = [];
        const { healthIndicators, keyMetrics } = analysis;

        // --- HIGH PRIORITY: Critical Issues & Risks ---
        recommendations.push(...this.getEmergencyFundRecommendations(keyMetrics, data));
        recommendations.push(...this.getHighDebtRecommendations(keyMetrics, data));
        recommendations.push(...this.getNegativeCashFlowRecommendations(keyMetrics));

        // --- MEDIUM PRIORITY: Opportunities & Important Improvements ---
        recommendations.push(...this.getSavingsRateRecommendations(keyMetrics));
        recommendations.push(...this.getInsuranceRecommendations(data));
        recommendations.push(...this.getCreditScoreOptimizationRecommendations(data.liabilities.creditScore));
        recommendations.push(...this.getInvestmentRecommendations(data, keyMetrics));

        // --- LOW PRIORITY: Fine-Tuning & Best Practices ---
        recommendations.push(...this.getBudgetingRecommendations(data));
        recommendations.push(...this.getAutomatedSavingsRecommendations(data));
        
        // Add recommendations based on overall indicator status (as a fallback)
        healthIndicators.forEach(indicator => {
            recommendations.push(...this.getGenericIndicatorRecommendations(indicator));
        });

        // Sort recommendations by priority: high -> medium -> low
        recommendations.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        // Deduplicate and return the top recommendations
        const uniqueRecommendations = Array.from(new Map(recommendations.map(r => [r.id, r])).values());
        return uniqueRecommendations.slice(0, 10); // Return up to 10
    }
    
    // ===================================================================
    // HIGH PRIORITY RECOMMENDATION LOGIC
    // ===================================================================

    private static getEmergencyFundRecommendations(keyMetrics: any, data: UserFinancialData): Recommendation[] {
        const recommendations: Recommendation[] = [];
        const { emergencyFundMonths, totalLiquidAssets } = keyMetrics;
        const totalMonthlyExpenses = data.expenses.housing + data.expenses.food + data.expenses.transportation + data.expenses.utilities; // Simplified for quick analysis
        
        if (totalMonthlyExpenses <= 0) return []; // Cannot calculate if expenses are zero

        const targetFund = totalMonthlyExpenses * 3; // Target 3 months for high priority

        if (emergencyFundMonths < 1) {
            recommendations.push({
                id: 'emergency-fund-critical',
                category: 'savings',
                priority: 'high',
                title: 'Critically Low Emergency Fund',
                description: `You have less than one month of expenses saved (${formatCurrency(totalLiquidAssets)}). This puts you at high risk for financial hardship if you face an unexpected event. Building a safety net should be your top priority.`,
                actionSteps: [
                    `Immediately open or fund a dedicated high-yield savings account.`,
                    `Set a goal to save at least one full month of expenses (${formatCurrency(totalMonthlyExpenses)}) as quickly as possible.`,
                    `Pause all non-essential spending and investments until this initial goal is met.`
                ],
                timeframe: 'next-30-days',
                impactLevel: 'high'
            });
        } else if (emergencyFundMonths < 3) {
            const amountNeeded = targetFund - totalLiquidAssets;
            recommendations.push({
                id: 'emergency-fund-low',
                category: 'savings',
                priority: 'high',
                title: 'Build Your 3-Month Emergency Fund',
                description: `You currently have ${emergencyFundMonths.toFixed(1)} months of expenses saved. While this is a good start, aiming for at least 3 months provides a much stronger safety net. You need to save approximately ${formatCurrency(amountNeeded)} more to reach this goal.`,
                actionSteps: [
                    `Calculate your exact total monthly expenses to confirm your target of ${formatCurrency(targetFund)}.`,
                    `Set up an automatic recurring transfer to your savings account each payday.`,
                    `Look for opportunities to reduce spending (e.g., dining out, subscriptions) and redirect that money to savings.`
                ],
                timeframe: '1-3-months',
                impactLevel: 'high'
            });
        }
        return recommendations;
    }

    private static getHighDebtRecommendations(keyMetrics: any, _data: UserFinancialData): Recommendation[] {
        const recommendations: Recommendation[] = [];
        const { debtToIncomeRatio, creditUtilization } = keyMetrics;

        if (debtToIncomeRatio > 43) {
             recommendations.push({
                id: 'dti-ratio-high',
                category: 'debt',
                priority: 'high',
                title: 'Aggressively Pay Down High-Interest Debt',
                description: `Your debt-to-income (DTI) ratio is ${debtToIncomeRatio.toFixed(1)}%, which is considered high and may impact your ability to borrow in the future. Creating a focused debt-repayment plan is essential.`,
                actionSteps: [
                    `List all your debts from highest interest rate to lowest (this is the "Avalanche" method).`,
                    `Make minimum payments on all debts, but put every extra dollar towards the debt with the highest interest rate.`,
                    `Consider a debt consolidation loan or balance transfer card to lower your interest rates, but be mindful of fees.`
                ],
                timeframe: '3-6-months',
                impactLevel: 'high'
            });
        }
        
        if (creditUtilization > 50) {
             recommendations.push({
                id: 'credit-utilization-high',
                category: 'debt',
                priority: 'high',
                title: 'Lower Your Credit Utilization',
                description: `Your credit utilization is ${creditUtilization.toFixed(1)}%, which is significantly impacting your credit score. Lowering this is one of the fastest ways to improve your financial health.`,
                actionSteps: [
                    `Make paying down your credit card balances your top priority.`,
                    `If possible, make multiple small payments throughout the month instead of one large one.`,
                    `Consider asking for a credit limit increase on your existing cards (if you can trust yourself not to spend more).`
                ],
                timeframe: '1-3-months',
                impactLevel: 'high'
            });
        }
        return recommendations;
    }
    
    private static getNegativeCashFlowRecommendations(keyMetrics: any): Recommendation[] {
        if (keyMetrics.monthlyCashFlow < 0) {
            return [{
                id: 'negative-cash-flow',
                category: 'spending',
                priority: 'high',
                title: 'Address Negative Monthly Cash Flow',
                description: `You are spending ${formatCurrency(Math.abs(keyMetrics.monthlyCashFlow))} more than you earn each month. This is unsustainable and requires immediate attention to create a budget and cut expenses.`,
                actionSteps: [
                    `Track every dollar you spend for the next 30 days using an app or spreadsheet.`,
                    `Identify 3-5 non-essential spending categories where you can cut back immediately (e.g., dining out, subscriptions, shopping).`,
                    `Build a detailed monthly budget based on your findings and stick to it.`
                ],
                timeframe: 'next-30-days',
                impactLevel: 'high'
            }];
        }
        return [];
    }
    
    // ===================================================================
    // MEDIUM PRIORITY RECOMMENDATION LOGIC
    // ===================================================================

    private static getSavingsRateRecommendations(keyMetrics: any): Recommendation[] {
        const { savingsRate } = keyMetrics;
        if (savingsRate >= 0 && savingsRate < 10) {
            return [{
                id: 'increase-savings-rate',
                category: 'savings',
                priority: 'medium',
                title: 'Increase Your Savings Rate',
                description: `Your current savings rate is ${savingsRate.toFixed(1)}%. While any saving is good, a healthy target is between 10-20% of your income. A higher rate will accelerate your progress towards your financial goals.`,
                actionSteps: [
                    `Try to increase your savings rate by 1% each month.`,
                    `Allocate any future pay raises or bonuses directly to savings or investments.`,
                    `Review your budget for small, recurring expenses that can be cut and redirected to savings.`
                ],
                timeframe: 'ongoing',
                impactLevel: 'medium'
            }];
        }
        return [];
    }

    private static getInsuranceRecommendations(data: UserFinancialData): Recommendation[] {
        if (data.insurance.insuranceConfidence !== 'very-confident') {
            return [{
                id: 'review-insurance-coverage',
                category: 'risk',
                priority: 'medium',
                title: 'Review Your Insurance Coverage',
                description: `You indicated you are not 'very confident' in your insurance coverage. Having the right insurance is crucial for protecting your financial well-being from unexpected events.`,
                actionSteps: [
                    `Schedule a free review with your current insurance agent(s) to discuss your life, disability, home/auto policies.`,
                    `Assess your life insurance needs. A common rule of thumb is 10-12 times your annual income.`,
                    `Ensure you have long-term disability insurance that covers at least 60% of your income.`
                ],
                timeframe: 'next-3-months',
                impactLevel: 'high'
            }];
        }
        return [];
    }

    private static getCreditScoreOptimizationRecommendations(creditScore: number): Recommendation[] {
        if (creditScore > 740) {
            return [{
                id: 'leverage-excellent-credit',
                category: 'credit',
                priority: 'medium',
                title: 'Leverage Your Excellent Credit Score',
                description: `Your credit score of ${creditScore} is excellent! This is a powerful financial tool you can use to your advantage.`,
                actionSteps: [
                    `Consider refinancing any existing loans (mortgage, auto, student) to secure a lower interest rate.`,
                    `Explore premium travel or cashback credit cards that offer significant rewards and benefits.`,
                    `Continue your great habits: always pay your bills on time and keep credit utilization low.`
                ],
                timeframe: 'ongoing',
                impactLevel: 'medium'
            }];
        }
        return [];
    }

    private static getInvestmentRecommendations(data: UserFinancialData, keyMetrics: any): Recommendation[] {
        if (keyMetrics.emergencyFundMonths >= 4 && data.behaviors.monthlyInvestmentContribution === 0) {
             return [{
                id: 'start-investing',
                category: 'investment',
                priority: 'medium',
                title: 'Start Investing for the Future',
                description: `You have a solid emergency fund, which is a great foundation. Now is the perfect time to start investing to grow your wealth for long-term goals like retirement.`,
                actionSteps: [
                    `If your employer offers a 401(k) match, contribute at least enough to get the full match. It's free money!`,
                    `Open a Roth IRA, which offers tax-free growth and withdrawals in retirement.`,
                    `Start with a simple, low-cost target-date index fund or a broad market ETF.`
                ],
                timeframe: 'next-3-months',
                impactLevel: 'high'
            }];
        }
        return [];
    }

    // ===================================================================
    // LOW PRIORITY RECOMMENDATION LOGIC
    // ===================================================================

    private static getBudgetingRecommendations(data: UserFinancialData): Recommendation[] {
        if (data.behaviors.budgetingMethod === 'no-budget' || data.behaviors.budgetingMethod === 'simple-tracking') {
             return [{
                id: 'create-a-budget',
                category: 'spending',
                priority: 'low',
                title: 'Adopt a Formal Budgeting Method',
                description: `You've indicated you don't follow a formal budget. A budget is a powerful tool for telling your money where to go, instead of wondering where it went.`,
                actionSteps: [
                    `Try the 50/30/20 rule as a starting point: 50% of income for needs, 30% for wants, and 20% for savings.`,
                    `Use a budgeting app (like YNAB or Mint) or a simple spreadsheet to track your spending against your plan.`,
                    `Review your budget monthly and make adjustments as needed.`
                ],
                timeframe: 'next-month',
                impactLevel: 'medium'
            }];
        }
        return [];
    }
    
    private static getAutomatedSavingsRecommendations(data: UserFinancialData): Recommendation[] {
        if (!data.behaviors.automaticSavings) {
            return [{
                id: 'automate-your-savings',
                category: 'savings',
                priority: 'low',
                title: 'Automate Your Savings and Investments',
                description: `You're not currently automating your savings. Paying yourself first by automating transfers is the easiest and most effective way to build wealth consistently.`,
                actionSteps: [
                    `Set up an automatic recurring transfer from your checking to your savings account for the day after you get paid.`,
                    `Set up automatic contributions to your 401(k), IRA, or other investment accounts.`,
                    `Start small if you need to, even $25 a week, and increase the amount every few months.`
                ],
                timeframe: 'next-paycheck',
                impactLevel: 'high'
            }];
        }
        return [];
    }

    // ===================================================================
    // GENERIC FALLBACK LOGIC
    // ===================================================================

    private static getGenericIndicatorRecommendations(indicator: HealthIndicator): Recommendation[] {
        if (indicator.status === 'critical' || indicator.status === 'poor') {
            return [{
                id: `improve-${indicator.name.toLowerCase().replace(/ /g, '-')}`,
                category: 'planning', // Generic category
                priority: 'high',
                title: `Focus on Improving ${indicator.name}`,
                description: `Your score for ${indicator.name} is low. Taking steps to improve this area can have a significant impact on your overall financial health.`,
                actionSteps: [
                    `Review the detailed metrics for the ${indicator.name} indicator to understand the key drivers.`,
                    "Read educational content about this topic to build your knowledge.",
                    "Create a small, achievable goal to start building momentum."
                ],
                timeframe: 'immediate',
                impactLevel: 'high'
            }];
        } else if (indicator.status === 'fair') {
             return [{
                id: `optimize-${indicator.name.toLowerCase().replace(/ /g, '-')}`,
                category: 'planning',
                priority: 'low',
                title: `Optimize Your ${indicator.name}`,
                description: `Your score for ${indicator.name} is fair. This is a good foundation, but there are opportunities to make this area even stronger.`,
                actionSteps: [
                    `Compare your metrics for ${indicator.name} to industry benchmarks and best practices.`,
                    `Identify one specific action you can take in the next month to improve your score.`,
                    `Re-evaluate in 3 months to track your progress.`
                ],
                timeframe: 'next-3-months',
                impactLevel: 'medium'
            }];
        }
        
        return [];
    }
} 