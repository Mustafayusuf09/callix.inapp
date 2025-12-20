import React, { useState, useEffect } from 'react';
import {
    Facebook,
    Youtube,
    Linkedin,
    Mail,
    Search,
    ArrowRight,
    ArrowLeft,
    Image as ImageIcon,
    Video,
    CheckCircle2,
    Loader2,
    Copy,
    RefreshCw,
    Download,
    Share2,
    Play,
    Sparkles,
    Twitter,
    Activity
} from 'lucide-react';

// --- Types ---
type Step = 'platform' | 'format' | 'avatar' | 'generating' | 'result';
type AdFormat = 'static' | 'video';

interface PlatformOption {
    id: string;
    name: string;
    icon: React.ElementType;
    image?: string;
    description: string;
    color: string;
    bg: string;
}

interface AvatarMock {
    id: string;
    role: string;
    image: string;
}

// --- Mock Data ---
const OPTIONS: PlatformOption[] = [
    {
        id: 'meta',
        name: 'Meta Ads',
        icon: Facebook,
        image: '/assets/logos/meta_ads.png',
        description: 'Facebook & Instagram feeds, stories, and reels.',
        color: 'text-blue-600',
        bg: 'bg-blue-50'
    },
    {
        id: 'google',
        name: 'Google Ads',
        icon: Search,
        image: '/assets/logos/google_ads.png',
        description: 'Search headlines, descriptions, and display assets.',
        color: 'text-red-500',
        bg: 'bg-red-50'
    },
    {
        id: 'x-twitter',
        name: 'X (Twitter)',
        icon: Twitter,
        image: '/assets/logos/x_ads.png',
        description: 'Promoted posts, amplification, and trend takeovers.',
        color: 'text-slate-900',
        bg: 'bg-slate-100'
    },
    {
        id: 'youtube',
        name: 'YouTube',
        icon: Youtube,
        image: '/assets/logos/youtube_ads.png',
        description: 'Video scripts, shorts hooks, and descriptions.',
        color: 'text-rose-600',
        bg: 'bg-rose-50'
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: Linkedin,
        image: '/assets/logos/linkedin_ads.png',
        description: 'B2B sponsored content and InMail sequences.',
        color: 'text-sky-700',
        bg: 'bg-sky-50'
    },
    {
        id: 'email',
        name: 'Email Campaigns',
        icon: Mail,
        description: 'Newsletters, drip sequences, and cold outreach.',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50'
    }
];

