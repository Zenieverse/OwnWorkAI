export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  status: 'idle' | 'thinking' | 'executing' | 'offline';
  avatar: string;
  goal: string;
  systemPrompt: string;
  tools: string[];
  memoryScope: 'short' | 'long' | 'unlimited';
  runtime: 'cloud' | 'local';
  autonomyLevel: number; // 0 - 100
  tokenUsage: number;
  recentActivity: string[];
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'agent' | 'api' | 'webhook' | 'condition' | 'memory' | 'email' | 'approval' | 'scheduler';
  label: string;
  status: 'idle' | 'running' | 'success' | 'error';
  agentId?: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface MemoryItem {
  id: string;
  type: 'user' | 'project' | 'agent' | 'team';
  content: string;
  score: number; // Importance (1-10)
  tags: string[];
  timestamp: string;
}

export interface Integration {
  id: string;
  name: string;
  iconName: string;
  category: 'productivity' | 'developer' | 'database' | 'communication' | 'payment';
  connected: boolean;
  description: string;
  usageDocs?: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  agentName: string;
  latency?: number;
  tokensUsed?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  agentId?: string;
  thinkingSteps?: string[];
  toolCalls?: {
    name: string;
    params: string;
    status: 'pending' | 'success' | 'failed';
    output?: string;
  }[];
}

export interface ProjectWorkspace {
  id: string;
  name: string;
  description: string;
  agentCount: number;
  workflowCount: number;
  collaborators: string[];
}
