import React from 'react';
import { Ticket } from '../types';
import { Clock, User } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-700';
      case 'Escalated': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getProgressWidth = (status: string) => {
    switch (status) {
      case 'Open': return 'w-1/4';
      case 'In Progress': return 'w-2/4';
      case 'Pending': return 'w-2/4';
      case 'Escalated': return 'w-2/4';
      case 'Resolved': return 'w-full';
      case 'Closed': return 'w-full';
      default: return 'w-0';
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return '< 1h ago';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div 
      onClick={() => onClick(ticket)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-medium text-gray-400">{ticket.id}</span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
            {ticket.status}
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">{ticket.subject}</h3>
        <p className="text-xs text-medium-gray mb-4 font-medium">{ticket.customer.company}</p>

        <div className="flex items-center gap-2 mb-3">
          {ticket.assignedAgent ? (
            <img src={ticket.assignedAgent.avatarUrl} alt="Agent" className="w-6 h-6 rounded-full" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={12} className="text-gray-400"/>
            </div>
          )}
          <span className="text-xs text-gray-600">
            {ticket.assignedAgent ? `Assigned to: ${ticket.assignedAgent.name}` : 'Unassigned'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-sky text-primary px-2 py-1 rounded-md font-medium">
            {ticket.category}
          </span>
           <span className={`text-xs px-2 py-1 rounded-md font-medium border ${
             ticket.priority === 'High' || ticket.priority === 'Critical' 
               ? 'border-alert-red text-alert-red' 
               : 'border-gray-200 text-gray-500'
           }`}>
            Priority: {ticket.priority}
          </span>
        </div>
        
        {ticket.aiSummary && (
          <div className="bg-gray-50 p-2 rounded-lg mb-4">
             <p className="text-xs text-gray-600 line-clamp-2">
               <span className="font-bold text-primary mr-1">AI:</span>
               {ticket.aiSummary}
             </p>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center text-xs text-gray-400 mb-2">
            <Clock size={12} className="mr-1" />
            Last update: {timeAgo(ticket.updatedAt)}
        </div>
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div className={`h-full bg-primary ${getProgressWidth(ticket.status)}`}></div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
