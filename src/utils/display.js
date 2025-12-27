const chalk = require('chalk');

function displayBanner() {
  const version = require('../../package.json').version;
  console.log(
    chalk.cyan(
      '\n' +
      '  ╔═══════════════════════════════════════════╗\n' +
      '  ║                                           ║\n' +
      '  ║      🤖  AgentKit CLI v' + version.padEnd(19) +  '║\n' +
      '  ║                                           ║\n' +
      '  ║     Scaffold AI agent configurations      ║\n' +
      '  ║     for Claude Code, Cursor & more        ║\n' +
      '  ║                                           ║\n' +
      '  ╚═══════════════════════════════════════════╝\n'
    )
  );
}

function displaySuccess(message) {
  console.log(chalk.green(`\n✓ ${message}\n`));
}

function displayError(message) {
  console.log(chalk.red(`\n✗ ${message}\n`));
}

function displayWarning(message) {
  console.log(chalk.yellow(`\n⚠ ${message}\n`));
}

function displayInfo(message) {
  console.log(chalk.blue(`\nℹ ${message}\n`));
}

function displayBox(title, content) {
  const lines = content.split('\n');
  const maxLength = Math.max(...lines.map(l => l.length), title.length);
  const width = maxLength + 4;
  
  console.log(chalk.cyan('┌' + '─'.repeat(width) + '┐'));
  console.log(chalk.cyan('│ ') + chalk.bold(title.padEnd(width - 2)) + chalk.cyan(' │'));
  console.log(chalk.cyan('├' + '─'.repeat(width) + '┤'));
  lines.forEach(line => {
    console.log(chalk.cyan('│ ') + line.padEnd(width - 2) + chalk.cyan(' │'));
  });
  console.log(chalk.cyan('└' + '─'.repeat(width) + '┘\n'));
}

module.exports = {
  displayBanner,
  displaySuccess,
  displayError,
  displayWarning,
  displayInfo,
  displayBox
};
