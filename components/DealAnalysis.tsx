import React, { useState, useRef, useEffect } from 'react';
import {
    Search,
    Filter,
    Plus,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Phone,
    Calendar,
    MoreHorizontal,
    Check,
    Play,
    Sparkles,
    Paperclip,
    ArrowUp,
    Mic,
    FileText,
    MousePointer,
    ExternalLink,
    Link as LinkIcon,
    CheckCircle2,
    Clock,
    Download,
    MessageSquare,
    ShieldAlert,
    Brain,
    Target,
    Zap,
    Activity,
    AlertTriangle,
    ArrowRight,
    PieChart,
    BarChart3,
    TrendingDown
} from 'lucide-react';

// --- Types & Mock Data ---

interface Prospect {
    id: string;
    name: string;
    phone: string;
    company: string;
    stage: 'Contacted' | 'Needs Contact' | 'Negotiation' | 'Closed';
    avatarColor: string;
    probability: number; // 1-5
    callDate: string;
    email: string;
    notes: string;
}

const MOCK_PROSPECTS: Prospect[] = [
    { id: '1', name: 'Julia Thompson', phone: '+ 1 (312) 555-0291', company: 'FreshPixel', stage: 'Contacted', avatarColor: 'bg-emerald-200', probability: 2, callDate: '17/07/2025', email: 'julia@freshpixel.com', notes: 'Interested in Q4 enterprise plan.' },
    { id: '2', name: 'Marcus Delgado', phone: '+ 1 (312) 555-0198', company: 'Apple', stage: 'Needs Contact', avatarColor: 'bg-blue-200', probability: 3, callDate: '17/07/2025', email: 'm.delgado@apple.com', notes: 'Follow up regarding the API integration limits.' },
    { id: '3', name: 'Tim Cook', phone: '+ 1 (312) 555-0198', company: 'Apple', stage: 'Contacted', avatarColor: 'bg-slate-200', probability: 4, callDate: '17/07/2025', email: 'tcook@apple.com', notes: 'High priority deal.' },
    { id: '4', name: 'Sarah Connor', phone: '+ 1 (312) 555-0198', company: 'Skynet', stage: 'Needs Contact', avatarColor: 'bg-rose-200', probability: 1, callDate: '17/07/2025', email: 'sarah@skynet.net', notes: 'Skeptical about AI safety features.' },
    { id: '5', name: 'John Doe', phone: '+ 1 (312) 555-0198', company: 'Acme Corp', stage: 'Contacted', avatarColor: 'bg-amber-200', probability: 3, callDate: '17/07/2025', email: 'j.doe@acme.com', notes: '' },
    { id: '6', name: 'Jane Smith', phone: '+ 1 (312) 555-0198', company: 'Globex', stage: 'Needs Contact', avatarColor: 'bg-purple-200', probability: 3, callDate: '17/07/2025', email: 'jane@globex.com', notes: '' },
    { id: '7', name: 'Robert Ford', phone: '+ 1 (312) 555-0198', company: 'Delos', stage: 'Contacted', avatarColor: 'bg-indigo-200', probability: 4, callDate: '17/07/2025', email: 'r.ford@delosinc.com', notes: '' },
];

const MOCK_TRANSCRIPT = [
    { speaker: 'Samuel Lockett', initials: 'SL', color: 'bg-emerald-500', time: '00:00', text: "Thanks for taking the time to chat with me today, Lucas. I understand you're looking to scale your consulting business?" },
    { speaker: 'Lucas Berger', initials: 'LB', color: 'bg-amber-500', time: '00:05', text: "Yes, exactly. I've been doing pretty well locally, but I'm hitting a ceiling." },
    { speaker: 'Samuel Lockett', initials: 'SL', color: 'bg-emerald-500', time: '00:09', text: "I see. What's your current monthly revenue looking like?" },
    { speaker: 'Lucas Berger', initials: 'LB', color: 'bg-amber-500', time: '00:12', text: "Right now I'm averaging around $15K per month, but it's inconsistent. Some months are great, others not so much." },
    { speaker: 'Samuel Lockett', initials: 'SL', color: 'bg-emerald-500', time: '00:19', text: "And what would you consider a successful outcome from working together?" },
    { speaker: 'Lucas Berger', initials: 'LB', color: 'bg-amber-500', time: '00:23', text: "I want to get to a consistent $50K monthly within the next 6-9 months. I know it's ambitious, but I have the expertise and clients love my work." },
    { speaker: 'Samuel Lockett', initials: 'SL', color: 'bg-emerald-500', time: '00:32', text: "That's definitely achievable with the right systems in place. Tell me about your current client acquisition process." },
    { speaker: 'Lucas Berger', initials: 'LB', color: 'bg-amber-500', time: '00:38', text: "Honestly, it's mostly referrals and some LinkedIn outreach. I know I need to be more strategic, but I'm so busy with client work that I don't have time to focus on marketing." }
];

