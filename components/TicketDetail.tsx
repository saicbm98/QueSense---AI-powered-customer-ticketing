import React, { useState, useEffect } from 'react';
import { Ticket, AIAnalysisResult, AppConfig } from '../types';
import { analyzeTicket, generateReplyDraft } from '../services/geminiService';
import { 
  X, Send, Sparkles, User, AlertTriangle, 
  ThumbsUp, ThumbsDown, MessageSquare, Copy, RefreshCw,
  MoreHorizontal, ChevronDown, Paperclip
} from 'lucide-react';

interface TicketDetailProps {
  ticket: Ticket;
  config: AppConfig;
  onClose: () => void;
  onUpdateConfig: (newConfig: AppConfig) => void;
  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ ticket, config, onClose, onUpdateConfig, notify }) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [replyDraft, setReplyDraft] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  
  const [showConfig, setShowConfig] = useState(false);
  const [tempConfig, setTempConfig] = useState<AppConfig>(config);

  useEffect(() => {
    // Sync local config state if the global config prop changes
    setTempConfig(config);
  }, [config]);

  useEffect(() => {
    // Reset state when ticket changes
    setAnalysis(null);
    setReplyDraft('');
    
    // Auto-trigger analysis
    const runAnalysis = async () => {
      setIsAnalyzing(true);
      const result = await analyzeTicket(ticket);
      setAnalysis(result);
      setIsAnalyzing(false);
    };

    // Auto-trigger draft
    const runDraft = async () => {
      setIsDrafting(true);
      const draft = await generateReplyDraft(ticket, config);
      setReplyDraft(draft || '');
      setIsDrafting(false);
    };

    runAnalysis();
    runDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket]); // config dependency omitted to avoid re-running on every keystroke in config, manually handled

  const handleRegenerate = async (instruction?: string) => {
    setIsDrafting(true);
    const draft = await generateReplyDraft(ticket, config, instruction);
    setReplyDraft(draft || '');
    setIsDrafting(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(replyDraft);
    notify('Draft copied to clipboard!', 'success');
  };

  const saveConfig = () => {
    onUpdateConfig(tempConfig);
    setShowConfig(false);
    handleRegenerate(); // Regenerate with new tone
    notify('AI Settings saved & reply regenerated', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Header */}
        <div className="h-16 border-b px-6 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-mono text-sm">{ticket.id}</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md uppercase">
                  {ticket.status}
                </span>
              </div>
              <h2 className="font-bold text-gray-800 text-sm truncate max-w-md">{ticket.subject}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setShowConfig(!showConfig)}
               className="text-sm font-medium text-gray-600 hover:text-primary flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200"
             >
               <Sparkles size={16} />
               <span>Config AI</span>
             </button>
             <button 
               onClick={() => notify(`Reply sent to ${ticket.customer.name}`, 'success')}
               className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
             >
               <Send size={16} />
               Reply via Email
             </button>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-neutral-bg">
          
          {/* Left: Conversation & Metadata */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            
            {/* Customer Info Card */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-primary font-bold">
                  {ticket.customer.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{ticket.customer.name}</div>
                  <div className="text-xs text-gray-500">{ticket.customer.company}</div>
                </div>
              </div>
              <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
              <div className="grid grid-cols-3 gap-6 text-sm flex-1">
                 <div>
                   <span className="text-gray-500 text-xs block mb-0.5">Plan</span>
                   <span className="font-medium text-gray-800">{ticket.customer.plan}</span>
                 </div>
                 <div>
                   <span className="text-gray-500 text-xs block mb-0.5">MRR</span>
                   <span className="font-medium text-gray-800">${ticket.customer.mrr}</span>
                 </div>
                 <div>
                   <span className="text-gray-500 text-xs block mb-0.5">Value</span>
                   <span className={`font-semibold ${ticket.customer.isHighValue ? 'text-green-600' : 'text-gray-600'}`}>
                     {ticket.customer.isHighValue ? 'High' : 'Normal'}
                   </span>
                 </div>
              </div>
            </div>

            {/* Config Panel (Inline/Overlay) */}
            {showConfig && (
              <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-md animate-fade-in relative">
                 <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                   <Sparkles size={16} className="text-primary"/> 
                   AI Configuration
                 </h3>
                 <div className="space-y-3">
                   <div>
                     <label className="block text-xs font-semibold text-gray-600 mb-1">Tone</label>
                     <select 
                       className="w-full border border-gray-300 rounded-md text-sm p-2"
                       value={tempConfig.brandTone}
                       onChange={(e) => setTempConfig({...tempConfig, brandTone: e.target.value})}
                     >
                       <option>Friendly</option>
                       <option>Formal</option>
                       <option>Concise</option>
                       <option>Empathetic</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-gray-600 mb-1">Tone Description</label>
                     <textarea 
                       className="w-full border border-gray-300 rounded-md text-sm p-2 h-16"
                       value={tempConfig.toneDescription}
                       onChange={(e) => setTempConfig({...tempConfig, toneDescription: e.target.value})}
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-gray-600 mb-1">Knowledge Context</label>
                     <textarea 
                       className="w-full border border-gray-300 rounded-md text-sm p-2 h-24 font-mono text-xs"
                       value={tempConfig.knowledgeContext}
                       onChange={(e) => setTempConfig({...tempConfig, knowledgeContext: e.target.value})}
                     />
                   </div>
                   <div className="flex justify-end gap-2 pt-2">
                     <button onClick={() => setShowConfig(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                     <button onClick={saveConfig} className="px-3 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary-hover">Save & Regenerate</button>
                   </div>
                 </div>
              </div>
            )}

            {/* Conversation History */}
            <div className="space-y-6">
              <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                    <User size={14} className="text-gray-500"/>
                 </div>
                 <div className="flex-1">
                   <div className="flex items-baseline justify-between mb-1">
                     <span className="font-bold text-gray-800 text-sm">{ticket.customer.name}</span>
                     <span className="text-xs text-gray-400">Today, 10:23 AM</span>
                   </div>
                   <div className="bg-white p-4 rounded-lg rounded-tl-none border border-gray-200 shadow-sm text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                     {ticket.body}
                   </div>
                 </div>
              </div>
            </div>
            
          </div>

          {/* Right: AI Analysis & Draft */}
          <div className="w-full md:w-[400px] border-l border-gray-200 bg-white flex flex-col shadow-[0_0_15px_rgba(0,0,0,0.03)] z-10">
            
            {/* AI Summary Section */}
            <div className="p-5 border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles size={14} className="text-primary" />
                AI Analysis
              </h3>
              
              {isAnalyzing ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : analysis ? (
                <div className="space-y-4">
                  <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                    <p className="text-sm text-gray-700 leading-snug">{analysis.summary}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <div className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1
                      ${analysis.sentiment === 'Negative' || analysis.sentiment === 'Urgent' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}
                    `}>
                      {analysis.sentiment === 'Urgent' && <AlertTriangle size={10} />}
                      Sentiment: {analysis.sentiment}
                    </div>
                    
                    <div className={`px-2 py-1 rounded-md text-xs font-medium
                      ${analysis.suggestedPriority === 'High' || analysis.suggestedPriority === 'Critical' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-600'}
                    `}>
                      Suggested Priority: {analysis.suggestedPriority}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {analysis.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium border border-gray-200">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {analysis.confidenceScore < 0.7 && (
                    <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-100">
                      <AlertTriangle size={12} />
                      Low confidence, please verify details.
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-400">Analysis unavailable</div>
              )}
            </div>

            {/* AI Reply Draft Section */}
            <div className="flex-1 flex flex-col p-5 bg-white">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2"><MessageSquare size={14} className="text-primary"/> AI Reply Draft</span>
                {isDrafting && <span className="text-primary text-[10px] animate-pulse">Drafting...</span>}
              </h3>

              <div className="flex-1 relative group">
                <textarea 
                  className="w-full h-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-sans leading-relaxed"
                  value={replyDraft}
                  onChange={(e) => setReplyDraft(e.target.value)}
                  placeholder="AI is writing a draft..."
                  disabled={isDrafting}
                />
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={copyToClipboard} className="p-1.5 bg-white shadow rounded hover:text-primary border border-gray-200" title="Copy">
                    <Copy size={14}/>
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleRegenerate('Make it shorter and more concise')}
                  disabled={isDrafting}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronDown size={14} /> Shorter
                </button>
                 <button 
                  onClick={() => handleRegenerate('Add more detail and explanation')}
                  disabled={isDrafting}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
                >
                  <MoreHorizontal size={14} /> Detailed
                </button>
                <button 
                  onClick={() => handleRegenerate()}
                  disabled={isDrafting}
                  className="col-span-2 px-3 py-2.5 bg-sky text-primary rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} className={isDrafting ? "animate-spin" : ""} />
                  Regenerate Reply
                </button>
              </div>

              <div className="mt-3 text-center">
                 <span className="text-[10px] text-gray-400">Review carefully. AI can make mistakes.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
