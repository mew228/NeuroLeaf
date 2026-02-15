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
    ArrowUpRight,
    BarChart,
    Activity
} from 'lucide-react';
import Link from 'next/link';
import api from '../../lib/api';
import { MoodEntry, JournalEntry } from '../../lib/types';
import { formatDate } from '../../lib/utils';
import dynamic from 'next/dynamic';

const InsightOrb = dynamic(() => import('../../components/features/InsightOrb'), { ssr: false });
const EmotionChart = dynamic(() => import('../../components/features/EmotionChart'), {
    ssr: false,
    loading: () => <div className="animate-pulse bg-emerald-500/5 w-full h-full rounded-xl" />
});

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

    const [greeting, setGreeting] = useState('Good day');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    // Force refresh dashboard data on mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Add timestamp to prevent caching
                const [moodRes, journalRes] = await Promise.all([
                    api.get(`/mood/history?t=${Date.now()}`).catch(() => ({ data: { entries: [], summary: { avg_mood: 0, trend: 'stable' } } })),
                    api.get(`/journal/entries?limit=3&t=${Date.now()}`).catch(() => ({ data: { entries: [], total: 0 } }))
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

    // Skeleton Component
    const Skeleton = ({ className }: { className: string }) => (
        <div className={`animate-pulse bg-emerald-500/10 rounded-2xl ${className}`} />
    );

    if (loading) {
        return (
            <div className="space-y-8 pb-24 max-w-[1600px] mx-auto">
                <div className="space-y-4 max-w-2xl w-full">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-3/4" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    <Skeleton className="md:col-span-4 h-[240px]" />
                    <Skeleton className="md:col-span-5 h-[240px]" />
                    <div className="md:col-span-3 h-full flex flex-col gap-6">
                        <Skeleton className="flex-1 h-[110px]" />
                        <Skeleton className="flex-1 h-[110px]" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-5rem)] flex flex-col gap-3 pb-2 max-w-[1600px] mx-auto overflow-hidden">
            {/* Header Section - Compact */}
            <div className="flex-none flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-white/5 pb-2">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-0.5"
                >
                    <div className="flex items-center gap-2 text-emerald-500 font-medium text-xs tracking-wider uppercase">
                        <Sparkles className="w-3 h-3" />
                        <span>NeuraLink ID: {user?.id?.slice(0, 8) || 'GUEST'}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white uppercase leading-none">
                        Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">{firstName}.</span>
                    </h1>
                    <p className="text-muted-foreground/60 text-xs max-w-lg leading-relaxed">
                        System Optimal. Ready for Input.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link
                        href="/journal"
                        className="group relative px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs tracking-wider uppercase rounded-lg transition-all overflow-hidden flex items-center gap-2"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <PlusCircle className="w-3 h-3 relative z-10" />
                        <span className="relative z-10">New Log</span>
                    </Link>
                </motion.div>
            </div>

            {/* Main Console Grid - Auto-fit Layout */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="flex-1 grid grid-cols-1 md:grid-cols-12 grid-rows-[minmax(0,1fr)_minmax(0,1.2fr)] gap-3 min-h-0"
            >
                {/* Row 1 */}

                {/* 1. Current State Module (4 cols) */}
                <motion.div variants={item} className="md:col-span-4 h-full relative">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/5 hover:border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between transition-colors shadow-lg">
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                            <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest">
                                Current State
                            </span>
                            <Activity className="w-3 h-3 text-emerald-500/40" />
                        </div>

                        <div className="flex-1 flex flex-col justify-center py-2">
                            <div className="text-5xl mb-2 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                                {stats.latestMood?.mood_emoji || '🌱'}
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-tight uppercase">
                                {stats.latestMood?.mood_label || 'Awaiting Input'}
                            </h3>
                            <div className="mt-1 flex items-center gap-2 text-muted-foreground/50 text-[10px]">
                                <Calendar className="w-3 h-3" />
                                {stats.latestMood ? formatDate(stats.latestMood.entry_date) : 'No Data Found'}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Neural Insight Cache (5 cols) */}
                <motion.div variants={item} className="md:col-span-5 h-full relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-black/40 backdrop-blur-xl border border-white/5 hover:border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between transition-colors shadow-lg overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <InsightOrb intensity="medium" size="sm" />
                        </div>

                        <div className="flex flex-col h-full justify-between relative z-10">
                            <div>
                                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/10 text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-4">
                                    <Sparkles className="w-3 h-3" />
                                    Daily Insight
                                </div>
                                <p className="text-base font-medium leading-relaxed text-emerald-100/90 border-l-2 border-emerald-500/30 pl-3 py-1">
                                    &quot;In the silence between thoughts, we find our true resonance.&quot;
                                </p>
                            </div>

                            <Link href="/journal" className="flex items-center gap-2 group/link w-max text-[10px] font-bold uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors">
                                Access Cache
                                <span className="animate-pulse">_</span>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* 3. Metrics (3 cols, split vertical) */}
                <motion.div variants={item} className="md:col-span-3 h-full flex flex-col gap-3">
                    <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/5 hover:border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-center relative shadow-lg transition-colors">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">Streak</span>
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                        </div>
                        <div className="text-3xl font-bold text-white tracking-tighter">
                            {stats.journalCount > 0 ? Math.min(stats.journalCount, 365) : 0}
                            <span className="text-sm text-muted-foreground/40 ml-1">d</span>
                        </div>
                    </div>

                    <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/5 hover:border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-center relative shadow-lg transition-colors">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">Logs</span>
                            <BookOpen className="w-3 h-3 text-emerald-500" />
                        </div>
                        <div className="text-3xl font-bold text-white tracking-tighter">
                            {stats.journalCount}
                        </div>
                    </div>
                </motion.div>

                {/* Row 2 */}

                {/* 4. Frequency Analysis Chart (8 cols) */}
                <motion.div variants={item} className="md:col-span-8 h-full relative">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/5 hover:border-emerald-500/20 rounded-2xl p-4 flex flex-col shadow-lg transition-colors overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 border border-emerald-500/10">
                                    <BarChart className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold tracking-tight text-white uppercase">Emotional Distribution</h3>
                                    <p className="text-[9px] font-medium text-emerald-500/50 uppercase tracking-widest">Frequency Analysis</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full min-h-0 relative z-10">
                            <EmotionChart data={stats.emotionData} />
                        </div>
                    </div>
                </motion.div>

                {/* 5. Data Logs (4 cols) */}
                <motion.div variants={item} className="md:col-span-4 h-full relative">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/5 hover:border-emerald-500/20 rounded-2xl p-4 shadow-lg flex flex-col transition-colors">
                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                            <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest">Recent Logs</span>
                            <Link href="/journal" className="p-1 hover:bg-emerald-500/10 rounded text-emerald-500 transition-colors">
                                <ArrowUpRight className="w-3 h-3" />
                            </Link>
                        </div>

                        <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar pr-2">
                            {stats.recentJournals.length > 0 ? (
                                stats.recentJournals.map((journal) => (
                                    <Link
                                        href={`/journal/${journal.id}`}
                                        key={journal.id}
                                        className="block group"
                                    >
                                        <div className="bg-emerald-950/5 hover:bg-emerald-950/20 border border-white/5 hover:border-emerald-500/30 p-3 rounded-xl transition-all">
                                            <div className="flex items-start justify-between mb-1">
                                                <div className="bg-emerald-500/5 px-2 py-0.5 rounded text-[9px] font-medium text-emerald-500/80">
                                                    {formatDate(journal.entry_date)}
                                                </div>
                                                {journal.has_analysis && <Sparkles className="w-3 h-3 text-emerald-500" />}
                                            </div>
                                            <h4 className="font-medium text-xs text-emerald-100/90 group-hover:text-emerald-400 transition-colors line-clamp-1 truncate">
                                                {journal.title || 'Untitled Entry'}
                                            </h4>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center gap-3 text-center opacity-40">
                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50">
                                        <MessageSquare className="w-4 h-4" />
                                    </div>
                                    <span className="text-[9px] font-medium text-white/50">NO_ENTRIES_FOUND</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
