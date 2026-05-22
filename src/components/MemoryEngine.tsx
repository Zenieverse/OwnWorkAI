import React, { useState } from 'react';
import { MemoryItem } from '../types';
import { Search, Brain, Clock, Sliders, Play, Plus, BookOpen, Trash } from 'lucide-react';

interface MemoryEngineProps {
  memories: MemoryItem[];
  onAddMemory: (memory: Partial<MemoryItem>) => void;
  onDeleteMemory: (id: string) => void;
}

export default function MemoryEngine({
  memories,
  onAddMemory,
  onDeleteMemory
}: MemoryEngineProps) {
  
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<'user' | 'project' | 'agent' | 'team'>('project');
  const [newScore, setNewScore] = useState(8);
  const [newTags, setNewTags] = useState('');

  const filteredMemories = memories.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(search.toLowerCase()) || 
                          item.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    onAddMemory({
      content: newContent,
      type: newType,
      score: newScore,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      timestamp: new Date().toISOString()
    });

    setNewContent('');
    setNewTags('');
    setNewScore(8);
    setShowAddForm(false);
  };

  // Mock Node connections for visual Floating Neural Network Graph SVG
  const visualNodes = [
    { label: 'zeniaverse@gmail.com', x: 100, y: 80, size: 10, fill: '#3b82f6' },
    { label: 'Ollama local:11434', x: 260, y: 150, size: 12, fill: '#10b981' },
    { label: 'OwnWorks beta July 2026', x: 420, y: 100, size: 8, fill: '#6366f1' },
    { label: 'RBAC Clearance level 10', x: 160, y: 220, size: 8, fill: '#ec4899' },
    { label: 'Competitor prices: ScoutPro', x: 340, y: 250, size: 10, fill: '#f59e0b' }
  ];

  return (
    <div id="memory-engine-root" className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Neural Memory Vault & Vector Logs</h2>
          <p className="text-xs text-gray-400 mt-1">
            Store and retrieve vectorized long-term context records. OwnWorks synchronizes semantic matrices into search caches dynamically.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>Inject Context Block</span>
        </button>
      </div>

      {/* Floating graph of memories (Cinematic block) */}
      <div className="bg-[#040507] border border-white/[0.05] rounded-xl h-[280px] p-4 relative overflow-hidden flex flex-col justify-between">
        
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-xs font-mono text-gray-500">
          <Brain className="w-4 h-4 text-blue-400 animate-pulse" />
          <span>REAL-TIME SEMANTIC EMBEDDINGS NETWORK</span>
        </div>

        {/* SVG Node Layout */}
        <div className="flex-1 relative">
          <svg className="absolute inset-0 w-full h-full">
            {/* Connection Lines */}
            <path d="M 100 80 Q 180 115 260 150" fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <path d="M 260 150 Q 340 125 420 100" fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <path d="M 100 80 Q 130 150 160 220" fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <path d="M 160 220 Q 250 235 340 250" fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <path d="M 260 150 Q 300 200 340 250" fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            
            {/* Visual Node Circles and Labels */}
            {visualNodes.map((vn, idx) => (
              <g key={idx}>
                <circle cx={vn.x} cy={vn.y} r={vn.size} fill={vn.fill} fillOpacity="0.2" stroke={vn.fill} strokeWidth="1.5" className="animate-pulse" />
                <circle cx={vn.x} cy={vn.y} r="3" fill={vn.fill} />
                <text x={vn.x + 12} y={vn.y + 4} fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="monospace">
                  {vn.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="text-[10px] font-mono text-gray-600 uppercase border-t border-white/[0.04] pt-2 flex justify-between">
          <span>Active Vectors: 1,248</span>
          <span>Sync Engine: LLaMA Index Embedder with Cosine Proximity</span>
        </div>
      </div>

      {/* Main Grid: Search & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Memory Search & List */}
        <div className="lg:col-span-8 bg-[#0b0e12] border border-white/[0.04] p-5 rounded-xl space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Query semantic tags or strings..."
                className="w-full bg-[#050608] border border-white/[0.06] rounded-lg pl-9 p-2 text-xs text-white outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* Type Filter */}
            <div className="flex bg-black/40 border border-white/[0.06] p-1 rounded-lg">
              {['all', 'user', 'project', 'agent', 'team'].map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`text-[10px] px-2.5 py-1 rounded font-mono uppercase ${
                    typeFilter === type ? 'bg-blue-600/20 text-blue-400 font-bold' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Scrolling items list */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {filteredMemories.length > 0 ? (
              filteredMemories.map(item => (
                <div 
                  key={item.id} 
                  className="p-3 bg-[#0c0f14]/80 border border-white/[0.03] hover:border-blue-500/25 rounded-lg transition-all flex justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 select-text">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                      <span className={`px-2 py-0.5 rounded uppercase ${
                        item.type === 'user' ? 'bg-blue-500/10 text-blue-400' :
                        item.type === 'project' ? 'bg-indigo-500/10 text-indigo-400' :
                        item.type === 'agent' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {item.type}
                      </span>
                      <span className="text-gray-500">• Score Importance: {item.score}/10</span>
                      <span className="text-gray-600 ms-auto">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed font-sans">
                      {item.content}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-[9px] bg-white/[0.03] border border-white/[0.04] px-1.5 py-0.5 rounded text-gray-400 font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteMemory(item.id)}
                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-all h-fit self-center"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-xs text-gray-500 font-mono">
                No matching semantic context found in search vectors.
              </div>
            )}
          </div>

        </div>

        {/* Form Column to add new concept block */}
        <div className="lg:col-span-4">
          
          <div className="bg-[#0b0e12] border border-white/[0.04] p-5 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 border-b border-white/[0.04] pb-3 mb-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Context Injector</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Context Statement</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Insert fact, preference, rule, or system benchmark variable..."
                  className="w-full bg-[#050608] border border-white/[0.06] rounded p-2 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-gray-400 block mb-1">TYPE</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full bg-[#050608] border border-white/[0.06] rounded p-2 text-xs text-white outline-none"
                  >
                    <option value="project">Project Meta</option>
                    <option value="user">User Fact</option>
                    <option value="agent">Agent Direct</option>
                    <option value="team">Team Directive</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-gray-400 block mb-1">MEM-SCORE (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newScore}
                    onChange={e => setNewScore(parseInt(e.target.value))}
                    className="w-full bg-[#050608] border border-white/[0.06] rounded p-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 block mb-1">SEMANTIC TAGS (comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  placeholder="e.g. outreach-v1, timelines, email"
                  className="w-full bg-[#050608] border border-white/[0.06] rounded p-2 text-xs text-white outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded transition-all cursor-pointer"
              >
                Synthesize & Embed Context Block
              </button>
            </form>

          </div>

        </div>

      </div>

    </div>
  );
}
