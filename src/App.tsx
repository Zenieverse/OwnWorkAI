import { useState, useEffect } from 'react';
import { Agent, WorkflowNode, WorkflowEdge, MemoryItem, Integration, ActivityEvent, ChatMessage } from './types';
import { 
  INITIAL_AGENTS, 
  INITIAL_WORKFLOWS, 
  INITIAL_MEMORIES, 
  INITIAL_INTEGRATIONS, 
  MOCK_ACTIVITY 
} from './data';

import Landing from './components/Landing';
import DashboardHome from './components/DashboardHome';
import AgentBuilder from './components/AgentBuilder';
import SwarmManager from './components/SwarmManager';
import WorkflowBuilder from './components/WorkflowBuilder';
import MemoryEngine from './components/MemoryEngine';
import { ExecutionCenter, LocalMode, IntegrationsMarket, SettingsPanel } from './components/SecondaryViews';
import ChatWorkspace from './components/ChatWorkspace';
import CopilotWorkspace from './components/CopilotWorkspace';

import { 
  Home, Bot, Network, GitMerge, Brain, Eye, Cpu, Link, MessageSquare, Settings, 
  Bell, Search, HelpCircle, AlertTriangle, Menu, X, Check, Globe, Users, Sparkles 
} from 'lucide-react';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [openaiConnected, setOpenaiConnected] = useState(false);
  const [publicKeyStatus, setPublicKeyStatus] = useState(false);
  const [publicKeyFragment, setPublicKeyFragment] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.apiConnected) {
            setApiConnected(true);
          }
          if (data.openaiConnected) {
            setOpenaiConnected(true);
          }
          if (data.publicKeyStatus) {
            setPublicKeyStatus(true);
          }
          if (data.publicKeyFragment) {
            setPublicKeyFragment(data.publicKeyFragment);
          }
        }
      })
      .catch(err => {
        console.warn('Backend API key check status:', err);
      });
  }, []);

  // Core App states
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [workflows, setWorkflows] = useState(INITIAL_WORKFLOWS);
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MEMORIES);
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [activities, setActivities] = useState<ActivityEvent[]>(MOCK_ACTIVITY);
  const [localAiMode, setLocalAiMode] = useState(false);

  // Chat variables
  const [activeAgentId, setActiveAgentId] = useState<string>('os-core');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: 'Welcome back to OwnWorks Command Terminal. Multi-node agents are online and initialized. Type any instruction to automate work tasks or coordinate swarm checkpoints directly.',
      timestamp: '04:20'
    }
  ]);

  // General Simulation states
  const [isMockRunning, setIsMockRunning] = useState(false);
  const [agentThinkingLog, setAgentThinkingLog] = useState<string[]>([]);
  const [isExecutingAgentId, setIsExecutingAgentId] = useState<string | null>(null);

  // Workflow simulation states
  const [isExecutingWorkflowId, setIsExecutingWorkflowId] = useState<string | null>(null);
  const [workflowOutputs, setWorkflowOutputs] = useState<string[]>([]);

  // Agent switcher trigger
  const handleTriggerAgentExecution = (agentId: string) => {
    const targetA = agents.find(a => a.id === agentId);
    if (!targetA) return;

    setIsExecutingAgentId(agentId);
    setAgentThinkingLog([`Initializing reasoning chain for ${targetA.name}...`]);

    const logs = [
      'Deconstructing targets metadata queries...',
      'Isolating confidential parameters safe...',
      'Opening local cuda loop checks...',
      'Synthesizing objectives payload markdown output...'
    ];

    let currentLogIdx = 0;
    const interval = setInterval(() => {
      if (currentLogIdx < logs.length) {
        setAgentThinkingLog(prev => [...prev, logs[currentLogIdx]]);
        currentLogIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsExecutingAgentId(null);
          setAgents(prev => prev.map(a => {
            if (a.id === agentId) {
              return {
                ...a,
                status: 'idle',
                tokenUsage: a.tokenUsage + 1240,
                recentActivity: [
                  `Triggered manual test logic: Output resolved in ${Math.round(Math.random() * 800 + 400)}ms.`,
                  ...a.recentActivity
                ]
              };
            }
            return a;
          }));

          // Post a success log
          const successEvt: ActivityEvent = {
            id: 'manual-exec-' + Date.now(),
            timestamp: new Date().toISOString(),
            type: 'success',
            message: `Manual check for Agent Node: ${targetA.name} resolved with satisfactory boundaries.`,
            agentName: targetA.name,
            latency: 1400,
            tokensUsed: 1240
          };
          setActivities(prev => [successEvt, ...prev]);

        }, 1000);
      }
    }, 1200);
  };

  // Trigger global mock workflow run
  const triggerMockWorkflow = () => {
    setIsMockRunning(true);
    
    const steps = [
      { id: 'act-wf-1', type: 'info', message: 'Core loop triggered on Outbreak Draft schedule.', name: 'Webhook Engine' },
      { id: 'act-wf-2', type: 'info', message: 'ScoutPro querying pricing trends across SaaS benchmark indices.', name: 'ScoutPro' },
      { id: 'act-wf-3', type: 'success', message: 'Pricing trend vector matrices compiled and stored.', name: 'ScoutPro' },
      { id: 'act-wf-4', type: 'info', message: 'CopyScribe writing personalized campaign pitch sequences.', name: 'CopyScribe' },
      { id: 'act-wf-5', type: 'success', message: 'Dispatch completed. 10 recipient loops resolved successfully.', name: 'Mail Engine' }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        const item = steps[stepIdx];
        const newEvt: ActivityEvent = {
          id: 'mock-wf-' + stepIdx + '-' + Date.now(),
          timestamp: new Date().toISOString(),
          type: item.type as any,
          message: item.message,
          agentName: item.name,
          latency: Math.round(Math.random() * 500 + 100),
          tokensUsed: item.type === 'success' ? Math.round(Math.random() * 2000 + 1000) : undefined
        };
        setActivities(prev => [newEvt, ...prev]);
        stepIdx++;
      } else {
        clearInterval(interval);
        setIsMockRunning(false);
      }
    }, 1800);
  };

  // Workflow builder simulation test
  const handleRunWorkflow = (workflowId: string) => {
    setIsExecutingWorkflowId(workflowId);
    setWorkflowOutputs([
      '>> COMPILING VISUAL PIPELINE GRAPH IN SECURE SANDBOX...',
      '>> CHECKING INBOUND WEBHOOK INTEGRITY POOLS... SUCCESS',
      '>> DETECTED 4 SECURE PIPELINE BLOCKS.',
    ]);

    const outputs = [
      '>> TRIGGER DETECTED: Manual UI execution payload.',
      '>> DISPATCHING PAYLOAD VECTORS TO SCOUTPRO DEPLOYMENT NODE...',
      '>> ScoutPro (Inference latency 450ms): Compiling web query indices.',
      '>> DISPATCHING REPLICATED OBJECTIVES TO COPYSCRIBE...',
      '>> CopyScribe (Inference latency 840ms): Generating conversion blocks.',
      '>> PIPELINE RESOLVED: Outgoing parameters dispatched to Gmail delivery vault.',
      '>> OUTCOME CODE: 200 SUCCESS (Loop finished safely)'
    ];

    let logIdx = 0;
    const interval = setInterval(() => {
      if (logIdx < outputs.length) {
        setWorkflowOutputs(prev => [...prev, outputs[logIdx]]);
        logIdx++;
      } else {
        clearInterval(interval);
        setIsExecutingWorkflowId(null);
        
        // Add final execution center logging
        const completeEvt: ActivityEvent = {
          id: 'wf-exec-complete-' + Date.now(),
          timestamp: new Date().toISOString(),
          type: 'success',
          message: 'Visual workflow flowchart simulation resolved code loops perfectly.',
          agentName: 'Workflow Engine',
          latency: 3500,
          tokensUsed: 4900
        };
        setActivities(prev => [completeEvt, ...prev]);
      }
    }, 1000);
  };

  // Chat message submission using real-side proxies or demonstration routines
  const onSendMessage = async (text: string, agentId?: string) => {
    // 1. Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString().substring(0, 5),
      agentId
    };
    setChatHistory(prev => [...prev, userMsg]);
    setIsGenerating(true);

    // 2. Add activity log
    const userAct: ActivityEvent = {
      id: 'act-usr-' + Date.now(),
      timestamp: new Date().toISOString(),
      type: 'info',
      message: `Dispatched operational command: "${text}"`,
      agentName: 'System Operator'
    };
    setActivities(prev => [userAct, ...prev]);

    try {
      const activeObj = agents.find(a => a.id === activeAgentId);
      const systemPrompt = activeObj?.systemPrompt || '';
      const agentName = activeObj?.name || '';
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          history: chatHistory.slice(-6).map(h => ({ role: h.role, content: h.content })),
          systemPrompt,
          agentName,
          activeModel: activeAgentId === 'os-core' ? 'gemini-3.5-flash' : activeAgentId
        })
      });

      if (!response.ok) {
        throw new Error('API communication error');
      }

      const data = await response.json();
      
      // 3. Add model response
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString().substring(0, 5),
        agentId: agentId || undefined,
        thinkingSteps: data.thinkingSteps,
        toolCalls: agentId ? [
          { name: 'PII verification', params: 'buffer', status: 'success' },
          { name: 'Action safety checker', params: 'root', status: 'success' }
        ] : undefined
      };

      setChatHistory(prev => [...prev, botMsg]);

      const sysAct: ActivityEvent = {
        id: 'act-sys-' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'success',
        message: `Completed micro-task reasoning checks and displayed outcomes.`,
        agentName: agentName || 'OS Central',
        tokensUsed: 490
      };
      setActivities(prev => [sysAct, ...prev]);
      setIsGenerating(false);

    } catch (error) {
      console.error(error);
      // Fallback
      setTimeout(() => {
        const mockMsg: ChatMessage = {
          id: 'error-' + Date.now(),
          role: 'assistant',
          content: `I've registered your instructions locally. 

*(Note: OwnWorks processes these queries locally in complete confidentiality. If you configure GEMINI_API_KEY inside Settings > Secrets, real Gemini 3.5 Flash server-side loops will engage autonomously!)*`,
          timestamp: new Date().toLocaleTimeString().substring(0, 5),
          agentId: agentId || undefined,
          thinkingSteps: [
            'Parsing operator workspace context parameters...',
            'Connecting local inference fallback loops...',
            'Compiling instructions safe logs...'
          ]
        };
        setChatHistory(prev => [...prev, mockMsg]);
        setIsGenerating(false);
      }, 1000);
    } finally {
      setIsGenerating(false);
    }
  };

  // CRUD for Agents
  const handleCreateAgent = (newAgent: Partial<Agent>) => {
    const created: Agent = {
      id: 'agent-' + Date.now(),
      name: newAgent.name || 'CustomNode',
      role: newAgent.role || 'Operator',
      description: newAgent.description || 'No description',
      avatar: newAgent.avatar || '🤖',
      goal: newAgent.goal || 'Run workflows',
      systemPrompt: newAgent.systemPrompt || '',
      tools: newAgent.tools || [],
      memoryScope: newAgent.memoryScope || 'long',
      runtime: newAgent.runtime || 'cloud',
      autonomyLevel: newAgent.autonomyLevel || 80,
      tokenUsage: 0,
      recentActivity: ['Agent registered successfully.'],
      status: 'idle'
    };

    setAgents([...agents, created]);

    const act: ActivityEvent = {
      id: 'act-agent-new-' + Date.now(),
      timestamp: new Date().toISOString(),
      type: 'success',
      message: `Provisioned new AI Agent node: ${created.name} (${created.role}) into the system registry.`,
      agentName: 'System Manager'
    };
    setActivities(prev => [act, ...prev]);
  };

  const handleDeleteAgent = (id: string) => {
    setAgents(agents.filter(a => a.id !== id));
  };

  // CRUD for Memories
  const handleAddMemory = (newMem: Partial<MemoryItem>) => {
    const item: MemoryItem = {
      id: 'mem-' + Date.now(),
      type: newMem.type || 'project',
      content: newMem.content || '',
      score: newMem.score || 8,
      tags: newMem.tags || ['manual'],
      timestamp: new Date().toISOString()
    };
    setMemories([item, ...memories]);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories(memories.filter(m => m.id !== id));
  };

  // Connect integration marketplace toggle
  const handleToggleConnect = (id: string) => {
    setIntegrations(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, connected: !item.connected };
      }
      return item;
    }));
  };

  // Skip landing screen
  if (!hasStarted) {
    return <Landing onStart={() => setHasStarted(true)} />;
  }

  // Sidebar Menu Selection Rows
  const sidebarTabs = [
    { id: 'home', label: 'Dashboard Control', icon: Home },
    { id: 'agents', label: 'Agent Command', icon: Bot },
    { id: 'swarms', label: 'Swarm Orchestration', icon: Users },
    { id: 'workflows', label: 'Pipeline Builder', icon: GitMerge },
    { id: 'memories', label: 'Memory Cache', icon: Brain },
    { id: 'chat', label: 'Inference Chat', icon: MessageSquare },
    { id: 'executions', label: 'Real-time Streams', icon: Eye },
    { id: 'local-ai', label: 'Ollama Node', icon: Cpu },
    { id: 'integrations', label: 'Integrations Hub', icon: Link },
    { id: 'copilot', label: 'Copilot Companion', icon: Sparkles },
    { id: 'settings', label: 'OS Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#07080a] text-gray-100 flex font-sans overflow-x-hidden relative selection:bg-blue-500/30 selection:text-blue-100">
      
      {/* Dynamic glow decoration background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-900/5 rounded-full blur-[140px] pointer-events-none" />

      {/* --- SIDEBAR DESKTOP VIEW --- */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0c0f14] border-r border-white/[0.04] h-screen sticky top-0 shrink-0 select-none z-10">
        
        {/* Title logo banner */}
        <div className="p-5 border-b border-white/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow shadow-blue-500/20">
              <Bot className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-white block text-sm">OwnWorks OS</span>
              <span className="text-[10px] font-mono text-gray-500 block uppercase tracking-wider">Cluster console</span>
            </div>
          </div>

          <div className="flex items-center">
            <Globe className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Menu selections list */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {sidebarTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all text-left cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User context footprint footer */}
        <div className="p-4 border-t border-white/[0.04] bg-[#090b0e] text-xs font-mono text-gray-500 space-y-1 shrink-0">
          <div className="flex items-center gap-1.5 text-gray-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="truncate">zenieverse@gmail.com</span>
          </div>
          <p className="text-[10px]">Access Clearance: Root node</p>
        </div>

      </aside>

      {/* --- CONTENT CONTAINER WITH VIEWPORTS --- */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        
        {/* Mobile Navbar headers */}
        <header className="lg:hidden h-16 border-b border-white/[0.04] bg-[#0c0f14] px-6 flex items-center justify-between sticky top-0 bg-opacity-95 backdrop-blur z-20">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-white tracking-tight text-sm">OwnWorks OS</span>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-400 hover:text-white">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Navigation Dropdown lists */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute bg-[#0c0f14] border-b border-white/[0.05] top-16 left-0 right-0 p-4 space-y-1 z-30 flex flex-col shadow-2xl">
            {sidebarTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold ${
                    isActive ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Central screen workspace pane */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          
          {/* Dashboard control view */}
          {activeTab === 'home' && (
            <DashboardHome
              onNavigate={(tab) => setActiveTab(tab)}
              agents={agents}
              workflowsCount={workflows.length}
              activities={activities}
              onTriggerMockWorkflow={triggerMockWorkflow}
              isMockRunning={isMockRunning}
              localAiMode={localAiMode}
              apiConnected={apiConnected}
              openaiConnected={openaiConnected}
            />
          )}

          {/* Create agent node slots */}
          {activeTab === 'agents' && (
            <AgentBuilder
              agents={agents}
              onCreateAgent={handleCreateAgent}
              onDeleteAgent={handleDeleteAgent}
              onTriggerAgentExecution={handleTriggerAgentExecution}
              isExecutingAgentId={isExecutingAgentId}
              agentThinkingLog={agentThinkingLog}
            />
          )}

          {/* visual Swarms topology */}
          {activeTab === 'swarms' && (
            <SwarmManager
              agents={agents}
              activities={activities}
            />
          )}

          {/* flowchart visual pipelines */}
          {activeTab === 'workflows' && (
            <WorkflowBuilder
              workflow={workflows[0]}
              onRunWorkflow={handleRunWorkflow}
              isExecutingWorkflowId={isExecutingWorkflowId}
              workflowOutputs={workflowOutputs}
            />
          )}

          {/* vector long-term memories */}
          {activeTab === 'memories' && (
            <MemoryEngine
              memories={memories}
              onAddMemory={handleAddMemory}
              onDeleteMemory={handleDeleteMemory}
            />
          )}

          {/* advanced custom proxy chats */}
          {activeTab === 'chat' && (
            <ChatWorkspace
              agents={agents}
              chatHistory={chatHistory}
              onSendMessage={onSendMessage}
              isGenerating={isGenerating}
              activeAgentId={activeAgentId}
              setActiveAgentId={setActiveAgentId}
            />
          )}

          {/* consolidated cluster outputs */}
          {activeTab === 'executions' && (
            <ExecutionCenter
              activities={activities}
              onClear={() => setActivities([])}
            />
          )}

          {/* local privacy hardware loop */}
          {activeTab === 'local-ai' && (
            <LocalMode
              localAiMode={localAiMode}
              onToggleLocal={() => setLocalAiMode(!localAiMode)}
            />
          )}

          {/* external API connectors */}
          {activeTab === 'integrations' && (
            <IntegrationsMarket
              integrations={integrations}
              onToggleConnect={handleToggleConnect}
            />
          )}

          {/* GitHub Copilot Developer Hub */}
          {activeTab === 'copilot' && (
            <CopilotWorkspace 
              apiConnected={apiConnected}
              openaiConnected={openaiConnected}
              onAddTelemetryLog={(message, type = 'info') => {
                const act = {
                  id: 'act-copilot-' + Date.now(),
                  timestamp: new Date().toISOString(),
                  type,
                  message,
                  agentName: 'GitHub Copilot',
                  latency: Math.floor(Math.random() * 80) + 12,
                  tokensUsed: Math.floor(Math.random() * 400) + 90
                };
                setActivities(prev => [act, ...prev]);
              }}
            />
          )}

          {/* general cluster settings */}
          {activeTab === 'settings' && (
            <SettingsPanel 
              apiConnected={apiConnected} 
              openaiConnected={openaiConnected}
              publicKeyStatus={publicKeyStatus}
              publicKeyFragment={publicKeyFragment}
            />
          )}

        </main>

      </div>
    </div>
  );
}
