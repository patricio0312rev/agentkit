const fs = require('fs-extra');
const path = require('path');
const { TOOLS, DEPARTMENTS } = require('./config');
const { generateReadme } = require('../utils/readme');
const { generateToolSpecificFiles } = require('../utils/tool-specific');

/**
 * Main generator function that creates AI agent configuration
 * @param {Object} config - Configuration object
 * @returns {Promise<Object>} Generation result
 */
async function generateAgents(config) {
  const targetDir = path.join(process.cwd(), config.folder);
  const result = {
    success: false,
    targetDir,
    agentsGenerated: 0,
    filesCreated: [],
    errors: []
  };

  try {
    // Ensure target directory exists
    await fs.ensureDir(targetDir);

    // Generate department folders and agent files
    const agentResult = await generateDepartmentAgents(config, targetDir);
    result.agentsGenerated = agentResult.count;
    result.filesCreated.push(...agentResult.files);

    // Generate README
    const readmePath = path.join(targetDir, 'README.md');
    const readmeContent = generateReadme(config, result);
    await fs.writeFile(readmePath, readmeContent);
    result.filesCreated.push(readmePath);

    // Generate tool-specific files (e.g., .cursorrules, copilot-instructions.md)
    const toolFiles = await generateToolSpecificFiles(config, targetDir, agentResult.agentsList);
    result.filesCreated.push(...toolFiles);

    result.success = true;
    return result;

  } catch (error) {
    result.errors.push(error.message);
    throw error;
  }
}

/**
 * Generate department folders and copy agent files
 * @param {Object} config - Configuration object
 * @param {string} targetDir - Target directory path
 * @returns {Promise<Object>} Result with count and file list
 */
async function generateDepartmentAgents(config, targetDir) {
  let count = 0;
  const files = [];
  const agentsList = [];

  for (const dept of config.departments) {
    const deptInfo = DEPARTMENTS[dept];
    if (!deptInfo) continue;

    const deptDir = path.join(targetDir, dept);
    await fs.ensureDir(deptDir);

    // Determine which agents to generate
    let agentsToGenerate = deptInfo.agents;
    
    // Filter if specific agents were selected
    if (config.agents && config.agents.length > 0) {
      agentsToGenerate = agentsToGenerate.filter(agent => {
        // Support both "agent-name" and "dept/agent-name" formats
        return config.agents.includes(agent) || 
               config.agents.includes(`${dept}/${agent}`);
      });
    }

    // Copy/generate each agent file
    for (const agent of agentsToGenerate) {
      const agentFile = await generateAgentFile(dept, agent, deptDir, config);
      if (agentFile) {
        files.push(agentFile);
        agentsList.push({ dept, agent, file: agentFile });
        count++;
      }
    }
  }

  return { count, files, agentsList };
}

/**
 * Generate or copy an individual agent file
 * @param {string} dept - Department name
 * @param {string} agent - Agent name
 * @param {string} deptDir - Department directory path
 * @param {Object} config - Configuration object
 * @returns {Promise<string|null>} Path to created file or null
 */
async function generateAgentFile(dept, agent, deptDir, config) {
  const sourceFile = path.join(__dirname, '../../templates/departments', dept, `${agent}.md`);
  const targetFile = path.join(deptDir, `${agent}.md`);

  try {
    // Check if template exists
    if (await fs.pathExists(sourceFile)) {
      let content = await fs.readFile(sourceFile, 'utf8');

      // Process content based on config
      content = processAgentContent(content, config);

      await fs.writeFile(targetFile, content);
      return targetFile;
    } else {
      // Generate basic template if source doesn't exist
      const basicTemplate = generateBasicAgentTemplate(dept, agent);
      await fs.writeFile(targetFile, basicTemplate);
      return targetFile;
    }
  } catch (error) {
    console.error(`Error generating agent ${agent}:`, error.message);
    return null;
  }
}

/**
 * Process agent content based on configuration
 * @param {string} content - Original content
 * @param {Object} config - Configuration object
 * @returns {string} Processed content
 */
function processAgentContent(content, config) {
  let processed = content;

  // Remove examples if requested
  if (config.skipExamples) {
    // Remove content between <example> tags
    processed = processed.replace(/<example>[\s\S]*?<\/example>/g, '');
    // Clean up extra whitespace
    processed = processed.replace(/\n{3,}/g, '\n\n');
  }

  // Add tech stack information if provided
  if (config.stack && config.stack.length > 0) {
    const stackSection = `\n\n## Tech Stack Context\n\nThis project uses: ${config.stack.join(', ')}\n`;
    // Insert before the main content or at the end
    processed += stackSection;
  }

  return processed;
}

/**
 * Generate a basic agent template when source file doesn't exist
 * @param {string} dept - Department name
 * @param {string} agent - Agent name
 * @returns {string} Basic template content
 */
function generateBasicAgentTemplate(dept, agent) {
  const deptInfo = DEPARTMENTS[dept];
  return `<!-- ${dept}/${agent}.md -->
---
name: ${agent}
description: AI agent for ${deptInfo.name}
color: blue
tools: Read, Write, MultiEdit
---

# ${agent.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}

This is a placeholder agent file. Please add specific instructions and responsibilities.

## Responsibilities

- [Add specific responsibilities]

## Best Practices

- [Add best practices]

## Examples

- [Add usage examples]
`;
}

module.exports = {
  generateAgents,
  generateDepartmentAgents,
  generateAgentFile
};
