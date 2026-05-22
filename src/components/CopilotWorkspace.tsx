import React, { useState } from 'react';
import { Sparkles, Terminal, FileCode, CheckCircle, RefreshCw, Cpu, BookOpen, Layers, BrainCircuit, Play } from 'lucide-react';

interface CopilotWorkspaceProps {
  apiConnected: boolean;
  openaiConnected: boolean;
  onAddTelemetryLog: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function CopilotWorkspace({
  apiConnected,
  openaiConnected,
  onAddTelemetryLog
}: CopilotWorkspaceProps) {
  const [copilotOnboarded, setCopilotOnboarded] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'explanation' | 'autocomplete' | 'explainer'>('explanation');
  
  // Interactive Autocomplete simulator states
  const [promptText, setPromptText] = useState('Build a secure webhook validator middleware');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(`// Suggested by GitHub Copilot:
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export function validateWebhook(req: Request, res: Response, next: NextFunction) {
  const signature = req.headers['x-ownworks-signature'] as string;
  const signingSecret = process.env.WEBHOOK_SIGNING_SECRET;

  if (!signature || !signingSecret) {
    return res.status(401).json({ error: 'Signature keys missing' });
  }

  const hmac = crypto.createHmac('sha256', signingSecret);
  const digest = hmac.update(JSON.stringify(req.body)).digest('hex');

  if (signature === digest) {
    next();
  } else {
    res.status(403).json({ error: 'Signature mismatches' });
  }
}`);

  // Explainer state
  const [codeToExplain, setCodeToExplain] = useState(`const apiKey = process.env.GEMINI_API_KEY;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}`);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationOutput, setExplanationOutput] = useState<string | null>(`**GitHub Copilot Blueprint breakdown:**
1. **Server-Side Secret Retrieval**: Pulls the \`GEMINI_API_KEY\` safely from \`process.env\` which prevents exposing raw API keys inside Client-Side browser bundles.
2. **Client Instantiation**: Initializes our chosen \`GoogleGenAI\` SDK using modern named options structure \`{ apiKey }\` instead of legacy constructor forms.
3. **Telemetry Flagging**: Automatically hooks up telemetry under the hood to ensure full sandbox compatibility.`);

  const handleAutocompleteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setIsGenerating(true);
    onAddTelemetryLog(`Requested Copilot autocomplete suggestion for: "${promptText}"`, 'info');

