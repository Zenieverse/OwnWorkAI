import { useState, useEffect } from 'react';
import { Agent, ActivityEvent, WorkflowNode } from '../types';
import { Play, Check, Server, Shield, Cpu, RefreshCw, Layers, Zap, Clock, MessageSquare, AlertCircle } from 'lucide-react';

interface DashboardHomeProps {
  onNavigate: (tab: string) => void;
  agents: Agent[];
  workflowsCount: number;
  activities: ActivityEvent[];
  onTriggerMockWorkflow: () => void;
  isMockRunning: boolean;
  localAiMode: boolean;
}

export default function DashboardHome({
  onNavigate,
  agents,
  workflowsCount,
  activities,
  onTriggerMockWorkflow,
  isMockRunning,
  localAiMode
}: DashboardHomeProps) {
  
  // Real-time time display
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString());
    };
    updateTime();
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  const totalTokens = agents.reduce((sum, a) => sum + a.tokenUsage, 0);
  const activeCount = agents.filter(a => a.status === 'thinking' || a.status === 'executing').length;

  return (
    <div id="dashboard-home" className="space-y-6">
      
      {/* Welcome Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-900/10 via-[#0c0e12] to-[#07080a] border border-white/[0.04] rounded-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-blue-500/5 to-transparent pointer-events-none" />
        
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">OwnWorks Operational Cockpit</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            Workspace: <span className="text-blue-400 font-mono">zenieverse@gmail.com</span> on cluster node <span className="font-mono text-gray-300 bg-white/[0.03] px-1.5 py-0.5 rounded border border-white/[0.04]">dev-asia-southeast1</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-gray-500 font-mono uppercase">Node Local Time</div>
            <div className="text-sm font-semibold text-white font-mono mt-0.5">{timeStr || '04:20:53'} UTC</div>
          </div>
          
          <button
            onClick={onTriggerMockWorkflow}
            disabled={isMockRunning}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 border transition-all ${
              isMockRunning 
                ? 'bg-blue-600/10 border-blue-500/20 text-blue-400' 
                : 'bg-blue-600 border-blue-500 hover:bg-blue-500 text-white shadow-lg cursor-pointer active:scale-95 shadow-blue-500/10'
            }`}
          >
            {isMockRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Swarm...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Trigger Outbreak Draft</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-[#0b0e12] border border-white/[0.04] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase tracking-wider">Agents Online</span>
            <BotBadge count={activeCount} total={agents.length} />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-semibold text-white">{agents.length} Nodes</div>
            <p className="text-[10px] text-gray-500 mt-1">
              {agents.filter(a => a.runtime === 'local').length} local / {agents.filter(a => a.runtime === 'cloud').length} cloud instances
            </p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-[#0b0e12] border border-white/[0.04] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase tracking-wider">Workflows</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-semibold text-white">{workflowsCount} Visual Pipelines</div>
            <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Webhook trigger listening active
            </p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-[#0b0e12] border border-white/[0.04] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase tracking-wider">Joint Token Burn</span>
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-semibold text-white">{(totalTokens / 1000).toFixed(1)}k <span className="text-xs text-gray-500">tkn</span></div>
            <div className="w-full bg-white/[0.04] h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-yellow-500 h-full rounded-full" style={{ width: '45%' }} />
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-[#0b0e12] border border-white/[0.04] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase tracking-wider">Cloud Engine SLA</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-semibold text-emerald-400">99.98% / Secure</div>
            <p className="text-[10px] text-gray-500 mt-1">
              PII validation filtering active on node outputs
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Events & Core Models */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Event Stream logs */}
        <div className="lg:col-span-8 bg-[#0b0e12] border border-white/[0.04] rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">Real-Time Joint Telemetry Feed</h3>
            </div>
            <span className="text-[10px] font-mono uppercase bg-blue-500/10 py-0.5 px-2 rounded-full text-blue-400">
              Auto Streaming
            </span>
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {activities.map((act) => (
              <div 
                key={act.id} 
                className="flex items-start gap-3 p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.03] rounded-lg transition-all"
              >
                <div className={`mt-1 p-1 rounded-md text-[10px] font-mono tracking-tighter shrink-0 ${
                  act.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                  act.type === 'error' ? 'bg-red-500/10 text-red-400' :
                  act.type === 'warning' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {act.agentName ? act.agentName.substring(0, 3).toUpperCase() : 'SYS'}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-200">{act.agentName}</span>
                    <span className="text-[9px] text-gray-500 font-mono">
                      {new Date(act.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{act.message}</p>
                  
                  {/* Micro stats inside logs */}
                  {(act.latency || act.tokensUsed) && (
                    <div className="flex items-center gap-3 mt-1.5 text-[9px] font-mono text-gray-500">
                      {act.latency && <span>Latency: {act.latency}ms</span>}
                      {act.tokensUsed && <span>Burned: {act.tokensUsed} tokens</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-white/[0.03] text-center">
            <button
              onClick={() => onNavigate('executions')}
              className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition-all"
            >
              Analyze in Execution Center →
            </button>
          </div>
        </div>

        {/* Right Column: AI Runtime Nodes Status */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Local Models Box */}
          <div className="bg-[#0b0e12] border border-white/[0.04] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Model Allocation Matrix</span>
            </h3>

            <div className="space-y-4">
              {/* Row Gemini */}
              <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Gemini 3.5 Flash</span>
                  <span className="text-[9px] font-mono bg-blue-500/15 py-0.5 px-1.5 rounded text-blue-300">CLOUD DEFAULT</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Handles chat synthesis, competitor web search scrapes, and outreach generation.</p>
                <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-gray-500">
                  <span>API Status: Connected</span>
                  <span>Latency: ~120ms</span>
                </div>
              </div>

              {/* Row Local Llama */}
              <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Ollama / gemma-spark</span>
                  <span className={`text-[9px] font-mono py-0.5 px-1.5 rounded ${localAiMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-gray-500/10 text-gray-400'}`}>
                    {localAiMode ? 'RUNNING PRIVATE' : 'OFFLINE (STANDBY)'}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Processes local security audit blocks, checks secrets leakages, and local planning checkmarks.</p>
                <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-gray-500">
                  <span>Host: localhost:11434</span>
                  <span>Engine: CUDA / CoreML</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 boder-t border-white/[0.03] pt-2 text-center">
              <button
                onClick={() => onNavigate('local-ai')}
                className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline transition-all"
              >
                Configure Ollama Engine →
              </button>
            </div>
          </div>

          {/* Quick Sandbox Commands */}
          <div className="bg-[#0b0e12] border border-white/[0.04] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Quick Sandbox Commands</h3>
            <div className="text-[11px] font-mono bg-black/40 p-3 rounded-lg border border-white/[0.04] text-gray-400 space-y-1.5">
              <div className="text-gray-500"># Direct curl sandbox simulation:</div>
              <div className="text-blue-300">curl -X POST /api/chat \</div>
              <div className="text-blue-300">{"  -d '{\"message\": \"deploy ScoutPro\"}'"}</div>
              <div className="mt-4 pt-2 border-t border-white/[0.05] text-center text-gray-500 text-[10px]">
                API key status: {process.env.GEMINI_API_KEY ? '✅ Configured server-side' : '⚠️ Cloud Run offline mock active'}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

function BotBadge({ count, total }: { count: number; total: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-300 font-mono">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
      <span>{count} / {total} ACTIVE</span>
    </span>
  );
}
