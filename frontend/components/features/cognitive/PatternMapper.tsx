'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Zap,
    Activity,
    TrendingUp,
    Database,
    Cpu,
    AlertTriangle,
    CheckCircle2,
    BarChart3,
    Clock,
    Layers
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

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

const PatternMapper = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState('focus');

    // Simulate AI Analysis
    const runAnalysis = () => {
        setIsAnalyzing(true);
        setAnalysisComplete(false);
        // Simulate processing time
        setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisComplete(true);
        }, 2000);
    };

    return (
        <div className="w-full h-full flex flex-col gap-4">
            {/* Header / Controls */}
            <div className="flex-none bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <Cpu className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg tracking-tight uppercase">Neural Pattern Mapper</h2>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500/60 uppercase">
                            <Activity className="w-3 h-3" />
                            <span>AI Heuristic Engine: Standby</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={runAnalysis}
                        disabled={isAnalyzing}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                    >
                        {isAnalyzing ? (
                            <>
                                <Cpu className="w-3 h-3 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Zap className="w-3 h-3" />
                                Run Analysis
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">

                {/* Left: Chart Visualization (8 cols) */}
                <div className="lg:col-span-8 flex flex-col bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
                    {/* Scanline Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(16,185,129,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

                    <div className="flex items-center justify-between mb-6 relative z-10">
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

                    <div className="flex-1 min-h-0 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={PRODUCTIVITY_DATA}>
                                <defs>
                                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#10b981" strokeOpacity={0.1} vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    stroke="#ecfdf5"
                                    strokeOpacity={0.2}
                                    tick={{ fill: '#6ee7b7', fontSize: 10, fontFamily: 'monospace' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#ecfdf5"
                                    strokeOpacity={0.2}
                                    tick={{ fill: '#6ee7b7', fontSize: 10, fontFamily: 'monospace' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#022c22',
                                        borderColor: '#059669',
                                        borderRadius: '8px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                                    }}
                                    itemStyle={{ color: '#10b981', fontFamily: 'monospace', fontSize: '12px' }}
                                    labelStyle={{ color: '#6ee7b7', fontFamily: 'monospace', fontSize: '12px', marginBottom: '4px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey={selectedMetric}
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorFocus)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: AI Insights & Patterns (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-4 min-h-0">

                    {/* Pattern Distribution */}
                    <div className="flex-1 bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-4">
                            <Layers className="w-4 h-4 text-emerald-500" />
                            <h3 className="text-xs font-mono font-bold text-emerald-100 uppercase tracking-wider">Cognitive State Distribution</h3>
                        </div>

                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={COGNITIVE_PATTERNS} layout="vertical" margin={{ left: 0 }}>
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={80}
                                        tick={{ fill: '#6ee7b7', fontSize: 9, fontFamily: 'monospace' }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#064e3b', opacity: 0.2 }}
                                        contentStyle={{ backgroundColor: '#022c22', borderColor: '#059669', borderRadius: '8px' }}
                                        itemStyle={{ color: '#10b981', fontSize: '12px' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                                        {COGNITIVE_PATTERNS.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* AI Insights Panel */}
                    <div className="flex-1 bg-gradient-to-br from-emerald-950/30 to-black/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <Brain className="w-4 h-4 text-emerald-500" />
                            <h3 className="text-xs font-mono font-bold text-emerald-100 uppercase tracking-wider">AI Optimization Protocols</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                            <AnimatePresence mode="wait">
                                {isAnalyzing ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col items-center justify-center text-center space-y-3"
                                    >
                                        <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
                                        <p className="text-[10px] font-mono text-emerald-500/60 animate-pulse">ANALYZING NEURAL DATA STREAMS...</p>
                                    </motion.div>
                                ) : analysisComplete ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-3"
                                    >
                                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                            <div className="flex items-start gap-3">
                                                <TrendingUp className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                                                <div>
                                                    <h4 className="text-xs font-bold text-emerald-300 uppercase mb-1">Peak Performance Window</h4>
                                                    <p className="text-[10px] text-emerald-100/70 leading-relaxed">
                                                        Your cognitive load is optimal between <span className="text-emerald-400 font-bold">09:00 - 11:30</span>. Schedule high-complexity tasks during this interval for 25% increased efficiency.
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
                                                        Consistent energy dip detected at <span className="text-yellow-400 font-bold">14:00</span>. Recommend a 15-minute NSDR (Non-Sleep Deep Rest) session to reset neural pathways.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
                                                <div>
                                                    <h4 className="text-xs font-bold text-blue-300 uppercase mb-1">Flow Trigger Identified</h4>
                                                    <p className="text-[10px] text-blue-100/70 leading-relaxed">
                                                        Instrumental music correlates with 85% of your 'Deep Work' sessions. Auto-queueing "Neural Focus Playlist" for next session.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                        <Database className="w-8 h-8 text-emerald-500 mb-2" />
                                        <p className="text-[10px] font-mono text-emerald-100">AWAITING DATA INPUT...</p>
                                        <p className="text-[9px] text-emerald-500/50 mt-1">Press 'Run Analysis' to initialize</p>
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

export default PatternMapper;
