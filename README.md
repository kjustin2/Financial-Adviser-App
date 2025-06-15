# 💰 Financial Health Analyzer

A modern, TypeScript-based financial health analyzer that runs entirely in your browser. Get comprehensive financial analysis, personalized recommendations, and projections without any server dependencies.

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Financial-Adviser-App.git
   cd Financial-Adviser-App
   ```

2. **Install dependencies and start**
   ```bash
   npm install
   npm start
   ```
   
   Or use the Windows helper script:
   ```cmd
   start.cmd
   ```

3. **Open your browser** to `http://localhost:3000` and start analyzing your finances!

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

## 🏗️ Technology Stack

- **Frontend**: TypeScript, HTML5, CSS3 (modern standards)
- **Build System**: Webpack 5 with TypeScript compilation
- **Charts**: Chart.js for interactive financial visualizations
- **Testing**: Jest with TypeScript support and comprehensive test coverage
- **Deployment**: GitHub Pages with automated CI/CD workflow

## 📖 How to Use

### Step 1: Basic Financial Information (Required)
- **Monthly Income**: Your take-home income after taxes
- **Monthly Expenses**: Essential expenses (housing, food, utilities, transport)
- **Current Savings**: Total in savings and checking accounts
- **Total Debt**: Credit cards, loans, etc. (excluding mortgage)

### Step 2: Advanced Details (Optional)
Expand the "Advanced Details" section for enhanced analysis:
- **Age & Retirement Planning**: Enables retirement projections and timeline
- **Investment Information**: Current portfolio and monthly contributions
- **Risk Tolerance**: Conservative, moderate, or aggressive investment strategy
- **Emergency Fund Goal**: Customize target months of expense coverage

### Step 3: Get Comprehensive Analysis
Receive detailed insights including:
- **Financial Health Score**: Color-coded rating with breakdown
- **Key Metrics Dashboard**: Cash flow, emergency fund, debt ratios, savings rate
- **Personalized Recommendations**: Priority-based actionable advice
- **Interactive Charts** (if age provided): Wealth projections and health trends

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

# Start development server with hot reload
npm start

# Build for production
npm run build

# Run test suite
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### Project Structure
```
Financial-Adviser-App/
├── src/
│   ├── app.ts          # Main application logic
│   ├── types.ts        # TypeScript interfaces
│   └── index.html      # UI with modern CSS
├── tests-ts/           # Jest test suites
├── dist/               # Production build output
└── webpack.config.js   # Build configuration
```

## 🌐 Deployment

### GitHub Pages (Automated)
1. Push changes to the `main` branch
2. GitHub Actions automatically builds and deploys
3. Live site available at: `https://yourusername.github.io/Financial-Adviser-App`

### Manual Deployment
```bash
# Build production version
npm run build

# Deploy dist/ folder to any static hosting service
# (Netlify, Vercel, AWS S3, etc.)
```

## 🔒 Privacy & Security

- **No Data Transmission**: All calculations performed locally in your browser
- **No Sign-up Required**: Use immediately without accounts or registration
- **No Tracking**: Zero analytics, cookies, or data collection
- **Open Source**: Complete code transparency for security review

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