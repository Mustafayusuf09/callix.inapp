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
    AlignLeft
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
        const remainingSlots = 42 - daysArray.length; // Ensure 6 rows for consistency
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
            case 'urgent': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'meeting': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'creative': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'holiday': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const handleEventClick = (event: any) => {
        setSelectedEvent(event);
    };

    return (
        <div className="flex flex-col h-full px-8 py-6 max-w-[1600px] mx-auto w-full text-slate-800 pb-24 relative">

            {/* Upload Toast Notification */}
            {(isUploading || uploadSuccess) && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 flex items-center gap-4 animate-in slide-in-from-top-4 fade-in duration-300 min-w-[320px]">
                    {isUploading ? (
                        <>
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                <Loader2 className="animate-spin text-emerald-600" size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-bold text-slate-800">Uploading Call...</span>
                                    <span className="text-xs font-bold text-slate-400">{uploadProgress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 animate-in zoom-in duration-300">
                                <Check className="text-emerald-600" size={20} strokeWidth={3} />
                            </div>
                            <div className="animate-in slide-in-from-bottom-2 duration-300">
                                <div className="text-sm font-bold text-slate-800">Upload Complete</div>
                                <div className="text-xs text-slate-500 font-medium">Processing started.</div>
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
                        className="bg-white/60 backdrop-blur-sm border border-white text-slate-600 pl-3 pr-4 py-2 rounded-xl flex items-center gap-2 font-bold text-xs shadow-sm hover:bg-white hover:text-emerald-600 hover:shadow-md transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Upload size={16} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                        <span>{isUploading ? 'Uploading...' : 'Upload a Call'}</span>
                    </button>

                    <div className="flex items-center gap-1 bg-white/60 backdrop-blur-sm border border-white rounded-xl p-1 shadow-sm">
                        <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><ChevronLeft size={18} /></button>
                        <span className="px-4 text-sm font-bold text-slate-700 min-w-[140px] text-center">
                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><ChevronRight size={18} /></button>
                    </div>

                    <button
                        onClick={() => setIsNewEventOpen(true)}
                        className="bg-emerald-600 text-white pl-3 pr-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:-translate-y-0.5"
                    >
                        <Plus size={18} />
                        <span>New Event</span>
                    </button>
                </div>
            </div>

            <div className="flex gap-8 h-full min-h-0">

                {/* Main Calendar Grid */}
                <div className="flex-1 bg-white/70 backdrop-blur-xl border border-white/60 rounded-[32px] shadow-sm flex flex-col overflow-hidden">

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 border-b border-slate-100 bg-white/40">
                        {weekDays.map(day => (
                            <div key={day} className="py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid - Changed to dynamic rows */}
                    <div className="flex-1 grid grid-cols-7 grid-rows-6">
                        {days.map((d, i) => (
                            <div key={i} className={`
                        border-b border-r border-slate-100/60 p-3 flex flex-col gap-2 transition-colors
                        ${d.month !== 'current' ? 'bg-slate-50/50' : 'hover:bg-white/60'}
                        ${(i + 1) % 7 === 0 ? 'border-r-0' : ''}
                        ${i >= 35 ? 'border-b-0' : ''} 
                    `}>
                                <div className="flex justify-between items-start">
                                    <span className={`
                                text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full
                                ${d.isToday
                                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                                            : d.month === 'current' ? 'text-slate-700' : 'text-slate-300'}
                             `}>
                                        {d.day}
                                    </span>
                                </div>

                                {/* Events for this day */}
                                <div className="flex flex-col gap-1.5 mt-1">
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
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden group flex flex-col justify-between min-h-[180px]">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-1000"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl -ml-10 -mb-10 animate-pulse"></div>

                        {/* Time & Date */}
                        <div className="relative z-10 pt-2">
                            <div className="flex items-baseline gap-1">
                                <h3 className="text-5xl font-bold tracking-tighter">
                                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                </h3>
                                <span className="text-xl font-medium text-emerald-200/60">
                                    {time.getSeconds().toString().padStart(2, '0')}
                                </span>
                            </div>
                            <p className="text-emerald-50 text-lg font-medium mt-1 pl-1">
                                Sunday, Nov 16
                            </p>
                        </div>

                        {/* Events Summary */}
                        <div className="relative z-10 mt-4">
                            <div className="flex items-center text-xs font-medium bg-black/20 rounded-xl p-3 backdrop-blur-md border border-white/10 hover:bg-black/30 transition-colors cursor-pointer group/summary">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse"></div>
                                    <span className="text-emerald-50">3 Events Remaining today.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedule List */}
                    <div className="flex-1 bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-sm p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800">Schedule</h3>

                        </div>

                        <div className="space-y-6 overflow-y-auto pr-2 no-scrollbar">
                            {upcomingEvents.map((event, idx) => (
                                <div key={idx} className="relative pl-4 group cursor-pointer" onClick={() => handleEventClick(event)}>
                                    {/* Timeline Line */}
                                    <div className="absolute left-0 top-1 bottom-[-24px] w-0.5 bg-slate-200 group-last:bottom-0"></div>
                                    <div className="absolute left-[-2px] top-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-4 ring-white"></div>

                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-slate-400">{event.time}</span>
                                        {event.type === 'urgent' && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>}
                                    </div>

                                    <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm group-hover:shadow-md group-hover:border-emerald-200 transition-all">
                                        <h4 className="font-bold text-slate-800 text-sm mb-1">{event.title}</h4>
                                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                                            <span className="flex items-center gap-1"><Clock size={12} /> {event.duration}</span>
                                            {event.location && <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>}
                                            {event.link && <span className="flex items-center gap-1 text-emerald-600"><Video size={12} /> Join</span>}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-white/50">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-900">Create New Event</h2>
                            <button onClick={() => setIsNewEventOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-50 rounded-full p-2">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Title Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Event Title</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    placeholder="e.g. Q4 Strategy Review"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-300"
                                    autoFocus
                                />
                            </div>

                            {/* Description Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Description</label>
                                <textarea
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    placeholder="Agenda, goals, or notes..."
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-300 h-24 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Day Input */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Day (Nov)</label>
                                    <div className="relative">
                                        <CalendarIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            min="1" max="30"
                                            value={newEvent.day}
                                            onChange={(e) => setNewEvent({ ...newEvent, day: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                        />
                                    </div>
                                </div>
                                {/* Time Input */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Time</label>
                                    <div className="relative">
                                        <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={newEvent.time}
                                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Type Selector */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Event Type</label>
                                <div className="flex flex-wrap gap-2">
                                    {['meeting', 'urgent', 'creative', 'normal', 'holiday'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setNewEvent({ ...newEvent, type: type })}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all border ${newEvent.type === type
                                                ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Location / Link</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={newEvent.location}
                                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                        placeholder="Add location or video link"
                                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setIsNewEventOpen(false)}
                                className="px-6 py-3 rounded-xl text-slate-500 font-bold hover:bg-white hover:text-slate-700 transition-colors border border-transparent hover:border-slate-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateEvent}
                                disabled={!newEvent.title}
                                className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create Event
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- EVENT DETAILS MODAL --- */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-in zoom-in-95 duration-200 border border-white/50">

                        {/* Clean Minimal Header */}
                        <div className="flex justify-between items-start p-8 pb-0">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{selectedEvent.title}</h2>
                                <p className="text-slate-500 font-medium text-lg mt-1">StartupXYZ</p>
                            </div>
                            <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">

                            {/* Metadata Strip */}
                            <div className="flex items-center gap-6 text-sm text-slate-600 border-b border-slate-100 pb-8">
                                <div className="flex items-center gap-2.5">
                                    <CalendarIcon size={18} className="text-slate-400" />
                                    <span className="font-semibold">{selectedEvent.month} {selectedEvent.day}, {selectedEvent.year}</span>
                                </div>
                                <div className="w-px h-4 bg-slate-200"></div>
                                <div className="flex items-center gap-2.5">
                                    <Clock size={18} className="text-slate-400" />
                                    <span className="font-semibold">{selectedEvent.time} • {selectedEvent.duration}</span>
                                </div>
                                {selectedEvent.attendees && (
                                    <>
                                        <div className="w-px h-4 bg-slate-200"></div>
                                        <div className="flex items-center gap-2.5">
                                            <Users size={18} className="text-slate-400" />
                                            <span className="font-semibold">{selectedEvent.attendees.join(', ')}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Key Topics - Moved to Top */}
                            <div>
                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Key Topics</div>
                                <div className="flex flex-wrap gap-2">
                                    {['Technical integration', 'API capabilities', 'Security'].map(tag => (
                                        <span key={tag} className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-full shadow-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* AI Analysis - Modern Card */}
                            {selectedEvent.aiAnalysis && (
                                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                                    <div className="flex items-center gap-2 mb-6">
                                        <Sparkles size={18} className="text-emerald-500" />
                                        <span className="font-bold text-slate-900">AI Predictions</span>
                                    </div>

                                    {/* Probability & Sentiment */}
                                    <div className="grid grid-cols-2 gap-8 mb-8">
                                        <div>
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-sm font-medium text-slate-500">Success Probability</span>
                                                <span className="text-2xl font-bold text-amber-500">{selectedEvent.aiAnalysis.probability}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${selectedEvent.aiAnalysis.probability}%` }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-slate-500 block mb-2">Predicted Sentiment</span>
                                            <div className="flex items-center gap-2">
                                                <Meh size={24} className="text-slate-400" />
                                                <span className="font-bold text-slate-700">{selectedEvent.aiAnalysis.sentiment}</span>
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
                                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></span>
                                                        {risk}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Lightbulb size={12} /> Recommendations
                                            </div>
                                            <ul className="space-y-2">
                                                {selectedEvent.aiAnalysis.recommendations?.map((rec: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
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
                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Notes</div>
                                    <p className="text-slate-700 leading-relaxed text-base">
                                        {selectedEvent.description}
                                    </p>
                                </div>
                            )}

                        </div>

                        {/* Footer Action Bar */}
                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white rounded-b-[32px]">
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="px-6 py-3 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-colors"
                            >
                                Close
                            </button>
                            <button className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5">
                                Join Call
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarView;