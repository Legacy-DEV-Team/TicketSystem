# Contributing to Discord Ticket SaaS

Thank you for your interest in contributing to Discord Ticket SaaS! This guide will help you get started with contributing to our open-source project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

### Our Standards

- **Be respectful** and inclusive of all contributors
- **Be constructive** in feedback and discussions
- **Be collaborative** and help others learn
- **Be patient** with new contributors
- **Be professional** in all interactions

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js 18+** installed
- **MongoDB 5.0+** or access to MongoDB Atlas
- **Redis 6.0+** or access to Redis Cloud
- **Git** for version control
- **Docker** (optional, for containerized development)
- **Discord Developer Account** for bot testing

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/discord-ticket-saas.git
   cd discord-ticket-saas
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/yourusername/discord-ticket-saas.git
   ```

## Development Setup

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start databases** (if local):
   ```bash
   # MongoDB
   sudo systemctl start mongod
   
   # Redis
   sudo systemctl start redis-server
   ```

4. **Start development servers**:
   ```bash
   # Start all services
   npm run dev
   
   # Or start individual services
   npm run dev:shared
   npm run dev:bot
   npm run dev:web
   ```

### Docker Development

1. **Start with Docker Compose**:
   ```bash
   # Copy environment file
   cp .env.example .env
   
   # Start all services
   docker-compose up -d
   
   # View logs
   docker-compose logs -f
   ```

2. **Development with hot reload**:
   ```bash
   # Start with development profile
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
   ```

## Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🧪 **Test coverage**
- 🎨 **UI/UX improvements**
- 🔧 **Performance optimizations**
- 🌐 **Translations**

### Before You Start

1. **Check existing issues** to avoid duplicate work
2. **Discuss major changes** in an issue first
3. **Follow the coding standards** outlined below
4. **Write tests** for new functionality
5. **Update documentation** as needed

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

#### Examples

```bash
feat(bot): add auto-close timer configuration
fix(api): resolve authentication token refresh issue
docs: update installation guide for Docker
test(shared): add unit tests for encryption service
```

## Pull Request Process

### Creating a Pull Request

1. **Create a feature branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Write/update tests** for your changes

4. **Update documentation** if needed

5. **Run tests and linting**:
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

6. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

7. **Push to your fork**:
   ```bash
   git push origin feat/your-feature-name
   ```

8. **Create pull request** on GitHub

### Pull Request Template

When creating a PR, please include:

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
```

### Review Process

1. **Automated checks** must pass (CI/CD pipeline)
2. **Code review** by maintainers
3. **Manual testing** if applicable
4. **Documentation review** if docs are changed
5. **Final approval** and merge

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

```markdown
**Bug Description**
A clear and concise description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Screenshots**
If applicable, add screenshots

**Environment**
- OS: [e.g. Ubuntu 20.04]
- Node.js version: [e.g. 18.15.0]
- Browser: [e.g. Chrome 91.0]
- Discord Ticket SaaS version: [e.g. 1.2.3]

**Additional Context**
Any other context about the problem
```

### Feature Requests

For feature requests, please include:

```markdown
**Feature Description**
A clear and concise description of the feature

**Problem Statement**
What problem would this feature solve?

**Proposed Solution**
How would you like this feature to work?

**Alternatives Considered**
Alternative solutions you've considered

**Additional Context**
Any other context or screenshots about the feature
```

## Coding Standards

### TypeScript Guidelines

- **Use TypeScript** for all new code
- **Define interfaces** for all data structures
- **Use strict type checking**
- **Avoid `any` type** - use proper typing
- **Document complex types** with comments

```typescript
// ✅ Good
interface TicketCreateRequest {
  title: string;
  description: string;
  category_id: string;
  priority: 'low' | 'medium' | 'high';
}

// ❌ Bad
function createTicket(data: any) {
  // Implementation
}
```

### Code Style

- **Use Prettier** for formatting
- **Use ESLint** for linting
- **Use meaningful variable names**
- **Keep functions small and focused**
- **Add comments for complex logic**

```typescript
// ✅ Good
function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

// ❌ Bad
function gen(l?: number) {
  return crypto.randomBytes(l || 32).toString('hex');
}
```

