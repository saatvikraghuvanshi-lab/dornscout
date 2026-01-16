import React, { useState, useEffect } from 'react';
import { UserProfile, Conversation, DirectMessage } from '../types';
import { Send, Search, MoreVertical, Phone, Info, MessageSquare } from 'lucide-react';

interface Props {
  userProfile: UserProfile;
}

const STORAGE_KEY_CONVS = 'dormscout_conversations';

export const UserChats: React.FC<Props> = ({ userProfile }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [inputValue, setInputValue] = useState('');

  // Fetch Conversations from local storage
  useEffect(() => {
    const storedConvs = localStorage.getItem(STORAGE_KEY_CONVS);
    if (storedConvs) {
      const convs = JSON.parse(storedConvs).map((c: any) => ({
        ...c,
        timestamp: new Date(c.timestamp)
      }));
      setConversations(convs);
      if (convs.length > 0 && !selectedChatId) {
        setSelectedChatId(convs[0].id);
      }
    }
  }, []);

  // Fetch Messages for selected chat
  useEffect(() => {
    if (!selectedChatId) return;
    const key = `dormscout_msgs_${selectedChatId}`;
    const storedMsgs = localStorage.getItem(key);
    if (storedMsgs) {
      setMessages(JSON.parse(storedMsgs).map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })));
    } else {
      setMessages([]);
    }
  }, [selectedChatId]);

  const selectedChat = conversations.find(c => c.id === selectedChatId) || null;

  const cardClass = userProfile.theme === 'light' || userProfile.theme === 'muj' ? 'bg-white border-stone-200' : 'bg-gray-800 border-gray-700';
  const itemHoverClass = userProfile.theme === 'light' || userProfile.theme === 'muj' ? 'hover:bg-stone-50' : 'hover:bg-gray-700/50';

  const handleSend = () => {
    if (!inputValue.trim() || !selectedChatId) return;
    
    const newMsg: DirectMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: userProfile.id,
      senderName: userProfile.name,
      text: inputValue,
      timestamp: new Date()
    };

    const updatedMsgs = [...messages, newMsg];
    setMessages(updatedMsgs);
    localStorage.setItem(`dormscout_msgs_${selectedChatId}`, JSON.stringify(updatedMsgs));

    // Update conversation last message
    const updatedConvs = conversations.map(c => 
      c.id === selectedChatId ? { ...c, lastMessage: inputValue, timestamp: new Date() } : c
    );
    setConversations(updatedConvs);
    localStorage.setItem(STORAGE_KEY_CONVS, JSON.stringify(updatedConvs));
    
    setInputValue('');
  };

  return (
    <div className={`h-[calc(100vh-120px)] flex border rounded-3xl overflow-hidden shadow-2xl ${cardClass} animate-in fade-in slide-in-from-bottom-4`}>
      {/* Sidebar - Chat List */}
      <div className="w-full md:w-80 border-r border-inherit flex flex-col">
        <div className="p-4 border-b border-inherit bg-inherit">
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            Messages
            {conversations.length > 0 && (
              <div className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">{conversations.length}</div>
            )}
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className={`w-full rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none ${userProfile.theme === 'light' || userProfile.theme === 'muj' ? 'bg-stone-100' : 'bg-gray-900'}`} 
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((chat) => (
            <button 
              key={chat.id} 
              onClick={() => setSelectedChatId(chat.id)}
              className={`w-full p-4 flex items-center gap-3 text-left transition-all border-b border-inherit ${itemHoverClass} ${selectedChatId === chat.id ? (userProfile.theme === 'light' || userProfile.theme === 'muj' ? 'bg-blue-50' : 'bg-blue-900/10 border-l-4 border-l-blue-600') : ''}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                {chat.participantName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-bold text-sm truncate">{chat.participantName}</h4>
                  <span className="text-[10px] text-gray-500">
                    {chat.timestamp ? chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate leading-relaxed">
                  {chat.lastMessage}
                </p>
              </div>
            </button>
          ))}
          {conversations.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-xs italic">No messages yet. Start a deal from the feed!</div>
          )}
        </div>
      </div>

      {/* Main - Chat Window */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col bg-inherit">
          {/* Chat Header */}
          <div className="p-4 border-b border-inherit flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black">
                {selectedChat.participantName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-sm">{selectedChat.participantName}</h3>
                <span className="text-[10px] text-green-500 font-black uppercase tracking-widest flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Online
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors"><Phone size={18}/></button>
              <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors"><Info size={18}/></button>
              <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors"><MoreVertical size={18}/></button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex justify-center mb-8">
              <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full ${userProfile.theme === 'light' || userProfile.theme === 'muj' ? 'bg-stone-100 text-stone-400' : 'bg-gray-700/50 text-gray-500'}`}>Chat Started</span>
            </div>
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.senderId === userProfile.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] ${m.senderId === userProfile.id ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none' : (userProfile.theme === 'light' || userProfile.theme === 'muj' ? 'bg-stone-100 text-stone-900 rounded-2xl rounded-tl-none' : 'bg-gray-700 text-white rounded-2xl rounded-tl-none')} p-4 shadow-md animate-in fade-in slide-in-from-bottom-2`}>
                  <p className="text-sm font-medium leading-relaxed">{m.text}</p>
                  <div className={`text-[9px] mt-2 font-bold opacity-60 text-right ${m.senderId === userProfile.id ? 'text-blue-50' : ''}`}>
                    {m.timestamp ? m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-inherit">
            <div className="flex gap-3">
              <input 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Message ${selectedChat.participantName}...`} 
                className={`flex-1 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-inner ${userProfile.theme === 'light' || userProfile.theme === 'muj' ? 'bg-stone-100 text-stone-900 placeholder-stone-400' : 'bg-gray-900 text-white placeholder-gray-500'}`} 
              />
              <button 
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-2xl transition-all shadow-lg active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
          <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mb-6 text-blue-600">
            <MessageSquare size={40} />
          </div>
          <h3 className="text-xl font-bold mb-2">Your Conversations</h3>
          <p className="text-sm max-w-xs">Select a student from your messages list to start chatting about deals and items.</p>
        </div>
      )}
    </div>
  );
};