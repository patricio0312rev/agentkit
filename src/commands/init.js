const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const { generateAgents } = require('../lib/generator');
const { TOOLS, DEPARTMENTS } = require('../lib/config');
const { displaySuccess, displayError, displayBox, displayInfo } = require('../utils/display');

async function initCommand(options) {
  console.log(chalk.cyan('\n🚀 Let\'s set up your AI agents!\n'));

  try {
    let config = {};

    // Check if all required options provided (non-interactive mode)
    if (options.skipPrompts) {
      if (!options.tool || !options.departments) {
        displayError('--skip-prompts requires --tool and --departments flags');
        process.exit(1);
      }
      config = buildConfigFromFlags(options);
    } else {
      // Interactive mode
      config = await promptUser(options);
    }

    // Validate configuration
    const validation = validateConfiguration(config);
    if (!validation.isValid) {
      displayError('Configuration validation failed:');
      validation.errors.forEach(err => console.log(chalk.red(`  • ${err}`)));
      process.exit(1);
    }

    // Generate the configuration
    await generateConfiguration(config);

  } catch (error) {
    displayError(`Failed to initialize: ${error.message}`);
    if (process.env.DEBUG) {
      console.error(error);
    }
    process.exit(1);
  }
}

function buildConfigFromFlags(options) {
  return {
    tool: options.tool,
    folder: options.folder || TOOLS[options.tool]?.folder || '.ai',
    departments: options.departments.split(',').map(d => d.trim()),
    agents: options.agents ? options.agents.split(',').map(a => a.trim()) : [],
    stack: options.stack ? options.stack.split(',').map(s => s.trim()) : [],
    skipExamples: options.skipExamples || false
  };
}

async function promptUser(options) {
  const answers = {};

  // Step 1: Select AI tool
  if (!options.tool) {
    const toolChoices = Object.entries(TOOLS).map(([key, value]) => ({
      name: `${chalk.bold(value.name)} ${chalk.dim('→')} ${chalk.gray(value.description)}`,
      value: key,
      short: value.name
    }));

    const toolAnswer = await inquirer.prompt([{
      type: 'list',
      name: 'tool',
      message: 'Which AI tool are you using?',
      choices: toolChoices,
      default: 'claude-code'
    }]);
    answers.tool = toolAnswer.tool;
  } else {
    answers.tool = options.tool;
  }

  // Step 2: Custom folder name
  const defaultFolder = TOOLS[answers.tool].folder;
  if (!options.folder) {
    const folderAnswer = await inquirer.prompt([{
      type: 'input',
      name: 'folder',
      message: 'Folder name for AI agents:',
      default: defaultFolder,
      validate: (input) => {
        if (!input.trim()) return 'Folder name cannot be empty';
        if (input.includes(' ')) return 'Folder name cannot contain spaces';
        if (input.includes('\\') || input.includes('/')) return 'Folder name cannot contain path separators';
        return true;
      }
    }]);
    answers.folder = folderAnswer.folder;
  } else {
    answers.folder = options.folder;
  }

  // Step 3: Select departments
  if (!options.departments) {
    const deptChoices = Object.entries(DEPARTMENTS).map(([key, value]) => ({
      name: `${chalk.bold(value.name)} ${chalk.dim(`(${value.agents.length} agents)`)} ${chalk.gray('→ ' + value.description)}`,
      value: key,
      short: value.name,
      checked: ['engineering', 'design'].includes(key) // Default selections
    }));

    const deptAnswer = await inquirer.prompt([{
      type: 'checkbox',
      name: 'departments',
      message: 'Select departments to include:',
      choices: deptChoices,
      pageSize: 10,
      validate: (input) => {
        if (input.length === 0) return 'Please select at least one department';
        return true;
      }
    }]);
    answers.departments = deptAnswer.departments;
  } else {
    answers.departments = options.departments.split(',').map(d => d.trim());
  }

  // Step 4: Count total agents
  const totalAgents = answers.departments.reduce((sum, dept) => {
    return sum + (DEPARTMENTS[dept]?.agents.length || 0);
  }, 0);

  console.log(chalk.dim(`\n  → Total agents selected: ${chalk.bold(totalAgents)}\n`));

  // Step 5: Optional - Select specific agents (if many selected)
  if (!options.agents && totalAgents > 15) {
    const customizeAnswer = await inquirer.prompt([{
      type: 'confirm',
      name: 'customize',
      message: `Would you like to customize which agents to include?`,
      default: false
    }]);

    if (customizeAnswer.customize) {
      const agentChoices = [];
      answers.departments.forEach(dept => {
        const deptInfo = DEPARTMENTS[dept];
        agentChoices.push(new inquirer.Separator(chalk.cyan(`\n── ${deptInfo.name} ──`)));
        deptInfo.agents.forEach(agent => {
          agentChoices.push({
            name: `  ${agent}`,
            value: `${dept}/${agent}`,
            checked: true
          });
        });
      });

      const agentsAnswer = await inquirer.prompt([{
        type: 'checkbox',
        name: 'agents',
        message: 'Select specific agents:',
        choices: agentChoices,
        pageSize: 20
      }]);
      
      // Parse department/agent format
      answers.agents = agentsAnswer.agents;
    } else {
      answers.agents = [];
    }
  } else {
    answers.agents = options.agents ? options.agents.split(',').map(a => a.trim()) : [];
  }

  // Step 6: Tech stack (optional)
  if (!options.stack) {
    const stackAnswer = await inquirer.prompt([{
      type: 'input',
      name: 'stack',
      message: 'Tech stack (comma-separated, optional):',
      default: '',
      filter: (input) => input.trim() === '' ? [] : input.split(',').map(s => s.trim().toLowerCase())
    }]);
    answers.stack = stackAnswer.stack;
  } else {
    answers.stack = options.stack.split(',').map(s => s.trim().toLowerCase());
  }

  // Step 7: Skip examples
  answers.skipExamples = options.skipExamples || false;

  return answers;
}

