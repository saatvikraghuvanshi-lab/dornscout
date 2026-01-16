
import React, { useState, useEffect, useRef } from 'react';
import { MarketplaceItem, ChatMessage, UserProfile } from '../types';
import { Send, User, Bot, AlertCircle, Calendar, CreditCard, Banknote, QrCode } from 'lucide-react';
import { startNegotiationSession } from '../services/geminiService';

interface Props {
  item: MarketplaceItem;
  userProfile: UserProfile;
  onClose: () => void;
}

export const AgentChat: React.FC<Props> = ({ item, userProfile, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [negotiationPhase, setNegotiationPhase] = useState<'chatting' | 'agreed' | 'payment'>('chatting');
  const [agreedPrice, setAgreedPrice] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash' | null>(null);
  
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isThinking]);

  useEffect(() => {
    const initChat = async () => {
      setIsThinking(true);
      try {
        const session = startNegotiationSession(userProfile.vibe, userProfile.budgetLimit);
        chatRef.current = session;

        const prompt = `Initiate contact for the item: "${item.title}" priced at ₹${item.price} in the campus dorm. 
        Note: ${item.interestedBuyersCount} others are interested. ${item.highestBid ? `Highest bid is ₹${item.highestBid}.` : ''}
        Negotiate a fair deal or bid if necessary.`;
        
        const response = await session.sendMessage({ message: prompt });
        setMessages([{
          id: Date.now().toString(),
          sender: 'agent',
          text: response.text || `Hello! I'm Arbitrator. I see ₹${item.price} for "${item.title}". Let's discuss.`,
          timestamp: new Date()
        }]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsThinking(false);
      }
    };
    initChat();
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || !chatRef.current) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'seller', text: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    try {
      const response = await chatRef.current.sendMessage({ message: inputValue });
      const text = response.text || "";
      
      // Look for agreement patterns in text
      if (text.includes('AGREED_PRICE:')) {
        const match = text.match(/AGREED_PRICE:\s*(\d+)/);
        if (match) {
          setAgreedPrice(parseInt(match[1]));
          setNegotiationPhase('agreed');
        }
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text,
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-gray-900 w-full max-w-2xl h-[80vh] rounded-2xl border border-gray-700 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-black text-white">Arbitrator Agent</h3>
              <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Campus Bargaining Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2">✕</button>
        </div>

        {/* Chat / Payment Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {negotiationPhase === 'chatting' && (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === 'agent' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl ${m.sender === 'agent' ? 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                      <div className="flex items-center gap-1 mb-1 opacity-50 text-[10px] uppercase tracking-widest font-black">
                        {m.sender === 'agent' ? 'Arbitrator' : 'Seller'}
                      </div>
                      <div className="text-sm font-medium">{m.text}</div>
                    </div>
                  </div>
                ))}
                {isThinking && <div className="animate-pulse text-xs text-blue-500 font-bold ml-4">AGENT ANALYZING OFFER...</div>}
              </div>
              <div className="p-4 border-t border-gray-800 bg-gray-800/30">
                <div className="flex gap-3">
                  <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type seller response..." className="flex-1 bg-gray-900 border border-gray-700 rounded-2xl px-5 py-3 text-sm focus:border-blue-500 outline-none" />
                  <button onClick={handleSend} className="bg-blue-600 p-3 rounded-2xl"><Send size={20} /></button>
                </div>
              </div>
            </>
          )}

          {negotiationPhase === 'agreed' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={48} />
              </div>
              <h2 className="text-2xl font-black">DEAL REACHED!</h2>
              <p className="text-gray-400">The agent has negotiated a price of <span className="text-white font-bold">₹{agreedPrice}</span>. How would you like to pay the seller?</p>
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <button onClick={() => { setPaymentMethod('UPI'); setNegotiationPhase('payment'); }} className="flex flex-col items-center gap-3 bg-gray-800 border border-gray-700 p-6 rounded-2xl hover:border-blue-500 transition-all group">
                  <CreditCard className="group-hover:text-blue-500" size={32} />
                  <span className="font-bold">UPI</span>
                </button>
                <button onClick={() => { setPaymentMethod('Cash'); setNegotiationPhase('payment'); }} className="flex flex-col items-center gap-3 bg-gray-800 border border-gray-700 p-6 rounded-2xl hover:border-green-500 transition-all group">
                  <Banknote className="group-hover:text-green-500" size={32} />
                  <span className="font-bold">Cash</span>
                </button>
              </div>
            </div>
          )}

          {negotiationPhase === 'payment' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 bg-gray-900/50">
              <h2 className="text-2xl font-black uppercase tracking-tight">Finalizing Deal</h2>
              {paymentMethod === 'UPI' ? (
                <div className="space-y-6 flex flex-col items-center">
                  <p className="text-blue-400 font-bold text-sm">Scan the Seller's QR Code below to pay ₹{agreedPrice}</p>
                  <div className="bg-white p-4 rounded-3xl shadow-2xl">
                    <QrCode size={200} className="text-black" />
                    <p className="text-[10px] text-gray-400 mt-2 font-black uppercase">Official Dorm Merchant</p>
                  </div>
                  <p className="text-xs text-gray-500">Transaction ID: DORM-SCOUT-{Math.random().toString(36).substr(2, 9)}</p>
                </div>
              ) : (
                <div className="space-y-6 flex flex-col items-center">
                   <div className="bg-green-500/10 p-8 rounded-full">
                     <Banknote size={64} className="text-green-500" />
                   </div>
                   <p className="text-green-400 font-bold">Coordinate a meeting for Cash Exchange of ₹{agreedPrice}</p>
                   <button className="bg-green-600 px-8 py-3 rounded-xl font-bold">Confirm Meeting Time</button>
                </div>
              )}
              <button onClick={onClose} className="bg-white text-black px-12 py-3 rounded-xl font-black hover:bg-gray-200">DONE</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
