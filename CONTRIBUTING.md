# Contributing to AI Agent Builder

Thank you for your interest in contributing to AI Agent Builder! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **🐛 Bug Reports**: Report bugs and issues
- **✨ Feature Requests**: Suggest new features
- **📝 Documentation**: Improve documentation
- **💻 Code Contributions**: Submit pull requests
- **🎨 UI/UX Improvements**: Design and user experience enhancements
- **🧪 Testing**: Write tests and improve test coverage

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- A GitHub account

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/ai-agent-builder.git
   cd ai-agent-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📝 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Follow strict TypeScript configuration
- Use proper type annotations
- Avoid `any` types when possible

### React/Next.js

- Use functional components with hooks
- Follow Next.js 14 App Router conventions
- Use proper error boundaries
- Implement proper loading states

### Styling

- Use Tailwind CSS for styling
- Follow the existing design system
- Use shadcn/ui components when available
- Maintain responsive design

### File Structure

```
components/
├── ui/           # shadcn/ui components
├── forms/        # Form components
├── layout/       # Layout components
└── features/     # Feature-specific components

lib/
├── utils.ts      # Utility functions
├── supabase.ts   # Supabase client
└── ai-service.ts # AI service functions
```

## 🔧 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Test your changes thoroughly

### 3. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 5. Create a Pull Request

- Use the PR template
- Provide clear description of changes
- Include screenshots for UI changes
- Reference related issues

## 📋 Pull Request Guidelines

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

### Commit Message Format

Use conventional commit format:

```
type(scope): description

feat(auth): add OAuth login support
fix(wizard): resolve workflow generation error
docs(readme): update installation instructions
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tool changes

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write tests for new features
- Maintain good test coverage
- Use descriptive test names
- Test both success and error cases

## 🐛 Bug Reports

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g. Windows, macOS, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 1.0.0]

## Additional Information
Screenshots, logs, etc.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other approaches you've considered

## Additional Information
Mockups, examples, etc.
```

## 📚 Documentation

### Documentation Guidelines

- Write clear, concise documentation
- Include code examples
- Keep documentation up to date
- Use proper markdown formatting

### Documentation Structure

```
docs/
├── getting-started.md
├── api-reference.md
├── deployment.md
└── contributing.md
```

## 🔒 Security

### Security Guidelines

- Never commit sensitive information
- Report security vulnerabilities privately
- Follow security best practices
- Use environment variables for secrets

### Reporting Security Issues

If you find a security vulnerability, please report it privately to:
- Email: security@aiagentbuilder.com
- Do not create public issues for security vulnerabilities

## 🎯 Project Goals

### Current Focus Areas

- **Performance**: Improve app performance and loading times
- **Accessibility**: Make the app more accessible
- **Testing**: Increase test coverage
- **Documentation**: Improve documentation quality
- **User Experience**: Enhance UI/UX

### Long-term Goals

- **Scalability**: Support for large-scale deployments
- **Integration**: More third-party integrations
- **Analytics**: Advanced analytics and insights
- **Mobile**: Mobile app development

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the project's code of conduct

### Communication

- Use GitHub Issues for discussions
- Join our Discord community
- Be patient and helpful
- Ask questions when needed

## 📞 Getting Help

### Resources

- **Documentation**: [docs.aiagentbuilder.com](https://docs.aiagentbuilder.com)
- **Discord**: [Join our community](https://discord.gg/aiagentbuilder)
- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-agent-builder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-agent-builder/discussions)

### Questions

If you have questions about contributing:

1. Check existing issues and discussions
2. Search the documentation
3. Ask in Discord
4. Create a new discussion

## 🙏 Recognition

Contributors will be recognized in:

- GitHub contributors list
- Project documentation
- Release notes
- Community shoutouts

## 📄 License

By contributing to AI Agent Builder, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to AI Agent Builder! 🚀