function validateConfiguration(config) {
  const errors = [];

  // Validate tool
  if (!config.tool || !TOOLS[config.tool]) {
    errors.push(`Invalid tool: ${config.tool}. Valid options: ${Object.keys(TOOLS).join(', ')}`);
  }

  // Validate folder
  if (!config.folder || typeof config.folder !== 'string') {
    errors.push('Folder name is required and must be a string');
  }

  // Validate departments
  if (!config.departments || !Array.isArray(config.departments) || config.departments.length === 0) {
    errors.push('At least one department is required');
  }

  config.departments?.forEach(dept => {
    if (!DEPARTMENTS[dept]) {
      errors.push(`Invalid department: ${dept}. Valid options: ${Object.keys(DEPARTMENTS).join(', ')}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

async function generateConfiguration(config) {
  const spinner = ora('Generating AI agent configuration...').start();

  try {
    const result = await generateAgents(config);

    spinner.succeed(chalk.green('✓ Configuration generated successfully!'));

    // Display results
    displayResults(config, result);

  } catch (error) {
    spinner.fail(chalk.red('Failed to generate configuration'));
    throw error;
  }
}

function displayResults(config, result) {
  const tool = TOOLS[config.tool];
  
  displayBox('📁 Generated Files', 
    `Location: ${chalk.yellow(config.folder)}/\n` +
    `Tool: ${chalk.cyan(tool.name)}\n` +
    `Departments: ${config.departments.length}\n` +
    `Agents: ${result.agentsGenerated || 0}`
  );

  displayBox('📚 Usage Instructions', getUsageInstructions(config.tool));

  displayBox('🚀 Next Steps',
    `1. Review files in ${chalk.yellow(config.folder)}/\n` +
    `2. Read ${chalk.yellow(`${config.folder}/README.md`)}\n` +
    `3. ${getToolSpecificNextStep(config.tool)}\n` +
    `4. Commit to version control to share with team`
  );

  console.log(chalk.dim('\n💡 Tip: Run ') + chalk.cyan('agentkit init') + chalk.dim(' again to regenerate\n'));
}

function getUsageInstructions(tool) {
  const instructions = {
    'claude-code': 
      `With Claude Code CLI:\n` +
      chalk.gray('  $ ') + chalk.green('claude-code "Build login page using frontend-developer"\n') +
      `\n` +
      `Agents will be automatically loaded by Claude Code.`,
    
    'cursor': 
      `With Cursor:\n` +
      `1. Use @-mentions in chat:\n` +
      chalk.gray('     @engineering/backend-architect.md ') + chalk.dim('Design API\n') +
      `2. Or reference in prompts naturally`,
    
    'copilot':
      `With GitHub Copilot:\n` +
      `Instructions are in .github/copilot-instructions.md\n` +
      `Copilot will automatically use them.`,
    
    'universal': 
      `With any AI tool:\n` +
      `Upload relevant agent .md files to your AI chat\n` +
      `and reference them in your prompts.`
  };
  
  return instructions[tool] || instructions.universal;
}

function getToolSpecificNextStep(tool) {
  const steps = {
    'claude-code': 'Start coding: ' + chalk.green('claude-code "your task"'),
    'cursor': 'Open Cursor and use @-mentions',
    'copilot': 'Start coding - Copilot will use the instructions',
    'universal': 'Open your AI tool and upload the agent files'
  };
  
  return steps[tool] || steps.universal;
}

module.exports = initCommand;
