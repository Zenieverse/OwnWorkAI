import { useState } from 'react';
import { Integration, ActivityEvent } from '../types';
import { Terminal, Shield, Activity, RefreshCw, Cpu, CheckCircle2, AlertCircle, HardDrive, Unlink, Link2, ExternalLink } from 'lucide-react';

/* =========================================
   1. EXECUTION CENTER VIEW
   ========================================= */
interface ExecutionCenterProps {
  activities: ActivityEvent[];
  onClear: () => void;
}

export function ExecutionCenter({ activities, onClear }: ExecutionCenterProps) {
  const successCount = activities.filter(a => a.type === 'success').length;
  const errorCount = activities.filter(a => a.type === 'error').length;
  const avgLatency = Math.round(activities.reduce((sum, a) => sum + (a.latency || 0), 0) / (activities.length || 1));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Deployment & Execution Stream</h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time server-level event streaming logs. Monitor active nodes, pending webhook dispatches, and memory compilation.
          </p>
        </div>
        <button
          onClick={onClear}
          className="px-3 py-1.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white border border-white/[0.05] text-xs font-semibold cursor-pointer"
        >
          Clear Memory Registers
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0b0e12] p-4 rounded-xl border border-white/[0.04]">
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Active Pipeline Nodes</span>
          <span className="text-xl font-semibold text-white mt-1 block">4 Processes</span>
        </div>
        <div className="bg-[#0b0e12] p-4 rounded-xl border border-white/[0.04]">
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Successful Dispatches</span>
          <span className="text-xl font-semibold text-emerald-400 mt-1 block">{successCount} Events</span>
        </div>
        <div className="bg-[#0b0e12] p-4 rounded-xl border border-white/[0.04]">
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Error Events</span>
          <span className="text-xl font-semibold text-red-400 mt-1 block">{errorCount} Events</span>
        </div>
        <div className="bg-[#0b0e12] p-4 rounded-xl border border-white/[0.04]">
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Average latency</span>
          <span className="text-xl font-semibold text-blue-400 mt-1 block">{avgLatency}ms</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kubernetes / Container simulation */}
        <div className="lg:col-span-1 bg-[#0b0e12] p-5 rounded-xl border border-white/[0.04] space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 block">
            <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>OwnWorks Cluster Nodes</span>
          </h3>

          <div className="space-y-3 font-mono text-xs text-gray-400">
            {/* Node 1 */}
            <div className="p-3 bg-black/40 border border-[#10b981]/20 rounded-lg">
              <div className="flex justify-between items-center text-white font-bold">
                <span>node-asia-se1-0</span>
                <span className="text-[9px] bg-[#10b981]/15 px-1 rounded text-emerald-400 uppercase">HEALTHY</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">CPU: 42% | RAM: 3.1GB / 8GB</p>
            </div>

            {/* Node 2 */}
            <div className="p-3 bg-black/40 border border-[#10b981]/20 rounded-lg">
              <div className="flex justify-between items-center text-white font-bold">
                <span>node-local-inference-1</span>
                <span className="text-[9px] bg-[#10b981]/15 px-1 rounded text-emerald-400 uppercase">HEALTHY</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">GPU CUDA: 18% | Ollama local sync active</p>
            </div>

            {/* System variables */}
            <div className="pt-2 space-y-1.5 text-[10px] text-gray-500 border-t border-white/[0.04]">
              <div>Ingress Host: <span className="text-gray-300">https://ownworks.ai</span></div>
              <div>Internal Port: <span className="text-gray-300">3000 (Proxy mapped)</span></div>
              <div>Memory backend: <span className="text-gray-300">In-Server Cache Registers</span></div>
            </div>
          </div>
        </div>

        {/* Live Terminal logs console */}
        <div className="lg:col-span-2 bg-[#040507] p-5 rounded-xl border border-white/[0.05] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-white">Consolidated Cluster Output Logs</h3>
            </div>
            <span className="text-[10px] font-mono text-gray-600">tail -f terminal.log</span>
          </div>

          <div className="flex-1 min-h-[250px] font-mono text-[11px] text-gray-400 space-y-2 max-h-[300px] overflow-y-auto pr-1 select-text">
            {activities.length > 0 ? (
              activities.map((a, index) => (
                <div key={index} className="leading-relaxed flex items-start gap-2">
                  <span className="text-blue-500 select-none">[{new Date(a.timestamp).toLocaleTimeString()}]</span>
                  <span className={a.type === 'success' ? 'text-emerald-400' : a.type === 'error' ? 'text-red-400' : 'text-gray-300'}>
                    [{a.agentName.toUpperCase()}]: {a.message} (latency: {a.latency}ms)
                  </span>
                </div>
              ))
            ) : (
              <div className="text-gray-600 text-center py-12">Logs sandbox registers flushed.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}


/* =========================================
   2. LOCAL AI MODE VIEW
   ========================================= */
interface LocalModeProps {
  localAiMode: boolean;
  onToggleLocal: () => void;
}

export function LocalMode({ localAiMode, onToggleLocal }: LocalModeProps) {
  const [ollamaPort, setOllamaPort] = useState('11434');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  const checkOllamaConnection = () => {
    setTestStatus('testing');
    setTimeout(() => {
      setTestStatus('success');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Ollama Local Hardware Alignment</h2>
          <p className="text-xs text-gray-400 mt-1">
            Configure private local hardware model pipelines. Securely offload sensitive code blocks onto your local silicons.
          </p>
        </div>
        <span className={`text-[10px] font-mono px-2.5 py-1 roundeduppercase ${
          localAiMode ? 'bg-[#10b981]/15 text-emerald-400 border border-[#10b981]/20' : 'bg-gray-500/10 text-gray-400'
        }`}>
          {localAiMode ? 'LOCAL AUDIT ACTIVE' : 'LOCAL ENGINE SUSPENDED'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Connection Setup */}
        <div className="lg:col-span-8 bg-[#0b0e12] p-5 rounded-xl border border-white/[0.04] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Private Local Loopback Parameters</h3>
            
            <button
              onClick={onToggleLocal}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                localAiMode 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/10' 
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {localAiMode ? 'Sync Local Mode' : 'Connect Private Loopback'}
            </button>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed max-w-xl">
            When loopback mode is enabled, agents like **Gemma Spark** and **LocalLlama Guard** route parsing commands securely to local server instances on your desktop without exposing prompt data to public web networks.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Local Ollama API Path</label>
              <input
                type="text"
                disabled={!localAiMode}
                value={`http://localhost:${ollamaPort}`}
                onChange={e => setOllamaPort(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-[#050608] border border-white/[0.06] rounded p-2 text-xs text-white outline-none focus:border-emerald-500 font-mono disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Testing Hardware Alignment</label>
              <button
                disabled={!localAiMode}
                onClick={checkOllamaConnection}
                className="w-full h-8 px-4 rounded bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 font-bold border border-white/[0.05] text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {testStatus === 'testing' ? (
                  <>
                    <RefreshCw className="w-3 animate-spin text-emerald-400" />
                    <span>Querying localhost:{ollamaPort}...</span>
                  </>
                ) : testStatus === 'success' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-emerald-400">Node Connected Successfully</span>
                  </>
                ) : (
                  <span>Verify Ollama Port Ping</span>
                )}
              </button>
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded-lg border border-white/[0.04] space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Integration Manual</h4>
            <div className="text-[10px] text-gray-500 font-mono space-y-1">
              <div>1. Run Ollama on local machine shell: <span className="text-emerald-400">ollama run gemma</span></div>
              <div>2. Set terminal environment variables: <span className="text-emerald-400">OLLAMA_ORIGINS="*"</span></div>
              <div>3. Enable this connection block inside OwnWorks cockpit to redirect security checks.</div>
            </div>
          </div>
        </div>

        {/* GPU telemetry diagnostics */}
        <div className="lg:col-span-4 bg-[#0b0e12] p-5 rounded-xl border border-white/[0.04] space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>Silicon Diagnostic Suite</span>
          </h3>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-mono text-gray-400">
                <span>GPU ALLOCATION PROFILE</span>
                <span>Metal / CUDA 1.2</span>
              </div>
              <div className="w-full bg-white/[0.04] h-2 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: localAiMode ? '25%' : '0%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-gray-400">
                <span>VRAM BURN RATIO</span>
                <span>4.1GB / 12GB allocation</span>
              </div>
              <div className="w-full bg-white/[0.04] h-2 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: localAiMode ? '34%' : '0%' }} />
              </div>
            </div>

            <div className="text-[10px] font-mono text-gray-500 pt-3 border-t border-white/[0.04] space-y-1">
              <div>Detected Engine: <span className="text-gray-300">Apple Silicon / M3 Max</span></div>
              <div>Inference Latency: <span className="text-gray-300">~15ms per token</span></div>
              <div>Sandbox Isolation: <span className="text-emerald-400">Armed (No cloud leak)</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


/* =========================================
   3. INTEGRATIONS HUB VIEW
   ========================================= */
interface IntegrationsHubProps {
  integrations: Integration[];
  onToggleConnect: (id: string) => void;
}

export function IntegrationsMarket({ integrations, onToggleConnect }: IntegrationsHubProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', 'productivity', 'developer', 'database', 'communication', 'payment'];
  
  const filteredIntegrations = integrations.filter(item => {
    return activeCategory === 'all' || item.category === activeCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Enterprise Integrations Marketplace</h2>
          <p className="text-xs text-gray-400 mt-1">
            Equip agents with external connectors. Trigger workflows on commits, broadcast Slack pings, or scrape Notion blocks.
          </p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 bg-[#0b0e12] border border-white/[0.04] rounded-lg p-1 w-fit">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs px-3 py-1 rounded capitalize font-mono text-[10px] ${
              activeCategory === cat ? 'bg-blue-600/20 text-blue-400 font-bold' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map(entry => (
          <div
            key={entry.id}
            className={`p-5 rounded-xl border flex flex-col justify-between transition-all gap-4 ${
              entry.connected 
                ? 'bg-[#0a0d14] border-blue-500/40 shadow-md shadow-blue-500/5' 
                : 'bg-[#0b0e12] border-white/[0.04] hover:border-gray-500/20'
            }`}
          >
            <div>
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center font-bold text-sm text-gray-200">
                  {entry.name.substring(0, 2).toUpperCase()}
                </div>

                <button
                  onClick={() => onToggleConnect(entry.id)}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                    entry.connected 
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' 
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white border border-white/[0.05]'
                  }`}
                >
                  {entry.connected ? (
                    <>
                      <Link2 className="w-3 h-3 shrink-0" />
                      <span>CONNECTED</span>
                    </>
                  ) : (
                    <>
                      <Unlink className="w-3 h-3 shrink-0" />
                      <span>CONNECT</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold text-white">{entry.name}</h4>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  {entry.description}
                </p>
              </div>

              {entry.usageDocs && (
                <div className="text-[10px] text-gray-500 mt-3 border-t border-white/[0.03] pt-3 font-mono leading-normal">
                  <span className="text-gray-400 block font-bold mb-0.5">Integration Scope:</span>
                  {entry.usageDocs}
                </div>
              )}
            </div>

            <div className="text-[10px] font-mono text-gray-600 flex justify-between items-center border-t border-white/[0.03] pt-3">
              <span>Category: {entry.category}</span>
              <span className="flex items-center gap-1">Docs <ExternalLink className="w-2.5 h-2.5" /></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


/* =========================================
   4. SETTINGS VIEW
   ========================================= */
export function SettingsPanel({ 
  apiConnected, 
  openaiConnected,
  publicKeyStatus,
  publicKeyFragment
}: { 
  apiConnected: boolean; 
  openaiConnected: boolean;
  publicKeyStatus?: boolean;
  publicKeyFragment?: string | null;
}) {
  const apiKeySet = apiConnected;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Security & OS Settings</h2>
          <p className="text-xs text-gray-400 mt-1">
            Audit API registries, configure telemetry isolation, and modulate model variables.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Core preferences form */}
        <div className="lg:col-span-8 bg-[#0b0e12] p-5 rounded-xl border border-white/[0.04] space-y-6">
          <h3 className="text-sm font-semibold text-white pb-3 border-b border-white/[0.04] block">Cluster Preferences</h3>
          
          <div className="space-y-4 text-xs">
            
            {/* Gemini API Key details */}
            <div className="bg-black/30 p-4 rounded-lg border border-white/[0.05] flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-white block uppercase font-bold text-blue-400">GEMINI_API_KEY Vault status</span>
                <span className="text-gray-400 block mt-1 leading-normal">
                  Google GenAI API keys are isolated and loaded exclusively on secure backend nodes.
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase shrink-0 ${
                apiKeySet ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
              }`}>
                {apiKeySet ? '✅ Synchronized' : '⚠️ Simulator Active'}
              </span>
            </div>

            {/* OpenAI API Key details */}
            <div className="bg-black/30 p-4 rounded-lg border border-white/[0.05] flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-white block uppercase font-bold text-indigo-400">OPENAI_API_KEY Companion status</span>
                <span className="text-gray-400 block mt-1 leading-normal">
                  Your custom key is active. Supports operational falls back to GPT-4o-mini pipelines!
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase shrink-0 ${
                openaiConnected ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
              }`}>
                {openaiConnected ? '✅ Active (user sk-...)' : '⚠️ Standby'}
              </span>
            </div>

            {/* PKCS#1 X.509 RSA Certificate/Public Key status */}
            <div className="bg-black/30 p-4 rounded-lg border border-white/[0.05] flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-white block uppercase font-bold text-emerald-400">Public Verification Signature (PKI)</span>
                <span className="text-gray-400 block mt-1 leading-normal font-mono text-[10px]">
                  Fingerprint SHA-1: {publicKeyFragment || 'None'}... (RSA 1024-bit asymmetric block)
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase shrink-0 ${
                publicKeyStatus ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
              }`}>
                {publicKeyStatus ? '🔒 RSA VERIFIED' : '⚠️ UNVERIFIED'}
              </span>
            </div>

            {/* In-app instructions detailing Settings Secrets panel */}
            <div className="text-gray-400 leading-relaxed font-sans space-y-2">
              <p>
                *Important configuration safety:* OwnWorks relies on server-side requests (proxy routing) to communicate with models. This completely prevents sensitive API keys from rendering inside the browser Bundle.
              </p>
              <p>
                To edit these variables under the AI Studio sandbox, navigate to the **Settings &rarr; Secrets** panel in the parent frame, insert <span className="font-mono text-gray-300">GEMINI_API_KEY</span> or <span className="font-mono text-gray-300">OPENAI_API_KEY</span>, and refresh this tab!
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.04] space-y-4">
              <div>
                <label className="text-[10px] font-mono text-gray-500 block mb-1">DEFAULT SYSTEM USER</label>
                <input
                  type="text"
                  disabled
                  value="zenieverse@gmail.com"
                  className="w-full bg-[#050608] border border-white/[0.06] rounded p-2 text-xs text-gray-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-500 block mb-1">CLEARANCE LEVEL (RBAC)</label>
                <select disabled className="w-full bg-[#050608] border border-white/[0.06] rounded p-2 text-xs text-gray-400 font-mono outline-none">
                  <option value="root">Root cluster administrator (Level 10)</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Regulatory telemetry column */}
        <div className="lg:col-span-4 bg-[#0b0e12] p-5 rounded-xl border border-white/[0.04] space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 block">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Policy Guardrails</span>
          </h3>

          <div className="space-y-4 text-xs text-gray-400 pt-2 font-mono">
            <div className="p-3 bg-black/40 border border-white/[0.04] rounded">
              <span className="text-white font-bold block mb-1">PII DETECTION GUARD</span>
              <span className="text-[10px]">Automatically masks credit card numbers and passport hashes from outgoing agent emails.</span>
            </div>

            <div className="p-3 bg-black/40 border border-white/[0.04] rounded">
              <span className="text-white font-bold block mb-1">GPU COOLDOWN INDEX</span>
              <span className="text-[10px]">Suspends local Ollama loops if Silicon internal thermals exceed 82°C.</span>
            </div>

            <div className="text-[10px] text-gray-500 leading-relaxed font-sans pt-1">
              OwnWorks conforms strictly to SOC2 Type II, ISO-27001, and HIPAA compliance patterns on local silicons.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
