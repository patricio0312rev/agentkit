/**
 * AgentKit - Programmatic API
 * 
 * This module exports the main functions for use by:
 * - CLI (this package)
 * - VSCode Extension
 * - Other integrations
 */

const { generateAgents } = require('./lib/generator');
const { TOOLS, DEPARTMENTS, STACKS } = require('./lib/config');

/**
 * Generate AI agent configuration programmatically
 * @param {Object} config - Configuration object
 * @param {string} config.tool - AI tool (claude-code, cursor, copilot, aider, universal)
 * @param {string} config.folder - Target folder name
 * @param {string[]} config.departments - List of departments to include
 * @param {string[]} [config.agents] - Optional: specific agents to include
 * @param {string[]} [config.stack] - Optional: tech stack
 * @param {boolean} [config.skipExamples] - Skip examples in agent files
 * @returns {Promise<Object>} Result object with success status and details
 * 
 * @example
 * const agentkit = require('agentkit');
 * 
 * const result = await agentkit.generate({
 *   tool: 'cursor',
 *   folder: '.cursorrules',
 *   departments: ['engineering', 'design'],
 *   stack: ['react', 'typescript', 'nodejs']
 * });
 * 
 * console.log(`Generated ${result.agentsGenerated} agents`);
 */
async function generate(config) {
  // Validate config
  const validation = validateConfig(config);
  if (!validation.isValid) {
    throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
  }

  return await generateAgents(config);
}

/**
 * Get list of available tools
 * @returns {Object} Tools configuration
 * 
 * @example
 * const tools = agentkit.getTools();
 * console.log(Object.keys(tools)); // ['claude-code', 'cursor', 'copilot', ...]
 */
function getTools() {
  return { ...TOOLS };
}

/**
 * Get list of available departments
 * @returns {Object} Departments configuration
 * 
 * @example
 * const departments = agentkit.getDepartments();
 * console.log(departments.engineering.agents); // ['ai-engineer', 'backend-architect', ...]
 */
function getDepartments() {
  return { ...DEPARTMENTS };
}

/**
 * Get list of available tech stacks
 * @returns {Object} Tech stack configuration
 */
function getStacks() {
  return { ...STACKS };
}

/**
 * Get agents for a specific department
 * @param {string} department - Department name
 * @returns {string[]} List of agent names
 * 
 * @example
 * const agents = agentkit.getAgentsForDepartment('engineering');
 * console.log(agents); // ['ai-engineer', 'backend-architect', ...]
 */
function getAgentsForDepartment(department) {
  return DEPARTMENTS[department]?.agents || [];
}

/**
 * Get all available agents across all departments
 * @returns {Object} Object with department as key and agents array as value
 * 
 * @example
 * const allAgents = agentkit.getAllAgents();
 * console.log(allAgents.engineering); // ['ai-engineer', 'backend-architect', ...]
 */
function getAllAgents() {
  const result = {};
  Object.entries(DEPARTMENTS).forEach(([dept, info]) => {
    result[dept] = [...info.agents];
  });
  return result;
}

/**
 * Validate configuration
 * @param {Object} config - Configuration to validate
 * @returns {Object} Validation result with isValid and errors
 * 
 * @example
 * const validation = agentkit.validateConfig({
 *   tool: 'cursor',
 *   folder: '.cursorrules',
 *   departments: ['engineering']
 * });
 * 
 * if (!validation.isValid) {
 *   console.error(validation.errors);
 * }
 */
function validateConfig(config) {
  const errors = [];

  // Validate tool
  if (!config.tool) {
    errors.push('Tool is required');
  } else if (!TOOLS[config.tool]) {
    errors.push(`Invalid tool: ${config.tool}. Valid options: ${Object.keys(TOOLS).join(', ')}`);
  }

  // Validate folder
  if (!config.folder) {
    errors.push('Folder is required');
  } else if (typeof config.folder !== 'string') {
    errors.push('Folder must be a string');
  } else if (config.folder.includes(' ')) {
    errors.push('Folder name cannot contain spaces');
  }

  // Validate departments
  if (!config.departments) {
    errors.push('Departments are required');
  } else if (!Array.isArray(config.departments)) {
    errors.push('Departments must be an array');
  } else if (config.departments.length === 0) {
    errors.push('At least one department is required');
  } else {
    config.departments.forEach(dept => {
      if (!DEPARTMENTS[dept]) {
        errors.push(`Invalid department: ${dept}. Valid options: ${Object.keys(DEPARTMENTS).join(', ')}`);
      }
    });
  }

  // Validate agents if provided
  if (config.agents && !Array.isArray(config.agents)) {
    errors.push('Agents must be an array');
  }

  // Validate stack if provided
  if (config.stack && !Array.isArray(config.stack)) {
    errors.push('Stack must be an array');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get recommended configuration based on project type
 * @param {string} projectType - Type of project (web, mobile, fullstack, etc.)
 * @returns {Object} Recommended configuration
 * 
 * @example
 * const config = agentkit.getRecommendedConfig('web');
 * // Returns recommended departments and stack for web projects
 */
function getRecommendedConfig(projectType) {
  const recommendations = {
    web: {
      departments: ['engineering', 'design', 'testing'],
      stack: ['react', 'typescript', 'nodejs']
    },
    mobile: {
      departments: ['engineering', 'design', 'testing'],
      stack: ['react-native', 'typescript']
    },
    fullstack: {
      departments: ['engineering', 'design', 'product', 'testing'],
      stack: ['react', 'nodejs', 'postgres', 'typescript']
    },
    startup: {
      departments: ['engineering', 'design', 'product', 'marketing'],
      stack: ['react', 'nodejs', 'postgres']
    }
  };

  return recommendations[projectType] || recommendations.web;
}

// Export all functions
module.exports = {
  generate,
  getTools,
  getDepartments,
  getStacks,
  getAgentsForDepartment,
  getAllAgents,
  validateConfig,
  getRecommendedConfig,
  
  // Also export config directly for convenience
  TOOLS,
  DEPARTMENTS,
  STACKS
};