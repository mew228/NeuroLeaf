'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trees, CloudRain, Sun, Wind, Droplets, Leaf } from 'lucide-react';
import dynamic from 'next/dynamic';

const InsightOrb = dynamic(() => import('../../components/features/InsightOrb'), { ssr: false });

const ForestPage = () => {
    const growthStats = [
        { label: 'Mindfulness', value: 78, icon: Sun, color: 'text-amber-500' },
        { label: 'Reflection', value: 92, icon: CloudRain, color: 'text-blue-500' },
        { label: 'Clarity', value: 65, icon: Wind, color: 'text-emerald-500' },
        { label: 'Emotional Balance', value: 88, icon: Droplets, color: 'text-teal-500' },
    ];

    return (
        <div className="space-y-8 pb-24 h-full flex flex-col">
            {/* Header */}
            <div>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground">
                    Neural Forest
                </h1>
                <p className="text-muted-foreground mt-2 max-w-xl">
                    Your cognitive growth visualized. Each tree represents a milestone in your journey towards mental clarity.
                </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
                {/* Visualizer Area (8 cols) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-8 relative glass rounded-[2.5rem] overflow-hidden min-h-[500px] border border-emerald-500/10 group"
                >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 to-emerald-950/40" />

                    {/* Central Tree / Orb */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative z-10">
                            <div className="w-32 h-32 md:w-48 md:h-48 bg-emerald-500 rounded-[3rem] flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                                <Trees className="text-white w-16 h-16 md:w-24 md:h-24" />
                            </div>
                        </div>
                    </div>

                    {/* Floating Elements (Mock Trees) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute bottom-10 left-10 flex flex-col items-center gap-2"
                    >
                        <Trees className="w-12 h-12 text-emerald-600/60" />
                        <span className="text-[10px] uppercase font-bold text-emerald-500/40 tracking-widest">Base Layer</span>
                    </motion.div>

                </motion.div>

                {/* Stats Panel (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Ecosystem Health */}
                    <div className="glass p-6 rounded-[2rem] border border-emerald-500/10">
                        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Ecosystem Health</h3>
                        <div className="space-y-4">
                            {growthStats.map((stat, i) => (
                                <div key={stat.label} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <div className="flex items-center gap-2 text-foreground">
                                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                            {stat.label}
                                        </div>
                                        <span className="text-muted-foreground">{stat.value}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-emerald-500/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.value}%` }}
                                            transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                            className={`h-full rounded-full ${stat.color.replace('text', 'bg')}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Growth Insight */}
                    <div className="glass p-6 rounded-[2rem] border border-emerald-500/10 bg-emerald-500/5">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                                <Trees className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground">Deep Roots</h4>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                    Your consistent evening reflections are strengthening your emotional resilience. Keep watering your mind.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForestPage;
