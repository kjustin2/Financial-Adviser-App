# 💰 Financial Health Analyzer

A comprehensive, research-based financial health analyzer built with TypeScript. This application implements the Financial Health Network 2024 standards and provides two distinct analysis paths: a "Quick Analysis" for a rapid snapshot and a "Comprehensive Analysis" for a deep dive into your financial well-being.

## 🚀 Live Demo

**🌐 [Try the Financial Health Analyzer](https://kjustin2.github.io/Financial-Adviser-App/)**

## ✨ Features

### Two Analysis Modes
- **Quick Analysis**: Get a fast, high-level overview of your financial health with just six key inputs. Ideal for a quick check-up.
- **Comprehensive Analysis**: A deep, multi-step assessment covering 8 core financial health indicators, behavioral finance, and long-term goal planning.

### 🎯 8 Core Financial Health Indicators (Comprehensive Analysis)
Based on Financial Health Network 2024 standards:
1.  **Spending vs Income Analysis**
2.  **Bill Payment Reliability**
3.  **Emergency Savings Adequacy**
4.  **Debt Management Effectiveness**
5.  **Credit Score Health**
6.  **Insurance Coverage Confidence**
7.  **Long-term Financial Goal Confidence**
8.  **Financial Planning Engagement**

### 🧠 Advanced Analysis & Personalized Recommendations
- **Data-Driven Insights**: The calculation engine processes your data to identify strengths and weaknesses.
- **Personalized Action Plan**: The `RecommendationEngine` generates a prioritized list of actionable steps to improve your financial health, from high-priority warnings to low-priority suggestions.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A modern web browser

### Development
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/kjustin2/Financial-Adviser-App.git
    cd Financial-Adviser-App
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the development server**:
    ```bash
    npm start
    ```
    This will open the application at `http://localhost:3011`.

### Building for Production
To create a static build for deployment:
```bash
npm run build
```
The optimized files will be placed in the `dist/` directory.

## 🏗️ Project Structure

The project follows a modular, feature-oriented architecture:

```
src/
├── core/                 # Core business logic (calculations, engines)
├── components/           # Reusable UI components (forms, charts, reports)
├── data/                 # Static data and benchmarks
├── services/             # Application services (e.g., FormService)
├── interfaces/           # TypeScript type and interface definitions
├── utils/                # Utility functions
└── ImprovedApp.ts        # Main application entry point
```

## 🔒 Privacy & Security

This application is designed with privacy as a top priority.
- **Client-Side Calculations**: All financial data is processed locally in your browser. No data is ever sent to a server.
- **No Tracking**: The application does not use cookies, analytics, or any tracking scripts.
- **Open Source**: The code is fully transparent and available for review.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

## 🚀 Quick Start

### For Users
**🌐 [Open the Financial Health Analyzer](https://kjustin2.github.io/Financial-Adviser-App/)** - No installation required!

### For Developers
1. **Clone the repository**
   ```bash
   git clone https://github.com/kjustin2/Financial-Adviser-App.git
   cd Financial-Adviser-App
   ```

2. **Install dependencies and build**
   ```bash
   npm install
   npm run build
   ```
   
   📚 **Note**: Use `npm run build` for testing (recommended) to avoid server conflicts

3. **Open** `dist/index.html` in your browser to test locally

## ✨ Key Features

### 🎯 Smart Two-Tier Analysis
- **Basic Mode**: Requires only essential information (income, expenses, savings, debt)
- **Advanced Mode**: Optional detailed planning with age-based retirement projections
- **Conditional Features**: Advanced charts and projections only appear when relevant data is provided

### 📊 Core Financial Metrics
- **Financial Health Score**: 0-100 comprehensive rating with detailed breakdown
- **Cash Flow Analysis**: Real-time monthly surplus/deficit calculations
- **Emergency Fund Assessment**: Tracks progress toward 3-6 months expense coverage
- **Debt-to-Income Ratio**: Professional-grade debt analysis
- **Savings Rate Optimization**: Progress toward 10-20% savings goals

### 📈 Advanced Planning Tools (Age-Based)
- **Retirement Projections**: Income replacement and growth calculations using historical data
- **Wealth Growth Charts**: Visual projections with inflation-adjusted purchasing power
- **Investment Scenarios**: Conservative, moderate, and aggressive growth models
- **Financial Health Trends**: 12-month forward-looking score projections

### 🎨 Modern User Experience
- **Clean, Professional Interface**: Modern CSS with custom properties and animations
- **Mobile-First Design**: Fully responsive across all device sizes
- **Interactive Help System**: Info boxes with explanations for every input field
- **Expandable Sections**: Collapsible Basic/Advanced inputs and chart sections
- **Real-Time Validation**: Instant feedback on input data

## 🏗️ Technology Stack & Architecture

### Core Technologies
- **Frontend**: TypeScript, HTML5, CSS3 with modern design patterns
- **Build System**: Webpack 5 with TypeScript compilation and optimization
- **Financial Calculations**: Custom engines with research-based algorithms
- **Data Visualization**: Custom chart implementations for financial data
- **Testing**: Comprehensive TypeScript test suites
- **Deployment**: GitHub Pages with automated CI/CD

### Advanced Features
- **Monte Carlo Engine**: Sophisticated portfolio simulation with 10,000+ scenarios
- **Economic Scenario Modeling**: Dynamic market conditions with regime changes
- **Behavioral Finance Integration**: Psychology-based bias detection and mitigation
- **Caching System**: High-performance local storage with compression
- **Security-First Design**: No external data transmission, privacy-focused

## 📖 How to Use the Analyzer

### Step 1: Personal Information
- Age and location for personalized analysis
- Employment status and financial goals

### Step 2: Income & Cash Flow  
- Monthly take-home income
- Regular income sources and stability

### Step 3: Monthly Expenses
- Housing, transportation, food, and utilities
- Discretionary spending and lifestyle costs

### Step 4: Assets & Savings
- Checking and savings account balances
- Investment portfolios and retirement accounts

### Step 5: Liabilities & Debt
- Credit card balances and monthly payments
- Loans, mortgages, and other obligations

### Step 6: Goals & Behavioral Assessment
- Retirement planning and risk tolerance
- Behavioral finance questionnaire for bias detection

### Results Dashboard
- **Comprehensive Health Score**: Research-based 0-100 rating
- **8 Health Indicators**: Detailed analysis with status colors
- **Behavioral Analysis**: Cognitive bias detection and impact assessment  
- **Monte Carlo Projections**: Portfolio performance scenarios
- **Actionable Recommendations**: Personalized improvement strategies

## 🎯 Financial Principles

Based on proven financial fundamentals:

### Historical Inflation Adjustment
- **Automatic Calculation**: Uses 3.5% historical inflation rate (no manual input needed)
- **Real Purchasing Power**: Shows both nominal and inflation-adjusted projections
- **Long-term Planning**: Accounts for cost of living increases over time

### Savings & Investment Guidelines
- **10-20% Savings Rule**: Tracks progress toward wealth building targets
- **Emergency Fund**: 3-6 months expenses for financial security
- **Age-Based Risk Tolerance**: Investment allocation recommendations
- **4% Withdrawal Rule**: Retirement income sustainability calculations

## 💻 Development

### Prerequisites
- Node.js 16+ (for TypeScript compilation and development)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Development Workflow
```bash
# Install dependencies
npm install

# Build for testing/production (recommended approach)
npm run build

# Open dist/index.html in browser to test

# Run comprehensive test suite (when available)
npm test
```

### Project Structure
```
Financial-Adviser-App/
├── src/
│   ├── app.ts                    # Main application logic
│   ├── types.ts                  # TypeScript interfaces
│   ├── index.html                # UI with modern CSS
│   ├── core/                     # Core engines and calculations
│   │   ├── MonteCarloEngine.ts   # Portfolio simulation engine
│   │   ├── ScenarioEngine.ts     # Economic scenario modeling
│   │   ├── BiasDetectionEngine.ts # Behavioral finance analysis
│   │   ├── CacheManager.ts       # Performance optimization
│   │   └── calculations.ts       # Financial health algorithms
│   ├── components/               # UI components and charts
│   └── data/                     # Economic scenarios and questions
├── dist/                         # Production build output
├── .taskmaster/                  # Project management
└── webpack.config.js             # Build configuration
```

## 🌐 Deployment

### GitHub Pages (Live)
**Current Deployment**: [https://kjustin2.github.io/Financial-Adviser-App/](https://kjustin2.github.io/Financial-Adviser-App/)

The application is automatically deployed via GitHub Actions when changes are pushed to the main branch.

### Manual Deployment
```bash
# Build production version
npm run build

# Deploy dist/ folder to any static hosting service
# (Netlify, Vercel, AWS S3, etc.)
```

## 🧪 Testing

Comprehensive test coverage includes:
- **Unit Tests**: Core calculation functions and financial algorithms
- **Integration Tests**: DOM manipulation and user interaction flows
- **Scenario Testing**: Edge cases and various financial situations
- **Performance Tests**: Chart rendering and calculation efficiency

Run tests with:
```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode for development
npm run test:coverage      # Generate coverage report
```

## 📊 Sample Analysis

Try the calculator with sample data:
- **Monthly Income**: $6,000
- **Monthly Expenses**: $4,500
- **Current Savings**: $15,000
- **Total Debt**: $8,000
- **Age**: 30 (enables advanced features)

Expected Results:
- **Health Score**: 70-80 (Good range)
- **Cash Flow**: +$1,500/month
- **Savings Rate**: 25% (Excellent)
- **Recommendations**: Continue current trajectory, optimize investments

## 🔄 Recent Major Updates

### Version 2.0 - Modern TypeScript Implementation
- **Simplified User Interface**: Two-tier Basic/Advanced input structure
- **Removed Manual Inflation Input**: Now uses 3.5% historical average automatically
- **Enhanced Chart Integration**: Chart.js with proper TypeScript support
- **Improved Mobile Experience**: Better responsive design and touch interactions
- **Conditional Feature Display**: Advanced features only shown when relevant
- **Comprehensive Test Coverage**: 13 test scenarios covering all major functionality

## ❓ FAQ

**Q: Do I need to provide all information?**
A: No! Only basic financial information is required. Advanced features (like retirement projections) only appear if you provide your age.

**Q: How accurate are the projections?**
A: Projections use standard financial formulas and historical market data (7% average return, 3.5% inflation). Actual results may vary.

**Q: Can I save my analysis?**
A: Currently, data is session-based. We recommend taking screenshots of your results for record-keeping.

**Q: What about privacy?**
A: All calculations happen in your browser. No data is sent to servers or stored externally.

**Q: Can I use this for business finances?**
A: This tool is designed for personal/family financial planning. Business finances have different requirements.

## 🚀 Future Enhancements

### Planned Features
- **Data Export**: PDF reports and JSON backup/restore
- **Goal Tracking**: Set and monitor financial milestones
- **Scenario Planning**: "What-if" analysis tools
- **Advanced Charts**: More detailed visualization options
- **PWA Support**: Install as mobile app with offline functionality

### Educational Content
- **Financial Literacy Modules**: Interactive learning content
- **Best Practices Guide**: Detailed financial planning strategies
- **Video Tutorials**: Step-by-step planning guides

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern TypeScript and web standards for performance and accessibility
- Chart.js integration for professional-quality financial visualizations
- Financial calculations based on academic research and industry best practices
- Designed for privacy-focused users who want local-only financial analysis

---

**Start your journey to financial wellness today!** 🌟

[Live Demo](https://yourusername.github.io/Financial-Adviser-App) | [Report Issues](https://github.com/yourusername/Financial-Adviser-App/issues) | [Contribute](https://github.com/yourusername/Financial-Adviser-App/pulls) 