'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { DreamEntry } from '../../lib/types';
import GlassCard from '../common/GlassCard';
import { BrainCircuit, TrendingUp, Zap } from 'lucide-react';

interface DreamInsightsProps {
    dreams: DreamEntry[];
}

const DreamInsights: React.FC<DreamInsightsProps> = ({ dreams }) => {
    // Mock Data Processing
    const typeData = [
        { name: 'Normal', value: 45, color: '#10b981' },
        { name: 'Lucid', value: 25, color: '#8b5cf6' },
        { name: 'Nightmare', value: 15, color: '#f43f5e' },
        { name: 'Recurring', value: 10, color: '#f59e0b' },
        { name: 'Prophetic', value: 5, color: '#06b6d4' },
    ];

    const lucidityData = [
        { date: 'Mon', level: 2 },
        { date: 'Tue', level: 4 },
        { date: 'Wed', level: 3 },
        { date: 'Thu', level: 7 },
        { date: 'Fri', level: 5 },
        { date: 'Sat', level: 8 },
        { date: 'Sun', level: 9 },
    ];

    const symbols = [
        { text: 'Flying', count: 12, type: 'positive' },
        { text: 'Teeth', count: 8, type: 'negative' },
        { text: 'Ocean', count: 6, type: 'neutral' },
        { text: 'Late', count: 5, type: 'anxious' },
        { text: 'Falling', count: 4, type: 'fear' },
        { text: 'House', count: 4, type: 'self' },
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background/90 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-xl">
                    <p className="font-bold text-sm text-foreground">{payload[0].name}</p>
                    <p className="text-xs text-muted-foreground">
                        {payload[0].value}% of dreams
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Dream Type Distribution */}
                <GlassCard className="min-h-[300px] flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                            <BrainCircuit className="w-5 h-5" />
                        </div>
                        <h3 className="font-black text-lg text-foreground">Dream Types</h3>
                    </div>
                    <div className="flex-1 min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {typeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-3 mt-4">
                            {typeData.map((type) => (
                                <div key={type.name} className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }} />
                                    {type.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </GlassCard>

                {/* Lucidity Trend */}
                <GlassCard className="min-h-[300px] flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <h3 className="font-black text-lg text-foreground">Lucidity Progression</h3>
                    </div>
                    <div className="flex-1 min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lucidityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    hide
                                    domain={[0, 10]}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="level"
                                    stroke="#eab308"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#eab308', strokeWidth: 0 }}
                                    activeDot={{ r: 6, stroke: '#eab308', strokeWidth: 2, fill: '#0f172a' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
            </div>

            {/* Symbol Decoder / Constellation Placeholder */}
            <GlassCard>
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-lg text-foreground">Symbol Decoder</h3>
                </div>

                <div className="flex flex-wrap gap-3">
                    {symbols.map((symbol, idx) => (
                        <motion.div
                            key={symbol.text}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative group cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative px-4 py-2 bg-secondary/50 border border-white/5 rounded-xl flex items-center gap-2 group-hover:border-indigo-500/30 transition-colors">
                                <span className="text-sm font-bold text-foreground">{symbol.text}</span>
                                <span className="text-xs font-bold text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded-md">
                                    {symbol.count}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};

export default DreamInsights;
