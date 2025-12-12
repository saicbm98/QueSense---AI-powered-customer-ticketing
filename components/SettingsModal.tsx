import React, { useState, useEffect } from 'react';
import { AppConfig } from '../types';
import { X, Save, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onUpdateConfig }) => {
  const [tempConfig, setTempConfig] = useState<AppConfig>(config);

  useEffect(() => {
    setTempConfig(config);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateConfig(tempConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-down mx-4">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Sparkles size={18} className="text-primary"/>
            Global AI Settings
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
           <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">Brand Tone</label>
             <select 
               className="w-full border border-gray-300 rounded-lg text-sm p-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
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
             <label className="block text-sm font-semibold text-gray-700 mb-1">Tone Description</label>
             <p className="text-xs text-gray-500 mb-2">Describe how the AI should sound to your customers.</p>
             <textarea 
               className="w-full border border-gray-300 rounded-lg text-sm p-3 h-24 resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
               value={tempConfig.toneDescription}
               onChange={(e) => setTempConfig({...tempConfig, toneDescription: e.target.value})}
             />
           </div>
           
           <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">Knowledge Context</label>
             <p className="text-xs text-gray-500 mb-2">Paste FAQs or key facts the AI should know.</p>
             <textarea 
               className="w-full border border-gray-300 rounded-lg text-sm p-3 h-32 font-mono text-xs resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
               value={tempConfig.knowledgeContext}
               onChange={(e) => setTempConfig({...tempConfig, knowledgeContext: e.target.value})}
             />
           </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary-hover shadow-sm flex items-center gap-2 transition-colors"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;