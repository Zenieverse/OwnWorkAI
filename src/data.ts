import { Agent, WorkflowNode, WorkflowEdge, MemoryItem, Integration, ProjectWorkspace, ActivityEvent } from './types';

export const INITIAL_WORKSPACES: ProjectWorkspace[] = [
  {
    id: 'ws-1',
    name: 'Growth & Core Operations',
    description: 'Workspace for scaling AI lead generation, competitor intelligence, and automated social outreach.',
    agentCount: 4,
    workflowCount: 3,
    collaborators: ['zenieverse@gmail.com', 'alex@ownworks.ai', 'sarah.k@ownworks.ai']
  },
  {
    id: 'ws-2',
    name: 'Engineering & DevOps Guard',
    description: 'System for running local AI agents checking compliance, reviewing code, and running testing swarms.',
    agentCount: 3,
    workflowCount: 2,
    collaborators: ['zenieverse@gmail.com', 'dave.dev@ownworks.ai']
  }
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: 'ScoutPro',
    role: 'Market Researcher',
    description: 'Scrapes specified web pages, aggregates market trends, and outputs organized research markdown summaries.',
    status: 'idle',
    avatar: '🔍',
    goal: 'Gather highly accurate, structured global market indicators and competitor telemetry.',
    systemPrompt: 'You are ScoutPro, a high-speed web browsing and analysis agent. Your outputs are objective, richly detailed, and clean markdown.',
    tools: ['Google Search', 'Web Scraper', 'CSV Downloader'],
    memoryScope: 'long',
    runtime: 'cloud',
    autonomyLevel: 85,
    tokenUsage: 124500,
    recentActivity: [
      'Scraped tech crunch for AI startup funding lists.',
      'Extracted product details from competitor page.',
      'Consolidated SaaS pricing benchmark sheet.'
    ]
  },
  {
    id: 'agent-2',
    name: 'Gemma Spark',
    role: 'Planner & Orchestrator',
    description: 'Creates itemized execution checklists and assigns micro-tasks to other specialized agents.',
    status: 'idle',
    avatar: '⚡',
    goal: 'Deconstruct complex high-level user tasks into sequential workflow execution blocks.',
    systemPrompt: 'You are Gemma Spark, running on local hardware. You think in a structured, step-by-step fashion. You coordinate beautifully with other agents.',
    tools: ['Task Creator', 'Agent Swarm Messenger'],
    memoryScope: 'short',
    runtime: 'local',
    autonomyLevel: 70,
    tokenUsage: 45000,
    recentActivity: [
      'Decomposed outreach campaign into 4 sub-tasks.',
      'Assigned copy writing task to CopyScribe agent.',
      'Verified trigger output for Outreach Webhook event.'
    ]
  },
  {
    id: 'agent-3',
    name: 'CopyScribe',
    role: 'Content Coder & Writer',
    description: 'Generates high-conversion outreach emails, documentation pages, or technical code blocks.',
    status: 'idle',
    avatar: '✍️',
    goal: 'Draft exceptional text, documentation, or code based on structural templates.',
    systemPrompt: 'You are CopyScribe, an elite copywriter and software engineer. You deliver premium-grade content that blends technical depth with high readability.',
    tools: ['Code Compiler', 'File Creator', 'GitHub Connector'],
    memoryScope: 'unlimited',
    runtime: 'cloud',
    autonomyLevel: 90,
    tokenUsage: 258300,
    recentActivity: [
      'Drafted cold outreach personalized email sequence.',
      'Created index.html structural components.',
      'Committed bug fix in branch patch-102.'
    ]
  },
  {
    id: 'agent-4',
    name: 'LocalLlama Guard',
    role: 'Security & Compliance Analyst',
    description: 'Performs local audits on code, inputs, and documents to ensure no data leaks or policy violations occur.',
    status: 'idle',
    avatar: '🛡️',
    goal: 'Examine outputs for PII, API secrets, regulatory compliance, and potential security vulnerabilities locally.',
    systemPrompt: 'You are LocalLlama Guard, a strictly private, local audit agent. Your role is safeguarding enterprise security without sending data to cloud servers.',
    tools: ['PII Masker', 'Dependency Vulnerability Scanner'],
    memoryScope: 'short',
    runtime: 'local',
    autonomyLevel: 95,
    tokenUsage: 89000,
    recentActivity: [
      'Audited generated code block for embedded secrets.',
      'Masked personal email addresses from spreadsheet upload.',
      'Scanned security criteria for deployment node.'
    ]
  }
];

