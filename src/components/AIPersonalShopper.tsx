import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Gift, 
  Truck, 
  Clock, 
  Plus, 
  Check, 
  User, 
  HelpCircle,
  ArrowRight,
  ShoppingBag,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../lib/store';
import { playBtnTap, playSuccessChime } from '../lib/sound';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  finalizedCake?: {
    productName: string;
    price: number;
    description: string;
    categories: string;
    flavors: string;
    occasions: string;
  };
}

export function AIPersonalShopper() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I am your CakeUrban AI Personal Shopper. 🍰 I'm here to help you choose the perfect dessert, suggest a customized design, or coordinate elite hampers for your loved ones. How can I sweeten your day? ✨"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const cart = useCart();

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const handleOpenEvent = (e: Event) => {
      setIsOpen(true);
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.message) {
        // Run after state is updated or immediately
        setTimeout(() => {
          handleSendMessage(customEvent.detail.message);
        }, 100);
      }
    };
    window.addEventListener('open-cake-ai-shopper', handleOpenEvent);
    return () => {
      window.removeEventListener('open-cake-ai-shopper', handleOpenEvent);
    };
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;
    
    playBtnTap();
    const userMsg = textToSend.trim();
    setInput('');
    
    // Add user message to state
    const updatedMessages = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/discuss-cake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to discuss with AI');
      }

      const data = await response.json();
      
      // Parse response from API
      let aiContent = data.text || "I was unable to understand your requirement, but I can suggest our rich Belgian Chocolate Truffles! 🍫";
      let finalizedCake = data.finalizedCake;

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiContent,
        finalizedCake: finalizedCake
      }]);

      if (finalizedCake) {
        playSuccessChime();
        toast.success(`Exclusive Chef Creation Drafted! 🎉`, {
          description: `"${finalizedCake.productName}" is ready to add directly to your cart.`
        });
      }

    } catch (err) {
      console.error("AI Chat Error:", err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Mafi chahta hoon! My gourmet memory card is facing high traffic. But you can check our exquisite shop catalog for instant ordering! 🎂"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const addCustomCakeToCart = (cake: any) => {
    playBtnTap();
    
    // Build a unique Product object out of the AI spec conforming to types.ts
    const customProduct = {
      id: `ai-custom-${Date.now()}`,
      name: cake.productName,
      price: Number(cake.price) || 1499,
      description: cake.description || "Bespoke Chef Selection",
      images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600"],
      categories: cake.categories ? [cake.categories] : ["Custom Cakes"],
      flavors: cake.flavors ? [cake.flavors] : ["Belgian Truffle"],
      occasions: cake.occasions ? [cake.occasions] : ["Celebration"],
      stockStatus: 'in-stock' as const,
      isCustomizable: true,
      isBestseller: true,
      weights: [0.5, 1, 2],
      rating: 5.0,
      reviewsCount: 1
    };

    cart.addItem(customProduct, {
      selectedWeight: 1,
      selectedFlavor: customProduct.flavors[0].trim()
    });

    playSuccessChime();
    toast.success("Bespoke creation added to Cart! 🛒", {
      description: `"${cake.productName}" has been successfully added.`
    });
  };

  const suggestions = [
    { text: "Recommend chocolate anniversary cakes 🍫", icon: Gift },
    { text: "Help me design a kids' custom birthday cake 🎈", icon: Sparkles },
    { text: "Do you deliver eggless cakes in Noida Sector 62? 🚚", icon: Truck },
    { text: "What is your fastest delivery time in Gurgaon? ⚡", icon: Clock }
  ];

  return (
    <>
      {/* =========================================================
          FLOATING TRIGGER BUTTON (Desktop Bottom-Right / Mobile Bottom-Center)
          ========================================================= */}
      <div className="fixed bottom-6 right-6 md:right-8 z-50 flex items-center justify-end select-none">
        <motion.button
          onClick={() => {
            setIsOpen(!isOpen);
            playBtnTap();
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-pink-600 via-purple-600 to-[#DFB15B] text-white flex items-center justify-center shadow-[0_8px_32px_rgba(236,72,153,0.3)] hover:shadow-[0_12px_40px_rgba(236,72,153,0.5)] border border-white/20 cursor-pointer overflow-hidden group"
          id="ai-assistant-trigger"
        >
          {/* Internal rotating light flare */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-glossy-sheen pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative flex items-center justify-center"
              >
                <MessageSquare className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse border border-white/30" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* =========================================================
          PREMIUM CHAT EXPANSION PANEL
          ========================================================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            className="fixed bottom-24 right-6 w-[calc(100vw-48px)] sm:w-[420px] h-[550px] bg-[#120806]/95 backdrop-blur-3xl border border-white/10 rounded-[36px] shadow-2xl shadow-pink-500/5 overflow-hidden z-50 flex flex-col text-[#FFFDFB] text-left"
            id="ai-assistant-panel"
          >
            {/* Header Area */}
            <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-[#DFB15B] p-[1px] shadow-inner flex items-center justify-center">
                  <div className="w-full h-full rounded-2xl bg-[#140603] flex items-center justify-center">
                    <Sparkles className="w-4.5 h-4.5 text-pink-400 fill-pink-400/10 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                    CakeUrban AI Shopper
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Artisanal Sommelier Engine</span>
                </div>
              </div>
              <button 
                onClick={() => { setIsOpen(false); playBtnTap(); }}
                className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Chat Body & Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg, index) => {
                const isAI = msg.role === 'assistant';
                return (
                  <div key={index} className={`flex ${isAI ? 'justify-start' : 'justify-end'} items-start gap-2.5`}>
                    
                    {isAI && (
                      <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0 text-pink-400 font-bold text-[10px]">
                        AI
                      </div>
                    )}
                    
                    <div className="space-y-2 max-w-[80%]">
                      {/* Conversational Text Bubble */}
                      <div 
                        className={`p-4 rounded-3xl text-xs sm:text-[13px] leading-relaxed font-medium ${
                          isAI 
                            ? 'bg-white/5 border border-white/5 text-slate-200 rounded-tl-sm' 
                            : 'bg-gradient-to-br from-pink-600 to-purple-600 text-white rounded-tr-sm shadow-md'
                        }`}
                      >
                        {msg.content}
                      </div>

                      {/* structuredized custom cake box (chef card offering) */}
                      {isAI && msg.finalizedCake && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-[#1f0d09] border border-[#DFB15B]/20 rounded-2xl p-4 space-y-3 shadow-xl"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9px] uppercase font-black text-[#DFB15B] tracking-wider block leading-none mb-1">Elite Confection Architect Draft</span>
                              <h5 className="text-sm font-black text-white">{msg.finalizedCake.productName}</h5>
                            </div>
                            <span className="text-sm font-black text-[#DFB15B] font-mono">₹{msg.finalizedCake.price}</span>
                          </div>
                          
                          <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                            {msg.finalizedCake.description}
                          </p>

                          <div className="flex flex-wrap gap-1.5">
                            {msg.finalizedCake.flavors && (
                              <span className="text-[9px] px-2 py-0.5 bg-white/5 rounded-md text-pink-300 font-bold">
                                {msg.finalizedCake.flavors.split(',')[0]}
                              </span>
                            )}
                            {msg.finalizedCake.categories && (
                              <span className="text-[9px] px-2 py-0.5 bg-white/5 rounded-md text-purple-300 font-bold">
                                {msg.finalizedCake.categories.split(',')[0]}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => addCustomCakeToCart(msg.finalizedCake)}
                            className="w-full h-9 rounded-xl bg-[#DFB15B] text-[#140603] hover:bg-white transition-colors text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add Chef Custom to Cart</span>
                          </button>
                        </motion.div>
                      )}

                    </div>

                    {!isAI && (
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-slate-400">
                        <User className="w-4 h-4 text-pink-300" />
                      </div>
                    )}

                  </div>
                );
              })}

              {/* Loader */}
              {isLoading && (
                <div className="flex justify-start items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0 text-pink-400 font-bold text-[10px]">
                    AI
                  </div>
                  <div className="bg-white/5 border border-white/5 p-4 rounded-3xl rounded-tl-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Drawer (Only show if history has few messages) */}
            {messages.length === 1 && !isLoading && (
              <div className="p-4 bg-white/[0.01] border-t border-white/5 space-y-2">
                <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 block">Suggested Prompts</span>
                <div className="grid grid-cols-1 gap-1.5">
                  {suggestions.map((sug, idx) => {
                    const Icon = sug.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(sug.text)}
                        className="w-full text-left p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-pink-500/20 text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer group"
                      >
                        <Icon className="w-3.5 h-3.5 text-pink-400 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="truncate">{sug.text}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input Bar Area */}
            <div className="p-4 border-t border-white/5 bg-white/[0.01] flex gap-2">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage(input);
                }}
                disabled={isLoading}
                placeholder="Ask about flavours, customization, delivery..."
                className="flex-1 bg-white/5 border border-white/10 text-white placeholder:text-slate-500 h-11 px-4 rounded-xl text-xs font-semibold focus:outline-none focus:border-pink-500/50 transition-colors"
              />
              <button
                onClick={() => handleSendMessage(input)}
                disabled={isLoading || !input.trim()}
                className="w-11 h-11 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 hover:opacity-90 active:scale-[0.95] flex items-center justify-center text-white transition-all cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
