import React, { useState } from 'react';
import { Ticket } from '../types';
import TicketCard from './TicketCard';
import { Search, Filter, Plus, FileDown, BarChart2, AlertCircle, Star, TrendingUp } from 'lucide-react';

interface DashboardProps {
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
  onNewTicket: () => void;
  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tickets, onTicketClick, onNewTicket, notify }) => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Derived Stats
  const highPriorityCount = tickets.filter(t => t.priority === 'High' || t.priority === 'Critical').length;
  const highValueCount = tickets.filter(t => t.customer.isHighValue).length;
  // Simple heuristic for urgent/negative if we had sentiment on the ticket object, here we estimate
  const urgentCount = tickets.filter(t => t.status === 'Escalated').length;

  const filteredTickets = tickets.filter(t => {
    const matchesFilter = filter === 'All' || t.status === filter;
    const matchesSearch = 
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 mb-1">Tickets</h1>
           <p className="text-sm text-gray-500">Manage and triage customer support requests.</p>
        </div>

        {/* Dashboard Mini-Stats */}
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
             <div className="p-2 bg-red-50 rounded-full text-red-600"><AlertCircle size={16} /></div>
             <div>
               <div className="text-xl font-bold text-gray-800 leading-none">{highPriorityCount}</div>
               <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">High Priority</div>
             </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
             <div className="p-2 bg-amber-50 rounded-full text-amber-600"><Star size={16} /></div>
             <div>
               <div className="text-xl font-bold text-gray-800 leading-none">{highValueCount}</div>
               <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">High Value</div>
             </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3 hidden lg:flex">
             <div className="p-2 bg-blue-50 rounded-full text-primary"><TrendingUp size={16} /></div>
             <div>
               <div className="text-xl font-bold text-gray-800 leading-none">{urgentCount}</div>
               <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Escalated</div>
             </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 items-center justify-between bg-white p-2 rounded-xl shadow-sm border border-gray-100">
        
        {/* Left: Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto p-1">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-primary rounded-lg text-sm transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-transparent hover:border-gray-200">
             <Filter size={18} />
          </button>

          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

          <div className="flex p-1 bg-gray-100/50 rounded-lg gap-1 overflow-x-auto max-w-full">
            {['All', 'Open', 'Pending', 'Resolved', 'Closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === status 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end p-1">
           <button 
             onClick={() => notify('Performance metrics are coming in Q3!', 'info')}
             className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
           >
              <BarChart2 size={16} /> <span className="hidden sm:inline">Performance</span>
           </button>
           <button 
             onClick={() => notify('Import feature requires backend integration.', 'info')}
             className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
           >
              <FileDown size={16} /> <span className="hidden sm:inline">Import</span>
           </button>
           <button 
             onClick={onNewTicket}
             className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:bg-primary-hover shadow-sm shadow-blue-200"
           >
              <Plus size={16} /> New Ticket
           </button>
        </div>
      </div>

      {/* Grid */}
      {filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredTickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} onClick={onTicketClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No tickets found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
