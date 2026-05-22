import React, { useState } from 'react';
import { Agent } from '../types';
import { Plus, Check, ShieldCheck, HelpCircle, HardDrive, Cpu, Terminal, Sliders, Play, Trash2, Edit3 } from 'lucide-react';

interface AgentBuilderProps {
  agents: Agent[];
  onCreateAgent: (agent: Partial<Agent>) => void;
  onDeleteAgent: (id: string) => void;
  onTriggerAgentExecution: (agentId: string) => void;
  isExecutingAgentId: string | null;
  agentThinkingLog: string[];
}

export default function AgentBuilder({
  agents,
  onCreateAgent,
  onDeleteAgent,
  onTriggerAgentExecution,
  isExecutingAgentId,
  agentThinkingLog
}: AgentBuilderProps) {
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(agents[0]?.id || null);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [runtime, setRuntime] = useState<'cloud' | 'local'>('cloud');
  const [autonomyLevel, setAutonomyLevel] = useState(80);
  const [memoryScope, setMemoryScope] = useState<'short' | 'long' | 'unlimited'>('long');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const availableTools = [
    'Google Search',
    'Web Scraper',
    'CSV Downloader',
    'Task Creator',
    'File Creator',
    'GitHub Connector',
    'PII Masker',
    'Slack Bot Dispatcher'
  ];

  const handleToolToggle = (tool: string) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter(t => t !== tool));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;

    onCreateAgent({
      name,
      role,
      description: description || 'No description provided.',
      goal: goal || 'Determine targets optimally.',
      systemPrompt: systemPrompt || 'You are an autonomous agent.',
      runtime,
      autonomyLevel,
      memoryScope,
      tools: selectedTools.length > 0 ? selectedTools : ['Google Search'],
      avatar: runtime === 'local' ? '👤' : '🤖',
      status: 'idle',
      recentActivity: ['Agent customized and registered into cluster.'],
      tokenUsage: 0
    });

    // Reset Form
    setName('');
    setRole('');
    setDescription('');
    setGoal('');
    setSystemPrompt('');
    setRuntime('cloud');
    setAutonomyLevel(80);
    setMemoryScope('long');
    setSelectedTools([]);
    setShowCreateForm(false);
  };

  const activeAgent = agents.find(a => a.id === selectedAgentId);

  return (
    <div id="agent-builder-panel" className="space-y-6">
      
      {/* View Header */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">AI Agent Command Center</h2>
          <p className="text-xs text-gray-400 mt-1">
            Build, provision, and launch individual task nodes fitted with customized prompts, private constraints, and APIs.
          </p>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Agent Node</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: List of existing agents */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Create Form inline card */}
          {showCreateForm && (
            <div className="bg-[#0b0e12] border border-blue-500/30 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
                <h3 className="text-sm font-semibold text-white">Create Custom Agent Node</h3>
                <button onClick={() => setShowCreateForm(false)} className="text-xs text-gray-500 hover:text-white">Cancel</button>
              </div>

              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">Agent Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. OutreachScout"
                    className="w-full bg-[#050608] border border-white/[0.06] rounded p-2 text-xs text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">Agent Role / Specialty *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="e.g. Lead Generation Web-Scraper"
                    className="w-full bg-[#050608] border border-white/[0.06] rounded p-2 text-xs text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">Objective / Goal Description</label>
                  <input
                    type="text"
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    placeholder="e.g. Search and isolate competitor pricing variables securely"
                    className="w-full bg-[#050608] border border-white/[0.06] rounded p-2 text-xs text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">System Instructions / Prompt</label>
                  <textarea
                    rows={3}
                    value={systemPrompt}
                    onChange={e => setSystemPrompt(e.target.value)}
                    placeholder="Provide guidelines, personality directives, and syntax restrictions..."
                    className="w-full bg-[#050608] border border-white/[0.06] rounded p-2 text-xs text-white focus:border-blue-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">Execution Runtime</label>
                  <select
                    value={runtime}
                    onChange={e => setRuntime(e.target.value as any)}
                    className="w-full bg-[#050608] border border-white/[0.06] rounded p-2 text-xs text-white outline-none"
                  >
                    <option value="cloud">Cloud Grid (Gemini 3.5 Flash)</option>
                    <option value="local">Private Local Hardware (Ollama Gemma)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">Memory Depth Scope</label>
                  <select
                    value={memoryScope}
                    onChange={e => setMemoryScope(e.target.value as any)}
                    className="w-full bg-[#050608] border border-white/[0.06] rounded p-2 text-xs text-white outline-none"
                  >
                    <option value="short">Short Temporal Buffers (volatile)</option>
                    <option value="long">Vector Database Recall (pgvector)</option>
                    <option value="unlimited">Unlimited Infinite Context Sync</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-mono uppercase text-gray-400 mb-2">Configure Agent Tool Rights</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableTools.map(tool => (
                      <label key={tool} className="flex items-center gap-2 p-2 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] rounded cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedTools.includes(tool)}
                          onChange={() => handleToolToggle(tool)}
                          className="rounded border-white/[0.06] bg-[#050608] text-blue-500 text-xs focus:ring-0"
                        />
                        <span className="text-[10px] text-gray-300 font-mono">{tool}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-mono uppercase text-gray-400">Autonomy Threshold ({autonomyLevel}%)</label>
                    <span className="text-[10px] text-gray-500">Determines loop limit without human gate</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={autonomyLevel}
                    onChange={e => setAutonomyLevel(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/[0.04] rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded transition-all cursor-pointer"
                  >
                    Assemble Agent Node
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Agents grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map(agent => (
              <div
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedAgentId === agent.id
                    ? 'bg-[#0f131a] border-blue-500'
                    : 'bg-[#0b0e12] border-white/[0.04] hover:bg-white/[0.01]'
                }`}
              >
                <div>
                  {/* Top line with avatar and runtime status badge */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl w-10 h-10 rounded-lg bg-white/[0.03] flex items-center justify-center border border-white/[0.05]">
                        {agent.avatar}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{agent.name}</h4>
                        <span className="text-[11px] text-blue-400 font-mono">{agent.role}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono uppercase ${
                        agent.status === 'thinking' || agent.status === 'executing'
                          ? 'bg-amber-500/10 text-amber-400 animate-pulse'
                          : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {agent.status}
                      </span>
                      <span className={`text-[8px] font-mono uppercase tracking-widest px-1 py-0.2 px-1.5 rounded-full ${
                        agent.runtime === 'local' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-blue-500/15 text-blue-300'
                      }`}>
                        {agent.runtime}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-3 leading-relaxed line-clamp-2">
                    {agent.description}
                  </p>

                  {/* List tools configured */}
                  <div className="flex flex-wrap gap-1 mt-4">
                    {agent.tools.map((t, idx) => (
                      <span key={idx} className="text-[9px] bg-white/[0.03] border border-white/[0.04] px-1.5 py-0.5 rounded text-gray-400 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-gray-500">
                  <span>Usage: {(agent.tokenUsage / 1000).toFixed(1)}k tokens</span>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTriggerAgentExecution(agent.id);
                      }}
                      disabled={isExecutingAgentId !== null}
                      className="p-1 px-2 hover:bg-blue-500/10 rounded text-blue-400 font-semibold text-[10px] flex items-center gap-1 hover:text-blue-300 pointer-events-auto"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Test Action</span>
                    </button>

                    {agents.length > 2 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteAgent(agent.id);
                        }}
                        className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Reasoning inspect timeline */}
        <div className="lg:col-span-4 space-y-6">
          {activeAgent ? (
            <div className="bg-[#0b0e12] border border-white/[0.04] p-5 rounded-xl flex flex-col justify-between h-full">
              
              <div>
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 mb-4">
                  <h3 className="text-sm font-semibold text-white">Diagnostics Log: {activeAgent.name}</h3>
                  <Terminal className="w-4 h-4 text-gray-500" />
                </div>

                {/* Agent static parameters */}
                <div className="space-y-3 pb-4 border-b border-white/[0.04]">
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">CORE OBJECTIVE</span>
                    <p className="text-xs text-gray-300 mt-1">{activeAgent.goal}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">SYSTEM INSTRUCTION PROMPT</span>
                    <div className="text-[10px] bg-[#050608] border border-white/[0.04] text-gray-400 p-2.5 rounded font-mono max-h-24 overflow-y-auto mt-1 leading-normal select-text">
                      {activeAgent.systemPrompt}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="bg-white/[0.01] p-2.5 rounded border border-white/[0.04]">
                      <span className="text-gray-500 block">AUTONOMY SLOPE</span>
                      <span className="text-white font-semibold mt-1 block">{activeAgent.autonomyLevel}% threshold</span>
                    </div>
                    <div className="bg-white/[0.01] p-2.5 rounded border border-white/[0.04]">
                      <span className="text-gray-500 block">MEMORY SEED</span>
                      <span className="text-white font-semibold mt-1 block uppercase">{activeAgent.memoryScope} range</span>
                    </div>
                  </div>
                </div>

                {/* Reasoning active traces */}
                <div className="mt-4">
                  <span className="text-[10px] font-mono text-gray-500 uppercase block mb-2">LIVE COMPILING REASONING STREAM</span>
                  
                  {isExecutingAgentId === activeAgent.id ? (
                    <div className="space-y-2 max-h-56 overflow-y-auto bg-black/40 p-3 rounded-lg border border-yellow-500/10 font-mono text-[11px]">
                      {agentThinkingLog.map((step, idx) => (
                        <div key={idx} className="text-amber-400 flex items-start gap-1 pb-1">
                          <span className="text-amber-300 select-none animate-pulse">⚡</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-2.5 max-h-56 overflow-y-auto">
                      {activeAgent.recentActivity.map((activity, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[11px]">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span className="text-gray-400 leading-snug">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.04] mt-6 flex justify-between text-[11px] text-gray-500">
                <span>Compliance audit: PII validated</span>
                <span>Active thread: standby</span>
              </div>

            </div>
          ) : (
            <div className="bg-[#0b0e12] border border-white/[0.04] p-8 rounded-xl text-center text-gray-500 font-mono text-sm h-64 flex items-center justify-center">
              Select an agent to scrutinize runtime logs.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