### File Organization

```
packages/
├── shared/           # Shared utilities and types
│   ├── src/
│   │   ├── types/   # TypeScript type definitions
│   │   ├── utils/   # Utility functions
│   │   └── services/ # Shared services
├── bot/             # Discord bot package
│   ├── src/
│   │   ├── commands/ # Discord commands
│   │   ├── handlers/ # Event handlers
│   │   └── services/ # Bot services
└── web/             # Web dashboard package
    ├── src/
    │   ├── pages/   # Next.js pages
    │   ├── components/ # React components
    │   └── lib/     # Web utilities
```

### Database Guidelines

- **Use proper indexes** for query performance
- **Validate data** before database operations
- **Use transactions** for multi-document operations
- **Handle connection errors** gracefully

```typescript
// ✅ Good
async function createTicket(data: TicketCreateRequest): Promise<Ticket> {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const validatedData = ticketSchema.parse(data);
      return await TicketModel.create([validatedData], { session });
    });
  } finally {
    await session.endSession();
  }
}
```

## Testing

### Test Structure

- **Unit tests** for individual functions
- **Integration tests** for API endpoints
- **End-to-end tests** for critical workflows
- **Performance tests** for optimization

### Writing Tests

```typescript
// Unit test example
describe('EncryptionService', () => {
  describe('encrypt', () => {
    it('should encrypt and decrypt data correctly', () => {
      const data = 'sensitive information';
      const encrypted = EncryptionService.encrypt(data);
      const decrypted = EncryptionService.decrypt(encrypted);
      
      expect(decrypted).toBe(data);
      expect(encrypted).not.toBe(data);
    });
  });
});

// Integration test example
describe('POST /api/v1/tickets', () => {
  it('should create a new ticket', async () => {
    const response = await request(app)
      .post('/api/v1/tickets')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        title: 'Test Ticket',
        description: 'Test Description',
        category_id: 'cat_123'
      });
      
    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe('Test Ticket');
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- ticket.test.ts

# Run tests in watch mode
npm run test:watch
```

## Documentation

### Documentation Standards

- **Keep documentation up-to-date** with code changes
- **Use clear, concise language**
- **Include code examples** where helpful
- **Add screenshots** for UI changes
- **Update API documentation** for endpoint changes

### Types of Documentation

1. **Code comments** - for complex logic
2. **README files** - for package descriptions
3. **API documentation** - for endpoints
4. **User guides** - for features
5. **Developer guides** - for contributors

### Documentation Tools

- **VitePress** for main documentation
- **TSDoc** for TypeScript documentation
- **OpenAPI** for API documentation
- **Storybook** for component documentation

## Community

### Getting Help

- **GitHub Discussions** - for questions and ideas
- **Discord Server** - for real-time chat
- **GitHub Issues** - for bugs and feature requests
- **Email** - for private matters

### Communication Guidelines

- **Be respectful** and professional
- **Search existing discussions** before asking
- **Provide context** when asking for help
- **Help others** when you can
- **Give constructive feedback**

### Recognition

Contributors are recognized through:

- **GitHub contributors graph**
- **Release notes mentions**
- **Hall of fame** in documentation
- **Discord roles** for active contributors

## Development Workflow

### Branch Strategy

- `main` - production-ready code
- `develop` - integration branch for features
- `feature/*` - feature development branches
- `hotfix/*` - urgent bug fixes
- `release/*` - release preparation branches

### Release Process

1. **Feature freeze** on develop branch
2. **Create release branch** from develop
3. **Testing and bug fixes** on release branch
4. **Merge to main** and tag release
5. **Deploy to production**
6. **Merge back to develop**

### Continuous Integration

Our CI pipeline includes:

- **Linting and formatting** checks
- **Type checking** with TypeScript
- **Unit and integration tests**
- **Security scanning** with Trivy
- **Dependency auditing**
- **Build verification**

## Thank You

Your contributions make Discord Ticket SaaS better for everyone. Whether you're fixing bugs, adding features, improving documentation, or helping other users, every contribution is valuable and appreciated.

Happy coding! 🚀