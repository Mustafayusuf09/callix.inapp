import React, { useState } from 'react';
import {
    Search,
    ChevronDown,
    Filter,
    ChevronLeft,
    Phone,
    TrendingUp,
    TrendingDown,
    Users,
    Brain,
    Briefcase,
    Target,
    Map,
    ShieldAlert,
    MessageCircle,
    CheckCircle2,
    Info,
    ArrowUpRight,
    ArrowDownRight,
    Edit,
    Save,
    X
} from 'lucide-react';

type Status = 'Complete' | 'Optimizing' | 'Incomplete';

interface AvatarProfile {
    id: string;
    role: string;
    image: string;
    status: Status;
}

interface AvatarDetailData {
    description: string;
    demographics: string[];
    psychographics: string[];
    operationalContext: string[];
    goals: string[];
    buyingJourney: string[];
    objections: string[];
    messaging: string[];
    matchConditions: string[];
    stats: {
        callsAnalyzed: number;
        callsTrend: number;
        conversionRate: number;
        conversionTrend: number;
    }
}

const MOCK_AVATARS: AvatarProfile[] = [
    { id: '1', role: 'Chief Marketing Officer', status: 'Complete', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces' },
    { id: '2', role: 'VP of Sales', status: 'Complete', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces' },
    { id: '3', role: 'Product Manager', status: 'Optimizing', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces' },
    { id: '4', role: 'Chief Technology Officer', status: 'Incomplete', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=faces' },
    { id: '5', role: 'Director of Operations', status: 'Complete', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=faces' },
    { id: '6', role: 'Head of Customer Success', status: 'Incomplete', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces' },
    { id: '7', role: 'Senior Software Engineer', status: 'Complete', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces' },
    { id: '8', role: 'Business Development Manager', status: 'Optimizing', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces' },
    { id: '9', role: 'Chief Financial Officer', status: 'Complete', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces' },
    { id: '10', role: 'VP of Engineering', status: 'Optimizing', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces' },
    { id: '11', role: 'Marketing Director', status: 'Incomplete', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=faces' },
    { id: '12', role: 'Sales Manager', status: 'Complete', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=faces' },
    { id: '13', role: 'UX/UI Designer', status: 'Optimizing', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces' },
    { id: '14', role: 'Data Analyst', status: 'Incomplete', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces' },
    { id: '15', role: 'Account Executive', status: 'Complete', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces' },
    { id: '16', role: 'HR Manager', status: 'Complete', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces' },
    { id: '17', role: 'Content Strategist', status: 'Optimizing', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces' },
    { id: '18', role: 'Chief Executive Officer', status: 'Incomplete', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=faces' },
];

const generateMockDetail = (role: string): AvatarDetailData => ({
    description: "You’re about to speak with someone who’s been leading at a high level for years—probably a CEO, CIO, or an operations or tech VP at a big firm, most likely in tech, finance, healthcare, or manufacturing. They're sharp, big-picture thinkers who want to see strategy, ROI, and results—no fluff. Their days are packed with tough calls: managing complex systems, handling board pressure, and making sure every part of the business is pulling in the same direction. They care about innovation but want proof that something works, fast, and hate anything that could slow down their team or disrupt what’s already in place.",
    demographics: [
        "Age: 45-60",
        "Education: MBA or Advanced Degree",
        "Experience: 15+ years in industry",
        "Location: Major Metropolitan Hubs",
        "Income: $250k+"
    ],
    psychographics: [
        "Values efficiency and directness",
        "Risk-averse but innovation-hungry",
        "Data-driven decision maker",
        "Protective of their time",
        "Legacy-oriented mindset"
    ],
    operationalContext: [
        "Managing large, cross-functional teams",
        "Reporting to Board of Directors",
        "Budget authority > $1M",
        "High pressure environment",
        "Digital transformation initiatives"
    ],
    goals: [
        "Increase operational efficiency",
        "Reduce overhead costs",
        "Accelerate time-to-market",
        "Mitigate enterprise risk",
        "Scale sustainably"
    ],
    buyingJourney: [
        "Research: Peers & Analyst Reports",
        "Evaluation: ROI Analysis & Compliance",
        "Decision: Consensus driven",
        "Implementation: Phased rollout",
        "Review: Quarterly Business Reviews"
    ],
    objections: [
        "Implementation timeline risks",
        "Integration with legacy systems",
        "Security & Compliance concerns",
        "Total Cost of Ownership (TCO)",
        "Change management friction"
    ],
    messaging: [
        "Focus on strategic outcomes",
        "Highlight proven ROI cases",
        "Use 'Enterprise-grade' terminology",
        "Emphasize security and scalability",
        "Keep it concise and high-level"
    ],
    matchConditions: [
        "Company size > 1000 employees",
        "Revenue > $50M",
        "Active digital initiative",
        "Budget cycle alignment",
        "Executive sponsorship present"
    ],
    stats: {
        callsAnalyzed: Math.floor(Math.random() * 50) + 10,
        callsTrend: Math.floor(Math.random() * 30),
        conversionRate: parseFloat((Math.random() * 20 + 10).toFixed(1)),
        conversionTrend: parseFloat((Math.random() * 20 - 10).toFixed(1))
    }
});

const AvatarView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('Demographics');
    const [isEditing, setIsEditing] = useState(false);
    const [avatarDetail, setAvatarDetail] = useState<AvatarDetailData | null>(null);

    // Sort & Filter States
    const [sortBy, setSortBy] = useState<'name' | 'status'>('name');
    const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter & Sort Logic
    const filteredAvatars = MOCK_AVATARS
        .filter(avatar =>
            avatar.role.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterStatus === 'All' || avatar.status === filterStatus)
        )
        .sort((a, b) => {
            if (sortBy === 'name') return a.role.localeCompare(b.role);
            if (sortBy === 'status') {
                const order = { 'Complete': 1, 'Optimizing': 2, 'Incomplete': 3 };
                return order[a.status] - order[b.status];
            }
            return 0;
        });

    React.useEffect(() => {
        if (selectedAvatarId) {
            const avatar = MOCK_AVATARS.find(a => a.id === selectedAvatarId);
            if (avatar) {
                setAvatarDetail(generateMockDetail(avatar.role));
            }
        } else {
            setAvatarDetail(null);
        }
        setIsEditing(false);
    }, [selectedAvatarId]);

    const handleDetailChange = (category: keyof AvatarDetailData, index: number, newValue: string) => {
        if (!avatarDetail) return;

        setAvatarDetail(prev => {
            if (!prev) return null;
            const updatedCategory = [...(prev[category] as string[])];
            updatedCategory[index] = newValue;
            return { ...prev, [category]: updatedCategory };
        });
    };

    const getStatusColor = (status: Status) => {
        switch (status) {
            case 'Complete': return 'bg-orange-600 text-white hover:bg-orange-700';
            case 'Optimizing': return 'bg-zinc-600 text-white hover:bg-zinc-700';
            case 'Incomplete': return 'bg-zinc-900 text-white hover:bg-black';
            default: return 'bg-zinc-500 text-white';
        }
    };

    // Data filtered in state above

    const selectedAvatar = MOCK_AVATARS.find(a => a.id === selectedAvatarId);
    // avatarDetail is now state-managed

    // --------------------------------------------------------------------------
    // DETAIL VIEW
    // --------------------------------------------------------------------------
    if (selectedAvatar && avatarDetail) {

        const tabs = [
            { id: 'Demographics', label: 'Demographics', data: avatarDetail.demographics, key: 'demographics' as keyof AvatarDetailData, icon: Users },
            { id: 'Psychographics', label: 'Psychographics', data: avatarDetail.psychographics, key: 'psychographics' as keyof AvatarDetailData, icon: Brain },
            { id: 'Operational Context', label: 'Operational Context', data: avatarDetail.operationalContext, key: 'operationalContext' as keyof AvatarDetailData, icon: Briefcase },
            { id: 'Goals', label: 'Goals & Motivations', data: avatarDetail.goals, key: 'goals' as keyof AvatarDetailData, icon: Target },
            { id: 'Buying Journey', label: 'Buying Journey', data: avatarDetail.buyingJourney, key: 'buyingJourney' as keyof AvatarDetailData, icon: Map },
            { id: 'Objections', label: 'Objection Patterns', data: avatarDetail.objections, key: 'objections' as keyof AvatarDetailData, icon: ShieldAlert },
            { id: 'Messaging', label: 'Messaging Framework', data: avatarDetail.messaging, key: 'messaging' as keyof AvatarDetailData, icon: MessageCircle },
            { id: 'Match Conditions', label: 'Match Conditions', data: avatarDetail.matchConditions, key: 'matchConditions' as keyof AvatarDetailData, icon: CheckCircle2 },
        ];

        const activeTabData = tabs.find(t => t.id === activeTab) || tabs[0];

        // Helper to parse "Label: Value" strings
        const parseField = (text: string) => {
            const parts = text.split(':');
            if (parts.length > 1) {
                return { label: parts[0].trim(), value: parts.slice(1).join(':').trim() };
            }
            return { label: null, value: text };
        };

        return (
            <div className="flex flex-col px-8 py-8 w-full max-w-[1600px] mx-auto text-zinc-800 dark:text-zinc-200 pb-24 animate-in fade-in slide-in-from-right-4 duration-300">

                {/* Back Link */}
                <button
                    onClick={() => { setSelectedAvatarId(null); setActiveTab('Demographics'); }}
                    className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors mb-6 text-xs font-bold uppercase tracking-widest w-fit group"
                >
                    <ChevronLeft size={14} strokeWidth={3} className="group-hover:-translate-x-0.5 transition-transform" />
                    Back to Avatars
                </button>

                {/* Header Section - Redesigned */}
                <div className="relative mb-8">
                    {/* Main Hero Card */}
                    <div className="relative bg-white dark:bg-gradient-to-br dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800 border border-zinc-200 dark:border-transparent rounded-3xl p-8 overflow-hidden shadow-sm dark:shadow-none">
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-rose-500/5 pointer-events-none" />
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col lg:flex-row gap-8">
                            {/* Left: Avatar & Info */}
                            <div className="flex items-center gap-6 flex-1">
                                {/* Avatar with glow effect */}
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl blur-xl opacity-20 dark:opacity-30" />
                                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-white/10 shadow-2xl">
                                        <img src={selectedAvatar.image} alt={selectedAvatar.role} className="w-full h-full object-cover" />
                                    </div>
                                </div>

                                {/* Title & Status */}
                                <div className="space-y-3">
                                    <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight font-dm-sans">
                                        {selectedAvatar.role}
                                    </h1>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-lg ${getStatusColor(selectedAvatar.status)}`}>
                                            {selectedAvatar.status}
                                        </span>
                                        <span className="text-zinc-300 dark:text-zinc-600 text-sm">•</span>
                                        <span className="text-zinc-400 dark:text-zinc-400 text-sm font-medium">Customer Avatar</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Stats */}
                            <div className="flex gap-4">
                                {/* Calls Card */}
                                <div className="bg-zinc-50 dark:bg-white/5 backdrop-blur-sm border border-zinc-200 dark:border-white/10 rounded-2xl p-5 min-w-[180px] hover:bg-zinc-100 dark:hover:bg-white/10 hover:border-orange-500/30 transition-all duration-300 group">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl group-hover:scale-110 transition-transform">
                                            <Phone size={18} />
                                        </div>
                                        <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Calls Analyzed</span>
                                    </div>
                                    <div className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                                        {avatarDetail.stats.callsAnalyzed}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-orange-600 dark:text-orange-400 bg-orange-500/10 dark:bg-orange-500/20 px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1">
                                            <TrendingUp size={10} />
                                            {avatarDetail.stats.callsTrend}%
                                        </span>
                                        <span className="text-zinc-400 dark:text-zinc-500 text-xs">vs last 30 days</span>
                                    </div>
                                </div>

                                {/* Conversion Card */}
                                <div className="bg-zinc-50 dark:bg-white/5 backdrop-blur-sm border border-zinc-200 dark:border-white/10 rounded-2xl p-5 min-w-[180px] hover:bg-zinc-100 dark:hover:bg-white/10 hover:border-orange-500/30 transition-all duration-300 group">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl group-hover:scale-110 transition-transform">
                                            <Target size={18} />
                                        </div>
                                        <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Conversion</span>
                                    </div>
                                    <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 tracking-tight mb-2">
                                        {avatarDetail.stats.conversionRate}%
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`${avatarDetail.stats.conversionTrend >= 0 ? 'text-orange-600 dark:text-orange-400 bg-orange-500/10 dark:bg-orange-500/20' : 'text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/20'} px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1`}>
                                            {avatarDetail.stats.conversionTrend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                            {Math.abs(avatarDetail.stats.conversionTrend)}%
                                        </span>
                                        <span className="text-zinc-400 dark:text-zinc-500 text-xs">vs last 30 days</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="relative z-10 mt-8 pt-6 border-t border-zinc-200 dark:border-white/10">
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm lg:text-base max-w-5xl">
                                {avatarDetail.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                                : 'bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl p-8 shadow-sm min-h-[400px] animate-in slide-in-from-bottom-2 duration-300 key={activeTab}"> {/* Key forces re-render animation */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg">
                                <activeTabData.icon size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-dm-sans">{activeTabData.label}</h2>
                        </div>
                        <div className="flex gap-2">
                            {isEditing ? (
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex items-center gap-2 px-3 py-1.5 border border-orange-200 rounded-lg text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-sm"
                                >
                                    <Save size={12} />
                                    Save Changes
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-orange-600 hover:border-orange-200 transition-colors bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                                >
                                    <Edit size={12} />
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {activeTabData.data.map((item, i) => {
                            const { label, value } = parseField(item);

                            // EDIT MODE
                            if (isEditing) {
                                if (label) {
                                    return (
                                        <div key={i} className="space-y-2">
                                            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-300 uppercase tracking-wider">{label}</label>
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={(e) => handleDetailChange(activeTabData.key, i, `${label}: ${e.target.value}`)}
                                                className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-semibold text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                            />
                                        </div>
                                    );
                                }
                                return (
                                    <div key={i} className="col-span-1 md:col-span-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <activeTabData.icon size={14} className="text-orange-500" />
                                            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase">Item {i + 1}</span>
                                        </div>
                                        <textarea
                                            value={value}
                                            onChange={(e) => handleDetailChange(activeTabData.key, i, e.target.value)}
                                            rows={2}
                                            className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                                        />
                                    </div>
                                );
                            }

                            // VIEW MODE
                            if (label) {
                                return (
                                    <div key={i} className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-400 dark:text-zinc-100 uppercase tracking-wider">{label}</label>
                                        <div className="flex items-center">
                                            <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-lg text-sm font-semibold text-zinc-800 dark:text-zinc-100 w-full">
                                                {value}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={i} className="flex items-start gap-3 col-span-1 md:col-span-2 p-3 bg-zinc-50/50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100/50 dark:border-white/5 hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-colors group">
                                    <div className="p-1.5 bg-orange-100/50 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-500 flex-shrink-0 mt-0.5 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/50 group-hover:scale-110 transition-all">
                                        <activeTabData.icon size={14} />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">{value}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        );
    }

    // --------------------------------------------------------------------------
    // LIST VIEW (Grid)
    // --------------------------------------------------------------------------
    return (
        <div className="flex flex-col h-full px-8 py-8 w-full max-w-[1600px] mx-auto text-zinc-800 dark:text-zinc-200 pb-24">

            {/* Header */}


            {/* Controls Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                {/* Search */}
                <div className="relative w-full max-w-sm">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                    />
                </div>

                {/* Right Filters */}
                <div className="flex items-center gap-3">
                    {/* SORT DROPDOWN */}
                    <div className="relative">
                        <button
                            onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }}
                            className={`flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-800 border ${isSortOpen ? 'border-orange-500 ring-2 ring-orange-500/10' : 'border-zinc-200 dark:border-zinc-700'} rounded-lg text-sm font-medium text-zinc-500 dark:text-zinc-200 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-all shadow-sm group`}
                        >
                            <span>Sort: {sortBy === 'name' ? 'Name' : 'Status'}</span>
                            <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isSortOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-1">
                                    <button onClick={() => { setSortBy('name'); setIsSortOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${sortBy === 'name' ? 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400' : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}>
                                        <span>Name</span>
                                        {sortBy === 'name' && <CheckCircle2 size={14} />}
                                    </button>
                                    <button onClick={() => { setSortBy('status'); setIsSortOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${sortBy === 'status' ? 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400' : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}>
                                        <span>Status</span>
                                        {sortBy === 'status' && <CheckCircle2 size={14} />}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FILTER DROPDOWN */}
                    <div className="relative">
                        <button
                            onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }}
                            className={`flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-800 border ${filterStatus !== 'All' || isFilterOpen ? 'border-orange-500 ring-2 ring-orange-500/10' : 'border-zinc-200 dark:border-zinc-700'} rounded-lg text-sm font-medium ${filterStatus !== 'All' ? 'text-orange-600' : 'text-zinc-500 dark:text-zinc-200'} hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-all shadow-sm group`}
                        >
                            <Filter size={14} className={filterStatus !== 'All' ? 'text-orange-600' : 'text-zinc-400'} />
                            <span>Filters {filterStatus !== 'All' && `(${filterStatus})`}</span>
                        </button>

                        {isFilterOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-2 border-b border-zinc-100 dark:border-zinc-800">
                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-2">Status</span>
                                </div>
                                <div className="p-1">
                                    {['All', 'Complete', 'Optimizing', 'Incomplete'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => { setFilterStatus(status as any); setIsFilterOpen(false); }}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${filterStatus === status ? 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400' : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                                        >
                                            <span>{status}</span>
                                            {filterStatus === status && <CheckCircle2 size={14} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAvatars.map((avatar) => (
                    <div
                        key={avatar.id}
                        onClick={() => setSelectedAvatarId(avatar.id)}
                        className="glass-card dark:bg-zinc-800/50 dark:border-white/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-4 cursor-pointer group"
                    >
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100">
                            <img
                                src={avatar.image}
                                alt={avatar.role}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        <div className="flex flex-col items-start gap-2">
                            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight font-dm-sans">
                                {avatar.role}
                            </h3>
                            <span className={`px-3 py-1 rounded-md text-xs font-medium shadow-sm transition-colors ${getStatusColor(avatar.status)}`}>
                                {avatar.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Helper Component for Detail Sections
// DetailSection removed as it is no longer used

export default AvatarView;