export const INITIAL_WORKFLOWS: {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  status: 'active' | 'inactive';
}[] = [
  {
    id: 'wf-1',
    name: 'Lead Enrichment & Target Cold Campaign',
    description: 'Triggers on Webhook, runs web research via ScoutPro, drafts high-personalization copy using CopyScribe, and emails via Gmail.',
    status: 'active',
    nodes: [
      { id: 'n-1', type: 'trigger', label: 'Inbound Webhook Trigger', status: 'success', config: { hookUrl: 'https://api.ownworks.io/v1/hooks/inbound' }, position: { x: 50, y: 150 } },
      { id: 'n-2', type: 'agent', label: 'Agent: ScoutPro (Researcher)', status: 'idle', agentId: 'agent-1', config: { depth: 'detailed' }, position: { x: 260, y: 150 } },
      { id: 'n-3', type: 'agent', label: 'Agent: CopyScribe (Writer)', status: 'idle', agentId: 'agent-3', config: { tone: 'professional' }, position: { x: 470, y: 150 } },
      { id: 'n-4', type: 'email', label: 'Gmail Outreach Dispatch', status: 'idle', config: { to: '{{recipient.email}}' }, position: { x: 680, y: 150 } }
    ],
    edges: [
      { id: 'e-1', source: 'n-1', target: 'n-2', animated: true },
      { id: 'e-2', source: 'n-2', target: 'n-3' },
      { id: 'e-3', source: 'n-3', target: 'n-4' }
    ]
  },
  {
    id: 'wf-2',
    name: 'Local Security Audit & Commit Approval',
    description: 'Triggers on a scheduler, scans workspace for file changes, audits locally with Llama Guard, and alerts on Slack on safety pass.',
    status: 'inactive',
    nodes: [
      { id: 'n-2-1', type: 'scheduler', label: 'Every 2 Hours Cron', status: 'idle', config: { cron: '0 */2 * * *' }, position: { x: 50, y: 120 } },
      { id: 'n-2-2', type: 'webhook', label: 'Git Pull Request Trigger', status: 'idle', config: { repo: 'ownworks/web-app' }, position: { x: 50, y: 220 } },
      { id: 'n-2-3', type: 'agent', label: 'Agent: LocalLlama Guard (Local Audit)', status: 'idle', agentId: 'agent-4', config: { strictness: 'high' }, position: { x: 300, y: 170 } },
      { id: 'n-2-4', type: 'approval', label: 'Manual Human Review Gate', status: 'idle', config: { reviewer: 'zenieverse@gmail.com' }, position: { x: 540, y: 170 } },
      { id: 'n-2-5', type: 'api', label: 'Slack Warning Dispatch', status: 'idle', config: { channel: '#security' }, position: { x: 750, y: 170 } }
    ],
    edges: [
      { id: 'e-2-1', source: 'n-2-1', target: 'n-2-3' },
      { id: 'e-2-2', source: 'n-2-2', target: 'n-2-3' },
      { id: 'e-2-3', source: 'n-2-3', target: 'n-2-4' },
      { id: 'e-2-4', source: 'n-2-4', target: 'n-2-5' }
    ]
  }
];

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    type: 'project',
    content: 'OwnWorks target release date for beta is July 2026. The dev environment hosted in Google Cloud Run proxies its client connections to port 3000.',
    score: 9,
    tags: ['timeline', 'cloud-run', 'infra'],
    timestamp: '2026-05-21T18:30:00Z'
  },
  {
    id: 'mem-2',
    type: 'user',
    content: 'Primary contact creator wishes to run private Llama 3 models on Ollama (port 11434 local) to preserve complete structural code confidentiality.',
    score: 8,
    tags: ['user-preference', 'ollama', 'privacy'],
    timestamp: '2026-05-22T02:15:00Z'
  },
  {
    id: 'mem-3',
    type: 'team',
    content: 'Ensure all outbound API requests adhere strictly to RBAC scopes. zenieverse@gmail.com possesses root ownership clearance.',
    score: 10,
    tags: ['rbac', 'security', 'auth'],
    timestamp: '2026-05-22T04:00:00Z'
  },
  {
    id: 'mem-4',
    type: 'agent',
    content: 'ScoutPro observed that competitor pricing ranges from $49/mo (Starter) to $299/mo (Enterprise Tier). Updated agent benchmark metrics accordingly.',
    score: 7,
    tags: ['competitor-caps', 'pricing-trends', 'scoutpro'],
    timestamp: '2026-05-22T04:15:00Z'
  }
];

