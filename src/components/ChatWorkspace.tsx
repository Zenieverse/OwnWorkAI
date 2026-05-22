import React, { useState, useRef, useEffect } from 'react';
import { Agent, ChatMessage } from '../types';
import { Bot, User, Send, Paperclip, ChevronDown, ChevronUp, Cpu, Terminal, Radio, HelpCircle, HardDrive, RefreshCw } from 'lucide-react';

interface ChatWorkspaceProps {
  agents: Agent[];
  chatHistory: ChatMessage[];
  onSendMessage: (text: string, agentId?: string) => void;
  isGenerating: boolean;
  activeAgentId: string;
  setActiveAgentId: (id: string) => void;
}

export default function ChatWorkspace({
  agents,
  chatHistory,
  onSendMessage,
  isGenerating,
  activeAgentId,
  setActiveAgentId
}: ChatWorkspaceProps) {
  
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<{ name: string; size: string; type: string }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Expanded state dictionary for expanded reasoning steps matching message index
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});

  const toggleReasoning = (msgId: string) => {
    setExpandedReasoning(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && attachments.length === 0) return;

    let payloadText = inputText;
    if (attachments.length > 0) {
      const attachDesc = attachments.map(a => `[Attachment: ${a.name} (${a.size})]`).join(', ');
      payloadText = `${attachDesc}\n${payloadText}`;
    }

    onSendMessage(payloadText, activeAgentId !== 'os-core' ? activeAgentId : undefined);
    setInputText('');
    setAttachments([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files).map((f: any) => ({
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      type: f.type
    }));

    setAttachments(prev => [...prev, ...fileList]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Keep chat scrolled down
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [chatHistory, isGenerating]);

  // Default system details for the selected agent
  const selectedAgentObj = agents.find(a => a.id === activeAgentId);

  return (
    <div id="chat-workspace-root" className="flex flex-col h-[520px] bg-[#0b0e12] border border-white/[0.04] rounded-xl overflow-hidden">
      
      {/* Top Selector Panel */}
      <div className="bg-[#0c0f16] border-b border-white/[0.04] p-3 shrink-0 flex items-center justify-between">
        
        {/* Left Side Active Agent Selector */}
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400 font-mono shrink-0" />
          <span className="text-xs text-gray-400 font-mono">Chatting with:</span>
          
          <div className="relative">
            <select
              value={activeAgentId}
              onChange={e => {
                setActiveAgentId(e.target.value);
              }}
              className="bg-[#050608] border border-white/[0.06] rounded px-2.5 py-1 text-xs text-white outline-none font-semibold cursor-pointer pr-6"
            >
              <option value="os-core">⚙️ Central OwnWorks Engine</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>
                  {a.avatar} {a.name} ({a.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right side Agent profile metrics */}
        <div className="text-[10px] font-mono text-gray-500 hidden md:flex items-center gap-3">
          <span>Active loops: safe</span>
          <span>Target Platform: Cloud Run / local</span>
        </div>

      </div>

      {/* Selected Agent Context Header Tip banner */}
      <div className="bg-white/[0.01] border-b border-white/[0.03] px-4 py-2 text-[10px] text-gray-400 flex items-center justify-between shrink-0 font-mono">
        {activeAgentId === 'os-core' ? (
          <span>Uses Gemini 3.5 Flash server-side. Coordinates pipelines and deploys swarms.</span>
        ) : (
          <span>Specific focus: <strong className="text-blue-300">{selectedAgentObj?.role}</strong>. Action tools bounds: {selectedAgentObj?.tools.join(', ')}.</span>
        )}
        <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded uppercase">
          {activeAgentId === 'os-core' ? 'OS System' : 'Individual Node'}
        </span>
      </div>

      {/* Chat Messages Timeline */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[350px]"
      >
        {chatHistory.map((msg) => {
          const isUser = msg.role === 'user';
          
          // Locate corresponding agent avatar
          let avatarDisplay = '👨‍🚀';
          let nameDisplay = 'Operator';
          
          if (!isUser) {
            if (msg.agentId) {
              const matchedA = agents.find(a => a.id === msg.agentId);
              avatarDisplay = matchedA?.avatar || '🤖';
              nameDisplay = matchedA?.name || 'Agent Node';
            } else {
              avatarDisplay = '⚙️';
              nameDisplay = 'OwnWorks OS Central';
            }
          }

          const hasThinking = msg.thinkingSteps && msg.thinkingSteps.length > 0;
          const isExpanded = expandedReasoning[msg.id];

          return (
            <div 
              key={msg.id} 
              className={`flex gap-3 max-w-[85%] ${
                isUser ? 'ms-auto flex-row-reverse' : 'me-auto'
              }`}
            >
              {/* Profile Avatar */}
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-sm shrink-0">
                {avatarDisplay}
              </div>

              {/* Box bubble */}
              <div className="space-y-1.5 flex-1 select-text">
                <div className="flex items-center gap-2 text-[11px] font-mono text-gray-500">
                  <span className="font-bold text-gray-300">{nameDisplay}</span>
                  <span>• {msg.timestamp}</span>
                </div>

                <div className={`p-3 rounded-lg border leading-relaxed text-xs space-y-2 ${
                  isUser 
                    ? 'bg-[#0f131a] border-blue-500/20 text-gray-100' 
                    : 'bg-[#12161f]/75 border-white/[0.03] text-gray-200'
                }`}>
                  
                  {/* Collapsible Thinking Traces block */}
                  {hasThinking && (
                    <div className="border-b border-white/[0.04] pb-2 mb-2 font-mono text-[10px] text-amber-400">
                      <button 
                        onClick={() => toggleReasoning(msg.id)}
                        className="flex items-center gap-1.5 text-amber-500 hover:text-amber-400 font-bold uppercase cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        <span>Internal Sandbox Reasoning Trace</span>
                      </button>

                      {isExpanded && (
                        <div className="mt-2 pl-3 space-y-1 border-l border-amber-500/20 bg-black/30 p-2 rounded">
                          {msg.thinkingSteps?.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-1 pb-0.5">
                              <span className="text-amber-500 select-none">•</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message main text content (Pre-formatted code/markdown emulation support) */}
                  <p className="whitespace-pre-wrap select-text leading-relaxed font-sans">
                    {msg.content}
                  </p>

                  {/* Tool Call animation triggers if present */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="pt-2 border-t border-white/[0.04] flex flex-wrap gap-2 text-[10px] font-mono">
                      {msg.toolCalls.map((tc, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Tool Call: {tc.name}({tc.params}) ➔ {tc.status}</span>
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex gap-3 max-w-[80%] me-auto">
            <div className="w-8 h-8 rounded bg-white/[0.02] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-blue-400 animate-spin" />
            </div>
            <div className="bg-[#12161f]/75 border border-white/[0.03] p-3 rounded-lg text-xs text-gray-400 font-mono flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
              <span>Orchestrator synthesizing reasoning blocks (Gemini 3.5)...</span>
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input element */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />

      {/* Files Attachments Row previews */}
      {attachments.length > 0 && (
        <div className="p-2 border-t border-white/[0.04] bg-black/40 flex flex-wrap gap-2 shrink-0">
          {attachments.map((file, idx) => (
            <div key={idx} className="bg-white/[0.03] border border-white/[0.05] p-1 px-2.5 rounded-lg text-[10px] font-mono text-gray-300 flex items-center gap-2">
              <Paperclip className="w-3.5 h-3.5 text-blue-400" />
              <span>{file.name} ({file.size})</span>
              <button onClick={() => removeAttachment(idx)} className="text-red-500 font-bold hover:text-red-400 cursor-pointer">×</button>
            </div>
          ))}
        </div>
      )}

      {/* bottom chat message composition bar */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/[0.04] bg-[#0c0f16] flex gap-2 shrink-0">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-gray-400 border border-white/[0.05] transition-all cursor-pointer flex items-center justify-center shrink-0"
          title="Upload metadata context"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder={`Instruct ${activeAgentId === 'os-core' ? 'Central OwnWorks Engine' : selectedAgentObj?.name}...`}
          className="flex-1 bg-[#050608] border border-white/[0.06] rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 font-mono"
        />

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md shadow-blue-500/15 shrink-0"
        >
          <span>Dispatch Command</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
}
