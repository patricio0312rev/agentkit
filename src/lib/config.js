const TOOLS = {
    'claude-code': {
      name: 'Claude Code',
      folder: '.claude',
      description: 'Sub-agents with native support',
      fileStructure: 'multi-file',
      supportsSubAgents: true
    },
    'cursor': {
      name: 'Cursor',
      folder: '.cursorrules',
      description: 'Single .cursorrules file or @-mention files',
      fileStructure: 'multi-file',
      supportsSubAgents: true
    },
    'copilot': {
      name: 'GitHub Copilot',
      folder: '.github',
      description: '.github/copilot-instructions.md',
      fileStructure: 'single-file',
      supportsSubAgents: false
    },
    'aider': {
      name: 'Aider',
      folder: '.aider',
      description: 'Aider conventions.md',
      fileStructure: 'single-file',
      supportsSubAgents: false
    },
    'universal': {
      name: 'Universal',
      folder: '.ai',
      description: 'Works with any tool',
      fileStructure: 'multi-file',
      supportsSubAgents: true
    }
};
  
const DEPARTMENTS = {
    design: {
      name: 'Design',
      description: 'Visual design, UX research, and brand management',
      agents: [
        'brand-guardian',
        'ui-designer',
        'ux-researcher',
        'visual-storyteller',
        'whimsy-injector'
      ]
    },
    engineering: {
      name: 'Engineering',
      description: 'Software development, architecture, and DevOps',
      agents: [
        'ai-engineer',
        'backend-architect',
        'devops-automator',
        'frontend-developer',
        'mobile-app-builder',
        'rapid-prototyper',
        'test-writer-fixer'
      ]
    },
    marketing: {
      name: 'Marketing',
      description: 'Growth, content creation, and social media',
      agents: [
        'app-store-optimizer',
        'content-creator',
        'growth-hacker',
        'instagram-curator',
        'reddit-community-builder',
        'tiktok-strategist',
        'twitter-engager'
      ]
    },
    product: {
      name: 'Product',
      description: 'Product management, user feedback, and trends',
      agents: [
        'feedback-synthesizer',
        'sprint-prioritizer',
        'trend-researcher'
      ]
    },
    'project-management': {
      name: 'Project Management',
      description: 'Sprint planning, experiments, and launches',
      agents: [
        'experiment-tracker',
        'project-shipper',
        'studio-producer'
      ]
    },
    'studio-operations': {
      name: 'Studio Operations',
      description: 'Analytics, finance, infrastructure, and support',
      agents: [
        'analytics-reporter',
        'finance-tracker',
        'infrastructure-maintainer',
        'legal-compliance-checker',
        'support-responder'
      ]
    },
    testing: {
      name: 'Testing',
      description: 'Quality assurance, performance, and testing',
      agents: [
        'api-tester',
        'performance-benchmarker',
        'test-results-analyzer',
        'tool-evaluator',
        'workflow-optimizer'
      ]
    }
  };
  
  const STACKS = {
    // Frontend
    react: { name: 'React', category: 'frontend' },
    vue: { name: 'Vue', category: 'frontend' },
    angular: { name: 'Angular', category: 'frontend' },
    svelte: { name: 'Svelte', category: 'frontend' },
    nextjs: { name: 'Next.js', category: 'frontend' },
    
    // Backend
    nodejs: { name: 'Node.js', category: 'backend' },
    python: { name: 'Python', category: 'backend' },
    go: { name: 'Go', category: 'backend' },
    rust: { name: 'Rust', category: 'backend' },
    java: { name: 'Java', category: 'backend' },
    
    // Database
    postgres: { name: 'PostgreSQL', category: 'database' },
    mongodb: { name: 'MongoDB', category: 'database' },
    mysql: { name: 'MySQL', category: 'database' },
    redis: { name: 'Redis', category: 'database' },
    
    // Cloud/Infrastructure
    aws: { name: 'AWS', category: 'cloud' },
    gcp: { name: 'Google Cloud', category: 'cloud' },
    azure: { name: 'Azure', category: 'cloud' },
    vercel: { name: 'Vercel', category: 'cloud' },
    
    // Mobile
    'react-native': { name: 'React Native', category: 'mobile' },
    flutter: { name: 'Flutter', category: 'mobile' },
    swift: { name: 'Swift', category: 'mobile' },
    kotlin: { name: 'Kotlin', category: 'mobile' }
};
  
module.exports = {
    TOOLS,
    DEPARTMENTS,
    STACKS
};