const MOCK_AVATARS: AvatarMock[] = [
    { id: '1', role: 'Chief Marketing Officer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces' },
    { id: '2', role: 'VP of Sales', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces' },
    { id: '3', role: 'Product Manager', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces' },
    { id: '5', role: 'Director of Ops', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=faces' },
];

const GenerateCreatives: React.FC = () => {
    const [step, setStep] = useState<Step>('platform');
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<AdFormat | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

    // Copied State
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

    const handleCopy = (key: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedStates(prev => ({ ...prev, [key]: true }));
        setTimeout(() => {
            setCopiedStates(prev => ({ ...prev, [key]: false }));
        }, 2000);
    };

    // Handlers
    const handlePlatformSelect = (id: string) => {
        setSelectedPlatform(id);
        setStep('format');
    };

    const handleFormatSelect = (format: AdFormat) => {
        setSelectedFormat(format);
        setStep('avatar');
    };

    const handleAvatarSelect = (id: string) => {
        setSelectedAvatar(id);
        setStep('generating');
    };

    // Simulate Generation
    useEffect(() => {
        if (step === 'generating') {
            const timer = setTimeout(() => {
                setStep('result');
            }, 3500); // 3.5s fake loading time
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handleBack = () => {
        if (step === 'format') setStep('platform');
        if (step === 'avatar') setStep('format');
        if (step === 'result') setStep('avatar');
    };

    const getPlatformDetails = () => OPTIONS.find(p => p.id === selectedPlatform);
    const getAvatarDetails = () => MOCK_AVATARS.find(a => a.id === selectedAvatar);

    // --- RENDERERS ---

    // 1. Platform Selection (Default)
    const renderPlatformStep = () => (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {OPTIONS.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => handlePlatformSelect(option.id)}
                        className="group relative bg-white rounded-3xl p-8 border border-transparent hover:border-emerald-100/50 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer flex flex-col h-80 justify-between overflow-hidden"
                    >
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-transparent to-${option.color.split('-')[1]}-200`}></div>

                        <div className="relative z-10">
                            <div className={`w-14 h-14 rounded-2xl ${option.bg} flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                {option.image ? (
                                    <img src={option.image} alt={option.name} className="w-8 h-8 object-contain" />
                                ) : (
                                    <option.icon size={28} className={option.color} strokeWidth={1.5} />
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-900 transition-colors">{option.name}</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{option.description}</p>
                        </div>

                        <div className="relative z-10 flex items-center gap-2 text-sm font-bold text-slate-300 group-hover:text-emerald-600 transition-colors mt-4">
                            <span>Select</span>
                            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // 2. Format Selection
    const renderFormatStep = () => {
        const platform = getPlatformDetails();
        return (
            <div className="max-w-5xl mx-auto pt-10 animate-in fade-in slide-in-from-right-8 duration-500">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Choose Ad Format</h2>
                <p className="text-slate-500 mb-12">What type of creative would you like to build for <span className="font-bold text-slate-800">{platform?.name}</span>?</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div
                        onClick={() => handleFormatSelect('static')}
                        className="group bg-white border border-slate-200 rounded-[2rem] p-10 cursor-pointer hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition-transform">
                            <ImageIcon size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Static Ad</h3>
                        <p className="text-slate-500 leading-relaxed mb-8">
                            High-fidelity image generation paired with primary text, headline, and description optimized for feed scrolling.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                <CheckCircle2 size={16} className="text-emerald-500" /> Single Image & Carousel
                            </li>
                            <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                <CheckCircle2 size={16} className="text-emerald-500" /> Midjourney v6 Integration
                            </li>
                        </ul>
                    </div>

                    <div
                        onClick={() => handleFormatSelect('video')}
                        className="group bg-white border border-slate-200 rounded-[2rem] p-10 cursor-pointer hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-transform">
                            <Video size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Video Ad</h3>
                        <p className="text-slate-500 leading-relaxed mb-8">
                            Script-to-video generation using AI avatars or stock footage. Includes hook generation and captioning.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                <CheckCircle2 size={16} className="text-blue-500" /> Reels & Stories Format
                            </li>
                            <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                <CheckCircle2 size={16} className="text-blue-500" /> AI Voiceover & Captions
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    };

    // 3. Avatar Selection
    const renderAvatarStep = () => (
        <div className="max-w-5xl mx-auto pt-10 animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Select Target Persona</h2>
            <p className="text-slate-500 mb-12">Who is this ad targeting? The copy will be tailored to their psychographics.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MOCK_AVATARS.map((avatar) => (
                    <div
                        key={avatar.id}
                        onClick={() => handleAvatarSelect(avatar.id)}
                        className="group bg-white border border-slate-200 rounded-3xl p-6 cursor-pointer hover:border-emerald-500 hover:shadow-lg transition-all duration-300 text-center"
                    >
                        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-6 ring-4 ring-slate-50 group-hover:ring-emerald-50 transition-all">
                            <img src={avatar.image} alt={avatar.role} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">{avatar.role}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enterprise</p>
                    </div>
                ))}
            </div>
        </div>
    );

    // 4. Loading State
    const renderLoadingStep = () => (
        <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in duration-700">
            <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-emerald-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={24} className="text-emerald-500 animate-pulse" />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">Generating Creative Assets</h2>
            <p className="text-slate-500 font-medium">Analyzing historical data and optimizing copy for {getAvatarDetails()?.role}...</p>
        </div>
    );

    // 5. Result View
    const renderResultStep = () => {
        const platform = getPlatformDetails();
        const avatar = getAvatarDetails();

        const primaryText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Designed for ${avatar?.role.toLowerCase()}s who demand results.`;
        const headlineText = "Lorem Ipsum Dolor Sit Amet";
        const ctaText = "Lorem Ipsum";

        return (
            <div className="max-w-[1400px] mx-auto pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Campaign Ready</h1>
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                            <span className="flex items-center gap-2">
                                {platform?.image ? (
                                    <img src={platform.image} alt={platform.name} className="w-4 h-4 object-contain" />
                                ) : (
                                    platform?.icon && <platform.icon size={14} />
                                )}
                                {platform?.name}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="capitalize">{selectedFormat} Ad</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span>Targeting: {avatar?.role}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all shadow-sm">
                            <RefreshCw size={16} /> Regenerate
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:-translate-y-0.5">
                            <Download size={16} /> Export Assets
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left: Creative Preview */}
                    <div className="lg:col-span-7">
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm h-full">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Creative Preview</h3>

                            <div className="relative w-full aspect-[9/16] max-w-sm mx-auto bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-3xl p-6 flex flex-col justify-between shadow-2xl overflow-hidden">

                                {/* Background Accents */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                                <div>
                                    {/* Logo Header */}
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
                                            <span className="text-white font-bold text-lg">X</span>
                                        </div>
                                        <span className="text-white font-bold text-xl tracking-tight">Callix</span>
                                    </div>

                                    {/* Badge */}
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full mb-6">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                        <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">AI-Powered Intelligence</span>
                                    </div>

                                    {/* Headline */}
                                    <h2 className="text-4xl font-black text-white leading-[1.1] mb-3">
                                        Stop Guessing.<br />
                                        <span className="text-emerald-200">Start Closing.</span>
                                    </h2>
                                    <p className="text-emerald-100/80 text-sm font-medium leading-relaxed max-w-[90%]">
                                        Real call data reveals what actually converts prospects into revenue.
                                    </p>
                                </div>

                                {/* Stats & CTA */}
                                <div className="space-y-3 mt-8">
                                    {/* Stat 1 */}
                                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-white leading-none mb-0.5">+34%</div>
                                            <div className="text-[10px] font-bold text-emerald-200/70 uppercase tracking-wide">Higher Close Rate</div>
                                        </div>
                                    </div>

                                    {/* Stat 2 */}
                                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                                            <ArrowRight size={20} className="-rotate-45" />
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-white leading-none mb-0.5">-42%</div>
                                            <div className="text-[10px] font-bold text-emerald-200/70 uppercase tracking-wide">True CAC Reduction</div>
                                        </div>
                                    </div>

                                    {/* Stat 3 */}
                                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                                            <Activity size={20} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white leading-none mb-0.5">Real-Time</div>
                                            <div className="text-[10px] font-bold text-emerald-200/70 uppercase tracking-wide">Buyer Intent Signals</div>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <button className="w-full py-4 bg-[#ccff00] hover:bg-[#b3e600] text-emerald-950 font-black rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg shadow-[#ccff00]/20 transition-all active:scale-[0.98] mt-4 group">
                                        See Your True ROI
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Ad Copy */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Primary Text */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm group hover:border-emerald-300 transition-colors">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Primary Text</h3>
                                <button
                                    onClick={() => handleCopy('primary', primaryText)}
                                    className="text-slate-300 hover:text-emerald-600 transition-colors"
                                >
                                    {copiedStates['primary'] ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed font-medium whitespace-pre-wrap">
                                {primaryText}
                            </p>
                        </div>

                        {/* Headline */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm group hover:border-emerald-300 transition-colors">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Headline</h3>
                                <button
                                    onClick={() => handleCopy('headline', headlineText)}
                                    className="text-slate-300 hover:text-emerald-600 transition-colors"
                                >
                                    {copiedStates['headline'] ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                            </div>
                            <p className="text-slate-900 font-bold text-lg">
                                {headlineText}
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm group hover:border-emerald-300 transition-colors">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Call To Action</h3>
                                <button
                                    onClick={() => handleCopy('cta', ctaText)}
                                    className="text-slate-300 hover:text-emerald-600 transition-colors"
                                >
                                    {copiedStates['cta'] ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                            </div>
                            <div className="inline-block px-4 py-2 bg-slate-100 rounded-lg text-slate-700 text-sm font-bold border border-slate-200">
                                {ctaText}
                            </div>
                        </div>

                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                            <div className="p-1 bg-white rounded-full text-emerald-600 shadow-sm mt-0.5"><Sparkles size={12} /></div>
                            <div>
                                <p className="text-xs font-bold text-emerald-800 mb-1">AI Insight</p>
                                <p className="text-xs text-emerald-700/80 leading-relaxed">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full px-8 py-10 w-full max-w-[1600px] mx-auto text-slate-900 pb-24">

            {/* Navigation Bar (visible if not on platform selection) */}
            {step !== 'platform' && step !== 'generating' && (
                <button
                    onClick={handleBack}
                    className="group flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors mb-8 w-fit uppercase tracking-widest"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
                    <span>Back</span>
                </button>
            )}

            {/* Content Switcher */}
            {step === 'platform' && renderPlatformStep()}
            {step === 'format' && renderFormatStep()}
            {step === 'avatar' && renderAvatarStep()}
            {step === 'generating' && renderLoadingStep()}
            {step === 'result' && renderResultStep()}

        </div>
    );
};

export default GenerateCreatives;