'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
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
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 pb-2">
                {/* Left: Reframing Tool (7 cols) */}
                <div className="lg:col-span-7 h-full min-h-0">
                    <ReframingTool />
                </div>

                {/* Right: Focus Stream (5 cols) */}
                <div className="lg:col-span-5 h-full min-h-0">
                    <FocusStream />
                </div>
            </div>
        </div>
    );
};

export default CognitiveLabPage;
