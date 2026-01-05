"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
    Search,
    Calendar as CalendarIcon,
    Bell,
    Plus,
    History,
    MessageSquare,
    Trash2,
    RefreshCw,
    CheckCircle,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from '../components/Sidebar';
import ChatInterface from '../components/ChatInterface';
import CalendarView from '../components/CalendarView';
import DealAnalysis from '../components/DealAnalysis';
import AvatarView from '../components/AvatarView';
import GenerateCreatives from '../components/GenerateCreatives';
import SettingsView from '../components/SettingsView';
import Dashboard from '../components/Dashboard';
import { ViewState, ChatMessage, MessageRole, ChatSession } from '../types';

// Mock Data for Chat History
const MOCK_SESSIONS: ChatSession[] = [
    {
        id: 'session-1',
        title: 'Acme Corp Deal Analysis',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        messages: [
            { id: 'm1', role: MessageRole.USER, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
            { id: 'm2', role: MessageRole.MODEL, text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 5000) }
        ]
    },
    {
        id: 'session-2',
        title: 'Q4 Marketing Ideas',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        messages: [
            { id: 'm3', role: MessageRole.USER, text: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
            { id: 'm4', role: MessageRole.MODEL, text: 'Duis aute irure dolor in reprehenderit:\n1. In voluptate velit\n2. Esse cillum dolore...', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 + 5000) }
        ]
    }
];

