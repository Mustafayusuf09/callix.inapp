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
import { ChatMessage, MessageRole } from '../types';

// --- Types & Mock Data ---

interface Prospect {
    id: string;
    name: string;
    phone: string;
    company: string;
    stage: 'Contacted' | 'Needs Contact' | 'Negotiation' | 'Closed';
    avatarColor: string;
    avatarImage: string;
    probability: number; // 1-5
    callDate: string;
    email: string;
    notes: string;
}

const MOCK_PROSPECTS: Prospect[] = [
    { id: '1', name: 'Julia Thompson', phone: '+ 1 (312) 555-0291', company: 'FreshPixel', stage: 'Contacted', avatarColor: 'bg-orange-200', avatarImage: 'https://randomuser.me/api/portraits/women/44.jpg', probability: 2, callDate: '17/07/2025', email: 'julia@freshpixel.com', notes: 'Interested in Q4 enterprise plan.' },
    { id: '2', name: 'Marcus Delgado', phone: '+ 1 (312) 555-0198', company: 'Apple', stage: 'Needs Contact', avatarColor: 'bg-zinc-300', avatarImage: 'https://randomuser.me/api/portraits/men/32.jpg', probability: 3, callDate: '17/07/2025', email: 'm.delgado@apple.com', notes: 'Follow up regarding the API integration limits.' },
    { id: '3', name: 'Tim Cook', phone: '+ 1 (312) 555-0198', company: 'Apple', stage: 'Contacted', avatarColor: 'bg-zinc-200', avatarImage: 'https://randomuser.me/api/portraits/men/15.jpg', probability: 4, callDate: '17/07/2025', email: 'tcook@apple.com', notes: 'High priority deal.' },
    { id: '4', name: 'Sarah Connor', phone: '+ 1 (312) 555-0198', company: 'Skynet', stage: 'Needs Contact', avatarColor: 'bg-rose-200', avatarImage: 'https://randomuser.me/api/portraits/women/68.jpg', probability: 1, callDate: '17/07/2025', email: 'sarah@skynet.net', notes: 'Skeptical about AI safety features.' },
    { id: '5', name: 'John Doe', phone: '+ 1 (312) 555-0198', company: 'Acme Corp', stage: 'Contacted', avatarColor: 'bg-zinc-400', avatarImage: 'https://randomuser.me/api/portraits/men/86.jpg', probability: 3, callDate: '17/07/2025', email: 'j.doe@acme.com', notes: '' },
    { id: '6', name: 'Jane Smith', phone: '+ 1 (312) 555-0198', company: 'Globex', stage: 'Needs Contact', avatarColor: 'bg-orange-200', avatarImage: 'https://randomuser.me/api/portraits/women/65.jpg', probability: 3, callDate: '17/07/2025', email: 'jane@globex.com', notes: '' },
    { id: '7', name: 'Robert Ford', phone: '+ 1 (312) 555-0198', company: 'Delos', stage: 'Contacted', avatarColor: 'bg-zinc-500', avatarImage: 'https://randomuser.me/api/portraits/men/11.jpg', probability: 4, callDate: '17/07/2025', email: 'r.ford@delosinc.com', notes: '' },
];

const MOCK_TRANSCRIPT = [
    { speaker: 'Samuel Lockett', initials: 'SL', color: 'bg-orange-500', time: '00:00', text: "Thanks for taking the time to chat with me today, Lucas. I understand you're looking to scale your consulting business?" },
    { speaker: 'Lucas Berger', initials: 'LB', color: 'bg-zinc-800', time: '00:05', text: "Yes, exactly. I've been doing pretty well locally, but I'm hitting a ceiling." },
    { speaker: 'Samuel Lockett', initials: 'SL', color: 'bg-orange-500', time: '00:09', text: "I see. What's your current monthly revenue looking like?" },
    { speaker: 'Lucas Berger', initials: 'LB', color: 'bg-zinc-800', time: '00:12', text: "Right now I'm averaging around $15K per month, but it's inconsistent. Some months are great, others not so much." },
    { speaker: 'Samuel Lockett', initials: 'SL', color: 'bg-orange-500', time: '00:19', text: "And what would you consider a successful outcome from working together?" },
    { speaker: 'Lucas Berger', initials: 'LB', color: 'bg-zinc-800', time: '00:23', text: "I want to get to a consistent $50K monthly within the next 6-9 months. I know it's ambitious, but I have the expertise and clients love my work." },
    { speaker: 'Samuel Lockett', initials: 'SL', color: 'bg-orange-500', time: '00:32', text: "That's definitely achievable with the right systems in place. Tell me about your current client acquisition process." },
    { speaker: 'Lucas Berger', initials: 'LB', color: 'bg-zinc-800', time: '00:38', text: "Honestly, it's mostly referrals and some LinkedIn outreach. I know I need to be more strategic, but I'm so busy with client work that I don't have time to focus on marketing." }
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
        if (level <= 3) return 'bg-zinc-400';
        return 'bg-orange-500';
    };

    return (
        <div className="flex gap-1 h-5 items-center" title={`Probability: ${level}/5`}>
            {[1, 2, 3, 4, 5].map((bar) => (
                <div
                    key={bar}
                    className={`w-1.5 rounded-full transition-all duration-300 ${bar <= level ? getColor() : 'bg-zinc-200/60 dark:bg-zinc-700/60'
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
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isAiThinking, overviewSubTab]);

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;

        const newUserMessage: ChatMessage = {
            id: Date.now().toString(),
            role: MessageRole.USER,
            text: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setChatInput('');
        setIsAiThinking(true);

        // Simulate AI Response
        setTimeout(() => {
            const aiResponseText = "This is a mock response from CalliX (AI service disconnected).";

            const newAiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: MessageRole.MODEL,
                text: aiResponseText,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, newAiMessage]);
            setIsAiThinking(false);
        }, 1500);
    };

    // Dropdown state
    const [isTrendsDropdownOpen, setIsTrendsDropdownOpen] = useState(false);
    const trendsDropdownRef = useRef<HTMLDivElement>(null);

    // Filters state
    const [isFiltersDropdownOpen, setIsFiltersDropdownOpen] = useState(false);
    const filtersDropdownRef = useRef<HTMLDivElement>(null);
    const [stageFilter, setStageFilter] = useState<string[]>([]);
    const [probabilityFilter, setProbabilityFilter] = useState<number[]>([]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (trendsDropdownRef.current && !trendsDropdownRef.current.contains(event.target as Node)) {
                setIsTrendsDropdownOpen(false);
            }
            if (filtersDropdownRef.current && !filtersDropdownRef.current.contains(event.target as Node)) {
                setIsFiltersDropdownOpen(false);
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
                <div className="flex flex-col text-sm font-mono text-zinc-500 dark:text-zinc-400 leading-tight">
                    <span className="mb-0.5">{parts[0]})</span>
                    <span>{parts[1]}</span>
                </div>
            );
        }
        return <span className="text-sm font-mono text-zinc-500">{phone}</span>;
    };

    // Filter toggle helpers
    const toggleStageFilter = (stage: string) => {
        setStageFilter(prev =>
            prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]
        );
    };

    const toggleProbabilityFilter = (prob: number) => {
        setProbabilityFilter(prev =>
            prev.includes(prob) ? prev.filter(p => p !== prob) : [...prev, prob]
        );
    };

    const clearAllFilters = () => {
        setStageFilter([]);
        setProbabilityFilter([]);
    };

    // Compute filtered prospects
    const filteredProspects = prospects.filter(p => {
        // Search filter
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === '' ||
            p.name.toLowerCase().includes(searchLower) ||
            p.company.toLowerCase().includes(searchLower) ||
            p.phone.includes(searchTerm);

        // Stage filter
        const matchesStage = stageFilter.length === 0 || stageFilter.includes(p.stage);

        // Probability filter
        const matchesProbability = probabilityFilter.length === 0 || probabilityFilter.includes(p.probability);

        return matchesSearch && matchesStage && matchesProbability;
    });

    const activeFilterCount = stageFilter.length + probabilityFilter.length;

    // ----------------------------------------------------------------------------------
    // DETAIL VIEW
    // ----------------------------------------------------------------------------------
    if (view === 'detail' && selectedProspect) {
        const analysisData = getAnalysisData(selectedProspect);

        return (
            <div className="flex flex-col px-8 py-6 w-full max-w-[1600px] mx-auto text-zinc-800 dark:text-zinc-200 animate-in fade-in slide-in-from-right-4 duration-500 relative">

                {/* --- Top Navigation Bar --- */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    {/* Back Link */}
                    <button
                        onClick={() => setView('list')}
                        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors text-[10px] font-bold uppercase tracking-widest w-fit group"
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
                                    ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20'
                                    : 'bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-orange-300 hover:text-orange-700 dark:hover:text-orange-400'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- Page Title Row --- */}
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1 tracking-tight font-dm-sans">{selectedProspect.name} and {selectedProspect.company}</h2>
                    <div className="flex items-center gap-3 text-sm flex-wrap">
                        {/* Avatar */}
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${selectedProspect.avatarColor} text-zinc-700/80`}>
                            {selectedProspect.name.split(' ').map(n => n[0]).join('')}
                        </div>

                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{selectedProspect.name}</span>
                        <span className="text-zinc-300 dark:text-zinc-600">•</span>
                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">17/07/2025, 11:00 AM</span>
                        <span className="text-zinc-300 dark:text-zinc-600">•</span>

                        {/* Stage Pill */}
                        <span className="px-2.5 py-0.5 rounded bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wide">
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
                                <div className="w-[12%] h-full bg-orange-500 rounded-r-full"></div>
                            </div>
                        </div>

                        {/* General Summary Card - ALWAYS VISIBLE */}
                        <div className="glass-panel dark:bg-zinc-900/60 dark:border-white/10 rounded-2xl p-6 shadow-sm flex-1 flex flex-col overflow-hidden">
                            <div className="flex items-center mb-3 shrink-0">
                                <h3 className="font-bold text-zinc-800 dark:text-zinc-100 text-base font-dm-sans">General Summary</h3>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <h4 className="font-bold text-zinc-900 dark:text-zinc-200 text-sm mb-2">Scaling Strategy and Systems</h4>
                                <p className="text-zinc-500 dark:text-zinc-300 text-sm leading-relaxed">
                                    {selectedProspect.name.split(' ')[0]} is positioned well for growth with strong client satisfaction and proven expertise, but lacks the systematic infrastructure to scale beyond current revenue targets ($15K monthly) to his target ($50K).
                                </p>
                                <p className="text-zinc-500 dark:text-zinc-300 text-sm leading-relaxed mt-4">
                                    Key discussion points included lead generation consistency, pricing models for enterprise tiers, and hiring roadmap for the next two quarters. The prospect expressed concern about implementation time but is motivated by Q4 revenue goals.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content based on Tabs (Flex 1 = 50%) */}
                    <div className="flex-1 glass-panel dark:bg-zinc-900/60 dark:border-white/10 rounded-2xl shadow-sm flex flex-col overflow-hidden min-w-[450px] h-full">

                        {/* TAB CONTENT: Overview (The "Main Pages" layout) */}
                        {analysisTab === 'Overview' && (
                            <div className="flex flex-col h-full">
                                {/* Sub-Tabs Header */}
                                {/* Sub-Tabs Header */}
                                <div className="flex items-center border-b border-zinc-100 dark:border-zinc-700/50 px-6 pt-4 shrink-0">
                                    <button
                                        onClick={() => setOverviewSubTab('chat')}
                                        className={`flex-1 pb-4 text-[11px] font-bold text-center uppercase tracking-wider transition-all border-b-2 ${overviewSubTab === 'chat'
                                            ? 'text-orange-600 border-orange-500'
                                            : 'text-zinc-400 dark:text-zinc-100 border-transparent hover:text-zinc-600 dark:hover:text-white'
                                            }`}
                                    >
                                        AI Chat
                                    </button>
                                    <button
                                        onClick={() => setOverviewSubTab('transcript')}
                                        className={`flex-1 pb-4 text-[11px] font-bold text-center uppercase tracking-wider transition-all border-b-2 ${overviewSubTab === 'transcript'
                                            ? 'text-orange-600 border-orange-500'
                                            : 'text-zinc-400 dark:text-zinc-100 border-transparent hover:text-zinc-600 dark:hover:text-white'
                                            }`}
                                    >
                                        Transcript
                                    </button>
                                    <button
                                        onClick={() => setOverviewSubTab('journey')}
                                        className={`flex-1 pb-4 text-[11px] font-bold text-center uppercase tracking-wider transition-all border-b-2 ${overviewSubTab === 'journey'
                                            ? 'text-orange-600 border-orange-500'
                                            : 'text-zinc-400 dark:text-zinc-100 border-transparent hover:text-zinc-600 dark:hover:text-white'
                                            }`}
                                    >
                                        Customer Journey
                                    </button>
                                </div>

                                {/* Sub-Tab Content */}
                                <div className="flex-1 flex flex-col overflow-hidden relative">

                                    {/* 1. AI CHAT TAB */}
                                    {overviewSubTab === 'chat' && (
                                        <div className="flex-1 flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-900/50">
                                            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                                                {messages.length === 0 ? (
                                                    <div className="mt-4 animate-in slide-in-from-bottom-2 duration-500">
                                                        <h2 className="text-lg font-bold text-zinc-800 dark:text-white mb-2 font-dm-sans">Hello, {selectedProspect.name.split(' ')[0]}</h2>
                                                        <p className="text-zinc-500 dark:text-zinc-300 text-xs leading-relaxed mb-8">
                                                            I am your AI Assistant who can help you answer any question from your meeting, generate content and more.
                                                        </p>

                                                        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-100 uppercase tracking-widest mb-3">Try asking...</p>

                                                        <div className="space-y-3">
                                                            <button
                                                                onClick={() => handleSendMessage("Generate a score card for this call based on our sales methodology.")}
                                                                className="w-full p-4 rounded-xl border border-zinc-100 dark:border-zinc-700/50 glass-card dark:bg-zinc-800/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-200 dark:hover:border-orange-500/30 text-left transition-all group shadow-sm"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="text-orange-500 bg-orange-50 dark:bg-orange-900/20 p-1.5 rounded-lg group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors"><Sparkles size={14} /></div>
                                                                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200 group-hover:text-orange-800 dark:group-hover:text-orange-300">Call Scoring</span>
                                                                </div>
                                                            </button>
                                                            <button
                                                                onClick={() => handleSendMessage("Analyze the prospect's personality and suggest closing techniques.")}
                                                                className="w-full p-4 rounded-xl border border-zinc-100 dark:border-zinc-700/50 glass-card dark:bg-zinc-800/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-200 dark:hover:border-orange-500/30 text-left transition-all group shadow-sm"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="text-orange-500 bg-orange-50 dark:bg-orange-900/20 p-1.5 rounded-lg group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors"><Sparkles size={14} /></div>
                                                                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200 group-hover:text-orange-800 dark:group-hover:text-orange-300">Prospect Analysis</span>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-6">
                                                        {messages.map((msg) => (
                                                            <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                                {msg.role === 'user' ? (
                                                                    <div className="max-w-[85%] flex flex-col items-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                                        <div className="bg-orange-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-md text-sm leading-relaxed">
                                                                            {msg.text}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex gap-3 max-w-[90%] animate-in fade-in duration-300">
                                                                        <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-sm shrink-0">
                                                                            <Sparkles size={14} className="text-orange-500" />
                                                                        </div>
                                                                        <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                                                                            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {isAiThinking && (
                                                            <div className="flex gap-3 max-w-[90%] animate-in fade-in duration-300">
                                                                <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-sm shrink-0">
                                                                    <Sparkles size={14} className="text-orange-500" />
                                                                </div>
                                                                <div className="flex items-center gap-1.5 pt-2 pl-1">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"></span>
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce delay-100"></span>
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce delay-200"></span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div ref={chatEndRef} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Input Area */}
                                            <div className="p-4 border-t border-zinc-100 dark:border-zinc-700/50 shrink-0 bg-white dark:bg-zinc-900 z-10">
                                                <div className={`bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border transition-all flex flex-col ${chatInput.trim() ? 'border-orange-500/30 ring-2 ring-orange-500/10' : 'border-zinc-200 dark:border-zinc-700/50'}`}>
                                                    <div className="flex items-center gap-2 px-3 py-2">
                                                        <input
                                                            type="text"
                                                            value={chatInput}
                                                            onChange={(e) => setChatInput(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(chatInput)}
                                                            placeholder={`Ask about ${selectedProspect.name.split(' ')[0]}...`}
                                                            className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400 h-9"
                                                            disabled={isAiThinking}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between items-center gap-2 px-2 pb-2">
                                                        <div className="flex items-center gap-1">
                                                            <button className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/50 rounded-lg transition-colors"><Paperclip size={14} /></button>
                                                            <button className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/50 rounded-lg transition-colors"><Mic size={14} /></button>
                                                        </div>
                                                        <button
                                                            onClick={() => handleSendMessage(chatInput)}
                                                            disabled={!chatInput.trim() || isAiThinking}
                                                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm transition-all ${chatInput.trim() && !isAiThinking
                                                                ? 'bg-orange-600 hover:bg-orange-700 hover:scale-105'
                                                                : 'bg-zinc-300 dark:bg-zinc-700 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            <ArrowUp size={14} strokeWidth={2.5} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="text-[10px] text-center text-zinc-400 dark:text-zinc-500 mt-2 font-medium">
                                                    CalliX may occasionally make mistakes. Verify important information.
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 2. TRANSCRIPT TAB */}
                                    {overviewSubTab === 'transcript' && (
                                        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
                                            {MOCK_TRANSCRIPT.map((msg, idx) => (
                                                <div key={idx} className="flex gap-4 group">
                                                    <div className={`w-7 h-7 rounded flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold ${msg.color} shadow-sm mt-0.5`}>
                                                        {msg.initials}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{msg.speaker}</span>
                                                            <span className="text-[10px] font-medium text-orange-600 dark:text-orange-500">{msg.time}</span>
                                                        </div>
                                                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                                            {msg.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* 3. CUSTOMER JOURNEY TAB */}
                                    {overviewSubTab === 'journey' && (
                                        <div className="flex-1 overflow-y-auto px-8 py-8">
                                            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1 font-dm-sans">Customer Journey</h2>
                                            <p className="text-zinc-500 dark:text-zinc-300 text-sm mb-10 leading-relaxed">Here is the journey of the customer from the initial contact to the current status.</p>

                                            <div className="space-y-0 pl-2">
                                                {MOCK_JOURNEY.map((item, idx) => {
                                                    const isLast = idx === MOCK_JOURNEY.length - 1;
                                                    return (
                                                        <div key={idx} className="relative pl-8 pb-8 group">
                                                            {!isLast && (
                                                                <div className="absolute left-[9px] top-6 bottom-0 w-[1px] bg-zinc-100 border-l border-dashed border-zinc-200"></div>
                                                            )}
                                                            <div className="absolute left-0 top-1 text-zinc-300 dark:text-zinc-600 group-hover:text-orange-500 dark:group-hover:text-orange-500 transition-colors">
                                                                <item.icon size={18} strokeWidth={1.5} />
                                                            </div>
                                                            <div className="flex flex-col gap-0.5">
                                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.title}</span>
                                                                    <span className="text-sm font-medium text-orange-500 font-mono tracking-tight">{item.date}</span>
                                                                </div>
                                                                {item.desc && (
                                                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">{item.desc}</p>
                                                                )}
                                                                {item.actionText && (
                                                                    <div className="flex items-center gap-1 mt-1 text-sm font-medium">
                                                                        <span className="text-zinc-500 dark:text-zinc-400">{item.actionText}</span>
                                                                        <span className="text-orange-500 cursor-pointer hover:underline">{item.actionLink}</span>
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
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-dm-sans">AI Call Summary</h3>
                                </div>

                                {/* Where we left off */}
                                <div className="glass-card p-4 rounded-xl border border-zinc-100 dark:border-zinc-700/50 dark:bg-zinc-800/50">
                                    <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-widest mb-2">Where we left off</h4>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                                        {analysisData.summary.lastPoint}
                                    </p>
                                </div>

                                {/* Closing Likelihood */}
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-widest">Closing Likelihood</h4>
                                        <span className="text-2xl font-bold text-orange-600">{analysisData.summary.closingLikelihood}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${analysisData.summary.closingLikelihood}%` }}></div>
                                    </div>
                                </div>

                                {/* Highest Probability Action */}
                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-500/30 p-4 rounded-xl">
                                    <h4 className="text-xs font-bold text-orange-800 dark:text-orange-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Zap size={14} /> Highest-Probability Closing Action
                                    </h4>
                                    <p className="text-sm font-bold text-orange-900 dark:text-orange-100">
                                        {analysisData.summary.highProbAction}
                                    </p>
                                </div>

                                {/* Next Steps */}
                                <div>
                                    <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-widest mb-3">Next Steps</h4>
                                    <ul className="space-y-3">
                                        {analysisData.summary.nextSteps.map((step, i) => (
                                            <li
                                                key={i}
                                                onClick={() => toggleStep(i)}
                                                className={`flex items-center gap-3 p-3 border rounded-lg transition-all cursor-pointer ${completedSteps.includes(i)
                                                    ? 'border-orange-200 bg-orange-50/30'
                                                    : 'border-zinc-100 dark:border-zinc-700 hover:border-orange-200 dark:hover:border-orange-600 bg-white dark:bg-zinc-800'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${completedSteps.includes(i)
                                                    ? 'border-orange-500 bg-orange-500'
                                                    : 'border-zinc-300 dark:border-zinc-600 hover:border-orange-500 group-hover:bg-orange-50'
                                                    }`}>
                                                    <Check size={12} className={`transition-opacity ${completedSteps.includes(i) ? 'text-white opacity-100' : 'text-orange-600 opacity-0'}`} />
                                                </div>
                                                <span className={`text-sm font-medium transition-colors ${completedSteps.includes(i) ? 'text-zinc-400 line-through' : 'text-zinc-700 dark:text-zinc-200'}`}>
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
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-dm-sans">Objection & Friction Analysis</h3>
                                </div>

                                <div className="space-y-4">
                                    {analysisData.objections.map((obj, i) => (
                                        <div key={i} className="glass-card border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800/50 rounded-xl p-5 hover:shadow-sm transition-shadow">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="p-1.5 bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 rounded-lg mt-0.5 shadow-sm">
                                                    <AlertTriangle size={16} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-zinc-800 dark:text-zinc-100 text-sm mb-1">{obj.blocker}</h4>
                                                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{obj.impact}</p>
                                                </div>
                                            </div>

                                            <div className="bg-orange-50/50 dark:bg-white/10 border border-orange-100 dark:border-white/10 p-3 rounded-lg ml-11">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <CheckCircle2 size={12} className="text-orange-600 dark:text-orange-400" />
                                                    <span className="text-[10px] font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wide">Suggested Counterplay</span>
                                                </div>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-snug">
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
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-dm-sans">Buyer Intent & Psychology</h3>
                                </div>

                                {/* Avatar Badge */}
                                <div className="flex items-center gap-4 p-4 glass-card rounded-xl border border-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50">
                                    <div>
                                        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-widest">Identified Persona</span>
                                        <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{analysisData.psychology.avatar}</h4>
                                    </div>
                                </div>

                                {/* Grid Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl dark:bg-zinc-800/50">
                                        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-widest block mb-2">Intent Strength</span>
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-6 bg-orange-500 rounded-sm"></div>
                                                <div className="w-2 h-6 bg-orange-500 rounded-sm"></div>
                                                <div className="w-2 h-6 bg-orange-500 rounded-sm"></div>
                                                <div className="w-2 h-6 bg-zinc-200 dark:bg-zinc-700 rounded-sm"></div>
                                            </div>
                                            <span className="font-bold text-zinc-800 dark:text-white text-sm">{analysisData.psychology.intent}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl dark:bg-zinc-800/50">
                                        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-widest block mb-2">Urgency Cues</span>
                                        <div className="flex items-center gap-2 text-zinc-600">
                                            <Clock size={20} className="text-zinc-400 dark:text-zinc-500" />
                                            <span className="font-bold text-zinc-800 dark:text-white text-sm">{analysisData.psychology.urgency}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl dark:bg-zinc-800/50">
                                        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-widest block mb-2">Trust & Rapport</span>
                                        <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 text-xs font-bold rounded">
                                            {analysisData.psychology.trust}
                                        </span>
                                    </div>
                                    <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl dark:bg-zinc-800/50">
                                        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-widest block mb-2">Comm. Style</span>
                                        <span className="text-sm font-bold text-zinc-700 dark:text-white">{analysisData.psychology.commStyle}</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-500/30 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageSquare size={14} className="text-orange-600 dark:text-orange-400" />
                                        <span className="text-xs font-bold text-orange-800 dark:text-orange-300 uppercase tracking-wide">Recommended Style</span>
                                    </div>
                                    <p className="text-sm text-orange-900/90 dark:text-orange-100 leading-relaxed font-medium">
                                        Keep emails under 100 words. Lead with ROI metrics. Avoid fluff. This buyer values time and direct answers.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: Follow-Up */}
                        {analysisTab === 'Follow-Up' && (
                            <div className="flex flex-col h-full space-y-6 overflow-y-auto no-scrollbar p-6">
                                <div className="mb-2">
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-dm-sans">Recommended Follow-Up Plays</h3>
                                </div>

                                <p className="text-sm text-zinc-500 mb-2">Contextual, high-probability actions to execute next.</p>

                                <div className="space-y-4">
                                    {analysisData.followUp.map((play, i) => (
                                        <div key={i} className="flex gap-4 p-4 border border-zinc-200 dark:border-zinc-700/50 rounded-xl hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-md transition-all group cursor-pointer glass-card dark:bg-zinc-800/30 items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white dark:bg-zinc-700 text-orange-600 dark:text-orange-400 shadow-sm`}>
                                                {play.type === 'Email' ? <MailIcon size={18} /> : <Phone size={18} />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-zinc-800 dark:text-zinc-100 text-sm group-hover:text-orange-700 dark:group-hover:text-orange-500 transition-colors">{play.action}</h4>
                                                    <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700 rounded text-[10px] font-bold text-zinc-500 dark:text-zinc-300 uppercase shadow-sm">{play.type}</span>
                                                </div>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                                                    {play.context}
                                                </p>
                                            </div>
                                            <div className="self-center">
                                                <ArrowRight size={16} className="text-zinc-300 group-hover:text-orange-500" />
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
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-dm-sans">Risk Indicators</h3>
                                </div>

                                <div className="space-y-4">
                                    {analysisData.risks.map((risk, i) => (
                                        <div key={i} className={`p-5 rounded-xl border-l-4 ${risk.level === 'High' ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-500' : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-600'}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${risk.level === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' : 'bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300'}`}>
                                                    {risk.level} Risk
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                                                "{risk.indicator}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: Velocity */}
                        {analysisTab === 'Velocity' && (
                            <div className="flex flex-col h-full overflow-y-auto no-scrollbar p-6 bg-zinc-50/50 dark:bg-zinc-900/40">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                                        <div>
                                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-dm-sans">Deal Velocity</h3>
                                            <p className="text-xs text-zinc-500 font-medium">Real-time momentum analysis</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-orange-100/50 text-orange-700 text-xs font-bold rounded-full border border-orange-200">
                                        Live Updates
                                    </span>
                                </div>

                                {/* Main Metrics Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    {/* Momentum Output */}
                                    <div className="glass-card p-5 rounded-2xl border border-zinc-200 dark:border-white/10 dark:bg-zinc-800/50 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Activity size={80} />
                                        </div>
                                        <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Momentum Score</h4>
                                        <div className="flex items-end gap-3 mb-4">
                                            <span className="text-5xl font-bold text-zinc-900 dark:text-white tracking-tighter">85</span>
                                            <div className="pb-2">
                                                <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-xs font-bold">
                                                    <ArrowUp size={12} strokeWidth={3} />
                                                    <span>12%</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Abstract Visualization */}
                                        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden flex gap-0.5">
                                            <div className="h-full bg-orange-500 w-[85%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                        </div>
                                        <p className="mt-3 text-xs text-zinc-500 font-medium leading-relaxed">
                                            Deal velocity is <span className="text-orange-600 dark:text-orange-400 font-bold">Accelerating</span> due to recent stakeholder engagement.
                                        </p>
                                    </div>

                                    {/* Win Probability Map */}
                                    <div className="glass-card p-5 rounded-2xl border border-zinc-200 dark:border-white/10 dark:bg-zinc-800/50 shadow-sm flex flex-col justify-between relative overflow-hidden">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Projected Close</h4>
                                                <span className="text-xl font-bold text-zinc-900 dark:text-white">Q4 '25</span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 flex items-center justify-center">
                                                <Calendar size={14} />
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            <div className="flex justify-between text-xs font-medium text-zinc-600">
                                                <span>Confidence</span>
                                                <span className="text-zinc-900 font-bold">High (72%)</span>
                                            </div>
                                            <div className="w-full bg-zinc-100 dark:bg-zinc-700/50 h-1.5 rounded-full overflow-hidden">
                                                <div className="h-full bg-zinc-300 dark:bg-zinc-500 w-[72%] rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pace Analysis Timeline */}
                                <div className="glass-card p-5 rounded-2xl border border-zinc-200 dark:border-white/10 dark:bg-zinc-800/50 shadow-sm mb-4">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Clock size={16} className="text-zinc-400" />
                                        <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-200 uppercase tracking-widest">Stage Duration Analysis</h4>
                                    </div>

                                    {/* Timeline Viz */}
                                    <div className="relative h-12 flex items-center">
                                        {/* Base Line */}
                                        <div className="absolute left-0 right-0 h-0.5 bg-zinc-100 dark:bg-zinc-700 top-1/2 -translate-y-1/2"></div>

                                        {/* Average Marker */}
                                        <div className="absolute left-[60%] top-1/2 -translate-y-1/2 flex flex-col items-center group">
                                            <div className="w-0.5 h-3 bg-zinc-300 mb-1"></div>
                                            <div className="w-2 h-2 rounded-full bg-zinc-300 group-hover:scale-125 transition-transform"></div>
                                            <div className="absolute top-full mt-2 text-[9px] font-bold text-zinc-400 uppercase tracking-wide whitespace-nowrap">Avg (7 Days)</div>
                                        </div>

                                        {/* Current Marker */}
                                        <div className="absolute left-[35%] top-1/2 -translate-y-1/2 flex flex-col items-center px-3 py-1 bg-orange-50 border border-orange-100 dark:bg-orange-900/20 dark:border-orange-500/20 rounded-lg shadow-sm z-10">
                                            <span className="text-xs font-bold text-orange-700 dark:text-orange-400">4 Days</span>
                                            <span className="text-[9px] font-medium text-orange-600/80 dark:text-orange-400/70">Current</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Force Analysis */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-orange-600 mb-1">
                                            <TrendingUp size={14} />
                                            <h4 className="text-xs font-bold uppercase tracking-widest">Accelerators</h4>
                                        </div>
                                        {['Budget Confirmed', 'Technical Fit Verified'].map((item, i) => (
                                            <div key={i} className="glass-card p-3 rounded-xl border border-zinc-200 dark:border-white/10 dark:bg-zinc-800/50 shadow-sm flex items-center gap-3">
                                                <div className="w-1.5 h-full self-stretch bg-orange-500 rounded-full"></div>
                                                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-rose-500 mb-1">
                                            <TrendingDown size={14} />
                                            <h4 className="text-xs font-bold uppercase tracking-widest">Friction</h4>
                                        </div>
                                        {['Competitor Pricing', 'Legal Review'].map((item, i) => (
                                            <div key={i} className="glass-card p-3 rounded-xl border border-zinc-200 dark:border-white/10 dark:bg-zinc-800/50 shadow-sm flex items-center gap-3">
                                                <div className="w-1.5 h-full self-stretch bg-rose-500 rounded-full"></div>
                                                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{item}</span>
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
        <div className="flex flex-col h-full px-8 py-6 w-full max-w-[1600px] mx-auto text-zinc-800 dark:text-zinc-200 pb-8 relative">

            {/* --- Header --- */}


            {/* --- Controls Bar --- */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1 min-w-[300px] max-w-lg">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search by name, company or phone number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">

                    {/* Common Trends Dropdown */}
                    <div className="relative" ref={trendsDropdownRef}>
                        <button
                            onClick={() => setIsTrendsDropdownOpen(!isTrendsDropdownOpen)}
                            className={`flex items-center gap-2 px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-orange-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-all shadow-sm ${isTrendsDropdownOpen ? 'ring-2 ring-orange-500/20 border-orange-500' : ''}`}
                        >
                            <TrendingUp size={16} />
                            <span>Common Trends</span>
                            <ChevronRight size={14} className={`ml-1 text-zinc-400 transition-transform duration-200 ${isTrendsDropdownOpen ? '-rotate-90' : 'rotate-90'}`} />
                        </button>

                        {isTrendsDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <button className="w-full text-left px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-orange-50 dark:hover:bg-zinc-700 hover:text-orange-700 transition-colors flex items-center gap-3 border-b border-zinc-100/50 dark:border-zinc-700/50">
                                    <MessageSquare size={16} className="text-zinc-400" />
                                    Common Objections
                                </button>
                                <button className="w-full text-left px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-orange-50 dark:hover:bg-zinc-700 hover:text-orange-700 transition-colors flex items-center gap-3">
                                    <TrendingUp size={16} className="text-zinc-400" />
                                    Winning Messaging
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Filters Dropdown */}
                    <div className="relative" ref={filtersDropdownRef}>
                        <button
                            onClick={() => setIsFiltersDropdownOpen(!isFiltersDropdownOpen)}
                            className={`flex items-center gap-2 px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-orange-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-all shadow-sm ${isFiltersDropdownOpen ? 'ring-2 ring-orange-500/20 border-orange-500' : ''}`}
                        >
                            <Filter size={16} />
                            <span>Filters</span>
                            {activeFilterCount > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded-full">
                                    {activeFilterCount}
                                </span>
                            )}
                            <ChevronRight size={14} className={`ml-1 text-zinc-400 transition-transform duration-200 ${isFiltersDropdownOpen ? '-rotate-90' : 'rotate-90'}`} />
                        </button>

                        {isFiltersDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-700 flex items-center justify-between">
                                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Filter Prospects</span>
                                    {activeFilterCount > 0 && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                {/* Stage Filter */}
                                <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-700">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block mb-2">Stage</span>
                                    <div className="space-y-2">
                                        {['Contacted', 'Needs Contact', 'Negotiation', 'Closed'].map(stage => (
                                            <label key={stage} className="flex items-center gap-2 cursor-pointer group">
                                                <div
                                                    onClick={() => toggleStageFilter(stage)}
                                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${stageFilter.includes(stage) ? 'bg-orange-600 border-orange-600' : 'border-zinc-300 dark:border-zinc-600 group-hover:border-orange-400'}`}
                                                >
                                                    {stageFilter.includes(stage) && <Check size={12} className="text-white" />}
                                                </div>
                                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{stage}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Probability Filter */}
                                <div className="px-4 py-3">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block mb-2">Probability</span>
                                    <div className="flex flex-wrap gap-2">
                                        {[1, 2, 3, 4, 5].map(prob => (
                                            <button
                                                key={prob}
                                                onClick={() => toggleProbabilityFilter(prob)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${probabilityFilter.includes(prob) ? 'bg-orange-600 text-white' : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-orange-100 dark:hover:bg-zinc-600'}`}
                                            >
                                                {prob}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="flex items-center gap-2 px-5 py-3 bg-orange-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-700 hover:-translate-y-0.5 transition-all">
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
                                    <th key={i} className={`pb-2 px-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest ${head.align === 'center' ? 'text-center' : 'text-left'}`} style={{ width: head.width }}>
                                        <div className={`flex items-center gap-1 ${head.align === 'center' ? 'justify-center' : ''}`}>
                                            {head.label.replace(' (I)', '')}
                                            {head.label.includes('(I)') && <span className="text-zinc-300 ml-1"> (i) </span>}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProspects.map((prospect) => (
                                <tr
                                    key={prospect.id}
                                    className="group bg-white dark:bg-zinc-800/50 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all duration-200 cursor-pointer"
                                    onClick={() => handleRowClick(prospect)}
                                >
                                    <td className="py-5 px-6 rounded-l-2xl border-l border-y border-zinc-100/50 dark:border-white/5 group-hover:border-orange-100 dark:group-hover:border-orange-900/40">
                                        <div className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">{prospect.name}</div>
                                    </td>
                                    <td className="py-5 px-6 border-y border-zinc-100/50 dark:border-white/5 group-hover:border-orange-100 dark:group-hover:border-orange-900/40">
                                        {formatPhoneDisplay(prospect.phone)}
                                    </td>
                                    <td className="py-5 px-6 border-y border-zinc-100/50 dark:border-white/5 group-hover:border-orange-100 dark:group-hover:border-orange-900/40">
                                        <div className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">{prospect.company}</div>
                                    </td>
                                    <td className="py-5 px-6 border-y border-zinc-100/50 dark:border-white/5 group-hover:border-orange-100 dark:group-hover:border-orange-900/40">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${prospect.stage === 'Contacted'
                                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                                            : prospect.stage === 'Needs Contact'
                                                ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
                                                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700/50 dark:text-zinc-300'
                                            }`}>
                                            {prospect.stage}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-center border-y border-zinc-100/50 dark:border-white/5 group-hover:border-orange-100 dark:group-hover:border-orange-900/40">
                                        <div className="w-8 h-8 rounded-lg mx-auto shadow-sm overflow-hidden ring-1 ring-white dark:ring-zinc-700">
                                            <img src={prospect.avatarImage} alt={prospect.name} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 border-y border-zinc-100/50 dark:border-white/5 group-hover:border-orange-100 dark:group-hover:border-orange-900/40">
                                        <ProbabilityBars level={prospect.probability} />
                                    </td>
                                    <td className="py-5 px-6 rounded-r-2xl border-r border-y border-zinc-100/50 dark:border-white/5 group-hover:border-orange-100 dark:group-hover:border-orange-900/40">
                                        <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                                            <Calendar size={14} className="text-zinc-400" />
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
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 font-bold bg-white/40 dark:bg-zinc-800/40 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/40 dark:border-white/10">
                        Showing <span className="text-zinc-900 dark:text-zinc-100">{filteredProspects.length}</span> of {prospects.length}
                    </div>
                    <div className="flex items-center gap-2 bg-white/40 dark:bg-zinc-800/40 p-1 rounded-xl backdrop-blur-sm border border-white/40 dark:border-white/10 shadow-sm">
                        <button className="p-2 hover:bg-white/60 dark:hover:bg-zinc-700/50 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors disabled:opacity-50">
                            <ChevronLeft size={14} />
                        </button>
                        {[1, 2, 3, 4, 5].map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${currentPage === page
                                    ? 'bg-white dark:bg-zinc-800 text-orange-600 border border-orange-200 dark:border-orange-700 shadow-sm'
                                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-white/60 dark:hover:bg-zinc-700/50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button className="p-2 hover:bg-white/60 dark:hover:bg-zinc-700/50 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
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