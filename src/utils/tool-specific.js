const fs = require('fs-extra');
const path = require('path');
const { TOOLS } = require('../lib/config');

/**
 * Generate tool-specific configuration files
 * @param {Object} config - Configuration object
 * @param {string} targetDir - Target directory path
 * @param {Array} agentsList - List of generated agents
 * @returns {Promise<Array>} Array of created file paths
 */
async function generateToolSpecificFiles(config, targetDir, agentsList) {
  const files = [];

  switch (config.tool) {
    case 'cursor':
      const cursorFiles = await generateCursorFiles(config, targetDir, agentsList);
      files.push(...cursorFiles);
      break;

    case 'copilot':
      const copilotFiles = await generateCopilotFiles(config, targetDir, agentsList);
      files.push(...copilotFiles);
      break;

    case 'aider':
      const aiderFiles = await generateAiderFiles(config, targetDir, agentsList);
      files.push(...aiderFiles);
      break;

    case 'claude-code':
    case 'universal':
      // These use the multi-file structure as-is
      const indexFile = await generateIndexFile(config, targetDir, agentsList);
      if (indexFile) files.push(indexFile);
      break;
  }

  return files;
}

/**
 * Generate Cursor-specific files
 * Cursor can use both multi-file (@-mentions) and single .cursorrules file
 */
async function generateCursorFiles(config, targetDir, agentsList) {
  const files = [];

  // Create instructions file inside the target directory
  const instructionsPath = path.join(targetDir, 'CURSOR_USAGE.md');
  const instructions = generateCursorInstructions(config);
  await fs.writeFile(instructionsPath, instructions);
  files.push(instructionsPath);

  // Only create a .cursorrules summary file if the folder name is NOT .cursorrules
  // (to avoid file/directory conflict)
  if (config.folder !== '.cursorrules') {
    const cursorrules = generateCursorrulesSummary(config, agentsList);
    const projectRoot = path.dirname(targetDir);
    const cursorrulesPath = path.join(projectRoot, '.cursorrules');
    
    // Check if .cursorrules already exists as a directory
    const cursorrulesExists = await fs.pathExists(cursorrulesPath);
    if (cursorrulesExists) {
      const stats = await fs.stat(cursorrulesPath);
      if (stats.isDirectory()) {
        console.warn('\n⚠ Warning: .cursorrules already exists as a directory, skipping file creation');
        return files;
      }
    }
    
    await fs.writeFile(cursorrulesPath, cursorrules);
    files.push(cursorrulesPath);
  }

  return files;
}

/**
 * Generate GitHub Copilot configuration
 */
async function generateCopilotFiles(config, targetDir, agentsList) {
  const files = [];

  // Create .github directory at project root, not inside targetDir
  const projectRoot = path.dirname(targetDir);
  const githubDir = path.join(projectRoot, '.github');
  await fs.ensureDir(githubDir);

  // Generate copilot-instructions.md
  const instructions = generateCopilotInstructions(config, agentsList);
  const instructionsPath = path.join(githubDir, 'copilot-instructions.md');
  await fs.writeFile(instructionsPath, instructions);
  files.push(instructionsPath);

  return files;
}

/**
 * Generate Aider configuration
 */
async function generateAiderFiles(config, targetDir, agentsList) {
  const files = [];

  // Create .aider directory at project root
  const projectRoot = path.dirname(targetDir);
  const aiderDir = path.join(projectRoot, '.aider');
  await fs.ensureDir(aiderDir);

  // Generate conventions.md
  const conventions = generateAiderConventions(config, agentsList);
  const conventionsPath = path.join(aiderDir, 'conventions.md');
  await fs.writeFile(conventionsPath, conventions);
  files.push(conventionsPath);

  return files;
}

/**
 * Generate index file listing all agents
 */
async function generateIndexFile(config, targetDir, agentsList) {
  const content = `# AI Agents Index

## Available Agents

${agentsList.map(({ dept, agent }) => {
  return `- **${dept}/${agent}** - [View](${dept}/${agent}.md)`;
}).join('\n')}

## Quick Reference

${generateQuickReference(agentsList)}
`;

  const indexPath = path.join(targetDir, 'INDEX.md');
  await fs.writeFile(indexPath, content);
  return indexPath;
}

function generateQuickReference(agentsList) {
  const byDept = {};
  agentsList.forEach(({ dept, agent }) => {
    if (!byDept[dept]) byDept[dept] = [];
    byDept[dept].push(agent);
  });

  return Object.entries(byDept).map(([dept, agents]) => {
    return `### ${dept}\n${agents.map(a => `- ${a}`).join('\n')}`;
  }).join('\n\n');
}

/**
 * Generate .cursorrules summary file
 */
function generateCursorrulesSummary(config, agentsList) {
  return `# Cursor AI Agent Configuration

This project uses AgentKit for AI agent management.

## Agent Files Location

Agent files are organized in: \`${config.folder}/\`

## Usage with Cursor

### Method 1: @-mentions (Recommended)

Use @-mentions to reference specific agents:

\`\`\`
@${config.folder}/engineering/backend-architect.md Design a REST API
\`\`\`

### Method 2: Natural Language

Reference agents naturally in your prompts:

\`\`\`
"Following the backend-architect guidelines in ${config.folder}/engineering/..."
\`\`\`

## Available Agents

${agentsList.map(({ dept, agent }) => `- ${dept}/${agent}`).join('\n')}

## General Guidelines

When working on this project:

1. **Architecture**: Follow the patterns defined in the engineering agents
2. **Design**: Maintain consistency with design system agents
3. **Testing**: Ensure comprehensive test coverage
4. **Documentation**: Keep documentation up-to-date

${config.stack.length > 0 ? `## Tech Stack\n\n${config.stack.join(', ')}` : ''}

---

For detailed agent instructions, see individual files in \`${config.folder}/\`
`;
}

