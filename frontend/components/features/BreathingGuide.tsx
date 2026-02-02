'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Pause, Play, Minimize2, Maximize2 } from 'lucide-react';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'paused';

interface BreathingGuideProps {
    compact?: boolean;
}

const PHASE_DURATIONS = {
    inhale: 4000,
    hold: 7000,
    exhale: 8000,
};

const PHASE_LABELS = {
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out',
    paused: 'Paused',
};

const BreathingGuide: React.FC<BreathingGuideProps> = ({ compact: initialCompact = false }) => {
    const [phase, setPhase] = useState<BreathPhase>('paused');
    const [isPlaying, setIsPlaying] = useState(false);
    const [compact, setCompact] = useState(initialCompact);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const progressRef = useRef<NodeJS.Timeout | null>(null);

    const getNextPhase = useCallback((currentPhase: BreathPhase): BreathPhase => {
        switch (currentPhase) {
            case 'inhale': return 'hold';
            case 'hold': return 'exhale';
            case 'exhale': return 'inhale';
            default: return 'inhale';
        }
    }, []);

    const startPhase = useCallback((newPhase: BreathPhase) => {
        if (newPhase === 'paused') return;

        setPhase(newPhase);
        setProgress(0);

        const duration = PHASE_DURATIONS[newPhase];
        const startTime = Date.now();

        // Progress updater - reduced frequency for performance
        if (progressRef.current) clearInterval(progressRef.current);
        progressRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min(elapsed / duration, 1);
            setProgress(newProgress);
        }, 50); // 20fps for progress is plenty, avoids main thread lag

        // Phase transition
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            if (progressRef.current) clearInterval(progressRef.current);
            startPhase(getNextPhase(newPhase));
        }, duration);
    }, [getNextPhase]);

    const togglePlayPause = useCallback(() => {
        if (isPlaying) {
            setIsPlaying(false);
            setPhase('paused');
            setProgress(0);
            if (timerRef.current) clearTimeout(timerRef.current);
            if (progressRef.current) clearInterval(progressRef.current);
        } else {
            setIsPlaying(true);
            startPhase('inhale');
        }
    }, [isPlaying, startPhase]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (progressRef.current) clearInterval(progressRef.current);
        };
    }, []);

    const getScaleValue = () => {
        if (!isPlaying) return 1;
        switch (phase) {
            case 'inhale': return 1 + progress * 0.3;
            case 'hold': return 1.3;
            case 'exhale': return 1.3 - progress * 0.3;
            default: return 1;
        }
    };

    const getGlowIntensity = () => {
        if (!isPlaying) return 0.2;
        switch (phase) {
            case 'inhale': return 0.2 + progress * 0.6;
            case 'hold': return 0.8;
            case 'exhale': return 0.8 - progress * 0.6;
            default: return 0.2;
        }
    };

    if (compact) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-4 rounded-2xl flex items-center gap-4 cursor-pointer group"
                onClick={() => setCompact(false)}
            >
                <div className="relative w-10 h-10">
                    <motion.div
                        className="absolute inset-0 rounded-full bg-emerald-500/20"
                        animate={{ scale: isPlaying ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Wind className="w-5 h-5 text-emerald-400" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Neural Breathing</span>
                    <p className="text-[10px] text-muted-foreground truncate">
                        {isPlaying ? PHASE_LABELS[phase] : 'Tap to expand'}
                    </p>
                </div>
                <Maximize2 className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 md:p-8 rounded-[2rem] relative overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Wind className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="font-black text-sm text-foreground">Neural Pulse</h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">4-7-8 Breathing</p>
                    </div>
                </div>
                <button
                    onClick={() => setCompact(true)}
                    className="p-2 rounded-xl hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
                >
                    <Minimize2 className="w-4 h-4" />
                </button>
            </div>

            {/* Breathing Circle */}
            <div className="flex flex-col items-center justify-center py-8">
                <div className="relative w-40 h-40 md:w-48 md:h-48">
                    {/* Outer glow rings */}
                    {[0.8, 0.6, 0.4].map((opacity, i) => (
                        <motion.div
                            key={i}
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: `radial-gradient(circle, transparent 60%, rgba(16, 185, 129, ${getGlowIntensity() * opacity}) 100%)`,
                                transform: `scale(${1 + i * 0.15})`,
                            }}
                            animate={{
                                opacity: isPlaying ? [0.5, 1, 0.5] : 0.3,
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.3,
                                ease: "easeInOut",
                            }}
                        />
                    ))}

                    {/* Main breathing circle */}
                    <motion.div
                        className="absolute inset-4 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/20 border border-emerald-500/30"
                        animate={{
                            scale: getScaleValue(),
                        }}
                        transition={{
                            duration: 0.1,
                            ease: "linear",
                        }}
                        style={{
                            boxShadow: `0 0 40px rgba(16, 185, 129, 0.2)`,
                            willChange: 'transform',
                        }}
                    />

                    {/* Inner circle with text */}
                    <motion.div
                        className="absolute inset-8 rounded-full bg-emerald-950/60 backdrop-blur-xl flex flex-col items-center justify-center border border-emerald-500/20"
                        animate={{ scale: getScaleValue() * 0.95 }}
                        transition={{ duration: 0.05, ease: "linear" }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={phase}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-lg md:text-xl font-black text-emerald-400"
                            >
                                {PHASE_LABELS[phase]}
                            </motion.span>
                        </AnimatePresence>
                        {isPlaying && phase !== 'paused' && (
                            <span className="text-xs text-muted-foreground mt-1">
                                {Math.ceil((PHASE_DURATIONS[phase] / 1000) * (1 - progress))}s
                            </span>
                        )}
                    </motion.div>
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-xs mt-8">
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                            style={{ width: `${progress * 100}%` }}
                            transition={{ duration: 0.05, ease: "linear" }}
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 mt-6">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={togglePlayPause}
                        className={`px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all duration-300 ${isPlaying
                            ? 'bg-white/5 text-foreground hover:bg-white/10'
                            : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600'
                            }`}
                    >
                        {isPlaying ? (
                            <>
                                <Pause className="w-4 h-4" />
                                Pause
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4" />
                                Start Session
                            </>
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Info */}
            <div className="text-center mt-4">
                <p className="text-xs text-muted-foreground">
                    The 4-7-8 technique helps reduce anxiety and promotes relaxation
                </p>
            </div>
        </motion.div>
    );
};

export default BreathingGuide;
