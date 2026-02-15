'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, RefreshCw, AlertTriangle, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

const BIASES = [
    { name: 'Catastrophizing', description: 'Expecting the worst possible scenario to happen.' },
    { name: 'All-or-Nothing', description: 'Viewing situations in only two categories instead of on a continuum.' },
    { name: 'Filtering', description: 'Focusing entirely on negative elements while ignoring positives.' },
    { name: 'Mind Reading', description: 'Believing you know what others are thinking, usually negative.' }
];

const REFRAMES = [
    "What evidence do I have that supports this thought? What evidence contradicts it?",
    "Is there a more balanced way to look at this situation?",
    "What would I tell a friend who was thinking this way?",
    "Will this matter in a week, a month, or a year?",
    "Am I underestimating my ability to cope with this?"
];

const ReframingTool = () => {
    const [thought, setThought] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<{ bias: typeof BIASES[0], reframe: string } | null>(null);

    const handleAnalyze = () => {
        if (!thought.trim()) return;

        setAnalyzing(true);
        setResult(null);

        // Simulate AI Analysis
        setTimeout(() => {
            const randomBias = BIASES[Math.floor(Math.random() * BIASES.length)];
            const randomReframe = REFRAMES[Math.floor(Math.random() * REFRAMES.length)];

            setResult({
                bias: randomBias,
                reframe: randomReframe
            });
            setAnalyzing(false);
        }, 2000);
    };

    const reset = () => {
        setThought('');
        setResult(null);
    };

    return (
        <div className="w-full h-full flex flex-col bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
            {/* Header / Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/10 bg-emerald-950/10">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <h2 className="text-sm font-mono font-bold text-emerald-500 tracking-widest uppercase">
                        NEURAL_REFRAME_PROTOCOL_V1.0
                    </h2>
                </div>
                <Brain className="w-4 h-4 text-emerald-500/50" />
            </div>

            <div className="flex-1 p-6 relative overflow-y-auto custom-scrollbar">
                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(16,185,129,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full flex flex-col gap-6 relative z-10"
                        >
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono text-emerald-500/60 uppercase tracking-widest">
                                    // INPUT_DISTORTION_PATTERN
                                </label>
                                <textarea
                                    value={thought}
                                    onChange={(e) => setThought(e.target.value)}
                                    placeholder="> DESCRIBE NEGATIVE THOUGHT SEQUENCE..."
                                    className="w-full h-32 bg-black/50 border border-emerald-500/20 rounded-xl p-6 text-lg font-mono text-emerald-50 focus:outline-none focus:border-emerald-500/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all resize-none placeholder:text-emerald-500/20 leading-relaxed"
                                />
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={!thought.trim() || analyzing}
                                className="w-full group relative overflow-hidden bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-mono font-bold py-4 rounded-xl transition-all"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <div className="relative flex items-center justify-center gap-3">
                                    {analyzing ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            <span>PROCESSING_NEURAL_DATA...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            <span>INITIATE_ANALYSIS</span>
                                        </>
                                    )}
                                </div>
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="h-full flex flex-col gap-6 relative z-10"
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-50">
                                        <AlertTriangle className="w-12 h-12 text-rose-500/10" />
                                    </div>
                                    <div className="text-[10px] font-mono text-rose-500 uppercase tracking-widest mb-2">
                                        ! DETECTED_BIAS_ERROR
                                    </div>
                                    <h3 className="font-mono font-bold text-rose-200 text-lg mb-1">{result.bias.name}</h3>
                                    <p className="text-xs font-mono text-rose-300/70 leading-relaxed">
                                        {result.bias.description}
                                    </p>
                                </div>

                                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-5">
                                    <div className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest mb-2">
                                        ✓ CORRECTION_STRATEGY
                                    </div>
                                    <h3 className="font-mono font-bold text-emerald-100 text-lg mb-1">Challenge Logic</h3>
                                    <p className="text-xs font-mono text-emerald-400/70 leading-relaxed">
                                        Apply rigorous logic to dismantle the distortion.
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 bg-black/30 border border-emerald-500/20 rounded-xl p-6 relative group">
                                <div className="text-[10px] font-mono text-emerald-500/60 uppercase tracking-widest mb-3">
                                    REFRAMED_OUTPUT_SEQUENCE
                                </div>
                                <p className="text-xl md:text-2xl font-mono text-emerald-100 leading-relaxed">
                                    <span className="text-emerald-500 mr-2">&gt;</span>
                                    {result.reframe}
                                    <span className="animate-pulse ml-1 text-emerald-500">_</span>
                                </p>
                            </div>

                            <button
                                onClick={reset}
                                className="w-full border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-500 font-mono font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>RESET_PROTOCOL</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ReframingTool;
