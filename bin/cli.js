#!/usr/bin/env node

const { program } = require("commander");
const chalk = require("chalk");
const packageJson = require("../package.json");
const { displayBanner } = require("../src/utils/display");
const initCommand = require("../src/commands/init");

// Display banner
displayBanner();

program
  .name("agentkit")
  .description(
    "Scaffold AI agent configurations for Claude Code, Cursor, and more"
  )
  .version(packageJson.version);

program
  .command("init")
  .description("Initialize AI agents configuration in current directory")
  .option(
    "-t, --tool <tool>",
    "AI tool (claude-code, cursor, copilot, aider, universal)"
  )
  .option("-f, --folder <name>", "Custom folder name")
  .option(
    "-m, --model <model>",
    "Model for Claude Code agents (sonnet, opus, haiku, inherit)"
  )
  .option("-d, --departments <list>", "Comma-separated list of departments")
  .option("--agents <list>", "Comma-separated list of specific agents")
  .option(
    "--stack <list>",
    "Comma-separated tech stack (react,typescript,postgres,etc)"
  )
  .option("--skip-prompts", "Skip all interactive prompts (requires all flags)")
  .action(initCommand);

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
