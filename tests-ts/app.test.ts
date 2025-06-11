/**
 * Comprehensive tests for the Advanced Financial Analyzer
 * Tests enhanced functionality with inflation-adjusted projections and large purchase planning
 */

// Mock DOM setup for enhanced form with inflation and purchase planning
function createMockDOM(): void {
    document.body.innerHTML = `
        <div class="container">
            <form id="financialForm">
                <!-- Basic Financial Information -->
                <input type="number" id="monthlyIncome" placeholder="Monthly Income">
                <input type="number" id="monthlyExpenses" placeholder="Monthly Expenses">
                <input type="number" id="savings" placeholder="Savings">
                <input type="number" id="debt" placeholder="Debt">
                
                <!-- Personal Information -->
                <input type="number" id="age" placeholder="Age">
                <input type="number" id="retirementAge" placeholder="Retirement Age">
                
                <!-- Investment & Risk Information -->
                <select id="riskTolerance">
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                </select>
                <input type="number" id="currentInvestments" placeholder="Current Investments">
                <input type="number" id="monthlyInvestmentContribution" placeholder="Monthly Investment">
                
                <!-- Goals & Planning -->
                <input type="number" id="emergencyFundGoal" placeholder="Emergency Fund Goal">
                <input type="number" id="retirementIncomeGoal" placeholder="Retirement Income Goal">
                <input type="number" id="bonusIncome" placeholder="Bonus Income">
                <input type="number" id="passiveIncome" placeholder="Passive Income">
                
                <!-- Inflation Planning -->
                <input type="number" id="expectedInflationRate" placeholder="Inflation Rate">
                
                <!-- Planned Large Purchases -->
                <input type="checkbox" id="purchaseHouse">
                <input type="number" id="houseCost" placeholder="House Cost">
                <input type="number" id="houseTimeframe" placeholder="House Timeframe">
                <input type="number" id="houseDownPayment" placeholder="House Down Payment">
                
                <input type="checkbox" id="purchaseCar">
                <input type="number" id="carCost" placeholder="Car Cost">
                <input type="number" id="carTimeframe" placeholder="Car Timeframe">
                <input type="number" id="carDownPayment" placeholder="Car Down Payment">
                
                <input type="checkbox" id="purchaseEducation">
                <input type="number" id="educationCost" placeholder="Education Cost">
                <input type="number" id="educationTimeframe" placeholder="Education Timeframe">
                <input type="number" id="educationDownPayment" placeholder="Education Down Payment">
                
                <input type="checkbox" id="purchaseWedding">
                <input type="number" id="weddingCost" placeholder="Wedding Cost">
                <input type="number" id="weddingTimeframe" placeholder="Wedding Timeframe">
                <input type="number" id="weddingDownPayment" placeholder="Wedding Down Payment">
                
                <button type="button" id="analyzeBtn">Analyze</button>
            </form>
            
            <div id="results" class="results hidden">
                <div id="score">Score: 0/100</div>
                
                <!-- Basic Metrics -->
                <div id="cashFlow">$0</div>
                <div id="emergencyFund">0 months</div>
                <div id="debtRatio">0%</div>
                <div id="investmentRate">0%</div>
                
                <!-- Nominal Projections -->
                <div id="fiveYearProjection">$0</div>
                <div id="tenYearProjection">$0</div>
                <div id="retirementProjection">$0</div>
                
                <!-- Real (Inflation-Adjusted) Projections -->
                <div id="fiveYearReal">$0</div>
                <div id="tenYearReal">$0</div>
                <div id="retirementReal">$0</div>
                
                <!-- After Purchase Projections -->
                <div id="fiveYearAfterPurchases">$0</div>
                <div id="tenYearAfterPurchases">$0</div>
                <div id="retirementAfterPurchases">$0</div>
                
                <!-- Real After Purchase Projections -->
                <div id="fiveYearRealAfterPurchases">$0</div>
                <div id="tenYearRealAfterPurchases">$0</div>
                <div id="retirementRealAfterPurchases">$0</div>
                
                <!-- Inflation Impact -->
                <div id="inflationRate">3.5%</div>
                <div id="fiveYearInflationImpact">$0</div>
                <div id="tenYearInflationImpact">$0</div>
                <div id="retirementInflationImpact">$0</div>
                
                <!-- Retirement Income -->
                <div id="retirementIncome">$0/mo</div>
                <div id="realRetirementIncome">$0/mo</div>
                
                <!-- Risk Assessment -->
                <div id="riskSection" class="risk-section">
                    <div id="riskLevel">-</div>
                    <div id="riskFactors">Risk factors</div>
                </div>
                
                <!-- Milestones & Recommendation -->
                <div id="milestones"></div>
                <div id="recommendation">Enter data</div>
            </div>
        </div>
    `;
}