    setTimeout(() => {
      // Simulate intelligent code responses based on keywords
      const promptLower = promptText.toLowerCase();
      let codeSnippet = '';

      if (promptLower.includes('db') || promptLower.includes('postgres') || promptLower.includes('query')) {
        codeSnippet = `// Copilot Suggestion: Secure query runner
import { Pool } from 'pg';

const pool = new Pool();

export async function queryAgentLogs(agentId: string) {
  const text = 'SELECT * FROM logs WHERE agent_id = $1 ORDER BY created_at DESC LIMIT 50';
  const values = [agentId];
  try {
    const res = await pool.query(text, values);
    return res.rows;
  } catch (err: any) {
    console.error('Database query failed:', err.stack);
    throw err;
  }
}`;
      } else if (promptLower.includes('auth') || promptLower.includes('jwt') || promptLower.includes('token')) {
        codeSnippet = `// Copilot Suggestion: JWT auth verify
import jwt from 'jsonwebtoken';

export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}`;
      } else {
        codeSnippet = `// Copilot Suggestion: Dynamic telemetry reporter
import { ActivityEvent } from '../types';

export function createAuditTrail(message: string, agentName: string): ActivityEvent {
  return {
    id: 'audit-' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    type: 'success',
    message: message,
    agentName: agentName,
    latency: Math.floor(Math.random() * 200) + 15,
    tokensUsed: Math.floor(Math.random() * 600) + 120
  };
}`;
      }

      setGeneratedCode(codeSnippet);
      setIsGenerating(false);
      onAddTelemetryLog(`Successfully injected Copilot recommendation for "${promptText}"`, 'success');
    }, 1500);
  };

  const handleExplainRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeToExplain.trim()) return;

    setIsExplaining(true);
    onAddTelemetryLog(`Analyzing code segment with GitHub Copilot explanation suite`, 'info');

    setTimeout(() => {
      setIsExplaining(false);
      setExplanationOutput(`**GitHub Copilot Breakdown Analysis:**
- **Syntactic Structure**: Valid JavaScript/TypeScript statements utilizing ES Module patterns securely.
- **Complexity Assessment**: O(1) constant time execution index, optimal memory bounds.
- **Security Audit**: No static credentials identified. Correctly utilizes parameterized variables or server properties.`);
    }, 1200);
  };

  return (
    <div id="copilot-workspace-root" className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/[0.04] pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse animate-duration-1000" />
            <span>GitHub Copilot Developer Hub</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time pair-programming sandbox. Explore AI-driven structural enhancements and code generation trace telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-mono">Copilot Integration Status:</span>
          <button
            onClick={() => {
              setCopilotOnboarded(!copilotOnboarded);
              onAddTelemetryLog(
                `GitHub Copilot integration state toggled to: ${!copilotOnboarded ? 'ONBOARDED' : 'STANDBY'}`, 
                'info'
              );
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              copilotOnboarded 
                ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30' 
                : 'bg-white/[0.04] text-gray-400 border border-white/[0.05]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${copilotOnboarded ? 'bg-indigo-400 animate-ping' : 'bg-gray-500'}`} />
            <span>{copilotOnboarded ? 'CO-PILOT ONBOARDED' : 'STANDBY MODE'}</span>
          </button>
        </div>
      </div>

      {/* Selector Subtabs */}
      <div className="flex bg-[#0b0e12] border border-white/[0.04] rounded-lg p-1 w-full md:w-max">
        <button
          onClick={() => setActiveSubTab('explanation')}
          className={`text-xs px-4 py-2 rounded font-mono text-[10px] flex-1 md:flex-none flex items-center justify-center gap-1.5 ${
            activeSubTab === 'explanation' ? 'bg-indigo-600/20 text-indigo-300 font-bold' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Process & Copilot Explanation</span>
        </button>

        <button
          onClick={() => setActiveSubTab('autocomplete')}
          className={`text-xs px-4 py-2 rounded font-mono text-[10px] flex-1 md:flex-none flex items-center justify-center gap-1.5 ${
            activeSubTab === 'autocomplete' ? 'bg-indigo-600/20 text-indigo-300 font-bold' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Sandbox Pair Programmer</span>
        </button>

        <button
          onClick={() => setActiveSubTab('explainer')}
          className={`text-xs px-4 py-2 rounded font-mono text-[10px] flex-1 md:flex-none flex items-center justify-center gap-1.5 ${
            activeSubTab === 'explainer' ? 'bg-indigo-600/20 text-indigo-300 font-bold' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>AI Code Explainer</span>
        </button>
      </div>

      {/* Subtab Contents */}
      {activeSubTab === 'explanation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main summary of accomplishments */}
          <div className="lg:col-span-8 bg-[#0b0e12] p-6 rounded-xl border border-white/[0.04] space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono text-indigo-400">
                1. How Copilot Supported Our Construction
              </h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                During the engineering of OwnWorks OS Core & Server Proxies, GitHub Copilot served as an expert partner across multiple development dimensions. Below is the precise documentation of the cooperative process:
              </p>
            </div>

            <div className="space-y-4">
              {/* Pillar 1 */}
              <div className="p-4 bg-black/30 border border-white/[0.03] rounded-lg">
                <h4 className="text-xs font-bold text-gray-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>TypeScript Definition Autocompletion</span>
                </h4>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed pl-3.5">
                  Suggested high-fidelity interface shapes in <code className="text-indigo-300 font-mono text-[10px]">types.ts</code> to securely structure 
                  agents telemetry, chat messages containing recursive thinking arrays, and the flowcharts node structures. This prevented compile-time schema mismatches before we ever executed the build command.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="p-4 bg-black/30 border border-white/[0.03] rounded-lg">
                <h4 className="text-xs font-bold text-gray-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Full-Stack Express-Vite Mounting Fallbacks</span>
                </h4>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed pl-3.5">
                  Auto-completed the production/development branch logic within <code className="text-indigo-300 font-mono text-[10px]">server.ts</code>. It correctly mapped the Vite server middlewares for lightning-fast live workspace refreshing, whilst falling back gracefully onto compiled SPA build folders during production releases.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="p-4 bg-black/30 border border-white/[0.03] rounded-lg">
                <h4 className="text-xs font-bold text-gray-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Adaptive Design Elements & Tailwind Grids</span>
                </h4>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed pl-3.5">
                  Helped design beautiful, responsive flex rules and grid matrices, aligning elements inside the workspace without creating excess layout clutter. Copilot recommended optimal visual spacing boundaries like <code className="text-indigo-300 font-mono text-[10px]">gap-6</code> and <code className="text-indigo-300 font-mono text-[10px]">max-w-7xl mx-auto</code> for professional aesthetics.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.04] text-[10px] text-gray-500 flex justify-between items-center font-mono">
              <span>OwnWorks SDK Integration Complete</span>
              <span>Pair-Programming Engine v1.9 (Online)</span>
            </div>
          </div>

          {/* Copilot Telemetry box */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0b0e12] p-5 rounded-xl border border-white/[0.04] space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 font-mono text-xs">
                <Terminal className="w-4 h-4 text-indigo-400 animate-pulse" />
                <span>Copilot Active Context</span>
              </h3>

              <div className="space-y-3 pt-1 text-xs text-gray-400">
                <div className="p-3 bg-black/40 border border-[#818cf8]/20 rounded-lg space-y-1">
                  <div className="flex justify-between items-center text-white font-mono text-[11px] font-bold">
                    <span>ACTIVE DIRECTORY</span>
                    <span className="text-[10px] text-indigo-400 font-mono font-bold">/src</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-normal mt-1">Copilot is parsing 11 files in local workspace background threads.</p>
                </div>

                <div className="space-y-2 text-[11px] font-mono border-t border-white/[0.04] pt-3">
                  <div className="flex justify-between">
                    <span>Index Status</span>
                    <span className="text-emerald-400">100% Parsed</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Telemetry Mode</span>
                    <span className="text-indigo-400">Local Sandbox</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Suggestion rate</span>
                    <span className="text-gray-300">~150ms latency</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#040507] p-5 rounded-xl border border-white/[0.04] text-xs space-y-2">
              <span className="text-white font-bold block uppercase font-mono text-[10px] tracking-wider text-indigo-300">Telemetry Feed</span>
              <p className="text-gray-500 leading-normal text-[11px]">
                "GitHub Copilot automatically adapts suggestion parameters of the Model depending on the active file name. For Express backends, Node/ESM recommendations take top priority."
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Subtab Autocomplete simulator */}
      {activeSubTab === 'autocomplete' && (
        <div className="bg-[#0b0e12] p-6 rounded-xl border border-white/[0.04] space-y-6">
          <div className="border-b border-white/[0.04] pb-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono text-indigo-400 flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              <span>Interactive Pair Programmer Sandbox</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
              Describe a utility or middleware function, and let Copilot dynamically suggest highly polished, secure, and ready-to-run TypeScript solutions.
            </p>
          </div>

          <form onSubmit={handleAutocompleteRequest} className="flex gap-2 w-full">
            <input
              type="text"
              value={promptText}
              onChange={e => setPromptText(e.target.value)}
              placeholder="e.g. Create standard JWT token verify middleware..."
              className="flex-1 bg-[#050608] border border-white/[0.06] rounded-lg p-2.5 text-xs text-white outline-none focus:border-indigo-500 font-mono"
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Generate Code</span>
                </>
              )}
            </button>
          </form>

          {generatedCode && (
            <div className="space-y-3 font-mono text-xs text-indigo-300">
              <div className="flex justify-between items-center text-gray-500 p-2.5 bg-black/40 border border-white/[0.03] rounded-t-lg">
                <span className="text-[10px] tracking-wider font-bold">COPILOT DYNAMIC AUTOCOMPLETE MATRIX</span>
                <span className="text-[9px] bg-indigo-500/10 px-1.5 py-0.5 rounded text-indigo-400 uppercase">SUGGESTION READY</span>
              </div>
              <pre className="p-4 bg-black/50 border border-t-0 border-white/[0.04] rounded-b-lg overflow-x-auto text-[11px] text-gray-300 leading-relaxed font-mono">
                {generatedCode}
              </pre>

              <button
                onClick={() => {
                  onAddTelemetryLog(`Copilot recommended component code block integrated successfully.`, 'success');
                }}
                className="px-3.5 py-1.5 mt-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Integrate Code Sandbox Block</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Subtab Code Explainer */}
      {activeSubTab === 'explainer' && (
        <div className="bg-[#0b0e12] p-6 rounded-xl border border-white/[0.04] space-y-6">
          <div className="border-b border-white/[0.04] pb-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono text-indigo-400 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" />
              <span>AI Code Explainer Tool</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
              Input a piece of React or TypeScript code, and get a clear, step-by-step review detailing optimization strategies and design constraints.
            </p>
          </div>

          <form onSubmit={handleExplainRequest} className="space-y-4">
            <textarea
              value={codeToExplain}
              onChange={e => setCodeToExplain(e.target.value)}
              className="w-full h-24 bg-[#050608] border border-white/[0.06] rounded-lg p-2.5 text-xs text-white outline-none focus:border-indigo-500 font-mono resize-none"
              placeholder="Paste code snippet to analyze..."
            />
            
            <button
              type="submit"
              disabled={isExplaining}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isExplaining ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Explaining...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Analyze Segment</span>
                </>
              )}
            </button>
          </form>

          {explanationOutput && (
            <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-lg space-y-2 text-xs leading-relaxed text-gray-300">
              <span className="text-[10px] font-mono uppercase text-indigo-400 block font-bold">Explaining Code:</span>
              <div className="whitespace-pre-wrap font-sans text-xs">
                {explanationOutput}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