export const INITIAL_INTEGRATIONS: Integration[] = [
  { id: 'github', name: 'GitHub Enterprise', iconName: 'github', category: 'developer', connected: true, description: 'Triggers workflows on Pull Requests, commits files, and creates issues.', usageDocs: 'Configure webhook triggers & OAuth repository read/write access token scopes.' },
  { id: 'slack', name: 'Slack Workplace', iconName: 'slack', category: 'communication', connected: true, description: 'Allows agents to broadcast real-time events, ping users, or query status via Slack commands.', usageDocs: 'Uses Bot User OAuth token scopes: chat:write, channels:read, commands.' },
  { id: 'notion', name: 'Notion Workspace', iconName: 'notion', category: 'productivity', connected: false, description: 'Gives agents the power to append items to checklists or read engineering notebooks.', usageDocs: 'Requires Notion Integration Token with read/write access to selected databases.' },
  { id: 'gmail', name: 'Google Gmail Service', iconName: 'mail', category: 'productivity', connected: true, description: 'Dispatches high-conversion cold outreach campaigns and categorizes inbox emails.', usageDocs: 'Requires Gmail API Scopes for sending drafts or parsing inbox mail.' },
  { id: 'discord', name: 'Discord Dev Server', iconName: 'discord', category: 'communication', connected: false, description: 'Connects swarms to client Discord channels for direct telemetry notification and feedback.' },
  { id: 'supabase', name: 'Supabase Database', iconName: 'database', category: 'database', connected: false, description: 'Integrates persistent vector storage tables and user data tables for secure long-term queries.' },
  { id: 'stripe', name: 'Stripe Payments', iconName: 'credit-card', category: 'payment', connected: false, description: 'Triggers subscription status webhooks, monitors customers, and sets billing events.' }
];

export const MOCK_ACTIVITY: ActivityEvent[] = [
  { id: 'act-1', timestamp: '2026-05-22T04:18:22Z', type: 'info', message: 'Inbound webhook parsed successfully. Initiated target outreach analysis.', agentName: 'Webhook Engine', latency: 45 },
  { id: 'act-2', timestamp: '2026-05-22T04:18:25Z', type: 'info', message: 'ScoutPro initiated detailed Google Search lookup for "SaaS pricing trends 2026".', agentName: 'ScoutPro', latency: 450, tokensUsed: 1240 },
  { id: 'act-3', timestamp: '2026-05-22T04:18:32Z', type: 'success', message: 'Scraped 4 competitor domains and compiled vector-relevant benchmark.', agentName: 'ScoutPro', latency: 1800, tokensUsed: 4320 },
  { id: 'act-4', timestamp: '2026-05-22T04:18:35Z', type: 'info', message: 'Assigned text synthesis tasks to CopyScribe with custom benchmark parameters.', agentName: 'Gemma Spark', latency: 120 },
  { id: 'act-5', timestamp: '2026-05-22T04:19:01Z', type: 'success', message: 'Outreach campaign structural draft finalized and passed security audit.', agentName: 'CopyScribe', latency: 1100, tokensUsed: 3100 },
  { id: 'act-6', timestamp: '2026-05-22T04:19:05Z', type: 'success', message: 'Outgoing Gmail pipeline successfully delivered 12 personalized pitches.', agentName: 'Mail Engine', latency: 530 },
  { id: 'act-7', timestamp: '2026-05-22T04:20:10Z', type: 'info', message: 'Local model Ollama connected successfully on localhost:11434. Gemma GPU profile updated.', agentName: 'Local Engine', latency: 12 }
];
