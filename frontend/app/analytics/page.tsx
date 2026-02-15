'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Brain,
    Zap,
    TrendingUp,
    Database,
    Cpu,
    Layers,
    Battery,
    BatteryCharging,
    BatteryWarning,
    Calendar,
    ArrowRight,
    Link as LinkIcon,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import dynamic from 'next/dynamic';

const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(m => m.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(m => m.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false });
const Cell = dynamic(() => import('recharts').then(m => m.Cell), { ssr: false });

// Mock Data for Visualization
const PRODUCTIVITY_DATA = [
    { time: '09:00', focus: 65, energy: 80, load: 40 },
    { time: '11:00', focus: 85, energy: 75, load: 60 },
    { time: '13:00', focus: 45, energy: 60, load: 30 },
    { time: '15:00', focus: 70, energy: 55, load: 75 },
    { time: '17:00', focus: 90, energy: 40, load: 85 },
    { time: '19:00', focus: 60, energy: 30, load: 50 },
    { time: '21:00', focus: 40, energy: 20, load: 30 },
];

const COGNITIVE_PATTERNS = [
    { name: 'Deep Work', value: 35, color: '#10b981' },
    { name: 'Flow State', value: 25, color: '#059669' },
    { name: 'Distraction', value: 20, color: '#ef4444' },
    { name: 'Fatigue', value: 15, color: '#eab308' },
    { name: 'Idle', value: 5, color: '#6b7280' },
];

const TASKS = [
    { id: 1, type: 'Creative', title: 'System Architecture Design', energy: 'High', duration: '90m' },
    { id: 2, type: 'Admin', title: 'Weekly Report Review', energy: 'Low', duration: '30m' },
    { id: 3, type: 'Learn', title: 'Neural Net Research', energy: 'Med', duration: '60m' },
];

