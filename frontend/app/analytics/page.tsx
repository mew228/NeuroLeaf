'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Info,
    Sparkles
} from 'lucide-react';
import api from '../../lib/api';
import { MoodEntry } from '../../lib/types';
import dynamic from 'next/dynamic';

const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(m => m.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(m => m.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });

const AnalyticsPage = () => {
    const [data, setData] = useState<MoodEntry[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/mood/history?limit=30').catch(() => ({ data: { entries: [] } }));
                const entries = res.data?.entries || [];
                setData([...entries].reverse());
            } catch (err) {
                console.error('Failed to fetch mood history', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const formatXAxis = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: { value: number }[], label?: string }) => {
        if (active && payload && payload.length && label) {
            return (
                <div className="glass p-4 border border-white/20 shadow-2xl rounded-2xl">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{formatXAxis(label)}</p>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        Neural Index: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-10 pb-24 lg:pb-0">
            {/* Atmospheric Header */}
            <div className="px-2">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-foreground">
                        Emotional <br />
                        <span className="text-gradient">Landscape.</span>
                    </h1>
                    <p className="text-lg text-muted-foreground mt-4 font-medium max-w-lg">
                        Visualizing your progress over the last 30 days.
                    </p>
                </motion.div>
            </div>

            {/* Main Chart Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 md:p-10 rounded-3xl premium-shadow relative overflow-hidden"
            >
                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center dark:bg-emerald-500/10 dark:text-emerald-400">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-foreground tracking-tight">Mood Timeline</h3>
                        <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mt-0.5">Neural Pattern Analysis</p>
                    </div>
                </div>

                <div className="h-[350px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                            <XAxis
                                dataKey="created_at"
                                tickFormatter={formatXAxis}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                dy={10}
                            />
                            <YAxis
                                hide
                                domain={[0, 10]}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Area
                                type="monotone"
                                dataKey="mood_score"
                                stroke="#10b981"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorMood)"
                                animationDuration={1000}
                                activeDot={{ r: 6, fill: '#10b981', strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Insight Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                    whileHover={{ y: -2 }}
                    className="glass-card p-8 rounded-3xl border-l-4 border-l-emerald-500 premium-shadow flex items-start gap-6"
                >
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0">
                        <Sparkles className="w-7 h-7" />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Primary Observation</h4>
                        <p className="text-base font-bold text-foreground leading-snug italic tracking-tight">
                            &quot;Your mood patterns correlate strongly with regular sessions. Continuity is key to stability.&quot;
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -2 }}
                    className="glass-card p-8 rounded-3xl border-l-4 border-l-teal-500 premium-shadow flex items-start gap-6"
                >
                    <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center dark:bg-teal-500/10 dark:text-teal-400 shrink-0">
                        <Info className="w-7 h-7" />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-teal-600 mb-2">Growth Metric</h4>
                        <p className="text-base font-bold text-foreground leading-snug italic tracking-tight">
                            &quot;Significant resilience detected in the face of minor stressors during your latest neural syncs.&quot;
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
