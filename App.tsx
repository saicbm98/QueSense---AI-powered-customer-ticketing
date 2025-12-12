import React, { useState, useRef, useEffect } from 'react';
import { Ticket, AppConfig, ToastMessage } from './types';
import { MOCK_TICKETS, INITIAL_CONFIG } from './constants';
import Dashboard from './components/Dashboard';
import TicketDetail from './components/TicketDetail';
import SettingsModal from './components/SettingsModal';
import InboxView from './components/InboxView';
import NewTicketModal from './components/NewTicketModal';
import AnalyticsView from './components/AnalyticsView';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import CustomersView from './components/CustomersView';
import Toast from './components/Toast';
import { Layout, Bell, HelpCircle, User, LogOut, Settings, MessageSquare, Book, BarChart, Users } from 'lucide-react';

const App: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [config, setConfig] = useState<AppConfig>(INITIAL_CONFIG);

  // UI State
  const [activeTab, setActiveTab] = useState('Tickets');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  
  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Refs for click outside
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseDetail = () => {
    setSelectedTicket(null);
  };

  const handleUpdateConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
  };

  const handleAddTicket = (newTicket: Ticket) => {
    setTickets([newTicket, ...tickets]);
    addToast('New ticket created successfully', 'success');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Tickets':
        return (
          <Dashboard 
            tickets={tickets} 
            onTicketClick={handleTicketClick} 
            onNewTicket={() => setIsNewTicketOpen(true)}
            notify={addToast}
          />
        );
      case 'Inbox':
        return <InboxView />;
      case 'Knowledge Base':
        return <KnowledgeBaseView notify={addToast} />;
      case 'Analytics':
        return <AnalyticsView />;
      case 'Customers':
        return <CustomersView notify={addToast} />;
      default:
        return (
          <Dashboard 
            tickets={tickets} 
            onTicketClick={handleTicketClick} 
            onNewTicket={() => setIsNewTicketOpen(true)}
            notify={addToast}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg font-sans text-gray-900 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 h-16 sticky top-0 z-30 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('Tickets')}>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md shadow-blue-200">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
               </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">QueueSense</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
             {['Inbox', 'Knowledge Base', 'Analytics', 'Tickets', 'Customers'].map((item) => (
               <button 
                 key={item}
                 onClick={() => setActiveTab(item)}
                 className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                   activeTab === item 
                     ? 'text-primary bg-blue-50' 
                     : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                 }`}
               >
                 {item}
               </button>
             ))}
          </nav>
        </div>

        {/* Right User Actions */}
        <div className="flex items-center gap-4">
          
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`text-gray-400 hover:text-gray-600 transition-colors relative p-1.5 rounded-full ${showNotifications ? 'bg-gray-100 text-primary' : ''}`}
              title="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in-down origin-top-right">
                <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                  <span className="font-semibold text-sm text-gray-800">Notifications</span>
                  <span className="text-[11px] text-primary font-medium cursor-pointer hover:underline" onClick={() => addToast("Marked all as read", "success")}>Mark all read</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-semibold text-gray-800">New high priority ticket</p>
                      <span className="text-[10px] text-primary bg-blue-50 px-1.5 py-0.5 rounded">New</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">Acme Corp reported critical login issues with SSO.</p>
                    <p className="text-[10px] text-gray-400 mt-2">2 min ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors">
                     <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-semibold text-gray-800">Mentioned by Sarah</p>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">"Can you check this billing logic for the new Enterprise plan?"</p>
                    <p className="text-[10px] text-gray-400 mt-2">1 hour ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors opacity-60">
                     <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-medium text-gray-800">System Maintenance</p>
                    </div>
                    <p className="text-xs text-gray-600">Scheduled maintenance tonight at 2 AM UTC.</p>
                    <p className="text-[10px] text-gray-400 mt-2">5 hours ago</p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-gray-50 text-center">
                  <span className="text-xs font-medium text-gray-500 hover:text-gray-800 cursor-pointer" onClick={() => addToast("Viewing all notifications", "info")}>View all notifications</span>
                </div>
              </div>
            )}
          </div>

          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors" 
            title="Help"
            onClick={() => addToast('Help Center is currently undergoing maintenance.', 'info')}
          >
            <HelpCircle size={20} />
          </button>
          
          <div className="h-6 w-px bg-gray-200"></div>
          
          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-full pr-3 transition-colors border ${showProfileMenu ? 'border-gray-200 bg-gray-50' : 'border-transparent hover:border-gray-100'}`}
            >
              <div className="w-8 h-8 bg-gradient-to-tr from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                TT
              </div>
              <div className="hidden lg:block text-left">
                 <div className="text-xs font-bold text-gray-800">Toni Tags</div>
                 <div className="text-[10px] text-gray-500">Support Manager</div>
              </div>
            </div>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fade-in-down origin-top-right">
                <div className="px-4 py-4 border-b border-gray-50 mb-1 bg-gray-50/50 rounded-t-xl">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gradient-to-tr from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      TT
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Toni Tags</p>
                      <p className="text-xs text-gray-500 truncate max-w-[140px]">toni.tags@queuesense.com</p>
                    </div>
                  </div>
                </div>
                
                <div className="py-1">
                  <button 
                    onClick={() => addToast('Opening user profile...', 'info')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary flex items-center gap-3 transition-colors"
                  >
                    <User size={16} /> My Profile
                  </button>
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      setIsSettingsOpen(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary flex items-center gap-3 transition-colors"
                  >
                    <Settings size={16} /> Settings
                  </button>
                </div>
                
                <div className="h-px bg-gray-100 my-1"></div>
                
                <div className="py-1">
                  <button 
                    onClick={() => addToast('Signing out...', 'info')}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative">
        {renderContent()}
      </main>

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-[70] flex flex-col gap-3">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>

      {/* Detail Overlay */}
      {selectedTicket && (
        <TicketDetail 
          ticket={selectedTicket} 
          config={config} 
          onClose={handleCloseDetail}
          onUpdateConfig={handleUpdateConfig}
          notify={addToast}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onUpdateConfig={handleUpdateConfig}
      />

      {/* New Ticket Modal */}
      <NewTicketModal 
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        onSave={handleAddTicket}
      />
    </div>
  );
};

export default App;
