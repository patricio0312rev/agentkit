# Changelog

All notable changes to AgentKit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- N/A

### Changed
- N/A

### Fixed
- N/A

## [0.2.2] - 2025-12-28

### Added
- CLI flag `-m, --model <model>` for specifying Claude Code agent model via command line
- Documentation for `--model` flag in README configuration options table
- Usage example showing Claude Code model selection in non-interactive mode

### Changed
- N/A

### Fixed
- N/A

## [0.2.1] - 2025-12-28

### Added
- Enhanced agent descriptions for all 35 templates with "Use this agent when:" criteria
- Concrete usage examples for each agent showing when and how Claude Code should invoke them
- Structured description format with bullet points and real-world scenarios

### Changed
- All agent template descriptions now include:
  - Clear invocation criteria (5-7 bullet points per agent)
  - 3 practical user/assistant interaction examples
  - Task tool usage patterns for Claude Code integration

### Fixed
- N/A

## [0.2.0] - 2025-12-28

### Added
- Model selection for Claude Code agents (sonnet, opus, haiku, or inherit from parent)
- Interactive model selection prompt when choosing Claude Code tool
- Automatic model field injection in agent frontmatter
- Automated GitHub Actions workflow for npm publishing
- `RELEASE.md` documentation for publishing process
- `CHANGELOG.md` for tracking version changes

### Changed
- Claude Code folder structure: agents now placed directly in `.claude/agents` (no department subfolders)
- Folder path validation now allows forward slashes for nested paths
- Default folder for Claude Code changed from `.claude` to `.claude/agents`

### Fixed
- Folder validation rejecting valid paths with forward slashes
- Model field not being added to agent frontmatter due to regex pattern mismatch

## [0.1.0] - 2025-12-27

### Added
- Initial release of AgentKit
- Support for Claude Code, Cursor, GitHub Copilot, Aider, and Universal AI tools
- 7 department categories: Engineering, Design, Marketing, Product, Project Management, Studio Operations, Testing
- 35+ pre-configured AI agent templates
- Interactive CLI for agent selection
- Department-based organization
- Custom folder naming
- Non-interactive mode with flags

### Changed
- N/A

### Fixed
- N/A

---

## Release Types

- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security fixes
