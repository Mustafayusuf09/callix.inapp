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
        color: 'text-orange-600',
        bg: 'bg-orange-50 dark:bg-orange-500/10'
    },
    {
        id: 'google',
        name: 'Google Ads',
        icon: Search,
        image: '/logos/google_ads.png',
        description: 'Search headlines, descriptions, and display assets.',
        color: 'text-red-500',
        bg: 'bg-red-50 dark:bg-red-500/10'
    },
    {
        id: 'x-twitter',
        name: 'X (Twitter)',
        icon: Twitter,
        image: '/assets/logos/x_ads.png',
        description: 'Promoted posts, amplification, and trend takeovers.',
        color: 'text-zinc-900 dark:text-white',
        bg: 'bg-zinc-100 dark:bg-zinc-800'
    },
    {
        id: 'youtube',
        name: 'YouTube',
        icon: Youtube,
        image: '/assets/logos/youtube_ads.png',
        description: 'Video scripts, shorts hooks, and descriptions.',
        color: 'text-rose-600',
        bg: 'bg-rose-50 dark:bg-rose-500/10'
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: Linkedin,
        image: '/assets/logos/linkedin_ads.png',
        description: 'B2B sponsored content and InMail sequences.',
        color: 'text-orange-700',
        bg: 'bg-orange-50 dark:bg-orange-500/10'
    },
    {
        id: 'email',
        name: 'Email Campaigns',
        icon: Mail,
        description: 'Newsletters, drip sequences, and cold outreach.',
        color: 'text-orange-600',
        bg: 'bg-orange-50 dark:bg-orange-500/10'
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
                        className="group relative glass-card rounded-3xl p-8 border border-transparent hover:border-orange-100/50 dark:bg-zinc-900/50 dark:border-white/10 dark:hover:border-orange-500/30 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-80 justify-between overflow-hidden"
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
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 group-hover:text-orange-900 dark:group-hover:text-orange-400 transition-colors">{option.name}</h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-300 font-medium leading-relaxed">{option.description}</p>
                        </div>

                        <div className="relative z-10 flex items-center gap-2 text-sm font-bold text-zinc-300 dark:text-zinc-600 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mt-4">
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
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 font-dm-sans">Choose Ad Format</h2>
                <p className="text-zinc-500 dark:text-zinc-300 mb-12">What type of creative would you like to build for <span className="font-bold text-zinc-800 dark:text-zinc-200">{platform?.name}</span>?</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div
                        onClick={() => handleFormatSelect('static')}
                        className="group glass-card rounded-[2rem] p-10 cursor-pointer hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 dark:bg-zinc-900/50 dark:border-white/10 dark:hover:border-orange-500/50 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="w-20 h-20 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-600 mb-8 group-hover:scale-110 transition-transform">
                            <ImageIcon size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Static Ad</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
                            High-fidelity image generation paired with primary text, headline, and description optimized for feed scrolling.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                                <CheckCircle2 size={16} className="text-orange-500" /> Single Image & Carousel
                            </li>
                            <li className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                                <CheckCircle2 size={16} className="text-orange-500" /> Midjourney v6 Integration
                            </li>
                        </ul>
                    </div>

                    <div
                        onClick={() => handleFormatSelect('video')}
                        className="group glass-card rounded-[2rem] p-10 cursor-pointer hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 dark:bg-zinc-900/50 dark:border-white/10 dark:hover:border-orange-500/50 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="w-20 h-20 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-600 mb-8 group-hover:scale-110 transition-transform">
                            <Video size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Video Ad</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
                            Script-to-video generation using AI avatars or stock footage. Includes hook generation and captioning.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                                <CheckCircle2 size={16} className="text-orange-500" /> Reels & Stories Format
                            </li>
                            <li className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                                <CheckCircle2 size={16} className="text-orange-500" /> AI Voiceover & Captions
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
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 font-dm-sans">Select Target Persona</h2>
            <p className="text-zinc-500 dark:text-zinc-300 mb-12">Who is this ad targeting? The copy will be tailored to their psychographics.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MOCK_AVATARS.map((avatar) => (
                    <div
                        key={avatar.id}
                        onClick={() => handleAvatarSelect(avatar.id)}
                        className="group glass-card rounded-3xl p-6 cursor-pointer hover:border-orange-500 hover:shadow-lg transition-all duration-300 text-center dark:bg-zinc-900/50 dark:border-white/10 dark:hover:border-orange-500/50"
                    >
                        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-6 ring-4 ring-zinc-50 dark:ring-zinc-800 group-hover:ring-orange-50 dark:group-hover:ring-orange-500/20 transition-all">
                            <img src={avatar.image} alt={avatar.role} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors">{avatar.role}</h3>
                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-100 uppercase tracking-widest">Enterprise</p>
                    </div>
                ))}
            </div>
        </div>
    );

    // 4. Loading State
    const renderLoadingStep = () => (
        <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in duration-700">
            <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-zinc-200 dark:border-zinc-700 border-t-orange-500 dark:border-t-orange-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={24} className="text-orange-500 animate-pulse" />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-8 mb-2 font-dm-sans">Generating Creative Assets</h2>
            <p className="text-zinc-500 dark:text-zinc-300 font-medium">Analyzing historical data and optimizing copy for {getAvatarDetails()?.role}...</p>
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
            <div className="max-w-[1400px] mx-auto pt-0 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex justify-between items-end mb-6 border-b border-zinc-200 dark:border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 font-dm-sans">Campaign Ready</h1>
                        <div className="flex items-center gap-3 text-sm font-medium text-zinc-500 dark:text-zinc-300">
                            <span className="flex items-center gap-2">
                                {platform?.image ? (
                                    <img src={platform.image} alt={platform.name} className="w-4 h-4 object-contain" />
                                ) : (
                                    platform?.icon && <platform.icon size={14} />
                                )}
                                {platform?.name}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
                            <span className="capitalize">{selectedFormat} Ad</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
                            <span>Targeting: {avatar?.role}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-zinc-200 rounded-xl font-bold text-zinc-600 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50 transition-all shadow-sm dark:bg-white/5 dark:border-white/10 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10">
                            <RefreshCw size={16} /> Regenerate
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all hover:-translate-y-0.5">
                            <Download size={16} /> Export Assets
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left: Creative Preview */}
                    <div className="lg:col-span-7">
                        <div className="glass-panel rounded-3xl p-8 shadow-sm h-full dark:bg-zinc-900/50 dark:border-white/10">
                            <h3 className="text-xs font-bold text-zinc-400 dark:text-white uppercase tracking-widest mb-6">Creative Preview</h3>

                            <div className={`relative w-full ${platform?.id === 'youtube' ? 'aspect-video max-w-lg' : 'aspect-[9/16] max-w-[320px]'} mx-auto bg-gradient-to-br from-orange-800 to-orange-900 rounded-3xl p-5 flex flex-col justify-between shadow-2xl overflow-hidden scale-95 origin-top transition-all duration-500`}>

                                {/* Background Accents */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                                <div>
                                    {/* Logo Header */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-7 h-7 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
                                            <span className="text-white font-bold text-base">X</span>
                                        </div>
                                        <span className="text-white font-bold text-lg tracking-tight">Callix</span>
                                    </div>

                                    {/* Badge */}
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 rounded-full mb-4">
                                        <div className="w-1 h-1 rounded-full bg-orange-400 animate-pulse"></div>
                                        <span className="text-[9px] font-bold text-orange-100 uppercase tracking-wider">AI-Powered Intelligence</span>
                                    </div>

                                    {/* Headline */}
                                    <h2 className="text-3xl font-black text-white leading-[1.1] mb-2 font-dm-sans">
                                        Stop Guessing.<br />
                                        <span className="text-orange-200">Start Closing.</span>
                                    </h2>
                                    <p className="text-orange-100/80 text-xs font-medium leading-relaxed max-w-[90%]">
                                        Real call data reveals what actually converts prospects into revenue.
                                    </p>
                                </div>

                                {/* Stats & CTA */}
                                <div className="space-y-2 mt-4">
                                    {/* Stat 1 */}
                                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <div>
                                            <div className="text-base font-bold text-white leading-none mb-0.5">+34%</div>
                                            <div className="text-[9px] font-bold text-orange-200/70 uppercase tracking-wide">Higher Close Rate</div>
                                        </div>
                                    </div>

                                    {/* Stat 2 */}
                                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
                                            <ArrowRight size={16} className="-rotate-45" />
                                        </div>
                                        <div>
                                            <div className="text-base font-bold text-white leading-none mb-0.5">-42%</div>
                                            <div className="text-[9px] font-bold text-orange-200/70 uppercase tracking-wide">CAC Reduction</div>
                                        </div>
                                    </div>

                                    {/* Stat 3 */}
                                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
                                            <Activity size={16} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-white leading-none mb-0.5">Real-Time</div>
                                            <div className="text-[9px] font-bold text-orange-200/70 uppercase tracking-wide">Buyer Intent</div>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <button className="w-full py-3 bg-[#ccff00] hover:bg-[#b3e600] text-orange-950 font-black rounded-xl text-base flex items-center justify-center gap-2 shadow-lg shadow-[#ccff00]/20 transition-all active:scale-[0.98] mt-3 group">
                                        See Your True ROI
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Ad Copy */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Primary Text */}
                        <div className="glass-card rounded-3xl p-6 shadow-sm group hover:border-orange-300 transition-colors dark:bg-zinc-900/50 dark:border-white/10 dark:hover:border-orange-500/50">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-100 uppercase tracking-widest">Primary Text</h3>
                                <button
                                    onClick={() => handleCopy('primary', primaryText)}
                                    className="text-zinc-300 hover:text-orange-600 transition-colors dark:text-zinc-600 dark:hover:text-orange-400"
                                >
                                    {copiedStates['primary'] ? <CheckCircle2 size={14} className="text-orange-500" /> : <Copy size={14} />}
                                </button>
                            </div>
                            <p className="text-zinc-700 text-sm leading-relaxed font-medium whitespace-pre-wrap dark:text-zinc-300">
                                {primaryText}
                            </p>
                        </div>

                        {/* Headline */}
                        <div className="glass-card rounded-3xl p-6 shadow-sm group hover:border-orange-300 transition-colors dark:bg-zinc-900/50 dark:border-white/10 dark:hover:border-orange-500/50">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-100 uppercase tracking-widest">Headline</h3>
                                <button
                                    onClick={() => handleCopy('headline', headlineText)}
                                    className="text-zinc-300 hover:text-orange-600 transition-colors dark:text-zinc-600 dark:hover:text-orange-400"
                                >
                                    {copiedStates['headline'] ? <CheckCircle2 size={14} className="text-orange-500" /> : <Copy size={14} />}
                                </button>
                            </div>
                            <p className="text-zinc-900 font-bold text-lg dark:text-white">
                                {headlineText}
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="glass-card rounded-3xl p-6 shadow-sm group hover:border-orange-300 transition-colors dark:bg-zinc-900/50 dark:border-white/10 dark:hover:border-orange-500/50">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-100 uppercase tracking-widest">Call To Action</h3>
                                <button
                                    onClick={() => handleCopy('cta', ctaText)}
                                    className="text-zinc-300 hover:text-orange-600 transition-colors dark:text-zinc-600 dark:hover:text-orange-400"
                                >
                                    {copiedStates['cta'] ? <CheckCircle2 size={14} className="text-orange-500" /> : <Copy size={14} />}
                                </button>
                            </div>
                            <div className="inline-block px-4 py-2 bg-zinc-100 rounded-lg text-zinc-700 text-sm font-bold border border-zinc-200 dark:bg-white/5 dark:text-zinc-300 dark:border-white/10">
                                {ctaText}
                            </div>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex items-start gap-3 dark:bg-purple-900/10 dark:border-purple-500/20">
                            <div className="p-1 bg-white rounded-full text-purple-600 shadow-sm mt-0.5 dark:bg-white/10 dark:text-purple-400"><Sparkles size={12} /></div>
                            <div>
                                <p className="text-xs font-bold text-purple-800 mb-1 dark:text-purple-200">AI Insight</p>
                                <p className="text-xs text-purple-700/80 leading-relaxed dark:text-purple-300/80">
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
        <div className="flex flex-col h-full px-8 py-6 w-full max-w-[1600px] mx-auto text-zinc-900 dark:text-zinc-100 pb-24">

            {/* Navigation Bar (visible if not on platform selection) */}
            {step !== 'platform' && step !== 'generating' && (
                <button
                    onClick={handleBack}
                    className="group flex items-center gap-2 text-xs font-bold text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors mb-4 w-fit uppercase tracking-widest"
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