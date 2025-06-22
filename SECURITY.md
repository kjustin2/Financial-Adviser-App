# Security Guidelines for Financial Health Analyzer

## 🔒 Overview

This Financial Health Analyzer application handles sensitive financial data and must maintain the highest security standards. This document outlines security practices, configurations, and guidelines for developers working on this project.

## 🚨 Critical Security Rules

### API Key Management
- ✅ **NEVER** commit real API keys to version control
- ✅ **ALWAYS** use `.env.example` for templates with placeholder values
- ✅ **ALWAYS** keep real API keys in `.env` file (excluded from git)
- ✅ **ROTATE** API keys regularly in production environments
- ✅ **MONITOR** API usage for unusual activity

### Development Server Security
- ✅ **PRIMARY RULE**: Use `npm run build` for testing, avoid unnecessary servers
- ✅ **NEVER** leave development servers running unattended
- ✅ **STOP** servers immediately after use to prevent conflicts
- ✅ **USE** unique ports if servers are required

### Financial Data Protection
- ✅ **ENCRYPT** sensitive financial data at rest and in transit
- ✅ **VALIDATE** all financial inputs before processing
- ✅ **SANITIZE** user inputs to prevent injection attacks
- ✅ **IMPLEMENT** proper error handling without exposing sensitive info

## 📁 File Security Configuration

### .gitignore Protection
The `.gitignore` file protects:
- Environment variables (`.env*`)
- API keys and secrets (`**/secrets/`, `*.key`)
- AI assistant configs (`.cursor/mcp.json`)
- Database files (`*.sqlite`, `*.db`)
- Financial data files (`*.financial`, `*.banking`)
- User data directories (`**/user-data/`, `**/personal-info/`)

### .cursorignore Security
The `.cursorignore` file excludes from AI context:
- All API keys and credentials
- Sensitive configuration files
- User and financial data
- Large cache files
- Personal notes and drafts

### Template Files
- `.env.example` - Safe environment template
- `.cursor/mcp.json.example` - Safe MCP configuration template

## 🔍 Security Checklist

### Before Committing Code
- [ ] No real API keys in any files
- [ ] All sensitive data in `.env` (not committed)
- [ ] New sensitive file patterns added to `.gitignore`
- [ ] No financial data in test files
- [ ] Input validation added for new features
- [ ] Error handling doesn't expose sensitive info

### Before Deployment
- [ ] Production API keys configured separately
- [ ] Environment variables properly set
- [ ] Security headers configured
- [ ] Input validation tested
- [ ] Error handling tested
- [ ] Access controls verified

### Regular Security Maintenance
- [ ] Rotate API keys quarterly
- [ ] Review and update dependencies
- [ ] Check for security vulnerabilities
- [ ] Monitor API usage patterns
- [ ] Review access logs
- [ ] Update security documentation

## 🛡️ Security Features Implemented

### Input Validation
- All user inputs validated before processing
- Financial calculations protected against manipulation
- Form validation with security checks
- Sanitization of all user-provided data

### Error Handling
- Try-catch blocks for all async operations
- Error messages don't expose sensitive information
- Proper logging without sensitive data
- Graceful degradation for security failures

### Development Security
- TypeScript for type safety
- Strict compilation settings
- Security-focused linting rules
- Comprehensive input validation

## 🚀 Development Commands

### Secure Testing
```bash
# Always use build for testing (recommended)
npm run build

# If server is needed, stop immediately after use
npm start
# ... test functionality ...
# Ctrl+C to stop server
```

### Secure Configuration
```bash
# Copy templates and add real values
cp .env.example .env
cp .cursor/mcp.json.example .cursor/mcp.json

# Edit with real API keys (never commit these)
# .env and .cursor/mcp.json are already in .gitignore
```

## ⚠️ Security Incidents

### If API Key Exposed
1. **IMMEDIATELY** revoke the exposed key
2. Generate new API key
3. Update all configurations
4. Review commit history for other exposures
5. Monitor for unauthorized usage

### If Sensitive Data Committed
1. **DO NOT** just delete the file - history remains
2. Use git tools to remove from history
3. Force push to update remote
4. Notify team members to re-clone
5. Rotate any exposed credentials

## 📞 Security Contacts

For security issues or questions:
- Review this documentation first
- Check `.cursorrules` for development guidelines
- Validate against security checklist
- Test with `npm run build` before committing

## 🔄 Regular Updates

This security documentation should be updated when:
- New API integrations are added
- Security vulnerabilities are discovered
- Development practices change
- New team members join the project

---

**Remember**: In financial applications, security is not optional. Every feature must be developed with security as a primary concern, not an afterthought. 