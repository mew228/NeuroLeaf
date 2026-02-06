'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, Variants } from 'framer-motion';
import {
    TrendingUp,
    MessageSquare,
    Calendar,
    ChevronRight,
    PlusCircle,
    Sparkles,
    BookOpen,
    Brain,
    Activity,
    ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import api from '../../lib/api';
import { MoodEntry, JournalEntry } from '../../lib/types';
import { formatDate } from '../../lib/utils';
import dynamic from 'next/dynamic';

const BreathingGuide = dynamic(() => import('../../components/features/BreathingGuide'), { ssr: false });
const InsightOrb = dynamic(() => import('../../components/features/InsightOrb'), { ssr: false });
import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        moodCount: 0,
        journalCount: 0,
        latestMood: null as MoodEntry | null,
        recentJournals: [] as JournalEntry[],
        emotionData: [] as { name: string; count: number }[]
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [moodRes, journalRes] = await Promise.all([
                    api.get('/mood/history').catch(() => ({ data: { entries: [], summary: { avg_mood: 0, trend: 'stable' } } })),
                    api.get('/journal/entries?limit=3').catch(() => ({ data: { entries: [], total: 0 } }))
                ]);

                // Process Emotion Distribution
                const entries = moodRes.data?.entries || [];
                const emotionCounts: Record<string, number> = {};
                if (Array.isArray(entries)) {
                    entries.forEach((entry: MoodEntry) => {
                        const label = entry.mood_label || 'Unknown';
                        emotionCounts[label] = (emotionCounts[label] || 0) + 1;
                    });
                }
                const emotionData = Object.entries(emotionCounts).map(([name, count]) => ({ name, count }));

                setStats({
                    moodCount: entries.length,
                    latestMood: entries[0] || null,
                    journalCount: journalRes.data?.total || 0,
                    recentJournals: journalRes.data?.entries || [],
                    emotionData
                });
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const item: Variants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 100, damping: 20 }
        }
    };

    const firstName = user?.full_name?.split(' ')?.[0] || 'Traveler';

    // Custom Tooltip for Chart
    const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: { value: number }[], label?: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 dark:bg-emerald-950/90 backdrop-blur-md p-4 rounded-xl border border-emerald-500/10 shadow-xl ring-1 ring-emerald-500/10">
                    <p className="font-black text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">{label}</p>
                    <p className="text-foreground font-bold text-lg leading-none">
                        {payload[0].value} <span className="text-xs font-medium text-muted-foreground ml-1">Entries</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-24">
            {/* Header Section */}
            <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-2 max-w-2xl"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2">
                        <Brain className="w-3 h-3" />
                        Cognitive State: Active
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-foreground leading-[0.9]">
                        Good day, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-teal-600"> {firstName}.</span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link
                        href="/journal"
                        className="group flex items-center gap-3 bg-foreground text-background hover:bg-emerald-600 hover:text-white px-8 py-5 rounded-[2rem] font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-900/5 hover:shadow-emerald-500/20"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span>Log Session</span>
                    </Link>
                </motion.div>
            </div>

            {/* Dashboard Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
            >
                {/* 1. Latest State - Large Card (4 cols) */}
                <motion.div variants={item} className="md:col-span-4 h-full">
                    <div className="glass h-full p-8 rounded-[2.5rem] relative overflow-hidden group hover:bg-emerald-500/5 transition-colors border border-emerald-500/10">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-emerald-500/20" />

                        <div className="flex flex-col h-full justify-between gap-8 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center shadow-sm border border-emerald-500/10">
                                    <Activity className="w-6 h-6 text-emerald-500" />
                                </div>
                                <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Current State</span>
                            </div>

                            <div>
                                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform origin-left duration-300">
                                    {stats.latestMood?.mood_emoji || '🌱'}
                                </div>
                                <h3 className="text-2xl font-black tracking-tight text-foreground capitalize mb-1">
                                    {stats.latestMood?.mood_label || 'Awaiting Input'}
                                </h3>
                                <p className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    {stats.latestMood ? formatDate(stats.latestMood.entry_date) : 'Start your first session today'}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Neural Pulse / Insight - Featured Card (5 cols) */}
                <motion.div variants={item} className="md:col-span-5 h-full">
                    <div className="h-full bg-gradient-to-br from-emerald-600 to-teal-800 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-emerald-900/20 group">
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                        <div className="absolute top-0 right-0 p-8 opacity-50 group-hover:opacity-100 transition-opacity">
                            <InsightOrb intensity="high" size="sm" />
                        </div>

                        <div className="flex flex-col h-full justify-between relative z-10">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest mb-6">
                                    <Sparkles className="w-3 h-3" />
                                    Daily Insight
                                </div>
                                <p className="text-xl md:text-2xl font-bold leading-tight tracking-tight italic text-emerald-50 mb-6">
                                    &quot;In the silence between thoughts, we find our true resonance.&quot;
                                </p>
                            </div>

                            <Link href="/journal" className="flex items-center gap-2 group/link w-max text-xs font-black uppercase tracking-widest hover:text-emerald-200 transition-colors">
                                Open Neural Cache
                                <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* 3. Quick Stats / Streak (3 cols) */}
                <motion.div variants={item} className="md:col-span-3 h-full flex flex-col gap-6">
                    <div className="glass p-6 rounded-[2rem] flex-1 flex flex-col justify-center gap-2 hover:bg-emerald-500/5 transition-colors border border-emerald-500/10">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Streak</span>
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="text-4xl font-black tracking-tighter text-foreground">
                            {stats.journalCount > 0 ? Math.min(stats.journalCount, 365) : 0}
                            <span className="text-lg text-muted-foreground ml-1">d</span>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-[2rem] flex-1 flex flex-col justify-center gap-2 hover:bg-teal-500/5 transition-colors border border-teal-500/10">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Entries</span>
                            <BookOpen className="w-4 h-4 text-teal-500" />
                        </div>
                        <div className="text-4xl font-black tracking-tighter text-foreground">
                            {stats.journalCount}
                        </div>
                    </div>
                </motion.div>

                {/* 4. Emotional Distribution Chart (8 cols) */}
                <motion.div variants={item} className="md:col-span-8">
                    <div className="glass p-8 rounded-[2.5rem] border border-emerald-500/10 h-[300px] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                    <BarChart className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black tracking-tight text-foreground">Emotional Distribution</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Frequency Analysis</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.emotionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis
                                        dataKey="name"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600, fontFamily: 'var(--font-inter)' }}
                                        dy={15}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="count" radius={[6, 6, 6, 6]} barSize={40}>
                                        {stats.emotionData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={index % 2 === 0 ? '#10b981' : '#0d9488'}
                                                className="transition-all hover:opacity-80 cursor-pointer"
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </motion.div>

                {/* 5. Recent Activity List (4 cols) */}
                <motion.div variants={item} className="md:col-span-4 h-full">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Recent Logs</span>
                            <Link href="/journal" className="p-2 hover:bg-emerald-500/10 rounded-full text-emerald-500 transition-colors">
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {stats.recentJournals.length > 0 ? (
                            stats.recentJournals.map((journal) => (
                                <Link
                                    href={`/journal/${journal.id}`}
                                    key={journal.id}
                                    className="block group"
                                >
                                    <div className="glass p-5 rounded-[1.5rem] border border-emerald-500/10 transition-all hover:scale-[1.02] hover:bg-emerald-500/5 hover:border-emerald-500/20">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="bg-background rounded-lg px-2 py-1 text-[10px] font-bold text-muted-foreground border border-black/5 dark:border-white/10">
                                                {formatDate(journal.entry_date)}
                                            </div>
                                            {journal.has_analysis && <Sparkles className="w-3 h-3 text-emerald-500" />}
                                        </div>
                                        <h4 className="font-bold text-foreground group-hover:text-emerald-500 transition-colors line-clamp-1">
                                            {journal.title || 'Untitled Entry'}
                                        </h4>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="glass p-8 rounded-[2rem] text-center border-dashed border-2 border-emerald-500/10 flex flex-col items-center justify-center gap-3">
                                <Link href="/journal">
                                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 hover:scale-110 transition-transform cursor-pointer">
                                        <PlusCircle className="w-6 h-6" />
                                    </div>
                                </Link>
                                <span className="text-xs font-medium text-muted-foreground">No entries yet</span>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
