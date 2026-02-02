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
    BookOpen
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
                delayChildren: 0.2
            }
        }
    };

    const item: Variants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 100, damping: 15 }
        }
    };

    const firstName = user?.full_name?.split(' ')?.[0] || 'there';


    // Custom Tooltip for Chart
    const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: { value: number }[], label?: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 dark:bg-emerald-950/90 backdrop-blur-md p-4 rounded-2xl border border-border shadow-xl">
                    <p className="font-black text-sm mb-1">{label}</p>
                    <p className="text-emerald-600 font-bold text-xs">
                        {payload[0].value} Entries
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="space-y-10 pb-24 md:pb-0 animate-pulse">
                <div className="h-20 w-3/4 bg-white/5 rounded-3xl mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="h-40 bg-white/5 rounded-3xl" />
                    <div className="h-40 bg-white/5 rounded-3xl" />
                    <div className="h-40 bg-white/5 rounded-3xl" />
                </div>
                <div className="h-64 bg-white/5 rounded-[2.5rem]" />
                <div className="space-y-4">
                    <div className="h-10 w-48 bg-white/5 rounded-full" />
                    <div className="h-24 bg-white/5 rounded-[2rem]" />
                    <div className="h-24 bg-white/5 rounded-[2rem]" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-24 md:pb-0">
            {/* ... (Hero Section) ... */}
            <div className="relative pt-2">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
                        Good day, <br />
                        <span className="text-gradient"> {firstName}.</span>
                    </h1>
                    <p className="text-lg text-muted-foreground mt-4 font-medium max-w-lg">
                        Let&apos;s explore your journey today.
                    </p>
                </motion.div>

                <div className="absolute top-0 right-0 hidden lg:block">
                    <Link
                        href="/journal"
                        className="group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Create New Entry
                    </Link>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {/* Latest Mood */}
                <motion.div variants={item} className="glass-card gpu-accelerated p-6 rounded-3xl premium-shadow group border-l-4 border-l-emerald-500">
                    {/* ... (Same Content) ... */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center dark:bg-emerald-500/10 dark:text-emerald-400">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Latest State</span>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">{stats.latestMood?.mood_emoji || '—'}</span>
                            <span className="text-2xl font-black text-foreground capitalize tracking-tight">
                                {stats.latestMood?.mood_label || 'Quiescent'}
                            </span>
                        </div>
                        <p className="text-muted-foreground font-bold text-[11px] tracking-tight flex items-center gap-2">
                            <Calendar className="w-3 h-3 opacity-50" />
                            {stats.latestMood ? formatDate(stats.latestMood.entry_date) : 'Start tracking today'}
                        </p>
                    </div>
                </motion.div>

                {/* Journal Counts */}
                <motion.div variants={item} className="glass-card gpu-accelerated p-6 rounded-3xl premium-shadow border-l-4 border-l-teal-500">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center dark:bg-teal-500/10 dark:text-teal-400">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Activity Log</span>
                    </div>

                    <div className="space-y-2">
                        <p className="text-4xl font-black text-foreground tracking-tighter">{stats.journalCount}</p>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden max-w-[100px]">
                                <div className="h-full bg-teal-500 w-1/3" />
                            </div>
                            <span className="text-[10px] font-black text-teal-600 uppercase">Streak: Active</span>
                        </div>
                    </div>
                </motion.div>

                {/* AI Signature Card with Insight Orb */}
                <motion.div
                    variants={item}
                    className="p-6 gpu-accelerated rounded-3xl text-white relative overflow-hidden group premium-shadow md:col-span-2 lg:col-span-1"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700" />
                    <div className="absolute inset-0 opacity-20 mesh-gradient pointer-events-none" />

                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <InsightOrb intensity="high" size="sm" />
                                <span className="font-black text-[10px] uppercase tracking-widest text-emerald-100/80">Neural Pulse</span>
                            </div>
                            <p className="text-lg font-bold leading-tight tracking-tight italic">
                                &quot;Self-reflection is the mirror of the soul&apos;s growth.&quot;
                            </p>
                        </div>

                        <Link href="/journal" className="mt-6 flex items-center gap-2 text-[11px] font-black bg-white/20 hover:bg-white/30 backdrop-blur-md w-max px-4 py-2.5 rounded-xl transition-all">
                            Open Neural Cache <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </motion.div>

                {/* Emotion Distribution Chart - NEW */}
                <motion.div variants={item} className="glass-card p-8 rounded-3xl premium-shadow md:col-span-2 lg:col-span-3">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center dark:bg-emerald-500/10 dark:text-emerald-400">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-foreground tracking-tight">Emotional Distribution</h3>
                            <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mt-0.5">Frequency Analysis</p>
                        </div>
                    </div>

                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.emotionData}>
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                                    dy={10}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="count" radius={[4, 4, 4, 4]} isAnimationActive={false}>
                                    {stats.emotionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#14b8a6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </motion.div>

            {/* Neural Pulse Breathing Guide */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-8"
            >
                <BreathingGuide />
            </motion.div>

            {/* Recent Reflections Table - Glassmorphic */}
            <motion.div
                variants={item}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                <div className="flex items-end justify-between px-2">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black tracking-tighter text-foreground">Recent Reflections</h2>
                        <div className="h-1.5 w-12 bg-emerald-600 rounded-full" />
                    </div>
                    <Link href="/journal" className="text-emerald-600 font-bold text-sm hover:underline flex items-center gap-1 group">
                        Explore All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {stats.recentJournals && stats.recentJournals.length > 0 ? (
                        stats.recentJournals.map((journal) => (
                            <motion.div
                                key={journal.id}
                                whileHover={{ x: 8 }}
                                className="glass-card p-6 rounded-[2rem] group flex items-center justify-between transition-all"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-emerald-500/5 rounded-[1.5rem] flex items-center justify-center border border-emerald-500/10 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-xl text-foreground tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                            {journal.title || 'Inchoate Entry'}
                                        </h4>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">
                                            {formatDate(journal.entry_date)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {journal.has_analysis && (
                                        <div className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/10">
                                            <Sparkles className="w-3 h-3" />
                                            Analyzed
                                        </div>
                                    )}
                                    <Link href={`/journal/${journal.id}`} className="p-4 bg-secondary group-hover:bg-emerald-600 group-hover:text-white rounded-2xl transition-all shadow-sm">
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="glass-card p-20 rounded-[3rem] text-center border-dashed border-2">
                            <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                <PlusCircle className="w-10 h-10 text-muted-foreground/30" />
                            </div>
                            <p className="text-muted-foreground font-bold text-lg">No neural patterns recorded yet.</p>
                            <Link href="/journal" className="mt-4 text-emerald-600 font-black uppercase text-xs tracking-widest hover:underline block">
                                Initiate First Session
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
