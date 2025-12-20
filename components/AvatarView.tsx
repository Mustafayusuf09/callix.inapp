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
    ArrowDownRight
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

    const getStatusColor = (status: Status) => {
        switch (status) {
            case 'Complete': return 'bg-emerald-500 text-white hover:bg-emerald-600';
            case 'Optimizing': return 'bg-[#A88B2D] text-white hover:bg-[#967D29]'; // Custom gold/brown
            case 'Incomplete': return 'bg-[#B93838] text-white hover:bg-[#A63232]'; // Custom red
            default: return 'bg-slate-500 text-white';
        }
    };

    const filteredAvatars = MOCK_AVATARS.filter(avatar =>
        avatar.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedAvatar = MOCK_AVATARS.find(a => a.id === selectedAvatarId);
    const avatarDetail = selectedAvatar ? generateMockDetail(selectedAvatar.role) : null;

    // --------------------------------------------------------------------------
    // DETAIL VIEW
    // --------------------------------------------------------------------------
    if (selectedAvatar && avatarDetail) {
        return (
            <div className="flex flex-col px-8 py-8 w-full max-w-[1600px] mx-auto text-slate-800 pb-24 animate-in fade-in slide-in-from-right-4 duration-300">

                {/* Back Link */}
                <button
                    onClick={() => setSelectedAvatarId(null)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-6 text-xs font-bold uppercase tracking-widest w-fit group"
                >
                    <ChevronLeft size={14} strokeWidth={3} className="group-hover:-translate-x-0.5 transition-transform" />
                    Back to Avatars
                </button>

                {/* Header Section */}
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-8">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* Avatar & Title */}
                        <div className="flex items-start gap-6 flex-1">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md flex-shrink-0">
                                <img src={selectedAvatar.image} alt={selectedAvatar.role} className="w-full h-full object-cover" />
                            </div>
                            <div className="pt-1">
                                <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">{selectedAvatar.role}</h1>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${getStatusColor(selectedAvatar.status)}`}>
                                    {selectedAvatar.status}
                                </span>
                            </div>
                        </div>

                        {/* Metrics Cards */}
                        <div className="flex gap-4">
                            {/* Card 1 */}
                            <div className="bg-white border border-slate-100 rounded-2xl p-4 w-48 shadow-sm relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Phone size={14} />
                                        <span className="text-xs font-medium">Calls Analyzed</span>
                                    </div>
                                    <Info size={12} className="text-slate-300" />
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">{avatarDetail.stats.callsAnalyzed}</div>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                    +{avatarDetail.stats.callsTrend}%
                                    <span className="text-slate-400 font-medium">vs. last 30 days</span>
                                </div>
                                {/* Sparkline Mock */}
                                <div className="absolute bottom-0 right-0 w-20 h-10 opacity-20">
                                    <svg viewBox="0 0 100 40" className="w-full h-full"><path d="M0 35 C 20 35, 40 10, 60 25 S 100 5 L 100 40 H 0 Z" fill="#10b981" /></svg>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white border border-slate-100 rounded-2xl p-4 w-48 shadow-sm relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Phone size={14} />
                                        <span className="text-xs font-medium">Conversion Rate</span>
                                    </div>
                                    <Info size={12} className="text-slate-300" />
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">{avatarDetail.stats.conversionRate}%</div>
                                <div className={`flex items-center gap-1 text-[10px] font-bold ${avatarDetail.stats.conversionTrend >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                    {avatarDetail.stats.conversionTrend}%
                                    <span className="text-slate-400 font-medium">vs. last 30 days</span>
                                </div>
                                {/* Sparkline Mock */}
                                <div className="absolute bottom-0 right-0 w-20 h-10 opacity-20">
                                    <svg viewBox="0 0 100 40" className="w-full h-full">
                                        <path
                                            d="M0 5 C 20 5, 40 30, 60 15 S 100 35 L 100 40 H 0 Z"
                                            fill={avatarDetail.stats.conversionTrend >= 0 ? "#10b981" : "#f43f5e"}
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-8 border-t border-slate-100 pt-6">
                        <p className="text-slate-600 leading-relaxed text-sm lg:text-base max-w-5xl">
                            {avatarDetail.description}
                        </p>
                    </div>
                </div>

                {/* Detailed Sections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 1. Demographics */}
                    <DetailSection icon={Users} title="Demographics" items={avatarDetail.demographics} color="blue" />

                    {/* 2. Psychographics */}
                    <DetailSection icon={Brain} title="Psychographics" items={avatarDetail.psychographics} color="purple" />

                    {/* 3. Operational Context */}
                    <DetailSection icon={Briefcase} title="Operational Context" items={avatarDetail.operationalContext} color="slate" />

                    {/* 4. Goals and Motivations */}
                    <DetailSection icon={Target} title="Goals & Motivations" items={avatarDetail.goals} color="emerald" />

                    {/* 5. Buying Journey Profile */}
                    <DetailSection icon={Map} title="Buying Journey Profile" items={avatarDetail.buyingJourney} color="amber" />

                    {/* 6. Objection Patterns */}
                    <DetailSection icon={ShieldAlert} title="Objection Patterns" items={avatarDetail.objections} color="rose" />

                    {/* 7. Messaging Framework */}
                    <DetailSection icon={MessageCircle} title="Messaging Framework" items={avatarDetail.messaging} color="indigo" />

                    {/* 8. Match Conditions */}
                    <DetailSection icon={CheckCircle2} title="Match Conditions" items={avatarDetail.matchConditions} color="teal" />
                </div>

            </div>
        );
    }

    // --------------------------------------------------------------------------
    // LIST VIEW (Grid)
    // --------------------------------------------------------------------------
    return (
        <div className="flex flex-col h-full px-8 py-8 w-full max-w-[1600px] mx-auto text-slate-800 pb-24">

            {/* Header */}


            {/* Controls Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                {/* Search */}
                <div className="relative w-full max-w-sm">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                    />
                </div>

                {/* Right Filters */}
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all shadow-sm group">
                        <span>Sort</span>
                        <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600" />
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all shadow-sm group">
                        <Filter size={14} className="text-slate-400 group-hover:text-slate-600" />
                        <span>Filters</span>
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAvatars.map((avatar) => (
                    <div
                        key={avatar.id}
                        onClick={() => setSelectedAvatarId(avatar.id)}
                        className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow flex items-center gap-4 cursor-pointer group"
                    >
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                            <img
                                src={avatar.image}
                                alt={avatar.role}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        <div className="flex flex-col items-start gap-2">
                            <h3 className="text-base font-bold text-slate-900 leading-tight">
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
const DetailSection = ({ icon: Icon, title, items, color }: { icon: any, title: string, items: string[], color: string }) => {
    // Basic color mapping for icon background
    const bgColors: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        slate: 'bg-slate-50 text-slate-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
        rose: 'bg-rose-50 text-rose-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        teal: 'bg-teal-50 text-teal-600'
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${bgColors[color] || bgColors.slate}`}>
                    <Icon size={18} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
            </div>
            <ul className="space-y-2.5">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${bgColors[color]?.replace('bg-', 'bg-').replace('text-', 'bg-').split(' ')[1] || 'bg-slate-400'}`}></div>
                        <span className="leading-snug">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AvatarView;