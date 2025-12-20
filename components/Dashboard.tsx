import React, { useState, useRef, useEffect } from 'react';
import {
    Phone,
    Activity,
    Filter,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,

    AlertCircle,
    Clock,
    CheckCircle2,
    ArrowRight,
    TrendingUp,
    Info,
    ChevronDown,
} from 'lucide-react';

// Import shadcn/ui components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';

interface DashboardProps {
    onSettingsClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSettingsClick }) => {
    const [timeRange, setTimeRange] = useState('Monthly');
    const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);
    const timeRangeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (timeRangeRef.current && !timeRangeRef.current.contains(event.target as Node)) {
                setIsTimeRangeOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Original KPIs
    const metrics = [
        {
            title: 'Calls Analyzed',
            value: '1,248',
            change: '+12.5%',
            trend: 'up' as const,
            icon: Phone,
            description: 'vs last 30 days'
        },
        {
            title: 'Conversion Rate',
            value: '22.1%',
            change: '-1.4%',
            trend: 'down' as const,
            icon: Activity,
            description: 'vs last 30 days'
        },
        {
            title: 'Lead Qualification Rate',
            value: '48.2%',
            change: '+5.4%',
            trend: 'up' as const,
            icon: Filter,
            description: 'vs last 30 days'
        },
        {
            title: 'Return On Ad Spend',
            value: '4.2x',
            change: '+0.3x',
            trend: 'up' as const,
            icon: DollarSign,
            description: 'vs last 30 days'
        },
    ];

    // Priority Actions
    const priorityActions = [
        {
            title: 'Approve Q4 Budget Increase',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            priority: 'high' as const,
            time: '2h ago'
        },
        {
            title: 'Review Apple Enterprise Contract',
            description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            priority: 'high' as const,
            time: '4h ago'
        },
        {
            title: 'Schedule Team Performance Reviews',
            description: 'Ut enim ad minim veniam, quis nostrud exercitation.',
            priority: 'normal' as const,
            time: '1d ago'
        },
    ];

    // Recent Activity
    const recentActivity = [
        { user: 'J. Thompson', initials: 'JT', event: 'Closed deal #4920', status: 'success' as const, time: '10m ago' },
        { user: 'M. Delgado', initials: 'MD', event: 'Updated Q4 Forecast', status: 'pending' as const, time: '32m ago' },
        { user: 'System', initials: 'SY', event: 'Database Backup', status: 'success' as const, time: '1h ago' },
        { user: 'S. Connor', initials: 'SC', event: 'Flagged high risk lead', status: 'alert' as const, time: '2h ago' },
    ];

    // Revenue data based on time range
    const revenueData: Record<string, {
        description: string;
        currentRevenue: string;
        currentChange: string;
        currentChangeLabel: string;
        projected: string;
        projectedLabel: string;
        growthRate: string;
        growthChange: string;
        chartPath: string;
        xAxisLabels: string[];
        yAxisLabels: string[];
    }> = {
        Monthly: {
            description: 'Monthly revenue and projections',
            currentRevenue: '$124,500',
            currentChange: '+23.5%',
            currentChangeLabel: 'from last month',
            projected: '$1.2M',
            projectedLabel: 'Projected EOY',
            growthRate: '18.2%',
            growthChange: '+4.1% improvement',
            chartPath: 'M0 180 C100 160, 150 150, 200 140 C250 130, 300 135, 350 120 C400 105, 450 100, 500 85 C550 70, 600 75, 650 55 C700 35, 750 40, 800 25',
            xAxisLabels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            yAxisLabels: ['$150k', '$100k', '$50k', '$0'],
        },
        Quarterly: {
            description: 'Quarterly revenue performance',
            currentRevenue: '$412,800',
            currentChange: '+18.2%',
            currentChangeLabel: 'from last quarter',
            projected: '$1.5M',
            projectedLabel: 'Projected EOY',
            growthRate: '22.4%',
            growthChange: '+6.8% improvement',
            chartPath: 'M0 160 C200 140, 300 100, 400 80 C500 60, 600 50, 800 30',
            xAxisLabels: ['Q1', 'Q2', 'Q3', 'Q4'],
            yAxisLabels: ['$500k', '$350k', '$200k', '$0'],
        },
        Yearly: {
            description: 'Annual revenue trends',
            currentRevenue: '$1.48M',
            currentChange: '+32.1%',
            currentChangeLabel: 'from last year',
            projected: '$1.8M',
            projectedLabel: 'Next Year Target',
            growthRate: '28.6%',
            growthChange: '+12.3% improvement',
            chartPath: 'M0 180 C100 175, 200 160, 300 140 C400 110, 500 85, 600 60 C700 45, 800 30, 800 25',
            xAxisLabels: ['2020', '2021', '2022', '2023', '2024', '2025'],
            yAxisLabels: ['$2M', '$1.5M', '$750k', '$0'],
        },
    };

    const currentRevenueData = revenueData[timeRange];

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">


            {/* KPI Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                {metric.title}
                            </CardTitle>
                            <metric.icon className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metric.value}</div>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                {metric.trend === 'up' ? (
                                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                                ) : (
                                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                                )}
                                <span className={metric.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}>
                                    {metric.change}
                                </span>
                                {metric.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Revenue Performance</CardTitle>
                            <CardDescription>{currentRevenueData.description}</CardDescription>
                        </div>
                        <div className="relative" ref={timeRangeRef}>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsTimeRangeOpen(!isTimeRangeOpen)}
                                className="min-w-[110px] justify-between shadow-sm bg-white"
                            >
                                {timeRange}
                                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isTimeRangeOpen ? 'rotate-180' : ''}`} />
                            </Button>

                            {isTimeRangeOpen && (
                                <div className="absolute top-full right-0 mt-1 w-36 bg-white/90 backdrop-blur-xl border border-white/60 rounded-xl shadow-xl shadow-slate-200/50 flex flex-col z-20 animate-in fade-in zoom-in-95 duration-200 overflow-hidden text-sm py-1">
                                    {['Monthly', 'Quarterly', 'Yearly'].map((item) => (
                                        <div
                                            key={item}
                                            onClick={() => {
                                                setTimeRange(item);
                                                setIsTimeRangeOpen(false);
                                            }}
                                            className={`px-3 py-2 cursor-pointer transition-colors hover:bg-slate-50 ${timeRange === item ? 'font-medium text-emerald-600 bg-emerald-50/50' : 'text-slate-600'}`}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-6 mb-6">
                        <div>
                            <p className="text-sm text-slate-500">Current Revenue</p>
                            <p className="text-2xl font-bold mt-1">{currentRevenueData.currentRevenue}</p>
                            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                <ArrowUpRight className="h-3 w-3" />
                                {currentRevenueData.currentChange} {currentRevenueData.currentChangeLabel}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">{currentRevenueData.projectedLabel}</p>
                            <p className="text-2xl font-bold mt-1">{currentRevenueData.projected}</p>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                Based on current trajectory
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Growth Rate</p>
                            <p className="text-2xl font-bold mt-1">{currentRevenueData.growthRate}</p>
                            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                <ArrowUpRight className="h-3 w-3" />
                                {currentRevenueData.growthChange}
                            </p>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Chart Area */}
                    <div className="relative h-[250px] w-full">
                        {/* Y-Axis Labels */}
                        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[11px] font-medium text-slate-400/80 z-10">
                            {currentRevenueData.yAxisLabels.map((label, i) => (
                                <span key={i}>{label}</span>
                            ))}
                        </div>

                        {/* Chart with left margin for labels */}
                        <div className="ml-10 h-full">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                    </linearGradient>
                                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>

                                {/* Grid Lines - Technical Dotted */}
                                <g stroke="#cbd5e1" strokeWidth="1" strokeDasharray="1 3">
                                    {[0, 1, 2, 3].map(i => (
                                        <line key={i} x1="0" y1={i * 66} x2="800" y2={i * 66} opacity="0.5" />
                                    ))}
                                    <line x1="0" y1="200" x2="800" y2="200" opacity="0.5" />
                                </g>

                                {/* Current Value Guide Line (Trader Style) */}
                                <line x1="0" y1="25" x2="800" y2="25" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />

                                {/* Area */}
                                <path
                                    d={`${currentRevenueData.chartPath} L800 200 L0 200 Z`}
                                    fill="url(#revenueGradient)"
                                    className="transition-all duration-500 ease-in-out"
                                />

                                {/* Line - Sharp, Thin, Electric */}
                                <path
                                    d={currentRevenueData.chartPath}
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="2"
                                    strokeLinecap="square"
                                    strokeLinejoin="miter"
                                    filter="url(#glow)"
                                    className="transition-all duration-500 ease-in-out"
                                />

                                {/* Last Point - Precise Tech Marker */}
                                <g>
                                    <circle cx="800" cy="25" r="3" fill="#10b981" stroke="white" strokeWidth="1.5" />
                                    <circle cx="800" cy="25" r="8" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.5">
                                        <animate attributeName="r" values="8;14" dur="1.5s" repeatCount="indefinite" />
                                        <animate attributeName="opacity" values="0.5;0" dur="1.5s" repeatCount="indefinite" />
                                        <animate attributeName="stroke-width" values="1;0" dur="1.5s" repeatCount="indefinite" />
                                    </circle>
                                </g>
                            </svg>
                        </div>

                        {/* X-Axis Labels */}
                        <div className="ml-10 mt-2 flex justify-between text-[11px] text-slate-400/80 font-medium">
                            {currentRevenueData.xAxisLabels.map((label, i) => (
                                <span key={i}>{label}</span>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Grid: Priority Actions & Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Priority Actions */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-500" />
                                <CardTitle>Priority Actions</CardTitle>
                            </div>
                            <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                                {priorityActions.length} pending
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {priorityActions.map((action, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${action.priority === 'high' ? 'bg-red-500' : 'bg-amber-500'
                                    }`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-medium truncate">{action.title}</p>
                                        <span className="text-xs text-slate-400 shrink-0">{action.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{action.description}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-slate-400" />
                                <CardTitle>Recent Activity</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm">View all</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentActivity.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback className="text-xs">{item.initials}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium">{item.user}</p>
                                        <span className="text-xs text-slate-400">•</span>
                                        <span className="text-xs text-slate-400">{item.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">{item.event}</p>
                                </div>
                                <Badge
                                    variant={item.status === 'success' ? 'outline' : item.status === 'pending' ? 'secondary' : 'destructive'}
                                    className={
                                        item.status === 'success'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : item.status === 'pending'
                                                ? 'bg-slate-100 text-slate-600'
                                                : 'bg-red-50 text-red-700 border-red-200'
                                    }
                                >
                                    {item.status === 'success' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                    {item.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                                    {item.status === 'alert' && <AlertCircle className="h-3 w-3 mr-1" />}
                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
