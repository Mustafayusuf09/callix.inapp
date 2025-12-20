import React, { useRef, useEffect } from 'react';
import { Sparkles, Send, Zap, ChevronRight, LayoutGrid, Clock, Lightbulb, Paperclip, Mic, ArrowUp, Bot, User, BarChart2, PieChart, TrendingUp } from 'lucide-react';
import { ChatMessage, MessageRole, ChatSession } from '../types';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
    messages: ChatMessage[];
    isLoading: boolean;
    sessions: ChatSession[];
    currentSessionId: string | null;
    inputValue: string;
    setInputValue: (val: string) => void;
    onSendMessage: () => void;
    onQuickPrompt: (text: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
    messages,
    isLoading,
    sessions,
    currentSessionId,
    inputValue,
    setInputValue,
    onSendMessage,
    onQuickPrompt
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        // Focus input when switching to new chat or initial load
        if (!isLoading) {
            inputRef.current?.focus();
        }
    }, [currentSessionId, isLoading]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
        }
    };

    return (
        <div className="flex h-full w-full flex-col relative bg-transparent">

            {/* ---------------------------------------------------------------------------
          MAIN CHAT AREA
      --------------------------------------------------------------------------- */}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto px-4 scroll-smooth no-scrollbar pb-32">
                <div className="max-w-3xl mx-auto w-full pt-12">

                    {messages.length === 0 && !isLoading ? (
                        // --- EMPTY STATE / HERO ---
                        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="mb-8 relative group">
                                <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full"></div>
                                <div className="relative w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
                                    <img src="/assets/callix-icon.png" alt="CalliX" className="w-20 h-20 object-contain" />
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Hello, Lucas</h2>
                            <p className="text-slate-500 text-center mb-12 max-w-md text-lg font-light leading-relaxed">
                                Ready to accelerate your workflow?
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                                {[
                                    { icon: <BarChart2 size={18} />, label: "Avatar Trends", text: "Analyze patterns and trends across your customer avatars" },
                                    { icon: <PieChart size={18} />, label: "Deal Analysis", text: "Summarize the key details, budget, timeline, and close probability for this deal." },
                                    { icon: <LayoutGrid size={18} />, label: "Generate Creatives", text: "Create 5 creatives and headlines subject lines for a product launch campaign." },
                                    { icon: <TrendingUp size={18} />, label: "Predictions", text: "By asking X questions on sales calls the probability of closing X avatar increases by 20%" },
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onQuickPrompt(item.text)}
                                        className="flex flex-col gap-3 p-5 bg-white border border-slate-100 hover:border-emerald-200/60 hover:bg-white/80 rounded-2xl text-left transition-all duration-300 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 group"
                                    >
                                        <div className="flex justify-between w-full">
                                            <div className="p-2 bg-slate-50 rounded-xl text-slate-500 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                                                {item.icon}
                                            </div>
                                            <ArrowUp size={16} className="text-slate-200 group-hover:text-emerald-400 rotate-45 opacity-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm mb-1">{item.label}</div>
                                            <div className="text-xs text-slate-400 font-medium group-hover:text-slate-500 transition-colors line-clamp-2 leading-relaxed">{item.text}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // --- MESSAGE LIST ---
                        <div className="space-y-10 pb-8">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex w-full ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === MessageRole.USER ? (
                                        // USER MESSAGE
                                        <div className="max-w-2xl flex flex-col items-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="bg-slate-900 text-white px-6 py-3.5 rounded-[24px] rounded-tr-sm shadow-md text-[15px] leading-relaxed font-medium">
                                                {msg.text}
                                            </div>
                                            <span className="text-[10px] text-slate-300 font-bold mt-2 mr-2 opacity-60">
                                                {msg.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    ) : (
                                        // AI MESSAGE
                                        <div className="flex gap-6 max-w-3xl w-full animate-in fade-in duration-500">
                                            <div className="flex-shrink-0 flex flex-col items-center gap-2">
                                                <div className="w-11 h-11 flex items-center justify-center">
                                                    <img src="/assets/ai-avatar.png" alt="AI" className="w-full h-full object-contain" />
                                                </div>
                                            </div>

                                            <div className="flex-1 pt-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-sm font-bold text-slate-900">CalliX</span>
                                                    <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 bg-slate-100 rounded-full">AI Assistant</span>
                                                </div>

                                                <div className="prose prose-slate prose-sm max-w-none 
                                            prose-p:leading-relaxed prose-p:text-slate-600 prose-p:text-[15px]
                                            prose-headings:font-bold prose-headings:text-slate-900 
                                            prose-strong:text-slate-900 prose-strong:font-bold
                                            prose-code:text-emerald-700 prose-code:bg-emerald-50/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-medium
                                            prose-pre:bg-slate-50 prose-pre:border prose-pre:border-slate-100 prose-pre:text-slate-700
                                            prose-li:text-slate-600 prose-li:marker:text-slate-300
                                            prose-a:text-emerald-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                                        ">
                                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-6 max-w-3xl w-full animate-in fade-in duration-300">
                                    <div className="flex-shrink-0">
                                        <div className="w-11 h-11 flex items-center justify-center">
                                            <img src="/assets/ai-avatar.png" alt="AI" className="w-full h-full object-contain" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 pt-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[bounce_1s_infinite_0ms]"></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[bounce_1s_infinite_200ms]"></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[bounce_1s_infinite_400ms]"></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* ---------------------------------------------------------------------------
          INPUT AREA
      --------------------------------------------------------------------------- */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 pointer-events-none">
                <div className="max-w-3xl mx-auto pointer-events-auto">
                    <div className={`
                    relative bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_40px_-10px_rgba(0,0,0,0.1)] rounded-[2rem] p-2 pl-5 transition-all duration-300 ease-out flex items-center gap-3
                    ${inputValue.trim().length > 0 ? 'ring-2 ring-emerald-500/10 border-emerald-500/20' : 'hover:border-slate-200/80'}
                `}>

                        {/* Attachments */}
                        <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                            <Paperclip size={20} strokeWidth={2} />
                        </button>

                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Message CalliX..."
                            className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-slate-800 placeholder:text-slate-400 text-[15px] font-medium h-12"
                        />

                        <div className="flex items-center gap-2 pr-1">
                            {/* Voice Input */}
                            {!inputValue.trim() && (
                                <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                                    <Mic size={20} strokeWidth={2} />
                                </button>
                            )}

                            {/* Send Button */}
                            <button
                                onClick={onSendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${inputValue.trim()
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105 transform cursor-pointer'
                                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                    }`}
                            >
                                <ArrowUp size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    <div className="text-center mt-3 opacity-60 hover:opacity-100 transition-opacity">
                        <p className="text-[10px] text-slate-400 font-medium">
                            AI generated content may be inaccurate. Verify important information.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;