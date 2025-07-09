# Contributing to SimpleSwap DApp

Thank you for your interest in contributing to SimpleSwap DApp! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/simple-swap-dapp.git
   cd simple-swap-dapp
   \`\`\`

3. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

4. **Set up environment variables**:
   \`\`\`bash
   cp .env.example .env
   # Fill in your environment variables
   \`\`\`

## 🧪 Development Workflow

### Running Tests
\`\`\`bash
# Run all tests
npm run hardhat:test

# Check test coverage
npm run hardhat:coverage

# Run frontend in development
npm run dev
\`\`\`

### Code Quality
- Follow TypeScript best practices
- Ensure all tests pass
- Maintain >50% test coverage
- Use meaningful commit messages

### Commit Message Format
\`\`\`
type(scope): description

Examples:
feat(swap): add token approval flow
fix(wallet): resolve connection timeout
docs(readme): update installation instructions
test(contract): add edge case tests
\`\`\`

## 📝 Pull Request Process

1. **Create a feature branch**:
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

2. **Make your changes**
3. **Add tests** for new functionality
4. **Ensure all tests pass**:
   \`\`\`bash
   npm run hardhat:test
   npm run hardhat:coverage
   \`\`\`

5. **Commit your changes**:
   \`\`\`bash
   git add .
   git commit -m "feat(scope): your descriptive message"
   \`\`\`

6. **Push to your fork**:
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`

7. **Create a Pull Request**

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (browser, wallet, etc.)
- Screenshots if applicable

## 💡 Feature Requests

For feature requests, please:
- Check if the feature already exists
- Provide clear use case and benefits
- Consider implementation complexity
- Be open to discussion and feedback

## 🔒 Security

If you discover a security vulnerability:
- **DO NOT** open a public issue
- Email the maintainers directly
- Provide detailed information about the vulnerability
- Allow time for the issue to be addressed before disclosure

## 📋 Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## 🧪 Testing Guidelines

- Write tests for all new features
- Include edge cases and error scenarios
- Maintain or improve test coverage
- Use descriptive test names
- Group related tests in describe blocks

## 📚 Documentation

- Update README.md for significant changes
- Add inline comments for complex code
- Update API documentation if applicable
- Include examples for new features

## ❓ Questions

If you have questions:
- Check existing issues and discussions
- Create a new issue with the "question" label
- Join our community discussions

Thank you for contributing! 🎉
