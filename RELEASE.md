# Release Process

This document explains how to publish new versions of AgentKit to npm using the automated GitHub Actions workflow.

## One-Time Setup

### 1. Get NPM Access Token

1. Log in to [npmjs.com](https://www.npmjs.com/)
2. Click on your profile icon → **Access Tokens**
3. Click **Generate New Token** → **Classic Token**
4. Select **Automation** type (allows CI/CD publishing)
5. Copy the generated token (starts with `npm_...`)

### 2. Add NPM Token to GitHub Secrets

1. Go to your GitHub repository: `https://github.com/patricio0312rev/agentkit`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click **Add secret**

That's it! The `GITHUB_TOKEN` is automatically provided by GitHub Actions.

## Publishing a New Release

### Step 1: Update Version

Update the version in `package.json`:

```bash
# For patch release (0.1.0 → 0.1.1)
npm version patch

# For minor release (0.1.0 → 0.2.0)
npm version minor

# For major release (0.1.0 → 1.0.0)
npm version major
```

This command will:
- Update `package.json` version
- Create a git commit with the version change
- Create a git tag (e.g., `v0.1.1`)

### Step 2: Update Changelog (Optional but Recommended)

Create or update `CHANGELOG.md` with release notes:

```markdown
## [0.1.1] - 2025-01-XX

### Added
- Model selection for Claude Code agents
- Direct agent placement in .claude/agents folder

### Changed
- Updated folder structure for Claude Code

### Fixed
- Bug fixes...
```

Commit the changelog:

```bash
git add CHANGELOG.md
git commit -m "docs: update changelog for v0.1.1"
```

### Step 3: Push Tags to Trigger Release

```bash
# Push commits
git push origin main

# Push tags (this triggers the GitHub Action)
git push origin --tags
```

### Step 4: Monitor the Release

1. Go to **Actions** tab in GitHub repository
2. You should see the "Publish to npm" workflow running
3. The workflow will:
   - Install dependencies
   - Run tests
   - Verify version matches tag
   - Publish to npm
   - Create GitHub release

### Step 5: Verify Publication

Check that the package was published:

```bash
npm view @patricio0312rev/agentkit version
```

Visit the npm page:
https://www.npmjs.com/package/@patricio0312rev/agentkit

## Manual Release (If Needed)

If the automated workflow fails, you can publish manually:

```bash
# Make sure you're on the correct version
npm version <patch|minor|major>

# Login to npm
npm login

# Publish
npm publish --access public
```

## Release Checklist

Before releasing, ensure:

- [ ] All tests pass: `npm test`
- [ ] Code is linted and formatted
- [ ] Version is bumped in `package.json`
- [ ] `CHANGELOG.md` is updated
- [ ] All changes are committed
- [ ] Tags are pushed to GitHub

## Version Numbering Guidelines

Follow [Semantic Versioning](https://semver.org/):

- **PATCH** (0.1.X) - Bug fixes, small improvements
- **MINOR** (0.X.0) - New features, backward compatible
- **MAJOR** (X.0.0) - Breaking changes

## Troubleshooting

### "Version already exists" error

You tried to publish a version that already exists on npm. Bump the version again:

```bash
npm version patch
git push origin --tags
```

### "Permission denied" error

Your `NPM_TOKEN` might be invalid or expired:
1. Generate a new token on npmjs.com
2. Update the GitHub secret

### Workflow doesn't trigger

Make sure you pushed the tag:

```bash
git push origin --tags
```

The workflow only runs when tags matching `v*.*.*` are pushed.

## Quick Reference

```bash
# Complete release process
npm version patch              # Bump version
git add CHANGELOG.md          # Add changelog
git commit -m "docs: update changelog"
git push origin main          # Push commits
git push origin --tags        # Push tags → triggers workflow
```
