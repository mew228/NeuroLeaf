'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BookOpen, Clock, Moon, CheckCircle2, ChevronDown, ChevronUp, Fingerprint } from 'lucide-react';
import GlassCard from '../common/GlassCard';

const TECHNIQUES = [
    {
        id: 'mild',
        title: 'Mnemonic Induction (MILD)',
        description: 'Set an intention to remember that you are dreaming before falling asleep.',
        steps: [
            'Recall a recent dream in detail.',
            'Identify a "dreamsign" (something odd).',
            'Visualize yourself becoming lucid in that dream.',
            'Repeat "Next time I\'m dreaming, I will remember I\'m dreaming."'
        ]
    },
    {
        id: 'wbtb',
        title: 'Wake Back To Bed (WBTB)',
        description: 'Wake up after 5-6 hours of sleep, stay up for a bit, then go back to sleep.',
        steps: [
            'Set an alarm for 5-6 hours after bedtime.',
            'Stay awake for 20-60 minutes (read about lucid dreaming).',
            'Go back to sleep with the intention to lucid dream.',
            'Perform MILD technique as you drift off.'
        ]
    },
    {
        id: 'wild',
        title: 'Wake Induced (WILD)',
        description: 'Transition directly from wakefulness into a dream state while keeping consciousness intact.',
        steps: [
            'Lie down comfortably and relax completely.',
            'Observe hypnagogic imagery (colors/shapes behind eyelids).',
            'Stay passive and detached as the imagery forms a scene.',
            'Enter the dream scene without losing awareness.'
        ]
    }
];

const LucidToolkit = () => {
    const [expandedTechnique, setExpandedTechnique] = useState<string | null>(null);
    const [realityCheckPassed, setRealityCheckPassed] = useState(false);
    const [reminders, setReminders] = useState({
        realityCheck: true,
        wbtb: false,
        journal: true
    });

    const performRealityCheck = () => {
        setRealityCheckPassed(true);
        setTimeout(() => setRealityCheckPassed(false), 3000);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Reality Check Interactive */}
            <GlassCard className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col items-center justify-center space-y-4 py-8 text-center">
                    <h2 className="text-2xl font-black text-foreground">Are You Dreaming?</h2>
                    <p className="text-muted-foreground max-w-sm">
                        Perform a reality check now. Look at your hands, try to push a finger through your palm, or read some text twice.
                    </p>
                    <motion.button
                        onClick={performRealityCheck}
                        whileTap={{ scale: 0.95 }}
                        className={`px-8 py-4 rounded-2xl font-black text-lg shadow-lg transition-all flex items-center gap-2 ${realityCheckPassed
                                ? 'bg-emerald-500 text-white shadow-emerald-500/25'
                                : 'bg-indigo-600 text-white shadow-indigo-500/25 hover:bg-indigo-700'
                            }`}
                    >
                        {realityCheckPassed ? (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                Reality Confirmed
                            </>
                        ) : (
                            <>
                                <Fingerprint className="w-5 h-5" />
                                Perform Check
                            </>
                        )}
                    </motion.button>
                </div>
            </GlassCard>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Reminders Settings */}
                <GlassCard>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                            <Bell className="w-5 h-5" />
                        </div>
                        <h3 className="font-black text-lg text-foreground">Lucidity Alerts</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { id: 'realityCheck', label: 'Reality Checks', desc: 'Hourly reminders during the day' },
                            { id: 'wbtb', label: 'WBTB Alarm', desc: 'Wake up after 6 hours of sleep' },
                            { id: 'journal', label: 'Journal Prompt', desc: 'Morning notification to record dreams' }
                        ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-white/5">
                                <div>
                                    <div className="font-bold text-foreground">{item.label}</div>
                                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                                </div>
                                <button
                                    onClick={() => setReminders(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof reminders] }))}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${reminders[item.id as keyof typeof reminders] ? 'bg-emerald-500' : 'bg-secondary'
                                        }`}
                                >
                                    <motion.div
                                        initial={false}
                                        animate={{ x: reminders[item.id as keyof typeof reminders] ? 26 : 2 }}
                                        className="w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5"
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Techniques Guide */}
                <GlassCard>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <h3 className="font-black text-lg text-foreground">Techniques</h3>
                    </div>
                    <div className="space-y-3">
                        {TECHNIQUES.map((tech) => (
                            <div key={tech.id} className="rounded-xl overflow-hidden border border-white/5 bg-secondary/20">
                                <button
                                    onClick={() => setExpandedTechnique(expandedTechnique === tech.id ? null : tech.id)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-bold text-sm text-foreground">{tech.title}</span>
                                    {expandedTechnique === tech.id ? (
                                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </button>
                                <AnimatePresence>
                                    {expandedTechnique === tech.id && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: 'auto' }}
                                            exit={{ height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4 pt-0 text-sm text-muted-foreground space-y-2 border-t border-white/5">
                                                <p>{tech.description}</p>
                                                <ul className="list-disc list-inside space-y-1 pl-2">
                                                    {tech.steps.map((step, i) => (
                                                        <li key={i}>{step}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default LucidToolkit;
