# Contributing to AgentKit

Thank you for your interest in contributing to AgentKit! 🎉

We welcome contributions from the community, whether it's bug reports, feature requests, documentation improvements, or code contributions.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Guidelines](#coding-guidelines)
- [Submitting Changes](#submitting-changes)
- [Agent Template Guidelines](#agent-template-guidelines)

---

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code. Please report unacceptable behavior to [patricio0312rev@github].

---

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Environment details** (OS, Node.js version, npm version)
- **Error messages or logs** (if applicable)
- **Screenshots** (if relevant)

**Bug Report Template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Run command '...'
2. Select option '...'
3. See error

**Expected behavior**
What you expected to happen.

**Environment:**

- OS: [e.g., macOS 13.0]
- Node.js version: [e.g., 18.17.0]
- AgentKit version: [e.g., 0.1.0]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Features

We love feature suggestions! Before creating a feature request:

1. **Check existing feature requests** to avoid duplicates
2. **Provide clear use cases** - explain why this feature would be useful
3. **Be specific** - detailed proposals are easier to implement

**Feature Request Template:**

```markdown
**Is your feature request related to a problem?**
A clear description of the problem. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Add any other context, mockups, or examples here.
```

### Improving Documentation

Documentation improvements are always welcome! This includes:

- Fixing typos or grammatical errors
- Clarifying confusing sections
- Adding examples
- Translating documentation
- Improving code comments

### Contributing Code

See [Development Setup](#development-setup) below for how to get started with code contributions.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 14.0.0
- **npm** >= 6.0.0
- **Git**

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

```bash
git clone https://github.com/YOUR_USERNAME/agentkit.git
cd agentkit
```

3. **Add upstream remote**:

```bash
git remote add upstream https://github.com/patricio0312rev/agentkit.git
```

4. **Create a branch** for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

---

## 🛠️ Development Setup

### Install Dependencies

```bash
npm install
```

### Test Your Changes Locally

```bash
# Run CLI directly
node bin/cli.js init

# Or link globally for testing
npm link
agentkit init

# Test in a separate directory
cd /tmp/test-project
agentkit init
```

### Unlink After Testing

```bash
npm unlink agentkit
```

---

## 📁 Project Structure

```
agentkit/
├── bin/
│   └── cli.js                 # CLI entry point
├── src/
│   ├── commands/
│   │   └── init.js           # Main init command logic
│   ├── lib/
│   │   ├── config.js         # Tool and department configurations
│   │   └── generator.js      # Agent file generation logic
│   ├── utils/
│   │   ├── display.js        # Terminal display utilities
│   │   ├── readme.js         # README generation
│   │   └── tool-specific.js  # Tool-specific file generation
│   └── index.js              # Programmatic API exports
├── templates/
│   └── departments/          # Agent template files
│       ├── design/
│       ├── engineering/
│       ├── marketing/
│       ├── product/
│       ├── project-management/
│       ├── studio-operations/
│       └── testing/
├── package.json
├── README.md
└── CONTRIBUTING.md
```

---

## 📝 Coding Guidelines

### Code Style

- **JavaScript Standard Style** - We follow standard JavaScript conventions
- **ES6+ syntax** - Use modern JavaScript features
- **Meaningful names** - Variables and functions should be self-documenting
- **Comments** - Add comments for complex logic

### Best Practices

**Do:**

- ✅ Write clear, descriptive commit messages
- ✅ Keep functions small and focused
- ✅ Add comments for complex logic
- ✅ Update documentation when changing behavior
- ✅ Test your changes thoroughly

**Don't:**

- ❌ Commit node_modules or generated files
- ❌ Mix multiple unrelated changes in one PR
- ❌ Break existing functionality
- ❌ Include personal configuration files

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat: add support for pnpm package manager

fix: resolve file permission issues on Windows

docs: update installation instructions for M1 Macs

refactor: simplify agent selection logic
```

---

## 🚀 Submitting Changes

### Pull Request Process

1. **Update your fork** with the latest upstream changes:

```bash
git fetch upstream
git rebase upstream/main
```

2. **Push your changes** to your fork:

```bash
git push origin feature/your-feature-name
```

3. **Create a Pull Request** from your fork to the main repository

4. **Fill out the PR template** with:
   - Description of changes
   - Related issue numbers (if applicable)
   - Testing performed
   - Screenshots (if UI changes)

5. **Respond to feedback** - maintainers may request changes

6. **Keep your PR updated** - rebase on main if needed

### Pull Request Checklist

Before submitting your PR, make sure:

- [ ] Code follows the project's coding guidelines
- [ ] Changes have been tested locally
- [ ] Documentation has been updated (if needed)
- [ ] Commit messages follow conventional commits
- [ ] No breaking changes (or clearly documented)
- [ ] PR description clearly explains the changes

---

## 🤖 Agent Template Guidelines

### Creating or Modifying Agent Templates

Agent templates are the heart of AgentKit. When creating or modifying agents:

**File Location:**

```
templates/departments/{department}/{agent-name}.md
```

**File Structure:**

```markdown
## <!-- {department}/{agent-name}.md -->

name: agent-name
description: Brief description of what this agent does
color: blue
tools: Write, Read, MultiEdit, Bash

---

You are a {role} who {primary responsibility}.

## Core Responsibilities

### 1. {Responsibility Name}

{Description}:

- {Detail}
- {Detail}

## {Section Name}

{Content}

Your goal: {Clear goal statement}
```

### Agent Template Requirements

**Length:**

- Design agents: ~200 lines
- Engineering agents: 200-250 lines
- Product agents: <150 lines
- Marketing agents: 170-200 lines
- Testing agents: <250 lines
- Project Management agents: <150 lines
- Studio Operations agents: <200 lines

**Must Include:**

- Clear responsibilities section
- Practical examples and frameworks
- Language-agnostic code samples (where applicable)
- Quick reference checklists
- Clear goal statement

**Must NOT Include:**

- Overly verbose explanations
- Redundant information
- Tool-specific instructions (unless in engineering)
- Personal opinions without rationale

### Testing Agent Templates

1. **Generate the agent:**

```bash
node bin/cli.js init --tool cursor --departments {department} --agents {agent-name} --skip-prompts
```

2. **Review the output:**

- Check file was created correctly
- Verify formatting is correct
- Ensure YAML frontmatter is valid

3. **Test with an AI tool:**

- Use the agent with Cursor, Claude Code, etc.
- Verify it provides helpful guidance
- Check for any confusing instructions

---

## 🎯 Development Workflow

### Typical Workflow

1. **Pick an issue** from GitHub Issues (or create one)
2. **Discuss approach** in the issue comments (for major changes)
3. **Create a branch** with descriptive name
4. **Make your changes**
5. **Test thoroughly** locally
6. **Commit with clear messages**
7. **Push and create PR**
8. **Address review feedback**
9. **Celebrate** when merged! 🎉

### Working on Agents

1. Find agent file in `templates/departments/{dept}/{agent}.md`
2. Make your improvements
3. Test by generating and using the agent
4. Update department count in `src/lib/config.js` if adding/removing
5. Update README if changing agent descriptions

### Working on CLI

1. Make changes in `src/` or `bin/`
2. Test with `node bin/cli.js init`
3. Test all tool options (cursor, claude-code, etc.)
4. Test both interactive and non-interactive modes
5. Verify error handling

---

## 🐛 Debugging Tips

### Common Development Issues

**Issue: Changes not reflecting**

```bash
# Unlink and relink
npm unlink agentkit
npm link
```

**Issue: Cannot find module**

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

**Issue: Permission errors**

```bash
# Make CLI executable
chmod +x bin/cli.js
```

### Logging

Add debug logs:

```javascript
if (process.env.DEBUG) {
  console.log("Debug info:", data);
}
```

Run with debug:

```bash
DEBUG=1 node bin/cli.js init
```

---

## 📞 Getting Help

- **Questions?** Open a [GitHub Discussion](https://github.com/patricio0312rev/agentkit/discussions)
- **Bug?** Open a [GitHub Issue](https://github.com/patricio0312rev/agentkit/issues)
- **Want to chat?** Reach out on Twitter [@patricio0312rev](https://twitter.com/patricio0312rev)

---

## 🙏 Thank You!

Your contributions make AgentKit better for everyone. Thank you for taking the time to contribute!

---

**Happy coding! 💜**
