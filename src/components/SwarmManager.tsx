import React, { useState, useEffect } from 'react';
import { Agent } from '../types';
import { Network, Bot, Users, Play, Radio, Cpu, RefreshCw, MessageSquare, Send } from 'lucide-react';

interface SwarmManagerProps {
  agents: Agent[];
  activities: any[];
}

export default function SwarmManager({ agents, activities }: SwarmManagerProps) {
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isSwarmRunning, setIsSwarmRunning] = useState(false);
  
  // Custom dialog log simulation between agents
  const [dialogs, setDialogs] = useState<{ id: string; sender: string; avatar: string; recipient: string; message: string; timestamp: string }[]>([
    { id: '1', sender: 'Gemma Spark', avatar: '⚡', recipient: 'ScoutPro', message: 'ScoutPro, compile SaaS sector indicators and pricing grids.', timestamp: '04:18:22' },
    { id: '2', sender: 'ScoutPro', avatar: '🔍', recipient: 'Gemma Spark', message: 'Searching target web lists. Pulled 4 benchmark indicators: Tier starter ranges from $49/mo.', timestamp: '04:18:40' },
    { id: '3', sender: 'Gemma Spark', avatar: '⚡', recipient: 'CopyScribe', message: 'Objectives enriched. CopyScribe, generate an email campaign matching competitor benchmarks.', timestamp: '04:19:00' },
    { id: '4', sender: 'CopyScribe', avatar: '✍️', recipient: 'LocalLlama Guard', message: 'Structural drafts compiled. Dispatching to LocalLlama Guard for compliance scan.', timestamp: '04:19:15' },
    { id: '5', sender: 'LocalLlama Guard', avatar: '🛡️', recipient: 'CopyScribe', message: 'PII analysis complete. 0 secrets or sensitive databases exposed. Target list cleared for delivery.', timestamp: '04:19:20' }
  ]);

  const [inputMsg, setInputMsg] = useState('');

  const runSwarmSequence = () => {
    setIsSwarmRunning(true);
    setActiveStep(0);
    
    const timers = [
      setTimeout(() => setActiveStep(1), 1500),
      setTimeout(() => setActiveStep(2), 3000),
      setTimeout(() => setActiveStep(3), 4500),
      setTimeout(() => setActiveStep(4), 6000),
      setTimeout(() => {
        setIsSwarmRunning(false);
        setActiveStep(-1);
      }, 7500)
    ];

    return () => timers.forEach(clearTimeout);
  };

  const handleSendConversation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    setDialogs(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'Human Operator',
        avatar: '👨‍🚀',
        recipient: 'OwnWorks Swarm',
        message: inputMsg,
        timestamp: new Date().toLocaleTimeString().substring(0, 5)
      }
    ]);
    setInputMsg('');
  };

  return (
    <div id="swarm-manager-panel" className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Multi-Agent Swarm Orchestrator</h2>
          <p className="text-xs text-gray-400 mt-1">
            Map relationships, structure message passing queues, and view collaborative conversations as agents delegate work autonomously.
          </p>
        </div>

        <button
          onClick={runSwarmSequence}
          disabled={isSwarmRunning}
          className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 border transition-all ${
            isSwarmRunning 
              ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400' 
              : 'bg-indigo-600 border-indigo-500 hover:bg-indigo-500 text-white shadow-lg cursor-pointer active:scale-95 shadow-indigo-500/10'
          }`}
        >
          {isSwarmRunning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Swarms Collating...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Orchestrate Live Run</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Swarm relationship map lines */}
        <div className="lg:col-span-7 bg-[#0b0e12] border border-white/[0.04] p-5 rounded-xl h-[450px] flex flex-col justify-between overflow-hidden relative">
          
          <div className="absolute right-4 top-4 text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-300 py-1 px-2.5 rounded-full flex items-center gap-1.5 border border-indigo-500/20 z-10">
            <Radio className="w-3 h-3 text-indigo-400 animate-pulse" />
            <span>Node Collaboration Logic</span>
          </div>

          <div className="text-sm font-semibold text-white/90 z-10 flex items-center gap-1.5 mb-6">
            <Network className="w-4 h-4 text-indigo-400" />
            <span>Autonomous Pipeline Topology</span>
          </div>

          {/* Connected Swarm Map Nodes */}
          <div className="flex-1 flex flex-col justify-center items-center relative gap-8 -mt-4">
            
            {/* SVG Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {/* Leader to Scout */}
              <line 
                x1="50%" y1="20%" x2="25%" y2="50%" 
                className={`stroke-2 transition-all ${activeStep === 0 ? 'stroke-indigo-400 stroke-dasharray-4 animate-dash' : 'stroke-white/[0.08]'}`} 
              />
              {/* Scout to Dev */}
              <line 
                x1="25%" y1="50%" x2="50%" y2="80%" 
                className={`stroke-2 transition-all ${activeStep === 1 ? 'stroke-indigo-400 stroke-dasharray-4 animate-dash' : 'stroke-white/[0.08]'}`} 
              />
              {/* Leader to Dev */}
              <line 
                x1="50%" y1="20%" x2="50%" y2="80%" 
                className={`stroke-2 transition-all ${activeStep === 2 ? 'stroke-indigo-400 stroke-dasharray-4 animate-dash' : 'stroke-white/[0.08]'}`} 
              />
              {/* Dev to auditor */}
              <line 
                x1="50%" y1="80%" x2="75%" y2="50%" 
                className={`stroke-2 transition-all ${activeStep === 3 ? 'stroke-indigo-400 stroke-dasharray-4 animate-dash' : 'stroke-white/[0.08]'}`} 
              />
              {/* Auditor to Leader */}
              <line 
                x1="75%" y1="50%" x2="50%" y2="20%" 
                className={`stroke-2 transition-all ${activeStep === 4 ? 'stroke-indigo-400 stroke-dasharray-4 animate-dash' : 'stroke-white/[0.08]'}`} 
              />
            </svg>

            {/* Top Node - General Planner */}
            <div className={`relative z-10 p-3 bg-[#0d1016] border rounded-xl flex items-center gap-3 transition-all max-w-[200px] text-center flex-col justify-center ${
              activeStep === 0 || activeStep === 2 ? 'border-indigo-500 shadow-lg shadow-indigo-500/10' : 'border-white/[0.06]'
            }`}>
              <span className="text-xl bg-indigo-500/10 w-9 h-9 flex items-center justify-center rounded-lg border border-indigo-500/35">⚡</span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-widest leading-none">Gemma Spark</h4>
                <p className="text-[10px] text-indigo-400 mt-1 font-mono uppercase">Orchestrator Node</p>
              </div>
            </div>

            {/* Middle Row Layout (Left: ScoutPro, Right: Auditor) */}
            <div className="flex items-center justify-between w-full px-4 relative z-10">
              
              {/* ScoutPro Node (Left) */}
              <div className={`p-3 bg-[#0d1016] border rounded-xl flex items-center gap-3 transition-all max-w-[190px] text-center flex-col justify-center ${
                activeStep === 1 ? 'border-orange-500 shadow-lg shadow-orange-500/10' : 'border-white/[0.06]'
              }`}>
                <span className="text-xl bg-orange-500/10 w-9 h-9 flex items-center justify-center rounded-lg border border-orange-500/35">🔍</span>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest leading-none">ScoutPro</h4>
                  <p className="text-[10px] text-orange-400 mt-1 font-mono uppercase">Research Node</p>
                </div>
              </div>

              {/* Llama Guard Node (Right) */}
              <div className={`p-3 bg-[#0d1016] border rounded-xl flex items-center gap-3 transition-all max-w-[190px] text-center flex-col justify-center ${
                activeStep === 4 ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-white/[0.06]'
              }`}>
                <span className="text-xl bg-emerald-500/10 w-9 h-9 flex items-center justify-center rounded-lg border border-emerald-500/35">🛡️</span>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest leading-none">Llama Guard</h4>
                  <p className="text-[10px] text-emerald-400 mt-1 font-mono uppercase">Compliance Node</p>
                </div>
              </div>

            </div>

            {/* Bottom Node - CopyScribe Writer */}
            <div className={`relative z-10 p-3 bg-[#0d1016] border rounded-xl flex items-center gap-3 transition-all max-w-[200px] text-center flex-col justify-center ${
              activeStep === 3 ? 'border-pink-500 shadow-lg shadow-pink-500/10' : 'border-white/[0.06]'
            }`}>
              <span className="text-xl bg-pink-500/10 w-9 h-9 flex items-center justify-center rounded-lg border border-pink-500/35">✍️</span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-widest leading-none">CopyScribe</h4>
                <p className="text-[10px] text-pink-400 mt-1 font-mono uppercase">Synthesis Node</p>
              </div>
            </div>

          </div>

          <div className="text-[11px] font-mono text-gray-500 text-center border-t border-white/[0.04] pt-2">
            Status: {isSwarmRunning ? '🚀 Orchestrated pipeline actively executing step: ' + (activeStep + 1) : '💤 Orchestrator idle. Awaiting user parameters.'}
          </div>

        </div>

        {/* Right Column: Simulated transcript dialogue context */}
        <div className="lg:col-span-5 bg-[#0b0e12] border border-white/[0.04] p-5 rounded-xl h-[450px] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 mb-2 shrink-0">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Swarm Conversations</span>
            </h3>
            <span className="text-[9px] font-mono text-gray-500">Node message logs</span>
          </div>

          {/* Dialogue logs scrolling list */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-2 text-xs">
            {dialogs.map((d, index) => (
              <div key={d.id} className="p-3 bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.03] rounded-lg">
                <div className="flex items-center justify-between mb-1 text-[11px] font-mono text-gray-400">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>{d.avatar}</span>
                    <span className="text-indigo-300">{d.sender}</span>
                    <span className="text-[9px] font-normal text-gray-500">➔ {d.recipient}</span>
                  </div>
                  <span className="text-[9px] text-gray-600">{d.timestamp}</span>
                </div>
                <p className="text-gray-300 leading-normal font-mono text-[11px] select-text">{d.message}</p>
              </div>
            ))}
          </div>

          {/* Prompt sender input box */}
          <form onSubmit={handleSendConversation} className="mt-2 pt-2 border-t border-white/[0.05] flex gap-2 shrink-0">
            <input
              type="text"
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              placeholder="Inject operator command into node queue..."
              className="flex-1 bg-[#050608] border border-white/[0.06] rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-500 font-mono"
            />
            <button
              type="submit"
              className="p-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
