import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Video,
    MapPin,
    Plus,
    Filter,
    X,
    Users,
    FileText,
    AlertTriangle,
    Lightbulb,
    Sparkles,
    Calendar as CalendarIcon,
    TrendingUp,
    ArrowRight,
    Upload,
    Meh,
    Loader2,
    Check,
    AlignLeft,
    Edit,
    Trash2
} from 'lucide-react';

const CalendarView: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10, 1)); // Start at Nov 2025

    // Upload State
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // New Event State
    const [isNewEventOpen, setIsNewEventOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        day: '16', // Default to current day in mock
        month: 'Nov',
        time: '09:00',
        duration: '1h',
        type: 'meeting',
        location: '',
        description: ''
    });

    // Helper to generate consistent event objects
    const createEventObject = (overrides: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: 'New Event',
        type: 'meeting',
        day: 16,
        month: 'Nov',
        year: 2025,
        time: '09:00',
        duration: '1h',
        location: 'Conference Room A',
        link: '',
        description: 'Reviewing key performance indicators and strategic alignment for the upcoming quarter.',
        attendees: ['Lucas Berger', 'Sarah Connor', 'Michael Chen'],
        aiAnalysis: {
            sentiment: 'Neutral',
            probability: 65,
            risks: ['Timeline constraints', 'Resource availability'],
            recommendations: ['Prepare budget breakdown', 'Review Q3 performance']
        },
        ...overrides
    });

    // Event Data State
    const [eventsState, setEventsState] = useState<Record<string, any[]>>({
        '10-3': [createEventObject({ title: 'Q4 Planning', type: 'urgent', day: 3, time: '10:00 AM' })],
        '10-7': [createEventObject({ title: 'Team Lunch', type: 'normal', day: 7, time: '12:30 PM', description: 'Monthly team bonding at minimal cost.', aiAnalysis: { sentiment: 'Positive', probability: 99, risks: [], recommendations: [] } })],
        '10-11': [
            createEventObject({ title: 'Client: Apple', type: 'meeting', day: 11, time: '14:00', attendees: ['Tim Cook', 'Lucas Berger'] }),
            createEventObject({ title: 'Design Review', type: 'creative', day: 11, time: '16:00' })
        ],
        '10-16': [
            createEventObject({ title: 'Board Meeting', type: 'urgent', day: 16, time: '11:30 AM', duration: '1.5h', location: 'Boardroom', attendees: ['Board Members', 'Exec Team'] }),
            createEventObject({ title: 'Sync w/ Sarah', type: 'meeting', day: 16, time: '02:00 PM', duration: '30m', location: 'Online' })
        ],
        '10-20': [createEventObject({ title: 'Product Launch', type: 'creative', day: 20, time: '09:00 AM' })],
        '10-27': [createEventObject({ title: 'Thanksgiving', type: 'holiday', day: 27, time: 'All Day', description: 'Office Closed' })]
    });

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

        const daysArray = [];

        // Previous month filler
        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            daysArray.push({
                day: prevMonthDays - i,
                month: 'prev',
                events: []
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const eventKey = `${date.getMonth()}-${i}`;
            // Only show events for 2025 for now to match mock data logic
            const dayEvents = date.getFullYear() === 2025 ? (eventsState[eventKey] || []) : [];

            daysArray.push({
                day: i,
                month: 'current',
                isToday: i === 16 && month === 10 && year === 2025, // Mock "Today" as Nov 16, 2025
                events: dayEvents
            });
        }

        // Next month filler
        const totalDays = daysArray.length;
        const weeksNeeded = Math.ceil(totalDays / 7);
        const remainingSlots = (weeksNeeded * 7) - totalDays;

        for (let i = 1; i <= remainingSlots; i++) {
            daysArray.push({
                day: i,
                month: 'next',
                events: []
            });
        }

        return daysArray;
    };

    const days = getDaysInMonth(currentMonth);
    const weeksCount = Math.ceil(days.length / 7);

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleCreateEvent = () => {
        if (!newEvent.title) return;

        // Create a full event object
        const eventData = createEventObject({
            title: newEvent.title,
            type: newEvent.type,
            day: parseInt(newEvent.day),
            month: 'Nov', // Note: This might need dynamic update if we support other months creation
            year: 2025,
            time: newEvent.time,
            duration: newEvent.duration,
            location: newEvent.location,
            description: newEvent.description || "No specific agenda provided. Review operational metrics and next steps.",
            aiAnalysis: {
                sentiment: 'Neutral',
                probability: Math.floor(Math.random() * 30) + 60, // Random 60-90%
                risks: ['Schedule conflict possible', 'Preparation time limited'],
                recommendations: ['Send agenda ahead of time', 'Confirm attendance']
            }
        });

        // 1. Add to Events State
        // Assuming we are only adding to current month/year for this mock context, or specifically Nov
        // The mock input (newEvent) uses day string, assumed to be for the *current viewed month* or Nov?
        // Let's assume the user intends to add to the VIEWED month for simplicity in this interaction
        const targetMonthIndex = currentMonth.getMonth(); // 10 for Nov
        const eventKey = `${targetMonthIndex}-${eventData.day}`;

        setEventsState(prev => ({
            ...prev,
            [eventKey]: [...(prev[eventKey] || []), eventData]
        }));

        // 2. Add to Sidebar Schedule (if it matches today's view - mock assumed day 16 is 'today')
        // And if we are in Nov 2025
        if (eventData.day === 16 && targetMonthIndex === 10) {
            setUpcomingEvents(prev => [...prev, eventData].sort((a, b) => a.time.localeCompare(b.time)));
        }

        // 3. Reset and Close
        setIsNewEventOpen(false);
        setNewEvent({
            title: '',
            day: '16',
            month: 'Nov',
            time: '09:00',
            duration: '1h',
            type: 'meeting',
            location: '',
            description: ''
        });
    };


    const [upcomingEvents, setUpcomingEvents] = useState([
        createEventObject({ time: '09:00 AM', title: 'Weekly Sync', type: 'meeting', duration: '1h', day: 16 }),
        createEventObject({ time: '11:30 AM', title: 'Board Meeting', type: 'urgent', duration: '1.5h', location: 'Conference Room A', day: 16 }),
        createEventObject({ time: '02:00 PM', title: 'Sync w/ Sarah', type: 'meeting', duration: '30m', link: 'meet.google.com/abc-xyz', day: 16 }),
        createEventObject({ time: '04:00 PM', title: 'Deep Work', type: 'normal', duration: '2h', day: 16 }),
    ]);

    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isEditingEvent, setIsEditingEvent] = useState(false);
    const [editEventData, setEditEventData] = useState<any>(null);

    const handleEditClick = () => {
        setIsEditingEvent(true);
        setEditEventData({ ...selectedEvent });
    };

    const handleSaveEdit = () => {
        if (!editEventData) return;

        // Update in eventsState
        const eventKey = `${10}-${editEventData.day}`; // Simplified assumption for Nov key
        setEventsState(prev => {
            const dayEvents = prev[eventKey] || [];
            const updatedEvents = dayEvents.map(ev => ev.id === editEventData.id ? editEventData : ev);
            return { ...prev, [eventKey]: updatedEvents };
        });

        // Update in upcomingEvents
        setUpcomingEvents(prev => prev.map(ev => ev.id === editEventData.id ? editEventData : ev));

        // Update selected event view
        setSelectedEvent(editEventData);
        setIsEditingEvent(false);
    };

    const handleDeleteEvent = () => {
        if (!selectedEvent) return;

        // Remove from eventsState
        const eventKey = `${10}-${selectedEvent.day}`;
        setEventsState(prev => {
            const dayEvents = prev[eventKey] || [];
            return { ...prev, [eventKey]: dayEvents.filter(ev => ev.id !== selectedEvent.id) };
        });

        // Remove from upcomingEvents
        setUpcomingEvents(prev => prev.filter(ev => ev.id !== selectedEvent.id));

        // Close modal
        setSelectedEvent(null);
        setIsEditingEvent(false);
    };

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);
            setUploadSuccess(false);
            setUploadProgress(0);

            // Simulate upload process
            const interval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setIsUploading(false);
                        setUploadSuccess(true);
                        setTimeout(() => setUploadSuccess(false), 3000); // Hide success after 3s
                        return 100;
                    }
                    return prev + 10; // Simulation speed
                });
            }, 200);
        }
        // Reset input value to allow selecting the same file again if needed
        event.target.value = '';
    };



    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getEventStyles = (type: string) => {
        switch (type) {
            case 'urgent': return 'bg-zinc-900 text-zinc-50 border-zinc-800 dark:bg-zinc-700 dark:text-zinc-100 dark:border-zinc-600';
            case 'meeting': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-200 dark:border-orange-500/20';
            case 'creative': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-200 dark:border-orange-500/20';
            case 'holiday': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-200 dark:border-rose-500/20';
            default: return 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
        }
    };

    const handleEventClick = (event: any) => {
        setSelectedEvent(event);
    };

    return (
        <div className="flex flex-col h-full px-8 py-6 max-w-[1600px] mx-auto w-full text-zinc-800 dark:text-zinc-200 pb-24 relative">

            {/* Upload Toast Notification */}
            {(isUploading || uploadSuccess) && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-zinc-200 shadow-2xl rounded-2xl p-4 flex items-center gap-4 animate-in slide-in-from-top-4 fade-in duration-300 min-w-[320px] dark:bg-zinc-900 dark:border-zinc-700">
                    {isUploading ? (
                        <>
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 dark:bg-orange-900/20">
                                <Loader2 className="animate-spin text-orange-600 dark:text-orange-500" size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Uploading Call...</span>
                                    <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">{uploadProgress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden dark:bg-zinc-800">
                                    <div className="h-full bg-orange-500 transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 animate-in zoom-in duration-300 dark:bg-orange-900/20">
                                <Check className="text-orange-600 dark:text-orange-500" size={20} strokeWidth={3} />
                            </div>
                            <div className="animate-in slide-in-from-bottom-2 duration-300">
                                <div className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Upload Complete</div>
                                <div className="text-xs text-zinc-500 font-medium dark:text-zinc-300">Processing started.</div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Calendar Header */}
            <div className="flex justify-end items-center mb-8">

                <div className="flex items-center gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept="audio/*,video/*,.pdf,.doc,.docx"
                    />

                    <button
                        onClick={handleUploadClick}
                        disabled={isUploading}
                        className="bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm border border-white dark:border-white/10 text-zinc-600 dark:text-zinc-300 pl-3 pr-4 py-2 rounded-xl flex items-center gap-2 font-bold text-xs shadow-sm hover:bg-white dark:hover:bg-zinc-800 hover:text-orange-600 dark:hover:text-orange-500 hover:shadow-md transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Upload size={16} className="text-zinc-400 dark:text-zinc-500 group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors" />
                        <span>{isUploading ? 'Uploading...' : 'Upload a Call'}</span>
                    </button>

                    <div className="flex items-center gap-1 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm border border-white dark:border-white/10 rounded-xl p-1 shadow-sm">
                        <button onClick={prevMonth} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors"><ChevronLeft size={18} /></button>
                        <span className="px-4 text-sm font-bold text-zinc-700 dark:text-zinc-200 min-w-[140px] text-center">
                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={nextMonth} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors"><ChevronRight size={18} /></button>
                    </div>

                    <button
                        onClick={() => setIsNewEventOpen(true)}
                        className="bg-orange-600 text-white pl-3 pr-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-sm shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all hover:-translate-y-0.5"
                    >
                        <Plus size={18} />
                        <span>New Event</span>
                    </button>
                </div>
            </div>

            <div className="flex gap-8 h-full min-h-0">

                {/* Main Calendar Grid */}
                <div className="flex-1 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[32px] shadow-sm flex flex-col overflow-hidden">

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800 bg-white/40 dark:bg-zinc-800/40">
                        {weekDays.map(day => (
                            <div key={day} className="py-4 text-center text-[11px] font-bold text-zinc-400 dark:text-zinc-100 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid - Changed to dynamic rows */}
                    <div
                        className="flex-1 grid grid-cols-7 overflow-y-auto"
                        style={{ gridTemplateRows: `repeat(${weeksCount}, minmax(130px, 1fr))` }}
                    >
                        {days.map((d, i) => (
                            <div key={i} className={`
                        border-b border-r border-zinc-100/60 dark:border-zinc-800/60 p-2 flex flex-col gap-1 transition-colors overflow-hidden
                        ${d.month !== 'current' ? 'bg-zinc-50/50 dark:bg-zinc-800/30' : 'hover:bg-white/60 dark:hover:bg-zinc-800/40'}
                        ${(i + 1) % 7 === 0 ? 'border-r-0' : ''}
                        ${i >= (weeksCount - 1) * 7 ? 'border-b-0' : ''}
                    `}>
                                <div className="flex justify-between items-start shrink-0">
                                    <span className={`
                                text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full
                                ${d.isToday
                                            ? 'bg-orange-600 text-white shadow-md shadow-orange-500/30'
                                            : d.month === 'current' ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-300 dark:text-zinc-500'}
                             `}>
                                        {d.day}
                                    </span>
                                </div>

                                {/* Events for this day */}
                                <div className="flex flex-col gap-1 mt-0.5 overflow-y-auto no-scrollbar min-h-0">
                                    {d.events?.map((event, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => handleEventClick(event)}
                                            className={`px-2 py-1 rounded-md border text-[10px] font-semibold truncate cursor-pointer hover:opacity-80 transition-opacity ${getEventStyles(event.type)}`}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Agenda */}
                <div className="w-80 flex flex-col gap-6">

                    {/* Date Card */}
                    <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-3xl p-6 text-white shadow-xl shadow-orange-900/10 relative overflow-hidden group flex flex-col justify-between min-h-[180px]">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-1000"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-400/20 rounded-full blur-2xl -ml-10 -mb-10 animate-pulse"></div>

                        {/* Time & Date */}
                        <div className="relative z-10 pt-2">
                            <div className="flex items-baseline gap-1">
                                <h3 className="text-5xl font-bold tracking-tighter">
                                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                </h3>
                                <span className="text-xl font-medium text-orange-200/60">
                                    {time.getSeconds().toString().padStart(2, '0')}
                                </span>
                            </div>
                            <p className="text-orange-50 text-lg font-medium mt-1 pl-1">
                                Sunday, Nov 16
                            </p>
                        </div>

                        {/* Events Summary */}
                        <div className="relative z-10 mt-4">
                            <div className="flex items-center text-xs font-medium bg-black/20 rounded-xl p-3 backdrop-blur-md border border-white/10 hover:bg-black/30 transition-colors cursor-pointer group/summary">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse"></div>
                                    <span className="text-orange-50">3 Events Remaining today.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedule List */}
                    <div className="flex-1 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl shadow-sm p-6 flex flex-col h-full min-h-0">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-zinc-800 dark:text-zinc-100 font-dm-sans">Schedule</h3>

                        </div>

                        <div className="space-y-6 overflow-y-auto pr-2 pl-2">
                            {upcomingEvents.map((event, idx) => (
                                <div key={idx} className="relative pl-4 group cursor-pointer" onClick={() => handleEventClick(event)}>
                                    {/* Timeline Line */}
                                    <div className="absolute left-0 top-1 bottom-[-24px] w-0.5 bg-zinc-200 dark:bg-zinc-700 group-last:bottom-0"></div>
                                    <div className="absolute left-[-2px] top-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 ring-4 ring-white dark:ring-zinc-900"></div>

                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-zinc-400 dark:text-zinc-400">{event.time}</span>
                                        {event.type === 'urgent' && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>}
                                    </div>

                                    <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl p-3 shadow-sm group-hover:shadow-md group-hover:border-orange-200 dark:group-hover:border-orange-500/30 transition-all">
                                        <h4 className="font-bold text-zinc-800 dark:text-zinc-100 text-sm mb-1">{event.title}</h4>
                                        <div className="flex items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-300">
                                            <span className="flex items-center gap-1"><Clock size={12} /> {event.duration}</span>
                                            {event.location && <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>}
                                            {event.link && <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400"><Video size={12} /> Join</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>


                    </div>
                </div>
            </div>

            {/* --- NEW EVENT MODAL --- */}
            {isNewEventOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-white/50 dark:border-white/10">
                        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-dm-sans">Create New Event</h2>
                            <button onClick={() => setIsNewEventOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 rounded-full p-2">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Title Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide ml-1">Event Title</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    placeholder="e.g. Q4 Strategy Review"
                                    className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                                    autoFocus
                                />
                            </div>

                            {/* Description Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide ml-1">Description</label>
                                <textarea
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    placeholder="Agenda, goals, or notes..."
                                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-zinc-300 h-24 resize-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Day Input */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide ml-1">Day (Nov)</label>
                                    <div className="relative">
                                        <CalendarIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input
                                            type="number"
                                            min="1" max="30"
                                            value={newEvent.day}
                                            onChange={(e) => setNewEvent({ ...newEvent, day: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                                        />
                                    </div>
                                </div>
                                {/* Time Input */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide ml-1">Time</label>
                                    <div className="relative">
                                        <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input
                                            type="text"
                                            value={newEvent.time}
                                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Type Selector */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide ml-1">Event Type</label>
                                <div className="flex flex-wrap gap-2">
                                    {['meeting', 'urgent', 'creative', 'normal', 'holiday'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setNewEvent({ ...newEvent, type: type })}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all border ${newEvent.type === type
                                                ? 'bg-zinc-800 text-white border-zinc-800 shadow-md'
                                                : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide ml-1">Location / Link</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        type="text"
                                        value={newEvent.location}
                                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                        placeholder="Add location or video link"
                                        className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-700 flex justify-end gap-3">
                            <button
                                onClick={() => setIsNewEventOpen(false)}
                                className="px-6 py-3 rounded-xl text-zinc-500 dark:text-zinc-400 font-bold hover:bg-white dark:hover:bg-zinc-700/50 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateEvent}
                                disabled={!newEvent.title}
                                className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create Event
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- EVENT DETAILS MODAL --- */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-in zoom-in-95 duration-200 border border-white/50 dark:border-white/10">

                        {/* Clean Minimal Header */}
                        <div className="flex justify-between items-start p-8 pb-0">
                            <div>
                                {isEditingEvent ? (
                                    <input
                                        type="text"
                                        value={editEventData.title}
                                        onChange={(e) => setEditEventData({ ...editEventData, title: e.target.value })}
                                        className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight font-dm-sans bg-transparent border-b border-zinc-200 dark:border-zinc-700 outline-none w-full pb-1 focus:border-orange-500"
                                        autoFocus
                                    />
                                ) : (
                                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight font-dm-sans">{selectedEvent.title}</h2>
                                )}
                                <p className="text-zinc-500 dark:text-zinc-300 font-medium text-lg mt-1">StartupXYZ</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {!isEditingEvent && (
                                    <button
                                        onClick={handleEditClick}
                                        className="text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 p-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-full transition-colors"
                                    >
                                        <Edit size={20} />
                                    </button>
                                )}
                                <button onClick={() => { setSelectedEvent(null); setIsEditingEvent(false); }} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {isEditingEvent ? (
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide ml-1">Time</label>
                                        <input
                                            type="text"
                                            value={editEventData.time}
                                            onChange={(e) => setEditEventData({ ...editEventData, time: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 active:border-orange-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide ml-1">Duration</label>
                                        <input
                                            type="text"
                                            value={editEventData.duration}
                                            onChange={(e) => setEditEventData({ ...editEventData, duration: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 active:border-orange-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-100 uppercase tracking-wide ml-1">Description</label>
                                    <textarea
                                        value={editEventData.description}
                                        onChange={(e) => setEditEventData({ ...editEventData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 active:border-orange-500 resize-none h-32"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 space-y-8">

                                {/* Metadata Strip */}
                                <div className="flex items-center gap-6 text-sm text-zinc-600 border-b border-zinc-100 pb-8 dark:text-zinc-300 dark:border-zinc-800">
                                    <div className="flex items-center gap-2.5">
                                        <CalendarIcon size={18} className="text-zinc-400 dark:text-zinc-400" />
                                        <span className="font-semibold">{selectedEvent.month} {selectedEvent.day}, {selectedEvent.year}</span>
                                    </div>
                                    <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700"></div>
                                    <div className="flex items-center gap-2.5">
                                        <Clock size={18} className="text-zinc-400" />
                                        <span className="font-semibold">{selectedEvent.time} • {selectedEvent.duration}</span>
                                    </div>
                                    {selectedEvent.attendees && (
                                        <>
                                            <div className="w-px h-4 bg-zinc-200"></div>
                                            <div className="flex items-center gap-2.5">
                                                <Users size={18} className="text-zinc-400" />
                                                <span className="font-semibold">{selectedEvent.attendees.join(', ')}</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Key Topics - Moved to Top */}
                                <div>
                                    <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3 dark:text-zinc-100">Key Topics</div>
                                    <div className="flex flex-wrap gap-2">
                                        {['Technical integration', 'API capabilities', 'Security'].map(tag => (
                                            <span key={tag} className="px-4 py-1.5 bg-white border border-zinc-200 text-zinc-600 text-sm font-bold rounded-full shadow-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Analysis - Modern Card */}
                                {selectedEvent.aiAnalysis && (
                                    <div className="bg-zinc-50/50 dark:bg-zinc-800/50 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-700 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>


                                        <div className="flex items-center gap-2 mb-6">
                                            <Sparkles size={18} className="text-orange-500" />
                                            <span className="font-bold text-zinc-900 dark:text-zinc-100">AI Predictions</span>
                                        </div>

                                        {/* Probability & Sentiment */}
                                        <div className="grid grid-cols-2 gap-8 mb-8">
                                            <div>
                                                <div className="flex justify-between items-end mb-2">
                                                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Success Probability</span>
                                                    <span className="text-2xl font-bold text-orange-600">{selectedEvent.aiAnalysis.probability}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-orange-600 rounded-full" style={{ width: `${selectedEvent.aiAnalysis.probability}%` }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-zinc-500 block mb-2">Predicted Sentiment</span>
                                                <div className="flex items-center gap-2">
                                                    <Meh size={24} className="text-zinc-400 dark:text-zinc-500" />
                                                    <span className="font-bold text-zinc-700 dark:text-zinc-200">{selectedEvent.aiAnalysis.sentiment}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Risks & Recommendations Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <div className="text-[11px] font-bold text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <AlertTriangle size={12} /> Potential Risks
                                                </div>
                                                <ul className="space-y-2">
                                                    {selectedEvent.aiAnalysis.risks?.map((risk: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></span>
                                                            {risk}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <div className="text-[11px] font-bold text-orange-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <Lightbulb size={12} /> Recommendations
                                                </div>
                                                <ul className="space-y-2">
                                                    {selectedEvent.aiAnalysis.recommendations?.map((rec: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></span>
                                                            {rec}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Notes - Clean Text */}
                                {selectedEvent.description && (
                                    <div>
                                        <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3 dark:text-zinc-100">Notes</div>
                                        <p className="text-zinc-700 leading-relaxed text-base dark:text-zinc-300">
                                            {selectedEvent.description}
                                        </p>
                                    </div>
                                )}

                            </div>
                        )}

                        {/* Footer Action Bar */}
                        <div className="p-6 border-t border-zinc-100 flex justify-end gap-3 bg-white rounded-b-[32px] dark:bg-zinc-900 dark:border-zinc-800">
                            {isEditingEvent ? (
                                <div className="flex w-full justify-between items-center">
                                    <button
                                        onClick={handleDeleteEvent}
                                        className="px-4 py-3 rounded-xl text-rose-600 font-bold hover:bg-rose-50 transition-colors dark:text-rose-400 dark:hover:bg-rose-900/20 flex items-center gap-2"
                                    >
                                        <Trash2 size={18} />
                                        <span>Delete Event</span>
                                    </button>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setIsEditingEvent(false)}
                                            className="px-6 py-3 rounded-xl text-zinc-500 font-bold hover:bg-zinc-50 transition-colors dark:text-zinc-400 dark:hover:bg-zinc-800"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveEdit}
                                            className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold hover:bg-black dark:hover:bg-zinc-100 transition-all"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setSelectedEvent(null)}
                                        className="px-6 py-3 rounded-xl text-zinc-500 font-bold hover:bg-zinc-50 transition-colors dark:text-zinc-400 dark:hover:bg-zinc-800"
                                    >
                                        Close
                                    </button>
                                    {selectedEvent.link && (
                                        <button className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 hover:-translate-y-0.5">
                                            Join Call
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarView;