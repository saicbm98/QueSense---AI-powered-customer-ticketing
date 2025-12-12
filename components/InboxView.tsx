import React, { useState } from 'react';
import { ChatThread, ChatMessage } from '../types';
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile } from 'lucide-react';
import { MOCK_CHATS } from '../constants';

const InboxView: React.FC = () => {
  const [chats, setChats] = useState<ChatThread[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>(MOCK_CHATS[0].id);
  const [newMessage, setNewMessage] = useState('');

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMsg],
          lastMessage: newMessage,
          lastMessageTime: 'Just now'
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* Sidebar - Chat List */}
      <div className="w-full md:w-80 border-r border-gray-200 flex flex-col bg-neutral-bg">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Inbox</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div 
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-100 ${activeChatId === chat.id ? 'bg-blue-50 hover:bg-blue-50' : 'bg-white'}`}
            >
              <div className="flex gap-3">
                <div className="relative">
                  {chat.avatarUrl ? (
                     <img src={chat.avatarUrl} alt={chat.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold">
                       {chat.name.substring(0,2).toUpperCase()}
                     </div>
                  )}
                  {chat.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`text-sm font-semibold truncate ${activeChatId === chat.id ? 'text-primary' : 'text-gray-900'}`}>{chat.name}</span>
                    <span className="text-[10px] text-gray-500">{chat.lastMessageTime}</span>
                  </div>
                  <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unreadCount > 0 && (
                   <div className="flex flex-col justify-center">
                     <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                       {chat.unreadCount}
                     </span>
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0">
           <div className="flex items-center gap-3">
             <div className="relative">
                {activeChat.avatarUrl ? (
                   <img src={activeChat.avatarUrl} alt={activeChat.name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                   <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-xs">
                     {activeChat.name.substring(0,2).toUpperCase()}
                   </div>
                )}
                {activeChat.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                )}
             </div>
             <div>
               <h3 className="text-sm font-bold text-gray-900">{activeChat.name}</h3>
               <span className="text-xs text-green-600 flex items-center gap-1">
                 {activeChat.isOnline ? 'Active now' : 'Offline'}
               </span>
             </div>
           </div>
           
           <div className="flex items-center gap-4 text-gray-400">
             <button className="hover:text-primary transition-colors"><Phone size={20} /></button>
             <button className="hover:text-primary transition-colors"><Video size={20} /></button>
             <button className="hover:text-gray-600 transition-colors"><MoreVertical size={20} /></button>
           </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
           {activeChat.messages.map(msg => (
             <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                 msg.senderId === 'me' 
                   ? 'bg-primary text-white rounded-br-none' 
                   : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
               }`}>
                 <p>{msg.text}</p>
                 <p className={`text-[10px] mt-1 text-right ${msg.senderId === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                   {msg.timestamp}
                 </p>
               </div>
             </div>
           ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
             <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-200">
               <Paperclip size={20} />
             </button>
             <textarea 
               value={newMessage}
               onChange={(e) => setNewMessage(e.target.value)}
               placeholder="Type a message..."
               className="flex-1 bg-transparent border-none focus:ring-0 text-sm max-h-32 resize-none py-2.5"
               rows={1}
               onKeyDown={(e) => {
                 if(e.key === 'Enter' && !e.shiftKey) {
                   e.preventDefault();
                   handleSendMessage(e);
                 }
               }}
             />
             <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-200">
               <Smile size={20} />
             </button>
             <button 
               type="submit" 
               disabled={!newMessage.trim()}
               className="p-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
             >
               <Send size={18} />
             </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InboxView;
