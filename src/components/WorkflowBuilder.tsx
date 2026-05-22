import { useState, useEffect } from 'react';
import { WorkflowNode, WorkflowEdge } from '../types';
import { Network, Plus, Zap, Cpu, Terminal, Play, Settings, RefreshCw, Layers, Sliders, ChevronDown } from 'lucide-react';

interface WorkflowBuilderProps {
  workflow: {
    id: string;
    name: string;
    description: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    status: 'active' | 'inactive';
  };
  onRunWorkflow: (id: string) => void;
  isExecutingWorkflowId: string | null;
  workflowOutputs: string[];
  onUpdateWorkflow?: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
}

export default function WorkflowBuilder({
  workflow,
  onRunWorkflow,
  isExecutingWorkflowId,
  workflowOutputs,
  onUpdateWorkflow
}: WorkflowBuilderProps) {
  
  const [nodes, setNodes] = useState<WorkflowNode[]>(workflow.nodes);
  const [edges, setEdges] = useState<WorkflowEdge[]>(workflow.edges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(workflow.nodes[0]?.id || null);

  // Form states for changing node properties
  const [nodeName, setNodeName] = useState('');
  const [nodeValue, setNodeValue] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync state with incoming prop references (e.g., when switching tabs or workflows)
  useEffect(() => {
    setNodes(workflow.nodes);
    setEdges(workflow.edges);
    // Find previously selected node, or fallback to first
    const activeNode = workflow.nodes.find(n => n.id === selectedNodeId) || workflow.nodes[0];
    if (activeNode) {
      setSelectedNodeId(activeNode.id);
      setNodeName(activeNode.label);
      setNodeValue(activeNode.config ? JSON.stringify(activeNode.config, null, 2) : '{}');
    } else {
      setSelectedNodeId(null);
      setNodeName('');
      setNodeValue('');
    }
  }, [workflow]);

  const handleNodeClick = (node: WorkflowNode) => {
    setSelectedNodeId(node.id);
    setNodeName(node.label);
    setNodeValue(node.config ? JSON.stringify(node.config, null, 2) : '{}');
    setFeedback(null);
  };

  const handleUpdateNode = () => {
    if (!selectedNodeId) return;
    let isJsonValid = true;
    let parsedConfig = {};
    
    try {
      parsedConfig = JSON.parse(nodeValue);
    } catch (e) {
      isJsonValid = false;
    }

    const updatedNodes = nodes.map(n => {
      if (n.id === selectedNodeId) {
        return {
          ...n,
          label: nodeName,
          config: isJsonValid ? parsedConfig : n.config
        };
      }
      return n;
    });

    setNodes(updatedNodes);

    if (onUpdateWorkflow) {
      onUpdateWorkflow(updatedNodes, edges);
    }

    if (isJsonValid) {
      setFeedback({ type: 'success', message: 'Parameters applied successfully!' });
    } else {
      setFeedback({ type: 'error', message: 'Warning: Invalid JSON configuration. Node label updated, but config JSON was skipped.' });
    }

    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  const handleCreateNode = (type: any) => {
    const nextId = 'new-node-' + Date.now();
    const lastNode = nodes[nodes.length - 1];
    
    const newNode: WorkflowNode = {
      id: nextId,
      type: type,
      label: `New ${type.toUpperCase()} Block`,
      status: 'idle',
      config: { active: true },
      position: { 
        x: lastNode ? lastNode.position.x + 190 : 100, 
        y: lastNode ? lastNode.position.y : 150 
      }
    };

    const newNodes = [...nodes, newNode];
    let newEdges = edges;

    if (lastNode) {
      const newEdge: WorkflowEdge = {
        id: `edge-new-${Date.now()}`,
        source: lastNode.id,
        target: nextId,
        animated: true
      };
      newEdges = [...edges, newEdge];
    }

    setNodes(newNodes);
    setEdges(newEdges);
    setSelectedNodeId(newNode.id);
    setNodeName(newNode.label);
    setNodeValue(JSON.stringify(newNode.config, null, 2));
    setFeedback(null);

    if (onUpdateWorkflow) {
      onUpdateWorkflow(newNodes, newEdges);
    }
  };

  const isSelectedActive = isExecutingWorkflowId === workflow.id;

  return (
    <div id="workflow-builder-panel" className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">n8n-Style Pipeline Canvas</h2>
          <p className="text-xs text-gray-400 mt-1">
            Build server-authoritative visual automations. Flow JSON triggers, system webhooks, API dispatches, and agent nodes securely.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono select-none px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
            Active: Listening Online
          </span>

          <button
            onClick={() => onRunWorkflow(workflow.id)}
            disabled={isSelectedActive}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/10 active:scale-95"
          >
            {isSelectedActive ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Streaming Traces...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Visual Graph</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Canvas panel */}
        <div className="lg:col-span-8 bg-[#040507] border border-white/[0.05] rounded-xl h-[480px] p-4 flex flex-col justify-between relative overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
          
          {/* Node actions grid */}
          <div className="absolute top-4 left-4 z-10 flex gap-1 bg-[#0b0e12]/80 border border-white/[0.06] rounded-md p-1 backdrop-blur">
            <button onClick={() => handleCreateNode('webhook')} className="p-1.5 rounded text-[10px] font-mono text-gray-300 hover:bg-white/[0.04] hover:text-white uppercase">Add Webhook</button>
            <button onClick={() => handleCreateNode('agent')} className="p-1.5 rounded text-[10px] font-mono text-gray-300 hover:bg-white/[0.04] hover:text-white uppercase">Add Agent</button>
            <button onClick={() => handleCreateNode('email')} className="p-1.5 rounded text-[10px] font-mono text-gray-300 hover:bg-white/[0.04] hover:text-white uppercase">Add Email</button>
            <button onClick={() => handleCreateNode('approval')} className="p-1.5 rounded text-[10px] font-mono text-gray-300 hover:bg-white/[0.04] hover:text-white uppercase">Add Gate</button>
          </div>

          <div className="absolute top-4 right-4 z-10 text-[10px] text-gray-500 font-mono">
            ZOOM: 100% | PAN: FIXED GRID
          </div>

          {/* Visual connected nodes block */}
          <div className="flex-1 flex items-center justify-start gap-12 overflow-x-auto px-4 py-16 scrollbar-thin">
            {nodes.map((node, index) => {
              const prevNode = index > 0 ? nodes[index - 1] : null;
              const hasSelectedBorder = selectedNodeId === node.id;
              
              return (
                <div key={node.id} className="flex items-center gap-12 shrink-0">
                  {/* Glowing execution vector line before node */}
                  {prevNode && (
                    <div className="relative w-12 h-0.5 bg-white/[0.06] flex items-center justify-center">
                      <div className={`absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 ${
                        isSelectedActive ? 'animate-pulse' : 'hidden'
                      }`} />
                    </div>
                  )}

                  {/* Node block */}
                  <div
                    onClick={() => handleNodeClick(node)}
                    className={`w-44 p-4 rounded-xl border flex flex-col justify-between transition-all cursor-pointer relative ${
                      hasSelectedBorder 
                        ? 'bg-[#0c0f16] border-blue-500 shadow-lg shadow-blue-500/10' 
                        : 'bg-[#0a0c10] border-white/[0.05] hover:border-gray-500/40'
                    }`}
                  >
                    {/* Node status dot indicator */}
                    <span className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border border-black flex items-center justify-center ${
                      node.status === 'success' ? 'bg-emerald-500' :
                      node.status === 'running' ? 'bg-amber-500 animate-ping' :
                      node.id === 'n-1' ? 'bg-emerald-500' : 'bg-gray-700'
                    }`} />

                    <div>
                      <span className="text-[9px] font-mono uppercase text-gray-500 tracking-wider">
                        {node.type}
                      </span>
                      <h4 className="text-xs font-bold font-sans text-white/95 mt-1 truncate">
                        {node.label}
                      </h4>
                    </div>

                    <div className="mt-4 pt-2 border-t border-white/[0.03] text-[9px] font-mono text-gray-500 flex justify-between items-center">
                      <span>Ref: {node.id}</span>
                      <span className="text-[8px] text-indigo-400">Settings →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Canvas HUD footer */}
          <div className="mt-4 pt-3 border-t border-white/[0.03] flex justify-between text-[11px] font-mono text-gray-500 items-center shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Flow listening: `POST /v1/hooks/inbound` API active ready.</span>
            </div>
            <span>Nodes: {nodes.length} connected</span>
          </div>

        </div>

        {/* Right Column: Node settings & execution debugger log drawer */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Node parameter settings block */}
          {selectedNodeId ? (
            <div className="bg-[#0b0e12] border border-white/[0.04] p-5 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-400" />
                <span>Node Configuration Panel</span>
              </h3>

              <div>
                <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">NODE DISPLAY LABEL</label>
                <input
                  type="text"
                  value={nodeName}
                  onChange={e => setNodeName(e.target.value)}
                  className="w-full bg-[#050608] border border-white/[0.06] rounded p-2 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase">META PARAMETERS JSON</label>
                  <span className="text-[8px] text-gray-600 font-mono">JSON key-val editor</span>
                </div>
                <textarea
                  rows={4}
                  value={nodeValue}
                  onChange={e => setNodeValue(e.target.value)}
                  className="w-full bg-[#050608] border border-white/[0.06] rounded p-2 text-xs text-indigo-300 font-mono outline-none focus:border-blue-500"
                />
              </div>

              {feedback && (
                <div className={`p-2.5 rounded text-[10px] font-mono leading-relaxed ${
                  feedback.type === 'success' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {feedback.message}
                </div>
              )}

              <button
                onClick={handleUpdateNode}
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded transition-all cursor-pointer"
              >
                Apply Node Parameters
              </button>
            </div>
          ) : (
            <div className="bg-[#0b0e12] border border-white/[0.04] p-6 rounded-xl text-center text-xs text-gray-500">
              Click any flowchart block node to modulate details.
            </div>
          )}

          {/* Execution outputs drawer */}
          <div className="bg-[#0b0e12] border border-white/[0.04] p-5 rounded-xl space-y-3">
            <h3 className="text-xs font-mono uppercase text-gray-400 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-amber-500" />
              <span>Sandbox Pipeline Output Trace</span>
            </h3>

            <div className="bg-[#050608] border border-white/[0.04] p-3 rounded-lg font-mono text-[10px] text-gray-400 min-h-36 max-h-52 overflow-y-auto space-y-1 select-text">
              {workflowOutputs.length > 0 ? (
                workflowOutputs.map((output, idx) => (
                  <div key={idx} className={output.includes('SUCCESS') ? 'text-emerald-400' : 'text-gray-400'}>
                    {output}
                  </div>
                ))
              ) : (
                <div className="text-gray-600 text-center py-6">
                  Click 'Test Visual Graph' above to compile and run flow checks.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