const MOCK_JOURNEY = [
    { title: 'Booked', date: '2025-11-16 14:10:34', desc: 'Strategy Call with Ashley Lockheart', icon: Phone },
    { title: 'Reached', date: '2025-11-16 07:26:54', desc: 'qualified application stage', icon: Download },
    { title: 'Opted in', date: '2025-11-16 07:26:41', desc: '', icon: FileText },
    { title: 'Achieved', date: '2025-11-16 07:26:41', desc: 'clicked', icon: MousePointer },
    {
        title: 'Clicked',
        date: '2025-11-08 21:26:21',
        desc: '10/17 CONTROL | DQ TEST 1% | s...',
        icon: LinkIcon,
        actionText: 'Tracked URL: ',
        actionLink: 'Open Link'
    },
];

const ANALYSIS_TABS = [
    'Overview',
    'Summary',
    'Objections',
    'Psychology',
    'Follow-Up',
    'Risks',
    'Velocity'
];

// Helper to generate specific analysis data
const getAnalysisData = (prospect: Prospect) => ({
    summary: {
        lastPoint: "Discussed scalability issues with current infrastructure. Client confirmed Q4 budget approval is pending board review next Tuesday.",
        nextSteps: ["Send API documentation", "Schedule technical deep-dive with CTO", "Draft proposal for Enterprise Tier"],
        closingLikelihood: 72,
        highProbAction: "Send the 'Scale at Speed' case study before Tuesday's board meeting."
    },
    objections: [
        { blocker: "Implementation Timeline", impact: "High - Client fears Q4 launch delay.", counterplay: "Highlight our '7-Day Quick Start' protocol and offer a dedicated implementation specialist." },
        { blocker: "Legacy Integration", impact: "Medium - Technical team is risk-averse.", counterplay: "Share the technical whitepaper on REST API backward compatibility." },
    ],
    psychology: {
        avatar: "The Skeptical Optimizer",
        decisionStyle: "Consensus-driven",
        intent: "High",
        urgency: "Medium-High",
        trust: "Building",
        commStyle: "Direct & Data-focused"
    },
    followUp: [
        { type: "Email", action: "Send Technical Specs", context: "Address the CTO's concerns about latency immediately." },
        { type: "Call", action: "Pre-Board Sync", context: "Call on Monday to arm the champion with ROI stats." },
    ],
    risks: [
        { level: "High", indicator: "Mentioned 'competitor X' pricing model twice." },
        { level: "Medium", indicator: "Key decision maker (CFO) was absent from the call." },
    ],
    velocity: {
        momentum: "Accelerating",
        timeInStage: "4 Days",
        dealHeat: "Hot",
        trend: "Positive"
    }
});

// --- Components ---

const ProbabilityBars = ({ level }: { level: number }) => {
    const getColor = () => {
        if (level <= 2) return 'bg-rose-500';
        if (level <= 3) return 'bg-amber-400';
        return 'bg-emerald-500';
    };

    return (
        <div className="flex gap-1 h-5 items-center" title={`Probability: ${level}/5`}>
            {[1, 2, 3, 4, 5].map((bar) => (
                <div
                    key={bar}
                    className={`w-1.5 rounded-full transition-all duration-300 ${bar <= level ? getColor() : 'bg-slate-200/60'
                        }`}
                    style={{ height: '70%' }}
                ></div>
            ))}
        </div>
    );
};

