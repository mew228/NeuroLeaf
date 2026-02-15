'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Play, Square, Pause } from 'lucide-react';

const PHASES = [
    { name: 'Inhale', duration: 4000, scale: 1.5, opacity: 0.8, color: '#10b981' }, // Emerald-500
    { name: 'Hold', duration: 4000, scale: 1.5, opacity: 0.8, color: '#34d399' },   // Emerald-400
    { name: 'Exhale', duration: 4000, scale: 1.0, opacity: 0.4, color: '#059669' }, // Emerald-600
    { name: 'Hold', duration: 4000, scale: 1.0, opacity: 0.4, color: '#047857' }    // Emerald-700
];

const FocusStream = () => {
    const [active, setActive] = useState(false);
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(PHASES[0].duration / 1000);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (active) {
            const currentPhase = PHASES[phaseIndex];

            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setPhaseIndex((prevIndex) => (prevIndex + 1) % PHASES.length);
                        return PHASES[(phaseIndex + 1) % PHASES.length].duration / 1000;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            setPhaseIndex(0);
            setTimeLeft(PHASES[0].duration / 1000);
        }

        return () => clearInterval(interval);
    }, [active, phaseIndex]);

    const toggle = () => setActive(!active);

    const currentPhase = PHASES[phaseIndex];

    return (
        <div className="w-full h-full min-h-[400px] flex flex-col bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-3xl overflow-hidden shadow-2xl relative">
            {/* HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-20">
                <div className="flex justify-between items-start">
                    <div className="text-[10px] font-mono text-emerald-500/50">
                        BIO_METRIC_SYNC<br />
                        STATUS: {active ? 'ACTIVE' : 'STANDBY'}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-500/50 text-right">
                        FREQ: 0.1Hz<br />
                        PROTOCOL: BOX_BREATHE
                    </div>
                </div>
                <div className="flex justify-between items-end">
                    <div className="w-16 h-1 bg-emerald-500/10 relative overflow-hidden">
                        <div className={`absolute inset-0 bg-emerald-500/50 w-full animate-[shimmer_2s_infinite] ${active ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                    <div className="text-[10px] font-mono text-emerald-500/30">
                        SYS_READY
                    </div>
                </div>
            </div>

            {/* Central Visualizer */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />

                <AnimatePresence mode="wait">
                    {active ? (
                        <div className="relative flex items-center justify-center">
                            {/* Rotating Rings */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute w-[300px] h-[300px] border border-emerald-500/10 rounded-full border-dashed"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute w-[250px] h-[250px] border border-emerald-500/10 rounded-full border-dotted"
                            />

                            {/* Breathing Core */}
                            <motion.div
                                animate={{
                                    scale: currentPhase.scale,
                                    borderColor: currentPhase.color,
                                    boxShadow: `0 0 40px ${currentPhase.color}40`,
                                }}
                                transition={{ duration: currentPhase.duration / 1000, ease: "easeInOut" }}
                                className="w-48 h-48 rounded-full border-2 bg-emerald-950/50 backdrop-blur-sm relative z-10 flex items-center justify-center"
                            >
                                <motion.div
                                    key={currentPhase.name}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.2 }}
                                    className="text-center"
                                >
                                    <h3 className="text-2xl font-black font-mono text-emerald-100 tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                                        {currentPhase.name}
                                    </h3>
                                    <div className="text-4xl font-mono text-emerald-500 font-bold mt-1">
                                        {Math.ceil(timeLeft)}
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="relative z-10 text-center">
                            <div className="w-24 h-24 mx-auto bg-black/50 border border-emerald-500/30 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                <Wind className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-black font-mono text-emerald-500 tracking-tight mb-1">FOCUS_FLOW</h3>
                            <p className="text-xs font-mono text-emerald-500/50 uppercase tracking-widest">Awaiting Input Signal</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center z-30">
                <button
                    onClick={toggle}
                    className="group relative px-8 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/50 rounded-full backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                >
                    <div className="flex items-center gap-3">
                        {active ? (
                            <>
                                <Pause className="w-4 h-4 text-emerald-500 fill-current" />
                                <span className="text-xs font-mono font-bold text-emerald-500">PAUSE_SEQUENCE</span>
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 text-emerald-500 fill-current" />
                                <span className="text-xs font-mono font-bold text-emerald-500">INITIATE_SYNC</span>
                            </>
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
};

export default FocusStream;
