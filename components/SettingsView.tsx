import React, { useState } from 'react';
import {
    User,
    Building2,
    Link as LinkIcon,
    Users,
    Shield,
    Bell,
    Save,
    Upload,
    CheckCircle2,
    XCircle,
    Mail,
    Slack,
    Video,
    Database,
    Search,
    Plus,
    X,
    Calendar,
    MessageSquare,
    BarChart2,
    Share2,
    Cloud,
    PieChart,
    Facebook,
    Linkedin,
    Zap,
    CreditCard,
    ShoppingBag,
    Star,
    Globe,
    Loader2,
    AlertCircle,
    Check,
    ArrowRight,
    Settings as SettingsIcon,
    RefreshCw,
    Power,
    Sun,
    Moon
} from 'lucide-react';
import { useTheme } from 'next-themes';

const TABS = ['My Account', 'Business Profile', 'Integrations', 'Invite Team'];

// --- Types ---
interface IntegrationApp {
    name: string;
    description: string;
    icon: React.ElementType;
    logo?: string; // Path to local logo file
    connected: boolean;
    color: string;
    categoryIdx?: number; // Helper for state updates
    appIdx?: number;      // Helper for state updates
}

interface IntegrationCategory {
    title: string;
    apps: IntegrationApp[];
}

// --- Initial Data ---
const INITIAL_CATEGORIES: IntegrationCategory[] = [
    {
        title: 'Calendar & Communication',
        apps: [
            { name: 'Google Calendar', description: 'Scheduling', icon: Calendar, logo: '/logos/google_calendar.svg', connected: true, color: 'text-zinc-600 bg-zinc-50' },
            { name: 'Outlook', description: 'Email & Calendar', icon: Mail, logo: '/logos/outlook.svg', connected: false, color: 'text-sky-600 bg-sky-50' },
            { name: 'Microsoft Teams', description: 'Communication', icon: MessageSquare, logo: '/logos/teams.svg', connected: false, color: 'text-purple-600 bg-purple-50' }
        ]
    },
    {
        title: 'CRM & Sales',
        apps: [
            { name: 'GHL', description: 'All-in-One CRM', icon: BarChart2, logo: '/logos/ghl.png', connected: true, color: 'text-zinc-500 bg-zinc-50' },
            { name: 'Hubspot', description: 'CRM Platform', icon: Share2, logo: '/logos/hubspot.png', connected: false, color: 'text-zinc-600 bg-zinc-50' },
            { name: 'Salesforce', description: 'Enterprise CRM', icon: Cloud, logo: '/logos/salesforce.png', connected: true, color: 'text-zinc-500 bg-zinc-50' },
            { name: 'Close CRM', description: 'Sales CRM', icon: PieChart, logo: '/logos/close_crm.png', connected: false, color: 'text-red-500 bg-red-50' }
        ]
    },
    {
        title: 'Advertising Platforms',
        apps: [
            { name: 'Meta Ads', description: 'Social Advertising', icon: Facebook, logo: '/logos/meta.png', connected: false, color: 'text-zinc-600 bg-zinc-50' },
            { name: 'Google Ads', description: 'Search & Display', icon: Search, logo: '/logos/google_ads.png', connected: false, color: 'text-zinc-500 bg-zinc-50' },
            { name: 'LinkedIn Ads', description: 'B2B Advertising', icon: Linkedin, logo: '/logos/linkedin.png', connected: false, color: 'text-zinc-700 bg-zinc-50' }
        ]
    },
    {
        title: 'Automation & Collaboration',
        apps: [
            { name: 'Zapier', description: 'Workflow Automation', icon: Zap, logo: '/logos/zapier.png', connected: true, color: 'text-zinc-500 bg-zinc-50' },
            { name: 'Slack', description: 'Team Communication', icon: Slack, logo: '/logos/slack.png', connected: true, color: 'text-purple-500 bg-purple-50' }
        ]
    },
    {
        title: 'Payment Processors',
        apps: [
            { name: 'Stripe', description: 'Payment Gateway', icon: CreditCard, logo: '/logos/stripe.png', connected: true, color: 'text-purple-600 bg-purple-50' },
            { name: 'PayPal', description: 'Payment Gateway', icon: CreditCard, logo: '/logos/paypal.png', connected: false, color: 'text-zinc-800 bg-zinc-50' },
            { name: 'NMI', description: 'Payment Gateway', icon: CreditCard, logo: '/logos/nmi.png', connected: false, color: 'text-green-600 bg-green-50' },
            { name: 'Authorize.net', description: 'Payment Gateway', icon: CreditCard, logo: '/logos/authorize_net.png', connected: false, color: 'text-zinc-600 bg-zinc-50' },
            { name: 'Whop', description: 'Digital Products', icon: ShoppingBag, logo: '/logos/whop.png', connected: false, color: 'text-zinc-500 bg-zinc-50' },
            { name: 'Easypay Direct', description: 'Payment Processing', icon: CreditCard, logo: '/logos/easypay_direct.png', connected: false, color: 'text-zinc-500 bg-zinc-50' },
            { name: 'Fanbasis', description: 'Creator Payments', icon: Star, logo: '/logos/fanbasis.png', connected: false, color: 'text-rose-500 bg-rose-50' }
        ]
    }
];

const SettingsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('My Account');
    const { theme, setTheme } = useTheme(); // Theme Hook

    // Invite Modal State
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('Member');

    // Notifications State
    const [notifications, setNotifications] = useState({
        'Email Notifications': true,
        'Browser Push': true,
        'Daily Digest': true,
        'Weekly Report': false
    });

    // Integration Config State (Mock per session)
    const [integrationConfig, setIntegrationConfig] = useState({
        syncContacts: true,
        importData: false,
        twoWaySync: true
    });

    // Integrations State
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);
    const [selectedIntegration, setSelectedIntegration] = useState<IntegrationApp | null>(null);
    const [isProcessingIntegration, setIsProcessingIntegration] = useState(false);

    // Team Members State
    const [teamMembers, setTeamMembers] = useState([
        { name: 'Lucas Berger', email: 'lucas@callix.ai', role: 'Owner', status: 'Active' },
        { name: 'Sarah Connor', email: 'sarah@callix.ai', role: 'Admin', status: 'Active' },
        { name: 'Michael Chen', email: 'mike@callix.ai', role: 'Member', status: 'Active' },
        { name: 'Emily Davis', email: 'emily@callix.ai', role: 'Viewer', status: 'Pending' },
    ]);
    const [editingMember, setEditingMember] = useState<any>(null);

    const handleEditMember = (member: any) => {
        setEditingMember(member);
        setInviteEmail(member.email);
        setInviteRole(member.role);
        setIsInviteModalOpen(true);
    };

    // Helper to open integration modal
    const handleOpenIntegration = (app: IntegrationApp, categoryIdx: number, appIdx: number) => {
        setSelectedIntegration({ ...app, categoryIdx, appIdx });
        // Reset config for demo purposes when opening a new one, or keep standard defaults
        setIntegrationConfig({
            syncContacts: true,
            importData: false,
            twoWaySync: true
        });
    };

    // Helper to toggle connection status
    const toggleIntegrationStatus = () => {
        if (!selectedIntegration || selectedIntegration.categoryIdx === undefined || selectedIntegration.appIdx === undefined) return;

        setIsProcessingIntegration(true);

        setTimeout(() => {
            setCategories(prev => {
                const newCategories = [...prev];
                const category = newCategories[selectedIntegration.categoryIdx!];
                const app = category.apps[selectedIntegration.appIdx!];

                // Toggle
                app.connected = !app.connected;

                return newCategories;
            });

            // Also update local selected state to reflect change immediately in modal
            setSelectedIntegration(prev => prev ? ({ ...prev, connected: !prev.connected }) : null);

            setIsProcessingIntegration(false);
            // Don't close modal immediately, let user see change or close it themselves? 
            // Original code closed it: setSelectedIntegration(null);
            // But usually you want to see the "Connected" state or "Disconnect" button.
            // Let's keep it open to allow config.
        }, 1500);
    };

    const handleNotificationToggle = (key: string) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key as keyof typeof prev]
        }));
    };

    const handleConfigToggle = (key: keyof typeof integrationConfig) => {
        setIntegrationConfig(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // --- MY ACCOUNT CONTENT ---
    const renderMyAccount = () => (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Profile Card */}
            <div className="glass-panel dark:bg-zinc-900/50 dark:border-white/10 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6 font-dm-sans">Personal Information</h3>

                <div className="flex items-start gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-white dark:border-white/10 shadow-md flex items-center justify-center text-xl font-bold text-zinc-400">
                            LB
                        </div>
                        <button className="text-xs font-bold text-purple-600 hover:underline">Change Avatar</button>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide">Full Name</label>
                            <input type="text" defaultValue="Lucas Berger" className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-800 dark:text-zinc-100 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide">Email Address</label>
                            <input type="email" defaultValue="lucas@callix.ai" className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-800 dark:text-zinc-100 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide">Job Title</label>
                            <input type="text" defaultValue="Chief Executive Officer" className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-800 dark:text-zinc-100 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide">Phone</label>
                            <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-800 dark:text-zinc-100 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Security & Notifications Grid */}
            <div className="grid grid-cols-2 gap-8">
                <div className="glass-panel dark:bg-zinc-900/50 dark:border-white/10 rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield size={20} className="text-purple-600" />
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-dm-sans">Security</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-white/5">
                            <div>
                                <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Password</div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-300">Last changed 3 months ago</div>
                            </div>
                            <button className="px-3 py-1.5 glass-panel rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-purple-600 shadow-sm transition-all">Update</button>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-white/5">
                            <div>
                                <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">2FA Authentication</div>
                                <div className="text-xs text-purple-600 font-bold flex items-center gap-1"><CheckCircle2 size={10} /> Enabled</div>
                            </div>
                            <button className="px-3 py-1.5 glass-panel rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-purple-600 shadow-sm transition-all">Manage</button>
                        </div>
                    </div>
                </div>

                <div className="glass-panel dark:bg-zinc-900/50 dark:border-white/10 rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Bell size={20} className="text-purple-600" />
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-dm-sans">Notifications</h3>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(notifications).map(([key, isEnabled], i) => (
                            <div key={key} className="flex justify-between items-center">
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{key}</span>
                                <button
                                    onClick={() => handleNotificationToggle(key)}
                                    className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${isEnabled ? 'bg-orange-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isEnabled ? 'translate-x-4' : ''}`}></div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Appearance Card */}
            <div className="glass-panel dark:bg-zinc-900/50 dark:border-white/10 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <Sun size={20} className="text-purple-600" />
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-dm-sans">Appearance</h3>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Theme Preference</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-300">Choose how Callix looks on your device.</div>
                    </div>
                    <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 gap-1">
                        <button
                            onClick={() => setTheme('light')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${theme === 'light'
                                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                                }`}
                        >
                            <Sun size={14} /> Light
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${theme === 'dark'
                                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                                }`}
                        >
                            <Moon size={14} /> Dark
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button className="flex items-center gap-2 px-8 py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-700 hover:-translate-y-0.5 transition-all">
                    <Save size={18} /> Save Changes
                </button>
            </div>
        </div>
    );

    // --- BUSINESS PROFILE CONTENT ---
    const renderBusinessProfile = () => (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="glass-panel dark:bg-zinc-900/50 dark:border-white/10 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                    <Building2 size={24} className="text-orange-600" />
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-dm-sans">Organization Details</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-300">Manage your company branding and AI context settings.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide">Company Name</label>
                        <input type="text" defaultValue="CalliX Enterprise Solutions" className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-800 dark:text-zinc-100 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide">Website</label>
                        <input type="text" defaultValue="https://callix.ai" className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-800 dark:text-zinc-100 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide">Industry</label>
                        <select className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-800 dark:text-zinc-100 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all">
                            <option>SaaS / Technology</option>
                            <option>Finance</option>
                            <option>Healthcare</option>
                            <option>Consulting</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide">Employee Count</label>
                        <select className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-800 dark:text-zinc-100 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all">
                            <option>1-10</option>
                            <option>11-50</option>
                            <option selected>51-200</option>
                            <option>201-500</option>
                            <option>500+</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2 mb-8">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide">Company Context (AI Knowledge Base)</label>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-2">Provide a brief description of your business. This helps the AI generate more relevant insights and content.</p>
                    <textarea
                        className="w-full h-32 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-800 dark:text-zinc-100 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                    />
                </div>

                <div className="flex justify-end pt-4 border-t border-zinc-100">
                    <button className="flex items-center gap-2 px-8 py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-700 hover:-translate-y-0.5 transition-all">
                        <Save size={18} /> Update Profile
                    </button>
                </div>
            </div>
        </div>
    );

    // --- INTEGRATIONS CONTENT ---
    const renderIntegrations = () => {
        return (
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300 pb-12">
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-dm-sans">Connected Apps</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-300">Supercharge your workflow by connecting your favorite tools.</p>
                </div>

                <div className="space-y-10">
                    {categories.map((category, catIdx) => (
                        <div key={catIdx}>
                            <div className="flex items-center gap-3 mb-4">
                                <h4 className="text-sm font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-widest">{category.title}</h4>
                                <div className="h-px bg-zinc-100 flex-1"></div>
                                <span className="text-xs font-bold text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-full">
                                    {category.apps.filter(a => a.connected).length} connected
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {category.apps.map((app, appIdx) => (
                                    <div key={appIdx} className="glass-panel dark:bg-zinc-900/50 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:border-orange-300 dark:hover:border-orange-500/30 transition-all group flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${app.color} overflow-hidden`}>
                                                {app.logo ? (
                                                    <img src={app.logo} alt={app.name} className={`w-8 h-8 object-contain ${app.name === 'Hubspot' ? 'scale-150' : ''}`} />
                                                ) : (
                                                    <app.icon size={24} />
                                                )}
                                            </div>
                                            {app.connected ? (
                                                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50"></div>
                                            ) : (
                                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1 font-dm-sans">{app.name}</h4>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-300 font-medium mb-4">{app.description}</p>
                                        </div>

                                        <button
                                            onClick={() => handleOpenIntegration(app, catIdx, appIdx)}
                                            className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all mt-auto ${app.connected
                                                ? 'bg-zinc-50 text-zinc-600 hover:text-orange-700 hover:bg-orange-50 border border-transparent'
                                                : 'glass-panel dark:bg-zinc-800/50 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:border-orange-500 hover:text-orange-600 shadow-sm'
                                                }`}
                                        >
                                            {app.connected ? 'Manage' : 'Connect'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // --- INVITE TEAM CONTENT ---
    const renderInviteTeam = () => {
        return (
            <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-dm-sans">Team Management</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-300">Manage access and roles for your workspace.</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingMember(null);
                            setInviteEmail('');
                            setInviteRole('Member');
                            setIsInviteModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-700 hover:-translate-y-0.5 transition-all"
                    >
                        <Plus size={16} /> Invite Member
                    </button>
                </div>

                <div className="glass-panel dark:bg-zinc-900/50 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-400 dark:text-zinc-100 uppercase tracking-widest">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-400 dark:text-zinc-100 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-400 dark:text-zinc-100 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-400 dark:text-zinc-100 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {teamMembers.map((member, i) => (
                                <tr key={i} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-200">
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{member.name}</div>
                                                <div className="text-xs text-zinc-500 dark:text-zinc-300">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-bold text-zinc-600 dark:text-zinc-300">{member.role}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'Active' ? 'bg-orange-500' : 'bg-zinc-500 dark:bg-zinc-400'}`}></div>
                                            <span className={`text-xs font-bold ${member.status === 'Active' ? 'text-orange-700 dark:text-orange-400' : 'text-zinc-700 dark:text-zinc-300'}`}>{member.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEditMember(member)}
                                            className="text-zinc-400 dark:text-zinc-500 hover:text-orange-600 dark:hover:text-orange-500 font-bold text-xs"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // --- MAIN RENDER ---
    return (
        <div className="flex flex-col h-full px-8 py-8 w-full max-w-[1600px] mx-auto text-zinc-800 dark:text-zinc-200 pb-24 relative">

            {/* Header */}


            {/* Tabs */}
            <div className="flex items-center border-b border-zinc-200 mb-8">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === tab
                            ? 'text-orange-600 border-orange-500'
                            : 'text-zinc-500 dark:text-zinc-400 border-transparent hover:text-zinc-800 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1">
                {activeTab === 'My Account' && renderMyAccount()}
                {activeTab === 'Business Profile' && renderBusinessProfile()}
                {activeTab === 'Integrations' && renderIntegrations()}
                {activeTab === 'Invite Team' && renderInviteTeam()}
            </div>

            {/* --- INVITE / EDIT MEMBER MODAL --- */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5">
                        <div className="p-6 border-b border-zinc-100 dark:border-white/5 flex justify-between items-center relative">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-dm-sans">
                                {editingMember ? 'Edit Team Member' : 'Invite Team Member'}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsInviteModalOpen(false);
                                    setEditingMember(null);
                                    setInviteEmail('');
                                    setInviteRole('Member');
                                }}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-full p-2">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide ml-1">Email Address</label>
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="colleague@company.com"
                                    className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 shadow-inner"
                                    autoFocus={!editingMember}
                                    disabled={!!editingMember}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide ml-1">Role</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Admin', 'Member', 'Viewer'].map(role => (
                                        <button
                                            key={role}
                                            onClick={() => setInviteRole(role)}
                                            className={`px-2 py-2.5 rounded-xl text-xs font-bold transition-all border ${inviteRole === role
                                                ? 'bg-orange-600 text-white ring-2 ring-orange-600 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 shadow-lg shadow-orange-600/20'
                                                : 'bg-zinc-50 text-zinc-600 border border-zinc-200 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 dark:bg-white/5 dark:text-zinc-400 dark:border-white/10 dark:hover:border-orange-500/50 dark:hover:text-orange-400 dark:hover:bg-orange-500/10'
                                                }`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-zinc-400 font-medium ml-1 mt-1">
                                    {inviteRole === 'Admin' && "Full access to all settings and billing."}
                                    {inviteRole === 'Member' && "Can edit projects and content."}
                                    {inviteRole === 'Viewer' && "Read-only access to projects."}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setIsInviteModalOpen(false);
                                    setEditingMember(null);
                                    setInviteEmail('');
                                    setInviteRole('Member');
                                }}
                                className="px-6 py-3 rounded-xl text-zinc-500 font-bold hover:bg-white dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (editingMember) {
                                        // Update Member Logic
                                        setTeamMembers(prev => prev.map(m =>
                                            m.email === editingMember.email ? { ...m, role: inviteRole } : m
                                        ));
                                    } else {
                                        // Add New Member Logic
                                        const newMember = {
                                            name: 'New Member', // Placeholder
                                            email: inviteEmail,
                                            role: inviteRole,
                                            status: 'Pending'
                                        };
                                        setTeamMembers(prev => [...prev, newMember]);
                                    }
                                    setIsInviteModalOpen(false);
                                    setEditingMember(null);
                                    setInviteEmail('');
                                    setInviteRole('Member');
                                }}
                                disabled={!inviteEmail}
                                className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {editingMember ? 'Save Changes' : 'Send Invite'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- INTEGRATION CONNECT/MANAGE MODAL --- */}
            {selectedIntegration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20 dark:border-white/10 flex flex-col max-h-[90vh] ring-1 ring-black/5 dark:ring-white/5">

                        {/* Header */}
                        {/* Header */}
                        <div className="relative p-8 pb-6 border-b border-zinc-100 dark:border-white/5">
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-zinc-50/50 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none"></div>

                            <div className="relative flex justify-between items-start mb-6">
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${selectedIntegration.color} shadow-lg shadow-black/5 dark:shadow-black/20 border border-white/20 dark:border-white/10 overflow-hidden`}>
                                    {selectedIntegration.logo ? (
                                        <img src={selectedIntegration.logo} alt={selectedIntegration.name} className={`w-12 h-12 object-contain ${selectedIntegration.name === 'Hubspot' ? 'scale-150' : ''}`} />
                                    ) : (
                                        <selectedIntegration.icon size={40} />
                                    )}
                                </div>
                                <button onClick={() => setSelectedIntegration(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full p-2.5">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="relative">
                                <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 font-dm-sans tracking-tight">{selectedIntegration.name}</h3>
                                <p className="text-base text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">{selectedIntegration.description}</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 overflow-y-auto">
                            {selectedIntegration.connected ? (
                                // --- MANAGE VIEW ---
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                            <Check size={16} className="text-orange-600" strokeWidth={3} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-orange-800">Connection Active</div>
                                            <div className="text-xs text-orange-700/80">Last synced 12 minutes ago</div>
                                        </div>
                                        <div className="ml-auto">
                                            <button className="p-2 text-orange-700 hover:bg-orange-100 rounded-lg transition-colors">
                                                <RefreshCw size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-100 uppercase tracking-widest">Configuration</h4>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 border border-zinc-200 dark:border-white/10 rounded-xl">
                                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-100">Sync Contacts</span>
                                                <button
                                                    onClick={() => handleConfigToggle('syncContacts')}
                                                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${integrationConfig.syncContacts ? 'bg-orange-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                                                >
                                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${integrationConfig.syncContacts ? 'right-1' : 'left-1'}`}></div>
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between p-3 border border-zinc-200 dark:border-white/10 rounded-xl">
                                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-100">Import Historical Data</span>
                                                <button
                                                    onClick={() => handleConfigToggle('importData')}
                                                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${integrationConfig.importData ? 'bg-orange-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                                                >
                                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${integrationConfig.importData ? 'right-1' : 'left-1'}`}></div>
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between p-3 border border-zinc-200 dark:border-white/10 rounded-xl">
                                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-100">Two-way Sync</span>
                                                <button
                                                    onClick={() => handleConfigToggle('twoWaySync')}
                                                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${integrationConfig.twoWaySync ? 'bg-orange-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                                                >
                                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${integrationConfig.twoWaySync ? 'right-1' : 'left-1'}`}></div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // --- CONNECT VIEW ---
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-100 uppercase tracking-widest">Features</h4>
                                        <ul className="space-y-3">
                                            <li className="flex items-center gap-3 text-sm text-zinc-600">
                                                <div className="w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0"><Check size={12} strokeWidth={3} /></div>
                                                Sync leads and opportunities automatically.
                                            </li>
                                            <li className="flex items-center gap-3 text-sm text-zinc-600">
                                                <div className="w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0"><Check size={12} strokeWidth={3} /></div>
                                                Import conversation history for AI analysis.
                                            </li>
                                            <li className="flex items-center gap-3 text-sm text-zinc-600">
                                                <div className="w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0"><Check size={12} strokeWidth={3} /></div>
                                                Enrich prospect data with social signals.
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide ml-1">API Key / Token</label>
                                        <input
                                            type="password"
                                            placeholder="Enter your API Key"
                                            className="w-full px-4 py-3 glass-panel dark:bg-zinc-800 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                                        />
                                        <p className="text-[10px] text-zinc-400 font-medium ml-1">
                                            Find this in your {selectedIntegration.name} developer settings.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-zinc-50 dark:bg-zinc-800 border-t border-zinc-100 dark:border-zinc-700 flex justify-between gap-3">
                            {selectedIntegration.connected ? (
                                <button
                                    onClick={toggleIntegrationStatus}
                                    disabled={isProcessingIntegration}
                                    className="px-4 py-3 rounded-xl text-rose-600 font-bold hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100 flex items-center gap-2"
                                >
                                    {isProcessingIntegration ? <Loader2 size={16} className="animate-spin" /> : <Power size={18} />}
                                    Disconnect
                                </button>
                            ) : (
                                <div></div> // Spacer
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedIntegration(null)}
                                    className="px-6 py-3 rounded-xl text-zinc-500 font-bold hover:bg-white dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                                >
                                    {selectedIntegration.connected ? 'Close' : 'Cancel'}
                                </button>

                                {selectedIntegration.connected ? (
                                    <button
                                        onClick={() => setSelectedIntegration(null)}
                                        className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20 hover:-translate-y-0.5"
                                    >
                                        Save Changes
                                    </button>
                                ) : (
                                    <button
                                        onClick={toggleIntegrationStatus}
                                        disabled={isProcessingIntegration}
                                        className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isProcessingIntegration && <Loader2 size={18} className="animate-spin" />}
                                        {isProcessingIntegration ? 'Connecting...' : `Connect ${selectedIntegration.name}`}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsView;