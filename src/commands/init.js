const inquirer = require("inquirer");
const chalk = require("chalk");
const ora = require("ora");
const { generateAgents } = require("../lib/generator");
const { TOOLS, DEPARTMENTS } = require("../lib/config");
const { displayError, displayBox } = require("../utils/display");

async function initCommand(options) {
  console.log(chalk.cyan("\n🚀 Let's set up your AI agents!\n"));

  try {
    let config = {};

    // Check if all required options provided (non-interactive mode)
    if (options.skipPrompts) {
      if (!options.tool || !options.departments) {
        displayError("--skip-prompts requires --tool and --departments flags");
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
      displayError("Configuration validation failed:");
      validation.errors.forEach((err) => console.log(chalk.red(`  • ${err}`)));
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
    folder: options.folder || TOOLS[options.tool]?.folder || ".ai",
    departments: options.departments.split(",").map((d) => d.trim()),
    agents: options.agents
      ? options.agents.split(",").map((a) => a.trim())
      : [],
    model: options.model === "inherit" ? undefined : options.model,
    stack: [],
  };
}

async function promptUser(options) {
  const answers = {};

  // Step 1: Select AI tool
  if (!options.tool) {
    const toolChoices = Object.entries(TOOLS).map(([key, value]) => ({
      name: `${chalk.bold(value.name)} ${chalk.dim("→")} ${chalk.gray(value.description)}`,
      value: key,
      short: value.name,
    }));

    const toolAnswer = await inquirer.prompt([
      {
        type: "list",
        name: "tool",
        message: "Which AI tool are you using?",
        choices: toolChoices,
        default: "cursor",
      },
    ]);
    answers.tool = toolAnswer.tool;
  } else {
    answers.tool = options.tool;
  }

  // Step 2: Custom folder name
  const defaultFolder = TOOLS[answers.tool].folder;
  if (!options.folder) {
    const folderAnswer = await inquirer.prompt([
      {
        type: "input",
        name: "folder",
        message: "Folder name for AI agents:",
        default: defaultFolder,
        validate: (input) => {
          if (!input.trim()) return "Folder name cannot be empty";
          if (input.includes(" ")) return "Folder name cannot contain spaces";
          if (input.includes("\\") || input.includes("/"))
            return "Folder name cannot contain path separators";
          return true;
        },
      },
    ]);
    answers.folder = folderAnswer.folder;
  } else {
    answers.folder = options.folder;
  }

  // Step 2.5: Model selection for Claude Code
  if (answers.tool === "claude-code" && !options.model) {
    const modelChoices = [
      {
        name: `${chalk.bold("Sonnet")} ${chalk.gray("→")} ${chalk.dim("Balanced performance - best for most agents")}`,
        value: "sonnet",
        short: "Sonnet",
      },
      {
        name: `${chalk.bold("Opus")} ${chalk.gray("→")} ${chalk.dim("Most capable for complex reasoning tasks")}`,
        value: "opus",
        short: "Opus",
      },
      {
        name: `${chalk.bold("Haiku")} ${chalk.gray("→")} ${chalk.dim("Fast and efficient for simple tasks")}`,
        value: "haiku",
        short: "Haiku",
      },
      {
        name: `${chalk.bold("Inherit from parent")} ${chalk.gray("→")} ${chalk.dim("Use the same model as the main conversation")}`,
        value: "inherit",
        short: "Inherit from parent",
      },
    ];

    const modelAnswer = await inquirer.prompt([
      {
        type: "list",
        name: "model",
        message: "Select model for agents:",
        choices: modelChoices,
        default: "sonnet",
      },
    ]);
    answers.model =
      modelAnswer.model === "inherit" ? undefined : modelAnswer.model;
  } else if (options.model) {
    answers.model = options.model === "inherit" ? undefined : options.model;
  }

  // Step 3: Select departments
  if (!options.departments) {
    const deptChoices = Object.entries(DEPARTMENTS).map(([key, value]) => ({
      name: `${chalk.bold(value.name)} ${chalk.dim(`(${value.agents.length} agents)`)} ${chalk.gray("→ " + value.description)}`,
      value: key,
      short: value.name,
      checked: ["engineering", "design"].includes(key), // Default selections
    }));

    const deptAnswer = await inquirer.prompt([
      {
        type: "checkbox",
        name: "departments",
        message: "Select departments to include:",
        choices: deptChoices,
        pageSize: 10,
        validate: (input) => {
          if (input.length === 0)
            return "Please select at least one department";
          return true;
        },
      },
    ]);
    answers.departments = deptAnswer.departments;
  } else {
    answers.departments = options.departments.split(",").map((d) => d.trim());
  }

  // Step 4: Select specific agents per department
  answers.agents = [];

  if (!options.agents) {
    console.log(chalk.cyan("\n📋 Select agents for each department:\n"));

    for (const dept of answers.departments) {
      const deptInfo = DEPARTMENTS[dept];

      const agentChoices = deptInfo.agents.map((agent) => ({
        name: agent,
        value: `${dept}/${agent}`,
        checked: true, // All selected by default
      }));

      const agentAnswer = await inquirer.prompt([
        {
          type: "checkbox",
          name: "selectedAgents",
          message: `${chalk.bold(deptInfo.name)} agents:`,
          choices: agentChoices,
          pageSize: 15,
          validate: (input) => {
            if (input.length === 0) {
              return `Please select at least one agent from ${deptInfo.name} (or deselect the department)`;
            }
            return true;
          },
        },
      ]);

      answers.agents.push(...agentAnswer.selectedAgents);
    }
  } else {
    answers.agents = options.agents.split(",").map((a) => a.trim());
  }

  // Count total agents selected
  const totalAgents = answers.agents.length;
  console.log(
    chalk.dim(`\n  → Total agents selected: ${chalk.bold(totalAgents)}\n`)
  );

  answers.stack = []; // Removed for v0.1.0

  return answers;
}

function validateConfiguration(config) {
  const errors = [];

  // Validate tool
  if (!config.tool || !TOOLS[config.tool]) {
    errors.push(
      `Invalid tool: ${config.tool}. Valid options: ${Object.keys(TOOLS).join(", ")}`
    );
  }

  // Validate folder
  if (!config.folder || typeof config.folder !== "string") {
    errors.push("Folder name is required and must be a string");
  }

  // Validate departments
  if (
    !config.departments ||
    !Array.isArray(config.departments) ||
    config.departments.length === 0
  ) {
    errors.push("At least one department is required");
  }

  config.departments?.forEach((dept) => {
    if (!DEPARTMENTS[dept]) {
      errors.push(
        `Invalid department: ${dept}. Valid options: ${Object.keys(DEPARTMENTS).join(", ")}`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

async function generateConfiguration(config) {
  const spinner = ora("Generating AI agent configuration...").start();

  try {
    const result = await generateAgents(config);

    spinner.succeed(chalk.green("✓ Configuration generated successfully!"));

    // Display results
    displayResults(config, result);
  } catch (error) {
    spinner.fail(chalk.red("Failed to generate configuration"));
    throw error;
  }
}

function displayResults(config, result) {
  const tool = TOOLS[config.tool];

  // Format file location with proper coloring
  const locationLine = `Location: ${chalk.yellow(config.folder + "/")}`;
  const toolLine = `Tool: ${chalk.cyan(tool.name)}`;
  const deptLine = `Departments: ${config.departments.length}`;
  const agentsLine = `Agents: ${result.agentsGenerated || 0}`;

  displayBox(
    "📁 Generated Files",
    `${locationLine}\n${toolLine}\n${deptLine}\n${agentsLine}`
  );

  displayBox("📚 Usage Instructions", getUsageInstructions(config.tool));

  const step1 = `1. Review files in ${chalk.yellow(config.folder + "/")}`;
  const step2 = `2. Read ${chalk.yellow(config.folder + "/README.md")}`;
  const step3 = `3. ${getToolSpecificNextStep(config.tool)}`;
  const step4 = `4. Commit to version control to share with team`;

  displayBox("🚀 Next Steps", `${step1}\n${step2}\n${step3}\n${step4}`);

  console.log(
    chalk.dim("💡 Tip: Run ") +
      chalk.cyan("agentkit init") +
      chalk.dim(" again to regenerate\n")
  );
}

function getUsageInstructions(tool) {
  const instructions = {
    "claude-code":
      `With Claude Code CLI:\n` +
      chalk.gray("  $ ") +
      chalk.green('claude-code "Build login page using frontend-developer"\n') +
      `\n` +
      `Agents will be automatically loaded by Claude Code.`,

    cursor:
      `With Cursor:\n` +
      `1. Use @-mentions in chat:\n` +
      chalk.gray("     @engineering/backend-architect.md ") +
      chalk.dim("Design API\n") +
      `2. Or reference in prompts naturally`,

    copilot:
      `With GitHub Copilot:\n` +
      `Instructions are in .github/copilot-instructions.md\n` +
      `Copilot will automatically use them.`,

    aider:
      `With Aider:\n` +
      `Conventions are in .aider/conventions.md\n` +
      `Aider will use them automatically.`,

    universal:
      `With any AI tool:\n` +
      `Upload relevant agent .md files to your AI chat\n` +
      `and reference them in your prompts.`,
  };

  return instructions[tool] || instructions.universal;
}

function getToolSpecificNextStep(tool) {
  const steps = {
    "claude-code": "Start coding: " + chalk.green('claude-code "your task"'),
    cursor: "Open Cursor and use @-mentions",
    copilot: "Start coding - Copilot will use the instructions",
    aider: "Start coding: " + chalk.green("aider --read .aider/"),
    universal: "Open your AI tool and upload the agent files",
  };

  return steps[tool] || steps.universal;
}

module.exports = initCommand;
