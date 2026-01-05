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
    Users,
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
    const [hoveredPoint, setHoveredPoint] = useState<{ index: number; x: number; y: number } | null>(null);
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
    } & { chartPoints: { x: number; y: number; value: string; date: string; gross: string; fees: string; refunds: string; net: string }[] }> = {
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
            chartPoints: [
                { x: 0, y: 180, value: '$42k', date: 'July 2024', gross: '$48,200', fees: '-$1,440', refunds: '-$4,760', net: '$42,000' },
                { x: 160, y: 145, value: '$68k', date: 'August 2024', gross: '$74,800', fees: '-$2,240', refunds: '-$4,560', net: '$68,000' },
                { x: 320, y: 125, value: '$82k', date: 'September 2024', gross: '$89,500', fees: '-$2,685', refunds: '-$4,815', net: '$82,000' },
                { x: 480, y: 90, value: '$98k', date: 'October 2024', gross: '$106,200', fees: '-$3,186', refunds: '-$5,014', net: '$98,000' },
                { x: 640, y: 60, value: '$112k', date: 'November 2024', gross: '$121,800', fees: '-$3,654', refunds: '-$6,146', net: '$112,000' },
                { x: 800, y: 25, value: '$124.5k', date: 'December 2024', gross: '$135,200', fees: '-$4,056', refunds: '-$6,644', net: '$124,500' },
            ],
        },
        Weekly: {
            description: 'Weekly revenue breakdown',
            currentRevenue: '$32,400',
            currentChange: '+12.8%',
            currentChangeLabel: 'from last week',
            projected: '$138k',
            projectedLabel: 'Projected MTD',
            growthRate: '15.3%',
            growthChange: '+3.2% improvement',
            chartPath: 'M0 150 C115 140, 170 120, 230 100 C285 85, 345 95, 400 70 C455 55, 515 60, 570 40 C630 30, 685 35, 800 20',
            xAxisLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            yAxisLabels: ['$8k', '$6k', '$4k', '$0'],
            chartPoints: [
                { x: 0, y: 150, value: '$3.2k', date: 'Monday, Dec 23', gross: '$3,680', fees: '-$110', refunds: '-$370', net: '$3,200' },
                { x: 133, y: 120, value: '$4.1k', date: 'Tuesday, Dec 24', gross: '$4,715', fees: '-$141', refunds: '-$474', net: '$4,100' },
                { x: 267, y: 90, value: '$4.8k', date: 'Wednesday, Dec 25', gross: '$5,520', fees: '-$166', refunds: '-$554', net: '$4,800' },
                { x: 400, y: 70, value: '$5.2k', date: 'Thursday, Dec 26', gross: '$5,980', fees: '-$179', refunds: '-$601', net: '$5,200' },
                { x: 533, y: 50, value: '$5.8k', date: 'Friday, Dec 27', gross: '$6,670', fees: '-$200', refunds: '-$670', net: '$5,800' },
                { x: 667, y: 35, value: '$4.9k', date: 'Saturday, Dec 28', gross: '$5,635', fees: '-$169', refunds: '-$566', net: '$4,900' },
                { x: 800, y: 20, value: '$4.4k', date: 'Sunday, Dec 29', gross: '$5,060', fees: '-$152', refunds: '-$508', net: '$4,400' },
            ],
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
            chartPoints: [
                { x: 0, y: 160, value: '$285k', date: 'Q1 2024 (Jan-Mar)', gross: '$312,500', fees: '-$9,375', refunds: '-$18,125', net: '$285,000' },
                { x: 267, y: 110, value: '$342k', date: 'Q2 2024 (Apr-Jun)', gross: '$374,200', fees: '-$11,226', refunds: '-$20,974', net: '$342,000' },
                { x: 533, y: 55, value: '$398k', date: 'Q3 2024 (Jul-Sep)', gross: '$435,800', fees: '-$13,074', refunds: '-$24,726', net: '$398,000' },
                { x: 800, y: 30, value: '$412.8k', date: 'Q4 2024 (Oct-Dec)', gross: '$451,200', fees: '-$13,536', refunds: '-$24,864', net: '$412,800' },
            ],
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
            chartPoints: [
                { x: 0, y: 180, value: '$420k', date: 'FY 2020', gross: '$462,000', fees: '-$13,860', refunds: '-$28,140', net: '$420,000' },
                { x: 160, y: 165, value: '$680k', date: 'FY 2021', gross: '$748,000', fees: '-$22,440', refunds: '-$45,560', net: '$680,000' },
                { x: 320, y: 140, value: '$920k', date: 'FY 2022', gross: '$1,012,000', fees: '-$30,360', refunds: '-$61,640', net: '$920,000' },
                { x: 480, y: 100, value: '$1.12M', date: 'FY 2023', gross: '$1,232,000', fees: '-$36,960', refunds: '-$75,040', net: '$1,120,000' },
                { x: 640, y: 55, value: '$1.35M', date: 'FY 2024', gross: '$1,485,000', fees: '-$44,550', refunds: '-$90,450', net: '$1,350,000' },
                { x: 800, y: 25, value: '$1.48M', date: 'FY 2025 (Projected)', gross: '$1,628,000', fees: '-$48,840', refunds: '-$99,160', net: '$1,480,000' },
            ],
        },
    };

    const currentRevenueData = revenueData[timeRange];

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 font-dm-sans">


            {/* KPI Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-200">
                                {metric.title}
                            </CardTitle>
                            <metric.icon className="h-4 w-4 text-zinc-400 dark:text-white" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-zinc-900 dark:text-white">{metric.value}</div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-300 flex items-center gap-1 mt-1">
                                {metric.trend === 'up' ? (
                                    <ArrowUpRight className="h-3 w-3 text-orange-500" />
                                ) : (
                                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                                )}
                                <span className={metric.trend === 'up' ? 'text-orange-600' : 'text-red-500'}>
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
                            <CardTitle className="font-dm-sans text-zinc-900 dark:text-zinc-100">Revenue Performance</CardTitle>
                            <CardDescription className="dark:text-zinc-400">{currentRevenueData.description}</CardDescription>
                        </div>
                        <div className="relative" ref={timeRangeRef}>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsTimeRangeOpen(!isTimeRangeOpen)}
                                className="min-w-[110px] justify-between shadow-sm bg-white/50 border-white/60 hover:bg-white/80 dark:bg-zinc-800/50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                {timeRange}
                                <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${isTimeRangeOpen ? 'rotate-180' : ''}`} />
                            </Button>

                            {isTimeRangeOpen && (
                                <div className="absolute top-full right-0 mt-1 w-36 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-xl shadow-xl shadow-zinc-200/50 dark:shadow-black/50 flex flex-col z-20 animate-in fade-in zoom-in-95 duration-200 overflow-hidden text-sm py-1">
                                    {['Weekly', 'Monthly', 'Quarterly', 'Yearly'].map((item) => (
                                        <div
                                            key={item}
                                            onClick={() => {
                                                setTimeRange(item);
                                                setIsTimeRangeOpen(false);
                                            }}
                                            className={`px-3 py-2 cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700/50 ${timeRange === item ? 'font-medium text-orange-600 bg-orange-50/50 dark:bg-orange-900/20' : 'text-zinc-600 dark:text-zinc-300'}`}
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
                            <p className="text-sm text-zinc-500 dark:text-zinc-300">Current Revenue</p>
                            <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">{currentRevenueData.currentRevenue}</p>
                            <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                                <ArrowUpRight className="h-3 w-3" />
                                {currentRevenueData.currentChange} {currentRevenueData.currentChangeLabel}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-300">{currentRevenueData.projectedLabel}</p>
                            <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">{currentRevenueData.projected}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-300 mt-1 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                Based on current trajectory
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-300">Growth Rate</p>
                            <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">{currentRevenueData.growthRate}</p>
                            <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                                <ArrowUpRight className="h-3 w-3" />
                                {currentRevenueData.growthChange}
                            </p>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Chart Area */}
                    <div
                        className="relative h-[250px] w-full"
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left - 40; // Account for left margin
                            const chartWidth = rect.width - 40;
                            const index = Math.round((x / chartWidth) * (currentRevenueData.xAxisLabels.length - 1));
                            if (index >= 0 && index < currentRevenueData.xAxisLabels.length) {
                                setHoveredPoint({ index, x: e.clientX - rect.left, y: e.clientY - rect.top });
                            }
                        }}
                        onMouseLeave={() => setHoveredPoint(null)}
                    >
                        {/* Y-Axis Labels */}
                        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[11px] font-medium text-zinc-400/80 dark:text-zinc-300 z-10">
                            {currentRevenueData.yAxisLabels.map((label, i) => (
                                <span key={i}>{label}</span>
                            ))}
                        </div>

                        {/* Chart with left margin for labels */}
                        <div className="ml-10 h-full">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#FF4F18" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#FF4F18" stopOpacity="0" />
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
                                <g className="stroke-zinc-300 dark:stroke-zinc-800" strokeWidth="1" strokeDasharray="1 3">
                                    {[0, 1, 2, 3].map(i => (
                                        <line key={i} x1="0" y1={i * 66} x2="800" y2={i * 66} opacity="0.5" />
                                    ))}
                                    <line x1="0" y1="200" x2="800" y2="200" opacity="0.5" />
                                </g>

                                {/* Hover vertical line */}
                                {hoveredPoint !== null && (
                                    <line
                                        x1={hoveredPoint.index * (800 / (currentRevenueData.xAxisLabels.length - 1))}
                                        y1="0"
                                        x2={hoveredPoint.index * (800 / (currentRevenueData.xAxisLabels.length - 1))}
                                        y2="200"
                                        stroke="#FF4F18"
                                        strokeWidth="1"
                                        strokeDasharray="4 4"
                                        opacity="0.5"
                                    />
                                )}

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
                                    stroke="#FF4F18"
                                    strokeWidth="2"
                                    strokeLinecap="square"
                                    strokeLinejoin="miter"
                                    filter="url(#glow)"
                                    className="transition-all duration-500 ease-in-out"
                                />

                                {/* Data points */}
                                {currentRevenueData.chartPoints.map((point, i) => (
                                    <circle
                                        key={i}
                                        cx={point.x}
                                        cy={point.y}
                                        r={hoveredPoint?.index === i ? 6 : 3}
                                        fill={hoveredPoint?.index === i ? "#FF4F18" : "transparent"}
                                        stroke="#FF4F18"
                                        strokeWidth={hoveredPoint?.index === i ? 2 : 0}
                                        className="transition-all duration-150"
                                    />
                                ))}

                                {/* Last Point - Precise Tech Marker */}
                                <g>
                                    <circle cx="800" cy="25" r="3" fill="#FF4F18" stroke="white" strokeWidth="1.5" />
                                    <circle cx="800" cy="25" r="8" fill="none" stroke="#FF4F18" strokeWidth="1" opacity="0.5">
                                        <animate attributeName="r" values="8;14" dur="1.5s" repeatCount="indefinite" />
                                        <animate attributeName="opacity" values="0.5;0" dur="1.5s" repeatCount="indefinite" />
                                        <animate attributeName="stroke-width" values="1;0" dur="1.5s" repeatCount="indefinite" />
                                    </circle>
                                </g>
                            </svg>
                        </div>

                        {/* Hover Tooltip - Revenue Only */}
                        {hoveredPoint !== null && (
                            <div
                                className="absolute pointer-events-none z-20 -translate-x-1/2"
                                style={{ left: hoveredPoint.x, top: 10 }}
                            >
                                <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white px-4 py-3 rounded-xl shadow-xl shadow-zinc-900/20 dark:shadow-black/40 border border-zinc-200 dark:border-zinc-700">
                                    {/* Date Header */}
                                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-300 mb-1">
                                        {currentRevenueData.chartPoints[hoveredPoint.index]?.date || currentRevenueData.xAxisLabels[hoveredPoint.index]}
                                    </div>

                                    {/* Revenue Amount */}
                                    <div className="text-xl font-bold text-zinc-900 dark:text-white">
                                        {currentRevenueData.chartPoints[hoveredPoint.index]?.net || currentRevenueData.chartPoints[hoveredPoint.index]?.value || '$0'}
                                    </div>
                                </div>
                                {/* Arrow */}
                                <div className="w-3 h-3 bg-white dark:bg-zinc-900 rotate-45 mx-auto -mt-1.5 border-r border-b border-zinc-200 dark:border-zinc-700" />
                            </div>
                        )}

                        {/* X-Axis Labels */}
                        <div className="ml-10 mt-2 flex justify-between text-[11px] text-zinc-400/80 dark:text-zinc-500/80 font-medium">
                            {currentRevenueData.xAxisLabels.map((label, i) => (
                                <span
                                    key={i}
                                    className={hoveredPoint?.index === i ? 'text-orange-500 font-bold' : ''}
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Grid: Priority Actions & Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Priority Actions */}
                {/* Customer Avatar Analysis */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                    <Users className="h-4 w-4 text-zinc-500 dark:text-white" />
                                </div>
                                <CardTitle className="font-dm-sans text-base text-zinc-900 dark:text-white">Customer Avatar Analysis</CardTitle>
                            </div>
                            <button className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-200 dark:hover:text-white transition-colors">
                                Sort <ChevronDown size={12} />
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full flex items-end gap-4 pt-4">
                            {/* Y-Axis Labels */}
                            <div className="flex flex-col justify-between h-full text-[10px] text-zinc-400 dark:text-zinc-300 font-medium pb-6 pr-2">
                                <span>30%</span>
                                <span>25%</span>
                                <span>20%</span>
                                <span>15%</span>
                                <span>10%</span>
                                <span>5%</span>
                                <span>0%</span>
                            </div>

                            {/* Bars */}
                            {[
                                { label: 'SM', value: 20 },
                                { label: 'CMO', value: 16 },
                                { label: 'RO', value: 13 },
                                { label: 'VCBSF', value: 9 },
                                { label: 'VCBSF', value: 5 },
                            ].map((item, i) => (
                                <div key={i} className="flex-1 flex flex-col justify-end gap-2 group cursor-pointer h-full">
                                    <div className="relative w-full bg-zinc-50 dark:bg-zinc-800/50 rounded-lg overflow-hidden flex items-end h-full">
                                        <div
                                            className="w-full bg-[#FF4F18] hover:bg-[#E03E10] transition-all duration-500 rounded-t-lg relative group-hover:shadow-[0_0_20px_-5px_#FF4F18]"
                                            style={{ height: `${(item.value / 30) * 100}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                {item.value}%
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-300 text-center uppercase tracking-wider group-hover:text-zinc-600 dark:group-hover:text-white transition-colors">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-zinc-400" />
                                <CardTitle className="font-dm-sans text-zinc-900 dark:text-zinc-100">Recent Activity</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" className="dark:text-zinc-400 dark:hover:text-zinc-200">View all</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentActivity.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                            >
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback className="text-xs dark:bg-zinc-800 dark:text-zinc-300">{item.initials}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200">{item.user}</p>
                                        <span className="text-xs text-zinc-400">•</span>
                                        <span className="text-xs text-zinc-400">{item.time}</span>
                                    </div>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-500 truncate">{item.event}</p>
                                </div>
                                <Badge
                                    variant={item.status === 'success' ? 'outline' : item.status === 'pending' ? 'secondary' : 'destructive'}
                                    className={
                                        item.status === 'success'
                                            ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-500/20'
                                            : item.status === 'pending'
                                                ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                                : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-500/20'
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
        </div >
    );
};

export default Dashboard;
