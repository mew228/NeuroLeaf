'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Moon,
    Sparkles,
    BookOpen,
    BarChart3,
    Settings2,
    Plus,
    Mic
} from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import DreamCard from '../../components/features/DreamCard';
import DreamInsights from '../../components/features/DreamInsights';
import DreamEntryModal from '../../components/features/DreamEntryModal';
import LucidToolkit from '../../components/features/LucidToolkit';
import { DreamEntry } from '../../lib/types';
import { cn } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';

// Mock Data
const MOCK_DREAMS: DreamEntry[] = [
    {
        id: '1',
        title: 'Flying Over the Neon City',
        description: 'I was soaring above a futuristic city filled with neon lights. The wind felt incredibly real, and I could control my speed by leaning forward.',
        date: new Date().toISOString(),
        mood: 'Exhilarated',
        clarity: 9,
        lucidityLevel: 8,
        type: 'lucid',
        tags: ['flying', 'city', 'night'],
        symbols: [{ name: 'Flying', meaning: 'Freedom, transcendence' }],
        created_at: new Date().toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=2670'
    },
    {
        id: '2',
        title: 'The Endless Library',
        description: 'Walking through a library with infinite shelves. Every book contained a memory from my childhood. I found one about my first bicycle.',
        date: new Date(Date.now() - 86400000).toISOString(),
        mood: 'Nostalgic',
        clarity: 7,
        lucidityLevel: 3,
        type: 'normal',
        tags: ['books', 'childhood', 'library'],
        symbols: [{ name: 'Library', meaning: 'Knowledge, collective unconscious' }],
        created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: '3',
        title: 'Shadow in the Hallway',
        description: 'A dark figure was following me down a long, stretching hallway. I couldn\'t run fast enough. The walls were breathing.',
        date: new Date(Date.now() - 172800000).toISOString(),
        mood: 'Anxious',
        clarity: 8,
        lucidityLevel: 1,
        type: 'nightmare',
        tags: ['chase', 'darkness', 'fear'],
        symbols: [{ name: 'Shadow', meaning: 'Repressed emotions, the unknown' }],
        created_at: new Date(Date.now() - 172800000).toISOString(),
    }
];

type Tab = 'journal' | 'insights' | 'toolkit';

const DreamsPage = () => {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<Tab>('journal');
    const [dreams, setDreams] = useState<DreamEntry[]>(MOCK_DREAMS);
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

    const handleEntrySubmit = (data: any) => {
        const newEntry: DreamEntry = {
            id: Date.now().toString(),
            ...data,
            created_at: new Date().toISOString(),
            symbols: [],
            mood: 'Neutral',
            clarity: 5,
        };
        setDreams([newEntry, ...dreams]);
        showToast('Dream recorded successfully', 'success');
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-24 relative min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                <div className="space-y-2 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20"
                    >
                        <Moon className="w-3 h-3" />
                        Oneiric Archive
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                        Dream Log
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-md">
                        Explore the landscapes of your subconscious. Record, visualize, and analyze your dreams.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="p-1.5 bg-secondary/50 backdrop-blur-md rounded-2xl flex items-center gap-1 border border-white/5 overflow-x-auto max-w-full">
                    {[
                        { id: 'journal', icon: BookOpen, label: 'Journal' },
                        { id: 'insights', icon: BarChart3, label: 'Insights' },
                        { id: 'toolkit', icon: Settings2, label: 'Toolkit' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={cn(
                                "px-4 md:px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold transition-all relative overflow-hidden whitespace-nowrap",
                                activeTab === tab.id
                                    ? "text-indigo-50 text-shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                            )}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-indigo-600 shadow-lg shadow-indigo-500/25"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'journal' && (
                    <motion.div
                        key="journal"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8 px-4 md:px-0"
                    >
                        {/* Quick Capture Bar */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <motion.button
                                onClick={() => setIsEntryModalOpen(true)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="col-span-1 lg:col-span-1 p-1 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 p-[1px] group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                                <div className="h-full bg-background/80 backdrop-blur-xl rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center space-y-4 relative z-10">
                                    <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                                        <Plus className="w-8 h-8 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl text-foreground">New Dream Entry</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Record the details before they fade.</p>
                                    </div>
                                </div>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="col-span-1 lg:col-span-1 glass-card p-8 flex flex-col items-center justify-center text-center space-y-4 group hover:border-emerald-500/30"
                            >
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                    <Mic className="w-8 h-8 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl text-foreground">Voice Capture</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Speak your dream instantly.</p>
                                </div>
                            </motion.button>

                            <GlassCard className="col-span-1 lg:col-span-1 hidden lg:flex flex-col justify-center p-8 space-y-4 bg-gradient-to-br from-indigo-900/10 to-transparent">
                                <div className="flex items-center gap-3 mb-2">
                                    <Sparkles className="w-5 h-5 text-yellow-400" />
                                    <h3 className="font-black text-lg text-foreground">Lucidity Tip</h3>
                                </div>
                                <p className="text-sm text-muted-foreground font-medium italic">
                                    "Perform a reality check: Look at your hands. Do they look normal? Count your fingers."
                                </p>
                            </GlassCard>
                        </div>

                        {/* Recent Dreams Grid */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-black text-foreground px-2">Recent Voyages</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {dreams.map((dream) => (
                                    <DreamCard key={dream.id} entry={dream} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}



                {activeTab === 'insights' && (
                    <motion.div
                        key="insights"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <DreamInsights dreams={dreams} />
                    </motion.div>
                )}

                {activeTab === 'toolkit' && (
                    <motion.div
                        key="toolkit"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <LucidToolkit />
                    </motion.div>
                )}
            </AnimatePresence>

            <DreamEntryModal
                isOpen={isEntryModalOpen}
                onClose={() => setIsEntryModalOpen(false)}
                onSubmit={handleEntrySubmit}
            />
        </div>
    );
};

export default DreamsPage;