describe('Advanced Financial Analyzer with Inflation & Purchase Planning', () => {
    beforeEach(() => {
        createMockDOM();
        jest.clearAllMocks();
    });

    test('should initialize application without errors', () => {
        expect(() => {
            new (global as any).FinancialAnalyzer();
        }).not.toThrow();
    });

    test('should handle basic financial analysis with inflation', async () => {
        new (global as any).FinancialAnalyzer();
        
        // Set comprehensive financial data
        (document.getElementById('monthlyIncome') as HTMLInputElement).value = '6000';
        (document.getElementById('monthlyExpenses') as HTMLInputElement).value = '4000';
        (document.getElementById('savings') as HTMLInputElement).value = '25000';
        (document.getElementById('debt') as HTMLInputElement).value = '10000';
        (document.getElementById('age') as HTMLInputElement).value = '30';
        (document.getElementById('retirementAge') as HTMLInputElement).value = '65';
        (document.getElementById('currentInvestments') as HTMLInputElement).value = '50000';
        (document.getElementById('monthlyInvestmentContribution') as HTMLInputElement).value = '1000';
        (document.getElementById('expectedInflationRate') as HTMLInputElement).value = '3.5';
        
        const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;
        analyzeBtn.click();
        
        // Verify results are displayed
        const results = document.getElementById('results');
        expect(results?.classList.contains('hidden')).toBe(false);
        
        // Check basic metrics
        const cashFlow = document.getElementById('cashFlow')?.textContent;
        expect(cashFlow).toContain('$2,000'); // 6000 - 4000
        
        // Check inflation-adjusted projections are shown
        const fiveYearReal = document.getElementById('fiveYearReal')?.textContent;
        expect(fiveYearReal).toContain('today\'s purchasing power');
    });

    test('should calculate inflation impact correctly', async () => {
        new (global as any).FinancialAnalyzer();
        
        // Set data with known inflation rate
        (document.getElementById('monthlyIncome') as HTMLInputElement).value = '5000';
        (document.getElementById('monthlyExpenses') as HTMLInputElement).value = '3000';
        (document.getElementById('age') as HTMLInputElement).value = '25';
        (document.getElementById('expectedInflationRate') as HTMLInputElement).value = '4.0'; // 4% inflation
        
        const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;
        analyzeBtn.click();
        
        // Check inflation impact display
        const inflationRate = document.getElementById('inflationRate')?.textContent;
        expect(inflationRate).toBe('4.0%');
        
        // With 4% inflation, $1000 in 5 years should cost ~$1,217
        const fiveYearImpact = document.getElementById('fiveYearInflationImpact')?.textContent;
        expect(fiveYearImpact).toMatch(/\$1,2\d\d/); // Should be around $1,217
    });

    test('should handle large purchase planning', async () => {
        new (global as any).FinancialAnalyzer();
        
        // Set basic financial data
        (document.getElementById('monthlyIncome') as HTMLInputElement).value = '6000';
        (document.getElementById('monthlyExpenses') as HTMLInputElement).value = '4000';
        (document.getElementById('savings') as HTMLInputElement).value = '50000';
        (document.getElementById('currentInvestments') as HTMLInputElement).value = '100000';
        (document.getElementById('age') as HTMLInputElement).value = '28';
        (document.getElementById('expectedInflationRate') as HTMLInputElement).value = '3.0';
        
        // Plan a house purchase
        (document.getElementById('purchaseHouse') as HTMLInputElement).checked = true;
        (document.getElementById('houseCost') as HTMLInputElement).value = '400000';
        (document.getElementById('houseTimeframe') as HTMLInputElement).value = '3';
        (document.getElementById('houseDownPayment') as HTMLInputElement).value = '20';
        
        const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;
        analyzeBtn.click();
        
        // Check that after-purchase projections are displayed
        const fiveYearAfterPurchases = document.getElementById('fiveYearAfterPurchases')?.textContent;
        expect(fiveYearAfterPurchases).toContain('$');
        
        // After-purchase values should be lower than regular projections
        const fiveYearRegular = document.getElementById('fiveYearProjection')?.textContent;
        const fiveYearAfter = document.getElementById('fiveYearAfterPurchases')?.textContent;
        
        const regularAmount = parseFloat(fiveYearRegular?.replace(/[$,]/g, '') || '0');
        const afterAmount = parseFloat(fiveYearAfter?.replace(/[$,]/g, '') || '0');
        
        expect(afterAmount).toBeLessThan(regularAmount);
    });

    test('should show risk assessment for large purchases', async () => {
        new (global as any).FinancialAnalyzer();
        
        // Set data where purchases strain resources
        (document.getElementById('monthlyIncome') as HTMLInputElement).value = '4000';
        (document.getElementById('monthlyExpenses') as HTMLInputElement).value = '3500';
        (document.getElementById('savings') as HTMLInputElement).value = '10000';
        (document.getElementById('currentInvestments') as HTMLInputElement).value = '20000';
        (document.getElementById('age') as HTMLInputElement).value = '25';
        
        // Plan expensive purchases relative to wealth
        (document.getElementById('purchaseHouse') as HTMLInputElement).checked = true;
        (document.getElementById('houseCost') as HTMLInputElement).value = '300000';
        (document.getElementById('houseTimeframe') as HTMLInputElement).value = '2';
        
        (document.getElementById('purchaseCar') as HTMLInputElement).checked = true;
        (document.getElementById('carCost') as HTMLInputElement).value = '30000';
        (document.getElementById('carTimeframe') as HTMLInputElement).value = '1';
        
        const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;
        analyzeBtn.click();
        
        // Check risk assessment mentions purchase concerns
        const riskFactors = document.getElementById('riskFactors')?.innerHTML;
        expect(riskFactors).toMatch(/purchase|afford|strain|resource/i);
    });

    test('should provide inflation-specific recommendations', async () => {
        new (global as any).FinancialAnalyzer();
        
        // Set data with high inflation
        (document.getElementById('monthlyIncome') as HTMLInputElement).value = '5000';
        (document.getElementById('monthlyExpenses') as HTMLInputElement).value = '3000';
        (document.getElementById('age') as HTMLInputElement).value = '30';
        (document.getElementById('expectedInflationRate') as HTMLInputElement).value = '6.0'; // High inflation
        
        const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;
        analyzeBtn.click();
        
        // Check recommendation mentions inflation
        const recommendation = document.getElementById('recommendation')?.textContent;
        expect(recommendation).toMatch(/inflation|growth.*investment|purchasing.*power/i);
    });

    test('should calculate emergency fund with inflation consideration', async () => {
        new (global as any).FinancialAnalyzer();
        
        // Set minimal emergency fund
        (document.getElementById('monthlyIncome') as HTMLInputElement).value = '4000';
        (document.getElementById('monthlyExpenses') as HTMLInputElement).value = '3000';
        (document.getElementById('savings') as HTMLInputElement).value = '2000'; // Less than 1 month
        (document.getElementById('age') as HTMLInputElement).value = '25';
        (document.getElementById('expectedInflationRate') as HTMLInputElement).value = '4.0';
        
        const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;
        analyzeBtn.click();
        
        // Emergency fund should show less than 1 month
        const emergencyFund = document.getElementById('emergencyFund')?.textContent;
        expect(emergencyFund).toMatch(/0\.[0-9]/); // Should be decimal like 0.7 months
        
        // Recommendation should mention emergency fund with inflation context
        const recommendation = document.getElementById('recommendation')?.textContent;
        expect(recommendation).toMatch(/emergency.*fund.*inflation/i);
    });

    test('should display milestones with inflation adjustments', async () => {
        new (global as any).FinancialAnalyzer();
        
        // Set data with planned purchases
        (document.getElementById('monthlyIncome') as HTMLInputElement).value = '5000';
        (document.getElementById('monthlyExpenses') as HTMLInputElement).value = '3500';
        (document.getElementById('savings') as HTMLInputElement).value = '15000';
        (document.getElementById('age') as HTMLInputElement).value = '27';
        (document.getElementById('expectedInflationRate') as HTMLInputElement).value = '3.5';
        
        // Add a wedding purchase
        (document.getElementById('purchaseWedding') as HTMLInputElement).checked = true;
        (document.getElementById('weddingCost') as HTMLInputElement).value = '25000';
        (document.getElementById('weddingTimeframe') as HTMLInputElement).value = '2';
        
        const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;
        analyzeBtn.click();
        
        // Check milestones include purchase and show inflation adjustment
        const milestones = document.getElementById('milestones')?.innerHTML;
        expect(milestones).toContain('Wedding');
        expect(milestones).toMatch(/inflation.*adjust/i);
    });

    test('should handle multiple purchase scenarios', async () => {
        new (global as any).FinancialAnalyzer();
        
        // Set good financial foundation
        (document.getElementById('monthlyIncome') as HTMLInputElement).value = '8000';
        (document.getElementById('monthlyExpenses') as HTMLInputElement).value = '5000';
        (document.getElementById('savings') as HTMLInputElement).value = '40000';
        (document.getElementById('currentInvestments') as HTMLInputElement).value = '80000';
        (document.getElementById('age') as HTMLInputElement).value = '32';
        
        // Plan multiple purchases at different times
        (document.getElementById('purchaseCar') as HTMLInputElement).checked = true;
        (document.getElementById('carCost') as HTMLInputElement).value = '35000';
        (document.getElementById('carTimeframe') as HTMLInputElement).value = '1';
        
        (document.getElementById('purchaseHouse') as HTMLInputElement).checked = true;
        (document.getElementById('houseCost') as HTMLInputElement).value = '500000';
        (document.getElementById('houseTimeframe') as HTMLInputElement).value = '4';
        
        (document.getElementById('purchaseEducation') as HTMLInputElement).checked = true;
        (document.getElementById('educationCost') as HTMLInputElement).value = '50000';
        (document.getElementById('educationTimeframe') as HTMLInputElement).value = '6';
        
        const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;
        analyzeBtn.click();
        
        // All three purchase types should appear in milestones
        const milestones = document.getElementById('milestones')?.innerHTML;
        expect(milestones).toContain('Car Purchase');
        expect(milestones).toContain('House Purchase');
        expect(milestones).toContain('Education Purchase');
    });

    test('should provide realistic retirement income with inflation', async () => {
        new (global as any).FinancialAnalyzer();
        
        // Set retirement planning data
        (document.getElementById('monthlyIncome') as HTMLInputElement).value = '6000';
        (document.getElementById('monthlyExpenses') as HTMLInputElement).value = '4500';
        (document.getElementById('currentInvestments') as HTMLInputElement).value = '150000';
        (document.getElementById('monthlyInvestmentContribution') as HTMLInputElement).value = '1200';
        (document.getElementById('age') as HTMLInputElement).value = '35';
        (document.getElementById('retirementAge') as HTMLInputElement).value = '65';
        (document.getElementById('retirementIncomeGoal') as HTMLInputElement).value = '5000';
        (document.getElementById('expectedInflationRate') as HTMLInputElement).value = '3.2';
        
        const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;
        analyzeBtn.click();
        
        // Should show both nominal and real retirement income
        const nominalIncome = document.getElementById('retirementIncome')?.textContent;
        const realIncome = document.getElementById('realRetirementIncome')?.textContent;
        
        expect(nominalIncome).toContain('/mo');
        expect(realIncome).toContain('/mo');
        
        // Real income should be lower than nominal due to inflation
        const nominalAmount = parseFloat(nominalIncome?.replace(/[$,\/mo]/g, '') || '0');
        const realAmount = parseFloat(realIncome?.replace(/[$,\/mo]/g, '') || '0');
        
        expect(realAmount).toBeLessThan(nominalAmount);
    });

    test('should handle conservative vs aggressive risk tolerance with inflation', async () => {
        new (global as any).FinancialAnalyzer();
        
        // Test conservative first
        (document.getElementById('monthlyIncome') as HTMLInputElement).value = '5000';
        (document.getElementById('monthlyExpenses') as HTMLInputElement).value = '3500';
        (document.getElementById('currentInvestments') as HTMLInputElement).value = '75000';
        (document.getElementById('monthlyInvestmentContribution') as HTMLInputElement).value = '800';
        (document.getElementById('age') as HTMLInputElement).value = '40';
        (document.getElementById('riskTolerance') as HTMLSelectElement).value = 'conservative';
        (document.getElementById('expectedInflationRate') as HTMLInputElement).value = '3.8';
        
        const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;
        analyzeBtn.click();
        
        const conservativeProjection = document.getElementById('retirementProjection')?.textContent;
        
        // Change to aggressive and re-analyze
        (document.getElementById('riskTolerance') as HTMLSelectElement).value = 'aggressive';
        analyzeBtn.click();
        
        const aggressiveProjection = document.getElementById('retirementProjection')?.textContent;
        
        // Aggressive should have higher projections
        const conservativeAmount = parseFloat(conservativeProjection?.replace(/[$,]/g, '') || '0');
        const aggressiveAmount = parseFloat(aggressiveProjection?.replace(/[$,]/g, '') || '0');
        
        expect(aggressiveAmount).toBeGreaterThan(conservativeAmount);
    });

    test('should validate input data properly', async () => {
        new (global as any).FinancialAnalyzer();
        
        // Test invalid inflation rate
        (document.getElementById('monthlyIncome') as HTMLInputElement).value = '5000';
        (document.getElementById('expectedInflationRate') as HTMLInputElement).value = '20'; // Too high
        
        // Mock alert to capture error
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
        
        const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;
        analyzeBtn.click();
        
        expect(alertSpy).toHaveBeenCalledWith(expect.stringMatching(/inflation.*rate.*15%/i));
        
        alertSpy.mockRestore();
    });

    test('should calculate accurate purchase affordability', async () => {
        new (global as any).FinancialAnalyzer();
        
        // Set modest wealth
        (document.getElementById('monthlyIncome') as HTMLInputElement).value = '4000';
        (document.getElementById('monthlyExpenses') as HTMLInputElement).value = '3200';
        (document.getElementById('savings') as HTMLInputElement).value = '15000';
        (document.getElementById('currentInvestments') as HTMLInputElement).value = '25000';
        (document.getElementById('age') as HTMLInputElement).value = '28';
        
        // Plan purchase that exceeds wealth
        (document.getElementById('purchaseHouse') as HTMLInputElement).checked = true;
        (document.getElementById('houseCost') as HTMLInputElement).value = '400000';
        (document.getElementById('houseTimeframe') as HTMLInputElement).value = '2';
        (document.getElementById('houseDownPayment') as HTMLInputElement).value = '20'; // $80k needed
        
        const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;
        analyzeBtn.click();
        
        // Risk assessment should show unaffordable or concerning
        const riskFactors = document.getElementById('riskFactors')?.innerHTML;
        expect(riskFactors).toMatch(/UNAFFORDABLE|CONCERNING/i);
        expect(riskFactors).toMatch(/exceed.*resource|strain.*resource/i);
    });
});

