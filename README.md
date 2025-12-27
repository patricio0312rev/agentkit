# 🤖 AgentKit

> **Scaffold AI agent configurations for Claude Code, Cursor, GitHub Copilot, Aider, and more.**

AgentKit is a CLI tool that helps you set up specialized AI agents for your development workflow. Get 42 pre-built agents across 7 departments—from engineering and design to marketing and testing—all optimized for rapid app development.

[![npm version](https://img.shields.io/npm/v/agentkit.svg)](https://www.npmjs.com/package/agentkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- 🚀 **42 Pre-built Agents** across 7 specialized departments
- 🔧 **Multi-tool Support** - Works with Claude Code, Cursor, GitHub Copilot, Aider, and more
- 📦 **Zero Configuration** - Interactive setup in under 2 minutes
- 🎨 **Customizable** - Select exactly which agents you need
- 🌍 **Language Agnostic** - Supports TypeScript, Python, Go, Java, Swift, Kotlin, and more
- ⚡ **Optimized for Speed** - Built for 6-day development sprints

---

## 📦 Installation

```bash
# Install globally
npm install -g agentkit

# Or use directly with npx
npx agentkit init
```

---

## 🚀 Quick Start

```bash
# Interactive setup
agentkit init

# Non-interactive (with all flags)
agentkit init \
  --tool cursor \
  --folder .cursorrules \
  --departments engineering,design \
  --skip-prompts
```

Follow the prompts to:

1. Select your AI tool (Cursor, Claude Code, etc.)
2. Choose departments (Engineering, Design, Marketing, etc.)
3. Pick specific agents (or keep all selected)
4. Generate your configuration ✨

---

## 🏢 Available Departments & Agents

### **Design** (5 agents)

- `brand-guardian` - Brand consistency and visual identity
- `ui-designer` - Interface design and component systems
- `ux-researcher` - User research and testing
- `visual-storyteller` - Marketing visuals and graphics
- `whimsy-injector` - Delightful micro-interactions

### **Engineering** (7 agents)

- `ai-engineer` - AI/ML integration and optimization
- `backend-architect` - API design and server architecture
- `devops-automator` - CI/CD and infrastructure
- `frontend-developer` - UI implementation and optimization
- `mobile-app-builder` - iOS/Android development
- `rapid-prototyper` - Fast MVP development
- `test-writer-fixer` - Testing and quality assurance

### **Marketing** (7 agents)

- `app-store-optimizer` - ASO and store listings
- `content-creator` - Blog posts, videos, social content
- `growth-hacker` - Viral loops and growth experiments
- `instagram-curator` - Instagram strategy and content
- `reddit-community-builder` - Reddit engagement
- `tiktok-strategist` - TikTok marketing and trends
- `twitter-engager` - Twitter/X engagement

### **Product** (3 agents)

- `feedback-synthesizer` - User feedback analysis
- `sprint-prioritizer` - Feature prioritization
- `trend-researcher` - Market trends and opportunities

### **Project Management** (3 agents)

- `experiment-tracker` - A/B testing and experiments
- `project-shipper` - Launch coordination
- `studio-producer` - Cross-team coordination

### **Studio Operations** (5 agents)

- `analytics-reporter` - Metrics and insights
- `finance-tracker` - Budget and cost management
- `infrastructure-maintainer` - System reliability
- `legal-compliance-checker` - Privacy and compliance
- `support-responder` - Customer support

### **Testing** (5 agents)

- `api-tester` - API testing and performance
- `performance-benchmarker` - Speed optimization
- `test-results-analyzer` - Test data analysis
- `tool-evaluator` - Development tool assessment
- `workflow-optimizer` - Process optimization

---

## 🛠️ Supported AI Tools

| Tool               | Folder         | Description               |
| ------------------ | -------------- | ------------------------- |
| **Claude Code**    | `.claude`      | Native sub-agent support  |
| **Cursor**         | `.cursorrules` | @-mentions and multi-file |
| **GitHub Copilot** | `.github`      | copilot-instructions.md   |
| **Aider**          | `.aider`       | conventions.md            |
| **Universal**      | `.ai`          | Works with any tool       |

---

## 📖 Usage Examples

### With Cursor

```bash
agentkit init --tool cursor --folder .cursorrules --departments engineering,design
```

Then in Cursor:

```
@engineering/backend-architect.md Design a REST API for user management
```

### With Claude Code

```bash
agentkit init --tool claude-code --folder .claude --departments engineering
```

Then with Claude Code CLI:

```bash
claude-code "Build a login page using the frontend-developer patterns"
```

### With GitHub Copilot

```bash
agentkit init --tool copilot --departments engineering,testing
```

Copilot automatically uses `.github/copilot-instructions.md` for all suggestions.

---

## 🎯 Use Cases

**For Startups:**

- Rapid prototyping with `rapid-prototyper`
- Growth experiments with `growth-hacker`
- Launch coordination with `project-shipper`

**For Solo Developers:**

- Full-stack guidance with engineering agents
- Marketing strategies with marketing agents
- Testing workflows with testing agents

**For Teams:**

- Consistent standards across departments
- Specialized expertise on demand
- Faster onboarding for new team members

---

## 🔧 Configuration Options

```bash
agentkit init [options]

Options:
  -t, --tool <tool>           AI tool (claude-code, cursor, copilot, aider, universal)
  -f, --folder <name>         Custom folder name
  -d, --departments <list>    Comma-separated list of departments
  --agents <list>             Comma-separated list of specific agents
  --skip-prompts              Skip all interactive prompts (requires all flags)
  -h, --help                  Display help for command
```

**Examples:**

```bash
# Full engineering department
agentkit init -t cursor -d engineering --skip-prompts

# Specific agents only
agentkit init -t cursor -d engineering --agents backend-architect,frontend-developer --skip-prompts

# Multiple departments
agentkit init -t claude-code -d engineering,design,marketing --skip-prompts
```

---

## 📚 Documentation

Each generated agent includes:

- **Clear responsibilities** and best practices
- **Code examples** in multiple languages
- **Framework-specific patterns** (React, Vue, Node.js, Python, Go, etc.)
- **Quick reference guides** and checklists
- **Integration tips** for your workflow

All agents are designed to be:

- ✅ **Language-agnostic** (works with any tech stack)
- ✅ **Actionable** (practical, not theoretical)
- ✅ **Focused** (200-250 lines for easy reading)

---

---

## ⚙️ Configuration Options

### Command-Line Flags

| Flag                       | Description                                         | Available Options                                                                                        | Default                              | Required                   |
| -------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------ | -------------------------- |
| `-t, --tool <tool>`        | AI tool to generate configuration for               | `claude-code`, `cursor`, `copilot`, `aider`, `universal`                                                 | `cursor`                             | ✅ (with `--skip-prompts`) |
| `-f, --folder <name>`      | Custom folder name for agent files                  | Any valid folder name (no spaces or slashes)                                                             | Tool-specific default\*              | ❌                         |
| `-d, --departments <list>` | Comma-separated list of departments to include      | `design`, `engineering`, `marketing`, `product`, `project-management`, `studio-operations`, `testing`    | -                                    | ✅ (with `--skip-prompts`) |
| `--agents <list>`          | Comma-separated list of specific agents to include  | See [agent list](#-available-departments--agents) above. Format: `agent-name` or `department/agent-name` | All agents from selected departments | ❌                         |
| `--skip-prompts`           | Skip all interactive prompts (non-interactive mode) | -                                                                                                        | `false`                              | ❌                         |
| `-h, --help`               | Display help information                            | -                                                                                                        | -                                    | ❌                         |

\*_Tool-specific default folders:_

| Tool          | Default Folder                                |
| ------------- | --------------------------------------------- |
| `claude-code` | `.claude`                                     |
| `cursor`      | `.cursorrules`                                |
| `copilot`     | `.github` (creates `copilot-instructions.md`) |
| `aider`       | `.aider`                                      |
| `universal`   | `.ai`                                         |

### Usage Examples

**Interactive mode (recommended for first-time users):**

```bash
agentkit init
```

**Full non-interactive setup:**

```bash
agentkit init \
  --tool cursor \
  --folder .cursorrules \
  --departments engineering,design \
  --skip-prompts
```

**Select specific agents only:**

```bash
agentkit init \
  --tool cursor \
  --departments engineering \
  --agents backend-architect,frontend-developer \
  --skip-prompts
```

**Multiple departments with custom folder:**

```bash
agentkit init \
  --tool claude-code \
  --folder .my-agents \
  --departments engineering,marketing,testing \
  --skip-prompts
```

**All agents from all departments:**

```bash
agentkit init \
  --tool universal \
  --departments design,engineering,marketing,product,project-management,studio-operations,testing \
  --skip-prompts
```

---

## 🗺️ Roadmap

### v0.2.0 (Coming Soon)

- 🛠️ **Tech Stack Awareness** - Agents adapt to your specific stack (React, Vue, Python, Go, etc.)
- 🔄 **Update Command** - Update existing configurations without regenerating
- 📊 **Agent Analytics** - Track which agents you use most
- 🎨 **Custom Agent Templates** - Create your own agents
- 🌐 **More Languages** - Localization support

### v0.3.0 (Future)

- 🔌 **VSCode Extension** - Use agents directly in VSCode
- 🤝 **Team Collaboration** - Share agent configurations across teams
- 📦 **Agent Marketplace** - Community-contributed agents
- 🧪 **Agent Testing Framework** - Validate agent effectiveness

**Want to contribute?** Check our [GitHub repository](https://github.com/patricio0312rev/agentkit) for open issues and feature requests!

---

## 🐛 Known Issues & Troubleshooting

### Common Issues

**1. "Command not found: agentkit"**

```bash
# If installed globally, try:
npm uninstall -g agentkit
npm install -g agentkit

# Or use npx:
npx agentkit init
```

**2. Agents not appearing in Cursor @-mentions**

- Restart Cursor after running `agentkit init`
- Verify files exist in the specified folder
- Check Cursor settings → Custom Instructions

**3. Permission errors during installation**

```bash
sudo npm install -g agentkit
# Or use npx to avoid global install
```

**4. Files not generating**

- Ensure you have write permissions in the current directory
- Check if folder already exists (AgentKit won't overwrite)
- Run with `--skip-prompts` and all required flags

### Report an Issue

Found a bug or have a feature request?

👉 **[Open an issue on GitHub](https://github.com/patricio0312rev/agentkit/issues)**

Please include:

- Your OS and Node.js version (`node -v`)
- The command you ran
- Expected vs actual behavior
- Any error messages

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report bugs** - Open an issue with details
2. **Suggest features** - Tell us what would make AgentKit better
3. **Improve agents** - Submit PRs for agent improvements
4. **Share your setup** - Show how you use AgentKit

See [CONTRIBUTING.md](https://github.com/patricio0312rev/agentkit/blob/main/CONTRIBUTING.md) for guidelines.

---

## 💡 Tips & Best Practices

**Getting Started:**

- Start with 1-2 departments to avoid overwhelming yourself
- Read the generated `README.md` in your agents folder
- Try different agents to find which ones fit your workflow

**For Teams:**

- Commit the generated folder to version control
- Share agent configurations across your team
- Customize agents to match your team's conventions
- Run `agentkit init` when onboarding new members

**Optimization:**

- Remove agents you rarely use to reduce context
- Customize agent instructions for your specific needs
- Create shortcuts for frequently used agent combinations

---

## 🙏 Credits

AgentKit is built with:

- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - Interactive prompts
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
- [fs-extra](https://github.com/jprichardson/node-fs-extra) - File system utilities

AgentKit templates were based on:

- [agents](https://github.com/contains-studio/agents) - Contains-Studio's Agents

Inspired by the amazing AI coding assistant community and built for developers who ship fast.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

**Stay safe when working with AI! 🛡️**

Enjoy! 💜

Made with love by [Patricio Marroquin](https://www.patriciomarroquin.dev/)