const DealAnalysis: React.FC = () => {
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [analysisTab, setAnalysisTab] = useState('Overview');
    const [overviewSubTab, setOverviewSubTab] = useState<'chat' | 'transcript' | 'journey'>('chat'); // Sub-tabs for Overview
    const [searchTerm, setSearchTerm] = useState('');
    const [prospects, setProspects] = useState<Prospect[]>(MOCK_PROSPECTS);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    // Chat state inside detail view
    const [chatInput, setChatInput] = useState('');

    // Dropdown state
    const [isTrendsDropdownOpen, setIsTrendsDropdownOpen] = useState(false);
    const trendsDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (trendsDropdownRef.current && !trendsDropdownRef.current.contains(event.target as Node)) {
                setIsTrendsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRowClick = (prospect: Prospect) => {
        setSelectedProspect(prospect);
        setAnalysisTab('Overview');
        setView('detail');
        setCompletedSteps([]);
    };

    const toggleStep = (index: number) => {
        setCompletedSteps(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const formatPhoneDisplay = (phone: string) => {
        const parts = phone.split(') ');
        if (parts.length === 2) {
            return (
                <div className="flex flex-col text-sm font-mono text-slate-500 leading-tight">
                    <span className="mb-0.5">{parts[0]})</span>
                    <span>{parts[1]}</span>
                </div>
            );
        }
        return <span className="text-sm font-mono text-slate-500">{phone}</span>;
    };

    // ----------------------------------------------------------------------------------
    // DETAIL VIEW
    // ----------------------------------------------------------------------------------
    if (view === 'detail' && selectedProspect) {
        const analysisData = getAnalysisData(selectedProspect);

        return (
            <div className="flex flex-col px-8 py-6 w-full max-w-[1600px] mx-auto text-slate-800 animate-in fade-in slide-in-from-right-4 duration-500 relative bg-[#F8FAFC]">

                {/* --- Top Navigation Bar --- */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    {/* Back Link */}
                    <button
                        onClick={() => setView('list')}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-[10px] font-bold uppercase tracking-widest w-fit group"
                    >
                        <ChevronLeft size={12} strokeWidth={3} className="group-hover:-translate-x-0.5 transition-transform" />
                        Back to Deal Analysis
                    </button>

                    {/* --- TABS --- */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                        {ANALYSIS_TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setAnalysisTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${analysisTab === tab
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- Page Title Row --- */}
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">{selectedProspect.name} and {selectedProspect.company}</h2>
                    <div className="flex items-center gap-3 text-sm flex-wrap">
                        {/* Avatar */}
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${selectedProspect.avatarColor} text-slate-700/80`}>
                            {selectedProspect.name.split(' ').map(n => n[0]).join('')}
                        </div>

                        <span className="text-sm font-medium text-slate-500">{selectedProspect.name}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-sm font-medium text-slate-500">17/07/2025, 11:00 AM</span>
                        <span className="text-slate-300">•</span>

                        {/* Stage Pill */}
                        <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">
                            {selectedProspect.stage}
                        </span>
                    </div>
                </div>

                {/* --- Main Content Grid --- */}
                <div className="flex gap-8 h-[700px] pb-6 animate-in fade-in duration-300">

                    {/* Left Column: Video Player & Summary (Flex 1 = 50%) */}
                    <div className="flex-1 flex flex-col min-w-0 h-full gap-6">

                        {/* Video Player */}
                        <div className="w-full aspect-video bg-black rounded-xl relative group overflow-hidden shadow-sm flex-shrink-0">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/30 cursor-pointer hover:scale-110 transition-transform shadow-2xl">
                                    <Play size={28} fill="white" className="ml-1" />
                                </div>
                            </div>
                            <div className="absolute bottom-4 right-6 text-white text-[11px] font-mono tracking-wider font-medium opacity-90">
                                02:13:00
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                                <div className="w-[12%] h-full bg-emerald-500 rounded-r-full"></div>
                            </div>
                        </div>

                        {/* General Summary Card - ALWAYS VISIBLE */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex-1 flex flex-col overflow-hidden">
                            <div className="flex items-center mb-3 shrink-0">
                                <h3 className="font-bold text-slate-800 text-base">General Summary</h3>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <h4 className="font-bold text-slate-900 text-sm mb-2">Scaling Strategy and Systems</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {selectedProspect.name.split(' ')[0]} is positioned well for growth with strong client satisfaction and proven expertise, but lacks the systematic infrastructure to scale beyond current revenue targets ($15K monthly) to his target ($50K).
                                </p>
                                <p className="text-slate-500 text-sm leading-relaxed mt-4">
                                    Key discussion points included lead generation consistency, pricing models for enterprise tiers, and hiring roadmap for the next two quarters. The prospect expressed concern about implementation time but is motivated by Q4 revenue goals.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content based on Tabs (Flex 1 = 50%) */}
                    <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden min-w-[450px] h-full">

                        {/* TAB CONTENT: Overview (The "Main Pages" layout) */}
                        {analysisTab === 'Overview' && (
                            <div className="flex flex-col h-full">
                                {/* Sub-Tabs Header */}
                                <div className="flex items-center border-b border-slate-100 px-6 pt-4 shrink-0">
                                    <button
                                        onClick={() => setOverviewSubTab('chat')}
                                        className={`flex-1 pb-4 text-[11px] font-bold text-center uppercase tracking-wider transition-all border-b-2 ${overviewSubTab === 'chat'
                                            ? 'text-emerald-600 border-emerald-500'
                                            : 'text-slate-400 border-transparent hover:text-slate-600'
                                            }`}
                                    >
                                        AI Chat
                                    </button>
                                    <button
                                        onClick={() => setOverviewSubTab('transcript')}
                                        className={`flex-1 pb-4 text-[11px] font-bold text-center uppercase tracking-wider transition-all border-b-2 ${overviewSubTab === 'transcript'
                                            ? 'text-emerald-600 border-emerald-500'
                                            : 'text-slate-400 border-transparent hover:text-slate-600'
                                            }`}
                                    >
                                        Transcript
                                    </button>
                                    <button
                                        onClick={() => setOverviewSubTab('journey')}
                                        className={`flex-1 pb-4 text-[11px] font-bold text-center uppercase tracking-wider transition-all border-b-2 ${overviewSubTab === 'journey'
                                            ? 'text-emerald-600 border-emerald-500'
                                            : 'text-slate-400 border-transparent hover:text-slate-600'
                                            }`}
                                    >
                                        Customer Journey
                                    </button>
                                </div>

                                {/* Sub-Tab Content */}
                                <div className="flex-1 flex flex-col overflow-hidden relative">

                                    {/* 1. AI CHAT TAB */}
                                    {overviewSubTab === 'chat' && (
                                        <div className="flex-1 flex flex-col h-full">
                                            <div className="flex-1 overflow-y-auto p-6">
                                                <div className="mt-4 animate-in slide-in-from-bottom-2 duration-500">
                                                    <h2 className="text-lg font-bold text-slate-800 mb-2">Hello, {selectedProspect.name.split(' ')[0]}</h2>
                                                    <p className="text-slate-500 text-xs leading-relaxed mb-8">
                                                        I am your AI Assistant who can help you answer any question from your meeting, generate content and more.
                                                    </p>

                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Try asking...</p>

                                                    <div className="space-y-3">
                                                        <button className="w-full p-4 rounded-xl border border-slate-100 bg-white hover:bg-emerald-50 hover:border-emerald-200 text-left transition-all group shadow-sm">
                                                            <div className="flex items-center gap-3">
                                                                <div className="text-emerald-500 bg-emerald-50 p-1.5 rounded-lg group-hover:bg-white transition-colors"><Sparkles size={14} /></div>
                                                                <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-800">Call Scoring</span>
                                                            </div>
                                                        </button>
                                                        <button className="w-full p-4 rounded-xl border border-slate-100 bg-white hover:bg-emerald-50 hover:border-emerald-200 text-left transition-all group shadow-sm">
                                                            <div className="flex items-center gap-3">
                                                                <div className="text-emerald-500 bg-emerald-50 p-1.5 rounded-lg group-hover:bg-white transition-colors"><Sparkles size={14} /></div>
                                                                <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-800">Prospect Analysis</span>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Input Area */}
                                            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                                                <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all flex flex-col">
                                                    <div className="flex items-center gap-2 px-2 py-1">
                                                        <Paperclip size={16} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                                                        <input
                                                            type="text"
                                                            value={chatInput}
                                                            onChange={(e) => setChatInput(e.target.value)}
                                                            placeholder={`Ask about ${selectedProspect.name.split(' ')[0]}...`}
                                                            className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 h-8"
                                                        />
                                                    </div>
                                                    <div className="flex justify-end items-center gap-2 mt-1">
                                                        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"><Mic size={16} /></button>
                                                        <button className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-sm hover:bg-emerald-700 hover:scale-105 transition-all">
                                                            <ArrowUp size={14} strokeWidth={2.5} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="text-[10px] text-center text-slate-300 mt-2 font-medium">
                                                    CalliX may occasionally make mistakes.
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 2. TRANSCRIPT TAB */}
                                    {overviewSubTab === 'transcript' && (
                                        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 bg-white">
                                            {MOCK_TRANSCRIPT.map((msg, idx) => (
                                                <div key={idx} className="flex gap-4 group">
                                                    <div className={`w-7 h-7 rounded flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold ${msg.color} shadow-sm mt-0.5`}>
                                                        {msg.initials}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-bold text-slate-900">{msg.speaker}</span>
                                                            <span className="text-[10px] font-medium text-emerald-600">{msg.time}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                                            {msg.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* 3. CUSTOMER JOURNEY TAB */}
                                    {overviewSubTab === 'journey' && (
                                        <div className="flex-1 overflow-y-auto px-8 py-8 bg-white">
                                            <h2 className="text-lg font-bold text-slate-900 mb-1">Customer Journey</h2>
                                            <p className="text-slate-500 text-sm mb-10 leading-relaxed">Here is the journey of the customer from the initial contact to the current status.</p>

                                            <div className="space-y-0 pl-2">
                                                {MOCK_JOURNEY.map((item, idx) => {
                                                    const isLast = idx === MOCK_JOURNEY.length - 1;
                                                    return (
                                                        <div key={idx} className="relative pl-8 pb-8 group">
                                                            {!isLast && (
                                                                <div className="absolute left-[9px] top-6 bottom-0 w-[1px] bg-slate-100 border-l border-dashed border-slate-200"></div>
                                                            )}
                                                            <div className="absolute left-0 top-1 text-slate-300 group-hover:text-emerald-500 transition-colors">
                                                                <item.icon size={18} strokeWidth={1.5} />
                                                            </div>
                                                            <div className="flex flex-col gap-0.5">
                                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                    <span className="text-sm font-bold text-slate-900">{item.title}</span>
                                                                    <span className="text-sm font-medium text-emerald-500 font-mono tracking-tight">{item.date}</span>
                                                                </div>
                                                                {item.desc && (
                                                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                                                )}
                                                                {item.actionText && (
                                                                    <div className="flex items-center gap-1 mt-1 text-sm font-medium">
                                                                        <span className="text-slate-500">{item.actionText}</span>
                                                                        <span className="text-emerald-500 cursor-pointer hover:underline">{item.actionLink}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: Summary */}
                        {analysisTab === 'Summary' && (
                            <div className="flex flex-col h-full space-y-6 overflow-y-auto no-scrollbar p-6">
                                <div className="mb-2">
                                    <h3 className="text-lg font-bold text-slate-900">AI Call Summary</h3>
                                </div>

                                {/* Where we left off */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Where we left off</h4>
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                        {analysisData.summary.lastPoint}
                                    </p>
                                </div>

                                {/* Closing Likelihood */}
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Closing Likelihood</h4>
                                        <span className="text-2xl font-bold text-emerald-600">{analysisData.summary.closingLikelihood}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${analysisData.summary.closingLikelihood}%` }}></div>
                                    </div>
                                </div>

                                {/* Highest Probability Action */}
                                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Zap size={14} /> Highest-Probability Closing Action
                                    </h4>
                                    <p className="text-sm font-bold text-emerald-900">
                                        {analysisData.summary.highProbAction}
                                    </p>
                                </div>

                                {/* Next Steps */}
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Next Steps</h4>
                                    <ul className="space-y-3">
                                        {analysisData.summary.nextSteps.map((step, i) => (
                                            <li
                                                key={i}
                                                onClick={() => toggleStep(i)}
                                                className={`flex items-center gap-3 p-3 border rounded-lg transition-all cursor-pointer ${completedSteps.includes(i)
                                                    ? 'border-emerald-200 bg-emerald-50/30'
                                                    : 'border-slate-100 hover:border-emerald-200 bg-white'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${completedSteps.includes(i)
                                                    ? 'border-emerald-500 bg-emerald-500'
                                                    : 'border-slate-300 hover:border-emerald-500 group-hover:bg-emerald-50'
                                                    }`}>
                                                    <Check size={12} className={`transition-opacity ${completedSteps.includes(i) ? 'text-white opacity-100' : 'text-emerald-600 opacity-0'}`} />
                                                </div>
                                                <span className={`text-sm font-medium transition-colors ${completedSteps.includes(i) ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                                    {step}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: Objections */}
                        {analysisTab === 'Objections' && (
                            <div className="flex flex-col h-full space-y-6 overflow-y-auto no-scrollbar p-6">
                                <div className="mb-2">
                                    <h3 className="text-lg font-bold text-slate-900">Objection & Friction Analysis</h3>
                                </div>

                                <div className="space-y-4">
                                    {analysisData.objections.map((obj, i) => (
                                        <div key={i} className="border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg mt-0.5">
                                                    <AlertTriangle size={16} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-sm mb-1">{obj.blocker}</h4>
                                                    <p className="text-xs text-rose-600 font-medium">{obj.impact}</p>
                                                </div>
                                            </div>

                                            <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg ml-11">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <CheckCircle2 size={12} className="text-emerald-600" />
                                                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Suggested Counterplay</span>
                                                </div>
                                                <p className="text-sm text-slate-600 leading-snug">
                                                    {obj.counterplay}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: Psychology */}
                        {analysisTab === 'Psychology' && (
                            <div className="flex flex-col h-full space-y-6 overflow-y-auto no-scrollbar p-6">
                                <div className="mb-2">
                                    <h3 className="text-lg font-bold text-slate-900">Buyer Intent & Psychology</h3>
                                </div>

                                {/* Avatar Badge */}
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identified Persona</span>
                                        <h4 className="text-lg font-bold text-slate-800">{analysisData.psychology.avatar}</h4>
                                    </div>
                                </div>

                                {/* Grid Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 border border-slate-200 rounded-xl">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Intent Strength</span>
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-6 bg-emerald-500 rounded-sm"></div>
                                                <div className="w-2 h-6 bg-emerald-500 rounded-sm"></div>
                                                <div className="w-2 h-6 bg-emerald-500 rounded-sm"></div>
                                                <div className="w-2 h-6 bg-slate-200 rounded-sm"></div>
                                            </div>
                                            <span className="font-bold text-slate-800 text-sm">{analysisData.psychology.intent}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 border border-slate-200 rounded-xl">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Urgency Cues</span>
                                        <div className="flex items-center gap-2 text-amber-500">
                                            <Clock size={20} />
                                            <span className="font-bold text-slate-800 text-sm">{analysisData.psychology.urgency}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 border border-slate-200 rounded-xl">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Trust & Rapport</span>
                                        <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                                            {analysisData.psychology.trust}
                                        </span>
                                    </div>
                                    <div className="p-4 border border-slate-200 rounded-xl">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Comm. Style</span>
                                        <span className="text-sm font-bold text-slate-700">{analysisData.psychology.commStyle}</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageSquare size={14} className="text-blue-600" />
                                        <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">Recommended Style</span>
                                    </div>
                                    <p className="text-sm text-blue-900/80 leading-relaxed">
                                        Keep emails under 100 words. Lead with ROI metrics. Avoid fluff. This buyer values time and direct answers.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: Follow-Up */}
                        {analysisTab === 'Follow-Up' && (
                            <div className="flex flex-col h-full space-y-6 overflow-y-auto no-scrollbar p-6">
                                <div className="mb-2">
                                    <h3 className="text-lg font-bold text-slate-900">Recommended Follow-Up Plays</h3>
                                </div>

                                <p className="text-sm text-slate-500 mb-2">Contextual, high-probability actions to execute next.</p>

                                <div className="space-y-4">
                                    {analysisData.followUp.map((play, i) => (
                                        <div key={i} className="flex gap-4 p-4 border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all group cursor-pointer bg-white">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${play.type === 'Email' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                {play.type === 'Email' ? <MailIcon size={18} /> : <Phone size={18} />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">{play.action}</h4>
                                                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase">{play.type}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                    {play.context}
                                                </p>
                                            </div>
                                            <div className="self-center">
                                                <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-500" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: Risks */}
                        {analysisTab === 'Risks' && (
                            <div className="flex flex-col h-full space-y-6 overflow-y-auto no-scrollbar p-6">
                                <div className="mb-2">
                                    <h3 className="text-lg font-bold text-slate-900">Risk Indicators</h3>
                                </div>

                                <div className="space-y-4">
                                    {analysisData.risks.map((risk, i) => (
                                        <div key={i} className={`p-5 rounded-xl border-l-4 ${risk.level === 'High' ? 'bg-rose-50 border-rose-500' : 'bg-amber-50 border-amber-500'}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${risk.level === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {risk.level} Risk
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-800">
                                                "{risk.indicator}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: Velocity */}
                        {analysisTab === 'Velocity' && (
                            <div className="flex flex-col h-full overflow-y-auto no-scrollbar p-6 bg-slate-50/50">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2 text-slate-800">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Deal Velocity</h3>
                                            <p className="text-xs text-slate-500 font-medium">Real-time momentum analysis</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-100/50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                                        Live Updates
                                    </span>
                                </div>

                                {/* Main Metrics Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    {/* Momentum Output */}
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Activity size={80} />
                                        </div>
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Momentum Score</h4>
                                        <div className="flex items-end gap-3 mb-4">
                                            <span className="text-5xl font-bold text-slate-900 tracking-tighter">85</span>
                                            <div className="pb-2">
                                                <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                                    <ArrowUp size={12} strokeWidth={3} />
                                                    <span>12%</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Abstract Visualization */}
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                                            <div className="h-full bg-emerald-500 w-[85%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                        </div>
                                        <p className="mt-3 text-xs text-slate-500 font-medium leading-relaxed">
                                            Deal velocity is <span className="text-emerald-600 font-bold">Accelerating</span> due to recent stakeholder engagement.
                                        </p>
                                    </div>

                                    {/* Win Probability Map */}
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Projected Close</h4>
                                                <span className="text-xl font-bold text-slate-900">Q4 '25</span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <Calendar size={14} />
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            <div className="flex justify-between text-xs font-medium text-slate-600">
                                                <span>Confidence</span>
                                                <span className="text-slate-900 font-bold">High (72%)</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 w-[72%] rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pace Analysis Timeline */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-4">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Clock size={16} className="text-slate-400" />
                                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Stage Duration Analysis</h4>
                                    </div>

                                    {/* Timeline Viz */}
                                    <div className="relative h-12 flex items-center">
                                        {/* Base Line */}
                                        <div className="absolute left-0 right-0 h-0.5 bg-slate-100 top-1/2 -translate-y-1/2"></div>

                                        {/* Average Marker */}
                                        <div className="absolute left-[60%] top-1/2 -translate-y-1/2 flex flex-col items-center group">
                                            <div className="w-0.5 h-3 bg-slate-300 mb-1"></div>
                                            <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:scale-125 transition-transform"></div>
                                            <div className="absolute top-full mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">Avg (7 Days)</div>
                                        </div>

                                        {/* Current Marker */}
                                        <div className="absolute left-[35%] top-1/2 -translate-y-1/2 flex flex-col items-center px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg shadow-sm z-10">
                                            <span className="text-xs font-bold text-emerald-700">4 Days</span>
                                            <span className="text-[9px] font-medium text-emerald-600/80">Current</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Force Analysis */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-emerald-600 mb-1">
                                            <TrendingUp size={14} />
                                            <h4 className="text-xs font-bold uppercase tracking-widest">Accelerators</h4>
                                        </div>
                                        {['Budget Confirmed', 'Technical Fit Verified'].map((item, i) => (
                                            <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                                                <div className="w-1.5 h-full self-stretch bg-emerald-500 rounded-full"></div>
                                                <span className="text-xs font-bold text-slate-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-rose-500 mb-1">
                                            <TrendingDown size={14} />
                                            <h4 className="text-xs font-bold uppercase tracking-widest">Friction</h4>
                                        </div>
                                        {['Competitor Pricing', 'Legal Review'].map((item, i) => (
                                            <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                                                <div className="w-1.5 h-full self-stretch bg-rose-500 rounded-full"></div>
                                                <span className="text-xs font-bold text-slate-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ----------------------------------------------------------------------------------
    // LIST VIEW
    // ----------------------------------------------------------------------------------
    return (
        <div className="flex flex-col h-full px-8 py-6 w-full max-w-[1600px] mx-auto text-slate-800 pb-8 relative">

            {/* --- Header --- */}


            {/* --- Controls Bar --- */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1 min-w-[300px] max-w-lg">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, company or phone number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">

                    {/* Common Trends Dropdown */}
                    <div className="relative" ref={trendsDropdownRef}>
                        <button
                            onClick={() => setIsTrendsDropdownOpen(!isTrendsDropdownOpen)}
                            className={`flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition-all shadow-sm ${isTrendsDropdownOpen ? 'ring-2 ring-emerald-500/20 border-emerald-500' : ''}`}
                        >
                            <TrendingUp size={16} />
                            <span>Common Trends</span>
                            <ChevronRight size={14} className={`ml-1 text-slate-400 transition-transform duration-200 ${isTrendsDropdownOpen ? '-rotate-90' : 'rotate-90'}`} />
                        </button>

                        {isTrendsDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <button className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-3 border-b border-slate-100/50">
                                    <MessageSquare size={16} className="text-slate-400" />
                                    Common Objections
                                </button>
                                <button className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-3">
                                    <TrendingUp size={16} className="text-slate-400" />
                                    Winning Messaging
                                </button>
                            </div>
                        )}
                    </div>

                    <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition-all shadow-sm">
                        <Filter size={16} />
                        <span>Filters</span>
                    </button>

                    <button className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all">
                        <Plus size={18} />
                        <span>Add Prospect</span>
                    </button>
                </div>
            </div>

            {/* --- Data Table Container --- */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="overflow-auto no-scrollbar flex-1 -mx-8 px-8 pb-4">
                    <table className="w-full text-left border-separate border-spacing-y-3 min-w-[1000px]">
                        <thead>
                            <tr>
                                {[
                                    { label: 'NAME', width: '20%' },
                                    { label: 'PHONE', width: '15%' },
                                    { label: 'COMPANY', width: '15%' },
                                    { label: 'STAGE', width: '15%' },
                                    { label: 'CUSTOMER AVATAR', width: '10%', align: 'center' },
                                    { label: 'PROBABILITY (I)', width: '12%' },
                                    { label: 'CALL DATE', width: '13%' }
                                ].map((head, i) => (
                                    <th key={i} className={`pb-2 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest ${head.align === 'center' ? 'text-center' : 'text-left'}`} style={{ width: head.width }}>
                                        <div className={`flex items-center gap-1 ${head.align === 'center' ? 'justify-center' : ''}`}>
                                            {head.label.replace(' (I)', '')}
                                            {head.label.includes('(I)') && <span className="text-slate-300 ml-1"> (i) </span>}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {prospects.map((prospect) => (
                                <tr
                                    key={prospect.id}
                                    className="group bg-white rounded-2xl shadow-sm border border-slate-100/50 hover:shadow-md hover:border-emerald-100 hover:-translate-y-[1px] transition-all duration-200 cursor-pointer"
                                    onClick={() => handleRowClick(prospect)}
                                >
                                    <td className="py-5 px-6 rounded-l-2xl border-l border-y border-transparent group-hover:border-emerald-100">
                                        <div className="font-bold text-slate-800 text-sm">{prospect.name}</div>
                                    </td>
                                    <td className="py-5 px-6 border-y border-transparent group-hover:border-emerald-100">
                                        {formatPhoneDisplay(prospect.phone)}
                                    </td>
                                    <td className="py-5 px-6 border-y border-transparent group-hover:border-emerald-100">
                                        <div className="text-slate-600 text-sm font-medium">{prospect.company}</div>
                                    </td>
                                    <td className="py-5 px-6 border-y border-transparent group-hover:border-emerald-100">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${prospect.stage === 'Contacted'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : prospect.stage === 'Needs Contact'
                                                ? 'bg-rose-50 text-rose-600'
                                                : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {prospect.stage}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-center border-y border-transparent group-hover:border-emerald-100">
                                        <div className={`w-8 h-8 rounded-lg mx-auto shadow-sm opacity-80 ${prospect.avatarColor}`}>
                                            {/* Empty colored block */}
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 border-y border-transparent group-hover:border-emerald-100">
                                        <ProbabilityBars level={prospect.probability} />
                                    </td>
                                    <td className="py-5 px-6 rounded-r-2xl border-r border-y border-transparent group-hover:border-emerald-100">
                                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                            <Calendar size={14} className="text-slate-400" />
                                            {prospect.callDate}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- Pagination (Floating) --- */}
                <div className="pt-6 flex items-center justify-between">
                    <div className="text-xs text-slate-500 font-bold bg-white/40 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/40">
                        Showing <span className="text-slate-900">7</span> of 35
                    </div>
                    <div className="flex items-center gap-2 bg-white/40 p-1 rounded-xl backdrop-blur-sm border border-white/40 shadow-sm">
                        <button className="p-2 hover:bg-white/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50">
                            <ChevronLeft size={14} />
                        </button>
                        {[1, 2, 3, 4, 5].map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${currentPage === page
                                    ? 'bg-white text-emerald-600 border border-emerald-200 shadow-sm'
                                    : 'text-slate-500 hover:bg-white/60'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button className="p-2 hover:bg-white/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple Icon for Mail since it wasn't imported in original file
const MailIcon = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
);

export default DealAnalysis;