const NeuralMetricsPage = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState('focus');
    const [batteryLevel, setBatteryLevel] = useState(78);

    // Simulate AI Analysis
    const runAnalysis = () => {
        setIsAnalyzing(true);
        setAnalysisComplete(false);
        // Simulate processing time
        setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisComplete(true);
        }, 2500);
    };

    return (
        <div className="h-[calc(100vh-5rem)] flex flex-col gap-4 pb-2 max-w-[1600px] mx-auto overflow-hidden">
            {/* Command Center Header */}
            <div className="flex-none flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-1"
                >
                    <div className="flex items-center gap-2 text-emerald-500 font-medium text-xs tracking-wider uppercase">
                        <Activity className="w-3 h-3" />
                        <span>Metrics Command Center</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white uppercase leading-none">
                        Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Metrics</span>
                    </h1>
                </motion.div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={runAnalysis}
                        disabled={isAnalyzing}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                    >
                        {isAnalyzing ? (
                            <>
                                <Cpu className="w-3 h-3 animate-spin" />
                                Processing Neural Data...
                            </>
                        ) : (
                            <>
                                <Zap className="w-3 h-3" />
                                Run Full Audit
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 pb-2 overflow-y-auto custom-scrollbar">

                {/* Left Column: Flow Analysis & Mental Battery (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-4">

                    {/* Top Row: Chart & Battery */}
                    <div className="flex-none grid grid-cols-1 md:grid-cols-3 gap-4 h-80">
                        {/* Area Chart (2/3 width) */}
                        <div className="md:col-span-2 bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden flex flex-col">
                            {/* Scanline Background */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(16,185,129,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-emerald-500" />
                                    <h3 className="text-sm font-mono font-bold text-emerald-100 uppercase tracking-wider">Temporal Flow Analysis</h3>
                                </div>
                                <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
                                    {['focus', 'energy', 'load'].map((metric) => (
                                        <button
                                            key={metric}
                                            onClick={() => setSelectedMetric(metric)}
                                            className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${selectedMetric === metric
                                                    ? 'bg-emerald-500 text-black shadow-lg'
                                                    : 'text-emerald-500/40 hover:text-emerald-500'
                                                }`}
                                        >
                                            {metric}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 w-full min-h-0 relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={PRODUCTIVITY_DATA}>
                                        <defs>
                                            <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#10b981" strokeOpacity={0.1} vertical={false} />
                                        <XAxis dataKey="time" stroke="#ecfdf5" strokeOpacity={0.2} tick={{ fill: '#6ee7b7', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#ecfdf5" strokeOpacity={0.2} tick={{ fill: '#6ee7b7', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#022c22', borderColor: '#059669', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                            itemStyle={{ color: '#10b981', fontFamily: 'monospace', fontSize: '12px' }}
                                            labelStyle={{ color: '#6ee7b7', fontFamily: 'monospace', fontSize: '12px', marginBottom: '4px' }}
                                        />
                                        <Area type="monotone" dataKey={selectedMetric} stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorFocus)" animationDuration={1500} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Mental Battery (1/3 width) */}
                        <div className="md:col-span-1 bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-between">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]" />

                            <div className="flex items-center gap-2 w-full relative z-10">
                                <Battery className="w-4 h-4 text-emerald-500" />
                                <h3 className="text-sm font-mono font-bold text-emerald-100 uppercase tracking-wider">Neural Fuel</h3>
                            </div>

                            <div className="relative z-10 flex flex-col items-center">
                                <motion.div
                                    className="text-6xl font-black text-emerald-500 tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 1 }}
                                >
                                    {batteryLevel}%
                                </motion.div>
                                <div className="text-[10px] font-mono text-emerald-500/60 uppercase tracking-widest mt-1">Capacity Remaining</div>
                            </div>

                            <div className="w-full space-y-2 relative z-10">
                                <div className="flex justify-between text-[10px] font-mono text-emerald-500/50">
                                    <span>DRAIN RATE</span>
                                    <span>-4%/HR</span>
                                </div>
                                <div className="h-1.5 w-full bg-emerald-950/50 rounded-full overflow-hidden border border-emerald-500/10">
                                    <div className="h-full bg-emerald-500 w-[78%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                                </div>
                                <div className="text-[9px] text-center text-emerald-500/40 font-mono pt-2">
                                    EST. DEPLETION: 18:45
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Smart Scheduler & Correlations */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[240px]">

                        {/* Smart Scheduler */}
                        <div className="bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-5 overflow-hidden flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="w-4 h-4 text-emerald-500" />
                                <h3 className="text-sm font-mono font-bold text-emerald-100 uppercase tracking-wider">Smart Flow Scheduler</h3>
                            </div>
                            <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 flex-1">
                                {TASKS.map(task => (
                                    <div key={task.id} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-colors group">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase tracking-wider border border-emerald-500/10">{task.type}</span>
                                            <span className="text-[10px] font-mono text-muted-foreground">{task.duration}</span>
                                        </div>
                                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{task.title}</h4>
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${task.energy === 'High' ? 'bg-red-500' : task.energy === 'Med' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                                            <span className="text-[10px] text-muted-foreground uppercase">{task.energy} Energy Req.</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="p-3 border border-dashed border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500/50 text-xs font-mono uppercase tracking-widest hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/50 transition-all cursor-pointer">
                                    + Add Task to Queue
                                </div>
                            </div>
                        </div>

                        {/* Neural Correlation Engine */}
                        <div className="bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-5 overflow-hidden flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                                <LinkIcon className="w-4 h-4 text-emerald-500" />
                                <h3 className="text-sm font-mono font-bold text-emerald-100 uppercase tracking-wider">Neural Correlation Engine</h3>
                            </div>

                            <div className="flex-1 flex flex-col justify-center space-y-4">
                                <AnimatePresence mode="wait">
                                    {isAnalyzing ? (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                                            <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin mx-auto mb-3" />
                                            <p className="text-[10px] font-mono text-emerald-500/60 animate-pulse">CORRELATING DATASETS...</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                                            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-2 opacity-20">
                                                    <TrendingUp className="w-16 h-16 text-emerald-500" />
                                                </div>
                                                <div className="relative z-10">
                                                    <div className="text-[10px] font-mono text-emerald-500/60 uppercase tracking-widest mb-1">Impact Detected</div>
                                                    <div className="text-2xl font-bold text-white mb-2">+22% <span className="text-sm font-normal text-emerald-400">Focus Duration</span></div>
                                                    <p className="text-xs text-emerald-100/70 leading-relaxed">
                                                        Deep Work durability increases significantly on days you use <span className="text-emerald-400 font-bold">Focus Stream</span> before 10 AM.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 relative overflow-hidden">
                                                <div className="relative z-10">
                                                    <div className="text-[10px] font-mono text-blue-500/60 uppercase tracking-widest mb-1">Pattern Identity</div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-lg font-bold text-white">Code & Lo-Fi</span>
                                                        <ArrowRight className="w-4 h-4 text-blue-500" />
                                                        <span className="text-lg font-bold text-blue-400">Flow State</span>
                                                    </div>
                                                    <p className="text-xs text-blue-100/70 leading-relaxed">
                                                        92% probability of entering Flow when journaling for 5m before coding.
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Column: State Distribution & AI Protocols (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-4">

                    {/* Pattern Distribution */}
                    <div className="flex-none h-64 bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-4">
                            <Layers className="w-4 h-4 text-emerald-500" />
                            <h3 className="text-xs font-mono font-bold text-emerald-100 uppercase tracking-wider">Cognitive State Distribution</h3>
                        </div>

                        <div className="h-44 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={COGNITIVE_PATTERNS} layout="vertical" margin={{ left: 0 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#6ee7b7', fontSize: 9, fontFamily: 'monospace' }} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: '#064e3b', opacity: 0.2 }} contentStyle={{ backgroundColor: '#022c22', borderColor: '#059669', borderRadius: '8px' }} itemStyle={{ color: '#10b981', fontSize: '12px' }} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                                        {COGNITIVE_PATTERNS.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* AI Insights & Resilience */}
                    <div className="flex-1 bg-gradient-to-br from-emerald-950/30 to-black/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <Brain className="w-4 h-4 text-emerald-500" />
                            <h3 className="text-xs font-mono font-bold text-emerald-100 uppercase tracking-wider">AI Optimization Protocols</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                            <AnimatePresence mode="wait">
                                {isAnalyzing ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center space-y-3">
                                        <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
                                        <p className="text-[10px] font-mono text-emerald-500/60 animate-pulse">ANALYZING NEURAL DATA STREAMS...</p>
                                    </motion.div>
                                ) : analysisComplete ? (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">

                                        {/* Resilience Metric */}
                                        <div className="p-3 rounded-xl bg-purple-900/10 border border-purple-500/20 mb-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="text-xs font-bold text-purple-300 uppercase">Resilience Coefficient</h4>
                                                <span className="text-xs font-mono text-purple-400 font-bold">8.4/10</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-purple-950/50 rounded-full overflow-hidden">
                                                <div className="h-full bg-purple-500 w-[84%] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)]" />
                                            </div>
                                            <p className="text-[9px] text-purple-200/50 mt-2">
                                                Recovery time from stress peaks has improved by <span className="text-purple-400">12%</span> this week.
                                            </p>
                                        </div>

                                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                            <div className="flex items-start gap-3">
                                                <TrendingUp className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                                                <div>
                                                    <h4 className="text-xs font-bold text-emerald-300 uppercase mb-1">Peak Performance Window</h4>
                                                    <p className="text-[10px] text-emerald-100/70 leading-relaxed">
                                                        Your cognitive load is optimal between <span className="text-emerald-400 font-bold">09:00 - 11:30</span>. Schedule high-complexity tasks during this interval.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-1 shrink-0" />
                                                <div>
                                                    <h4 className="text-xs font-bold text-yellow-500 uppercase mb-1">Fatigue Warning</h4>
                                                    <p className="text-[10px] text-yellow-100/70 leading-relaxed">
                                                        Consistent energy dip detected at <span className="text-yellow-400 font-bold">14:00</span>. Recommend specific NSDR protocols.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                        <Database className="w-8 h-8 text-emerald-500 mb-2" />
                                        <p className="text-[10px] font-mono text-emerald-100">AWAITING DATA INPUT...</p>
                                        <p className="text-[9px] text-emerald-500/50 mt-1">Press 'Run Full Audit' to initialize</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NeuralMetricsPage;
