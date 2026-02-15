'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Leaf, Sparkles } from 'lucide-react';

const NeuralTree = dynamic(() => import('../../components/features/growth/NeuralTree'), { ssr: false });
const InsightStream = dynamic(() => import('../../components/features/growth/InsightStream'), { ssr: false });

const GrowthPage = () => {
    return (
        <div className="h-[calc(100vh-5rem)] flex flex-col gap-4 pb-2 max-w-[1600px] mx-auto overflow-hidden">
            {/* Header */}
            <div className="flex-none flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-1"
                >
                    <div className="flex items-center gap-2 text-emerald-500 font-medium text-xs tracking-wider uppercase">
                        <Leaf className="w-3 h-3" />
                        <span>Growth Protocols Active</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white uppercase leading-none">
                        Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Evolution</span>
                    </h1>
                    <p className="text-muted-foreground/60 text-xs max-w-lg leading-relaxed">
                        Visualize your cognitive expansion. Complete protocols to unlock neural pathways.
                    </p>
                </motion.div>

                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Level 12</span>
                    </div>
                    <div className="text-right">
                        <div className="text-[9px] font-bold text-muted-foreground/40 uppercase">Next Node</div>
                        <div className="text-xs font-bold text-white">Clarity <span className="text-emerald-500">82%</span></div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 pb-2">
                {/* Left: Neural Evolution Tree (8 cols) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:col-span-8 h-full min-h-0 relative"
                >
                    <NeuralTree />
                </motion.div>

                {/* Right: Insight Stream (4 cols) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="lg:col-span-4 h-full min-h-0"
                >
                    <InsightStream />
                </motion.div>
            </div>
        </div>
    );
};

export default GrowthPage;