function App() {
    const [currentView, setCurrentView] = useState<ViewState>('dashboard');
    const [sessions, setSessions] = useState<ChatSession[]>(MOCK_SESSIONS);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // History Dropdown State
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [historySearch, setHistorySearch] = useState('');
    const historyRef = useRef<HTMLDivElement>(null);

    // Notification Dropdown State
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    // Click outside listener for Dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (historyRef.current && !historyRef.current.contains(event.target as Node)) {
                setIsHistoryOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Load messages when session changes
    useEffect(() => {
        if (currentSessionId) {
            const session = sessions.find(s => s.id === currentSessionId);
            if (session) {
                setMessages(session.messages);
            }
        } else {
            setMessages([]);
        }
    }, [currentSessionId, sessions]);

    const handleSelectSession = (id: string) => {
        setCurrentSessionId(id);
        setCurrentView('chat');
        setIsHistoryOpen(false);
    };

    const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        if (currentSessionId === sessionId) {
            setCurrentSessionId(null);
            setMessages([]);
            setCurrentView('chat');
        }
    };

    const handleNewChat = () => {
        setCurrentSessionId(null);
        setMessages([]);
        setCurrentView('chat');
        setIsHistoryOpen(false);
    };

    const executeSendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const newMessage: ChatMessage = {
            id: uuidv4(),
            role: MessageRole.USER,
            text: text,
            timestamp: new Date()
        };

        // Optimistically update UI
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInputValue('');
        setIsLoading(true);

        // If no session, create one
        let activeSessionId = currentSessionId;
        if (!activeSessionId) {
            activeSessionId = uuidv4();
            const newSession: ChatSession = {
                id: activeSessionId,
                title: text.slice(0, 30) + (text.length > 30 ? '...' : ''),
                timestamp: new Date(),
                messages: [newMessage]
            };
            setSessions(prev => [newSession, ...prev]);
            setCurrentSessionId(activeSessionId);
        } else {
            // Update existing session
            setSessions(prev => prev.map(s =>
                s.id === activeSessionId
                    ? { ...s, messages: [...s.messages, newMessage], timestamp: new Date() }
                    : s
            ));
        }

        try {
            // Mock Response instead of API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            const responseText = "This is a mock response from CalliX (AI service disconnected).";

            const botMessage: ChatMessage = {
                id: uuidv4(),
                role: MessageRole.MODEL,
                text: responseText,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);

            // Update session with bot message
            setSessions(prev => prev.map(s =>
                s.id === activeSessionId
                    ? { ...s, messages: [...s.messages, botMessage] }
                    : s
            ));
        } catch (error) {
            console.error("Chat Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = () => {
        executeSendMessage(inputValue);
    };

    const getHeaderTitle = () => {
        switch (currentView) {
            case 'dashboard': return 'Dashboard'; // Will be overridden in render
            case 'chat': return 'AI Chat';
            case 'analysis': return 'Deal Analysis';
            case 'creatives': return 'Generate Creatives';
            case 'avatars': return 'Avatars';
            case 'calendar': return 'Calendar';
            case 'settings': return 'Settings';
            default: return (currentView as string).charAt(0).toUpperCase() + (currentView as string).slice(1);
        }
    };

    // Group sessions logic for dropdown
    const groupedSessions = sessions.reduce((groups, session) => {
        const date = new Date(session.timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let key = 'Previous 7 Days';
        if (date.toDateString() === today.toDateString()) key = 'Today';
        else if (date.toDateString() === yesterday.toDateString()) key = 'Yesterday';

        if (!groups[key]) groups[key] = [];
        groups[key].push(session);
        return groups;
    }, {} as Record<string, ChatSession[]>);

    const filteredGroups = Object.keys(groupedSessions).reduce((acc, key) => {
        const filtered = groupedSessions[key].filter(s => s.title.toLowerCase().includes(historySearch.toLowerCase()));
        if (filtered.length > 0) acc[key] = filtered;
        return acc;
    }, {} as Record<string, ChatSession[]>);

    const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // ----------------------------------------------------------------------
    // MAIN LAYOUT
    // ----------------------------------------------------------------------
    return (
        <div className="flex h-screen overflow-hidden font-sans text-zinc-800">
            {/* Sidebar */}
            <Sidebar currentView={currentView} onChangeView={setCurrentView} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative h-full overflow-hidden z-0 bg-transparent">

                {/* Global Header - Visible on all pages */}
                <header className="px-8 h-20 flex justify-between items-center z-20 sticky top-0 bg-transparent">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight font-dm-sans">
                            {getHeaderTitle()}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Learning Progress - Professional (Dashboard Only) */}
                        {currentView === 'dashboard' && (
                            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm mr-2 transition-all hover:bg-white/80 dark:hover:bg-zinc-800/80 group animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-1.5">
                                    <div className="relative">
                                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-orange-500 blur-sm opacity-50" />
                                    </div>
                                    <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">Learning</span>
                                </div>

                                <div className="h-4 w-px bg-zinc-200 dark:bg-white/10" />

                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-500 rounded-full group-hover:bg-orange-600 transition-colors" style={{ width: '59%' }} />
                                    </div>
                                    <span className="text-[11px] font-bold text-zinc-900 dark:text-white tabular-nums">59%</span>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2 px-4 py-2 glass-panel rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-300 cursor-pointer hover:bg-white/40 dark:hover:bg-zinc-800/40 transition-all">
                            <CalendarIcon size={14} className="text-zinc-500 dark:text-zinc-400" />
                            <span>Nov 16, 2025</span>
                        </div>

                        <div className="flex items-center gap-2 bg-white/60 border border-white/60 rounded-xl p-1 shadow-sm backdrop-blur-sm relative dark:bg-zinc-800/60 dark:border-white/10" ref={historyRef}>

                            {/* History Toggle Button - Only show on Chat view */}
                            {currentView === 'chat' && (
                                <>
                                    <button
                                        onClick={() => {
                                            setIsHistoryOpen(!isHistoryOpen);
                                            setIsNotificationsOpen(false);
                                        }}
                                        className={`p-2 rounded-lg transition-colors ${isHistoryOpen ? 'bg-orange-100 text-orange-700' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800'}`}
                                        title="Chat History"
                                    >
                                        <History size={18} />
                                    </button>

                                    <div className="w-px h-5 bg-zinc-200 mx-1"></div>
                                </>
                            )}

                            <div className="relative" ref={notificationRef}>
                                <button
                                    onClick={() => {
                                        setIsNotificationsOpen(!isNotificationsOpen);
                                        setIsHistoryOpen(false);
                                    }}
                                    className={`p-2 rounded-lg transition-colors relative ${isNotificationsOpen ? 'bg-orange-100 text-orange-700' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800'}`}
                                >
                                    <Bell size={18} />
                                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
                                </button>

                                {/* Notifications Dropdown */}
                                {isNotificationsOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-80 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-black/50 flex flex-col z-50 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-4 border-b border-zinc-100 dark:border-white/10 flex justify-between items-center bg-white/50 dark:bg-zinc-900/50">
                                            <h3 className="font-bold text-zinc-700 dark:text-zinc-100 text-sm">Notifications</h3>
                                            <span className="text-[10px] uppercase font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-0.5 rounded-full border border-orange-100 dark:border-orange-500/20">3 New</span>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                                            <div
                                                className="p-3 hover:bg-white dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700/50 group"
                                                onClick={() => {
                                                    setCurrentView('analysis');
                                                    setIsNotificationsOpen(false);
                                                }}
                                            >
                                                <div className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0 text-orange-500 dark:text-orange-400">
                                                        <RefreshCw size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">Analysis Completed</p>
                                                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                                                            Acme Corp deal analysis is ready for review.
                                                        </p>
                                                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 block">2 mins ago</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="p-3 hover:bg-white dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700/50 group"
                                                onClick={() => {
                                                    setCurrentView('dashboard');
                                                    setIsNotificationsOpen(false);
                                                }}
                                            >
                                                <div className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0 text-orange-500 dark:text-orange-400">
                                                        <CheckCircle size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">Task Updated</p>
                                                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                                                            "Q4 Marketing Strategy" has been marked as complete.
                                                        </p>
                                                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 block">1 hour ago</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="p-3 hover:bg-white dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700/50 group"
                                                onClick={() => {
                                                    setCurrentView('calendar');
                                                    setIsNotificationsOpen(false);
                                                }}
                                            >
                                                <div className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0 text-amber-500 dark:text-amber-400">
                                                        <CalendarIcon size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">Meeting Reminder</p>
                                                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                                                            Sync with Product Team in 15 minutes.
                                                        </p>
                                                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 block">4 hours ago</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2 border-t border-zinc-100 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-800/50 text-center">
                                            <button className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors w-full py-1">
                                                Mark all as read
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                className="p-2 text-zinc-500 hover:text-zinc-800 hover:bg-white rounded-lg transition-colors dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800"
                            >
                                <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                            </button>

                            {/* History Dropdown */}
                            {isHistoryOpen && currentView === 'chat' && (
                                <div className="absolute top-full right-0 mt-2 w-80 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-black/50 flex flex-col max-h-[500px] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                    {/* Header */}
                                    <div className="p-4 border-b border-zinc-100 dark:border-white/10 flex justify-between items-center bg-white/50 dark:bg-zinc-900/50">
                                        <h3 className="font-bold text-zinc-700 dark:text-zinc-100 text-sm">Recent Conversations</h3>
                                        <button
                                            onClick={handleNewChat}
                                            className="p-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
                                            title="New Chat"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    {/* Search */}
                                    <div className="p-3 border-b border-zinc-100 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-800/50">
                                        <div className="relative">
                                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                                            <input
                                                type="text"
                                                placeholder="Search history..."
                                                value={historySearch}
                                                onChange={(e) => setHistorySearch(e.target.value)}
                                                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    {/* List */}
                                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-4">
                                        {Object.keys(filteredGroups).map(group => (
                                            <div key={group}>
                                                <h4 className="px-3 mb-2 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-2">{group}</h4>
                                                <div className="space-y-1">
                                                    {filteredGroups[group].map((session) => (
                                                        <div
                                                            key={session.id}
                                                            onClick={() => handleSelectSession(session.id)}
                                                            className={`w-full text-left p-3 rounded-xl transition-all duration-200 group relative border flex items-start justify-between gap-2 cursor-pointer ${currentSessionId === session.id
                                                                ? 'bg-orange-50 border-orange-100 ring-1 ring-orange-500/10 dark:bg-orange-900/20 dark:border-orange-500/20 dark:ring-orange-500/20'
                                                                : 'border-transparent hover:bg-white hover:border-white/80 hover:shadow-sm dark:hover:bg-zinc-800 dark:hover:border-zinc-700/50'
                                                                }`}
                                                        >
                                                            <div className="flex flex-col gap-1 min-w-0 flex-1">
                                                                <div className="flex justify-between items-start w-full">
                                                                    <h4 className={`text-xs font-semibold truncate pr-2 flex-1 ${currentSessionId === session.id ? 'text-orange-900 dark:text-orange-100' : 'text-zinc-700 dark:text-zinc-200'}`}>
                                                                        {session.title}
                                                                    </h4>
                                                                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 whitespace-nowrap">{formatTime(session.timestamp)}</span>
                                                                </div>
                                                                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate w-full opacity-80 flex items-center gap-1.5">
                                                                    <MessageSquare size={10} className={currentSessionId === session.id ? 'text-orange-500 dark:text-orange-400' : 'text-zinc-400 dark:text-zinc-500'} />
                                                                    {session.messages[session.messages.length - 1]?.text.slice(0, 35)}...
                                                                </div>
                                                            </div>

                                                            <button
                                                                onClick={(e) => handleDeleteSession(e, session.id)}
                                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:text-zinc-500 dark:hover:text-rose-400 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                                                                title="Delete Chat"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        {sessions.length === 0 && (
                                            <div className="flex flex-col items-center justify-center py-8 text-center opacity-60">
                                                <MessageSquare size={20} className="text-zinc-300 dark:text-zinc-600 mb-2" />
                                                <p className="text-xs text-zinc-400 dark:text-zinc-500">No conversations found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto relative scroll-smooth no-scrollbar">

                    {currentView === 'dashboard' && <Dashboard onSettingsClick={() => setCurrentView('settings')} />}

                    {currentView === 'calendar' && <CalendarView />}

                    {currentView === 'analysis' && <DealAnalysis />}

                    {currentView === 'avatars' && <AvatarView />}

                    {currentView === 'chat' && (
                        <ChatInterface
                            messages={messages}
                            isLoading={isLoading}
                            sessions={sessions}
                            currentSessionId={currentSessionId}
                            // Removed onSelectSession, onNewChat from here as they are handled globally now
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            onSendMessage={handleSendMessage}
                            onQuickPrompt={executeSendMessage}
                        />
                    )}

                    {currentView === 'creatives' && <GenerateCreatives />}

                    {currentView === 'settings' && <SettingsView />}

                </div>
            </main>
        </div >
    );
}

export default App;