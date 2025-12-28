# Changelog

All notable changes to AgentKit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Model selection for Claude Code agents (sonnet, opus, haiku, or inherit from parent)
- Direct agent placement in `.claude/agents` folder (no department subfolders)
- Automated GitHub Actions workflow for npm publishing

### Changed
- Claude Code folder path changed from `.claude` to `.claude/agents`

### Fixed
- N/A

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
