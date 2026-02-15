'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Target,
    Radio,
    CheckCircle2,
    TrendingUp,
    Share2,
    Users,
    Globe
} from 'lucide-react';

const CHALLENGES = [
    { id: 1, title: 'Alpha Wave Protocol', desc: 'Log 20m of continuous Focus Stream', xp: 50, completed: false },
    { id: 2, title: 'Reframing Mastery', desc: 'Complete 3 Cognitive Reframes', xp: 30, completed: true },
    { id: 3, title: 'Neural Rest', desc: 'Take a 15m NSDR breach', xp: 20, completed: false },
];

const FEED_ITEMS = [
    { id: 1, user: 'Neural_Architect', action: 'unlocked', target: 'Deep Flow III', time: '2m ago' },
    { id: 2, user: 'Mind_Surfer', action: 'completed', target: 'Alpha Wave Protocol', time: '5m ago' },
    { id: 3, user: 'Synapse_Builder', action: 'achieved', target: '7 Day Streak', time: '12m ago' },
];

const InsightStream = () => {
    const [challenges, setChallenges] = useState(CHALLENGES);

    const toggleChallenge = (id: number) => {
        setChallenges(prev => prev.map(c =>
            c.id === id ? { ...c, completed: !c.completed } : c
        ));
    };

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Daily Protocol Card */}
            <div className="bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(16,185,129,0.02)_50%,transparent_75%,transparent_100%)] bg-[size:250%_250%,100%_100%] animate-[shimmer_3s_infinite] pointer-events-none" />

                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-emerald-500" />
                        <h3 className="text-xs font-mono font-bold text-emerald-100 uppercase tracking-wider">Daily Protocol</h3>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-500/50">XP AVAIL: 100</span>
                </div>

                <div className="space-y-3 relative z-10">
                    {challenges.map((challenge) => (
                        <motion.div
                            key={challenge.id}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 group/item ${challenge.completed
                                    ? 'bg-emerald-500/10 border-emerald-500/20'
                                    : 'bg-white/5 border-white/5 hover:border-emerald-500/30'
                                }`}
                            onClick={() => toggleChallenge(challenge.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${challenge.completed
                                    ? 'bg-emerald-500 border-emerald-500'
                                    : 'border-emerald-500/30 group-hover/item:border-emerald-500'
                                }`}>
                                {challenge.completed && <CheckCircle2 className="w-3 h-3 text-black" />}
                            </div>
                            <div className="flex-1">
                                <h4 className={`text-xs font-bold transition-colors ${challenge.completed ? 'text-emerald-400 line-through opacity-70' : 'text-white'
                                    }`}>{challenge.title}</h4>
                                <p className="text-[10px] text-muted-foreground">{challenge.desc}</p>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-500/50">+{challenge.xp}XP</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Neural Hack Card */}
            <div className="bg-gradient-to-br from-indigo-950/30 to-black/40 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-xs font-mono font-bold text-indigo-100 uppercase tracking-wider">Daily Neuro-Hack</h3>
                </div>
                <p className="text-sm font-medium text-indigo-100 italic leading-relaxed">
                    "Pre-visualize your task completion before starting. This primes your dopamine receptors and reduces friction by 40%."
                </p>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-indigo-400/60 uppercase font-mono cursor-pointer hover:text-indigo-400 transition-colors">
                    <Share2 className="w-3 h-3" />
                    Share Insight
                </div>
            </div>

            {/* Global Feed */}
            <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-500" />
                        <h3 className="text-xs font-mono font-bold text-emerald-100 uppercase tracking-wider">Synaptic Sync</h3>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-500/40">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        LIVE
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                    {FEED_ITEMS.map((item) => (
                        <div key={item.id} className="flex gap-3 items-start">
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <Users className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-xs text-white">
                                    <span className="font-bold text-emerald-400">{item.user}</span>
                                    <span className="text-muted-foreground"> has </span>
                                    <span className="text-emerald-500/80">{item.action}</span>
                                    <span className="text-white font-bold block mt-0.5">{item.target}</span>
                                </p>
                                <span className="text-[9px] text-muted-foreground/50">{item.time}</span>
                            </div>
                        </div>
                    ))}
                    {/* Simulated infinite scroll fade */}
                    <div className="h-8 bg-gradient-to-b from-transparent to-black/10" />
                </div>
            </div>
        </div>
    );
};

export default InsightStream;
