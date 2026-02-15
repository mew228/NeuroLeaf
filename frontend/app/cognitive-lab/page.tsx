'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Zap, Activity } from 'lucide-react';
import dynamic from 'next/dynamic';

const ReframingTool = dynamic(() => import('../../components/features/cognitive/ReframingTool'), { ssr: false });
const FocusStream = dynamic(() => import('../../components/features/cognitive/FocusStream'), { ssr: false });

const CognitiveLabPage = () => {
    return (
        <div className="h-[calc(100vh-5rem)] flex flex-col gap-4 pb-2 max-w-[1600px] mx-auto overflow-hidden">
            {/* Tech Header - Compact */}
            <div className="flex-none flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-1"
                >
                    <div className="flex items-center gap-2 text-emerald-500 font-medium text-xs tracking-wider uppercase">
                        <Activity className="w-3 h-3" />
                        <span>System Status: Online</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white uppercase leading-none">
                        Cognitive <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Lab</span>
                    </h1>
                    <p className="text-muted-foreground/60 text-xs max-w-lg leading-relaxed">
                        Accessing Neural Optimization Protocols...
                    </p>
                </motion.div>

                <div className="flex gap-3">
                    <div className="px-3 py-1 bg-emerald-950/30 border border-emerald-500/10 rounded-lg text-[9px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                        <Zap className="w-3 h-3" />
                        V2.4 Stable
                    </div>
                </div>
            </div>

            {/* Main Console Grid - Auto-fit */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 pb-2">
                {/* Left Column: Reframing Terminal (7 cols) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-7 flex flex-col min-h-0 relative"
                >
                    <div className="absolute inset-0">
                        <ReframingTool />
                    </div>
                </motion.div>

                {/* Right Column: Focus & Stats (5 cols) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-5 flex flex-col gap-4 min-h-0"
                >
                    <div className="flex-1 min-h-0 relative">
                        <div className="absolute inset-0">
                            <FocusStream />
                        </div>
                    </div>

                    {/* Data Card - Compact */}
                    <div className="flex-none h-40 bg-black/40 backdrop-blur-xl border border-white/5 hover:border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden group shadow-lg transition-colors">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(16,185,129,0.02)_50%,transparent_75%,transparent_100%)] bg-[size:250%_250%,100%_100%] animate-[shimmer_3s_infinite]" />

                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-[9px] uppercase tracking-widest">
                                        <Sparkles className="w-3 h-3" />
                                        Neural State
                                    </div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">Neuroplasticity</h3>
                                </div>
                                <div className="text-right">
                                    <div className="text-[9px] font-bold text-muted-foreground/40 uppercase">Optimized</div>
                                    <div className="text-2xl font-bold text-emerald-400">94%</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-3">
                                <div>
                                    <div className="text-[9px] font-bold text-muted-foreground/50 uppercase mb-1">Focus</div>
                                    <div className="h-1 w-full bg-emerald-950 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[85%]" />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[9px] font-bold text-muted-foreground/50 uppercase mb-1">Calm</div>
                                    <div className="h-1 w-full bg-emerald-950 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[92%]" />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[9px] font-bold text-muted-foreground/50 uppercase mb-1">Clarity</div>
                                    <div className="h-1 w-full bg-emerald-950 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[78%]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CognitiveLabPage;
