#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');

const DEPARTMENTS = {
  design: 'Design',
  engineering: 'Engineering',
  marketing: 'Marketing',
  product: 'Product',
  'project-management': 'Project Management',
  'studio-operations': 'Studio Operations',
  testing: 'Testing'
};

async function addTemplate() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'department',
      message: 'Select department:',
      choices: Object.entries(DEPARTMENTS).map(([key, name]) => ({ name, value: key }))
    },
    {
      type: 'input',
      name: 'agentName',
      message: 'Agent name (kebab-case):',
      validate: (input) => {
        if (!input.match(/^[a-z-]+$/)) {
          return 'Agent name must be kebab-case (lowercase with hyphens)';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Short description:'
    },
    {
      type: 'input',
      name: 'color',
      message: 'Color:',
      default: 'blue'
    }
  ]);

  const templatePath = path.join(
    __dirname,
    '../templates/departments',
    answers.department,
    `${answers.agentName}.md`
  );

  const template = generateTemplate(answers);

  await fs.ensureDir(path.dirname(templatePath));
  await fs.writeFile(templatePath, template);

  console.log(`\n✓ Template created: ${templatePath}`);
  console.log('\nNow edit the file to add specific instructions!');
}

function generateTemplate(answers) {
  return `<!-- ${answers.department}/${answers.agentName}.md -->
---
name: ${answers.agentName}
description: ${answers.description}
color: ${answers.color}
tools: Write, Read, MultiEdit
---

You are a ${answers.agentName.replace(/-/g, ' ')} specialist.

## Primary Responsibilities

### 1. [Responsibility Category]
When [doing task], you will:
- [Specific action]
- [Specific action]
- [Specific action]

### 2. [Responsibility Category]
You will [achieve goal] by:
- [Specific action]
- [Specific action]
- [Specific action]

## Best Practices

- [Best practice]
- [Best practice]
- [Best practice]

## Key Patterns

- [Pattern name]: [Description]
- [Pattern name]: [Description]

Your goal is to [overall objective].
`;
}

addTemplate().catch(console.error);
