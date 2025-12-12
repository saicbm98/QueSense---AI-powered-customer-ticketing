import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Ticket, TicketPriority, TicketStatus } from '../types';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticket: Ticket) => void;
}

const NewTicketModal: React.FC<NewTicketModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    subject: '',
    customerName: '',
    company: '',
    description: '',
    priority: 'Medium' as TicketPriority,
    category: 'General'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new ticket object
    const newTicket: Ticket = {
      id: `#TICK${Math.floor(1000 + Math.random() * 9000)}`,
      subject: formData.subject,
      body: formData.description,
      status: 'Open' as TicketStatus,
      priority: formData.priority,
      category: formData.category,
      customer: {
        id: `c_${Date.now()}`,
        name: formData.customerName,
        company: formData.company,
        plan: 'Starter', // Default
        mrr: 0,
        isHighValue: false,
        joinedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiSummary: 'New ticket, pending AI analysis.',
    };

    onSave(newTicket);
    onClose();
    // Reset form
    setFormData({
      subject: '',
      customerName: '',
      company: '',
      description: '',
      priority: 'Medium',
      category: 'General'
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-down mx-4">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Create New Ticket</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
           <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
             <input 
               required
               type="text"
               className="w-full border border-gray-300 rounded-lg text-sm p-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
               placeholder="E.g. Unable to login..."
               value={formData.subject}
               onChange={e => setFormData({...formData, subject: e.target.value})}
             />
           </div>
           
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Customer Name</label>
               <input 
                 required
                 type="text"
                 className="w-full border border-gray-300 rounded-lg text-sm p-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                 placeholder="John Doe"
                 value={formData.customerName}
                 onChange={e => setFormData({...formData, customerName: e.target.value})}
               />
             </div>
             <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Company</label>
               <input 
                 required
                 type="text"
                 className="w-full border border-gray-300 rounded-lg text-sm p-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                 placeholder="Acme Inc."
                 value={formData.company}
                 onChange={e => setFormData({...formData, company: e.target.value})}
               />
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
               <select 
                 className="w-full border border-gray-300 rounded-lg text-sm p-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                 value={formData.priority}
                 onChange={e => setFormData({...formData, priority: e.target.value as TicketPriority})}
               >
                 <option value="Low">Low</option>
                 <option value="Medium">Medium</option>
                 <option value="High">High</option>
                 <option value="Critical">Critical</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
               <select 
                 className="w-full border border-gray-300 rounded-lg text-sm p-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                 value={formData.category}
                 onChange={e => setFormData({...formData, category: e.target.value})}
               >
                 <option value="General">General</option>
                 <option value="Billing">Billing</option>
                 <option value="Technical">Technical</option>
                 <option value="Feature Request">Feature Request</option>
                 <option value="Bug">Bug</option>
               </select>
             </div>
           </div>
           
           <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
             <textarea 
               required
               className="w-full border border-gray-300 rounded-lg text-sm p-3 h-32 resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
               placeholder="Describe the issue..."
               value={formData.description}
               onChange={e => setFormData({...formData, description: e.target.value})}
             />
           </div>

           <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary-hover shadow-sm flex items-center gap-2 transition-colors"
            >
              <Save size={16} /> Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTicketModal;