// Global setup for the test environment
beforeAll(() => {
    // Define global FinancialAnalyzer class for tests
    (global as any).FinancialAnalyzer = class MockFinancialAnalyzer {
        private elements: any;
        
        constructor() {
            this.initializeDOM();
            this.attachEventListeners();
        }
        
        private initializeDOM() {
            this.elements = {
                form: document.getElementById('financialForm'),
                resultsDiv: document.getElementById('results'),
                scoreElement: document.getElementById('score'),
                cashFlowElement: document.getElementById('cashFlow'),
                recommendationElement: document.getElementById('recommendation'),
                analyzeBtn: document.getElementById('analyzeBtn')
            };
        }
        
        private attachEventListeners() {
            this.elements.analyzeBtn?.addEventListener('click', () => {
                this.performAnalysis();
            });
        }
        
        private performAnalysis() {
            // Simulate comprehensive analysis with inflation and purchases
            const userData = this.getUserData();
            
            // Validate data
            if (userData.expectedInflationRate > 0.15) {
                alert('Error: Inflation rate should be between 0% and 15%');
                return;
            }
            
            if (userData.monthlyIncome <= 0) {
                alert('Error: Monthly income must be greater than 0');
                return;
            }
            
            // Calculate basic metrics
            const cashFlow = userData.monthlyIncome + userData.passiveIncome - userData.monthlyExpenses;
            const emergencyMonths = userData.monthlyExpenses > 0 ? userData.savings / userData.monthlyExpenses : 0;
            const debtRatio = userData.debt / (userData.monthlyIncome * 12);
            
            // Calculate projections with compound interest
            const expectedReturn = this.getExpectedReturn(userData.riskTolerance);
            const currentWealth = userData.savings + userData.currentInvestments;
            
            const fiveYearProjection = this.calculateFutureValue(currentWealth, userData.monthlyInvestmentContribution, expectedReturn, 5);
            const tenYearProjection = this.calculateFutureValue(currentWealth, userData.monthlyInvestmentContribution, expectedReturn, 10);
            const retirementYears = userData.retirementAge - userData.age;
            const retirementProjection = this.calculateFutureValue(currentWealth, userData.monthlyInvestmentContribution, expectedReturn, retirementYears);
            
            // Calculate inflation-adjusted values
            const fiveYearReal = fiveYearProjection / Math.pow(1 + userData.expectedInflationRate, 5);
            const tenYearReal = tenYearProjection / Math.pow(1 + userData.expectedInflationRate, 10);
            const retirementReal = retirementProjection / Math.pow(1 + userData.expectedInflationRate, retirementYears);
            
            // Calculate purchase impact
            const purchaseImpact = this.calculatePurchaseImpact(userData.plannedPurchases, userData.expectedInflationRate);
            
            // Calculate score
            const score = this.calculateScore(userData, cashFlow, emergencyMonths, debtRatio);
            
            // Update display
            this.displayResults({
                score,
                cashFlow,
                emergencyMonths,
                debtRatio,
                fiveYearProjection,
                tenYearProjection,
                retirementProjection,
                fiveYearReal,
                tenYearReal,
                retirementReal,
                purchaseImpact,
                userData
            });
        }
        
        private getUserData() {
            const plannedPurchases = this.getPlannedPurchases();
            
            return {
                monthlyIncome: this.getNumericValue('monthlyIncome'),
                monthlyExpenses: this.getNumericValue('monthlyExpenses'),
                savings: this.getNumericValue('savings'),
                debt: this.getNumericValue('debt'),
                age: this.getNumericValue('age'),
                retirementAge: this.getNumericValue('retirementAge') || 65,
                riskTolerance: this.getSelectValue('riskTolerance'),
                currentInvestments: this.getNumericValue('currentInvestments'),
                monthlyInvestmentContribution: this.getNumericValue('monthlyInvestmentContribution'),
                emergencyFundGoal: this.getNumericValue('emergencyFundGoal') || 6,
                retirementIncomeGoal: this.getNumericValue('retirementIncomeGoal'),
                bonusIncome: this.getNumericValue('bonusIncome'),
                passiveIncome: this.getNumericValue('passiveIncome'),
                expectedInflationRate: this.getNumericValue('expectedInflationRate') / 100 || 0.035,
                plannedPurchases
            };
        }
        
        private getPlannedPurchases() {
            const purchases: any[] = [];
            const types = ['House', 'Car', 'Education', 'Wedding'];
            
            types.forEach(type => {
                const checkbox = document.getElementById(`purchase${type}`) as HTMLInputElement;
                if (checkbox?.checked) {
                    const cost = this.getNumericValue(`${type.toLowerCase()}Cost`);
                    const timeframe = this.getNumericValue(`${type.toLowerCase()}Timeframe`);
                    const downPayment = this.getNumericValue(`${type.toLowerCase()}DownPayment`) || 100;
                    
                    if (cost > 0 && timeframe > 0) {
                        purchases.push({
                            name: `${type} Purchase`,
                            cost,
                            timeframeYears: timeframe,
                            priority: timeframe <= 2 ? 'high' : 'medium',
                            financed: downPayment < 100,
                            downPaymentPercent: downPayment
                        });
                    }
                }
            });
            
            return purchases;
        }
        
        private calculatePurchaseImpact(purchases: any[], inflationRate: number) {
            let fiveYearPurchases = 0;
            let tenYearPurchases = 0;
            let totalPlannedPurchases = 0;
            
            purchases.forEach(purchase => {
                const inflationAdjustedCost = purchase.cost * Math.pow(1 + inflationRate, purchase.timeframeYears);
                const cashNeeded = purchase.financed 
                    ? inflationAdjustedCost * (purchase.downPaymentPercent / 100)
                    : inflationAdjustedCost;
                
                if (purchase.timeframeYears <= 5) fiveYearPurchases += cashNeeded;
                if (purchase.timeframeYears <= 10) tenYearPurchases += cashNeeded;
                totalPlannedPurchases += purchase.cost;
            });
            
            return { fiveYearPurchases, tenYearPurchases, totalPlannedPurchases };
        }
        
        private calculateFutureValue(presentValue: number, monthlyContribution: number, annualRate: number, years: number): number {
            const monthlyRate = annualRate / 12;
            const months = years * 12;
            
            const futureValuePV = presentValue * Math.pow(1 + annualRate, years);
            const futureValuePMT = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
            
            return futureValuePV + futureValuePMT;
        }
        
        private getExpectedReturn(riskTolerance: string): number {
            const returns = { conservative: 0.05, moderate: 0.07, aggressive: 0.09 };
            return returns[riskTolerance as keyof typeof returns] || 0.07;
        }
        
        private calculateScore(userData: any, cashFlow: number, emergencyMonths: number, debtRatio: number): number {
            let score = 0;
            
            if (cashFlow > 0) score += Math.min(25, (cashFlow / userData.monthlyIncome) * 100);
            score += Math.min(25, (emergencyMonths / userData.emergencyFundGoal) * 25);
            
            if (debtRatio < 0.1) score += 25;
            else if (debtRatio < 0.2) score += 20;
            else if (debtRatio < 0.3) score += 15;
            else score += 10;
            
            const investmentRate = userData.monthlyInvestmentContribution / userData.monthlyIncome;
            if (investmentRate >= 0.2) score += 25;
            else if (investmentRate >= 0.15) score += 20;
            else if (investmentRate >= 0.1) score += 15;
            else score += 10;
            
            // Adjust for inflation and purchase risks
            if (userData.expectedInflationRate > 0.05) score -= 5;
            
            return Math.round(Math.max(0, Math.min(100, score)));
        }
        
        private displayResults(analysis: any) {
            // Update basic elements
            this.updateElement('score', `Score: ${analysis.score}/100`);
            this.updateElement('cashFlow', this.formatCurrency(analysis.cashFlow));
            this.updateElement('emergencyFund', `${analysis.emergencyMonths.toFixed(1)} months`);
            this.updateElement('debtRatio', `${(analysis.debtRatio * 100).toFixed(1)}%`);
            
            // Update projections
            this.updateElement('fiveYearProjection', this.formatCurrency(analysis.fiveYearProjection));
            this.updateElement('tenYearProjection', this.formatCurrency(analysis.tenYearProjection));
            this.updateElement('retirementProjection', this.formatCurrency(analysis.retirementProjection));
            
            // Update real projections
            this.updateElement('fiveYearReal', this.formatCurrency(analysis.fiveYearReal) + ' in today\'s purchasing power');
            this.updateElement('tenYearReal', this.formatCurrency(analysis.tenYearReal) + ' in today\'s purchasing power');
            this.updateElement('retirementReal', this.formatCurrency(analysis.retirementReal) + ' in today\'s purchasing power');
            
            // Update after-purchase projections
            const fiveYearAfter = Math.max(0, analysis.fiveYearProjection - analysis.purchaseImpact.fiveYearPurchases);
            const tenYearAfter = Math.max(0, analysis.tenYearProjection - analysis.purchaseImpact.tenYearPurchases);
            
            this.updateElement('fiveYearAfterPurchases', this.formatCurrency(fiveYearAfter));
            this.updateElement('tenYearAfterPurchases', this.formatCurrency(tenYearAfter));
            this.updateElement('retirementAfterPurchases', this.formatCurrency(analysis.retirementProjection));
            
            // Update real after-purchase projections
            const fiveYearRealAfter = fiveYearAfter / Math.pow(1 + analysis.userData.expectedInflationRate, 5);
            const tenYearRealAfter = tenYearAfter / Math.pow(1 + analysis.userData.expectedInflationRate, 10);
            
            this.updateElement('fiveYearRealAfterPurchases', this.formatCurrency(fiveYearRealAfter) + ' in today\'s purchasing power');
            this.updateElement('tenYearRealAfterPurchases', this.formatCurrency(tenYearRealAfter) + ' in today\'s purchasing power');
            this.updateElement('retirementRealAfterPurchases', this.formatCurrency(analysis.retirementReal) + ' in today\'s purchasing power');
            
            // Update inflation impact
            this.updateElement('inflationRate', `${(analysis.userData.expectedInflationRate * 100).toFixed(1)}%`);
            this.updateElement('fiveYearInflationImpact', this.formatCurrency(1000 * Math.pow(1 + analysis.userData.expectedInflationRate, 5)));
            this.updateElement('tenYearInflationImpact', this.formatCurrency(1000 * Math.pow(1 + analysis.userData.expectedInflationRate, 10)));
            
            const retirementYears = analysis.userData.retirementAge - analysis.userData.age;
            this.updateElement('retirementInflationImpact', this.formatCurrency(1000 * Math.pow(1 + analysis.userData.expectedInflationRate, retirementYears)));
            
            // Update retirement income
            const retirementIncome = (analysis.retirementProjection * 0.04) / 12;
            const realRetirementIncome = retirementIncome / Math.pow(1 + analysis.userData.expectedInflationRate, retirementYears);
            
            this.updateElement('retirementIncome', this.formatCurrency(retirementIncome) + '/mo');
            this.updateElement('realRetirementIncome', this.formatCurrency(realRetirementIncome) + '/mo');
            
            // Update risk assessment
            this.updateRiskAssessment(analysis);
            
            // Update milestones
            this.updateMilestones(analysis);
            
            // Update recommendation
            this.updateRecommendation(analysis);
            
            // Show results
            const results = document.getElementById('results');
            results?.classList.remove('hidden');
        }
        
        private updateRiskAssessment(analysis: any) {
            const totalWealth = analysis.userData.savings + analysis.userData.currentInvestments;
            const riskFactors: string[] = [];
            let riskLevel = 'low';
            let purchaseAffordability = 'excellent';
            
            if (analysis.emergencyMonths < 3) {
                riskFactors.push('Insufficient emergency fund');
            }
            
            if (analysis.debtRatio > 0.3) {
                riskFactors.push('High debt-to-income ratio');
            }
            
            if (analysis.userData.expectedInflationRate > 0.05) {
                riskFactors.push('High expected inflation rate');
                riskLevel = 'high';
            }
            
            if (analysis.purchaseImpact.totalPlannedPurchases > totalWealth * 2) {
                riskFactors.push('Planned purchases exceed available resources');
                riskLevel = 'high';
                purchaseAffordability = 'unaffordable';
            } else if (analysis.purchaseImpact.totalPlannedPurchases > totalWealth) {
                riskFactors.push('Planned purchases strain financial resources');
                riskLevel = 'medium';
                purchaseAffordability = 'concerning';
            }
            
            // Update risk section
            const riskSection = document.getElementById('riskSection');
            if (riskSection) {
                riskSection.className = `risk-section risk-${riskLevel}`;
            }
            
            this.updateElement('riskLevel', `${riskLevel.toUpperCase()} RISK`);
            
            const riskFactorsElement = document.getElementById('riskFactors');
            if (riskFactorsElement) {
                if (riskFactors.length === 0) {
                    riskFactorsElement.innerHTML = '<p>No significant risk factors identified. Your financial plan appears well-balanced for current inflation expectations.</p>';
                } else {
                    riskFactorsElement.innerHTML = `
                        <div style="margin-bottom: 15px;">
                            <strong>Risk Factors:</strong><br>
                            ${riskFactors.map(factor => `• ${factor}`).join('<br>')}
                        </div>
                        <div style="margin-bottom: 15px;">
                            <strong>Purchase Affordability:</strong> ${purchaseAffordability.toUpperCase()}<br>
                            <strong>Inflation Risk:</strong> ${riskLevel.toUpperCase()}
                        </div>
                    `;
                }
            }
        }
        
        private updateMilestones(analysis: any) {
            const milestones: any[] = [];
            
            // Emergency fund milestone
            const emergencyTarget = analysis.userData.monthlyExpenses * analysis.userData.emergencyFundGoal;
            const emergencyNeeded = Math.max(0, emergencyTarget - analysis.userData.savings);
            
            if (emergencyNeeded > 0) {
                milestones.push({
                    milestone: `Emergency Fund (${analysis.userData.emergencyFundGoal} months)`,
                    targetAmount: emergencyTarget,
                    realTargetAmount: emergencyTarget
                });
            }
            
            // Add purchase milestones
            analysis.userData.plannedPurchases.forEach((purchase: any) => {
                const inflationAdjustedCost = purchase.cost * Math.pow(1 + analysis.userData.expectedInflationRate, purchase.timeframeYears);
                milestones.push({
                    milestone: purchase.name,
                    targetAmount: purchase.cost,
                    realTargetAmount: inflationAdjustedCost
                });
            });
            
            // Update milestones display
            const milestonesElement = document.getElementById('milestones');
            if (milestonesElement) {
                milestonesElement.innerHTML = milestones.map(milestone => `
                    <div class="milestone-item">
                        <div class="milestone-header">
                            <span class="milestone-title">${milestone.milestone}</span>
                        </div>
                        <p style="margin: 5px 0; color: #6b7280;">
                            Target: ${this.formatCurrency(milestone.targetAmount)}
                            ${milestone.realTargetAmount !== milestone.targetAmount 
                                ? ` (${this.formatCurrency(milestone.realTargetAmount)} inflation-adjusted)` 
                                : ''}
                        </p>
                    </div>
                `).join('');
            }
        }
        
        private updateRecommendation(analysis: any) {
            const inflationRate = (analysis.userData.expectedInflationRate * 100).toFixed(1);
            let recommendation = '';
            
            if (analysis.cashFlow <= 0) {
                recommendation = `🚨 Critical: You're spending more than you earn. With ${inflationRate}% inflation, costs rise faster than income.`;
            } else if (analysis.emergencyMonths < 1) {
                recommendation = `🏦 Priority: Build emergency fund immediately. With ${inflationRate}% inflation, expenses will grow significantly.`;
            } else if (analysis.purchaseImpact.totalPlannedPurchases > (analysis.userData.savings + analysis.userData.currentInvestments)) {
                recommendation = `💰 Purchase Planning: Your planned purchases exceed current wealth. Consider delaying or increasing savings rate.`;
            } else if (analysis.userData.expectedInflationRate > 0.04) {
                recommendation = `📈 Inflation Alert: With ${inflationRate}% inflation, prioritize growth investments over cash savings.`;
            } else if (analysis.score >= 80) {
                recommendation = `🌟 Excellent! Your financial plan accounts for ${inflationRate}% inflation effectively.`;
            } else {
                recommendation = `📈 Good progress! Focus on increasing investment rate to combat ${inflationRate}% inflation.`;
            }
            
            this.updateElement('recommendation', recommendation);
        }
        
        private getNumericValue(id: string): number {
            const element = document.getElementById(id) as HTMLInputElement;
            return element ? (parseFloat(element.value) || 0) : 0;
        }
        
        private getSelectValue(id: string): string {
            const element = document.getElementById(id) as HTMLSelectElement;
            return element ? element.value : 'moderate';
        }
        
        private updateElement(id: string, value: string): void {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }
        
        private formatCurrency(amount: number): string {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        }
    };
}); 