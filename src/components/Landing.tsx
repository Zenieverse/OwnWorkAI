import { useState } from 'react';
import { ShieldCheck, Cpu, GitMerge, Bot, Zap, ArrowRight, Play, CheckCircle, Database } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  const [demoActive, setDemoActive] = useState(false);

  return (
    <div id="landing-root" className="min-h-screen bg-[#07080a] text-gray-100 flex flex-col font-sans overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 right-[10%] w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 left-[5%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation */}
      <header id="nav-header" className="relative z-10 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Bot id="logo-icon" className="w-5 h-5 text-white" />
          </div>
          <span className="font-sans font-bold tracking-tight text-xl bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            OwnWorks
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-white/[0.04] text-gray-500 border border-white/[0.03]">
            v1.0 OS
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-blue-400 transition-colors">Orchestration</a>
          <a href="#workflows" className="hover:text-blue-400 transition-colors">Workflows</a>
          <a href="#local-mode" className="hover:text-blue-400 transition-colors">Local Privacy</a>
          <a href="#pricing" className="hover:text-blue-400 transition-colors">Enterprise</a>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={onStart}
            id="start-session-btn"
            className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-100 active:scale-95 transition-all shadow-sm"
          >
            Launch Terminal
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pt-16 md:pt-28 pb-20 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Headline content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Tag chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              <span>Next-Gen Multi-Agent Assembly Engine</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold font-sans tracking-tight leading-[1.1] text-white">
              Build Your Own <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">
                AI Workforce
              </span>
            </h1>

            <p className="mt-6 text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl">
              Autonomous agents, drag-and-drop workflows, neural vector memory, and secure local compilation — running privately on local silicons or scaling in optimal cloud grids.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 items-center">
              <button
                onClick={onStart}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm flex items-center gap-2 group shadow-lg shadow-blue-500/15 cursor-pointer active:scale-95 transition-all"
              >
                <span>Start Building OS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setDemoActive(!demoActive)}
                className="px-6 py-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 font-medium text-sm flex items-center gap-2 border border-white/[0.06] transition-all"
              >
                <Play className="w-4 h-4 text-blue-400" />
                <span>{demoActive ? 'Hide Blueprint' : 'Watch Blueprint'}</span>
              </button>
            </div>

            {/* Micro details */}
            <div className="mt-12 grid grid-cols-3 gap-6 pt-10 border-t border-white/[0.05] w-full max-w-lg">
              <div>
                <div className="text-2xl font-bold text-white">99.8%</div>
                <div className="text-xs text-gray-500 font-mono mt-1">LATENCY EFFICIENCY</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">Ollama</div>
                <div className="text-xs text-gray-500 font-mono mt-1">LOCAL MODEL NATIVE</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">&lt; 150ms</div>
                <div className="text-xs text-gray-500 font-mono mt-1">MUTUAL SWARM SYNC</div>
              </div>
            </div>

          </div>

          {/* Hero Visual Block */}
          <div className="lg:col-span-5 h-[450px] relative">
            {demoActive ? (
              /* Simulation Video Player Mock */
              <div className="absolute inset-0 bg-[#0c0e12] rounded-xl border border-blue-500/30 shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span>OWNWORKS_SIMULATOR_V1.mp4</span>
                  </div>
                  <button onClick={() => setDemoActive(false)} className="text-xs text-gray-500 hover:text-white">Close</button>
                </div>
                <div className="my-auto flex flex-col items-center justify-center text-center px-4 py-8">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                    <Bot className="w-6 h-6 text-blue-400 animate-spin" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">Streaming Blueprint Demo</h4>
                  <p className="text-xs text-gray-500 mt-2 max-w-xs">
                    Watch ScoutPro, Gemma planning loops, and CopyScribe code compiler collaborate in real-time under SECURE Sandbox rules.
                  </p>
                </div>
                <div className="bg-black/40 px-3 py-2 rounded-lg border border-white/[0.05] text-[10px] font-mono text-blue-300">
                  ⚡ Terminal: npm install -g @ownworks/cli && ownworks login
                </div>
              </div>
            ) : (
              /* High Fidelity Animated Agent Nodes Simulation */
              <div className="absolute inset-0 bg-[#0c0e12] rounded-xl border border-white/[0.05] p-6 shadow-2xl overflow-hidden flex flex-col gap-4">
                
                {/* Header terminal status */}
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 text-xs text-gray-500 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>ORCHESTRATOR ACTIVE</span>
                  </div>
                  <span>WS // Lead Enrichment</span>
                </div>

                {/* Simulated Nodes connected by lines */}
                <div className="relative flex-1 flex flex-col justify-around">
                  {/* Glowing execution beam */}
                  <div className="absolute left-[34px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-emerald-500 shadow-md" />
                  
                  {/* Node 1 */}
                  <div className="flex items-center gap-4 relative z-10 group">
                    <div className="w-[18px] h-[18px] rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                    </div>
                    <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 hover:border-blue-500/50 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">1. Trigger Received</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">WEBHOOK</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">Inbound data parsed contact email: zenieverse@gmail.com</p>
                    </div>
                  </div>

                  {/* Node 2 */}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-[18px] h-[18px] rounded-full bg-indigo-500/20 border border-indigo-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                    </div>
                    <div className="flex-1 bg-white/[0.03] border border-indigo-500/30 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">2. ScoutPro Agent (Researching)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono">RUNNING</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 font-mono">&gt; Google query: "SaaS competitor pricing indicators 2026"</p>
                    </div>
                  </div>

                  {/* Node 3 */}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-[18px] h-[18px] rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">3. CopyScribe Agent (Queued)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-500/10 text-gray-400 font-mono">STANDBY</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">Awaiting context vectors compilation and enrichment payload.</p>
                    </div>
                  </div>

                </div>

                {/* Footer status counts */}
                <div className="border-t border-white/[0.04] pt-2 flex justify-between text-[11px] font-mono text-gray-500">
                  <span>Tokens: 6,430</span>
                  <span>Latency: 280ms</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bento Grid Features Section */}
      <section id="features" className="py-20 bg-[#090b0e] border-y border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight">The Core Pillars of Autonomy</h2>
            <p className="text-gray-400 mt-4">
              Everything needed to orchestrate complex multi-agent swarms under a secure, lightning-fast operating ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1 */}
            <div className="bg-[#0b0e12]/60 border border-white/[0.04] rounded-xl p-6 hover:border-blue-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Autonomous Swarms</h3>
                <p className="text-sm text-gray-400 mt-2">
                  Create roles, assign high-level goals, slide autonomy thresholds, and let specialized agents talk, solve problems, and verify code locally.
                </p>
              </div>
              <ul className="text-xs font-mono text-gray-500 space-y-2 mt-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-500" /> Private System Prompt Isolation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-500" /> Granular Tool Permission Bounds
                </li>
              </ul>
            </div>

            {/* Box 2 */}
            <div className="bg-[#0b0e12]/60 border border-white/[0.04] rounded-xl p-6 hover:border-indigo-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400">
                  <GitMerge className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">n8n-Inspired Workflows</h3>
                <p className="text-sm text-gray-400 mt-2">
                  Visually lay out triggering rules, cron schedulers, conditional branches, REST API calls, and email responders with real-time graph visualization.
                </p>
              </div>
              <ul className="text-xs font-mono text-gray-500 space-y-2 mt-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500" /> Dynamic Variable Substitution
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500" /> Real-time Node Execution Tracing
                </li>
              </ul>
            </div>

            {/* Box 3 */}
            <div className="bg-[#0b0e12]/60 border border-white/[0.04] rounded-xl p-6 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Strict Local Privacy</h3>
                <p className="text-sm text-gray-400 mt-2">
                  Seamlessly map local silicons! Integrate Ollama with llama3 or gemma to process local files, scan private APIs, and run compliance audits.
                </p>
              </div>
              <ul className="text-xs font-mono text-gray-500 space-y-2 mt-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Local GPU Profile Diagnostics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Full Vector Embeddings Isolation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing and Scale Packages */}
      <section id="pricing" className="py-20 bg-[#07080a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight">Flexible Scaling Options</h2>
            <p className="text-gray-400 mt-3">From personal workflows running locally to secure enterprise multi-agent clusters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Plan 1 */}
            <div className="bg-[#0b0e12]/40 border border-white/[0.05] rounded-xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-gray-400 uppercase tracking-widest text-xs font-mono">Solo Creator</span>
                <h4 className="text-3xl font-bold text-white mt-4">$0 <span className="text-sm text-gray-500">/ forever</span></h4>
                <p className="text-sm text-gray-400 mt-3">Perfect for running agent experiments locally on your own silicons using Ollama.</p>
                <div className="mt-6 border-t border-white/[0.05] pt-6 space-y-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" /> Unlimited Local Agents (Ollama)
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" /> Basic Memory Timeline (Local storage)
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>• No remote team workspace sync</span>
                  </div>
                </div>
              </div>
              <button onClick={onStart} className="w-full mt-8 py-2 rounded bg-white/[0.05] hover:bg-white/[0.08] text-white text-sm font-medium transition-all cursor-pointer">
                Deploy Sandbox Free
              </button>
            </div>

            {/* Plan 2 */}
            <div className="bg-[#0c0f14] border border-blue-500/40 rounded-xl p-8 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute -top-3 right-4 bg-blue-600 text-[10px] text-white font-semibold px-2 py-0.5 rounded-full font-mono uppercase">
                COMMERCIAL STANDARD
              </div>
              <div>
                <span className="text-blue-400 uppercase tracking-widest text-xs font-mono">Team Scale</span>
                <h4 className="text-3xl font-bold text-white mt-4">$49 <span className="text-sm text-gray-500">/ month</span></h4>
                <p className="text-sm text-gray-300 mt-3">Full-stack multi-node sync using real Gemini high-performance models and collaborative pipelines.</p>
                <div className="mt-6 border-t border-white/[0.05] pt-6 space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" /> Real-time Gemini 3.5 Flash Integration
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" /> Visual n8n Canvas & 12+ Cloud connectors
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" /> Persistent Team Memories & Vector logs
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" /> Google & GitHub OAuth triggers
                  </div>
                </div>
              </div>
              <button onClick={onStart} className="w-full mt-8 py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all cursor-pointer">
                Launch Team Workspace
              </button>
            </div>

            {/* Plan 3 */}
            <div className="bg-[#0b0e12]/40 border border-white/[0.05] rounded-xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-gray-400 uppercase tracking-widest text-xs font-mono">Enterprise Node</span>
                <h4 className="text-3xl font-bold text-white mt-4">Custom <span className="text-sm text-gray-500">/ volume</span></h4>
                <p className="text-sm text-gray-400 mt-3">Private pgvector instances, customized audit policies, strict SLA, and Dedicated VPC isolation handles.</p>
                <div className="mt-6 border-t border-white/[0.05] pt-6 space-y-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-500" /> Dedicated Kubernetes Node & Docker Composes
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-500" /> SSO SAML, compliance audits, & extreme scale
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-500" /> Dedicated SLA support managers
                  </div>
                </div>
              </div>
              <button onClick={onStart} className="w-full mt-8 py-2 rounded bg-white/[0.05] hover:bg-white/[0.08] text-white text-sm font-medium transition-all cursor-pointer">
                Contact Enterprise Node
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/[0.03] py-12 bg-[#050608]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500/60" />
            <span>OwnWorks AI Workforce OS • All registers synchronized</span>
          </div>
          <div className="flex gap-6">
            <span>Enterprise compliance: HIPAA / SOC2 compliant</span>
            <span>Local Node Port: 3000</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