/**
 * Generate Cursor usage instructions
 */
function generateCursorInstructions(config) {
  return `# Using AI Agents with Cursor

## Setup Complete! ✓

Your AI agents are configured and ready to use.

## How to Use

### 1. @-Mentions (Primary Method)

The most powerful way to use agents in Cursor:

\`\`\`
@${config.folder}/engineering/backend-architect.md

Design a REST API for user management with:
- Authentication
- CRUD operations
- Rate limiting
\`\`\`

### 2. Multiple Agents

Combine multiple agents for complex tasks:

\`\`\`
@${config.folder}/engineering/backend-architect.md
@${config.folder}/testing/api-tester.md

Design and test a payment processing API
\`\`\`

### 3. In Composer

Use agents in Cursor's Composer mode for multi-file changes:

1. Open Composer (Cmd/Ctrl + I)
2. Add agent with @-mention
3. Describe your task
4. Cursor will apply changes across files

## Tips

- **Specific Agents**: Use the most relevant agent for your task
- **Combine Agents**: Multiple agents can collaborate on complex tasks
- **Context**: Agents have access to your codebase context
- **Iterations**: Refine results by providing feedback

## Agent Directory

Browse agents: \`${config.folder}/\`

## Troubleshooting

**Agents not appearing in @-mentions?**
- Ensure files are in \`${config.folder}/\` directory
- Restart Cursor
- Check Cursor settings for custom instruction paths

**Need different agents?**
Run: \`agentkit init\` to reconfigure

---

Happy coding with AI agents! 💜
`;
}

/**
 * Generate GitHub Copilot instructions
 */
function generateCopilotInstructions(config, agentsList) {
  return `# GitHub Copilot - AI Agent Instructions

This project uses specialized AI agents for different aspects of development.

## Agent Roles

${agentsList.map(({ dept, agent }) => {
  return `### ${agent} (${dept})

Specialized agent for ${dept} tasks. See detailed instructions in \`${config.folder}/${dept}/${agent}.md\`
`;
}).join('\n')}

## General Development Guidelines

When working on this project, follow these principles:

### Code Quality
- Write clean, maintainable code
- Follow existing patterns in the codebase
- Add appropriate comments for complex logic
- Ensure code is self-documenting where possible

### Testing
- Write tests for new features
- Maintain high test coverage
- Include edge cases in tests
- Follow testing patterns established in the project

### Documentation
- Update documentation when adding features
- Keep README files current
- Document API changes
- Add inline documentation for public APIs

${config.stack.length > 0 ? generateStackGuidelines(config.stack) : ''}

## Architecture Patterns

Follow the established architecture patterns in this project. Refer to specific agent files in \`${config.folder}/\` for detailed guidance on:

- Backend architecture and API design
- Frontend component structure
- Testing strategies
- Deployment and DevOps practices

## Getting Agent Details

For specific guidance on any aspect of development, refer to the detailed agent files:

\`\`\`
${config.folder}/
${agentsList.map(({ dept, agent }) => `  ${dept}/${agent}.md`).join('\n')}
\`\`\`

---

*Generated by AgentKit - https://github.com/patricio0312rev/agentkit*
`;
}

function generateStackGuidelines(stack) {
  return `
### Tech Stack

This project uses: ${stack.join(', ')}

Please ensure all code and suggestions are compatible with this stack.
`;
}

/**
 * Generate Aider conventions
 */
function generateAiderConventions(config, agentsList) {
  return `# Aider Conventions

This project uses AgentKit AI agents for development guidance.

## Project Structure

Agent files are located in: \`${config.folder}/\`

## Available Agents

${agentsList.map(({ dept, agent }) => `- **${dept}/${agent}**`).join('\n')}

## Coding Conventions

### General
- Follow the patterns established in the codebase
- Write clear, self-documenting code
- Add comments for complex logic
- Keep functions focused and single-purpose

### Testing
- Write tests for all new features
- Maintain or improve test coverage
- Include edge cases

### Documentation
- Update documentation with code changes
- Keep README files current
- Document public APIs

${config.stack.length > 0 ? `### Tech Stack\n\n${config.stack.join(', ')}\n\nEnsure all code is compatible with this stack.` : ''}

## Agent Guidance

For detailed guidance on specific aspects:

${agentsList.slice(0, 5).map(({ dept, agent }) => {
  return `- **${agent}**: See \`${config.folder}/${dept}/${agent}.md\``;
}).join('\n')}

${agentsList.length > 5 ? `\n...and ${agentsList.length - 5} more agents in \`${config.folder}/\`` : ''}

---

*Configure Aider to use these conventions with: \`aider --read ${config.folder}/\`*
`;
}

module.exports = {
  generateToolSpecificFiles,
  generateCursorFiles,
  generateCopilotFiles,
  generateAiderFiles
};
